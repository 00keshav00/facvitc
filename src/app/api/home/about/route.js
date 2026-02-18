import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne() || {};
    return NextResponse.json(home.about || {});
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Fetch the existing document to get the current 'about' object
    const home = await Home.findOne() || {};
    const existingAbout = home.about || {};

    // Merge the existing data with the new body
    const updatedAbout = { ...existingAbout, ...body };

    const updatedHome = await Home.findOneAndUpdate(
      {},
      { $set: { about: updatedAbout } },
      { new: true, upsert: true, runValidators: false }
    );
    return NextResponse.json(updatedHome.about);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
