import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md w-full px-4 sm:px-0">
      <div className="bg-[#121212] text-white px-5 py-4 rounded-none shadow-2xl border border-neutral-700 flex items-start gap-3">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />}
        
        <div className="flex-1 text-sm font-light tracking-wide leading-relaxed">
          {toastMessage.message}
        </div>

        <button 
          onClick={() => showToast(null)}
          className="text-stone-400 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
