import dbConnect from '@/lib/db';
import PageContent from '@/models/PageContent';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 'home';

  try {
    const content = await PageContent.findOne({ page });
    return NextResponse.json(content || { page });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const page = body.page || 'home';
    const content = await PageContent.findOneAndUpdate(
      { page },
      body,
      { new: true, upsert: true } // Create if not exists
    );
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
