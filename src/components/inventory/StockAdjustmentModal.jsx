import ModalOverlay from '../ModalOverlay';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import { X, Package, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function StockAdjustmentModal({ product, isOpen, onClose }) {
  const { adjustStockWithReason, currentUser } = useApp();

  const [adjustmentType, setAdjustmentType] = useState('add'); // 'add' | 'subtract' | 'set'
  const [amount, setAmount] = useState(10);
  const [reason, setReason] = useState('Received New Stock from Distributor');
  const [customReason, setCustomReason] = useState('');

  useBodyScrollLock(isOpen && Boolean(product));

  if (!isOpen || !product) return null;

  const COMMON_REASONS = [
    'Received New Stock from Distributor',
    'Physical Store In-Person Purchase (Manual Sync)',
    'Damaged or Defective Goods Removed',
    'Inventory Count Audit Discrepancy Correction',
    'Customer Return & Restocked',
    'Other / Custom Operational Note'
  ];

  const currentStock = product.stock || 0;
  let newCalculatedStock = currentStock;

  if (adjustmentType === 'add') {
    newCalculatedStock = currentStock + Number(amount);
  } else if (adjustmentType === 'subtract') {
    newCalculatedStock = Math.max(0, currentStock - Number(amount));
  } else if (adjustmentType === 'set') {
    newCalculatedStock = Math.max(0, Number(amount));
  }

  const changeDelta = newCalculatedStock - currentStock;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0 && adjustmentType !== 'set') {
      alert('Please enter a valid stock quantity.');
      return;
    }

    const finalReason = reason === 'Other / Custom Operational Note' ? customReason.trim() : reason;
    if (!finalReason) {
      alert('Please provide a reason for the inventory adjustment.');
      return;
    }

    const operatorName = currentUser?.name || 'Store Admin (Francine)';
    adjustStockWithReason(product.id, newCalculatedStock, changeDelta, finalReason, operatorName);
    onClose();
  };

  return (
    <ModalOverlay
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[85dvh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden my-auto animate-modal-pop text-xs text-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: Keep fixed at top */}
        <div className="flex-shrink-0 p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-black" />
            <h3 className="font-editorial text-base uppercase tracking-wider text-black font-semibold">
              Adjust Inventory Stock &amp; Ledger
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Layout: Body scrolls vertically while Header and Footer are fixed */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Modal Body: Enable vertical scroll */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 space-y-4">
            {/* Product Reference */}
            <div className="bg-[#FAF9F5] border border-neutral-200 p-3.5 space-y-1 rounded-lg">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                {product.sku || 'SKU-NONE'} • {product.category}
              </div>
              <h4 className="font-semibold text-black text-xs leading-snug">
                {product.name}
              </h4>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-[11px]">
                <span className="text-neutral-500">Current In-Stock Quantity:</span>
                <span className="font-mono font-bold text-black">{currentStock} units</span>
              </div>
            </div>

            {/* Action Type */}
            <div>
              <label className="block font-medium text-neutral-700 mb-1.5">Adjustment Action</label>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { id: 'add', label: '+ Receive Stock', icon: ArrowUpRight },
                  { id: 'subtract', label: '- Remove Stock', icon: ArrowDownRight },
                  { id: 'set', label: '= Set Absolute', icon: RefreshCw }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAdjustmentType(opt.id)}
                    className={`py-2 px-2 border rounded-lg transition-all text-xs flex items-center justify-center gap-1 ${
                      adjustmentType === opt.id 
                        ? 'border-black bg-black text-white font-medium shadow-xs' 
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    <opt.icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                {adjustmentType === 'set' ? 'New Total Stock Count' : 'Quantity Units'}
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black font-mono text-base"
                required
              />
            </div>

            {/* Calculation summary */}
            <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-between">
              <span className="text-neutral-600">Calculated New Stock:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-black">
                  {newCalculatedStock} units
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 font-bold rounded ${
                  changeDelta > 0 ? 'bg-emerald-100 text-emerald-800' : changeDelta < 0 ? 'bg-rose-100 text-rose-800' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {changeDelta > 0 ? `+${changeDelta}` : changeDelta}
                </span>
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Operational Ledger Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-xs focus:outline-none focus:border-black"
              >
                {COMMON_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {reason === 'Other / Custom Operational Note' && (
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Custom Note *</label>
                <input
                  type="text"
                  placeholder="Specify reason for stock discrepancy..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black"
                  required
                />
              </div>
            )}
          </div>

          {/* Modal Footer: Keep fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-black text-white uppercase tracking-wider text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Record Movement to Ledger
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}
