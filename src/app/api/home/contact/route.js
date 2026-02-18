import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne() || {};
    return NextResponse.json(home.contact || {});
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
    const existingContact = home.contact || {};

    const updatedContact = { ...existingContact, ...body };

    const updatedHome = await Home.findOneAndUpdate(
      {}, 
      { $set: { contact: updatedContact } }, 
      { new: true, upsert: true }
    );
    return NextResponse.json(updatedHome.contact);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
