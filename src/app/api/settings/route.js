import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const settings = await Setting.findOne() || {};
    return NextResponse.json(settings);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const settings = await Setting.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
