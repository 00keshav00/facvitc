'use client';

import React, { useState } from 'react';

export default function ImageUpload({ onUpload, label, multiple = false }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const maxSize = 50 * 1024 * 1024; 

      const uploadFile = async (file) => {
        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" is too large. Max size is 50MB.`);
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.url;
      };

      if (multiple) {
        const uploadedUrls = [];
        for (const file of files) {
          try {
            const url = await uploadFile(file);
            if (url) uploadedUrls.push(url);
          } catch (err) {
            console.error(err);
          }
        }
        if (uploadedUrls.length > 0 && typeof onUpload === 'function') {
          onUpload(uploadedUrls);
        }
      } else {
        const url = await uploadFile(files[0]);
        if (url && typeof onUpload === 'function') {
          onUpload(url);
        }
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (event.target) event.target.value = null;
    }
  };

  return (
    <div className="mb-4">
      {label && <label className="block mb-2 text-sm text-[#bfc1c3]">{label}</label>}
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
