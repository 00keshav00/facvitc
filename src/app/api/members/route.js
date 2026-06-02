import dbConnect from '@/lib/db';
import Member from '@/models/Member';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const year = searchParams.get('year');
  
  const query = {};
  if (type) query.type = type;
  if (year) query.year = year;

  try {
    const members = await Member.find(query).sort({ order: 1 });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const member = await Member.create(body);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}
