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
    if (!confirm(`Are you sure you want to delete year ${yearName}? This will not delete members, but they will no longer be grouped under this year.`)) return;
    try {
      const res = await fetch(`/api/years/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedYear === yearName) setSelectedYear('General');
        fetchYears();
      }
    } catch (err) {
      alert('Delete failed');
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
        .filter(line => line.length > 0 && line.includes(','))
        .map(line => {
          const parts = line.split(',');
          const name = parts[0]?.trim();
          const regNo = parts[1]?.trim();
          const role = parts.slice(2).join(',').trim() || (selectedYear === 'General' ? 'Team' : 'Core');
          return { 
            name, 
            regNo, 
            role, 
            type: selectedYear === 'General' ? 'General' : 'Lead',
            year: selectedYear === 'General' ? '' : selectedYear
          };
        });

      if (data.length === 0) {
        alert('No valid members found to add. Format: Name, RegNo, Role');
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

    const data = Object.fromEntries(formData.entries());
    data.type = selectedYear === 'General' ? 'General' : 'Lead';
    data.year = selectedYear === 'General' ? '' : selectedYear;
    
    // Convert social links
    data.socialLinks = {
      instagram: data.instagram,
      facebook: data.facebook,
      linkedin: data.linkedin,
      otherLink: data.otherLink
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
        <h2 className="text-3xl font-bold">Manage Club Leads</h2>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowYearForm(true)}
            className="bg-[#2d2e30] hover:bg-[#3a3a3b] border border-[#3a3a3b] px-4 py-2 rounded font-semibold transition-colors"
          >Manage Years</button>
          <button 
            onClick={() => { setEditingMember({}); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
          >+ Add Member to {selectedYear}</button>
        </div>
      </div>

      {/* Year Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#3a3a3b] pb-4">
        {years.map(y => (
          <div key={y._id} className="flex items-center">
             <button 
              onClick={() => setSelectedYear(y.year)}
              className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${selectedYear === y.year ? 'bg-blue-600 text-white' : 'text-[#bfc1c3] hover:text-white'}`}
            >
              {y.year}
            </button>
          </div>
        ))}
        <button 
          onClick={() => setSelectedYear('General')}
          className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${selectedYear === 'General' ? 'bg-blue-600 text-white' : 'text-[#bfc1c3] hover:text-white'}`}
        >
          General Members
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#1e1e1f] p-4 rounded-xl border border-[#3a3a3b]">
        <h3 className="text-xl font-bold">
          {selectedYear === 'General' ? 'General Members' : `Leads for ${selectedYear}`}
        </h3>
        <input 
          placeholder="Search by name or role..." 
          className="bg-[#2d2e30] border border-[#3a3a3b] px-4 py-2 rounded-lg text-sm w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Manage Years Modal */}
      {showYearForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
           <div className="bg-[#1e1e1f] border border-[#3a3a3b] p-8 rounded-2xl w-full max-w-md">
              <h3 className="text-2xl font-bold mb-4">Manage Lead Years</h3>
              <form onSubmit={handleAddYear} className="flex gap-2 mb-6">
                 <input 
                    placeholder="e.g. 2026-2027" 
                    className="flex-1 bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded"
                    value={newYearName}
                    onChange={(e) => setNewYearName(e.target.value)}
                    required
                 />
                 <button type="submit" className="bg-blue-600 px-4 py-2 rounded font-bold">Add</button>
              </form>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                 {years.map(y => (
                    <div key={y._id} className="flex justify-between items-center bg-[#2d2e30] p-3 rounded border border-[#3a3a3b]">
                       <span>{y.year}</span>
                       <button onClick={() => handleDeleteYear(y._id, y.year)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                    </div>
                 ))}
              </div>
              <button onClick={() => setShowYearForm(false)} className="w-full mt-6 bg-[#2d2e30] py-2 rounded font-bold">Close</button>
           </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1f] border border-[#3a3a3b] p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">{editingMember?._id ? 'Edit' : 'Add'} Member to {selectedYear}</h3>
            <form onSubmit={handleSubmitMember} className="space-y-4">
              {!editingMember?._id ? (
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">
                    Bulk Add Members (One per line, Format: Name, RegNo, Role)
                  </label>
                  <textarea 
                    name="bulkMembers"
                    className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded h-40 font-mono text-sm"
                    placeholder="John Doe, 21BCE0000, President\nJane Smith, 21BCE0001, Vice President"
                  />
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Full Name</label>
                  <input name="name" required={!!editingMember?._id} className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.name} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Reg No</label>
                  <input name="regNo" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.regNo} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Role / Position</label>
                  <input name="role" required={!!editingMember?._id} className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.role} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Department (optional)</label>
                  <input name="department" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.department} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Profile Image</label>
                <ImageUpload 
                  value={editingMember?.image} 
                  onChange={(url) => setEditingMember({...editingMember, image: url})} 
                />
              </div>

              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Bio (optional)</label>
                <textarea name="bio" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded h-24" defaultValue={editingMember?.bio} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Instagram URL</label>
                  <input name="instagram" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" defaultValue={editingMember?.socialLinks?.instagram} />
                </div>
                 <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">LinkedIn URL</label>
                  <input name="linkedin" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" defaultValue={editingMember?.socialLinks?.linkedin} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Other Link URL</label>
                  <input name="otherLink" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded text-sm" defaultValue={editingMember?.socialLinks?.otherLink} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Save Member</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#2d2e30] hover:bg-[#3a3a3b] py-2 rounded font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">Loading members...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div key={member._id} className="bg-[#1e1e1f] border border-[#3a3a3b] rounded-2xl overflow-hidden flex flex-col group p-6">
              <div className="flex gap-4 items-start mb-4">
                {member.image ? (
                   <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover border border-[#3a3a3b]" />
                ) : (
                   <div className="w-16 h-16 rounded-full bg-[#2d2e30] border border-[#3a3a3b] flex items-center justify-center text-xl font-bold">
                      {member.name[0]}
                   </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold">{member.name}</h4>
                      <p className="text-blue-400 text-sm font-semibold">{member.role}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingMember(member); setShowForm(true); }} className="p-1 hover:bg-white/10 rounded"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                      <button onClick={() => handleDeleteMember(member._id)} className="p-1 hover:bg-red-600/20 text-red-500 rounded"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                    </div>
                  </div>
                  {member.regNo && <p className="text-[#bfc1c3] text-xs mt-1">{member.regNo}</p>}
                </div>
              </div>
              <p className="text-[#bfc1c3] text-sm line-clamp-2 mb-4 italic">"{member.bio || 'No bio...'}"</p>
              <div className="flex gap-2 mt-auto">
                 {member.socialLinks?.instagram && <span className="text-xs bg-[#2d2e30] px-2 py-1 rounded">IG</span>}
                 {member.socialLinks?.linkedin && <span className="text-xs bg-[#2d2e30] px-2 py-1 rounded">LI</span>}
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && <p className="text-[#bfc1c3] col-span-full text-center py-20">No members found for this category.</p>}
        </div>
      )}
    </div>
  );
}
