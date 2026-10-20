import { getCollectionItems } from '../../data/coreCollections';
import { useEffect, useRef, useState } from 'react';

export default function CoreCollectionInspector({ definition, values, onChange, onChooseImage }) {
  const [editingId, setEditingId] = useState(null);
  const editorRef = useRef(null);
  useEffect(() => {
    if (!editingId) return;
    editorRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    editorRef.current?.querySelector('textarea')?.focus({ preventScroll: true });
  }, [editingId]);
  const items = getCollectionItems(values, definition);
  const saveOrder = ids => onChange({ ...values, [`collection-${definition.id}`]: ids });
  const move = (index, direction) => {
    const ids = items.map(item => item.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    saveOrder(ids);
  };
  const add = source => {
    const id = `item-${Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')}`;
    const next = { ...values, [`collection-${definition.id}`]: [...items.map(item => item.id), id] };
    for (const field of definition.fields) {
      next[`${definition.id}-${id}-${field}`] = source
        ? values[`${definition.id}-${source.id}-${field}`] ?? source[field] ?? ''
        : ({ name: 'New member', role: 'Role', initials: 'NM', q: 'New question', a: 'Answer' }[field] || '');
    }
    onChange(next);
    setEditingId(id);
  };
  return <section className="rounded-xl border border-neutral-700 p-3 space-y-3">
    <h3 className="text-sm text-white">{definition.label} ({items.length})</h3>
    <p className="text-xs text-neutral-400">Add an item, then edit its text and photos here. You can also edit text in the preview.</p>
    {items.map((item, index) => <div key={item.id} className="border-b border-neutral-800 pb-3 space-y-2">
      <p className="text-xs text-white break-words">{values[`${definition.id}-${item.id}-name`] ?? values[`${definition.id}-${item.id}-q`] ?? item.name ?? item.q ?? `Item ${index + 1}`}</p>
      <button type="button" aria-expanded={editingId === item.id} aria-controls={`collection-editor-${definition.id}-${item.id}`} onClick={() => setEditingId(editingId === item.id ? null : item.id)} className="text-xs text-amber-300">{editingId === item.id ? 'Close editor' : 'Edit item'}</button>
      {editingId === item.id && <div id={`collection-editor-${definition.id}-${item.id}`} ref={editorRef} className="space-y-3">
        {definition.fields.filter(field => field !== 'image').map(field => {
          const key = `${definition.id}-${item.id}-${field}`;
          const label = { q: 'Question', a: 'Answer', name: 'Name', role: 'Role', initials: 'Initials' }[field] || field;
          return <label key={field} className="block text-xs text-neutral-400">
            {label}
            <textarea aria-label={`${definition.label} ${index + 1}: ${label}`} rows={field === 'a' ? 4 : 2} value={values[key] ?? item[field] ?? ''} onChange={event => onChange({ ...values, [key]: event.target.value })} className="mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white resize-y focus:outline-none focus:border-amber-300" />
          </label>;
        })}
      </div>}
      {definition.fields.includes('image') && <div className="space-y-2">
        {(values[`${definition.id}-${item.id}-image`] ?? item.image) && <img
          src={values[`${definition.id}-${item.id}-image`] ?? item.image}
          alt={values[`${definition.id}-${item.id}-name`] ?? item.name ?? 'Member photo'}
          className="h-16 w-16 rounded-full object-cover border border-neutral-700"
        />}
        <button type="button" onClick={() => onChooseImage(`${definition.id}-${item.id}-image`)} className="w-full rounded-lg border border-neutral-600 py-2 text-xs text-white hover:bg-neutral-700">
          {(values[`${definition.id}-${item.id}-image`] ?? item.image) ? 'Change photo' : 'Add photo'}
        </button>
        <label className="block text-xs text-neutral-400">
          Photo URL
          <input type="url" value={values[`${definition.id}-${item.id}-image`] ?? item.image ?? ''} onChange={event => onChange({ ...values, [`${definition.id}-${item.id}-image`]: event.target.value })} placeholder="https://example.com/photo.jpg" className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300" />
        </label>
        {(values[`${definition.id}-${item.id}-image`] ?? item.image) && <button type="button" onClick={() => onChange({ ...values, [`${definition.id}-${item.id}-image`]: '' })} className="text-xs text-red-300">Remove photo</button>}
      </div>}
      <div className="flex flex-wrap gap-3 text-xs text-amber-300">
        <button type="button" disabled={index === 0} className="disabled:opacity-30" aria-label={`Move item ${index + 1} up`} onClick={() => move(index, -1)}>Up</button>
        <button type="button" disabled={index === items.length - 1} className="disabled:opacity-30" aria-label={`Move item ${index + 1} down`} onClick={() => move(index, 1)}>Down</button>
        <button type="button" onClick={() => add(item)}>Duplicate</button>
        <button type="button" className="text-red-300" onClick={() => saveOrder(items.filter(entry => entry.id !== item.id).map(entry => entry.id))}>Remove</button>
      </div>
    </div>)}
    <button type="button" onClick={() => add()} className="w-full border border-amber-300/50 rounded-lg py-2 text-xs text-amber-300">+ Add item</button>
  </section>;
}
