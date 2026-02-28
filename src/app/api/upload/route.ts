import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  console.log('DEBUG: BLOB_READ_WRITE_TOKEN exists?', !!process.env.BLOB_READ_WRITE_TOKEN);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided in the request.' },
        { status: 400 }
      );
    }

    // 1. Accept only image files (jpg, jpeg, png, webp)
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Convert the File to a Buffer for Sharp processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalSize = buffer.length;

    // 2, 3, 4, 5, 6, 7. Process the image with Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: 1200,              // 3. Resize to maximum width 1200px
        withoutEnlargement: true, // 5. Do not enlarge smaller images
        // 4. Preserve aspect ratio (default behavior in Sharp when only width is provided)
      })
      .webp({ quality: 80 })      // 6, 7. Convert to WebP with quality 80
      .toBuffer();
      
    const optimizedSize = optimizedBuffer.length;
    const compressionPercentage = ((originalSize - optimizedSize) / originalSize) * 100;
    console.log(`[Upload Compression] Original: ${(originalSize / 1024).toFixed(2)} KB, Optimized: ${(optimizedSize / 1024).toFixed(2)} KB. Compressed by: ${compressionPercentage.toFixed(2)}%`);

    // Extract original name and replace extension with .webp
    const originalName = file.name || 'image';
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const webpFilename = `${Date.now()}_${baseName}.webp`;

    // 8, 9. Upload ONLY the optimized WebP file to Vercel Blob
    const blob = await put(webpFilename, optimizedBuffer, {
      access: 'public',
      contentType: 'image/webp',    // 9. contentType: "image/webp"
      cacheControlMaxAge: 31536000, // 9. cacheControl: "public, max-age=31536000, immutable"
    });

    // 10. Return the optimized blob URL
    return NextResponse.json({ url: blob.url });

  } catch (error: any) {
    // 11. Proper error handling
    console.error('Image upload and processing error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during image upload.' },
      { status: 500 }
    );
  }
}
