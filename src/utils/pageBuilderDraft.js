const PAGE_BUILDER_DRAFT_PREFIX = 'mm_page_builder_draft_v1:';

export const getPageBuilderDraftKey = (pageId) =>
  pageId ? `${PAGE_BUILDER_DRAFT_PREFIX}${pageId}` : null;

export const loadPageBuilderDraft = (pageId) => {
  const key = getPageBuilderDraftKey(pageId);
  if (!key) return null;

  try {
    const draft = JSON.parse(localStorage.getItem(key));
    return draft?.page?.id === pageId ? draft : null;
  } catch {
    return null;
  }
};

export const savePageBuilderDraft = (page) => {
  const key = getPageBuilderDraftKey(page?.id);
  if (!key) return;

  try {
    localStorage.setItem(key, JSON.stringify({
      page,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.warn('Unable to persist page builder draft:', error.message);
  }
};

export const clearPageBuilderDraft = (pageId) => {
  const key = getPageBuilderDraftKey(pageId);
  if (!key) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Unable to clear page builder draft:', error.message);
  }
};
