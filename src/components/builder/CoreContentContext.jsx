import { createContext, useContext } from 'react';

export const CoreContentContext = createContext({});
export const CoreSelectionContext = createContext(false);

export function useCoreContent() {
  const values = useContext(CoreContentContext);
  const selectable = useContext(CoreSelectionContext);
  const content = (id, fallback) => values[id] ?? fallback;
  const text = (id, fallback) => selectable
    ? <span data-core-field={id} tabIndex={0} role="button" aria-label={`Edit: ${fallback}`}>{content(id, fallback) || '\u200b'}</span>
    : content(id, fallback);
  return Object.assign(content, { text });
}
