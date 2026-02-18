'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function SettingsAdmin() {
  const [data, setData] = useState({
    logo: '',
    socialLinks: { instagram: '', facebook: '', linkedin: '' },
    contactDetails: { email: '', phone: '', address: '' },
    footerText: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json && Object.keys(json).length > 0) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) alert('Settings saved successfully!');
    } catch (err) {
      alert('Save failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <h2 className="text-3xl font-bold mb-6">Global Settings</h2>
      
      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Logo Section */}
        <div className="bg-[#1e1e1f] p-8 rounded-2xl border border-[#3a3a3b] shadow-xl">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Site Identity
           </h3>
           <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <ImageUpload label="Update Logo" onUpload={(url) => setData({...data, logo: url})} />
                <p className="text-xs text-[#bfc1c3]">Recommended: Transparent PNG, SVG, or high-quality WebP.</p>
              </div>
              {data.logo && (
                <div className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col items-center">
                  <p className="text-xs text-[#bfc1c3] mb-4 font-mono uppercase tracking-wider">Current Logo</p>
                  <img src={data.logo} className="h-20 w-auto object-contain" />
                </div>
              )}
           </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-[#1e1e1f] p-8 rounded-2xl border border-[#3a3a3b] shadow-xl">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span> Social Links
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-2 font-medium">Instagram URL</label>
                <input 
                  className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded-lg text-sm transition-all focus:border-pink-500 outline-none" 
                  placeholder="https://instagram.com/..."
                  value={data.socialLinks?.instagram || ''} 
                  onChange={(e) => setData({...data, socialLinks: {...(data.socialLinks || {}), instagram: e.target.value}})} 
                />
              </div>
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-2 font-medium">Facebook URL</label>
                <input 
                  className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded-lg text-sm transition-all focus:border-blue-600 outline-none" 
                  placeholder="https://facebook.com/..."
                  value={data.socialLinks?.facebook || ''} 
                  onChange={(e) => setData({...data, socialLinks: {...(data.socialLinks || {}), facebook: e.target.value}})} 
                />
              </div>
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-2 font-medium">LinkedIn URL</label>
                <input 
                  className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded-lg text-sm transition-all focus:border-blue-400 outline-none" 
                  placeholder="https://linkedin.com/company/..."
                  value={data.socialLinks?.linkedin || ''} 
                  onChange={(e) => setData({...data, socialLinks: {...(data.socialLinks || {}), linkedin: e.target.value}})} 
                />
              </div>
           </div>
        </div>

        {/* Contact Info Section */}
        <div className="bg-[#1e1e1f] p-8 rounded-2xl border border-[#3a3a3b] shadow-xl">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> Contact Details
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-2 font-medium">Public Email Address</label>
                <input 
                  className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded-lg text-sm transition-all focus:border-green-500 outline-none" 
                  placeholder="contact@facvitc.com"
                  value={data.contactDetails?.email || ''} 
                  onChange={(e) => setData({...data, contactDetails: {...(data.contactDetails || {}), email: e.target.value}})} 
                />
              </div>
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-2 font-medium">Phone Number</label>
                <input 
                  className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded-lg text-sm transition-all focus:border-green-500 outline-none" 
                  placeholder="+91 12345 67890"
                  value={data.contactDetails?.phone || ''} 
                  onChange={(e) => setData({...data, contactDetails: {...(data.contactDetails || {}), phone: e.target.value}})} 
                />
              </div>
           </div>
           <div>
              <label className="block text-sm text-[#bfc1c3] mb-2 font-medium">Physical Address</label>
              <textarea 
                className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded-lg text-sm transition-all focus:border-green-500 outline-none h-24 resize-none" 
                placeholder="VIT Vellore, Tamil Nadu, India"
                value={data.contactDetails?.address || ''} 
                onChange={(e) => setData({...data, contactDetails: {...(data.contactDetails || {}), address: e.target.value}})} 
              />
           </div>
        </div>

        {/* Footer Section */}
        <div className="bg-[#1e1e1f] p-8 rounded-2xl border border-[#3a3a3b] shadow-xl">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span> Footer Content
           </h3>
           <label className="block text-sm text-[#bfc1c3] mb-2 font-medium">Footer Copyright / Credits Text</label>
           <input 
              className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded-lg text-sm transition-all focus:border-yellow-500 outline-none" 
              placeholder="© 2024 Fine Arts Club, VIT Vellore. All Rights Reserved."
              value={data.footerText || ''} 
              onChange={(e) => setData({...data, footerText: e.target.value})} 
           />
        </div>

        <div className="fixed bottom-8 right-8">
           <button 
             type="submit" 
             className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95"
           >
             Save Global Settings
           </button>
        </div>
      </form>
    </div>
  );
}
