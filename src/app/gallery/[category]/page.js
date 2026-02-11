import React from 'react';

export default async function CategoryPage({ params }) {
  // Await params in Next.js 15+
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');

  return (
    <div className="px-14 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-[#e6e6e6] capitalize text-center">{decodedCategory}</h1>
      <p className="text-[#bfc1c3] mb-10 text-center">Displaying content for {decodedCategory}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-square bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl flex items-center justify-center text-[#bfc1c3] shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-1">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎨</div>
              <div>Artwork Placeholder {i}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
