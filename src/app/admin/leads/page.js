'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function MembersAdmin() {
  const [members, setMembers] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showYearForm, setShowYearForm] = useState(false);
  const [newYearName, setNewYearName] = useState('');

  useEffect(() => {
    fetchYears();
    // Auto-cleanup legacy general members on load
    fetch('/api/admin/cleanup-general', { method: 'POST' }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchMembers();
    }
  }, [selectedYear]);

  const fetchYears = async () => {
    try {
      const res = await fetch('/api/years');
      const data = await res.json();
      setYears(data);
      if (data.length > 0 && !selectedYear) {
        setSelectedYear(data[0].year);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      let url = `/api/members?type=Lead&year=${selectedYear}`;
      const res = await fetch(url);
      const json = await res.json();
      setMembers(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddYear = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: newYearName })
      });
      if (res.ok) {
        setNewYearName('');
        setShowYearForm(false);
        fetchYears();
      } else {
        alert('Failed to add year');
      }
    } catch (err) {
      alert('Error adding year');
    }
  };

  const handleDeleteYear = async (id, yearName) => {
    if (!confirm(`Are you sure you want to delete year ${yearName}? members will no longer be grouped under this year.`)) return;
    try {
      const res = await fetch(`/api/years/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchYears();
      } else {
        const data = await res.json();
        alert(`Delete failed: ${data.error || res.statusText}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed: Network error or server crash');
    }
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Check if bulk insert
    if (!editingMember?._id && formData.get('bulkMembers')) {
      const bulkText = formData.get('bulkMembers');
      const data = bulkText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const parts = line.split(',').map(p => p.trim());
          const name = parts[0] || '';
          const role = parts[1] || 'Core';
          const bio = parts[2] || '';
          return { 
            name, 
            role, 
            bio,
            type: 'Lead',
            year: selectedYear
          };
        })
        .filter(item => item.name !== '');

      if (data.length === 0) {
        alert('No valid members found to add. Format: Name, Role, Bio (optional)');
        return;
      }

      try {
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          setShowForm(false);
          setEditingMember(null);
          fetchMembers();
        } else {
          alert('Bulk add failed');
        }
      } catch (err) {
        alert('Operation failed');
      }
      return;
    }

    const formDataObj = Object.fromEntries(formData.entries());
    const data = {
      name: formDataObj.name,
      role: formDataObj.role,
      department: formDataObj.department,
      bio: formDataObj.bio,
      type: 'Lead',
      year: selectedYear,
      socialLinks: {
        instagram: formDataObj.instagram,
        facebook: formDataObj.facebook,
        linkedin: formDataObj.linkedin,
        otherLink: formDataObj.otherLink
      }
    };
    
    if (editingMember?.image) {
      data.image = editingMember.image;
    }

    try {
      const url = editingMember?._id ? `/api/members/${editingMember._id}` : '/api/members';
      const method = editingMember?._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowForm(false);
        setEditingMember(null);
        fetchMembers();
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/members/${id}`, { method: 'DELETE' });
      fetchMembers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Manage Club Leads</h2>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowYearForm(true)}
            className="bg-[#2d2e30] hover:bg-[#3a3a3b] border border-[#3a3a3b] px-4 py-2 rounded font-semibold transition-colors"
          >Manage Years</button>
          <button 
            onClick={() => { setEditingMember({}); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors shadow-lg"
          >+ Add Member to {selectedYear}</button>
        </div>
      </div>

      {/* Year Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#3a3a3b] pb-4">
        {years.map(y => (
          <button 
            key={y._id}
            onClick={() => setSelectedYear(y.year)}
            className={`px-6 py-2 rounded-t-lg font-bold transition-all ${selectedYear === y.year ? 'bg-blue-600 text-white shadow-md' : 'text-[#bfc1c3] hover:text-white hover:bg-white/5'}`}
          >
            {y.year}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#1e1e1f] p-4 rounded-xl border border-[#3a3a3b]">
        <h3 className="text-xl font-bold text-blue-400">
          Leads for {selectedYear}
        </h3>
        <input 
          placeholder="Search by name or role..." 
          className="bg-[#2d2e30] border border-[#3a3a3b] px-4 py-2 rounded-lg text-sm w-full md:w-64 focus:border-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Manage Years Modal */}
      {showYearForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
           <div className="bg-[#1e1e1f] border border-[#3a3a3b] p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Manage Lead Years</h3>
              <form onSubmit={handleAddYear} className="flex gap-2 mb-6">
                 <input 
                    placeholder="e.g. 2026-2027" 
                    className="flex-1 bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded outline-none focus:border-blue-500"
                    value={newYearName}
                    onChange={(e) => setNewYearName(e.target.value)}
                    required
                 />
                 <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold transition-colors">Add</button>
              </form>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {years.map(y => (
                    <div key={y._id} className="flex justify-between items-center bg-[#2d2e30] p-3 rounded border border-[#3a3a3b] group hover:border-blue-500/50 transition-colors">
                       <span className="font-semibold">{y.year}</span>
                       <button onClick={() => handleDeleteYear(y._id, y.year)} className="text-red-500 hover:text-red-400 text-sm font-bold p-1">Delete</button>
                    </div>
                 ))}
              </div>
              <button onClick={() => setShowYearForm(false)} className="w-full mt-6 bg-[#2d2e30] hover:bg-[#3a3a3b] py-2 rounded font-bold transition-colors">Close</button>
           </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1f] border border-[#3a3a3b] p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">{editingMember?._id ? 'Edit' : 'Add'} Member to {selectedYear}</h3>
            <form onSubmit={handleSubmitMember} className="space-y-4">
              {!editingMember?._id ? (
                <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg mb-6">
                  <label className="block text-sm font-bold text-blue-400 mb-2">
                    Bulk Upload (One card per line)
                  </label>
                  <p className="text-xs text-[#bfc1c3] mb-3">Format: <code className="bg-black/30 px-1 rounded text-white">Name, Role, Bio (optional)</code></p>
                  <textarea 
                    name="bulkMembers"
                    className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-3 rounded h-40 font-mono text-sm outline-none focus:border-blue-500"
                    placeholder="John Doe, President, Dedicated leader since 2024&#10;Jane Smith, Vice President"
                  />
                  <div className="mt-2 flex items-center gap-2">
                     <div className="h-[1px] bg-[#3a3a3b] flex-1"></div>
                     <span className="text-[10px] uppercase font-bold text-gray-500">OR FILL INDIVIDUALLY BELOW</span>
                     <div className="h-[1px] bg-[#3a3a3b] flex-1"></div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Full Name</label>
                  <input name="name" required={!editingMember?._id ? false : true} className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded outline-none focus:border-blue-500" defaultValue={editingMember?.name} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Role / Position</label>
                  <input name="role" required={!editingMember?._id ? false : true} className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded outline-none focus:border-blue-500" defaultValue={editingMember?.role} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Profile Image</label>
                <ImageUpload 
                  onUpload={(url) => setEditingMember(prev => ({...prev, image: url}))} 
                />
                {editingMember?.image && (
                   <div className="mt-2 relative w-20 h-20 border border-[#3a3a3b] rounded overflow-hidden">
                      <img src={editingMember.image} className="w-full h-full object-cover" />
                   </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Bio (optional)</label>
                <textarea name="bio" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded h-24 outline-none focus:border-blue-500" defaultValue={editingMember?.bio} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Instagram URL</label>
                  <input name="instagram" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm outline-none focus:border-blue-500" defaultValue={editingMember?.socialLinks?.instagram} />
                </div>
                 <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">LinkedIn URL</label>
                  <input name="linkedin" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm outline-none focus:border-blue-500" defaultValue={editingMember?.socialLinks?.linkedin} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#bfc1c3] mb-1">Other Link URL</label>
                  <input name="otherLink" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm outline-none focus:border-blue-500" defaultValue={editingMember?.socialLinks?.otherLink} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition-colors shadow-lg">Save Member(s)</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#2d2e30] hover:bg-[#3a3a3b] py-2 rounded font-bold transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
           <p className="text-[#bfc1c3]">Loading leads...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div key={member._id} className="bg-[#1e1e1f] border border-[#3a3a3b] rounded-2xl overflow-hidden flex flex-col group p-6 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
              <div className="flex gap-4 items-start mb-4">
                {member.image ? (
                   <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#3a3a3b]" />
                ) : (
                   <div className="w-16 h-16 rounded-full bg-[#2d2e30] border-2 border-[#3a3a3b] flex items-center justify-center text-xl font-bold text-[#bfc1c3]">
                      {member.name ? member.name[0] : '?'}
                   </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="truncate pr-2">
                      <h4 className="text-lg font-bold text-white truncate">{member.name}</h4>
                      <p className="text-blue-400 text-sm font-semibold truncate">{member.role}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 bg-black/20 p-1 rounded-lg">
                      <button onClick={() => { setEditingMember(member); setShowForm(true); }} className="p-1.5 hover:bg-white/10 rounded transition-colors text-[#bfc1c3] hover:text-white" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                      <button onClick={() => handleDeleteMember(member._id)} className="p-1.5 hover:bg-red-600/20 text-red-500 rounded transition-colors hover:text-red-400" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[#bfc1c3] text-sm line-clamp-2 mb-4 italic leading-relaxed">"{member.bio || 'Fine Arts Club lead...'}"</p>
              <div className="flex gap-2 mt-auto">
                 {member.socialLinks?.instagram && <span className="text-[10px] font-bold bg-pink-600/20 text-pink-400 px-2 py-0.5 rounded uppercase tracking-wider">Instagram</span>}
                 {member.socialLinks?.linkedin && <span className="text-[10px] font-bold bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded uppercase tracking-wider">LinkedIn</span>}
                 {member.socialLinks?.otherLink && <span className="text-[10px] font-bold bg-white/10 text-[#e6e6e6] px-2 py-0.5 rounded uppercase tracking-wider">Link</span>}
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && <p className="text-[#bfc1c3] col-span-full text-center py-20 bg-[#1e1e1f] rounded-2xl border border-dashed border-[#3a3a3b]">No members found for this category.</p>}
        </div>
      )}
    </div>
  );
}
