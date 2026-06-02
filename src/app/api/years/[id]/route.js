import dbConnect from '@/lib/db';
import LeadYear from '@/models/LeadYear';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    await LeadYear.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Year deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete year' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await req.json();
    const updatedYear = await LeadYear.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedYear);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update year' }, { status: 500 });
  }
}
