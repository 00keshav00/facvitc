import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import PageContent from '@/models/PageContent';
import TimelinePage from '@/components/TimelinePage';

export async function generateMetadata({ params }) {
  await dbConnect();
  const { slug } = await params;
  const page = await PageContent.findOne({ page: slug });
  
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
  const { slug } = await params;
  
  console.log('Fetching content for slug:', slug);
  const pageContent = await PageContent.findOne({ page: slug });
  console.log('Found content:', pageContent ? 'Yes' : 'No');

  if (!pageContent) {
    // If we're looking for a valid page but it has no content yet, 
    // we might want to return an empty structure or handle it gracefully.
    // However, if the page is truly invalid (not in our list), 404 is correct.
    // For now, let's assume if it's not found in DB, it's a 404.
    // But wait, the user said "content is there".
    // If the content exists in DB, this should find it.
    notFound();
  }

  // Serialize the data to pass to client component
  // Using JSON.parse(JSON.stringify()) to handle MongoDB objects
  const serializedContent = JSON.parse(JSON.stringify(pageContent));

  return <TimelinePage data={serializedContent} />;
}
