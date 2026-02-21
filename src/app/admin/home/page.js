'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function HomeAdmin() {
  const [activeTab, setActiveTab] = useState('Hero');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = ['Hero', 'About', 'Artwork', 'Gallery Preview', 'Events Preview', 'Members Preview', 'Site Designers', 'Contact'];

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    let endpoint = tab.toLowerCase().replace(' ', '-');
    if (endpoint === 'members-preview') endpoint = 'members';
    if (endpoint === 'events-preview') endpoint = 'events-preview';
    
    try {
      const res = await fetch(`/api/home/${endpoint}`);
      const text = await res.text();
      
      if (!res.ok) {
        let errMsg = `Server error: ${res.status}`;
        try {
          const errJson = JSON.parse(text);
          if (errJson.error) errMsg += ` - ${errJson.error}`;
        } catch (e) {}
        throw new Error(errMsg);
      }
      
      let json;
      try {
        json = text ? JSON.parse(text) : (tab.includes('Preview') ? [] : {});
      } catch (e) {
        console.error('JSON Parse error:', e, 'Text:', text);
        json = tab.includes('Preview') ? [] : {};
      }
      
      if (tab.includes('Preview')) {
        setData(Array.isArray(json) ? json : []);
      } else {
        setData(json && typeof json === 'object' && !Array.isArray(json) ? json : {});
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setData(tab.includes('Preview') ? [] : {});
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (eOrData = null) => {
    // If it's a form event, prevent default
    if (eOrData && eOrData.preventDefault) {
      eOrData.preventDefault();
    }

    let endpoint = activeTab.toLowerCase().replace(' ', '-');
    if (endpoint === 'members-preview') endpoint = 'members';
    if (endpoint === 'events-preview') endpoint = 'events-preview';
    
    // Determine payload: if eOrData is NOT an event and is truthy, use it. Otherwise use 'data' state.
    const isEvent = eOrData && eOrData.preventDefault;
    const payload = (eOrData && !isEvent) ? eOrData : data;
    
    try {
      const res = await fetch(`/api/home/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setData(result); // Use the returned updated data immediately
        alert('Updated successfully!');
      } else {
        alert('Update failed: ' + (result.error || res.statusText || 'Unknown error'));
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Update failed: ' + err.message);
    }
  };

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;

    switch (activeTab) {
      case 'Hero':
        return (
          <form onSubmit={handleUpdate} className="space-y-4 max-w-2xl">
            <ImageUpload 
              label="Hero Logo" 
              onUpload={(url) => setData({...data, logo: url})} 
            />
            {data.logo && <img src={data.logo} className="w-32 mb-4 bg-black/20 p-2" />}
            
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Heading</label>
              <input 
                className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-[#e6e6e6]"
                value={data.heading || ''}
                onChange={(e) => setData({...data, heading: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Subheading</label>
              <textarea 
                className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-[#e6e6e6] h-24"
                value={data.subheading || ''}
                onChange={(e) => setData({...data, subheading: e.target.value})}
              />
            </div>
            <button type="submit" className="bg-[#4a4a4b] px-6 py-2 rounded font-semibold">Save Changes</button>
          </form>
        );
      
      case 'About':
        return (
          <form onSubmit={handleUpdate} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Title</label>
              <input 
                className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-[#e6e6e6]"
                value={data.title || ''}
                onChange={(e) => setData({...data, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Description</label>
              <textarea 
                className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-[#e6e6e6] h-32"
                value={data.description || ''}
                onChange={(e) => setData({...data, description: e.target.value})}
              />
            </div>
            <ImageUpload 
              label="Add Images (Max 3-4 recommended)" 
              onUpload={(url) => setData({...data, images: [...(data.images || []), url]})} 
            />
            <div className="flex gap-2 flex-wrap">
              {(data.images || []).map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-24 h-24 object-cover rounded" />
                  <button 
                    type="button"
                    onClick={() => setData({...data, images: data.images.filter((_, idx) => idx !== i)})}
                    className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 text-[10px]"
                  >X</button>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">About Video</label>
              <ImageUpload 
                label="Upload MP4 Video" 
                onUpload={(url) => setData({...data, video: url})} 
              />
              {data.video && (
                <video src={data.video} className="w-full max-w-xs mt-2 rounded border border-[#3a3a3b]" controls />
              )}
            </div>
            <button type="submit" className="bg-[#4a4a4b] px-6 py-2 rounded font-semibold">Save Changes</button>
          </form>
        );

      case 'Artwork':
        return (
          <form onSubmit={handleUpdate} className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-bold">Artwork of the Week</h3>
            <ImageUpload 
              label="Artwork Image" 
              onUpload={(url) => setData({...data, image: url})} 
            />
            {data.image && <img src={data.image} className="w-48 h-48 object-cover rounded" />}
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Title</label>
              <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded" value={data.title || ''} onChange={(e) => setData({...data, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Subtitle</label>
              <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded" value={data.subtitle || ''} onChange={(e) => setData({...data, subtitle: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Description</label>
              <textarea className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded h-24" value={data.description || ''} onChange={(e) => setData({...data, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Button Link</label>
              <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded" value={data.buttonLink || ''} onChange={(e) => setData({...data, buttonLink: e.target.value})} />
            </div>
            <button type="submit" className="bg-[#4a4a4b] px-6 py-2 rounded font-semibold">Save Changes</button>
          </form>
        );

      case 'Gallery Preview':
        return (
          <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold">Gallery Categories Preview</h3>
            {['Digital Art', 'Sketch', 'Painting', 'Art for a Cause', 'Concept Art'].map((cat, idx) => {
              const safeData = Array.isArray(data) ? data : [];
              const item = safeData.find(d => d.title === cat) || { title: cat, frontImage: '', backImage: '' };
              return (
                <div key={cat} className="p-4 border border-[#3a3a3b] rounded space-y-4">
                  <h4 className="font-semibold mb-2">{cat}</h4>
                  
                  {/* Front Image Upload */}
                  <div>
                    <ImageUpload 
                      label="Front Image (Small Card)" 
                      onUpload={(url) => {
                        const exists = safeData.some(d => d.title === cat);
                        let newData;
                        if (exists) {
                          newData = safeData.map(d => d.title === cat ? { ...d, frontImage: url } : d);
                        } else {
                          newData = [...safeData, { title: cat, frontImage: url }];
                        }
                        setData(newData);
                      }} 
                    />
                    {item.frontImage && <img src={item.frontImage} className="w-32 h-20 object-cover rounded mt-2" />}
                  </div>

                  {/* Back Image Upload */}
                  <div>
                    <ImageUpload 
                      label="Back Image (Big Card)" 
                      onUpload={(url) => {
                        const exists = safeData.some(d => d.title === cat);
                        let newData;
                        if (exists) {
                          newData = safeData.map(d => d.title === cat ? { ...d, backImage: url } : d);
                        } else {
                          newData = [...safeData, { title: cat, backImage: url }];
                        }
                        setData(newData);
                      }} 
                    />
                    {item.backImage && <img src={item.backImage} className="w-32 h-20 object-cover rounded mt-2" />}
                  </div>

                </div>
              );
            })}
            <button type="submit" className="bg-[#4a4a4b] px-6 py-2 rounded font-semibold">Save Changes</button>
          </form>
        );

      case 'Events Preview':
        const fixedTitles = ['TechnoVit', 'Vibrance', 'Others'];
        const safeEvents = Array.isArray(data) ? data : [];
        const displayEvents = fixedTitles.map(title => {
          return safeEvents.find(e => e.title === title) || { title, imageA: '', imageB: '', description: '', link: `/events/${title.toLowerCase()}` };
        });

        return (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold">Fixed Events Preview (3 Cards)</h3>
            <div className="grid grid-cols-1 gap-6">
              {displayEvents.map((card, idx) => (
                <div key={idx} className="p-6 border border-[#3a3a3b] rounded-xl bg-[#1e1e1f] space-y-4">
                  <h4 className="text-xl font-bold text-blue-400">{card.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ImageUpload label="Image A (Left)" onUpload={(url) => {
                        const newData = [...displayEvents];
                        newData[idx] = { ...newData[idx], imageA: url };
                        setData(newData);
                      }} />
                      {card.imageA && <img src={card.imageA} className="h-32 w-full object-cover rounded" />}
                    </div>
                    <div>
                      <ImageUpload label="Image B (Right)" onUpload={(url) => {
                        const newData = [...displayEvents];
                        newData[idx] = { ...newData[idx], imageB: url };
                        setData(newData);
                      }} />
                      {card.imageB && <img src={card.imageB} className="h-32 w-full object-cover rounded" />}
                    </div>
                  </div>
                  <textarea 
                    className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm h-20" 
                    placeholder="Description" 
                    value={card.description || ''} 
                    onChange={(e) => {
                      const newData = [...displayEvents];
                      newData[idx] = { ...newData[idx], description: e.target.value };
                      setData(newData);
                    }} 
                  />
                  <input 
                    className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" 
                    placeholder="Link (Read-only)" 
                    value={card.link || `/events/${card.title.toLowerCase()}`} 
                    readOnly
                  />
                </div>
              ))}
            </div>
            <button onClick={() => handleUpdate()} className="bg-blue-600 px-8 py-3 rounded-lg font-bold">Save Event Previews</button>
          </div>
        );

      case 'Members Preview':
        const safeMembers = Array.isArray(data) ? data : [];
        const facultyMember = safeMembers.find(m => m.isFaculty) || { name: 'Dr. Anjali Sharma', role: 'Faculty Coordinator', image: '', instagram: '', isFaculty: true, order: -1 };
        const leadMembers = safeMembers.filter(m => !m.isFaculty).sort((a, b) => a.order - b.order);

        return (
          <div className="space-y-6 max-w-4xl">
             <div className="p-6 border-2 border-yellow-600/30 rounded-xl bg-yellow-900/10">
                <h3 className="text-lg font-bold text-yellow-500 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  Fixed: Faculty Coordinator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="Name" value={facultyMember.name || ''} onChange={(e) => {
                        const newData = safeMembers.some(m => m.isFaculty) 
                          ? safeMembers.map(m => m.isFaculty ? { ...m, name: e.target.value } : m)
                          : [...safeMembers, { ...facultyMember, name: e.target.value }];
                        setData(newData);
                      }} />
                      <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="Role" value={facultyMember.role || ''} onChange={(e) => {
                        const newData = safeMembers.some(m => m.isFaculty) 
                          ? safeMembers.map(m => m.isFaculty ? { ...m, role: e.target.value } : m)
                          : [...safeMembers, { ...facultyMember, role: e.target.value }];
                        setData(newData);
                      }} />
                      <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="LinkedIn URL" value={facultyMember.linkedin || ''} onChange={(e) => {
                        const newData = safeMembers.some(m => m.isFaculty) 
                          ? safeMembers.map(m => m.isFaculty ? { ...m, linkedin: e.target.value } : m)
                          : [...safeMembers, { ...facultyMember, linkedin: e.target.value }];
                        setData(newData);
                      }} />
                      <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="YouTube URL" value={facultyMember.youtube || ''} onChange={(e) => {
                        const newData = safeMembers.some(m => m.isFaculty) 
                          ? safeMembers.map(m => m.isFaculty ? { ...m, youtube: e.target.value } : m)
                          : [...safeMembers, { ...facultyMember, youtube: e.target.value }];
                        setData(newData);
                      }} />
                      <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="Other URL" value={facultyMember.other || ''} onChange={(e) => {
                        const newData = safeMembers.some(m => m.isFaculty) 
                          ? safeMembers.map(m => m.isFaculty ? { ...m, other: e.target.value } : m)
                          : [...safeMembers, { ...facultyMember, other: e.target.value }];
                        setData(newData);
                      }} />
                      <ImageUpload label="Profile Image" onUpload={(url) => {
                        const newData = safeMembers.some(m => m.isFaculty) 
                          ? safeMembers.map(m => m.isFaculty ? { ...m, image: url } : m)
                          : [...safeMembers, { ...facultyMember, image: url }];
                        setData(newData);
                      }} />
                   </div>
                   {facultyMember.image && <img src={facultyMember.image} className="h-32 w-32 object-cover rounded-full mx-auto border-4 border-yellow-600/20" />}
                </div>
             </div>

             <div className="flex justify-between items-center pt-4 border-t border-[#3a3a3b]">
              <h3 className="text-lg font-bold">Dynamic Lead Members</h3>
              <button 
                type="button" 
                onClick={() => setData([...safeMembers, { name: '', role: '', image: '', instagram: '', isFaculty: false, order: leadMembers.length }])}
                className="bg-blue-600 px-3 py-1 rounded text-sm"
              >Add Lead Member</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leadMembers.map((mem, idx) => (
                <div key={idx} className="p-4 border border-[#3a3a3b] rounded relative bg-[#1e1e1f]">
                   <div className="absolute top-2 right-2 flex gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          if (idx > 0) {
                            const newLeads = [...leadMembers];
                            [newLeads[idx], newLeads[idx-1]] = [newLeads[idx-1], newLeads[idx]];
                            const faculty = safeMembers.filter(m => m.isFaculty);
                            setData([...faculty, ...newLeads.map((m, i) => ({ ...m, order: i }))]);
                          }
                        }}
                        className="text-gray-400 hover:text-white"
                      >↑</button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (idx < leadMembers.length - 1) {
                            const newLeads = [...leadMembers];
                            [newLeads[idx], newLeads[idx+1]] = [newLeads[idx+1], newLeads[idx]];
                            const faculty = safeMembers.filter(m => m.isFaculty);
                            setData([...faculty, ...newLeads.map((m, i) => ({ ...m, order: i }))]);
                          }
                        }}
                        className="text-gray-400 hover:text-white"
                      >↓</button>
                      <button 
                        type="button"
                        onClick={() => {
                          const faculty = safeMembers.filter(m => m.isFaculty);
                          const remainingLeads = leadMembers.filter(m => m !== mem);
                          setData([...faculty, ...remainingLeads]);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >✕</button>
                   </div>
                  <div className="space-y-2 mt-4">
                    <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="Name" value={mem.name || ''} onChange={(e) => {
                      const newData = safeMembers.map(m => m === mem ? { ...m, name: e.target.value } : m);
                      setData(newData);
                    }} />
                    <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="Role" value={mem.role || ''} onChange={(e) => {
                      const newData = safeMembers.map(m => m === mem ? { ...m, role: e.target.value } : m);
                      setData(newData);
                    }} />
                    <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="Instagram URL" value={mem.instagram || ''} onChange={(e) => {
                      const newData = safeMembers.map(m => m === mem ? { ...m, instagram: e.target.value } : m);
                      setData(newData);
                    }} />
                    <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="LinkedIn URL" value={mem.linkedin || ''} onChange={(e) => {
                      const newData = safeMembers.map(m => m === mem ? { ...m, linkedin: e.target.value } : m);
                      setData(newData);
                    }} />
                    <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="YouTube URL" value={mem.youtube || ''} onChange={(e) => {
                      const newData = safeMembers.map(m => m === mem ? { ...m, youtube: e.target.value } : m);
                      setData(newData);
                    }} />
                    <input className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" placeholder="Other URL" value={mem.other || ''} onChange={(e) => {
                      const newData = safeMembers.map(m => m === mem ? { ...m, other: e.target.value } : m);
                      setData(newData);
                    }} />
                    <ImageUpload label="Profile Image" onUpload={(url) => {
                       const newData = safeMembers.map(m => m === mem ? { ...m, image: url } : m);
                       setData(newData);
                    }} />
                    {mem.image && <img src={mem.image} className="h-20 w-20 object-cover rounded-full mx-auto" />}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => handleUpdate()} className="bg-[#4a4a4b] px-6 py-2 rounded font-semibold w-full">Save Members Preview</button>
          </div>
        );

      case 'Site Designers':
        const designers = Array.isArray(data) ? data : [];
        const isSaved = designers.length >= 4 && designers[0]?._id; // Crude check if they come from DB and exist
        
        return (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold">Site Designing Team (Fixed Footer Block)</h3>
            <p className="text-sm text-yellow-500 mb-4">Note: Once 4 designers are saved, they cannot be updated or deleted from this panel.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((idx) => {
                const member = designers[idx] || { name: '', linkedin: '', otherLink: '' };
                return (
                  <div key={idx} className="p-4 border border-[#3a3a3b] rounded bg-[#1e1e1f] space-y-3">
                    <h4 className="font-semibold text-[#bfc1c3]">Designer {idx + 1}</h4>
                    <input 
                      className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm disabled:opacity-50" 
                      placeholder="Name" 
                      value={member.name || ''} 
                      disabled={isSaved}
                      onChange={(e) => {
                        const newData = [...designers];
                        newData[idx] = { ...member, name: e.target.value };
                        setData(newData);
                      }} 
                    />
                    <input 
                      className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm disabled:opacity-50" 
                      placeholder="LinkedIn URL" 
                      value={member.linkedin || ''} 
                      disabled={isSaved}
                      onChange={(e) => {
                        const newData = [...designers];
                        newData[idx] = { ...member, linkedin: e.target.value };
                        setData(newData);
                      }} 
                    />
                    <input 
                      className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm disabled:opacity-50" 
                      placeholder="Other URL" 
                      value={member.otherLink || ''} 
                      disabled={isSaved}
                      onChange={(e) => {
                        const newData = [...designers];
                        newData[idx] = { ...member, otherLink: e.target.value };
                        setData(newData);
                      }} 
                    />
                  </div>
                );
              })}
            </div>
            
            {!isSaved && (
              <button 
                onClick={() => {
                  if (designers.filter(d => d.name).length !== 4) {
                    alert('Please fill in all 4 designers before saving.');
                    return;
                  }
                  handleUpdate();
                }} 
                className="bg-blue-600 px-8 py-3 rounded-lg font-bold w-full"
              >
                Save Site Designers Permanently
              </button>
            )}
          </div>
        );

      case 'Contact':
        return (
          <form onSubmit={handleUpdate} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Email</label>
              <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded" value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Phone</label>
              <input className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded" value={data.phone || ''} onChange={(e) => setData({...data, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Address</label>
              <textarea className="w-full bg-[#1e1e1f] border border-[#3a3a3b] p-2 rounded h-24" value={data.address || ''} onChange={(e) => setData({...data, address: e.target.value})} />
            </div>
            <button type="submit" className="bg-[#4a4a4b] px-6 py-2 rounded font-semibold">Save Changes</button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Home Page Content</h2>
      
      <div className="flex gap-4 border-b border-[#3a3a3b] mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-2 px-1 text-sm font-medium ${activeTab === tab ? 'text-white border-b-2 border-white' : 'text-[#bfc1c3] hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
