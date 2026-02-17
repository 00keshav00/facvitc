'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

const PAGES = ['home', 'workshops', 'techno', 'vibrance', 'others'];

const TEMPLATES = {
  'A': 'Stack: 1 Large Top (Img+Text) + 3 Bottom Imgs',
  'B': 'Split: 1 Side Large Img + Text Col (w/ 2 small imgs)',
  'C': 'Grid: Simple Grid of Images',
  'D': 'Text: Text Only (No Images)',
  'E': 'L-Shape: Text + Side Img + Bottom Row Imgs'
};

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
        let data = await res.json();
        data = data || { page };
        
        // Migration: If timeline exists but no blocks, move legacy fields to blocks[0]
        if (data.timeline) {
          data.timeline = data.timeline.map(t => {
            if (!t.blocks || t.blocks.length === 0) {
              return {
                ...t,
                blocks: [{
                  template: t.template || 'A',
                  title: t.title || '',
                  description: t.description || '',
                  images: t.images || []
                }]
              };
            }
            return t;
          });
        }
        setContent(data);
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
      timeline: [{ 
        year: new Date().getFullYear().toString(), 
        blocks: [{ template: 'A', title: '', description: '', images: [] }]
      }, ...(content.timeline || [])]
    });
  };

  const removeTimelineYear = (index) => {
    const newTimeline = [...(content.timeline || [])];
    newTimeline.splice(index, 1);
    setContent({ ...content, timeline: newTimeline });
  };

  // Block Helpers
  const addBlock = (yearIndex) => {
    const newTimeline = [...(content.timeline || [])];
    if (!newTimeline[yearIndex].blocks) newTimeline[yearIndex].blocks = [];
    newTimeline[yearIndex].blocks.push({ template: 'A', title: '', description: '', images: [] });
    setContent({ ...content, timeline: newTimeline });
  };

  const removeBlock = (yearIndex, blockIndex) => {
    const newTimeline = [...(content.timeline || [])];
    newTimeline[yearIndex].blocks.splice(blockIndex, 1);
    setContent({ ...content, timeline: newTimeline });
  };

  const handleBlockChange = (yearIndex, blockIndex, field, value) => {
    const newTimeline = [...(content.timeline || [])];
    if (!newTimeline[yearIndex].blocks[blockIndex]) return;
    newTimeline[yearIndex].blocks[blockIndex][field] = value;
    setContent({ ...content, timeline: newTimeline });
  };

  const addBlockImage = (yearIndex, blockIndex, url) => {
    const newTimeline = [...(content.timeline || [])];
    const block = newTimeline[yearIndex].blocks[blockIndex];
    if (!block.images) block.images = [];
    block.images.push(url);
    setContent({ ...content, timeline: newTimeline });
  };

  const removeBlockImage = (yearIndex, blockIndex, imgIndex) => {
    const newTimeline = [...(content.timeline || [])];
    newTimeline[yearIndex].blocks[blockIndex].images.splice(imgIndex, 1);
    setContent({ ...content, timeline: newTimeline });
  };


  if (loading && !content) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Page Content</h2>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={handleUpdate}
            className="bg-[#e6e6e6] text-black px-4 py-2 rounded font-bold hover:bg-white transition"
          >
            Save All Changes
          </button>
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
                 <div key={index} className="mb-8 p-4 border border-[rgba(255,255,255,0.1)] rounded bg-[#1a1a1a]">
                   <div className="flex justify-between mb-4">
                     <div className="flex-1 mr-4">
                        <label className="block text-xs text-[#bfc1c3] mb-1">Timeline Year</label>
                        <input 
                          type="text" 
                          placeholder="Year (e.g., 2025)"
                          className="w-full p-2 rounded bg-[#2d2e30] border border-[rgba(255,255,255,0.1)] text-white font-bold text-lg"
                          value={item.year || ''}
                          onChange={(e) => handleTimelineChange(index, 'year', e.target.value)}
                        />
                     </div>
                     <button type="button" onClick={() => removeTimelineYear(index)} className="text-red-400 hover:text-red-300 self-center">Delete Year</button>
                   </div>
                   
                   <div className="space-y-6">
                     {(item.blocks || []).map((block, blockIdx) => (
                       <div key={blockIdx} className="p-4 bg-[#2d2e30] rounded border border-[rgba(255,255,255,0.05)] relative group">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-[#bfc1c3]">Block {blockIdx + 1}</span>
                            <button 
                              type="button" 
                              onClick={() => removeBlock(index, blockIdx)} 
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Remove Block
                            </button>
                         </div>

                         <div className="grid gap-3 mb-4">
                            <div>
                                <label className="block text-xs text-[#bfc1c3] mb-1">Layout Template</label>
                                <select 
                                    className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                                    value={block.template || 'A'}
                                    onChange={(e) => handleBlockChange(index, blockIdx, 'template', e.target.value)}
                                >
                                    {Object.entries(TEMPLATES).map(([key, label]) => (
                                    <option key={key} value={key}>{key} - {label.split(':')[0]}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-[#bfc1c3] italic mt-1">{TEMPLATES[block.template || 'A']}</p>
                            </div>

                           <input 
                             type="text" 
                             placeholder="Block Title"
                             className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                             value={block.title || ''}
                             onChange={(e) => handleBlockChange(index, blockIdx, 'title', e.target.value)}
                           />
                           <textarea 
                             placeholder="Block Description"
                             className="w-full p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
                             value={block.description || ''}
                             onChange={(e) => handleBlockChange(index, blockIdx, 'description', e.target.value)}
                           />
                         </div>

                         <div>
                           <label className="block mb-2 text-sm text-[#bfc1c3]">Images</label>
                           <div className="flex flex-wrap gap-2 mb-2">
                             {(block.images || []).map((img, imgIdx) => (
                               <div key={imgIdx} className="relative w-20 h-20 group/img">
                                 <img src={img} alt="" className="w-full h-full object-cover rounded" />
                                 <button 
                                   type="button"
                                   onClick={() => removeBlockImage(index, blockIdx, imgIdx)}
                                   className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                   x
                                 </button>
                               </div>
                             ))}
                           </div>
                           <ImageUpload label="Add Image" onUpload={(url) => addBlockImage(index, blockIdx, url)} />
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <button 
                     type="button" 
                     onClick={() => addBlock(index)}
                     className="mt-4 w-full py-2 border border-dashed border-[rgba(255,255,255,0.2)] rounded text-[#bfc1c3] hover:text-white hover:border-white transition text-sm"
                   >
                     + Add Another Content Block
                   </button>
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
