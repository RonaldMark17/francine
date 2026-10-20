export default function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const buttonClass = 'px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors';

  return (
    <nav aria-label="Table pagination" className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs text-neutral-600">
      <span aria-live="polite">Showing {total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)} of {total}</span>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          Rows per page
          <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5">
            {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <button type="button" className={buttonClass} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
        <span>Page {page} of {pages}</span>
        <button type="button" className={buttonClass} disabled={page >= pages} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </nav>
  );
}
