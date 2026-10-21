import { CORE_COLLECTIONS, getCoreFields } from '../../data/coreCollections';
import CoreCollectionInspector from './CoreCollectionInspector';
import { useState } from 'react';
import { Image, Search, Type, RotateCcw } from 'lucide-react';
import { CORE_CONTENT_FIELDS } from '../../data/coreContentFields';
import NativeSectionItemsInspector from './NativeSectionItemsInspector';

const nativeSectionDefinitions = {
  'about-hero': { title: 'About Hero', fields: [1, 2, 3, 4] },
  'about-origin': { title: 'Strategic Retail Origin', fields: Array.from({ length: 16 }, (_, index) => index + 5) },
  'about-mission-vision': { title: 'Mission & Vision', fields: [21, 22, 23, 24, 25, 26] },
  'about-usp': { title: 'Competitive Advantage', fields: Array.from({ length: 9 }, (_, index) => index + 50) },
  'about-team': { title: 'Founders & Management Team', fields: [59, 60, 61], collection: 'team' },
  'about-cta': { title: 'About Call to Action', fields: [62, 63, 64] },
};

export default function NativeContentInspector({ route, title, values, onChange, onChooseImage, onAddCollectionItem, onRemoveCollectionItem, onSelectField, selectedSection }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('text');
  const contactFields = route === '/contact' ? [
    ['contact-address', 'Physical address'],
    ['contact-hours-weekdays', 'Weekday hours'],
    ['contact-hours-saturday', 'Saturday hours'],
    ['contact-hours-sunday', 'Sunday hours'],
    ['contact-phone', 'Telephone and hotline'],
    ['contact-email', 'Email address'],
    ['contact-facebook', 'Facebook'],
    ['contact-instagram', 'Instagram'],
    ['contact-viber', 'Viber'],
  ].map(([id, label]) => ({ id, label, kind: 'text', defaultValue: '' })) : [];
  const fields = [...getCoreFields(route, values, CORE_CONTENT_FIELDS[route] || []), ...contactFields].filter(field =>
    (tab === 'images' ? field.kind === 'image' : field.kind !== 'image') &&
    `${field.label || ''} ${field.defaultValue} ${values[field.id] ?? ''}`.toLowerCase().includes(query.toLowerCase())
  );
  const definitions = CORE_COLLECTIONS[route] || [];
  const collectionFields = definitions.flatMap(definition => {
    const order = values[`collection-${definition.id}`];
    const ids = Array.isArray(order)
      ? [...definition.defaults.map((_, index) => String(index)), ...order]
      : definition.defaults.map((_, index) => String(index));
    return ids.filter((id, index) => ids.indexOf(id) === index && /^[a-zA-Z0-9-]+$/.test(id))
      .flatMap((id, index) => definition.fields.map(field => ({
        id: `${definition.id}-${id}-${field}`,
        kind: field === 'image' ? 'image' : 'text',
        label: `${definition.label} ${index + 1}: ${{ q: 'Question', a: 'Answer', image: 'Photo' }[field] || field}`,
        defaultValue: definition.defaults[Number(id)]?.[field] || ''
      })));
  });
  const allFields = [...fields, ...collectionFields];
  const visibleFields = allFields.filter(field =>
    (tab === 'images' ? field.kind === 'image' : field.kind !== 'image') &&
    `${field.label || ''} ${field.defaultValue} ${values[field.id] ?? ''}`.toLowerCase().includes(query.toLowerCase())
  );
  const reset = id => {
    const next = { ...values };
    delete next[id];
    onChange(next);
  };
  if (selectedSection) {
    const sectionTitles = { 'about-floor-layout': 'Two-Floor Purpose-Built Layout' };
    if (Array.isArray(values[`section-${selectedSection}-items`])) {
      return <NativeSectionItemsInspector sectionId={selectedSection} title={sectionTitles[selectedSection] || selectedSection.replaceAll('-', ' ')} values={values} onChange={onChange} />;
    }
    const definition = nativeSectionDefinitions[selectedSection];
    if (definition) {
      const sectionFields = (CORE_CONTENT_FIELDS[route] || []).filter(field => definition.fields.includes(Number(field.id.replace('content-', ''))));
      return <div className="space-y-4"><div><p className="mb-1 text-[10px] uppercase tracking-wider text-amber-300">Selected section</p><h2 className="text-base font-semibold text-white">{definition.title}</h2></div>
        {definition.collection && (CORE_COLLECTIONS[route] || []).filter(collection => collection.id === definition.collection).map(collection => <CoreCollectionInspector key={collection.id} definition={collection} values={values} onChange={onChange} onChooseImage={onChooseImage} onAddItem={onAddCollectionItem} onRemoveItem={onRemoveCollectionItem} />)}
        {sectionFields.map((field, index) => <div key={field.id} className="space-y-2 rounded-lg border border-neutral-700 bg-neutral-800/50 p-3"><label htmlFor={`native-${field.id}`} className="text-[10px] uppercase tracking-wider text-neutral-400">{field.label || `${field.kind === 'image' ? 'Image' : 'Text'} ${index + 1}`}</label><textarea id={`native-${field.id}`} onFocus={() => onSelectField?.(field.id)} rows={Math.min(6, Math.max(2, Math.ceil(String(values[field.id] ?? field.defaultValue).length / 42)))} value={values[field.id] ?? field.defaultValue} onChange={event => onChange({ ...values, [field.id]: event.target.value })} className="block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs leading-relaxed text-white focus:border-amber-300 focus:outline-none" /></div>)}
      </div>;
    }
    return <div className="rounded-xl border border-neutral-700 p-4 text-xs text-neutral-400"><h2 className="mb-2 font-semibold capitalize text-white">{selectedSection.replaceAll('-', ' ')}</h2>Select content in this section to edit it.</div>;
  }
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-amber-300 mb-2">Page content</p>
        <h2 className="text-lg text-white font-medium">{title}</h2>
        <p className="mt-2 text-xs text-neutral-400 leading-relaxed">Click text in the preview to type directly, or select an image to replace it here. Publish when ready.</p>
      </div>
      {(CORE_COLLECTIONS[route] || []).map(definition => <CoreCollectionInspector key={definition.id} definition={definition} values={values} onChange={onChange} onChooseImage={onChooseImage} onAddItem={onAddCollectionItem} onRemoveItem={onRemoveCollectionItem} />)}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-neutral-950 p-1 border border-neutral-800" role="group" aria-label="Content type">
        {[['text', Type, 'Text'], ['images', Image, 'Images']].map(([id, Icon, label]) => (
          <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs transition-colors ${tab === id ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}><Icon className="w-3.5 h-3.5" />{label}</button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-neutral-500" />
        <input aria-label="Search page content" placeholder="Find content…" value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded-lg bg-neutral-950 border border-neutral-700 pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-300" />
      </div>
      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{visibleFields.length} editable {tab === 'images' ? 'images' : 'text fields'}</p>
      <div className="space-y-4">
        {visibleFields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-neutral-700/70 bg-neutral-800/40 p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor={`native-${field.id}`} className="text-[10px] text-neutral-400 uppercase tracking-wider">{field.label || `${field.kind === 'image' ? 'Image' : 'Text'} ${index + 1}`}</label>
              {Object.hasOwn(values, field.id) && <button type="button" onClick={() => reset(field.id)} className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white"><RotateCcw className="w-3 h-3" />Reset</button>}
            </div>
            {field.kind === 'image' && (values[field.id] ?? field.defaultValue) && <div className="rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden"><img src={values[field.id] ?? field.defaultValue} alt="Selected page image" className="w-full h-32 object-contain p-2" /></div>}
            <textarea id={`native-${field.id}`} aria-label={field.label || field.defaultValue} onFocus={() => onSelectField?.(field.id)} rows={field.kind === 'image' ? 2 : Math.min(6, Math.max(2, Math.ceil((values[field.id] ?? field.defaultValue).length / 38)))} value={values[field.id] ?? field.defaultValue} onChange={event => onChange({ ...values, [field.id]: event.target.value })} className="block w-full rounded-lg bg-neutral-950 border border-neutral-700 px-3 py-2.5 text-xs leading-relaxed text-neutral-100 resize-y focus:outline-none focus:border-amber-300" />
            {field.kind === 'image' && <button type="button" onClick={() => onChooseImage(field.id)} className="w-full rounded-lg border border-neutral-600 py-2 text-xs text-white hover:bg-neutral-700 transition-colors">Choose image</button>}
          </div>
        ))}
        {!fields.length && <p className="py-8 text-center text-neutral-500 text-xs">No matching content found.</p>}
      </div>
    </div>
  );
}
