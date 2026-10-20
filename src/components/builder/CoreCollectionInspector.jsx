import { getCollectionItems } from '../../data/coreCollections';

export default function CoreCollectionInspector({ definition, values, onChange }) {
  const items = getCollectionItems(values, definition);
  const saveOrder = ids => onChange({ ...values, [`collection-${definition.id}`]: ids });
  const move = (index, direction) => {
    const ids = items.map(item => item.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    saveOrder(ids);
  };
  const add = source => {
    const id = `item-${crypto.randomUUID()}`;
    const next = { ...values, [`collection-${definition.id}`]: [...items.map(item => item.id), id] };
    for (const field of definition.fields) {
      next[`${definition.id}-${id}-${field}`] = source
        ? values[`${definition.id}-${source.id}-${field}`] ?? source[field] ?? ''
        : ({ name: 'New member', role: 'Role', initials: 'NM', q: 'New question', a: 'Answer' }[field] || '');
    }
    onChange(next);
  };
  return <section className="rounded-xl border border-neutral-700 p-3 space-y-3">
    <h3 className="text-sm text-white">{definition.label} ({items.length})</h3>
    <p className="text-xs text-neutral-400">Manage items here. Edit their text and photos below or select them in the preview.</p>
    {items.map((item, index) => <div key={item.id} className="border-b border-neutral-800 pb-3 space-y-2">
      <p className="text-xs text-white break-words">{values[`${definition.id}-${item.id}-name`] ?? values[`${definition.id}-${item.id}-q`] ?? item.name ?? item.q ?? `Item ${index + 1}`}</p>
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
