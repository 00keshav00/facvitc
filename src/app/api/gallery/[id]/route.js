import { del } from '@vercel/blob';
import dbConnect from '@/lib/db';
import GalleryItem from '@/models/Gallery';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const item = await GalleryItem.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(item);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const item = await GalleryItem.findByIdAndDelete(id);
    if (item && item.image) {
      await del(item.image).catch(err => console.error('Failed to delete blob:', err));
    }
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
