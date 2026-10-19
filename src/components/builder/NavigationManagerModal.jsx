import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Menu, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Trash2, 
  Check, 
  ExternalLink,
  Layers
} from 'lucide-react';

export default function NavigationManagerModal({ isOpen, onClose }) {
  const { 
    navigationConfig, 
    updateNavigationConfig, 
    customPages, 
    showToast 
  } = useApp();

  const [activeMenuTab, setActiveMenuTab] = useState('headerNav'); // 'headerNav' | 'footerNav'
  const [items, setItems] = useState(() => {
    return JSON.parse(JSON.stringify(navigationConfig[activeMenuTab] || []));
  });

  // New item draft form
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [selectedPageSlug, setSelectedPageSlug] = useState('');
  const [customPath, setCustomPath] = useState('');

  if (!isOpen) return null;

  // Switch between headerNav and footerNav
  const handleSwitchTab = (tab) => {
    setActiveMenuTab(tab);
    setItems(JSON.parse(JSON.stringify(navigationConfig[tab] || [])));
    setIsAddingItem(false);
  };

  const handleMove = (idx, delta) => {
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const reordered = [...items];
    const temp = reordered[idx];
    reordered[idx] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    // update order numbers
    const updated = reordered.map((it, i) => ({ ...it, order: i + 1 }));
    setItems(updated);
  };

  const handleToggleVisibility = (idx) => {
    const updated = [...items];
    updated[idx].visible = !updated[idx].visible;
    setItems(updated);
  };

  const handleDelete = (idx) => {
    const updated = items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, order: i + 1 }));
    setItems(updated);
  };

  const handleUpdateLabel = (idx, newText) => {
    const updated = [...items];
    updated[idx].label = newText;
    setItems(updated);
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    let path = customPath.trim();
    let isCustom = false;

    if (selectedPageSlug) {
      path = selectedPageSlug;
      isCustom = true;
    }

    const newItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      path: path || 'home',
      isCustom,
      visible: true,
      order: items.length + 1
    };

    const updated = [...items, newItem];
    setItems(updated);
    setNewLabel('');
    setSelectedPageSlug('');
    setCustomPath('');
    setIsAddingItem(false);
  };

  const handleSaveAndApply = () => {
    updateNavigationConfig(activeMenuTab, items);
    showToast(`Updated ${activeMenuTab === 'headerNav' ? 'Header' : 'Footer'} navigation!`, 'success');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white max-w-2xl w-full border border-neutral-300 shadow-2xl p-6 space-y-5 animate-modal-pop text-xs text-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-black" />
            <div>
              <h3 className="font-editorial text-base uppercase tracking-wider text-black font-semibold">
                Store Navigation Menu Manager
              </h3>
              <p className="text-[10px] text-neutral-400 font-light">
                Configure header and footer links, reorder items, and link dynamic custom pages
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Header Nav vs Footer Nav */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => handleSwitchTab('headerNav')}
            className={`py-2 px-4 uppercase tracking-wider text-[11px] font-semibold border-b-2 transition-all ${
              activeMenuTab === 'headerNav' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Main Header Navigation
          </button>
          <button
            onClick={() => handleSwitchTab('footerNav')}
            className={`py-2 px-4 uppercase tracking-wider text-[11px] font-semibold border-b-2 transition-all ${
              activeMenuTab === 'footerNav' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Footer Links Menu
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3 border flex items-center justify-between gap-3 bg-white transition-all ${
                item.visible ? 'border-neutral-200' : 'border-dashed border-neutral-300 opacity-60 bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1">
                <span className="w-5 h-5 bg-neutral-100 text-[10px] text-neutral-500 font-mono flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateLabel(idx, e.target.value)}
                  className="font-medium text-black border-b border-transparent hover:border-neutral-300 focus:border-black focus:outline-none px-1 py-0.5"
                />

                <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 bg-neutral-100 truncate max-w-[140px]">
                  {item.path}
                </span>
                {item.isCustom && (
                  <span className="text-[9px] uppercase tracking-wider px-1 bg-amber-100 text-amber-900 border border-amber-300">
                    Custom Page
                  </span>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleToggleVisibility(idx)}
                  className={`p-1.5 transition-colors ${item.visible ? 'text-emerald-700 hover:text-emerald-900' : 'text-neutral-400'}`}
                  title={item.visible ? 'Visible on storefront' : 'Hidden from storefront'}
                >
                  {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600"
                  title="Remove Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Link Form Toggle */}
        {!isAddingItem ? (
          <button
            onClick={() => setIsAddingItem(true)}
            className="w-full py-2.5 border border-dashed border-neutral-300 hover:border-black text-neutral-600 hover:text-black text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Menu Item</span>
          </button>
        ) : (
          <form onSubmit={handleAddNewItem} className="p-4 bg-[#FAF9F5] border border-neutral-300 space-y-3">
            <div className="font-semibold text-black text-xs">Add Menu Item Link</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-600 mb-1">Display Label *</label>
                <input
                  type="text"
                  placeholder="e.g. Back to School"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-600 mb-1">Link to Custom Page</label>
                <select
                  value={selectedPageSlug}
                  onChange={(e) => {
                    setSelectedPageSlug(e.target.value);
                    if (e.target.value) {
                      const p = customPages.find(cp => cp.slug === e.target.value);
                      if (p && !newLabel) setNewLabel(p.title);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                >
                  <option value="">-- Or Choose Custom Page --</option>
                  {customPages.map(cp => (
                    <option key={cp.id} value={cp.slug}>
                      {cp.title} (/{cp.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!selectedPageSlug && (
              <div>
                <label className="block text-[11px] text-neutral-600 mb-1">Or Core Tab Destination</label>
                <select
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                >
                  <option value="home">Home Page (home)</option>
                  <option value="shop">Shop Catalog (shop)</option>
                  <option value="promotions">Promotions (promotions)</option>
                  <option value="services">Printing Services (services)</option>
                  <option value="tracking">Track Order (tracking)</option>
                  <option value="about">About Mama Mo (about)</option>
                  <option value="contact">Contact &amp; Store (contact)</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="px-3 py-1.5 border border-neutral-300 text-neutral-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-black text-white uppercase tracking-wider text-[11px] font-medium"
              >
                Add To List
              </button>
            </div>
          </form>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Changes will immediately update the live store header and footer.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-5 py-2 bg-black text-white uppercase tracking-wider text-xs font-semibold hover:bg-neutral-800 shadow-sm"
            >
              Save &amp; Apply Navigation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
