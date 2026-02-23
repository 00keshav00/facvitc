'use client';

import React, { useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function ImageUpload({ onUpload, label, multiple = false }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const maxSize = 5 * 1024 * 1024 * 1024; // 5GB (Vercel Pro Limit)

      const uploadFile = async (file) => {
        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" is too large. The highest permitted size from Vercel is 5GB (Pro).`);
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = Date.now() + '_' + safeName;

        const newBlob = await upload(filename, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });

        return newBlob.url;
      };

      if (multiple) {
        const uploadedUrls = [];
        for (const file of files) {
          try {
            const url = await uploadFile(file);
            if (url) uploadedUrls.push(url);
          } catch (err) {
            console.error(err);
            alert(err.message);
          }
        }
        if (uploadedUrls.length > 0) {
          onUpload(uploadedUrls);
        }
      } else {
        const url = await uploadFile(files[0]);
        if (url) onUpload(url);
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
