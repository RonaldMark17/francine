import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  PackageCheck
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeTab, 
    navigateTo, 
    cartCount, 
    setIsCartOpen,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [badgeBouncing, setBadgeBouncing] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setBadgeBouncing(true);
      const timer = setTimeout(() => setBadgeBouncing(false), 450);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'promotions', label: 'Promotions' },
    { id: 'services', label: 'Printing Services' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (tabId) => {
    navigateTo(tabId);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop', { search: searchQuery.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E5E0] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#121212] text-[#EFEFEF] text-[11px] uppercase tracking-widest py-2 px-4 text-center border-b border-black flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1.5 font-light">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Academic Omnichannel Retail Store • Sampaloc, Manila
        </span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="hidden md:inline font-light">
          Same-Day In-Store Pickup & Local Courier Delivery
        </span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="text-amber-200 font-medium">
          Use Code <span className="underline tracking-wider">STUDENT15</span> for 15% Off
        </span>
      </div>

      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-800 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Celine Inspired High-End Typography */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button 
              onClick={() => handleNavClick('home')}
              className="group text-left inline-block focus:outline-none"
            >
              <div className="text-2xl sm:text-3xl font-light font-editorial tracking-[0.25em] text-[#121212] uppercase transition-all duration-300 group-hover:opacity-80">
                MAMA MO
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-neutral-500 -mt-1 font-sans">
                INK PRINT &amp; SUPPLIES • MANILA
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-[12px] uppercase tracking-[0.18em] transition-all relative py-1 ${
                    isActive 
                      ? 'text-black font-semibold' 
                      : 'text-neutral-500 hover:text-black font-medium'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-5">
            {/* Search Toggle / Input */}
            <div className="relative">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search papers, pens, ink..."
                    autoFocus
                    className="w-48 sm:w-64 text-xs bg-white border border-neutral-300 px-3 py-1.5 focus:outline-none focus:border-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearchInput(false)}
                    className="p-1.5 text-neutral-500 hover:text-black ml-1"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-neutral-700 hover:text-black transition-colors"
                  title="Search inventory"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 stroke-[1.5]" />
                </button>
              )}
            </div>

            {/* Admin Dashboard Portal Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-2.5 py-1 transition-all ${
                activeTab === 'admin'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              title="Store Owner & Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-800 hover:text-black transition-transform duration-200 active:scale-95 group"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-[#121212] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold border-2 border-[#FAF9F5] transition-transform ${badgeBouncing ? 'animate-cart-bounce' : ''}`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-[#FAF9F5] px-6 py-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left text-sm uppercase tracking-[0.2em] py-2 border-b border-neutral-200/50 ${
                  activeTab === link.id ? 'font-semibold text-black' : 'text-neutral-600'
                }`}
              >
                {link.label}
              </button>
            ))}
            
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-center py-2.5 text-xs uppercase tracking-widest bg-black text-white"
              >
                Access Admin Portal
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
