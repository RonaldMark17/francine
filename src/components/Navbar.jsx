import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  User,
  ChevronDown
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
    navigationConfig
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [visibleDesktopCount, setVisibleDesktopCount] = useState(0);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [badgeBouncing, setBadgeBouncing] = useState(false);
  const desktopNavRef = useRef(null);
  const navMeasurementRef = useRef(null);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    if (cartCount > 0) {
      setBadgeBouncing(true);
      const timer = setTimeout(() => setBadgeBouncing(false), 450);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const navLinks = useMemo(() => {
    const fallbackLinks = [
      { id: 'home', label: 'Home', path: 'home' },
      { id: 'shop', label: 'Shop', path: 'shop' },
      { id: 'promotions', label: 'Promotions', path: 'promotions' },
      { id: 'services', label: 'Printing Services', path: 'services' },
      { id: 'transactions', label: 'Transactions', path: 'transactions' },
      { id: 'about', label: 'About Us', path: 'about' },
      { id: 'contact', label: 'Contact', path: 'contact' }
    ];
    const hasSavedHeaderNavigation = Array.isArray(navigationConfig?.headerNav);
    const configuredLinks = (navigationConfig?.headerNav || [])
      .filter((item) => item.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const rawLinks = hasSavedHeaderNavigation ? configuredLinks : fallbackLinks;

    return rawLinks.filter((item) => {
      const target = (item.path || item.id || '').toLowerCase();
      const label = (item.label || '').toLowerCase();
      if (target === 'tracking' || item.id === 'nav-tracking' || label.includes('track order')) {
        return false;
      }
      if (target === 'transactions' || item.id === 'nav-transactions' || label.includes('transaction')) {
        return Boolean(currentUser);
      }
      return true;
    });
  }, [navigationConfig?.headerNav, currentUser]);

  const isLinkActive = (link) => {
    const target = link.path || link.id;
    return activeTab === target || (activeTab === 'custom_page' && activeCustomPageSlug === target);
  };

  const navigationSignature = navLinks.map((link) => `${link.id}:${link.label}:${link.path}`).join('|');

  useLayoutEffect(() => {
    const calculateVisibleLinks = () => {
      const container = desktopNavRef.current;
      const measurement = navMeasurementRef.current;
      if (!container || !measurement || container.clientWidth === 0) return;

      const linkWidths = Array.from(measurement.querySelectorAll('[data-nav-measure]'))
        .map((element) => element.getBoundingClientRect().width);
      const moreWidth = measurement.querySelector('[data-more-measure]')?.getBoundingClientRect().width || 0;
      const availableWidth = container.clientWidth;
      const gap = 24;
      const allLinksWidth = linkWidths.reduce((total, width) => total + width, 0)
        + Math.max(0, linkWidths.length - 1) * gap;

      if (allLinksWidth <= availableWidth) {
        setVisibleDesktopCount(linkWidths.length);
        return;
      }

      let usedWidth = 0;
      let count = 0;
      for (const width of linkWidths) {
        const nextWidth = usedWidth + (count > 0 ? gap : 0) + width;
        const reservedMoreWidth = (count >= 0 ? gap : 0) + moreWidth;
        if (nextWidth + reservedMoreWidth > availableWidth) break;
        usedWidth = nextWidth;
        count += 1;
      }
      setVisibleDesktopCount(count);
    };

    calculateVisibleLinks();
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(calculateVisibleLinks)
      : null;
    if (desktopNavRef.current && resizeObserver) resizeObserver.observe(desktopNavRef.current);
    window.addEventListener('resize', calculateVisibleLinks);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', calculateVisibleLinks);
    };
  }, [navigationSignature]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia('(min-width: 1024px)');
    const closeDrawerOnDesktop = (event) => {
      if (event.matches) setMobileMenuOpen(false);
    };
    desktopBreakpoint.addEventListener('change', closeDrawerOnDesktop);
    return () => desktopBreakpoint.removeEventListener('change', closeDrawerOnDesktop);
  }, []);

  useEffect(() => {
    if (!moreMenuOpen) return undefined;
    const closeMoreMenu = (event) => {
      if (!moreMenuRef.current?.contains(event.target)) setMoreMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMoreMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeMoreMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeMoreMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [moreMenuOpen]);

  const handleNavClick = (tabId) => {
    navigateTo(tabId);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  const visibleDesktopLinks = navLinks.slice(0, visibleDesktopCount);
  const overflowDesktopLinks = navLinks.slice(visibleDesktopCount);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop', { search: searchQuery.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E5E0] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#121212] text-[#EFEFEF] text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest py-1.5 sm:py-2 px-3 sm:px-4 text-center border-b border-black flex flex-wrap items-center justify-center gap-2 sm:gap-4 leading-normal">
        <span className="flex items-center gap-1.5 font-light">
          <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
          <span>Purok 5, Banago, Nagcarlan, Laguna</span>
        </span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="hidden md:inline font-light">
          Same-Day In-Store Pickup &amp; Local Courier Delivery
        </span>
        <span className="text-neutral-500">•</span>
        <span className="text-amber-200 font-medium whitespace-nowrap">
          Use Code <span className="underline tracking-wider font-mono font-bold">STUDENT15</span> for 15% Off
        </span>
      </div>

      {/* Main Navigation Container */}
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden mr-1 sm:mr-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 sm:p-2 text-neutral-800 hover:text-black focus:outline-none rounded-lg hover:bg-neutral-200/50 transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-store-navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="shrink-0 min-w-0">
            <button 
              onClick={() => handleNavClick('home')}
              className="group text-left inline-flex min-w-0 items-center gap-2 sm:gap-3 focus:outline-none"
            >
              <img 
                src="/images/mama_mo_logo.png" 
                alt="Mama Mo Ink Print & Supplies" 
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover shadow-xs border border-neutral-200 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="block">
                <div className="text-base sm:text-2xl font-light font-editorial tracking-[0.16em] sm:tracking-[0.22em] text-[#121212] uppercase transition-all duration-300 group-hover:opacity-80 leading-none">
                  MAMA MO
                </div>
                <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.22em] sm:tracking-[0.32em] text-neutral-500 mt-0.5 sm:-mt-1 font-sans whitespace-nowrap">
                  INK PRINT &amp; SUPPLIES
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            ref={desktopNavRef}
            className="relative hidden lg:block flex-1 min-w-0 ml-8 xl:ml-12"
            aria-label="Store navigation"
          >
            <div className="flex flex-nowrap items-center gap-6 whitespace-nowrap">
              {visibleDesktopLinks.map((link) => {
                const target = link.path || link.id;
                const isActive = isLinkActive(link);
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(target)}
                    className={`shrink-0 text-[11px] xl:text-[12px] uppercase tracking-[0.14em] xl:tracking-[0.18em] whitespace-nowrap transition-all relative py-1 ${
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

              {overflowDesktopLinks.length > 0 && (
                <div ref={moreMenuRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setMoreMenuOpen((open) => !open)}
                    className={`flex items-center gap-1 py-1 text-[11px] xl:text-[12px] uppercase tracking-[0.14em] xl:tracking-[0.18em] transition-colors ${
                      overflowDesktopLinks.some(isLinkActive) || moreMenuOpen
                        ? 'text-black font-semibold'
                        : 'text-neutral-500 hover:text-black font-medium'
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={moreMenuOpen}
                  >
                    More
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {moreMenuOpen && (
                    <div
                      role="menu"
                      className="absolute left-0 top-full z-50 mt-3 min-w-56 border border-neutral-200 bg-[#FAF9F5] p-2 shadow-xl animate-pop-in"
                    >
                      {overflowDesktopLinks.map((link) => {
                        const target = link.path || link.id;
                        const isActive = isLinkActive(link);
                        return (
                          <button
                            key={link.id}
                            role="menuitem"
                            onClick={() => handleNavClick(target)}
                            className={`block w-full whitespace-nowrap px-3 py-2.5 text-left text-[11px] uppercase tracking-[0.16em] transition-colors ${
                              isActive ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                            }`}
                          >
                            {link.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              ref={navMeasurementRef}
              className="pointer-events-none invisible absolute left-0 top-0 flex flex-nowrap items-center gap-6 whitespace-nowrap"
              aria-hidden="true"
            >
              {navLinks.map((link) => (
                <span
                  key={link.id}
                  data-nav-measure
                  className="shrink-0 text-[11px] xl:text-[12px] uppercase tracking-[0.14em] xl:tracking-[0.18em] font-semibold"
                >
                  {link.label}
                </span>
              ))}
              <span
                data-more-measure
                className="flex shrink-0 items-center gap-1 text-[11px] xl:text-[12px] uppercase tracking-[0.14em] xl:tracking-[0.18em] font-semibold"
              >
                More <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="ml-auto shrink-0 flex items-center space-x-1 sm:space-x-4 pl-1 sm:pl-4">
            
            {/* Search Toggle / Floating Overlay */}
            <div className="relative">
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="p-2 text-neutral-700 hover:text-black transition-colors"
                title="Search inventory"
                aria-label="Search"
              >
                {showSearchInput ? <X className="w-5 h-5 stroke-[1.5]" /> : <Search className="w-5 h-5 stroke-[1.5]" />}
              </button>

              {showSearchInput && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs animate-fade-in" 
                    onClick={() => setShowSearchInput(false)} 
                  />
                  {/* Floating search panel */}
                  <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-18 sm:top-full sm:mt-3 z-50 sm:w-96 bg-white/98 backdrop-blur-md border border-neutral-800 shadow-2xl p-2 animate-pop-in">
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search papers, pens, ink, supplies..."
                        autoFocus
                        className="w-full text-xs pl-9 pr-16 py-2.5 bg-neutral-50 border border-neutral-200 focus:bg-white focus:outline-none focus:border-black font-sans transition-all"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-black text-white text-[10px] uppercase tracking-wider font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </>
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
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-2 sm:px-3 py-1.5 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-all bg-white"
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
                className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-2 sm:px-2.5 py-1 transition-all ${
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

      {/* Mobile Drawer Navigation Menu rendered at root level */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Store navigation">
          {/* Full Screen Dim Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          {/* Full Height Animated Drawer */}
          <aside
            id="mobile-store-navigation"
            className="mobile-nav-drawer fixed inset-y-0 left-0 z-10 flex h-full h-[100dvh] w-[min(88vw,360px)] flex-col border-r border-neutral-200 bg-[#FAF9F5] shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-neutral-200 px-5 pt-[env(safe-area-inset-top)]">
              <button
                onClick={() => handleNavClick('home')}
                className="inline-flex items-center gap-3 text-left focus:outline-none"
              >
                <img
                  src="/images/mama_mo_logo.png"
                  alt="Mama Mo Logo"
                  className="h-10 w-10 rounded-full border border-neutral-200 object-cover shadow-2xs"
                />
                <div>
                  <span className="font-editorial text-lg tracking-[0.18em] text-black font-semibold block leading-tight">MAMA MO</span>
                  <span className="text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-sans block">INK PRINT &amp; SUPPLIES</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-600 transition-colors hover:text-black rounded-lg hover:bg-neutral-200/50"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mb-5 flex w-full items-center justify-between border border-neutral-300 bg-white p-3 text-left shadow-2xs hover:border-black transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white shadow-2xs">
                      {currentUser.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-xs font-semibold text-black">{currentUser.name}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                        Role: {currentUser.role}
                      </span>
                    </span>
                  </span>
                  <span className="text-[11px] text-neutral-500 underline font-medium">Manage</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mb-5 w-full bg-black py-3 text-center text-xs font-medium uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors shadow-2xs active:scale-[0.99]"
                >
                  Sign In to Account
                </button>
              )}

              {/* Navigation Links List */}
              <nav className="flex flex-col" aria-label="Mobile store navigation">
                {navLinks.map((link) => {
                  const target = link.path || link.id;
                  const isActive = isLinkActive(link);
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(target)}
                      className={`flex items-center justify-between border-b border-neutral-200/70 py-3.5 text-left text-xs uppercase tracking-[0.2em] transition-colors ${
                        isActive ? 'font-semibold text-black bg-neutral-100/40 -mx-2 px-2' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </button>
                  );
                })}
              </nav>

              {/* Action Buttons & Store Footer Info */}
              <div className="flex flex-col gap-3 pt-6">
                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full bg-black py-2.5 text-center text-xs uppercase tracking-widest text-white shadow-2xs hover:bg-neutral-800 transition-colors"
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
                    className="flex items-center justify-center gap-2 border border-neutral-300 bg-white py-2.5 text-center text-xs uppercase tracking-widest text-neutral-700 hover:border-black hover:text-black transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-neutral-500" />
                    <span>Admin Portal</span>
                  </button>
                )}

                <div className="border-t border-neutral-200/70 pt-5 text-center space-y-1">
                  <p className="font-editorial text-xs italic text-neutral-600">
                    &ldquo;Plumang abot kaya, dito lang yan kay Mama&rdquo;
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                    Purok 5, Banago, Nagcarlan, Laguna
                  </p>
                  <p className="font-sans text-[10px] text-neutral-500">
                    Mon - Sat: 7:30 AM - 6:30 PM
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}
