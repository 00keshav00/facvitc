import { list, del } from '@vercel/blob';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined.');
  process.exit(1);
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is not defined.');
  process.exit(1);
}

// Ensure database connection
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

// Function to recursively find strings starting with public.blob.vercel-storage.com
function findBlobUrls(obj, urls = new Set()) {
  if (typeof obj === 'string' && obj.includes('public.blob.vercel-storage.com')) {
    urls.add(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach(item => findBlobUrls(item, urls));
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(val => findBlobUrls(val, urls));
  }
  return urls;
}

async function cleanup() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database.');

    // Get all collections in the database
    const db = mongoose.connection.db;
    const collections = await db.collections();
    
    let activeUrls = new Set();

    console.log(`Found ${collections.length} collections. Extracting URLs...`);
    for (let collection of collections) {
      const documents = await collection.find({}).toArray();
      documents.forEach(doc => {
        findBlobUrls(doc, activeUrls);
      });
    }

    console.log(`Found ${activeUrls.size} active Vercel Blob URLs in the database.`);

    console.log('Fetching all files from Vercel Blob Storage...');
    let allBlobs = [];
    let hasMore = true;
    let cursor;

    while (hasMore) {
      const listResult = await list({
        cursor,
        limit: 1000,
      });
      allBlobs.push(...listResult.blobs);
      hasMore = listResult.hasMore;
      cursor = listResult.cursor;
      console.log(`Fetched ${allBlobs.length} blobs so far...`);
    }

    console.log(`Total blobs in storage: ${allBlobs.length}`);

    // Find orphaned blobs
    const orphanedBlobs = allBlobs.filter(blob => !activeUrls.has(blob.url));

    console.log(`Found ${orphanedBlobs.length} orphaned blobs that are not referenced in the database.`);

    let totalSize = 0;
    orphanedBlobs.forEach(b => totalSize += b.size);
    console.log(`Total space to be freed: ${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`);

    if (orphanedBlobs.length === 0) {
      console.log('No orphaned files found. Exiting.');
      process.exit(0);
    }

    console.log('Starting deletion of orphaned blobs...');
    
    // Delete in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < orphanedBlobs.length; i += batchSize) {
      const batch = orphanedBlobs.slice(i, i + batchSize);
      const urlsToDelete = batch.map(b => b.url);
      
      try {
         await del(urlsToDelete);
         console.log(`Deleted batch ${i / batchSize + 1}/${Math.ceil(orphanedBlobs.length / batchSize)}`);
      } catch (err) {
         console.error(`Failed to delete batch ${i / batchSize + 1}`, err);
      }
    }

    console.log('Cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();
