import React from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import GallerySection from '@/components/GallerySection';
import EventsSection from '@/components/EventsSection';
import MembersSection from '@/components/MembersSection';
import ConnectSection from '@/components/ConnectSection';
import Footer from '@/components/Footer';
import dbConnect from '@/lib/db';
import HomeModel from '@/models/Home';
import Setting from '@/models/Setting';

async function getData() {
  await dbConnect();
  const homeData = await HomeModel.findOne().lean();
  const settings = await Setting.findOne().lean();
  
  return {
    home: JSON.parse(JSON.stringify(homeData || {})),
    settings: JSON.parse(JSON.stringify(settings || {}))
  };
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  let data = { home: {}, settings: {} };
  
  try {
    data = await getData();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  const { home, settings } = data;

  return (
    <>
      <Hero 
        title={home?.hero?.heading}
        subtitle={home?.hero?.subheading}
        logo={home?.hero?.logo}
      />
      <About 
        title={home?.about?.title}
        text={home?.about?.description}
        images={home?.about?.images}
        video={home?.about?.video}
      />
      <GallerySection 
        preview={home?.galleryPreview} 
        artwork={home?.artworkOfTheWeek}
      />
      <EventsSection preview={home?.eventsPreview} />
      <MembersSection members={home?.membersPreview} />
      <ConnectSection contact={home?.contact} settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
