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
