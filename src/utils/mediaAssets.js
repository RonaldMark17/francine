import { CORE_CONTENT_FIELDS } from '../data/coreContentFields.js';
import { STOREFRONT_IMAGES } from '../data/storefrontImages.js';

// Referenced assets stay available as inventory and page content change.
export function collectMediaAssets({ mediaLibrary = [], products = [], pages = [], storeInfo = {} }) {
  const assets = new Map();
  const add = (url, name, category, original) => {
    if (typeof url !== 'string' || !url.trim()) return;
    const key = url.trim();
    const previous = assets.get(key);
    if (previous) {
      if (category === 'Products') previous.category = category;
      return;
    }
    assets.set(key, original ? { ...original, url: key } : {
      id: `used-image:${key}`, url: key, name: name || 'Website image', category,
      type: 'image', size: 'Referenced asset', isReferenced: true
    });
  };
  const visit = (value, name, category, imageField = false) => {
    if (typeof value === 'string') {
      if (imageField && /^(\/|https?:\/\/|data:image\/)/i.test(value)) add(value, name, category);
    } else if (Array.isArray(value)) {
      value.forEach(item => visit(item, name, category, imageField));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => visit(child, value.name || value.title || name, category, /image|photo|logo|thumbnail|banner|^src$|gallery/i.test(key)));
    }
  };
  mediaLibrary.forEach(item => add(item.url, item.name, item.category, item));
  products.forEach(product => visit(product, product.name, 'Products'));
  pages.forEach(page => {
    visit(page.components, page.title, 'Banners');
    (CORE_CONTENT_FIELDS[page.systemRoute] || []).filter(field => field.kind === 'image').forEach(field => add(page.nativeContent?.[field.id] ?? field.defaultValue, `${page.title} image`, 'Banners'));
  });
  visit(storeInfo, 'Store image', 'Banners');
  STOREFRONT_IMAGES.forEach(url => add(url, url.split('/').pop().replace(/[_-]/g, ' ').replace(/\.[^.]+$/, ''), 'Banners'));
  return [...assets.values()];
}
