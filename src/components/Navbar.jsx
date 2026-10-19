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
  User,
  GraduationCap,
  BookOpen,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeTab, 
    activeCustomPageSlug,
    navigateTo, 
    cartCount, 
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    navigationConfig,
    logout
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

  const dynamicHeaderLinks = (navigationConfig?.headerNav || [])
    .filter(item => item.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const navLinks = dynamicHeaderLinks.length > 0 ? dynamicHeaderLinks : [
    { id: 'home', label: 'Home', path: 'home' },
    { id: 'shop', label: 'Shop', path: 'shop' },
    { id: 'promotions', label: 'Promotions', path: 'promotions' },
    { id: 'services', label: 'Printing Services', path: 'services' },
    { id: 'tracking', label: 'Track Order', path: 'tracking' },
    { id: 'about', label: 'About Us', path: 'about' },
    { id: 'contact', label: 'Contact', path: 'contact' }
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
          Official Omnichannel Store • Purok 5, Banago, Nagcarlan, Laguna 4002
        </span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="hidden md:inline font-light">
          Same-Day In-Store Pickup &amp; Local Courier Delivery
        </span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="text-amber-200 font-medium">
          Use Code <span className="underline tracking-wider">STUDENT15</span> for 15% Off
        </span>
      </div>

      {/* Main Navigation Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden mr-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-800 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - Celine Inspired High-End Typography */}
          <div className="shrink-0">
            <button 
              onClick={() => handleNavClick('home')}
              className="group text-left inline-block focus:outline-none"
            >
              <div className="text-2xl sm:text-3xl font-light font-editorial tracking-[0.22em] text-[#121212] uppercase transition-all duration-300 group-hover:opacity-80">
                MAMA MO
              </div>
              <div className="text-[9px] uppercase tracking-[0.32em] text-neutral-500 -mt-1 font-sans whitespace-nowrap">
                INK PRINT &amp; SUPPLIES
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-8 xl:ml-12">
            {navLinks.map((link) => {
              const target = link.path || link.id;
              const isActive = activeTab === target || (activeTab === 'custom_page' && activeCustomPageSlug === target);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(target)}
                  className={`text-[11px] xl:text-[12px] uppercase tracking-[0.14em] xl:tracking-[0.18em] whitespace-nowrap transition-all relative py-1 ${
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
          <div className="ml-auto shrink-0 flex items-center space-x-2 sm:space-x-4 pl-4">
            
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

            {/* User Account Portal / Login Trigger */}
            {currentUser ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 border border-neutral-300 hover:border-black transition-all bg-white"
                title="Account Details & Role Switcher"
              >
                <div className="w-6 h-6 bg-black text-white text-[11px] rounded-full flex items-center justify-center font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-black leading-tight truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono">
                    {currentUser.role}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-3 py-1.5 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-all bg-white"
                title="Customer Sign In"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Admin Management Dashboard Link (Only if user has Admin role or to quickly access store portal) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-2.5 py-1 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-black text-white'
                    : 'bg-neutral-900 text-neutral-100 hover:bg-black'
                }`}
                title="Store Operations & Management"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Admin Portal</span>
              </button>
            )}

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
            {/* User status in mobile */}
            {currentUser ? (
              <div 
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-white border border-neutral-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-black">{currentUser.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                      Role: {currentUser.role}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400 underline">Manage</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-xs uppercase tracking-widest bg-black text-white font-medium"
              >
                Sign In to Account
              </button>
            )}

            {navLinks.map((link) => {
              const target = link.path || link.id;
              const isActive = activeTab === target || (activeTab === 'custom_page' && activeCustomPageSlug === target);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(target)}
                  className={`text-left text-sm uppercase tracking-[0.2em] py-2 border-b border-neutral-200/50 ${
                    isActive ? 'font-semibold text-black' : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            
            <div className="pt-4 flex flex-col gap-3">
              {currentUser?.role === 'admin' ? (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-center py-2.5 text-xs uppercase tracking-widest bg-black text-white"
                >
                  Access Store Admin
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-xs uppercase tracking-widest border border-neutral-300 text-neutral-700"
                >
                  Switch Role / Admin Login
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
