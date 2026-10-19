import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, LogIn, Receipt, Truck } from 'lucide-react';

const LOCAL_PRODUCT_IMAGES = {
  'prod-1': '/images/paper_one_ream.jpg',
  'prod-2': '/images/pilot_gtec_pens.jpg',
  'prod-3': '/images/mongol_pencils.jpg',
  'prod-4': '/images/epson_003_ink.jpg',
  'prod-5': '/images/sterling_record_book.jpg',
  'prod-6': '/images/deli_stapler.jpg',
  'prod-7': '/images/laminating_film_pouches.jpg',
  'prod-8': '/images/faber_castell_pencils.jpg',
  'prod-9': '/images/wire_binding_spines.jpg',
  'prod-10': '/images/post_it_notes.jpg',
  'prod-11': '/images/paper_cutter_trimmer.jpg',
  'prod-12': '/images/spiral_notebooks.jpg',
};

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    isCartOpen,
    setIsCartOpen,
    cart = [],
    updateQuantity,
    removeFromCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartFinalTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    navigateTo,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const safeCart = Array.isArray(cart) ? cart : [];

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError('Invalid coupon code. Try STUDENT15');
    } else {
      setPromoInput('');
    }
  };

  const handleStartCheckout = () => {
    if (!currentUser) {
      // Require login before checkout
      setIsCartOpen(false);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    onProceedToCheckout();
  };


  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-300 shadow-2xl flex flex-col justify-between animate-slide-in-right">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-[#FAF9F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              <h2 className="text-base font-light font-editorial uppercase tracking-[0.18em] text-black">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {safeCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-[1] mb-3" />
                <h3 className="font-editorial text-xl text-neutral-800">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mt-1 mb-6 font-light">
                  Browse our curated catalog for university and office supplies or explore our printing services.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('shop');
                    }}
                    className="w-full py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Explore Catalog
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('transactions');
                    }}
                    className="w-full py-2 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Transactions &amp; Track</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {safeCart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-[#FAF9F5] border border-neutral-200"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200">
                      <img
                        src={LOCAL_PRODUCT_IMAGES[item.id] || item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-medium text-black line-clamp-1 leading-snug">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          {item.sku}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-300 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:text-black hover:bg-neutral-100"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-medium text-black min-w-[1.75rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:text-black hover:bg-neutral-100"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-semibold text-black">
                            ₱{(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-neutral-400">
                              ₱{item.price.toLocaleString()} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Totals */}
          {safeCart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-[#FAF9F5] space-y-4">
              
              {/* Promo Code Input */}
              <div className="space-y-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-medium tracking-wide">
                        {appliedPromo.code} ({appliedPromo.discount})
                      </span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-[11px] text-neutral-500 hover:text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. STUDENT15)"
                      className="flex-1 text-xs px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600">{promoError}</p>
                )}
              </div>

              {/* Subtotal, Discount & Total Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-neutral-200 pt-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>₱{cartSubtotal.toLocaleString()}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Savings</span>
                    <span>-₱{cartDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>Fulfillment Fees</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-black pt-2 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span className="text-base">₱{cartFinalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleStartCheckout}
                className={`w-full py-3.5 text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 shadow-sm ${
                  currentUser 
                    ? 'bg-black hover:bg-neutral-800' 
                    : 'bg-neutral-700 hover:bg-neutral-900'
                }`}
              >
                {currentUser ? (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Checkout</span>
                  </>
                )}
              </button>

              {!currentUser && (
                <p className="text-[10px] text-center text-amber-700 font-medium">
                  You need to sign in or create an account before placing an order.
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/80">
                <span>Looking for checked out items?</span>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('transactions');
                  }}
                  className="text-black font-medium underline flex items-center gap-1 hover:text-neutral-700"
                >
                  <Receipt className="w-3 h-3" />
                  <span>Transactions &amp; Track →</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-neutral-400 font-light">
                Secure Checkout • In-Store Pickup or Doorstep Courier
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
