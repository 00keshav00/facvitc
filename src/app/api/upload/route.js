import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import fs from 'fs';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No files received.' }, { status: 400 });
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only images and MP4 videos are allowed.' }, { status: 400 });
  }

  // Validate file size (e.g., 10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  Date.now() + '_' + file.name.replaceAll(" ", "_");
  
  // Ensure directory exists
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await writeFile(
      path.join(uploadDir, filename),
      buffer
    );
    return NextResponse.json({ 
      message: 'Success', 
      url: `/uploads/${filename}` 
    });
  } catch (error) {
    console.log('Error occured ', error);
    return NextResponse.json({ message: 'Failed', status: 500 });
  }
}
