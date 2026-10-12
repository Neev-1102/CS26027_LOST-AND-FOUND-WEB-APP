import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ItemImageUploader = ({ images = [], onChange, maxImages = 3, label = 'Upload Images' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const newImageUrls = [];
      for (const file of files) {
        // If backend API URL configured, upload to /api/upload
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (res.data?.fileUrl) {
            newImageUrls.push(res.data.fileUrl);
          }
        } catch {
          // Fallback to FileReader base64 preview
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          const base64 = await base64Promise;
          newImageUrls.push(base64);
        }
      }

      onChange([...images, ...newImageUrls]);
    } catch (err) {
      setError(err.message || 'Error processing image upload.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      {/* Preview thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group">
              <img src={img} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {images.length < maxImages && (
        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center text-blue-600 gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-semibold">Uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500 gap-2">
              <UploadCloud className="w-8 h-8 text-blue-500" />
              <span className="text-sm font-semibold text-slate-700">Click to upload photo</span>
              <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB ({images.length}/{maxImages})</span>
            </div>
          )}
        </label>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default ItemImageUploader;
