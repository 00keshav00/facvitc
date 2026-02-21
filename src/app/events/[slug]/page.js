import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import EventYear from '@/models/Event';
import TimelinePage from '@/components/TimelinePage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  await dbConnect();
  const { slug } = await params;
  
  const typeMap = {
    'technovit': 'TechnoVit',
    'vibrance': 'Vibrance',
    'wall-painting': 'Wall Painting',
    'others': 'Workshops'
  };

  const eventType = typeMap[slug.toLowerCase()];
  if (eventType) {
    return { title: `${eventType} - FAC` };
  }

  return { title: 'Event Not Found - FAC' };
}

export default async function EventPage({ params }) {
  await dbConnect();
  const { slug } = await params;
  
  const typeMap = {
    'technovit': 'TechnoVit',
    'vibrance': 'Vibrance',
    'wall-painting': 'Wall Painting',
    'others': 'Workshops'
  };

  const eventType = typeMap[slug.toLowerCase()];
  
  if (!eventType) {
    notFound();
  }

  // Fetch years for this event type
  const years = await EventYear.find({ eventType, enabled: true }).sort({ year: -1 }).lean();
  
  if (years.length === 0) {
    // Return empty timeline if no data found yet
    const emptyData = {
      page: slug,
      timeline: []
    };
    return <TimelinePage data={JSON.parse(JSON.stringify(emptyData))} />;
  }

  // Transform new EventYear structure to match what TimelinePage expects
  const data = {
    page: slug,
    timeline: years.map(y => ({
      year: y.year,
      title: y.title,
      description: y.description, // Include the description here
      images: [y.bannerMedia].filter(Boolean),
      blocks: y.sections.map(s => ({
        title: s.title,
        description: s.description,
        images: [s.mainImage, ...(s.subImages || [])].filter(Boolean),
        template: s.layout // Map layout to template
      }))
    }))
  };

  return <TimelinePage data={JSON.parse(JSON.stringify(data))} />;
}
