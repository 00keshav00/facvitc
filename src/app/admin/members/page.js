'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function MembersAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('Lead');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [type]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/members?type=${type}`);
      const json = await res.json();
      setMembers(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.type = type;
    
    // Convert social links
    data.socialLinks = {
      instagram: data.instagram,
      facebook: data.facebook,
      linkedin: data.linkedin
    };

    try {
      const url = editingMember ? `/api/members/${editingMember._id}` : '/api/members';
      const method = editingMember ? 'PUT' : 'POST';
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

  const handleDelete = async (id) => {
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
        <h2 className="text-3xl font-bold">Members Management</h2>
        <button 
          onClick={() => { setEditingMember(null); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
        >+ Add {type} Member</button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#1e1e1f] p-4 rounded-xl border border-[#3a3a3b]">
        <div className="flex gap-2">
          {['Lead', 'General'].map(t => (
            <button 
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${type === t ? 'bg-white text-black' : 'bg-[#2d2e30] text-[#bfc1c3] hover:text-white'}`}
            >
              {t} Members
            </button>
          ))}
        </div>
        <input 
          placeholder="Search by name or role..." 
          className="bg-[#2d2e30] border border-[#3a3a3b] px-4 py-2 rounded-lg text-sm w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1f] border border-[#3a3a3b] p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">{editingMember ? 'Edit' : 'Add'} {type} Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Full Name</label>
                  <input name="name" required className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.name} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Role</label>
                  <input name="role" required className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.role} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Department</label>
                  <input name="department" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.department} />
                </div>
                <div>
                  <label className="block text-sm text-[#bfc1c3] mb-1">Year</label>
                  <input name="year" className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingMember?.year} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Bio</label>
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
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div key={member._id} className="bg-[#1e1e1f] border border-[#3a3a3b] rounded-2xl overflow-hidden flex flex-col group p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                  <p className="text-blue-400 text-sm font-semibold mb-1">{member.role}</p>
                  <p className="text-[#bfc1c3] text-xs">{member.department} {member.year ? `(${member.year})` : ''}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => { setEditingMember(member); setShowForm(true); }} className="bg-white/10 hover:bg-white/20 p-2 rounded text-xs">Edit</button>
                   <button onClick={() => handleDelete(member._id)} className="bg-red-600/20 hover:bg-red-600/40 text-red-500 p-2 rounded text-xs">Del</button>
                </div>
              </div>
              <p className="text-[#bfc1c3] text-sm line-clamp-3 leading-relaxed">{member.bio || 'No bio provided.'}</p>
            </div>
          ))}
          {filteredMembers.length === 0 && <p className="text-[#bfc1c3] col-span-full text-center py-20">No members found matching your search.</p>}
        </div>
      )}
    </div>
  );
}
