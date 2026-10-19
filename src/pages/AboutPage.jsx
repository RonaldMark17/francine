import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, ShieldCheck, Heart, Sparkles, MapPin, Users, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { storeInfo, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Editorial Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
          Our Heritage &amp; Vision
        </span>
        <h1 className="text-4xl sm:text-5xl font-light font-editorial text-black tracking-tight uppercase">
          Empowering Education &amp; Work Through Purposeful Retail
        </h1>
        <p className="text-sm text-neutral-600 font-light leading-relaxed">
          Founded in the vibrant student community of Sampaloc, Manila, Mama Mo Ink Print and Supplies bridges traditional brick-and-mortar hospitality with the modern efficiency of omnichannel digital commerce.
        </p>
      </div>

      {/* Feature Story Image & Text Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#FAF9F5] border border-neutral-300 p-8 sm:p-12">
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
            The Omnichannel Mission
          </span>
          <h2 className="text-3xl font-light font-editorial text-black uppercase leading-tight">
            Designed for Campus Life &amp; Institutional Demands
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            In bustling university districts, students and teachers frequently juggle fast-paced deadlines, sudden printing requirements, and supply shortages between lectures.
          </p>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Mama Mo redefines school and office supplies shopping by transforming everyday essentials into a seamless experience: reserve bond papers, exam notebooks, or precision pens online, pick up within minutes at our dedicated express counter, or arrange local courier delivery straight to faculty rooms and campus dorms.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="border-l-2 border-black pl-3 space-y-0.5">
              <span className="text-base font-bold text-black font-mono">15-Min</span>
              <p className="text-[11px] text-neutral-500 font-light">Rapid Store Counter Pickup</p>
            </div>
            <div className="border-l-2 border-black pl-3 space-y-0.5">
              <span className="text-base font-bold text-black font-mono">100%</span>
              <p className="text-[11px] text-neutral-500 font-light">Authentic Inks &amp; Papers</p>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden border border-neutral-300 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"
            alt="Stationery craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
            Core Philosophy
          </span>
          <h3 className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-wide mt-1 uppercase">
            What Sets Mama Mo Apart
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-neutral-200 space-y-3">
            <ShieldCheck className="w-6 h-6 text-black stroke-[1.5]" />
            <h4 className="font-editorial text-lg text-black">Celine-Inspired Elegance</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              We reject the chaotic, cluttered visual identity typical of neighborhood supply stores. Our platform honors the student and educator with clean typography, generous whitespace, and serene navigation.
            </p>
          </div>

          <div className="p-8 bg-white border border-neutral-200 space-y-3">
            <Sparkles className="w-6 h-6 text-black stroke-[1.5]" />
            <h4 className="font-editorial text-lg text-black">Dual Omnichannel Flexibility</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Complete freedom of fulfillment. Pick up at our physical counter across University Gate 3, or choose prompt door-to-door courier delivery when preparing for classroom morning sessions.
            </p>
          </div>

          <div className="p-8 bg-white border border-neutral-200 space-y-3">
            <Users className="w-6 h-6 text-black stroke-[1.5]" />
            <h4 className="font-editorial text-lg text-black">Academic Community Commitment</h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              We maintain special student discounts, faculty packages, and emergency thesis rush printing so that academic excellence is always supported.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-10 bg-[#161616] text-white text-center space-y-4">
        <h3 className="font-editorial text-2xl sm:text-3xl uppercase tracking-wide">
          Ready to Experience Modern Supplies Shopping?
        </h3>
        <p className="text-xs text-neutral-300 max-w-md mx-auto font-light">
          Browse our full inventory of genuine papers, writing instruments, printer inks, or request printing service quotes today.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3 bg-white text-black text-xs uppercase tracking-widest font-medium hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
