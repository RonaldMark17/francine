import { getCollectionItems } from '../../data/coreCollections';
import { createContext, useContext } from 'react';

export const CoreContentContext = createContext({});
export const CoreSelectionContext = createContext(false);
export const CoreSectionsContext = createContext(null);

export function useCoreContent() {
  const values = useContext(CoreContentContext);
  const selection = useContext(CoreSelectionContext);
  const selectable = Boolean(selection);
  const content = (id, fallback) => values[id] ?? fallback;
  const text = (id, fallback) => selectable
    ? <span data-core-field={id} tabIndex={0} role="textbox" aria-label={`Edit: ${fallback}`}
        contentEditable={Boolean(selection?.onChange && selection.selectedField === id)} suppressContentEditableWarning
        onBlur={event => {
          const next = event.currentTarget.textContent.replace(/\u200b/g, '');
          if (next !== content(id, fallback)) selection?.onChange?.(id, next);
        }}
        onPaste={event => {
          event.preventDefault();
          const text = event.clipboardData.getData('text/plain');
          const selection = event.currentTarget.ownerDocument.getSelection();
          const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
          if (range && event.currentTarget.contains(range.commonAncestorContainer)) {
            range.deleteContents();
            const node = event.currentTarget.ownerDocument.createTextNode(text);
            range.insertNode(node);
            range.setStartAfter(node);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }}>{content(id, fallback) || '\u200b'}</span>
    : content(id, fallback);
  const itemText = (definition, item, field, fallback = '') => {
    const id = `${definition.id}-${item.id}-${field}`;
    const current = values[id] ?? item[field] ?? fallback;
    return selectable
      ? <span data-core-field={id} tabIndex={0} role="textbox" aria-label={`Edit: ${fallback || field}`}
          contentEditable={Boolean(selection?.onChange && selection.selectedField === id)} suppressContentEditableWarning
          onBlur={event => {
            const next = event.currentTarget.textContent.replace(/\u200b/g, '');
            if (next !== current) selection?.onChange?.(id, next);
          }}>{current || '\u200b'}</span>
      : current;
  };
  const subSections = key => Array.isArray(values[key]) ? values[key] : [];
  const addSubSection = (key, item) => selection?.onAddSubSection?.(key, item);
  const removeSubSection = (key, id) => selection?.onRemoveSubSection?.(key, id);
  const addCollectionItem = (definition, item) => selection?.onAddCollectionItem?.(definition, item);
  const removeCollectionItem = (definition, id) => selection?.onRemoveCollectionItem?.(definition, id);
  const addContentItem = (key, item) => selection?.onAddContentItem?.(key, item);
  const removeContentItem = (key, id) => selection?.onRemoveContentItem?.(key, id);
  return Object.assign(content, { text, itemText, editable: selectable, activeSectionId: selection?.activeSectionId, activeItemId: selection?.activeItemId, setActiveItemId: selection?.setActiveItemId, collection: definition => getCollectionItems(values, definition), subSections, addSubSection, removeSubSection, addCollectionItem, removeCollectionItem, addContentItem, removeContentItem });
}
