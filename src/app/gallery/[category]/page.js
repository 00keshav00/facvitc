import React from 'react';
import dbConnect from '@/lib/db';
import GalleryItem from '@/models/Gallery';
import Image from 'next/image';

import GalleryGrid from '@/components/GalleryGrid';

export const dynamic = 'force-dynamic';

async function getGalleryItems(category) {
  await dbConnect();
  // We need to match the category name. 
  // In Admin we use: 'Digital Art', 'Sketch', 'Painting', 'Art for a Cause', 'Concept Art'
  // But slugs might be 'digital-art', 'art-for-a-cause', etc.
  
  // Let's try to find it by name.
  const items = await GalleryItem.find({ category }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  
  // Mapping slugs to categories if needed, but the Link in GallerySection uses /top-picks etc.
  // Wait, I should check the Links in GallerySection.
  
  // Original Links:
  // Top Picks: /top-picks
  // Art for a Cause: /afac
  // Concept Art: /ca
  // Portraits: /p
  // Digital Artworks: /da
  
  // Let's translate these to the Gallery categories.
  const categoryMap = {
    'top-picks': 'Digital Art',
    'afac': 'Art for a Cause',
    'ca': 'Concept Art',
    'p': 'Painting',
    'da': 'Digital Art',
    'digital-art': 'Digital Art',
    'sketch': 'Sketch',
    'painting': 'Painting',
    'art-for-a-cause': 'Art for a Cause',
    'concept-art': 'Concept Art'
  };

  const decoded = decodeURIComponent(category);
  const dbCategory = categoryMap[category.toLowerCase()] || 
                     categoryMap[decoded.toLowerCase()] || 
                     decoded;
  
  // Normalize dbCategory to match DB exactly (capitalization)
  const normalizedMap = {
    'digital art': 'Digital Art',
    'sketch': 'Sketch',
    'painting': 'Painting',
    'art for a cause': 'Art for a Cause',
    'concept art': 'Concept Art'
  };

  const finalCategory = normalizedMap[dbCategory.toLowerCase()] || dbCategory;
  const items = await getGalleryItems(finalCategory);

  return (
    <div className="px-6 md:px-14 py-12 min-h-screen">
      <h1 className="text-3xl md:text-44px font-bold mb-4 text-[#e6e6e6] capitalize text-center">{dbCategory}</h1>
      <p className="text-[#bfc1c3] mb-12 text-center max-w-2xl mx-auto">Explore our collection of {dbCategory.toLowerCase()} created by the talented members of FAC VIT Chennai.</p>
      
      <GalleryGrid items={items} />
    </div>
  );
}
