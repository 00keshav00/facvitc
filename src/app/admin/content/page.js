'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

const PAGES = ['home', 'workshops', 'techno', 'vibrance', 'others'];

export default function ManageContent() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContent(selectedPage);
  }, [selectedPage]);

  const fetchContent = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data || { page });
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!content) return;
    
    // Ensure page field is set
    const body = { ...content, page: selectedPage };

    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      alert('Content updated successfully!');
    } else {
      alert('Failed to update content.');
    }
  };

  const handleChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Timeline helpers
  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...(content.timeline || [])];
    if (!newTimeline[index]) newTimeline[index] = {};
    newTimeline[index][field] = value;
    setContent({ ...content, timeline: newTimeline });
  };

  const addTimelineYear = () => {
    setContent({
      ...content,
      timeline: [{ year: new Date().getFullYear().toString(), title: '', description: '', images: [] }, ...(content.timeline || [])]
    });
  };

  const removeTimelineYear = (index) => {
    const newTimeline = [...(content.timeline || [])];
    newTimeline.splice(index, 1);
    setContent({ ...content, timeline: newTimeline });
  };

  const addTimelineImage = (index, url) => {
    const newTimeline = [...(content.timeline || [])];
    if (!newTimeline[index].images) newTimeline[index].images = [];
    newTimeline[index].images.push(url);
    setContent({ ...content, timeline: newTimeline });
  };

   const removeTimelineImage = (yearIndex, imgIndex) => {
    const newTimeline = [...(content.timeline || [])];
    newTimeline[yearIndex].images.splice(imgIndex, 1);
    setContent({ ...content, timeline: newTimeline });
  };


  if (loading && !content) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Page Content</h2>
        <select 
          value={selectedPage} 
          onChange={(e) => setSelectedPage(e.target.value)}
          className="p-2 rounded bg-[#2d2e30] border border-[rgba(255,255,255,0.1)] text-white"
        >
          {PAGES.map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>
      
      {!content ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-8 max-w-4xl">
          
          {selectedPage === 'home' ? (
            <>
              {/* HERO SECTION */}
              <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
                <h3 className="text-xl font-semibold mb-4 text-[#e6e6e6]">Hero Section</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-[#bfc1c3]">Title</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                      value={content.hero?.title || ''}
                      onChange={(e) => handleChange('hero', 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-[#bfc1c3]">Subtitle</label>
                    <textarea 
                      className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                      value={content.hero?.subtitle || ''}
                      onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                    />
                  </div>
                   <div>
                    <label className="block mb-2 text-sm text-[#bfc1c3]">CTA Text</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                      value={content.hero?.ctaText || ''}
                      onChange={(e) => handleChange('hero', 'ctaText', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-[#bfc1c3]">Background Image URL</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white mb-2"
                      value={content.hero?.backgroundImage || ''}
                      onChange={(e) => handleChange('hero', 'backgroundImage', e.target.value)}
                    />
                    <ImageUpload label="Or Upload Image" onUpload={(url) => handleChange('hero', 'backgroundImage', url)} />
                  </div>
                </div>
              </div>

              {/* ABOUT SECTION */}
              <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
                <h3 className="text-xl font-semibold mb-4 text-[#e6e6e6]">About Section</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-[#bfc1c3]">Title</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                      value={content.about?.title || ''}
                      onChange={(e) => handleChange('about', 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-[#bfc1c3]">Text</label>
                    <textarea 
                      className="w-full h-32 p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                      value={content.about?.text || ''}
                      onChange={(e) => handleChange('about', 'text', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-semibold text-[#e6e6e6]">Timeline ({selectedPage})</h3>
                 <button 
                   type="button"
                   onClick={addTimelineYear}
                   className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                 >
                   + Add Year
                 </button>
               </div>
               
               {(content.timeline || []).map((item, index) => (
                 <div key={index} className="mb-6 p-4 border border-[rgba(255,255,255,0.1)] rounded bg-[#1a1a1a]">
                   <div className="flex justify-between mb-2">
                     <h4 className="text-lg font-bold">Year {item.year || 'New'}</h4>
                     <button type="button" onClick={() => removeTimelineYear(index)} className="text-red-400 hover:text-red-300">Remove</button>
                   </div>
                   
                   <div className="grid gap-3 mb-4">
                     <input 
                       type="text" 
                       placeholder="Year (e.g., 2025)"
                       className="w-full p-2 rounded bg-[#2d2e30] border border-[rgba(255,255,255,0.1)] text-white"
                       value={item.year || ''}
                       onChange={(e) => handleTimelineChange(index, 'year', e.target.value)}
                     />
                     <input 
                       type="text" 
                       placeholder="Title"
                       className="w-full p-2 rounded bg-[#2d2e30] border border-[rgba(255,255,255,0.1)] text-white"
                       value={item.title || ''}
                       onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                     />
                     <textarea 
                       placeholder="Description"
                       className="w-full p-2 rounded bg-[#2d2e30] border border-[rgba(255,255,255,0.1)] text-white"
                       value={item.description || ''}
                       onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                     />
                   </div>

                   <div>
                     <label className="block mb-2 text-sm text-[#bfc1c3]">Images</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                       {(item.images || []).map((img, imgIdx) => (
                         <div key={imgIdx} className="relative w-20 h-20 group">
                           <img src={img} alt="" className="w-full h-full object-cover rounded" />
                           <button 
                             type="button"
                             onClick={() => removeTimelineImage(index, imgIdx)}
                             className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             x
                           </button>
                         </div>
                       ))}
                     </div>
                     <ImageUpload label="Add Image" onUpload={(url) => addTimelineImage(index, url)} />
                   </div>
                 </div>
               ))}
               
               {(content.timeline || []).length === 0 && (
                 <p className="text-[#bfc1c3] italic">No timeline entries yet. Click "Add Year" to start.</p>
               )}
            </div>
          )}

          <button type="submit" className="bg-[#e6e6e6] text-black px-6 py-3 rounded font-bold hover:bg-white transition text-lg w-full md:w-auto">
            Save All Changes
          </button>
        </form>
      )}
    </div>
  );
}
