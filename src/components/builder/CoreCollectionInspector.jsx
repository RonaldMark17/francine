import { getCollectionItems } from '../../data/coreCollections';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, GripVertical, ArrowUp, ArrowDown, Copy, Trash2 } from 'lucide-react';

export default function CoreCollectionInspector({ definition, values, onChange, onChooseImage, onAddItem, onRemoveItem }) {
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
    saveOrder(ids.filter(id => !definition.defaults[Number(id)]));
  };
  const duplicate = item => add(item);
  const add = source => {
    if (onAddItem) {
      const id = onAddItem(definition, source ? Object.fromEntries(definition.fields.map(field => [field, values[`${definition.id}-${source.id}-${field}`] ?? source[field] ?? ''])) : null);
      setEditingId(id);
      return;
    }
    const id = `item-${Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')}`;
    const next = { ...values, [`collection-${definition.id}`]: [...items.filter(item => !definition.defaults[Number(item.id)]).map(item => item.id), id] };
    for (const field of definition.fields) {
      next[`${definition.id}-${id}-${field}`] = source
        ? values[`${definition.id}-${source.id}-${field}`] ?? source[field] ?? ''
        : ({ name: 'New member', role: 'Role', initials: 'NM', q: 'New question', a: 'Answer' }[field] || '');
    }
    onChange(next);
    setEditingId(id);
  };
  return <section className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900/80">
    <header className="flex items-center justify-between border-b border-neutral-700 bg-neutral-950 px-3 py-3"><h3 className="text-xs font-semibold text-white">{definition.label}</h3><span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">{items.length}</span></header>
    <div className="space-y-2 p-2.5">
    {items.map((item, index) => <div key={item.id} className="overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800/70 shadow-sm">
      <div className="flex items-center gap-1.5 px-2 py-2">
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
        <span className="w-4 shrink-0 text-[10px] text-neutral-500">{index + 1}</span>
        <button type="button" aria-expanded={editingId === item.id} aria-controls={`collection-editor-${definition.id}-${item.id}`} onClick={() => setEditingId(editingId === item.id ? null : item.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left text-xs text-white">
          <span className="truncate">{values[`${definition.id}-${item.id}-name`] ?? values[`${definition.id}-${item.id}-q`] ?? item.name ?? item.q ?? `Item ${index + 1}`}</span><ChevronDown className={`h-3.5 w-3.5 shrink-0 text-neutral-500 transition-transform ${editingId === item.id ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" title="Move up" aria-label={`Move item ${index + 1} up`} disabled={!index} onClick={() => move(index, -1)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
          <button type="button" title="Move down" aria-label={`Move item ${index + 1} down`} disabled={index === items.length - 1} onClick={() => move(index, 1)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
          <button type="button" title="Duplicate" aria-label={`Duplicate item ${index + 1}`} onClick={() => duplicate(item)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white"><Copy className="h-3.5 w-3.5" /></button>
          <button type="button" title="Delete" aria-label={`Delete item ${index + 1}`} onClick={() => onRemoveItem ? onRemoveItem(definition, item.id) : saveOrder(items.filter(entry => entry.id !== item.id).map(entry => entry.id))} className="rounded p-1 text-neutral-400 hover:bg-rose-950 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      {editingId === item.id && <div id={`collection-editor-${definition.id}-${item.id}`} ref={editorRef} className="space-y-3 border-t border-neutral-700 p-3">
        {definition.fields.filter(field => field !== 'image').map(field => {
          const key = `${definition.id}-${item.id}-${field}`;
          const label = { q: 'Question', a: 'Answer', name: 'Name', role: 'Role', initials: 'Initials' }[field] || field;
          return <label key={field} className="block text-xs text-neutral-400">
            {label}
            <textarea aria-label={`${definition.label} ${index + 1}: ${label}`} rows={field === 'a' ? 4 : 2} value={values[key] ?? item[field] ?? ''} onChange={event => onChange({ ...values, [key]: event.target.value })} className="mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white resize-y focus:outline-none focus:border-amber-300" />
          </label>;
        })}
      </div>}
      {editingId === item.id && definition.fields.includes('image') && <div className="space-y-2 border-t border-neutral-700 pt-3">
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
    </div>)}
    </div>
    <div className="sticky bottom-0 border-t border-neutral-700 bg-neutral-950/95 p-2.5 backdrop-blur"><button type="button" onClick={() => add()} className="w-full rounded-lg border border-amber-300/50 py-2 text-xs text-amber-200 hover:bg-amber-300/10">+ Add {definition.label.replace(/s$/, '')}</button></div>
  </section>;
}
