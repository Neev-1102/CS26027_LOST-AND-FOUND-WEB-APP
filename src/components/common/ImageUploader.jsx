import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const ImageUploader = ({
  label = 'Upload Image',
  value,
  onChange,
  error,
  helperText = 'PNG, JPG or WEBP up to 5MB'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onChange) onChange(reader.result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removePreview = () => {
    setPreview('');
    if (onChange) onChange('', null);
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group h-56 flex items-center justify-center">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={removePreview}
              className="p-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-transform hover:scale-105 shadow-lg"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <span className="absolute bottom-3 left-3 bg-slate-900/70 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm">
            Preview Ready
          </span>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all bg-slate-50/50 hover:bg-slate-50 cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
              : error
              ? 'border-rose-300 bg-rose-50/30'
              : 'border-slate-300 hover:border-blue-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
          />
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Click to upload <span className="font-normal text-slate-500">or drag & drop image</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
