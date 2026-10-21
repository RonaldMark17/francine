import { CORE_COLLECTIONS, getCollectionItems } from '../../data/coreCollections';
import { CORE_CONTENT_FIELDS } from '../../data/coreContentFields';

const COMPONENT_FIELDS = {
  hero: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['subtitle', 'Subtitle'], ['buttonText', 'Button']],
  announcement: [['badge', 'Badge'], ['text', 'Announcement']],
  text_image: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['description', 'Description'], ['buttonText', 'Button']],
  product_grid: [['title', 'Title'], ['subtitle', 'Subtitle']],
  faq: [['title', 'Title']],
  rich_text: [['title', 'Title'], ['content', 'Content']],
  cta: [['title', 'Title'], ['subtitle', 'Subtitle'], ['buttonText', 'Button']],
  features_grid: [['title', 'Title']],
  testimonials: [['title', 'Title']],
  pricing_table: [['title', 'Title'], ['subtitle', 'Subtitle']],
  steps: [['title', 'Title']],
  category_grid: [['title', 'Title']],
  gallery: [['title', 'Title']],
  location_map: [['storeName', 'Store name'], ['address', 'Address'], ['phone', 'Phone'], ['email', 'Email'], ['hours', 'Hours']]
};

const ITEM_FIELDS = {
  faq: [['q', 'Question'], ['a', 'Answer']],
  features_grid: [['title', 'Title'], ['description', 'Description']],
  testimonials: [['name', 'Name'], ['role', 'Role'], ['quote', 'Quote']],
  pricing_table: [['service', 'Service'], ['spec', 'Spec / size'], ['price', 'Price'], ['notes', 'Notes']],
  steps: [['title', 'Title'], ['description', 'Description']],
  category_grid: [['title', 'Title'], ['category', 'Category'], ['buttonText', 'Button']],
  gallery: [['caption', 'Caption']]
};

const CONTACT_FIELDS = [
  ['contact-address', 'Physical address'],
  ['contact-hours-weekdays', 'Weekday hours'],
  ['contact-hours-saturday', 'Saturday hours'],
  ['contact-hours-sunday', 'Sunday hours'],
  ['contact-phone', 'Telephone and hotline'],
  ['contact-email', 'Email address'],
  ['contact-facebook', 'Facebook'],
  ['contact-instagram', 'Instagram'],
  ['contact-viber', 'Viber']
].map(([id, label]) => ({ id, label, kind: 'text', defaultValue: '' }));

const formatText = value => String(value ?? '').trim().replace(/\s+/g, ' ');

function ContentRow({ nodeId, selected, label, value, onSelect }) {
  const preview = formatText(value);
  return <button
    type="button"
    data-inspector-node={nodeId}
    aria-current={selected ? 'true' : undefined}
    onClick={onSelect}
    className={`block w-full rounded-md border px-2.5 py-2 text-left transition-colors ${
      selected
        ? 'border-amber-300 bg-amber-300/10 text-white'
        : 'border-neutral-800 bg-neutral-950/50 text-neutral-300 hover:border-neutral-600'
    }`}
  >
    <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</span>
    <span className="mt-1 block line-clamp-2 text-xs leading-relaxed">{preview || 'Empty text'}</span>
  </button>;
}

