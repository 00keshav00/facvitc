'use client';

import React, { useState } from 'react';

export default function ImageUpload({ onUpload, label, multiple = false }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      // 50MB limit check remains for early validation
      const maxSize = 50 * 1024 * 1024; 

      const uploadFile = async (file) => {
        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" is too large. The maximum permitted size is 50MB.`);
        }

        // 3. Replace logic with standard FormData upload
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
        
        // 10. Return the optimized blob URL from the response
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
      // 4. Basic error handling
      console.error('Upload failed', error);
      alert(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input so the same file can be selected again if needed
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
