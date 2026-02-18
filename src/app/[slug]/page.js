import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import PageContent from '@/models/PageContent';
import EventYear from '@/models/Event';
import TimelinePage from '@/components/TimelinePage';

export async function generateMetadata({ params }) {
  await dbConnect();
  const { slug } = await params;
  
  const typeMap = {
    'techno': 'TechnoVit',
    'vibrance': 'Vibrance',
    'workshops': 'Workshops'
  };

  const eventType = typeMap[slug];
  if (eventType) {
    return { title: `${eventType} - FAC` };
  }

  const page = await PageContent.findOne({ page: slug });
  if (page) {
    return { title: `${page.page.charAt(0).toUpperCase() + page.page.slice(1)} - FAC` };
  }

  return { title: 'Page Not Found - FAC' };
}

export default async function DynamicPage({ params }) {
  await dbConnect();
  const { slug } = await params;
  
  const typeMap = {
    'techno': 'TechnoVit',
    'vibrance': 'Vibrance',
    'workshops': 'Workshops'
  };

  const eventType = typeMap[slug];
  
  if (eventType) {
    // Fetch years for this event type
    const years = await EventYear.find({ eventType, enabled: true }).sort({ year: -1 }).lean();
    if (years.length > 0) {
      // Transform new EventYear structure to match what TimelinePage expects (Legacy PageContent format)
      const data = {
        page: slug,
        timeline: years.map(y => ({
          year: y.year,
          title: y.title,
          images: [y.bannerMedia].filter(Boolean),
          blocks: y.sections.map(s => ({
            title: s.title,
            description: s.description,
            images: [s.mainImage, ...(s.subImages || [])].filter(Boolean)
          }))
        }))
      };
      return <TimelinePage data={JSON.parse(JSON.stringify(data))} />;
    }
  }

  const pageContent = await PageContent.findOne({ page: slug });
  if (pageContent) {
    return <TimelinePage data={JSON.parse(JSON.stringify(pageContent))} />;
  }

  notFound();
}
