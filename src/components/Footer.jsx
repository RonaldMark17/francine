import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenPresenterGuide }) {
  const { storeInfo, navigateTo } = useApp();

  return (
    <footer className="bg-[#141414] text-[#D8D6D0] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-2xl font-light font-editorial tracking-[0.25em] text-white uppercase">
              MAMA MO
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-sans">
              INK PRINT &amp; SUPPLIES • OMNICHANNEL RETAIL
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-sm pt-2">
              Elevating daily academic and office essentials through an omnichannel shopping experience. 
              Designed for university students, educators, and local enterprises in Sampaloc, Manila.
            </p>

            <div className="pt-2 text-xs text-neutral-400 space-y-2 font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-300 shrink-0" />
                <span>{storeInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-300 shrink-0" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Shop Catalog</h4>
            <ul className="space-y-2 text-xs font-light text-neutral-400">
              <li>
                <button onClick={() => navigateTo('shop', { category: 'School Supplies' })} className="hover:text-white transition-colors">
                  School Essentials
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { category: 'Paper Products' })} className="hover:text-white transition-colors">
                  Paper &amp; Bond Papers
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { category: 'Office Supplies' })} className="hover:text-white transition-colors">
                  Office Equipment
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { category: 'Printing Materials' })} className="hover:text-white transition-colors">
                  Inks &amp; Toners
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('promotions')} className="hover:text-white transition-colors text-amber-200">
                  Student Promotions
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Printing */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Print Services</h4>
            <ul className="space-y-2 text-xs font-light text-neutral-400">
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Document Printing
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Thesis Hardbound Binding
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Photocopying &amp; Duplicating
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Spiral &amp; Wire-O Binding
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Price Estimator Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Store Hours & Demo Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Store Operations</h4>
            <div className="text-xs font-light text-neutral-400 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Clock className="w-3.5 h-3.5" />
                <span>Operating Hours</span>
              </div>
              <p>{storeInfo.hours.weekdays}</p>
              <p>{storeInfo.hours.saturday}</p>
              <p className="text-neutral-500">{storeInfo.hours.sunday}</p>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenPresenterGuide}
                className="inline-block text-[11px] uppercase tracking-wider text-amber-300 hover:text-amber-100 underline underline-offset-4"
              >
                Presenter Script &amp; Tutorial
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Academic Presentation Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-light text-neutral-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Mama Mo Ink Print and Supplies. All rights reserved. 
            <span className="text-neutral-400 ml-2">Philippine Pesos (₱)</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-neutral-400 text-center rounded text-[10px]">
            Academic Prototype Demonstration • Simulated E-Commerce Workflow • Defense Presentation Ready
          </div>
        </div>

      </div>
    </footer>
  );
}
