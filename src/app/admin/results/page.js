'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function ResultsAdmin() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingResult, setEditingResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [membersText, setMembersText] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/results');
      const json = await res.json();
      setResults(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    if (result && result.selectedMembers) {
      setMembersText(result.selectedMembers.map(m => `${m.name},${m.regno}`).join('\n'));
    } else {
      setMembersText('');
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      department: formData.get('department'),
      order: Number(formData.get('order')) || 0,
    };
    if (editingResult?.logo) {
      data.logo = editingResult.logo;
    }
    
    // Parse membersText (CSV format line by line: Name,Regno)
    data.selectedMembers = membersText.split('\n')
      .map(line => line.trim())
      .filter(line => line.includes(','))
      .map(line => {
        const [name, ...regnoParts] = line.split(',');
        return { name: name.trim(), regno: regnoParts.join(',').trim() };
      });

    try {
      const url = editingResult?._id ? `/api/results/${editingResult._id}` : '/api/results';
      const method = editingResult?._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowForm(false);
        setEditingResult(null);
        fetchResults();
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/results/${id}`, { method: 'DELETE' });
      fetchResults();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Interview Results Management</h2>
        <button 
          onClick={() => handleEdit(null)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
        >+ Add Department</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1f] border border-[#3a3a3b] p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">{editingResult?._id ? 'Edit' : 'Add'} Department Results</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Department Name</label>
                  <input name="department" required className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingResult?.department} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Display Order</label>
                  <input name="order" type="number" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingResult?.order || 0} />
                </div>
              </div>
              
              <div>
                <ImageUpload label="Department Circular Logo" onUpload={(url) => setEditingResult({...editingResult, logo: url})} />
                {editingResult?.logo && <img src={editingResult.logo} className="w-16 h-16 object-cover rounded-full mt-2 border border-white/20" />}
              </div>

              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Selected Members (One per line, Format: Name,RegNo)</label>
                <textarea 
                  name="membersText"
                  className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded h-40 font-mono text-sm"
                  placeholder="John Doe,21BCE0000&#10;Jane Smith,21BCE0001"
                  value={membersText}
                  onChange={(e) => setMembersText(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Save Department</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#2d2e30] hover:bg-[#3a3a3b] py-2 rounded font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {results.map((dept) => (
            <div key={dept._id} className="bg-[#1e1e1f] border border-[#3a3a3b] rounded-2xl overflow-hidden shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {dept.logo ? (
                    <img src={dept.logo} className="w-12 h-12 object-cover rounded-full border border-white/20" />
                  ) : (
                    <div className="w-12 h-12 bg-[#2d2e30] rounded-full"></div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold">{dept.department}</h4>
                    <p className="text-[#bfc1c3] text-sm">Order: {dept.order} | Members: {dept.selectedMembers?.length || 0}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleEdit(dept)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm">Edit</button>
                   <button onClick={() => handleDelete(dept._id)} className="bg-red-600/20 text-red-500 hover:bg-red-600/40 px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {results.length === 0 && <p className="text-[#bfc1c3] text-center py-10">No department results found.</p>}
        </div>
      )}
    </div>
  );
}
