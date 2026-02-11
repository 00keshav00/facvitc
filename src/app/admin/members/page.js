'use client';

import React, { useState, useEffect } from 'react';

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', year: '', specialization: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch('/api/members');
    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/members/${editingId}` : '/api/members';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: '', role: '', year: '', specialization: '' });
      setEditingId(null);
      fetchMembers();
    }
  };

  const handleEdit = (member) => {
    setFormData({ 
      name: member.name, 
      role: member.role, 
      year: member.year, 
      specialization: member.specialization 
    });
    setEditingId(member._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMembers();
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Members</h2>

      <div className="bg-[#2d2e30] p-6 rounded-xl border border-[rgba(255,255,255,0.08)] mb-8">
        <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Member' : 'Add New Member'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Name" className="p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
          />
          <input 
            type="text" placeholder="Role" className="p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required
          />
          <input 
            type="text" placeholder="Year (e.g. 1st Year)" className="p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
            value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required
          />
          <input 
            type="text" placeholder="Specialization" className="p-2 rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] text-white"
            value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}
          />
          <div className="md:col-span-2">
            <button type="submit" className="bg-[#e6e6e6] text-black px-4 py-2 rounded font-bold hover:bg-white transition">
              {editingId ? 'Update Member' : 'Add Member'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData({ name: '', role: '', year: '', specialization: '' })}} className="ml-4 text-[#bfc1c3] hover:text-white">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-[#2d2e30] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[rgba(255,255,255,0.04)]">
            <tr>
              <th className="p-4 border-b border-[rgba(255,255,255,0.08)]">Name</th>
              <th className="p-4 border-b border-[rgba(255,255,255,0.08)]">Role</th>
              <th className="p-4 border-b border-[rgba(255,255,255,0.08)]">Year</th>
              <th className="p-4 border-b border-[rgba(255,255,255,0.08)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member._id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                <td className="p-4">{member.name}</td>
                <td className="p-4">{member.role}</td>
                <td className="p-4">{member.year}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(member)} className="text-blue-400 hover:text-blue-300">Edit</button>
                  <button onClick={() => handleDelete(member._id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
