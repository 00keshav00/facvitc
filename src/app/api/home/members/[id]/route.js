import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const home = await Home.findOneAndUpdate(
      {},
      { $pull: { membersPreview: { _id: id } } },
      { new: true }
    );
    return NextResponse.json(home.membersPreview);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
