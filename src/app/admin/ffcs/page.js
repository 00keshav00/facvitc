'use client';

import React, { useState, useEffect } from 'react';

export default function FFCSAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ffcs');
      const json = await res.json();
      setRecords(json);
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
    data.points = Number(data.points) || 0;

    try {
      const url = editingRecord ? `/api/ffcs/${editingRecord._id}` : '/api/ffcs';
      const method = editingRecord ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowForm(false);
        setEditingRecord(null);
        fetchRecords();
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/ffcs/${id}`, { method: 'DELETE' });
      fetchRecords();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filtered = records.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.regno.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">FFCS Management</h2>
        <button 
          onClick={() => { setEditingRecord(null); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition-colors"
        >+ Add Record</button>
      </div>

      <div className="bg-[#1e1e1f] p-4 rounded-xl border border-[#3a3a3b]">
        <input 
          placeholder="Search by name or reg no..." 
          className="bg-[#2d2e30] border border-[#3a3a3b] px-4 py-2 rounded-lg text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1f] border border-[#3a3a3b] p-8 rounded-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">{editingRecord ? 'Edit' : 'Add'} Record</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Full Name</label>
                <input name="name" required className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingRecord?.name} />
              </div>
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Registration Number</label>
                <input name="regno" required className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingRecord?.regno} />
              </div>
              <div>
                <label className="block text-sm text-[#bfc1c3] mb-1">Points</label>
                <input name="points" type="number" required className="w-full bg-[#2d2e30] border border-[#3a3a3b] p-2 rounded" defaultValue={editingRecord?.points || 0} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#2d2e30] hover:bg-[#3a3a3b] py-2 rounded font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-[#1e1e1f] border border-[#3a3a3b] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.04)]">
                <th className="p-4 border-b border-[#3a3a3b]">Rank</th>
                <th className="p-4 border-b border-[#3a3a3b]">Name</th>
                <th className="p-4 border-b border-[#3a3a3b]">Reg No</th>
                <th className="p-4 border-b border-[#3a3a3b]">Points</th>
                <th className="p-4 border-b border-[#3a3a3b] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, idx) => (
                <tr key={record._id} className="border-b border-[#3a3a3b] last:border-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="p-4 text-[#bfc1c3]">#{idx + 1}</td>
                  <td className="p-4 font-semibold">{record.name}</td>
                  <td className="p-4 uppercase">{record.regno}</td>
                  <td className="p-4 text-blue-400 font-bold">{record.points}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => { setEditingRecord(record); setShowForm(true); }} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(record._id)} className="text-sm bg-red-600/20 text-red-500 hover:bg-red-600/40 px-3 py-1 rounded">Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-8 text-center text-[#bfc1c3]">No records found.</p>}
        </div>
      )}
    </div>
  );
}
