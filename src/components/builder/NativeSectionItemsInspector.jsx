import { ArrowDown, ArrowUp, GripVertical, Trash2 } from 'lucide-react';
import { useBuilderSelection } from './BuilderSelectionContext';

const inputClass = 'w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-300 focus:outline-none';

export default function NativeSectionItemsInspector({ sectionId, title, values, onChange }) {
  const { activeItemId, setActiveItemId } = useBuilderSelection();
  const key = `section-${sectionId}-items`;
  const items = Array.isArray(values[key]) ? values[key] : [];
  const update = (index, field, value) => onChange({ ...values, [key]: items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) });
  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...values, [key]: next });
  };
  return <section className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900/80">
    <header className="flex items-center justify-between border-b border-neutral-700 bg-neutral-950 px-3 py-3"><div><p className="text-[10px] uppercase tracking-wider text-neutral-500">Selected section</p><h3 className="mt-1 text-xs font-semibold text-white">{title}</h3></div><span className="rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300">{items.length} items</span></header>
    <div className="space-y-2 p-2.5">
      {items.map((item, index) => <article key={item.id} data-builder-item-id={item.id} onClick={() => setActiveItemId(item.id)} className={`overflow-hidden rounded-lg border bg-neutral-800/70 p-3 shadow-sm ${activeItemId === item.id ? 'border-amber-300 ring-1 ring-amber-300/60' : 'border-neutral-700'}`}>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-white"><GripVertical className="h-3.5 w-3.5 text-neutral-500" /><span className="w-4 text-[10px] text-neutral-500">{index + 1}</span><span className="min-w-0 flex-1 truncate">{item.title || `Item ${index + 1}`}</span><button type="button" title="Move up" aria-label={`Move item ${index + 1} up`} disabled={!index} onClick={() => move(index, -1)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" title="Move down" aria-label={`Move item ${index + 1} down`} disabled={index === items.length - 1} onClick={() => move(index, 1)} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" title="Delete" aria-label={`Delete item ${index + 1}`} onClick={() => onChange({ ...values, [key]: items.filter((_, itemIndex) => itemIndex !== index) })} className="rounded p-1 text-neutral-400 hover:bg-rose-950 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div>
        <label className="mb-3 block text-[10px] text-neutral-400">Title<input className={`${inputClass} mt-1`} value={item.title || ''} onChange={event => update(index, 'title', event.target.value)} /></label>
        <label className="block text-[10px] text-neutral-400">Description<textarea rows={3} className={`${inputClass} mt-1 resize-y`} value={item.description || ''} onChange={event => update(index, 'description', event.target.value)} /></label>
      </article>)}
    </div>
    <div className="sticky bottom-0 border-t border-neutral-700 bg-neutral-950/95 p-2.5 backdrop-blur"><button type="button" onClick={() => { const item = { id: `item-${crypto.randomUUID()}`, title: 'New Sub-Section', description: 'Add a description.' }; onChange({ ...values, [key]: [...items, item] }); setActiveItemId(item.id); }} className="w-full rounded-lg border border-amber-300/50 py-2 text-xs text-amber-200 hover:bg-amber-300/10">+ Add New Sub-Section</button></div>
  </section>;
}
