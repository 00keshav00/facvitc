import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: '.env' });
}

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const MB = 1024 * 1024;

async function run() {
  if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not found. Please ensure your .env or .env.local has it.");
      process.exit(1);
  }
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB successfully.');

  if (!fs.existsSync(uploadsDir)) {
      console.log("No uploads directory found. Exiting.");
      process.exit(0);
  }

  const files = fs.readdirSync(uploadsDir);
  const replacements = {}; 

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    // Process only large images
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.size > MB) {
        console.log(`Compressing ${file} (${(stats.size / MB).toFixed(2)} MB)...`);
        const baseName = path.basename(file, ext);
        const newFileName = `${baseName}.webp`;
        const newFilePath = path.join(uploadsDir, newFileName);

        try {
          // Resize (max width 1200) and convert to WebP
          await sharp(filePath)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(newFilePath);

          const oldUrl = `/uploads/${file}`;
          const newUrl = `/uploads/${newFileName}`;
          replacements[oldUrl] = newUrl;
        } catch (err) {
          console.error(`Error processing ${file}:`, err.message);
        }
      }
    }
  }

  console.log(`Found and compressed ${Object.keys(replacements).length} files. Starting database update...`);

  if (Object.keys(replacements).length > 0) {
    const db = mongoose.connection.db;
    const collections = await db.collections();

    for (const collection of collections) {
      const docs = await collection.find({}).toArray();
      let updatedCount = 0;

      for (const doc of docs) {
        let hasModifications = false;
        
        // Recursively replace the URLs in the document
        const replaceInObj = (obj) => {
          if (!obj) return;
          for (const key in obj) {
            if (typeof obj[key] === 'string') {
              for (const [oldUrl, newUrl] of Object.entries(replacements)) {
                if (obj[key] === oldUrl || obj[key].includes(oldUrl)) {
                  obj[key] = obj[key].split(oldUrl).join(newUrl);
                  hasModifications = true;
                }
              }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              // Skip MongoDB specific object types like ObjectId or Date to prevent corruption
              if (obj[key]._bsontype || obj[key] instanceof Date) {
                  continue;
              }
              replaceInObj(obj[key]);
            }
          }
        };

        replaceInObj(doc);

        if (hasModifications) {
          await collection.replaceOne({ _id: doc._id }, doc);
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        console.log(`Updated ${updatedCount} documents in collection: ${collection.collectionName}`);
      }
    }

    console.log('Cleaning up old uncompressed files...');
    for (const oldUrl of Object.keys(replacements)) {
       const filePath = path.join(process.cwd(), 'public', oldUrl);
       if (fs.existsSync(filePath)) {
           fs.unlinkSync(filePath);
           console.log(`Deleted: ${oldUrl}`);
       }
    }
  }

  await mongoose.disconnect();
  console.log('All operations completed successfully.');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
