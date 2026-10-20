import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function InspectorAccordion({ title, defaultOpen = false, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border border-neutral-800 bg-neutral-950/30">
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="w-full px-3 py-2.5 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-300 font-semibold">{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="border-t border-neutral-800 p-3 space-y-4">{children}</div>}
    </section>
  );
}
