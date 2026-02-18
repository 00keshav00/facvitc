import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

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

  try {
    const filename = Date.now() + '_' + file.name.replaceAll(" ", "_");
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      message: 'Success', 
      url: blob.url 
    });
  } catch (error) {
    console.log('Error occured ', error);
    return NextResponse.json({ message: 'Failed', status: 500 });
  }
}
