import dbConnect from '@/lib/db';
import Home from '@/models/Home';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const home = await Home.findOne() || {};
    return NextResponse.json(home.membersPreview || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const home = await Home.findOneAndUpdate(
      {}, 
      { $push: { membersPreview: body } }, 
      { new: true, upsert: true }
    );
    return NextResponse.json(home.membersPreview);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// For reordering or full update
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json(); // Array of members from frontend
    
    const home = await Home.findOne() || new Home();
    const currentMembers = home.membersPreview || [];

    // Extract the incoming faculty and leads
    const incomingFaculty = body.find(m => m.isFaculty);
    const incomingLeads = body.filter(m => !m.isFaculty);

    // Find existing faculty in DB to preserve image if needed
    const existingFaculty = currentMembers.find(m => m.isFaculty);

    let finalFaculty = null;

    if (incomingFaculty) {
        finalFaculty = {
            ...incomingFaculty,
            image: (incomingFaculty.image && incomingFaculty.image.trim() !== '') ? incomingFaculty.image : (existingFaculty?.image || ''),
            isFaculty: true // Enforce flag
        };
    } else if (existingFaculty) {
        // If frontend didn't send faculty (e.g. only reordering leads), keep existing
        finalFaculty = existingFaculty;
    }

    // Process leads: Preserve images if not provided
    const processedLeads = incomingLeads.map(lead => {
        const existingLead = currentMembers.find(m => m._id?.toString() === lead._id || m.name === lead.name);
        return {
            ...lead,
            image: (lead.image && lead.image.trim() !== '') ? lead.image : (existingLead?.image || ''),
            isFaculty: false // Enforce flag
        };
    });

    // Reconstruct the array: Faculty always first (or preserved), then leads
    const newMembersPreview = [];
    if (finalFaculty) newMembersPreview.push(finalFaculty);
    newMembersPreview.push(...processedLeads);

    const updatedHome = await Home.findOneAndUpdate(
      {},
      { $set: { membersPreview: newMembersPreview } },
      { new: true, upsert: true, runValidators: false }
    );
    
    return NextResponse.json(updatedHome.membersPreview);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
