'use client';

import React, { useState } from 'react';

export default function GalleryGrid({ items }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const openFullscreen = (item) => {
    setSelectedImage(item);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-[rgba(255,255,255,0.02)] rounded-3xl border border-dashed border-[rgba(255,255,255,0.1)]">
        <div className="text-4xl mb-4 opacity-30">🎨</div>
        <p className="text-[#bfc1c3]">No artworks found in this category yet. Check back soon!</p>
      </div>
    );
  }

  const getAspectClass = (orientation) => {
    if (orientation === 'vertical') return 'aspect-[3/4]';
    if (orientation === 'square') return 'aspect-square';
    return 'aspect-[4/3]'; // default horizontal
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item._id} className="group overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] shadow-2xl transition-all hover:-translate-y-2 relative flex flex-col">
            <div 
              className={`overflow-hidden relative cursor-pointer ${getAspectClass(item.orientation)} bg-[#0a0a0a]`} 
              onClick={() => openFullscreen(item)}
            >
              <img 
                src={item.image} 
                alt={item.title || 'Artwork'} 
                loading="lazy"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 bg-white text-black px-4 py-2 rounded-full font-semibold transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                  View Piece
                </button>
              </div>
            </div>
            <div className="p-5 flex-grow">
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

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 md:p-10"
          onClick={closeFullscreen}
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 z-50 transition-colors"
            onClick={closeFullscreen}
          >
            &times;
          </button>
          
          <div 
            className="relative max-w-full max-h-full flex flex-col items-center justify-center outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title || 'Artwork'} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            <div className="mt-6 text-center w-full max-w-3xl bg-[rgba(0,0,0,0.5)] p-4 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedImage.title || 'Untitled'}</h2>
              <p className="text-lg text-gray-300 mb-3">by {selectedImage.artist || 'FAC Member'}</p>
              
              {selectedImage.description && (
                <p className="text-md text-gray-400 mb-4">{selectedImage.description}</p>
              )}
              
              {(selectedImage.instagram || selectedImage.otherLink1 || selectedImage.otherLink2) && (
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedImage.instagram && (
                    <a href={selectedImage.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      📸 Instagram
                    </a>
                  )}
                  {selectedImage.otherLink1 && (
                    <a href={selectedImage.otherLink1} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      🔗 Link 1
                    </a>
                  )}
                  {selectedImage.otherLink2 && (
                    <a href={selectedImage.otherLink2} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      🔗 Link 2
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
