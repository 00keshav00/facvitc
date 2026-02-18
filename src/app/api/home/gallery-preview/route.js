import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne() || {};
    return NextResponse.json(home.galleryPreview || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const home = await Home.findOne() || {};
    const existingGallery = home.galleryPreview || [];

    const updatedGallery = body.map(newItem => {
      const existingItem = existingGallery.find(item => item.title === newItem.title);
      return { ...existingItem, ...newItem };
    });

    const updatedHome = await Home.findOneAndUpdate(
      {}, 
      { $set: { galleryPreview: updatedGallery } }, 
      { new: true, upsert: true }
    );
    return NextResponse.json(updatedHome.galleryPreview);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
