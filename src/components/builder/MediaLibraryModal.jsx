import ModalOverlay from '../ModalOverlay';
import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import { 
  X, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  Search, 
  Filter, 
  FileText 
} from 'lucide-react';

export default function MediaLibraryModal({ isOpen, onClose, onSelectImage }) {
  const { mediaLibrary, addMediaItem, deleteMediaItem } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const fileInputRef = useRef(null);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const categories = ['All', 'Products', 'Banners', 'Services', 'Uploads'];

  const filteredMedia = mediaLibrary.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const newMedia = {
        id: `med-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: event.target.result,
        category: 'Uploads',
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      await addMediaItem(newMedia);
      setSelectedMediaId(newMedia.id);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSelect = () => {
    const found = mediaLibrary.find(m => m.id === selectedMediaId);
    if (found && onSelectImage) {
      onSelectImage(found.url);
      onClose();
    }
  };

  return (
    <ModalOverlay
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[85dvh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden my-auto animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: Keep fixed at top */}
        <div className="flex-shrink-0 p-5 border-b border-neutral-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-black" />
            <div>
              <h2 className="text-sm font-editorial uppercase tracking-[0.18em] text-black font-semibold">
                Store Media Library &amp; Assets
              </h2>
              <p className="text-[10px] text-neutral-400 font-light">
                Manage, preview, and select high-resolution images for pages and products
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Upload Bar: Fixed below header */}
        <div className="flex-shrink-0 p-4 sm:px-6 bg-white border-b border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 border transition-all ${
                  activeCategory === cat 
                    ? 'border-black bg-black text-white font-medium' 
                    : 'border-neutral-200 text-neutral-600 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Upload Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="w-full pl-8 pr-3 py-1.5 border border-neutral-300 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-neutral-800 transition-colors uppercase tracking-wider text-[11px] font-medium shrink-0 rounded"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Enable vertical scroll */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-neutral-50/50">
          {filteredMedia.length === 0 ? (
            <div className="col-span-full py-16 text-center text-neutral-400 text-xs">
              No media assets match your filter. Upload a new image to get started.
            </div>
          ) : (
            filteredMedia.map(item => {
              const isSelected = selectedMediaId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMediaId(item.id)}
                  className={`group relative bg-white border cursor-pointer transition-all overflow-hidden rounded-lg ${
                    isSelected ? 'border-black ring-2 ring-black shadow-md' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 space-y-0.5">
                    <p className="text-[11px] font-medium text-black truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                      <span>{item.size}</span>
                      <span>{item.uploadedAt || item.uploadDate || 'Recent'}</span>
                    </div>
                  </div>

                  {/* Delete button on hover */}
                  {!item.isReferenced && <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${item.name}" from media library?`)) {
                        await deleteMediaItem(item.id);
                        if (selectedMediaId === item.id) setSelectedMediaId(null);
                      }
                    }}
                    className="absolute top-2 left-2 p-1 bg-white/90 hover:bg-rose-600 hover:text-white text-neutral-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm rounded"
                    title="Delete image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer: Keep fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 font-light">
            {selectedMediaId ? '1 asset selected' : 'Click on an image to select'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            {onSelectImage && (
              <button
                disabled={!selectedMediaId}
                onClick={handleConfirmSelect}
                className="px-5 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Use Selected Image
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
