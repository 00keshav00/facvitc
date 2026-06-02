import dbConnect from '@/lib/db';
import Member from '@/models/Member';
import { NextResponse } from 'next/server';

export async function POST() {
  await dbConnect();
  try {
    const result = await Member.deleteMany({ type: 'General' });
    return NextResponse.json({ message: `Deleted ${result.deletedCount} general members` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete general members' }, { status: 500 });
  }
}
