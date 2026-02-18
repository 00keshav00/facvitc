import dbConnect from '@/lib/db';
import GalleryItem from '@/models/Gallery';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const items = await GalleryItem.find(query).sort({ order: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const item = await GalleryItem.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json(); // Array of items for reordering
    if (Array.isArray(body)) {
      for (const item of body) {
        await GalleryItem.findByIdAndUpdate(item._id, { order: item.order });
      }
      return NextResponse.json({ message: 'Reordered' });
    }
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
