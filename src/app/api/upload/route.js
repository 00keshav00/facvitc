import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No files received.' }, { status: 400 });
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/ico'];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only images, .ico and MP4 videos are allowed.' }, { status: 400 });
  }

  // Validate file size (e.g., 10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
  }

  try {
    // Sanitize filename: remove special chars, spaces to underscores
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = Date.now() + '_' + safeName;
    
    // Save locally to public/uploads
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    
    const url = `/uploads/${filename}`;
    console.log(`Saved file locally: ${url}`);

    return NextResponse.json({ 
      message: 'Success', 
      url: url 
    });
  } catch (error) {
    console.log('Error occured ', error);
    return NextResponse.json({ message: 'Failed', error: error.message }, { status: 500 });
  }
}
