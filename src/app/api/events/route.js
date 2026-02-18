import dbConnect from '@/lib/db';
import EventYear from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const eventType = searchParams.get('type');
    
    const query = eventType ? { eventType } : {};
    const items = await EventYear.find(query).sort({ order: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const item = await EventYear.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
