import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const inputClass = 'w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none focus:border-neutral-500';
const textareaClass = `${inputClass} leading-relaxed`;

const ICON_OPTIONS = [
  ['printer', 'Printer'],
  ['graduation-cap', 'Graduation Cap'],
  ['timer', 'Timer'],
  ['shield-check', 'Shield / Quality'],
  ['truck', 'Delivery Truck'],
  ['tag', 'Discount Tag'],
  ['sparkles', 'Sparkles'],
  ['package', 'Package']
];

const CATEGORY_OPTIONS = [
  'Paper Products',
  'School Supplies',
  'Printing Materials',
  'Office Supplies',
  'Specialty & Craft'
];

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-neutral-400 mb-1 font-medium">{label}</label>
      {children}
    </div>
  );
}

function ItemEditor({ title, items, onItemsChange, createItem, children }) {
  const updateItem = (index, field, value) => {
    onItemsChange(items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (index) => {
    onItemsChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-3 border-t border-neutral-800 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">{title}</span>
        <button
          type="button"
          onClick={() => onItemsChange([...items, createItem()])}
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-300 hover:text-amber-200"
        >
          <Plus className="w-3 h-3" /> Add Item
        </button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="space-y-2 border border-neutral-800 bg-neutral-950/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-neutral-500">Item {index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-neutral-500 hover:text-rose-400"
              aria-label={`Remove item ${index + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {children(item, index, updateItem)}
        </div>
      ))}
    </div>
  );
}

export default function ExtendedSectionInspector({ type, data = {}, onChange }) {
  if (type === 'features_grid') {
    const items = data.items || [];
    return (
      <div className="space-y-4">
        <Field label="Section Title">
          <input className={inputClass} value={data.title || ''} onChange={(event) => onChange('title', event.target.value)} />
        </Field>
        <Field label="Column Count">
          <select className={inputClass} value={data.columns || 4} onChange={(event) => onChange('columns', Number(event.target.value))}>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </Field>
        <ItemEditor
          title="Feature Cards"
          items={items}
          onItemsChange={(nextItems) => onChange('items', nextItems)}
          createItem={() => ({ icon: 'sparkles', title: 'New Feature', description: 'Describe this store benefit.' })}
        >
          {(item, index, updateItem) => (
            <>
              <Field label="Icon">
                <select className={inputClass} value={item.icon || 'sparkles'} onChange={(event) => updateItem(index, 'icon', event.target.value)}>
                  {ICON_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label="Title">
                <input className={inputClass} value={item.title || ''} onChange={(event) => updateItem(index, 'title', event.target.value)} />
              </Field>
              <Field label="Short Description">
                <textarea rows={3} className={textareaClass} value={item.description || ''} onChange={(event) => updateItem(index, 'description', event.target.value)} />
              </Field>
            </>
          )}
        </ItemEditor>
      </div>
    );
  }

  if (type === 'testimonials') {
    const items = data.items || [];
    return (
      <div className="space-y-4">
        <Field label="Section Title">
          <input className={inputClass} value={data.title || ''} onChange={(event) => onChange('title', event.target.value)} />
        </Field>
        <Field label="Layout Style">
          <select className={inputClass} value={data.layout || 'grid'} onChange={(event) => onChange('layout', event.target.value)}>
            <option value="grid">Cards Grid</option>
            <option value="carousel">Carousel</option>
          </select>
        </Field>
        <ItemEditor
          title="Customer Reviews"
          items={items}
          onItemsChange={(nextItems) => onChange('items', nextItems)}
          createItem={() => ({ name: 'Customer Name', role: 'Role / School', quote: 'Add the customer review.', rating: 5 })}
        >
          {(item, index, updateItem) => (
            <>
              <Field label="Customer Name">
                <input className={inputClass} value={item.name || ''} onChange={(event) => updateItem(index, 'name', event.target.value)} />
              </Field>
              <Field label="Role / School">
                <input className={inputClass} value={item.role || ''} onChange={(event) => updateItem(index, 'role', event.target.value)} />
              </Field>
              <Field label="Quote">
                <textarea rows={3} className={textareaClass} value={item.quote || ''} onChange={(event) => updateItem(index, 'quote', event.target.value)} />
              </Field>
              <Field label="Rating">
                <select className={inputClass} value={item.rating || 5} onChange={(event) => updateItem(index, 'rating', Number(event.target.value))}>
                  {[1, 2, 3, 4, 5].map(rating => <option key={rating} value={rating}>{rating} Star{rating === 1 ? '' : 's'}</option>)}
                </select>
              </Field>
            </>
          )}
        </ItemEditor>
      </div>
    );
  }

  if (type === 'pricing_table') {
    const items = data.items || [];
    return (
      <div className="space-y-4">
        <Field label="Table Header">
          <input className={inputClass} value={data.title || ''} onChange={(event) => onChange('title', event.target.value)} />
        </Field>
        <Field label="Subtitle">
          <textarea rows={2} className={textareaClass} value={data.subtitle || ''} onChange={(event) => onChange('subtitle', event.target.value)} />
        </Field>
        <ItemEditor
          title="Service Items"
          items={items}
          onItemsChange={(nextItems) => onChange('items', nextItems)}
          createItem={() => ({ service: 'New Service', spec: 'Size / specification', price: 'From ₱0', notes: 'Turnaround time' })}
        >
          {(item, index, updateItem) => (
            <>
              <Field label="Service Name"><input className={inputClass} value={item.service || ''} onChange={(event) => updateItem(index, 'service', event.target.value)} /></Field>
              <Field label="Spec / Size"><input className={inputClass} value={item.spec || ''} onChange={(event) => updateItem(index, 'spec', event.target.value)} /></Field>
              <Field label="Price"><input className={inputClass} value={item.price || ''} onChange={(event) => updateItem(index, 'price', event.target.value)} /></Field>
              <Field label="Notes"><input className={inputClass} value={item.notes || ''} onChange={(event) => updateItem(index, 'notes', event.target.value)} /></Field>
            </>
          )}
        </ItemEditor>
      </div>
    );
  }

  if (type === 'category_grid') {
    const items = data.items || [];
    return (
      <div className="space-y-4">
        <Field label="Section Title"><input className={inputClass} value={data.title || ''} onChange={(event) => onChange('title', event.target.value)} /></Field>
        <Field label="Grid Layout">
          <select className={inputClass} value={data.columns || 4} onChange={(event) => onChange('columns', Number(event.target.value))}>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </Field>
        <ItemEditor
          title="Category Cards"
          items={items}
          onItemsChange={(nextItems) => onChange('items', nextItems)}
          createItem={() => ({ category: 'School Supplies', title: 'New Category', imageUrl: '', buttonText: 'Shop Now' })}
        >
          {(item, index, updateItem) => (
            <>
              <Field label="Category">
                <select className={inputClass} value={item.category || 'School Supplies'} onChange={(event) => updateItem(index, 'category', event.target.value)}>
                  {CATEGORY_OPTIONS.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </Field>
              <Field label="Card Title"><input className={inputClass} value={item.title || ''} onChange={(event) => updateItem(index, 'title', event.target.value)} /></Field>
              <Field label="Card Image URL"><input className={`${inputClass} font-mono text-[10px]`} value={item.imageUrl || ''} onChange={(event) => updateItem(index, 'imageUrl', event.target.value)} /></Field>
              <Field label="Button Text"><input className={inputClass} value={item.buttonText || ''} onChange={(event) => updateItem(index, 'buttonText', event.target.value)} /></Field>
            </>
          )}
        </ItemEditor>
      </div>
    );
  }

  if (type === 'gallery') {
    const images = data.images || [];
    return (
      <div className="space-y-4">
        <Field label="Gallery Title"><input className={inputClass} value={data.title || ''} onChange={(event) => onChange('title', event.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Layout">
            <select className={inputClass} value={data.layout || 'grid'} onChange={(event) => onChange('layout', event.target.value)}>
              <option value="grid">3-Column Grid</option>
              <option value="masonry">Masonry</option>
            </select>
          </Field>
          <Field label="Aspect Ratio">
            <select className={inputClass} value={data.aspectRatio || 'landscape'} onChange={(event) => onChange('aspectRatio', event.target.value)}>
              <option value="square">Square</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
          <input type="checkbox" className="accent-white" checked={data.lightbox ?? true} onChange={(event) => onChange('lightbox', event.target.checked)} />
          Enable image lightbox
        </label>
        <ItemEditor
          title="Gallery Images"
          items={images}
          onItemsChange={(nextItems) => onChange('images', nextItems)}
          createItem={() => ({ url: '', caption: 'Project caption' })}
        >
          {(item, index, updateItem) => (
            <>
              <Field label="Image URL"><input className={`${inputClass} font-mono text-[10px]`} value={item.url || ''} onChange={(event) => updateItem(index, 'url', event.target.value)} /></Field>
              <Field label="Caption"><input className={inputClass} value={item.caption || ''} onChange={(event) => updateItem(index, 'caption', event.target.value)} /></Field>
            </>
          )}
        </ItemEditor>
      </div>
    );
  }

  if (type === 'location_map') {
    return (
      <div className="space-y-4">
        <Field label="Store Name"><input className={inputClass} value={data.storeName || ''} onChange={(event) => onChange('storeName', event.target.value)} /></Field>
        <Field label="Full Address"><textarea rows={3} className={textareaClass} value={data.address || ''} onChange={(event) => onChange('address', event.target.value)} /></Field>
        <Field label="Phone / Contact"><input className={inputClass} value={data.phone || ''} onChange={(event) => onChange('phone', event.target.value)} /></Field>
        <Field label="Email"><input type="email" className={inputClass} value={data.email || ''} onChange={(event) => onChange('email', event.target.value)} /></Field>
        <Field label="Opening Hours"><textarea rows={4} className={textareaClass} value={data.hours || ''} onChange={(event) => onChange('hours', event.target.value)} /></Field>
        <Field label="Optional Map Embed URL"><input className={`${inputClass} font-mono text-[10px]`} value={data.mapEmbedUrl || ''} onChange={(event) => onChange('mapEmbedUrl', event.target.value)} /></Field>
      </div>
    );
  }

  return null;
}
