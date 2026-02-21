import dbConnect from '@/lib/db';
import InterviewResult from '@/models/InterviewResult';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const records = await InterviewResult.find().sort({ order: 1 }).lean();
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const record = await InterviewResult.create(body);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