export default function PageContentTree({
  route,
  components,
  nativeContent,
  activeSectionId,
  activeItemId,
  activeInspectorNode,
  onSelectNativeField,
  onSelectComponentField,
  onSelectComponentItem
}) {
  const nativeFields = [
    ...(CORE_CONTENT_FIELDS[route] || []),
    ...(route === '/contact' ? CONTACT_FIELDS : [])
  ];
  const knownNativeFieldIds = new Set(nativeFields.map(field => field.id));
  const collectionKeys = new Set((CORE_COLLECTIONS[route] || []).map(definition => `collection-${definition.id}`));
  const additionalNativeFields = Object.entries(nativeContent)
    .filter(([id, value]) => !knownNativeFieldIds.has(id)
      && !collectionKeys.has(id)
      && !(CORE_COLLECTIONS[route] || []).some(definition => id.startsWith(`${definition.id}-`))
      && typeof value === 'string')
    .map(([id, defaultValue]) => ({ id, label: id.replaceAll('-', ' '), defaultValue }));
  const nativeArrays = Object.entries(nativeContent)
    .filter(([id, value]) => !collectionKeys.has(id) && Array.isArray(value) && value.every(item => item && typeof item === 'object'));
  const collections = (CORE_COLLECTIONS[route] || []).map(definition => ({
    definition,
    items: getCollectionItems(nativeContent, definition)
  }));

  return <section aria-label="All page content tree" className="space-y-2">
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">All page content</h2>
    {route && <details open className="rounded-lg border border-neutral-700 bg-neutral-900/60">
      <summary className="cursor-pointer px-3 py-2.5 text-xs font-semibold text-white">{route === '/' ? 'Home content' : `${route.slice(1)} content`}</summary>
      <div className="space-y-2 border-t border-neutral-800 p-2">
        {nativeFields.map((field, index) => {
          const selected = activeSectionId === 'native-content' && activeInspectorNode === `native:${field.id}`;
          return <ContentRow
            key={field.id}
            nodeId={`native:${field.id}`}
            selected={selected}
            label={field.label || `Text ${index + 1}`}
            value={nativeContent[field.id] ?? field.defaultValue}
            onSelect={() => onSelectNativeField(field.id)}
          />;
        })}
        {additionalNativeFields.map(field => <ContentRow
          key={field.id}
          nodeId={`native:${field.id}`}
          selected={activeSectionId === 'native-content' && activeInspectorNode === `native:${field.id}`}
          label={field.label}
          value={nativeContent[field.id] ?? field.defaultValue}
          onSelect={() => onSelectNativeField(field.id)}
        />)}
        {nativeArrays.map(([key, items]) => <details key={key} open className="rounded-md border border-neutral-800 bg-neutral-950/40">
          <summary className="cursor-pointer px-2.5 py-2 text-[11px] font-semibold capitalize text-neutral-200">{key.replace(/^section-/, '').replace(/-items$/, '').replaceAll('-', ' ')}</summary>
          <div className="space-y-2 border-t border-neutral-800 p-2">
            {items.map((item, index) => <details key={item.id || index} open className="rounded border border-neutral-800 p-2">
              <summary className="cursor-pointer text-[11px] text-neutral-300">{item.title || item.name || `Item ${index + 1}`}</summary>
              <div className="mt-2 space-y-2">
                {Object.entries(item).filter(([field, value]) => field !== 'id' && typeof value === 'string').map(([field, value]) => <ContentRow
                  key={`${key}:${item.id || index}:${field}`}
                  nodeId={`native:${key}:${item.id || index}:${field}`}
                  selected={activeInspectorNode === `native:${key}:${item.id || index}:${field}`}
                  label={field}
                  value={value}
                  onSelect={() => onSelectNativeField(key, key.replace(/^section-/, '').replace(/-items$/, ''), `native:${key}:${item.id || index}:${field}`)}
                />)}
              </div>
            </details>)}
          </div>
        </details>)}
        {collections.map(({ definition, items }) => <details key={definition.id} open className="rounded-md border border-neutral-800 bg-neutral-950/40">
          <summary className="cursor-pointer px-2.5 py-2 text-[11px] font-semibold text-neutral-200">{definition.label}</summary>
          <div className="space-y-2 border-t border-neutral-800 p-2">
            {items.map((item, index) => <details key={item.id} open className="rounded border border-neutral-800 p-2">
              <summary className="cursor-pointer text-[11px] text-neutral-300">{item.name || item.q || `${definition.label} ${index + 1}`}</summary>
              <div className="mt-2 space-y-2">
                {definition.fields.filter(field => field !== 'image').map(field => {
                  const id = `${definition.id}-${item.id}-${field}`;
                  return <ContentRow
                    key={id}
                    nodeId={`native:${id}`}
                    selected={activeSectionId === 'native-content' && activeInspectorNode === `native:${id}`}
                    label={field === 'q' ? 'Question' : field === 'a' ? 'Answer' : field}
                    value={nativeContent[id] ?? item[field]}
                    onSelect={() => onSelectNativeField(id)}
                  />;
                })}
              </div>
            </details>)}
          </div>
        </details>)}
      </div>
    </details>}

    {components.map((component, index) => {
      const { id, type, data = {} } = component;
      const fields = COMPONENT_FIELDS[type] || [];
      const items = type === 'gallery'
        ? (Array.isArray(data.images) ? data.images : [])
        : (Array.isArray(data.items) ? data.items : []);
      const itemFields = ITEM_FIELDS[type] || [];
      const subSections = Array.isArray(data.subSections) ? data.subSections : [];
      const title = formatText(data.title || data.eyebrow) || type.replaceAll('_', ' ');

      return <details key={id} open className={`rounded-lg border ${activeSectionId === id ? 'border-amber-300 bg-amber-300/5' : 'border-neutral-700 bg-neutral-900/60'}`}>
        <summary className="cursor-pointer px-3 py-2.5 text-xs font-semibold capitalize text-white">
          Section {index + 1}: {title}
        </summary>
        <div className="space-y-2 border-t border-neutral-800 p-2">
          {fields.filter(([field]) => data[field] !== undefined).map(([field, label]) => <ContentRow
            key={`${id}:${field}`}
            nodeId={`component:${id}:${field}`}
            selected={activeSectionId === id && activeInspectorNode === `component:${id}:${field}`}
            label={label}
            value={data[field]}
            onSelect={() => onSelectComponentField(id, field)}
          />)}
          {items.map((item, itemIndex) => {
            const itemId = item.id || `item-${itemIndex}`;
            const itemTitle = formatText(item.title || item.q || item.service || item.category || item.caption || item.name) || `Card ${itemIndex + 1}`;
            return <details key={itemId} open className={`rounded-md border p-2 ${activeSectionId === id && activeItemId === itemId ? 'border-amber-300 bg-amber-300/10' : 'border-neutral-800 bg-neutral-950/40'}`}>
              <summary className="cursor-pointer text-[11px] font-medium text-neutral-200">{itemTitle}</summary>
              <div className="mt-2 space-y-2">
                {itemFields.map(([field, label]) => <ContentRow
                  key={`${id}:${itemId}:${field}`}
                  nodeId={`component:${id}:${itemId}:${field}`}
                  selected={activeSectionId === id && activeInspectorNode === `component:${id}:${itemId}:${field}`}
                  label={label}
                  value={item[field]}
                  onSelect={() => onSelectComponentItem(id, itemId, field)}
                />)}
              </div>
            </details>;
          })}
          {subSections.map((item, itemIndex) => {
            const itemId = item.id || `subsection-${itemIndex}`;
            return <details key={itemId} open className={`rounded-md border p-2 ${activeSectionId === id && activeItemId === itemId ? 'border-amber-300 bg-amber-300/10' : 'border-neutral-800 bg-neutral-950/40'}`}>
              <summary className="cursor-pointer text-[11px] font-medium text-neutral-200">
                {formatText(item.eyebrow ? `${item.eyebrow}: ${item.title}` : item.title) || `Sub-section ${itemIndex + 1}`}
              </summary>
              <div className="mt-2 space-y-2">
                {[['eyebrow', 'Eyebrow'], ['title', 'Title'], ['description', 'Description']].map(([field, label]) => <ContentRow
                  key={`${id}:${itemId}:${field}`}
                  nodeId={`component:${id}:${itemId}:${field}`}
                  selected={activeSectionId === id && activeInspectorNode === `component:${id}:${itemId}:${field}`}
                  label={label}
                  value={item[field]}
                  onSelect={() => onSelectComponentItem(id, itemId, field)}
                />)}
              </div>
            </details>;
          })}
        </div>
      </details>;
    })}
  </section>;
}
