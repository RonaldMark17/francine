import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, GripVertical, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { useBuilderSelection } from './BuilderSelectionContext';

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
  ['package', 'Package'],
  ['map-pin', 'Location'],
  ['phone', 'Phone'],
  ['mail', 'Email'],
  ['clock', 'Store Hours']
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
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { activeItemId, setActiveItemId } = useBuilderSelection();
  const updateItem = (index, field, value) => {
    onItemsChange(items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (index) => {
    setExpandedIndex(null);
    onItemsChange(items.filter((_, itemIndex) => itemIndex !== index));
  };
  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onItemsChange(next);
  };
  const duplicateItem = index => onItemsChange([...items.slice(0, index + 1), { ...items[index] }, ...items.slice(index + 1)]);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900/80">
      <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-950 px-3 py-3"><span className="text-xs font-semibold text-white">{title}</span><span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">{items.length}</span></div>
      <div className="space-y-2 p-2.5">

      {items.map((item, index) => (
        <div key={item.id || index} className={`overflow-hidden rounded-lg border bg-neutral-800/70 shadow-sm ${activeItemId === item.id ? 'border-amber-300 ring-1 ring-amber-300/50' : 'border-neutral-700'}`}>
          <div className="flex items-center gap-1.5 px-2 py-2"><GripVertical className="h-3.5 w-3.5 shrink-0 text-neutral-500" /><span className="w-4 shrink-0 text-[10px] text-neutral-500">{index + 1}</span><button type="button" aria-expanded={expandedIndex === index} onClick={() => { setActiveItemId(item.id || null); setExpandedIndex(expandedIndex === index ? null : index); }} className="flex min-w-0 flex-1 items-center gap-2 text-left text-xs text-white"><span className="truncate">{item.name || item.title || item.service || item.category || item.q || item.caption || `Item ${index + 1}`}</span><ChevronDown className={`h-3.5 w-3.5 shrink-0 text-neutral-500 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`} /></button><div className="flex shrink-0 items-center gap-0.5"><button type="button" title="Move up" aria-label={`Move item ${index + 1} up`} disabled={!index} onClick={() => moveItem(index, -1)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" title="Move down" aria-label={`Move item ${index + 1} down`} disabled={index === items.length - 1} onClick={() => moveItem(index, 1)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" title="Duplicate" aria-label={`Duplicate item ${index + 1}`} onClick={() => duplicateItem(index)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white"><Copy className="h-3.5 w-3.5" /></button><button type="button" title="Delete" aria-label={`Delete item ${index + 1}`} onClick={() => removeItem(index)} className="rounded p-1 text-neutral-400 hover:bg-rose-950 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div></div>
          {expandedIndex === index && <div className="space-y-3 border-t border-neutral-700 p-3">{children(item, index, updateItem)}</div>}
        </div>
      ))}
      </div>
      <div className="sticky bottom-0 border-t border-neutral-700 bg-neutral-950/95 p-2.5 backdrop-blur"><button type="button" onClick={() => { onItemsChange([...items, createItem()]); setExpandedIndex(items.length); }} className="w-full rounded-lg border border-amber-300/50 py-2 text-xs text-amber-200 hover:bg-amber-300/10"><Plus className="mr-1 inline h-3.5 w-3.5" />Add {title.replace(/s$/, '')}</button></div>
    </div>
  );
}

export default function ExtendedSectionInspector({ type, data = {}, onChange }) {
  const subSections = Array.isArray(data.subSections) ? data.subSections : [];
  const updateSubSection = (index, field, value) => onChange('subSections', subSections.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  const moveSubSection = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= subSections.length) return;
    const next = [...subSections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange('subSections', next);
  };
  const nestedItemsEditor = (
    <div className="space-y-3 border-t border-neutral-800 pt-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Nested Sub-Sections / Cards ({subSections.length})</span>
        <button type="button" onClick={() => onChange('subSections', [...subSections, { id: `sub-${crypto.randomUUID()}`, eyebrow: '', title: 'New Sub-Section', description: 'Add a description.', icon: '', image: '' }])} className="text-[10px] text-amber-300 hover:text-amber-200">+ Add New</button>
      </div>
      <Field label="Grid Columns">
        <select className={inputClass} value={data.subSectionColumns || Math.min(Math.max(subSections.length, 1), 3)} onChange={event => onChange('subSectionColumns', Number(event.target.value))}>
          {[1, 2, 3, 4].map(count => <option key={count} value={count}>{count} Column{count === 1 ? '' : 's'}</option>)}
        </select>
      </Field>
      {subSections.map((item, index) => <div key={item.id || index} className="space-y-2 border border-neutral-800 bg-neutral-950/50 p-3">
        <div className="flex items-center justify-between"><span className="text-[10px] font-mono text-neutral-500">Sub-Section {index + 1}</span><div className="flex gap-2 text-xs text-amber-300"><button type="button" disabled={!index} onClick={() => moveSubSection(index, -1)} aria-label={`Move sub-section ${index + 1} up`} className="disabled:opacity-30">Up</button><button type="button" disabled={index === subSections.length - 1} onClick={() => moveSubSection(index, 1)} aria-label={`Move sub-section ${index + 1} down`} className="disabled:opacity-30">Down</button><button type="button" onClick={() => onChange('subSections', subSections.filter((_, itemIndex) => itemIndex !== index))} className="text-rose-300">Delete</button></div></div>
        <Field label="Eyebrow"><input className={inputClass} value={item.eyebrow || ''} onChange={event => updateSubSection(index, 'eyebrow', event.target.value)} /></Field>
        <Field label="Title"><input className={inputClass} value={item.title || ''} onChange={event => updateSubSection(index, 'title', event.target.value)} /></Field>
        <Field label="Description"><textarea rows={3} className={textareaClass} value={item.description || ''} onChange={event => updateSubSection(index, 'description', event.target.value)} /></Field>
        <Field label="Icon name"><input className={inputClass} value={item.icon || ''} onChange={event => updateSubSection(index, 'icon', event.target.value)} placeholder="sparkles, printer, heart..." /></Field>
        <Field label="Image URL"><input className={inputClass} value={item.image || ''} onChange={event => updateSubSection(index, 'image', event.target.value)} /></Field>
      </div>)}
    </div>
  );

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
        {nestedItemsEditor}
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
        {nestedItemsEditor}
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
        {nestedItemsEditor}
      </div>
    );
  }

  if (type === 'steps') {
    const items = data.items || [];
    return (
      <div className="space-y-4">
        <Field label="Section Title">
          <input className={inputClass} value={data.title || ''} onChange={(event) => onChange('title', event.target.value)} />
        </Field>
        <ItemEditor
          title="Order Steps"
          items={items}
          onItemsChange={(nextItems) => onChange('items', nextItems)}
          createItem={() => ({ title: 'New Step', description: 'Describe this step.' })}
        >
          {(item, index, updateItem) => (
            <>
              <Field label="Step Title">
                <input className={inputClass} value={item.title || ''} onChange={(event) => updateItem(index, 'title', event.target.value)} />
              </Field>
              <Field label="Description">
                <textarea rows={3} className={textareaClass} value={item.description || ''} onChange={(event) => updateItem(index, 'description', event.target.value)} />
              </Field>
            </>
          )}
        </ItemEditor>
        {nestedItemsEditor}
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
        {nestedItemsEditor}
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
        {nestedItemsEditor}
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
        {nestedItemsEditor}
      </div>
    );
  }

  return <div className="space-y-4">{nestedItemsEditor}</div>;
}
