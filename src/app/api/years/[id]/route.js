import dbConnect from '@/lib/db';
import LeadYear from '@/models/LeadYear';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    await LeadYear.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Year deleted' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to delete year' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const updatedYear = await LeadYear.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedYear);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update year' }, { status: 500 });
  }
}
