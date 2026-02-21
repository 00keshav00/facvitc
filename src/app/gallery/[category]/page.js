import React from 'react';
import dbConnect from '@/lib/db';
import GalleryItem from '@/models/Gallery';
import Image from 'next/image';

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item._id} className="group overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] shadow-2xl transition-all hover:-translate-y-2">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title || 'Artwork'} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-[#e6e6e6] mb-1">{item.title || 'Untitled'}</h3>
              <p className="text-sm text-[#bfc1c3] mb-3">by {item.artist || 'FAC Member'}</p>
              {(item.instagram || item.otherLink1 || item.otherLink2) && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {item.instagram && (
                    <a href={item.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                      <span>📸 Instagram</span>
                    </a>
                  )}
                  {item.otherLink1 && (
                    <a href={item.otherLink1} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                      <span>🔗 Link 1</span>
                    </a>
                  )}
                  {item.otherLink2 && (
                    <a href={item.otherLink2} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                      <span>🔗 Link 2</span>
                    </a>
                  )}
                </div>
              )}
              {item.description && <p className="text-sm text-[rgba(191,193,195,0.8)] line-clamp-2">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-20 bg-[rgba(255,255,255,0.02)] rounded-3xl border border-dashed border-[rgba(255,255,255,0.1)]">
          <div className="text-4xl mb-4 opacity-30">🎨</div>
          <p className="text-[#bfc1c3]">No artworks found in this category yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
