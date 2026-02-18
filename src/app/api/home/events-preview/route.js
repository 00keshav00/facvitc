import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne() || {};
    return NextResponse.json(home.eventsPreview || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json(); // This is the new array of 3 cards
    
    const home = await Home.findOne() || new Home();
    
    // Merge logic: ensure we don't lose images if they aren't provided in the payload
    const updatedEventsPreview = body.map(newCard => {
      const existingCard = home.eventsPreview.find(e => e.title === newCard.title);
      if (existingCard) {
        return {
          ...newCard,
          // Preserve existing images if the payload has them as null/undefined/empty
          // But allow clearing if explicitly needed? For now, assume we want to keep them.
          imageA: (newCard.imageA && newCard.imageA.length > 0) ? newCard.imageA : existingCard.imageA,
          imageB: (newCard.imageB && newCard.imageB.length > 0) ? newCard.imageB : existingCard.imageB,
          description: newCard.description || existingCard.description,
          link: newCard.link || existingCard.link,
          _id: existingCard._id // Keep the same ID
        };
      }
      return newCard;
    });

    const updatedHome = await Home.findOneAndUpdate(
      {},
      { $set: { eventsPreview: updatedEventsPreview } },
      { new: true, upsert: true, runValidators: false }
    );
    
    return NextResponse.json(updatedHome.eventsPreview);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
