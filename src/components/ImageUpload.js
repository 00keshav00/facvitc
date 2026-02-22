'use client';

import React, { useState } from 'react';

export default function ImageUpload({ onUpload, label, multiple = false }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      if (multiple) {
        const uploadedUrls = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();

          if (!res.ok) {
            console.error(data.error || 'Upload failed for a file');
            continue;
          }
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        }
        if (uploadedUrls.length > 0) {
          onUpload(uploadedUrls);
        }
      } else {
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        if (data.url) {
          onUpload(data.url);
        }
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm text-[#bfc1c3]">{label}</label>
      <input 
        type="file" 
        multiple={multiple}
        accept="image/*,video/*"
        onChange={handleFileChange} 
        disabled={uploading}
        className="block w-full text-sm text-[#bfc1c3]
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-[rgba(255,255,255,0.1)] file:text-[#e6e6e6]
          hover:file:bg-[rgba(255,255,255,0.2)]"
      />
      {uploading && <p className="text-xs text-yellow-500 mt-1">Uploading...</p>}
    </div>
  );
}
