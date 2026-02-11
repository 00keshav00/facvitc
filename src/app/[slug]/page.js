import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import PageContent from '@/models/PageContent';
import TimelinePage from '@/components/TimelinePage';

export async function generateMetadata({ params }) {
  await dbConnect();
  const page = await PageContent.findOne({ page: params.slug });
  
  if (!page) {
    return {
      title: 'Page Not Found - FAC',
    };
  }

  return {
    title: `${page.page.charAt(0).toUpperCase() + page.page.slice(1)} - FAC`,
  };
}

export default async function DynamicPage({ params }) {
  await dbConnect();
  
  const pageContent = await PageContent.findOne({ page: params.slug });

  if (!pageContent) {
    notFound();
  }

  // Serialize the data to pass to client component
  const serializedContent = JSON.parse(JSON.stringify(pageContent));

  return <TimelinePage data={serializedContent} />;
}
