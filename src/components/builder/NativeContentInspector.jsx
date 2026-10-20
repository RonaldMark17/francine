import { CORE_COLLECTIONS, getCoreFields } from '../../data/coreCollections';
import CoreCollectionInspector from './CoreCollectionInspector';
import { useState } from 'react';
import { Image, Search, Type, RotateCcw } from 'lucide-react';
import { CORE_CONTENT_FIELDS } from '../../data/coreContentFields';

export default function NativeContentInspector({ route, title, values, onChange, onChooseImage, selectedField }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('text');
  const fields = getCoreFields(route, values, CORE_CONTENT_FIELDS[route] || []).filter(field =>
    (!selectedField || field.id === selectedField) &&
    (selectedField || (tab === 'images' ? field.kind === 'image' : field.kind !== 'image')) &&
    (selectedField || `${field.label || ''} ${field.defaultValue} ${values[field.id] ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  );
  const reset = id => {
    const next = { ...values };
    delete next[id];
    onChange(next);
  };
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-amber-300 mb-2">Page content</p>
        <h2 className="text-lg text-white font-medium">{title}</h2>
        <p className="mt-2 text-xs text-neutral-400 leading-relaxed">Click text in the preview to type directly, or select an image to replace it here. Publish when ready.</p>
      </div>
      {(CORE_COLLECTIONS[route] || []).map(definition => <CoreCollectionInspector key={definition.id} definition={definition} values={values} onChange={onChange} />)}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-neutral-950 p-1 border border-neutral-800" role="group" aria-label="Content type">
        {[['text', Type, 'Text'], ['images', Image, 'Images']].map(([id, Icon, label]) => (
          <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs transition-colors ${tab === id ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}><Icon className="w-3.5 h-3.5" />{label}</button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-neutral-500" />
        <input aria-label="Search page content" placeholder="Find content…" value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded-lg bg-neutral-950 border border-neutral-700 pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-300" />
      </div>
      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{fields.length} editable {tab === 'images' ? 'images' : 'text fields'}</p>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-neutral-700/70 bg-neutral-800/40 p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor={`native-${field.id}`} className="text-[10px] text-neutral-400 uppercase tracking-wider">{field.label || `${field.kind === 'image' ? 'Image' : 'Text'} ${index + 1}`}</label>
              {Object.hasOwn(values, field.id) && <button type="button" onClick={() => reset(field.id)} className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white"><RotateCcw className="w-3 h-3" />Reset</button>}
            </div>
            {field.kind === 'image' && (values[field.id] ?? field.defaultValue) && <div className="rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden"><img src={values[field.id] ?? field.defaultValue} alt="Selected page image" className="w-full h-32 object-contain p-2" /></div>}
            <textarea id={`native-${field.id}`} aria-label={field.label || field.defaultValue} rows={field.kind === 'image' ? 2 : Math.min(6, Math.max(2, Math.ceil((values[field.id] ?? field.defaultValue).length / 38)))} value={values[field.id] ?? field.defaultValue} onChange={event => onChange({ ...values, [field.id]: event.target.value })} className="block w-full rounded-lg bg-neutral-950 border border-neutral-700 px-3 py-2.5 text-xs leading-relaxed text-neutral-100 resize-y focus:outline-none focus:border-amber-300" />
            {field.kind === 'image' && <button type="button" onClick={() => onChooseImage(field.id)} className="w-full rounded-lg border border-neutral-600 py-2 text-xs text-white hover:bg-neutral-700 transition-colors">Choose image</button>}
          </div>
        ))}
        {!fields.length && <p className="py-8 text-center text-neutral-500 text-xs">No matching content found.</p>}
      </div>
    </div>
  );
}
