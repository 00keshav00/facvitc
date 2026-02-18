'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

const categories = ['Digital Art', 'Sketch', 'Painting', 'Art for a Cause', 'Concept Art'];

export default function GalleryAdmin() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ title: '', artist: '', description: '', image: '', category: categories[0] });

  useEffect(() => {
    setNewItem({ ...newItem, category: selectedCategory });
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?category=${encodeURIComponent(selectedCategory)}`);
      const json = await res.json();
      setItems(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.image) return alert('Image is required');
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        setNewItem({ title: '', artist: '', description: '', image: '', category: selectedCategory });
        fetchGallery();
      }
    } catch (err) {
      alert('Failed to add');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchGallery();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleReorder = async (direction, index) => {
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index-1]] = [newItems[index-1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index+1]] = [newItems[index+1], newItems[index]];
    } else return;

    // Update locally
    setItems(newItems.map((item, idx) => ({ ...item, order: idx })));

    // Update DB
    await fetch('/api/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItems.map((item, idx) => ({ _id: item._id, order: idx })))
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Gallery Management</h2>
      
      <div className="flex gap-4 border-b border-[#3a3a3b] mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap pb-2 px-1 text-sm font-medium ${selectedCategory === cat ? 'text-white border-b-2 border-white' : 'text-[#bfc1c3] hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Item */}
        <div className="lg:col-span-1 bg-[#1e1e1f] p-6 rounded-xl border border-[#3a3a3b] h-fit">
          <h3 className="text-xl font-bold mb-4">Add New Artwork</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <ImageUpload label="Artwork Image" onUpload={(url) => setNewItem({...newItem, image: url})} />
            {newItem.image && <img src={newItem.image} className="w-full h-40 object-cover rounded mb-2" />}
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Title</label>
              <input 
                className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Artist</label>
              <input 
                className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded"
                value={newItem.artist}
                onChange={(e) => setNewItem({...newItem, artist: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-[#bfc1c3] mb-1">Description</label>
              <textarea 
                className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded h-20"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition-colors">Add Artwork</button>
          </form>
        </div>

        {/* List of Items */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold mb-4">{selectedCategory} Artworks</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <div key={item._id} className="bg-[#1e1e1f] border border-[#3a3a3b] rounded-lg overflow-hidden group">
                  <img src={item.image} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold truncate">{item.title || 'Untitled'}</h4>
                    <p className="text-sm text-[#bfc1c3] mb-4">by {item.artist || 'Unknown'}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                         <button onClick={() => handleReorder('up', idx)} className="text-gray-400 hover:text-white disabled:opacity-30" disabled={idx === 0}>↑</button>
                         <button onClick={() => handleReorder('down', idx)} className="text-gray-400 hover:text-white disabled:opacity-30" disabled={idx === items.length - 1}>↓</button>
                      </div>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-[#bfc1c3] col-span-2">No artworks in this category yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
