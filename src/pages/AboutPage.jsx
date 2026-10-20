import { ABOUT_TEAM } from '../data/aboutTeam';
import { useCoreContent } from '../components/builder/CoreContentContext';
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  MapPin, 
  Users, 
  Award, 
  ArrowRight,
  Compass,
  Target,
  Layers,
  Printer,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Building2,
  Clock
} from 'lucide-react';

export default function AboutPage() {
  const coreContent = useCoreContent();
  const { storeInfo, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 animate-fade-in text-[#121212]">
      
      {/* Editorial Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-down">
        <span className="text-[11px] uppercase tracking-[0.3em] text-amber-700 font-semibold font-mono bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block animate-pulse-subtle">{coreContent.text("content-1", "Established 2026 • Nagcarlan, Laguna")}</span>
        <h1 className="text-4xl sm:text-5xl font-light font-editorial text-black tracking-tight uppercase leading-tight">{coreContent.text("content-2", "Mama Mo Ink Print and Supplies")}</h1>
        <p className="font-editorial text-xl sm:text-2xl text-neutral-800 italic">{coreContent.text("content-3", "“Plumang abot kaya, dito lang yan kay Mama”")}</p>
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">{coreContent.text("content-4", "A dedicated one-stop retail hub located along Nagcarlan–Rizal Road, Barangay Banago, Nagcarlan, Laguna. Created to eliminate the hassle of visiting multiple shops by providing affordable student supplies and fast printing services under one roof.")}</p>
      </div>

      {/* Feature Story Image & Text Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#FAF9F5] border border-neutral-300 rounded-2xl p-8 sm:p-12 shadow-xs card-interactive hover-lift animate-fade-up delay-100">
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold font-mono">{coreContent.text("content-5", "Strategic Retail Origin")}</span>
          <h2 className="text-3xl font-light font-editorial text-black uppercase leading-tight">{coreContent.text("content-6", "Designed for Learners & Educators in Banago")}</h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">{coreContent.text("content-7", "The retail store was established in 2026 to solve a critical pain point in Barangay Banago: students and local teachers previously had to travel to disjointed locations to purchase basic school materials or secure printing services, adding extra travel expenses and taking valuable study time.")}</p>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">{coreContent.text("content-8", "Strategically situated just ")}<strong>{coreContent.text("content-9", "30 meters from Plaridel Elementary School")}</strong>{coreContent.text("content-10", " and ")}<strong>{coreContent.text("content-11", "50 meters from Plaridel Integrated National High School")}</strong>{coreContent.text("content-12", ", Mama Mo Ink provides immediate, friendly assistance with everyday supplies—from notebooks, exam bond papers, precision gel pens, and art materials, to document rush printing, photocopying, scanning, and bookbinding.")}</p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="border-l-2 border-black pl-3 space-y-0.5 hover-lift">
              <span className="text-base font-bold text-black font-mono">{coreContent.text("content-13", "30–50m")}</span>
              <p className="text-[11px] text-neutral-500 font-light">{coreContent.text("content-14", "From Local School Gates")}</p>
            </div>
            <div className="border-l-2 border-black pl-3 space-y-0.5 hover-lift">
              <span className="text-base font-bold text-black font-mono">{coreContent.text("content-15", "2-in-1")}</span>
              <p className="text-[11px] text-neutral-500 font-light">{coreContent.text("content-16", "School Supplies + Print Shop")}</p>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden border border-neutral-300 rounded-xl shadow-sm image-zoom-container group">
          <img
            data-core-field="content-17" src={coreContent("content-17", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80")}
            alt={coreContent("content-18", "Mama Mo Ink Retail Shop")}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-neutral-200 text-xs">
            <div className="font-semibold text-black">{coreContent.text("content-19", "Purok 5, Barangay Banago, Nagcarlan, Laguna 4002")}</div>
            <div className="text-[10px] text-neutral-500">{coreContent.text("content-20", "Along Nagcarlan–Rizal Road (Parking Area Available)")}</div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up delay-150">
        
        {/* Mission */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 space-y-4 shadow-xs relative overflow-hidden group hover:border-black transition-all hover-lift card-interactive">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block font-bold">{coreContent.text("content-21", "Our Purpose")}</span>
          <h3 className="font-editorial text-2xl text-black font-semibold group-hover:text-amber-900 transition-colors">{coreContent.text("content-22", "Mission")}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">{coreContent.text("content-23", "“To provide fast, reliable, and high-quality printing services together with complete school supplies at a price range that is affordable to all students and to cater to the needs of customers without making them waste their time and money.”")}</p>
        </div>

        {/* Vision */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 space-y-4 shadow-xs relative overflow-hidden group hover:border-black transition-all hover-lift card-interactive">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block font-bold">{coreContent.text("content-24", "Our Aspiration")}</span>
          <h3 className="font-editorial text-2xl text-black font-semibold group-hover:text-blue-900 transition-colors">{coreContent.text("content-25", "Vision")}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">{coreContent.text("content-26", "“To be known to the community of Banago, Nagcarlan, as the most reliable and preferred school supply provider that offers convenience and affordability in purchasing school supplies and dependable customer service that will cater to the needs of every learner.”")}</p>
        </div>

      </div>

      {/* Two-Floor Store Layout Breakdown (From PDF Page 4) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold">{coreContent.text("content-27", "Architectural Retail Design")}</span>
          <h3 className="font-editorial text-3xl text-black font-semibold uppercase">{coreContent.text("content-28", "Two-Floor Purpose-Built Layout")}</h3>
          <p className="text-xs text-neutral-500 font-light">{coreContent.text("content-29", "Designed for optimal foot traffic flow, rapid service turnaround, and student comfort.")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Ground Floor */}
          <div className="p-6 rounded-xl border border-neutral-200 bg-[#FAF9F5] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-700" />
                <h4 className="font-semibold text-black text-sm uppercase tracking-wider">{coreContent.text("content-30", "Ground Floor")}</h4>
              </div>
              <span className="text-[10px] font-mono bg-neutral-200 px-2 py-0.5 rounded text-neutral-700">{coreContent.text("content-31", "Service Hub")}</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600 font-light">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-32", "Entrance Showcase:")}</strong>{coreContent.text("content-33", " Best-selling items, promotions, and new arrivals.")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-34", "Cashier Counter:")}</strong>{coreContent.text("content-35", " Fast checkout and order pickup counter (Counter 2).")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-36", "Computer Stations:")}</strong>{coreContent.text("content-37", " Dedicated student terminals for USB & document submissions.")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-38", "Printing & Waiting Counter:")}</strong>{coreContent.text("content-39", " Rush printing, photocopying, and comfortable seating.")}</span>
              </li>
            </ul>
          </div>

          {/* Second Floor */}
          <div className="p-6 rounded-xl border border-neutral-200 bg-[#FAF9F5] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-700" />
                <h4 className="font-semibold text-black text-sm uppercase tracking-wider">{coreContent.text("content-40", "Second Floor")}</h4>
              </div>
              <span className="text-[10px] font-mono bg-neutral-200 px-2 py-0.5 rounded text-neutral-700">{coreContent.text("content-41", "Supplies Gallery")}</span>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600 font-light">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-42", "Notebooks & Paper Gallery:")}</strong>{coreContent.text("content-43", " Writing pads, graph paper, reams, and sketchbooks.")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-44", "Pens, Pencils & Writing Aisle:")}</strong>{coreContent.text("content-45", " High-precision gel pens, markers, and drafting tools.")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-46", "Art Materials & Folders:")}</strong>{coreContent.text("content-47", " Expanded envelopes, specialty paper, and project boards.")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>{coreContent.text("content-48", "Bundle Corner:")}</strong>{coreContent.text("content-49", " Semester starter packages and exam week survival bundles.")}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Unique Selling Proposition (USP) Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold">{coreContent.text("content-50", "Value Proposition")}</span>
          <h3 className="font-editorial text-3xl text-black font-semibold uppercase">{coreContent.text("content-51", "Our Competitive Advantage")}</h3>
          <p className="text-xs text-neutral-500 font-light">{coreContent.text("content-52", "Positioned as High Quality – Low Cost, combining what competitors cannot offer in a single visit.")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up delay-100">
          <div className="p-8 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs card-interactive hover-lift group">
            <Layers className="w-6 h-6 text-black stroke-[1.5] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
            <h4 className="font-editorial text-lg text-black font-semibold group-hover:text-amber-900 transition-colors">{coreContent.text("content-53", "Dual Services in One Stop")}</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">{coreContent.text("content-54", "Unlike local printing shops that lack school materials, or mini-stores that offer no printing, Mama Mo Ink provides both printing expertise and complete school supplies under one roof.")}</p>
          </div>

          <div className="p-8 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs card-interactive hover-lift group">
            <Award className="w-6 h-6 text-black stroke-[1.5] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
            <h4 className="font-editorial text-lg text-black font-semibold group-hover:text-amber-900 transition-colors">{coreContent.text("content-55", "Student-Friendly Rates")}</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">{coreContent.text("content-56", "Priced to fit typical student allowances through effective inventory sourcing, volume supplier partnerships, and transparent pricing policies.")}</p>
          </div>

          <div className="p-8 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs card-interactive hover-lift group">
            <Sparkles className="w-6 h-6 text-black stroke-[1.5] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 text-amber-500" />
            <h4 className="font-editorial text-lg text-black font-semibold group-hover:text-amber-900 transition-colors">{coreContent.text("content-57", "Multichannel Access")}</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">{coreContent.text("content-58", "Browse products, reserve reams, and pre-order rush prints online or via Facebook, picking up packed orders ready at Counter 2 in minutes.")}</p>
          </div>
        </div>
      </div>

      {/* Team / Founders Section (From PDF Page 1) */}
      <div className="bg-[#FAF9F5] border border-neutral-300 rounded-2xl p-8 sm:p-12 space-y-8 shadow-xs animate-fade-up delay-150">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold">{coreContent.text("content-59", "Strategic Retail Plan Team • 4BSBA-MM1")}</span>
          <h3 className="font-editorial text-3xl text-black font-semibold uppercase">{coreContent.text("content-60", "Founders & Management Team")}</h3>
          <p className="text-xs text-neutral-500 font-light">{coreContent.text("content-61", "Submitted to: Sir Guillermo Briones (October 2026)")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ABOUT_TEAM.map((member, idx) => (
            <div key={idx} data-core-field={`team-${idx}-name`} className="bg-white border border-neutral-200 rounded-xl p-5 text-center space-y-3 shadow-2xs card-interactive hover-lift group">
              <div data-core-field={`team-${idx}-image`} className="w-12 h-12 overflow-hidden rounded-full bg-neutral-900 text-amber-300 mx-auto flex items-center justify-center font-mono font-bold text-sm group-hover:scale-110 group-hover:bg-black transition-all duration-300 shadow-2xs">
                {coreContent(`team-${idx}-image`, '') ? (
                  <img src={coreContent(`team-${idx}-image`, '')} alt={coreContent(`team-${idx}-name`, member.name)} className="w-full h-full object-cover" />
                ) : coreContent.text(`team-${idx}-initials`, member.initials)}
              </div>
              <div>
                <h4 className="font-semibold text-black text-xs group-hover:text-amber-900 transition-colors">{coreContent.text(`team-${idx}-name`, member.name)}</h4>
                <p className="text-[10px] text-neutral-500 mt-0.5 leading-snug">{coreContent.text(`team-${idx}-role`, member.role)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-10 bg-[#161616] text-white text-center space-y-4 rounded-2xl shadow-md">
        <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-wide">{coreContent.text("content-62", "Ready to Experience Convenient School Shopping?")}</h3>
        <p className="text-xs text-neutral-300 max-w-md mx-auto font-light">{coreContent.text("content-63", "Visit our store in Purok 5, Barangay Banago, Nagcarlan, Laguna or reserve your materials online for immediate counter pickup.")}</p>
        <div className="pt-2">
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 rounded-lg shadow-sm"
          >
            <span>{coreContent.text("content-64", "Explore Supplies Catalog")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
