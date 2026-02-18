import dbConnect from '@/lib/db';
import EventYear from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const item = await EventYear.findById(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    // Explicitly handle sections to ensure they aren't lost during partial updates
    const existing = await EventYear.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updateData = {
      ...body,
      sections: body.sections || existing.sections
    };

    const item = await EventYear.findByIdAndUpdate(id, updateData, { new: true });return NextResponse.json(item);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    await EventYear.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
