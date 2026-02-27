import { list, copy } from '@vercel/blob';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is not defined.');
  process.exit(1);
}

async function updateHeaders() {
  try {
    console.log('Fetching all blobs...');
    let allBlobs = [];
    let hasMore = true;
    let cursor;

    while (hasMore) {
      const listResult = await list({ cursor, limit: 1000 });
      allBlobs.push(...listResult.blobs);
      hasMore = listResult.hasMore;
      cursor = listResult.cursor;
    }

    console.log(`Found ${allBlobs.length} blobs. Updating headers...`);

    for (const blob of allBlobs) {
      console.log(`Updating: ${blob.pathname}`);
      try {
        // Copy the blob to itself with the new cache header
        await copy(blob.url, blob.pathname, {
          access: 'public',
          cacheControlMaxAge: 31536000, // 1 year
        });
      } catch (err) {
        console.error(`Failed to update ${blob.pathname}:`, err.message);
      }
    }

    console.log('Finished updating all headers.');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateHeaders();
