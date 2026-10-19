import React, { useState } from 'react';
import { X, Play, BookOpen, CheckSquare, Sparkles, Copy, Check } from 'lucide-react';

export default function PresenterGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('script');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const demoScript = `
PRESENTATION SCRIPT & DEMO WALKTHROUGH (MAMA MO INK PRINT AND SUPPLIES)

[SLIDE 1: INTRODUCTION & OVERVIEW]
"Good morning, professors, panel members, and fellow students. Today, we proudly present the official e-commerce platform for 'Mama Mo Ink Print and Supplies'. 
Mama Mo is an omnichannel retail enterprise dedicated to providing university students, educators, and local offices in Manila with high-grade supplies and on-demand printing services.
Our digital storefront was designed following the minimalist visual principles inspired by luxury editorial aesthetics—emphasizing clarity, generous whitespace, and effortless customer journey."

[STEP 1: HOMEPAGE & BRANDING]
"On the homepage, you see our brand identity and editorial hero banner: 'Everything You Need, All in One Place.' 
Notice our curated category grid: School Supplies, Office Supplies, Paper Products, Printing Materials, and Specialty Supplies. 
We also have dedicated promo banners highlighting our student privilege discounts and announcements."

[STEP 2: BROWSING CATALOG & REAL-TIME FILTERS]
"Let us navigate to the 'Shop' page. Here, customers can easily filter by category—such as Paper Products or School Supplies—adjust the price slider, or search in real time for items like 'PaperOne' or 'Pilot'.
Each product card displays its Philippine Peso price, stock availability, and promotional savings."

[STEP 3: PRODUCT DETAILS & QUICK VIEW]
"Clicking 'Details' opens a high-definition view with technical specifications, authentic stock availability, and quantity selectors. Let's add 2 reams of 80gsm paper to our shopping bag."

[STEP 4: SHOPPING BAG & PROMO CODE]
"Opening the shopping bag on the top right shows our live items. Let us apply our academic discount code: 'STUDENT15'. 
Instantly, the 15% discount is computed and subtracted from the subtotal in Philippine Pesos."

[STEP 5: OMNICHANNEL CHECKOUT (PICKUP VS DELIVERY)]
"Now we proceed to checkout. As an omnichannel retailer, Mama Mo gives the customer full freedom between two fulfillment methods:
1. In-Store Pickup: Free pickup at our Sampaloc campus store counter with time-slot selection.
2. Local Courier Delivery: Door-to-door dispatch to university dormitories or classrooms.
Let's select 'In-Store Pickup' for Counter 2, choose our payment method, and submit our demonstration order."

[STEP 6: ORDER CONFIRMATION & REAL-TIME ORDER TRACKING]
"Upon submission, a unique reference order number is generated. 
Let us now navigate to 'Track Order'. Entering the order number displays the dynamic timeline: Order Placed -> Processing -> Ready for Pickup -> Completed."

[STEP 7: PRINTING SERVICES & INTERACTIVE ESTIMATOR]
"In addition to retail supplies, Mama Mo specializes in comprehensive printing. On the 'Printing Services' page, we provide an interactive price calculator for thesis hardbinding, laser printing, and laminations, allowing students to receive instant cost estimates and submit their project inquiries."

[STEP 8: ADMIN DASHBOARD (STAFF PORTAL)]
"Lastly, behind the scenes, store owners have an integrated Admin Portal where they can update product prices, adjust inventory stock, manage customer orders, and review incoming print requests."

"Thank you very much. We are now open for your questions."
`.trim();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(demoScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white max-w-4xl w-full border border-neutral-300 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF9F5] border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-black" />
            <div>
              <h2 className="text-sm font-light font-editorial uppercase tracking-[0.2em] text-black">
                Academic Presenter Guide &amp; Demo Script
              </h2>
              <p className="text-[10px] text-neutral-500 font-sans tracking-wider uppercase">
                Prepared for Thursday Rehearsal &amp; Friday Morning Defense
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6">
          <button
            onClick={() => setActiveTab('script')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-medium border-b-2 transition-all ${
              activeTab === 'script' 
                ? 'border-black text-black bg-white' 
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Speech Script (What to Say)
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-medium border-b-2 transition-all ${
              activeTab === 'checklist' 
                ? 'border-black text-black bg-white' 
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Step-by-Step Demo Actions (What to Click)
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-medium border-b-2 transition-all ${
              activeTab === 'features' 
                ? 'border-black text-black bg-white' 
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Key Defenses &amp; Omnichannel Concept
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-600 font-light">
                  Use this speech outline for your live verbal presentation or when recording your demonstration video.
                </p>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-neutral-300 hover:border-black text-neutral-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Full Script'}</span>
                </button>
              </div>

              <div className="bg-[#FAF9F5] border border-neutral-200 p-5 rounded font-mono text-xs text-neutral-800 leading-relaxed whitespace-pre-wrap selection:bg-neutral-800 selection:text-white">
                {demoScript}
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Live Demonstration Clickthrough Steps (2-3 Minutes)
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  {
                    step: '1. Showcase Homepage Aesthetic',
                    desc: 'Scroll down the homepage to demonstrate the Celine-inspired clean typography, hero banner, category cards, and student perks.'
                  },
                  {
                    step: '2. Search & Filter Products',
                    desc: 'Click "Shop" in the navigation. Click the "Paper Products" category tag. Type "PaperOne" in the search box to show instant filtering.'
                  },
                  {
                    step: '3. View Details & Add to Bag',
                    desc: 'Click on a product card to open the quick modal. Highlight the ₱ price, specs, and in-stock count. Click "Add to Bag".'
                  },
                  {
                    step: '4. Test Promo Code in Bag',
                    desc: 'Click the shopping bag icon. Enter code "STUDENT15" and click "Apply". Show the panel that 15% discount was deducted.'
                  },
                  {
                    step: '5. Complete Checkout with In-Store Pickup',
                    desc: 'Click "Proceed to Checkout". Select "In-Store Pickup" to show the free ₱0 pickup option with campus express counter. Submit the order to trigger the celebration confirmation.'
                  },
                  {
                    step: '6. Real-Time Order Tracking',
                    desc: 'Click "Track This Order" on the confirmation screen. Point out the live status bar (Order Placed -> Ready for Pickup).'
                  },
                  {
                    step: '7. Printing Services Interactive Estimator',
                    desc: 'Go to "Printing Services". Show the pricing calculator (select page count, thesis hardbinding, paper weight) and submit a sample service inquiry.'
                  },
                  {
                    step: '8. Admin Portal Demonstration',
                    desc: 'Click "Admin" on the top right. Show how the store owner can edit prices, add products, and update customer order status from "Order Placed" to "Ready for Pickup".'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAF9F5] border border-neutral-200 flex gap-3">
                    <div className="w-6 h-6 bg-black text-white text-[11px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-0.5">{item.step}</h4>
                      <p className="text-neutral-600 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Key Academic Defenses &amp; Omnichannel Strategy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF9F5] border border-neutral-200 space-y-2">
                  <h4 className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    Why Omnichannel?
                  </h4>
                  <p className="text-neutral-600 font-light leading-relaxed">
                    Unlike pure digital or pure brick-and-mortar stores, students often need supplies immediately between class periods. The omnichannel model allows them to order online ahead of time and pick up in 10 minutes without waiting in long campus lines.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF9F5] border border-neutral-200 space-y-2">
                  <h4 className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    Celine-Inspired Minimalist Aesthetic
                  </h4>
                  <p className="text-neutral-600 font-light leading-relaxed">
                    Most Philippine school supply stores look cluttered. By applying high-end editorial whitespace, neutral palettes (ivory, charcoal, bone), and refined typography, Mama Mo presents everyday stationery with an elevated, professional pride.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF9F5] border border-neutral-200 space-y-2">
                  <h4 className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    Local Philippine Context
                  </h4>
                  <p className="text-neutral-600 font-light leading-relaxed">
                    All inventory reflects authentic Philippine student staples: Mongol pencils, Pilot G-Tec pens, PaperOne 80gsm reams, and GCash/Maya wallet payment options popular along the University Belt.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF9F5] border border-neutral-200 space-y-2">
                  <h4 className="font-semibold text-black uppercase tracking-wider text-[11px]">
                    Integrated Printing Services
                  </h4>
                  <p className="text-neutral-600 font-light leading-relaxed">
                    Printing is a high-margin recurring demand for universities. Having an interactive price estimator bridges the gap between academic file submission and physical hardbound thesis collection.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#FAF9F5] border-t border-neutral-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
