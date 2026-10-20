import React, { useState } from 'react';
import { ArrowUpRight, Database, Download, Package, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const THRESHOLD_KEY = 'mamamo-settings-stock-threshold';
const cardClass = 'bg-white rounded-xl border border-neutral-200/90 p-6 space-y-5 shadow-xs';
const headingClass = 'text-base font-editorial uppercase tracking-[0.16em] text-black font-semibold';

export default function StoreSettingsExtras({ onNavigate }) {
  const { products, orders, customPages, promotionsList, serviceInquiries, navigationConfig,
    inventoryLedger, mediaLibrary, storeInfo, isSqliteConnected, showToast } = useApp();
  const [threshold, setThreshold] = useState(() => {
    try {
      const saved = localStorage.getItem(THRESHOLD_KEY);
      const value = saved === null ? 10 : Number(saved);
      return Number.isInteger(value) && value >= 0 && value <= 99999 ? value : 10;
    } catch { return 10; }
  });
  const [draftThreshold, setDraftThreshold] = useState(String(threshold));
  const [error, setError] = useState('');
  const lowStock = products.filter(product => Number(product.stock) <= threshold);

  const saveThreshold = event => {
    event.preventDefault();
    const value = Number(draftThreshold);
    if (!draftThreshold.trim() || !Number.isInteger(value) || value < 0 || value > 99999) {
      setError('Enter a whole number from 0 to 99,999.');
      return;
    }
    try {
      localStorage.setItem(THRESHOLD_KEY, String(value));
      setThreshold(value);
      setError('');
      showToast('Stock alert threshold saved for this browser.', 'success');
    } catch { setError('This browser could not save your preference.'); }
  };

  const exportRecords = () => {
    const exportedAt = new Date().toISOString();
    const records = { formatVersion: 1, exportedAt, storeInfo, products, orders,
      customPages, promotionsList, serviceInquiries, navigationConfig, inventoryLedger, mediaLibrary };
    const url = URL.createObjectURL(new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `mamamo-store-records-${exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Store records exported. Keep this file private; it contains customer order details.', 'success');
  };

  return <>
    <section className={cardClass} aria-labelledby="stock-alert-settings">
      <div className="flex items-center gap-3">
        <Package className="w-5 h-5 text-neutral-500" />
        <h3 id="stock-alert-settings" className={headingClass}>Inventory alerts</h3>
      </div>
      <form onSubmit={saveThreshold} className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 space-y-2">
          <label htmlFor="stock-alert-threshold" className="block text-xs font-semibold">Low stock threshold</label>
          <p id="stock-threshold-description" className="text-xs text-neutral-500">Flag products at or below this quantity. Saved on this browser for this settings overview.</p>
          <input id="stock-alert-threshold" type="number" min="0" max="99999" step="1" value={draftThreshold}
            onChange={event => setDraftThreshold(event.target.value)} aria-describedby="stock-threshold-description" aria-invalid={Boolean(error)}
            className="w-full sm:w-40 rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <button className="rounded-lg bg-black text-white px-4 py-2.5 text-xs font-semibold">Save preference</button>
      </form>
      {error && <p role="alert" className="text-xs text-rose-700">{error}</p>}
      <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{lowStock.length} {lowStock.length === 1 ? 'product needs' : 'products need'} attention</p>
          <button onClick={() => onNavigate('inventory')} className="text-xs underline underline-offset-4">View inventory</button>
        </div>
        {lowStock.length ? <ul className="divide-y divide-neutral-200 text-xs">
          {lowStock.slice(0, 5).map(product => <li key={product.id} className="flex justify-between gap-4 py-2">
            <span>{product.name}</span><span className="shrink-0 font-semibold text-amber-800">{Number(product.stock) <= 0 ? 'Out of stock' : `${product.stock} remaining`}</span>
          </li>)}
        </ul> : <p className="text-xs text-neutral-500">All products are above your alert threshold.</p>}
        {lowStock.length > 5 && <p className="text-xs text-neutral-500">And {lowStock.length - 5} more in inventory.</p>}
      </div>
    </section>

    <section className={cardClass} aria-labelledby="store-management-settings">
      <h3 id="store-management-settings" className={headingClass}>Store management</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ['orders', 'Orders & fulfillment', `${orders.length} orders`, 'Review orders and update fulfillment progress.'],
          ['pages', 'Pages & navigation', `${customPages.length} pages`, 'Manage storefront content and store menus.'],
          ['promotions', 'Discounts & promotions', `${promotionsList.filter(promo => promo.active).length} enabled promotions`, 'Manage discount codes and promotional offers.'],
          ['inquiries', 'Customer inquiries', `${serviceInquiries.length} inquiries`, 'Review customer questions and print requests.'],
        ].map(([tab, title, count, description]) => <button key={tab} onClick={() => onNavigate(tab)}
          className="rounded-lg border border-neutral-200 p-4 text-left hover:bg-neutral-50 transition-colors group">
          <span className="flex justify-between gap-3 text-sm font-medium">{title}<ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black" /></span>
          <span className="block text-[10px] uppercase tracking-wider text-neutral-500 mt-2">{count}</span>
          <span className="block text-xs text-neutral-500 mt-1">{description}</span>
        </button>)}
      </div>
    </section>

    <section className={cardClass} aria-labelledby="store-data-settings">
      <h3 id="store-data-settings" className={headingClass}>Store data &amp; system</h3>
      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50/70 p-4">
        <Database className="w-5 h-5 text-neutral-500" />
        <div className="flex-1"><p className="text-sm font-medium">SQLite database</p><p className="text-xs text-neutral-500 mt-1">{isSqliteConnected ? 'Connected to the store database.' : 'Database connection unavailable. Displayed records may be cached.'}</p></div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${isSqliteConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{isSqliteConnected ? 'Connected' : 'Offline'}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><p className="text-sm font-medium">Export store records</p><p className="text-xs text-neutral-500 mt-1">Download the currently loaded catalog, orders, pages, and store records as JSON. This export cannot be restored from this page.</p></div>
        <button onClick={exportRecords} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-xs font-semibold hover:bg-neutral-50"><Download className="w-4 h-4" />Export records</button>
      </div>
      <p className="flex items-start gap-2 text-xs text-neutral-500"><ShieldCheck className="w-4 h-4 shrink-0" />Exports contain customer contact and order information. Store them securely.</p>
    </section>
  </>;
}
