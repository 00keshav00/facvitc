'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

const eventTypes = ['TechnoVit', 'Vibrance', 'Others'];
const layouts = ['TEXT_LEFT_IMAGE_RIGHT', 'TEXT_RIGHT_IMAGE_LEFT', 'IMAGE_ONLY', 'SPLIT_WITH_STACK', 'SPLIT_WITH_STACK_REVERSE'];

export default function EventsAdmin() {
  const [selectedType, setSelectedType] = useState(eventTypes[0]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    fetchYears();
  }, [selectedType]);

  const fetchYears = async (preserveSelected = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?type=${selectedType}`);
      const json = await res.json();
      setYears(json);
      
      // Update selectedYear with the latest data from the list ONLY if not preserving
      if (!preserveSelected) {
        if (selectedYear) {
          const updated = json.find(y => y._id === selectedYear._id);
          if (updated) setSelectedYear(updated);
          else if (json.length > 0) setSelectedYear(json[0]);
          else setSelectedYear(null);
        } else if (json.length > 0) {
          setSelectedYear(json[0]);
        } else {
          setSelectedYear(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddYear = async () => {
    const year = prompt('Enter Year (e.g. 2024):');
    if (!year) return;
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: selectedType, year, title: `${selectedType} ${year}` })
      });
      if (res.ok) fetchYears();
    } catch (err) {
      alert('Failed to add year');
    }
  };

  const handleUpdateYear = async () => {
    if (!selectedYear?._id) {
      alert("Error: No year selected or ID missing. Please refresh and try again.");
      return;
    }
    try {
      const res = await fetch(`/api/events/${selectedYear._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedYear)
      });
      const result = await res.json();
      if (res.ok) {
        setSelectedYear(result); // Sync immediate state
        alert('Updated successfully');
        await fetchYears(true); // Sync full list but preserve our fresh selectedYear
      } else {
        alert('Update failed: ' + (result.error || res.statusText));
      }
    } catch (err) {
      console.error('Update catch error:', err);
      alert('Update failed: Network or Server Error');
    }
  };

  const handleDeleteYear = async (id) => {
    if (!confirm('Are you sure? This will delete all content for this year.')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchYears();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Events Management</h2>
        <div className="flex gap-2">
          {eventTypes.map(t => (
            <button 
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedType === t ? 'bg-white text-black' : 'bg-[#2d2e30] text-[#bfc1c3] hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 border-b border-[#3a3a3b] overflow-x-auto pb-2">
        {years.map(y => (
          <div key={y._id} className="relative group">
            <button 
              onClick={() => setSelectedYear(y)}
              className={`whitespace-nowrap pb-2 px-1 text-sm font-medium ${selectedYear?._id === y._id ? 'text-white border-b-2 border-white' : 'text-[#bfc1c3] hover:text-white'}`}
            >
              {y.year}
            </button>
            <button 
               onClick={() => handleDeleteYear(y._id)}
               className="absolute -top-2 -right-2 text-red-500 opacity-0 group-hover:opacity-100 text-[10px]"
            >✕</button>
          </div>
        ))}
        <button onClick={handleAddYear} className="text-blue-500 text-sm pb-2">+ Add Year</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : selectedYear ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
             <div className="bg-[#1e1e1f] p-6 rounded-xl border border-[#3a3a3b]">
                <h3 className="text-xl font-bold mb-4">Year Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#bfc1c3] mb-1">Page Title</label>
                    <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" value={selectedYear.title || ''} onChange={(e) => setSelectedYear({...selectedYear, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#bfc1c3] mb-1">Description</label>
                    <textarea className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded h-24" value={selectedYear.description || ''} onChange={(e) => setSelectedYear({...selectedYear, description: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedYear.enabled} onChange={(e) => setSelectedYear({...selectedYear, enabled: e.target.checked})} id="enabled" />
                    <label htmlFor="enabled" className="text-sm">Enabled / Visible</label>
                  </div>
                  <ImageUpload label="Banner Media (Image/Video)" onUpload={(url) => setSelectedYear({...selectedYear, bannerMedia: url})} />
                  {selectedYear.bannerMedia && <div className="text-xs truncate">{selectedYear.bannerMedia}</div>}
                  <button onClick={handleUpdateYear} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold">Save Settings</button>
                </div>
             </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Sections</h3>
              <button 
                onClick={() => setSelectedYear({...selectedYear, sections: [...(selectedYear.sections || []), { title: '', description: '', mainImage: '', subImages: [], video: '', layout: 'TEXT_LEFT_IMAGE_RIGHT', order: (selectedYear.sections?.length || 0) }]})}
                className="bg-[#2d2e30] hover:bg-[#3a3a3b] px-4 py-2 rounded text-sm border border-[#3a3a3b]"
              >+ Add Section</button>
            </div>

            <div className="space-y-8">
              {(selectedYear.sections || []).map((section, idx) => (
                <div key={idx} className="bg-[#1e1e1f] p-6 rounded-xl border border-[#3a3a3b] relative">
                  <button 
                    onClick={() => {
                      const newSections = selectedYear.sections.filter((_, i) => i !== idx);
                      setSelectedYear({...selectedYear, sections: newSections});
                    }}
                    className="absolute top-4 right-4 text-red-500 text-sm"
                  >Remove Section</button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#bfc1c3] mb-1">Section Title</label>
                        <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" value={section.title} onChange={(e) => {
                          const newSections = selectedYear.sections.map((s, i) => i === idx ? { ...s, title: e.target.value } : s);
                          setSelectedYear({...selectedYear, sections: newSections});
                        }} />
                      </div>
                      <div>
                        <label className="block text-sm text-[#bfc1c3] mb-1">Layout</label>
                        <select className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" value={section.layout || 'TEXT_LEFT_IMAGE_RIGHT'} onChange={(e) => {
                          const newSections = selectedYear.sections.map((s, i) => i === idx ? { ...s, layout: e.target.value } : s);
                          setSelectedYear({...selectedYear, sections: newSections});
                        }}>
                          {layouts.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-[#bfc1c3] mb-1">Description</label>
                        <textarea className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded h-32" value={section.description} onChange={(e) => {
                          const newSections = selectedYear.sections.map((s, i) => i === idx ? { ...s, description: e.target.value } : s);
                          setSelectedYear({...selectedYear, sections: newSections});
                        }} />
                      </div>
                      <div>
                        <label className="block text-sm text-[#bfc1c3] mb-1">Video URL (optional)</label>
                        <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" value={section.video || ''} onChange={(e) => {
                          const newSections = selectedYear.sections.map((s, i) => i === idx ? { ...s, video: e.target.value } : s);
                          setSelectedYear({...selectedYear, sections: newSections});
                        }} />
                      </div>
                    </div>

                    <div className="space-y-4">
                       <ImageUpload label="Main Image" onUpload={(url) => {
                          const newSections = selectedYear.sections.map((s, i) => i === idx ? { ...s, mainImage: url } : s);
                          setSelectedYear({...selectedYear, sections: newSections});
                       }} />
                       {section.mainImage && <img src={section.mainImage} className="w-full h-32 object-cover rounded" />}
                       
                       <div>
                         <label className="block text-sm text-[#bfc1c3] mb-1">Sub Images</label>
                         <ImageUpload label="Add Sub Image" onUpload={(url) => {
                            const newSections = selectedYear.sections.map((s, i) => i === idx ? { ...s, subImages: [...(s.subImages || []), url] } : s);
                            setSelectedYear({...selectedYear, sections: newSections});
                         }} />
                         <div className="flex gap-2 flex-wrap">
                           {(section.subImages || []).map((img, i) => (
                             <div key={i} className="relative">
                               <img src={img} className="w-16 h-16 object-cover rounded" />
                               <button 
                                onClick={() => {
                                  const newSections = selectedYear.sections.map((s, si) => si === idx ? { ...s, subImages: s.subImages.filter((_, sidx) => sidx !== i) } : s);
                                  setSelectedYear({...selectedYear, sections: newSections});
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-[10px]"
                               >✕</button>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(selectedYear.sections || []).length > 0 && (
              <button onClick={handleUpdateYear} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold transition-all shadow-lg">Save All Sections</button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1e1e1f] rounded-xl border border-[#3a3a3b]">
          <p className="text-[#bfc1c3]">No years found for {selectedType}. Add one to get started.</p>
        </div>
      )}
    </div>
  );
}
