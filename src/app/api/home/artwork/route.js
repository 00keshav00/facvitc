import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne() || {};
    return NextResponse.json(home.artworkOfTheWeek || {});
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  console.log('--- Artwork PUT Request Received ---');
  try {
    await dbConnect();
    const body = await req.json();
    console.log('Request Body:', JSON.stringify(body, null, 2));
    
    const home = await Home.findOne() || {};
    const existingArtwork = home.artworkOfTheWeek || {};
    console.log('Existing Artwork:', JSON.stringify(existingArtwork, null, 2));

    const updatedArtwork = { ...existingArtwork, ...body };
    console.log('Updated Artwork (Merged):', JSON.stringify(updatedArtwork, null, 2));

    const updatedHome = await Home.findOneAndUpdate(
      {}, 
      { $set: { artworkOfTheWeek: updatedArtwork } },
      { new: true, upsert: true }
    );
    console.log('Database Update Result:', JSON.stringify(updatedHome.artworkOfTheWeek, null, 2));
    
    return NextResponse.json(updatedHome.artworkOfTheWeek);
  } catch (error) {
    console.error('API Error in Artwork PUT:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
