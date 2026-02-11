'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('games');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const descriptions = {
    games: "Gaming isn't just a hobby, it's a lifestyle. Whether it's FPS, strategy, or open-world, I immerse myself fully. My reflexes are sharp, teamwork is solid, and I thrive under pressure.",
    anime: "Anime shaped the way I think visually and emotionally. From complex plots to powerful characters, I find inspiration in every episode. It fuels my creativity and teaches me values through vibrant worlds.",
    rifle: "As a rifle shooter, I rely on precision, patience, and laser-sharp focus. Hitting a target from a distance demands mental clarity, discipline, and consistency.",
    volley: "Volleyball drives my passion for teamwork and athleticism. Whether it’s setting, spiking, or diving for a save, I give my all on the court.",
    lin: "I use Arch, by the way. Linux empowers me to control every part of my system. From terminal commands to automation, I'm in full command."
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

  return (
    <section className="gallery-section px-14 py-16 border-t border-[rgba(255,255,255,0.08)] text-center bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-transparent relative overflow-visible" id="gallery">
      <h2 className="text-[2rem] font-bold mb-10 text-[#e6e6e6]">Featured Artworks</h2>
      
      {/* Featured Art Card */}
      <div className="art-card w-[850px] h-[400px] bg-[rgba(0,0,0,0.6)] backdrop-blur-xl rounded-3xl flex items-center p-5 gap-10 mx-auto mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] relative z-10">
        <div className="art-image-container flex-none w-[45%] h-full overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500">
          <img 
            src="https://images.unsplash.com/photo-1578301978693-85e6c0f67992?q=80&w=800&auto=format&fit=crop" 
            alt="Starry Night Style Artwork" 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openModal("https://images.unsplash.com/photo-1578301978693-85e6c0f67992?q=80&w=800&auto=format&fit=crop")}
          />
        </div>
        <div className="art-content flex-1 text-[#eaddcf] flex flex-col justify-center text-left pr-5">
          <div className="text-[1.1rem] font-semibold text-white mb-1 tracking-wide">Artwork of the Week:</div>
          <h2 className="text-[2.2rem] font-bold m-0 mb-5 text-white leading-tight">"Celestial Dance"</h2>
          <p className="text-[0.95rem] leading-relaxed text-[rgba(255,255,255,0.85)] mb-8">
            An exploration of movement and light using charcoal and digital overlays. Created by member Aarav Gupta.
          </p>
          <button 
            className="w-full py-3.5 bg-transparent border border-[rgba(255,255,255,0.4)] text-white text-base font-semibold tracking-widest uppercase rounded-xl cursor-pointer transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:border-white hover:-translate-y-0.5"
            onClick={() => openModal("https://images.unsplash.com/photo-1578301978693-85e6c0f67992?q=80&w=800&auto=format&fit=crop")}
          >
            VIEW PIECE
          </button>
        </div>
      </div>

      {/* Slider Section */}
      <div className="slider-container relative w-full max-w-[950px] h-[520px] mx-auto border border-[rgba(255,255,255,0.08)] rounded-[10px] overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-[rgba(255,255,255,0.02)] shadow-2xl">
        <div className="slider-videos absolute inset-0 w-full h-full overflow-hidden z-[1]">
          {['games', 'anime', 'rifle', 'volley', 'lin'].map((cat) => (
             <img 
               key={cat}
               className={`bgvid absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 pointer-events-none brightness-[0.55] saturate-[0.9] ${activeCategory === cat ? 'opacity-100' : 'opacity-0'}`}
               src={cat === 'games' ? '/tops.png' : cat === 'lin' ? '/digital.png' : cat === 'volley' ? '/port.jpeg' : '/themed.jpeg'} 
               alt={cat}
             />
          ))}
        </div>

        <div className="content1 relative z-[4] w-[92%] max-w-[920px] mx-auto text-center text-[#e6e6e6] top-1/2 -translate-y-1/2 p-5">
           {['Top Picks', 'Art for a Cause', 'Concept Art', 'Portraits', 'Digital Artworks'].map((title, idx) => {
             const cat = ['games', 'anime', 'rifle', 'volley', 'lin'][idx];
             return (
               <h1 key={cat} className={`model text-[34px] mb-2.5 font-bold ${activeCategory === cat ? 'block' : 'hidden'}`}>{title}</h1>
             )
           })}

           <p className="text-[#bfc1c3] text-[15px] leading-relaxed max-w-[760px] mx-auto mb-6 min-h-[50px]">
             {descriptions[activeCategory]}
           </p>

           <div className="gallery w-[84%] mx-auto bg-[rgba(0,0,0,0.25)] rounded-xl p-4 shadow-xl backdrop-blur-md z-[5]">
             <Swiper
               modules={[Autoplay, Pagination]}
               slidesPerView={3}
               spaceBetween={28}
               centeredSlides={true}
               grabCursor={true}
               loop={true}
               autoplay={{ delay: 3000, disableOnInteraction: false }}
               pagination={{ clickable: true }}
               onSlideChange={handleSlideChange}
               breakpoints={{
                 0: { slidesPerView: 1.1, spaceBetween: 14 },
                 640: { slidesPerView: 2.1, spaceBetween: 20 },
                 900: { slidesPerView: 3, spaceBetween: 28 },
               }}
               className="mySwiper w-full py-2"
             >
               {[
                 { cat: 'games', img: '/mp1.jpg', link: '/top-picks' },
                 { cat: 'anime', img: '/afc1.jpg', link: '/afac' },
                 { cat: 'rifle', img: '/c1.jpg', link: '/ca' },
                 { cat: 'volley', img: '/p1.jpeg', link: '/p' },
                 { cat: 'lin', img: '/da1.jpg', link: '/da' }
               ].map((item, idx) => (
                 <SwiperSlide key={idx} data-name={item.cat} className="flex justify-center items-center cursor-pointer">
                    <Link href={item.link} className="block w-full h-full">
                      <img 
                        src={item.img} 
                        alt={item.cat} 
                        className={`w-[230px] h-[150px] rounded-xl object-cover border border-[rgba(255,255,255,0.06)] transition-all duration-250 ${activeCategory === item.cat ? 'scale-105 shadow-xl' : ''}`}
                      />
                    </Link>
                 </SwiperSlide>
               ))}
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
