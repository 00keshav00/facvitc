import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    let home = await Home.findOne();
    if (!home) {
      home = new Home();
    }
    
    // Once saved, do not allow updates (as per requirement)
    if (home.siteDesigners && home.siteDesigners.length === 4 && home.siteDesigners[0].name) {
       return NextResponse.json({ error: 'Site designers already set and cannot be modified.' }, { status: 403 });
    }

    home.siteDesigners = body;
    await home.save();
    return NextResponse.json(home.siteDesigners);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne().lean();
    return NextResponse.json(home?.siteDesigners || []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
