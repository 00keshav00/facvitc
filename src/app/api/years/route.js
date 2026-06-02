import dbConnect from '@/lib/db';
import LeadYear from '@/models/LeadYear';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const years = await LeadYear.find({}).sort({ year: -1 });
    return NextResponse.json(years);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch years' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newYear = await LeadYear.create(body);
    return NextResponse.json(newYear);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create year' }, { status: 500 });
  }
}
