import { createContext, useContext } from 'react';

export const BuilderSelectionContext = createContext({
  activeSectionId: null,
  setActiveSectionId: () => {},
  activeItemId: null,
  setActiveItemId: () => {},
  activeInspectorNode: null,
  setActiveInspectorNode: () => {}
});

export const useBuilderSelection = () => useContext(BuilderSelectionContext);
