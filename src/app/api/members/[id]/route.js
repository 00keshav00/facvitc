import dbConnect from '@/lib/db';
import Member from '@/models/Member';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const updatedMember = await Member.findByIdAndUpdate(id, body, { new: true });
    if (!updatedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Member deleted' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
