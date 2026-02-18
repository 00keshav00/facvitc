import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne() || {};
    return NextResponse.json(home.hero || {});
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
    const existingHero = home.hero || {};

    const updatedHero = { ...existingHero, ...body };

    const updatedHome = await Home.findOneAndUpdate(
      {},
      { $set: { hero: updatedHero } },
      { new: true, upsert: true, runValidators: false }
    );
    return NextResponse.json(updatedHome.hero);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
