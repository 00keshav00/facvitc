import React from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import GallerySection from '@/components/GallerySection';
import EventsSection from '@/components/EventsSection';
import MembersSection from '@/components/MembersSection';
import ConnectSection from '@/components/ConnectSection';
import Footer from '@/components/Footer';
import dbConnect from '@/lib/db';
import PageContent from '@/models/PageContent';
import Member from '@/models/Member';

async function getData() {
  await dbConnect();
  const content = await PageContent.findOne({ page: 'home' }).lean();
  const members = await Member.find({}).sort({ order: 1 }).limit(4).lean();
  
  // Serialize Mongo objects
  return {
    content: JSON.parse(JSON.stringify(content)),
    members: JSON.parse(JSON.stringify(members))
  };
}

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export default async function Home() {
  let data = { content: null, members: [] };
  
  try {
    data = await getData();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  const { content, members } = data;

  return (
    <>
      <Hero 
        title={content?.hero?.title}
        subtitle={content?.hero?.subtitle}
        ctaText={content?.hero?.ctaText}
        ctaLink={content?.hero?.ctaLink}
      />
      <About 
        title={content?.about?.title}
        text={content?.about?.text}
      />
      <GallerySection />
      <EventsSection />
      <MembersSection members={members} />
      <ConnectSection />
      <Footer />
    </>
  );
}
