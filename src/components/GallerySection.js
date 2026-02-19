'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';

export default function GallerySection({ preview, artwork }) {
  const [activeCategory, setActiveCategory] = useState('games');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const defaultDescriptions = {
    digital: "Exploring the digital medium with creativity and precision. From character design to environment concept art, we showcase the best of digital creativity.",
    sketch: "The raw essence of art captured in lines and shadows. Our collection of sketches shows the fundamental skills and expressive power of our artists.",
    painting: "A celebration of color and traditional media. Join us for the annual painting and sculpture showcase featuring vibrant works of art.",
    afac: "Artworks dedicated to social causes and community impact. Using creativity to raise awareness and drive meaningful change.",
    concept: "Imaginative and conceptual designs for characters and environments. Pushing the boundaries of storytelling through visual development."
  };

  const handleSlideChange = (swiper) => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const name = activeSlide?.getAttribute('data-name');
    if (name) setActiveCategory(name);
  };

  const openModal = (src) => {
    setModalImage(src);
    setModalOpen(true);
  };

  const featuredImg = artwork?.image || "https://images.unsplash.com/photo-1578301978693-85e6c0f67992?q=80&w=800&auto=format&fit=crop";

  return (
    <section className="gallery-section px-4 md:px-14 py-12 md:py-16 border-t border-[rgba(255,255,255,0.08)] text-center bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-transparent relative overflow-visible" id="gallery">
      <h2 className="text-2xl md:text-[2rem] font-bold mb-8 md:mb-10 text-[#e6e6e6]">Featured Artworks</h2>
      
      {/* Featured Art Card */}
      <div className="art-card w-full max-w-[850px] md:h-[400px] bg-[rgba(0,0,0,0.6)] backdrop-blur-xl rounded-3xl flex flex-col md:flex-row items-center p-5 gap-6 md:gap-10 mx-auto mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] relative z-10">
        <div className="art-image-container flex-none w-full md:w-[45%] h-64 md:h-full overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500">
          <img 
            src={featuredImg} 
            alt={artwork?.title || "Starry Night Style Artwork"} 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openModal(featuredImg)}
          />
        </div>
        <div className="art-content flex-1 text-[#eaddcf] flex flex-col justify-center text-left md:pr-5">
          <div className="text-base md:text-[1.1rem] font-semibold text-white mb-1 tracking-wide">{artwork?.subtitle || "Artwork of the Week:"}</div>
          <h2 className="text-2xl md:text-[2.2rem] font-bold m-0 mb-4 md:mb-5 text-white leading-tight">{artwork?.title || "\"Celestial Dance\""}</h2>
          <p className="text-sm md:text-[0.95rem] leading-relaxed text-[rgba(255,255,255,0.85)] mb-6 md:mb-8">
            {artwork?.description || "An exploration of movement and light using charcoal and digital overlays. Created by member Aarav Gupta."}
          </p>
          <button 
            className="w-full py-3 bg-transparent border border-[rgba(255,255,255,0.4)] text-white text-sm md:text-base font-semibold tracking-widest uppercase rounded-xl cursor-pointer transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:border-white hover:-translate-y-0.5"
            onClick={() => openModal(featuredImg)}
          >
            VIEW PIECE
          </button>
        </div>
      </div>

      {/* Slider Section */}
      <div className="slider-container relative w-full max-w-[950px] h-[450px] md:h-[520px] mx-auto border border-[rgba(255,255,255,0.08)] rounded-[10px] overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-[rgba(255,255,255,0.02)] shadow-2xl">
        <div className="slider-videos absolute inset-0 w-full h-full overflow-hidden z-[1]">
          {['digital', 'sketch', 'painting', 'afac', 'concept'].map((cat, idx) => {
             const titleMap = {
               'digital': 'Digital Art',
               'sketch': 'Sketch',
               'painting': 'Painting',
               'afac': 'Art for a Cause',
               'concept': 'Concept Art'
             };
             const previewItem = preview && preview.find(p => p.title === titleMap[cat]);
             return (
               <img 
                 key={cat}
                 className={`bgvid absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 pointer-events-none brightness-[0.55] saturate-[0.9] ${activeCategory === cat ? 'opacity-100' : 'opacity-0'}`}
                 src={previewItem?.backImage || previewItem?.image || (cat === 'digital' ? '/tops.png' : cat === 'sketch' ? '/ph4.jpeg' : cat === 'painting' ? '/port.jpeg' : '/themed.jpeg')} 
                 alt={cat}
               />
             )
          })}
        </div>

        <div className="content1 relative z-[4] w-[95%] md:w-[92%] max-w-[920px] mx-auto text-center text-[#e6e6e6] top-1/2 -translate-y-1/2 p-2 md:p-5">
           {['Digital Art', 'Sketch', 'Painting', 'Art for a Cause', 'Concept Art'].map((title, idx) => {
             const cat = ['digital', 'sketch', 'painting', 'afac', 'concept'][idx];
             const previewItem = preview && preview.find(p => p.title === title);
             return (
               <h1 key={cat} className={`model text-2xl md:text-[34px] mb-2 font-bold ${activeCategory === cat ? 'block' : 'hidden'}`}>{previewItem?.title || title}</h1>
             )
           })}

           <p className="text-[#bfc1c3] text-sm md:text-[15px] leading-relaxed max-w-[760px] mx-auto mb-4 md:mb-6 min-h-[40px] md:min-h-[50px] line-clamp-2 md:line-clamp-none">
             {defaultDescriptions[activeCategory]}
           </p>

           <div className="gallery w-full md:w-[84%] mx-auto bg-[rgba(0,0,0,0.25)] rounded-xl p-3 md:p-4 shadow-xl backdrop-blur-md z-[5]">
             <Swiper
               style={{
                 "--swiper-navigation-color": "#fff",
                 "--swiper-pagination-color": "#fff",
               }}
               modules={[Autoplay, Pagination, Navigation]}
               navigation={true}
               slidesPerView={3}
               spaceBetween={28}
               centeredSlides={true}
               grabCursor={true}
               loop={true}
               autoplay={{ delay: 3000, disableOnInteraction: false }}
               pagination={{ clickable: true }}
               onSlideChange={handleSlideChange}
               breakpoints={{
                 0: { slidesPerView: 1.5, spaceBetween: 12 },
                 640: { slidesPerView: 2.1, spaceBetween: 20 },
                 900: { slidesPerView: 3, spaceBetween: 28 },
               }}
               className="mySwiper w-full py-2"
             >
               {[
                 { cat: 'digital', link: '/gallery/Digital Art' },
                 { cat: 'sketch', link: '/gallery/Sketch' },
                 { cat: 'painting', link: '/gallery/Painting' },
                 { cat: 'afac', link: '/gallery/Art for a Cause' },
                 { cat: 'concept', link: '/gallery/Concept Art' }
               ].map((item, idx) => {
                 const previewItem = preview && preview.find(p => p.title === item.link.split('/').pop());
                 const fallbackImg = item.cat === 'digital' ? '/mp1.jpg' : item.cat === 'sketch' ? '/ph4.jpeg' : item.cat === 'painting' ? '/p1.jpeg' : '/afc1.jpg';
                 return (
                 <SwiperSlide key={idx} data-name={item.cat} className="flex justify-center items-center cursor-pointer">
                    <Link href={item.link} className="block w-full h-full">
                      <img 
                        src={previewItem?.frontImage || previewItem?.image || fallbackImg} 
                        alt={item.cat} 
                        className={`w-full max-w-[230px] h-[100px] md:h-[150px] rounded-xl object-cover border border-[rgba(255,255,255,0.06)] transition-all duration-250 ${activeCategory === item.cat ? 'scale-105 shadow-xl' : ''}`}
                      />
                    </Link>
                 </SwiperSlide>
               )})}
             </Swiper>
           </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.9)] backdrop-blur-sm flex justify-center items-center" onClick={() => setModalOpen(false)}>
          <span className="close-modal absolute top-5 right-8 text-[#f1f1f1] text-[40px] font-bold cursor-pointer hover:text-[#bbb]" onClick={() => setModalOpen(false)}>&times;</span>
          <img className="modal-content max-w-[80%] max-h-[90vh] object-contain rounded-xl border border-[rgba(255,255,255,0.2)] shadow-[0_0_40px_rgba(0,0,0,0.8)]" src={modalImage} />
        </div>
      )}
    </section>
  );
}
