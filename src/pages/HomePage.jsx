import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { 
  ArrowRight, 
  Sparkles, 
  Printer, 
  Store, 
  Truck, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  Briefcase,
  Copy,
  Check
} from 'lucide-react';

export default function HomePage() {
  const { 
    products, 
    promotions, 
    navigateTo, 
    setSelectedCategory,
    showToast
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(null);

  // Filter featured and discounted products
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const discountedProducts = products.filter(p => p.isDiscounted).slice(0, 4);

  const categories = [
    {
      name: 'School Supplies',
      desc: 'Pens, pencils, notebooks, and drafting essentials',
      image: '/images/pilot_gtec_pens.jpg',
      tag: 'Academic Staple'
    },
    {
      name: 'Paper Products',
      desc: 'Multipurpose 70/80gsm reams, specialty bond papers',
      image: '/images/paper_one_ream.jpg',
      tag: 'Best Seller'
    },
    {
      name: 'Office Supplies',
      desc: 'Desk organizers, staplers, ledgers, and files',
      image: '/images/deli_stapler.jpg',
      tag: 'Faculty Choice'
    },
    {
      name: 'Printing Materials',
      desc: 'Genuine printer inks, binding wires, laminating sheets',
      image: '/images/epson_003_ink.jpg',
      tag: 'Production Grade'
    }
  ];

  const handleCopyPromo = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-24 pb-24">
      
      {/* 1. HERO SECTION - Celine Minimalist High-End Aesthetic */}
      <section className="relative min-h-[82vh] flex items-center justify-center bg-[#FAF9F5] border-b border-[#E7E5E0] px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle Luxury Pattern / Backdrop */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d1cfc7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 py-16 sm:py-24">
          
          <img 
            src="/images/mama_mo_logo.jpg" 
            alt="Mama Mo Ink Print & Supplies" 
            className="animate-pop-in w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full object-cover shadow-lg border-2 border-white/80 mb-6 hover:scale-105 transition-transform duration-300"
          />

          <div className="animate-fade-down delay-75 inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-300 text-[10px] uppercase tracking-[0.25em] text-neutral-600 mb-6 font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
            Purok 5, Banago, Nagcarlan • One-Stop School &amp; Print Hub
          </div>

          <h1 className="animate-fade-up delay-100 text-4xl sm:text-6xl lg:text-7xl font-light font-editorial text-[#121212] tracking-tight leading-[1.08] uppercase">
            Everything You Need, <br className="hidden sm:inline" />
            <span className="italic font-normal">All in One Place.</span>
          </h1>

          <p className="animate-fade-up delay-150 font-editorial text-xl sm:text-2xl text-neutral-800 italic mt-4">
            &ldquo;Plumang abot kaya, dito lang yan kay Mama&rdquo;
          </p>

          <p className="animate-fade-up delay-200 mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Conveniently located 30–50m from Plaridel Elementary School and Plaridel Integrated National High School. Complete school supplies, photocopying, and rush printing tailored to student allowances.
          </p>

          {/* Action CTAs */}
          <div className="animate-fade-up delay-250 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto px-8 py-4 bg-black text-white text-xs uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-xl hover:-translate-y-0.5 group"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>

            <button
              onClick={() => navigateTo('services')}
              className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-xs border border-neutral-400 text-neutral-900 text-xs uppercase tracking-[0.22em] font-medium hover:bg-neutral-100 hover:border-black active:scale-95 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-neutral-600 group-hover:scale-110 transition-transform" />
              <span>Book Printing Service</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="animate-fade-up delay-300 mt-14 pt-10 border-t border-neutral-300/70 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1 p-3 bg-white/40 hover:bg-white hover-lift border border-transparent hover:border-neutral-200 transition-all">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Fulfillment</span>
              <p className="text-xs font-semibold text-black">In-Store Pickup &amp; Delivery</p>
            </div>
            <div className="space-y-1 p-3 bg-white/40 hover:bg-white hover-lift border border-transparent hover:border-neutral-200 transition-all">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Academic Discounts</span>
              <p className="text-xs font-semibold text-black">15% Off with Student ID</p>
            </div>
            <div className="space-y-1 p-3 bg-white/40 hover:bg-white hover-lift border border-transparent hover:border-neutral-200 transition-all">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Turnaround</span>
              <p className="text-xs font-semibold text-black">Same-Day Rush Printing</p>
            </div>
            <div className="space-y-1 p-3 bg-white/40 hover:bg-white hover-lift border border-transparent hover:border-neutral-200 transition-all">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Currency</span>
              <p className="text-xs font-semibold text-black">Philippine Pesos (₱)</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHTS - Celine Editorial Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
              Curated Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-wide mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-medium mt-3 md:mt-0 flex items-center gap-1.5 group"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedCategory(cat.name);
                navigateTo('shop', { category: cat.name });
              }}
              className="group cursor-pointer bg-white border border-[#EBE8E1] hover:border-black transition-all duration-300 overflow-hidden flex flex-col justify-between hover-lift"
            >
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-3 left-3 bg-[#FAF9F5] text-neutral-800 text-[9px] uppercase tracking-wider px-2 py-0.5 border border-neutral-300">
                  {cat.tag}
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-editorial text-lg text-black group-hover:text-neutral-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] uppercase tracking-wider text-black font-medium">
                  <span>Browse Department</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
              Academic &amp; Office Staples
            </span>
            <h2 className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-wide mt-1">
              Featured Essentials
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-medium mt-3 md:mt-0 flex items-center gap-1.5"
          >
            <span>Browse Full Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONS BANNER - Luxury Minimalist Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161616] text-white p-8 sm:p-12 lg:p-16 border border-black relative overflow-hidden">
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-medium">
              Academic Privilege Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-light font-editorial tracking-tight leading-tight uppercase">
              Equip Your Semester with 15% Off
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Valid for university students, educators, and staff. Use promotional code at checkout to enjoy automatic savings on paper reams, writing instruments, and project supplies.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-4 py-2.5">
                <span className="text-xs uppercase text-neutral-400 tracking-wider">Promo Code:</span>
                <span className="font-mono font-bold text-amber-200 text-sm tracking-widest">
                  STUDENT15
                </span>
                <button
                  onClick={() => handleCopyPromo('STUDENT15')}
                  className="ml-2 text-neutral-400 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copiedCode === 'STUDENT15' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={() => navigateTo('promotions')}
                className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-medium hover:bg-neutral-200 transition-colors"
              >
                View All Promotions
              </button>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-10 -bottom-10 w-96 h-96 border border-neutral-800 rounded-full opacity-30 pointer-events-none" />
        </div>
      </section>

      {/* 5. DEDICATED PRINTING SERVICES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F5] border border-neutral-300 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
                High-Volume &amp; Hardbound Finishing
              </span>
              <h2 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide leading-tight uppercase">
                Professional Campus &amp; Enterprise Printing
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                From undergraduate thesis dissertations with embossed gold lettering to 500-copy exam modules and waterproof student ID laminations, Mama Mo guarantees crisp production quality and dependable turnarounds.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-white border border-neutral-200 space-y-1">
                  <span className="text-sm font-semibold text-black">₱2.00 / page</span>
                  <p className="text-[11px] text-neutral-500 font-light">Laser B&amp;W Document Printing</p>
                </div>
                <div className="p-3.5 bg-white border border-neutral-200 space-y-1">
                  <span className="text-sm font-semibold text-black">From ₱450</span>
                  <p className="text-[11px] text-neutral-500 font-light">Thesis Hardbound with Gold Foil</p>
                </div>
                <div className="p-3.5 bg-white border border-neutral-200 space-y-1">
                  <span className="text-sm font-semibold text-black">₱1.00 / page</span>
                  <p className="text-[11px] text-neutral-500 font-light">Duplex High-Speed Photocopying</p>
                </div>
                <div className="p-3.5 bg-white border border-neutral-200 space-y-1">
                  <span className="text-sm font-semibold text-black">From ₱50</span>
                  <p className="text-[11px] text-neutral-500 font-light">Spiral &amp; Wire-O Bookbinding</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('services')}
                  className="px-8 py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <span>Interactive Price Estimator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-neutral-200 overflow-hidden border border-neutral-300">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                alt="Thesis and printing services"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-4 border border-neutral-200 text-xs">
                <span className="font-semibold text-black block">Same-Day Rush Inquiries Welcome</span>
                <span className="text-neutral-500 font-light text-[11px]">
                  Submit your PDF or DOCX file online and collect at Counter 2.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SPECIAL OFFERS & DISCOUNTED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
              Limited-Time Savings
            </span>
            <h2 className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-wide mt-1">
              Discounted Essentials
            </h2>
          </div>
          <button
            onClick={() => navigateTo('promotions')}
            className="text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-medium mt-3 md:mt-0 flex items-center gap-1.5"
          >
            <span>See All Promotions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. TARGET CUSTOMER AUDIENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#0A1A3A] font-semibold">
            Serving Banago, Nagcarlan &amp; Partner Campuses
          </span>
          <h2 className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-wide mt-1">
            Built for Students, Educators &amp; Our Local Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-neutral-200 text-center space-y-3 card-interactive group hover-lift">
            <div className="w-12 h-12 mx-auto bg-[#0A1A3A]/5 border border-[#0A1A3A]/15 flex items-center justify-center text-[#0A1A3A] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-editorial text-lg text-black group-hover:text-amber-900 transition-colors">For Students (PINHS &amp; Plaridel)</h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Located only 30m from Plaridel Elementary and 50m from Plaridel Integrated National High School. Stop by before class, at lunch, or dismissal for quick document printing, pens, notebooks, and project materials priced for student allowances.
            </p>
          </div>

          <div className="p-8 bg-white border border-neutral-200 text-center space-y-3 card-interactive group hover-lift">
            <div className="w-12 h-12 mx-auto bg-[#0A1A3A]/5 border border-[#0A1A3A]/15 flex items-center justify-center text-[#0A1A3A] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <BookOpen className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-editorial text-lg text-black group-hover:text-amber-900 transition-colors">For Educators &amp; Faculty</h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Exam sheets, syllabus printing, ream papers, and classroom materials with educator discounts and quick turnaround times. Reserve supplies online or through our Facebook page for instant pickup.
            </p>
          </div>

          <div className="p-8 bg-white border border-neutral-200 text-center space-y-3 card-interactive group hover-lift">
            <div className="w-12 h-12 mx-auto bg-[#0A1A3A]/5 border border-[#0A1A3A]/15 flex items-center justify-center text-[#0A1A3A] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Briefcase className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-editorial text-lg text-black group-hover:text-amber-900 transition-colors">For Banago Residents &amp; Passersby</h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Conveniently along Nagcarlan–Rizal Road with accessible parking beside Maco&apos;s commercial building. Fast photocopying, laminating, scanning, and office supplies with cash, GCash, Maya, and bank transfers accepted.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
