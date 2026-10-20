import ModalOverlay from './ModalOverlay';
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  Store, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Receipt,
  Tag
} from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose }) {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartFinalTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    placeOrder,
    navigateTo,
    storeInfo,
    currentUser
  } = useApp();

  // Steps: 'form' | 'confirmation'
  const [step, setStep] = useState('form');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [checkoutPromoInput, setCheckoutPromoInput] = useState('');
  const [checkoutPromoError, setCheckoutPromoError] = useState('');

  useBodyScrollLock(isOpen);

  // Derive customer type from role
  const getCustomerType = (role) => {
    switch (role) {
      case 'admin': return 'School Admin / Staff';
      case 'buyer': 
      default: return 'Buyer';
    }
  };

  // Form states - auto-filled from logged-in user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    customerType: 'Buyer',
    fulfillment: 'pickup',
    pickupSlot: 'Today, 3:00 PM – 5:00 PM',
    deliveryAddress: '',
    deliveryLandmark: '',
    deliveryNotes: '',
    paymentMethod: 'Cash on Pickup / COD',
    gcashRef: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Reset and populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setCreatedOrder(null);
      setFormErrors({});
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        customerType: currentUser ? getCustomerType(currentUser.role) : 'Buyer',
        fulfillment: 'pickup',
        pickupSlot: 'Today, 3:00 PM – 5:00 PM',
        deliveryAddress: currentUser?.savedAddress || '',
        deliveryLandmark: '',
        deliveryNotes: '',
        paymentMethod: 'Cash on Pickup / COD',
        gcashRef: '',
        notes: ''
      });
    }
  }, [isOpen, currentUser]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const deliveryFee = formData.fulfillment === 'delivery' ? 60 : 0;
  const orderTotal = cartFinalTotal + deliveryFee;

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Contact number is required';
    if (formData.fulfillment === 'delivery' && !formData.deliveryAddress.trim()) {
      errors.deliveryAddress = 'Delivery address is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderPayload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: formData.customerType
      },
      fulfillment: formData.fulfillment,
      pickupLocation: formData.fulfillment === 'pickup' 
        ? `${storeInfo.name} (Express Counter 2)` 
        : null,
      pickupTimeSlot: formData.fulfillment === 'pickup' ? formData.pickupSlot : null,
      deliveryAddress: formData.fulfillment === 'delivery' 
        ? `${formData.deliveryAddress} (Landmark: ${formData.deliveryLandmark})` 
        : null,
      deliveryNotes: formData.deliveryNotes,
      paymentMethod: formData.paymentMethod === 'GCash' 
        ? `GCash (Ref # ${formData.gcashRef})`
        : formData.paymentMethod,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku
      })),
      subtotal: cartSubtotal,
      discountAmount: cartDiscount,
      appliedPromoCode: appliedPromo ? appliedPromo.code : null,
      deliveryFee,
      total: orderTotal,
      notes: formData.notes
    };

    const newOrder = placeOrder(orderPayload);
    setCreatedOrder(newOrder);
    setStep('confirmation');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleTrackNewOrder = () => {
    if (createdOrder) {
      onClose();
      navigateTo('tracking', { trackingId: createdOrder.id });
    }
  };

  const handleViewTransactions = () => {
    onClose();
    navigateTo('transactions');
  };

  return (
    <ModalOverlay
      onClick={onClose}
    >
      <div 
        className="relative bg-white max-w-3xl w-full border border-neutral-300 shadow-2xl overflow-hidden my-auto animate-modal-pop max-h-[85dvh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#FAF9F5] border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-light font-editorial uppercase tracking-[0.2em] text-black">
              {step === 'form' ? 'Checkout' : 'Order Confirmation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-8">
            
            {/* Order Info Banner */}
            <div className="bg-neutral-100 border-l-2 border-black p-3.5 text-xs text-neutral-600 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-black">Secure Checkout:</span> Please review your order details before submitting. 
                Delivery rates and pickup schedules are subject to availability.
              </div>
            </div>

            {/* Section 1: Customer Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold flex items-center gap-2">
                <span>01</span>
                <span className="text-black">Customer Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full text-xs px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-neutral-300'} focus:outline-none focus:border-black`}
                    placeholder="e.g. Juan Dela Cruz"
                  />
                  {formErrors.name && <p className="text-[10px] text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full text-xs px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-neutral-300'} focus:outline-none focus:border-black`}
                    placeholder="e.g. 0917-000-0000"
                  />
                  {formErrors.phone && <p className="text-[10px] text-red-500 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Email Address (For e-receipt)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    placeholder="e.g. student@university.edu.ph"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Customer Affiliation
                  </label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black bg-white"
                  >
                    <option value="Buyer">Buyer (Student / Teacher / Customer)</option>
                    <option value="Student">Student</option>
                    <option value="Teacher / Faculty">Teacher / Professor / Faculty</option>
                    <option value="School Admin / Staff">School Admin / Staff</option>
                    <option value="General Customer">General Customer / Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Fulfillment Method */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold flex items-center gap-2">
                <span>02</span>
                <span className="text-black">Fulfillment Preference</span>
              </h3>

              {/* Fulfillment Toggle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* In-Store Pickup Option */}
                <div
                  onClick={() => setFormData({ ...formData, fulfillment: 'pickup' })}
                  className={`p-4 border cursor-pointer transition-all ${
                    formData.fulfillment === 'pickup'
                      ? 'border-black bg-[#FAF9F5] shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-black" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-black">
                        In-Store Pickup
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-medium">
                      FREE (₱0)
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
                    Collect at our physical counter. Packed ready in 15-30 minutes.
                  </p>
                  <div className="mt-2 text-[10px] text-neutral-400">
                    Location: Purok 5, Banago, Nagcarlan Main Branch
                  </div>
                </div>

                {/* Local Courier Delivery Option */}
                <div
                  onClick={() => setFormData({ ...formData, fulfillment: 'delivery' })}
                  className={`p-4 border cursor-pointer transition-all ${
                    formData.fulfillment === 'delivery'
                      ? 'border-black bg-[#FAF9F5] shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-black" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-black">
                        Local Delivery
                      </span>
                    </div>
                    <span className="text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 font-medium">
                      +₱60 Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
                    Delivered directly to dorm, campus gate, or home via local rider.
                  </p>
                  <div className="mt-2 text-[10px] text-neutral-400">
                    Banago, Nagcarlan &amp; Nearby Laguna Barangays
                  </div>
                </div>

              </div>

              {/* Conditional Fulfillment Inputs */}
              {formData.fulfillment === 'pickup' ? (
                <div className="bg-[#FAF9F5] p-4 border border-neutral-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-black">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Selected Pickup Slot</span>
                  </div>
                  <select
                    value={formData.pickupSlot}
                    onChange={(e) => setFormData({ ...formData, pickupSlot: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                  >
                    <option value="Today, 1:00 PM – 3:00 PM">Today, 1:00 PM – 3:00 PM</option>
                    <option value="Today, 3:00 PM – 5:00 PM">Today, 3:00 PM – 5:00 PM (Quick Rush)</option>
                    <option value="Today, 5:00 PM – 7:30 PM">Today, 5:00 PM – 7:30 PM (Evening Campus Dismissal)</option>
                    <option value="Tomorrow, 8:00 AM – 11:00 AM">Tomorrow, 8:00 AM – 11:00 AM (Morning Class Prep)</option>
                  </select>
                  <p className="text-[11px] text-neutral-500 font-light">
                    Pickup instructions: Proceed to Counter 2 (Online Express Pickup) and show your Order ID.
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF9F5] p-4 border border-neutral-200 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                      placeholder="Street, Building/Dorm Name, Room/Unit #, Barangay"
                    />
                    {formErrors.deliveryAddress && (
                      <p className="text-[10px] text-red-500 mt-1">{formErrors.deliveryAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Nearest Campus Landmark
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryLandmark}
                        onChange={(e) => setFormData({ ...formData, deliveryLandmark: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                        placeholder="e.g. Across University Gate 2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Special Instructions for Rider
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryNotes}
                        onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                        placeholder="e.g. Leave with dorm guard"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Payment Method Simulation */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold flex items-center gap-2">
                <span>03</span>
                <span className="text-black">Payment Method</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Cash on Pickup / COD', label: formData.fulfillment === 'pickup' ? 'Cash on Pickup' : 'Cash on Delivery' },
                  { id: 'GCash', label: 'GCash (E-Wallet)' },
                  { id: 'Maya / Bank Transfer', label: 'Maya / Bank Transfer' }
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                    className={`p-3 border text-center cursor-pointer transition-all text-xs font-medium ${
                      formData.paymentMethod === pm.id
                        ? 'border-black bg-[#FAF9F5] text-black font-semibold'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {pm.label}
                  </div>
                ))}
              </div>

              {formData.paymentMethod === 'GCash' && (
                  <div className="bg-[#FAF9F5] p-3 border border-neutral-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">GCash Merchant:</span>
                    <span className="font-mono font-medium text-black">MAMA MO SUPPLIES (0917-882-6262)</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">
                      GCash Reference No.
                    </label>
                    <input
                      type="text"
                      value={formData.gcashRef}
                      onChange={(e) => setFormData({ ...formData, gcashRef: e.target.value })}
                      className="w-full text-xs px-3 py-1.5 border border-neutral-300 bg-white font-mono"
                      placeholder="e.g. 9081234912"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Final Review & Total */}
            <div className="p-4 bg-[#FAF9F5] border border-neutral-200 space-y-2 text-xs">
              <h4 className="font-medium text-black uppercase tracking-wider text-[11px]">
                Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
              </h4>
              
              <div className="space-y-1 py-2 max-h-32 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-neutral-600 text-[11px]">
                    <span className="truncate max-w-[70%]">{item.quantity}x {item.name}</span>
                    <span className="font-mono">₱{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code Entry at Checkout */}
              <div className="border-t border-neutral-200 pt-2.5 pb-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2 text-xs rounded-lg">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Tag className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-semibold tracking-wide">
                        {appliedPromo.code} ({appliedPromo.discount || `${appliedPromo.discountValue || 15}% OFF`})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[11px] text-neutral-500 hover:text-red-600 underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={checkoutPromoInput}
                        onChange={(e) => {
                          setCheckoutPromoInput(e.target.value);
                          setCheckoutPromoError('');
                        }}
                        placeholder="Promo code (e.g. STUDENT15)"
                        className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-neutral-300 focus:outline-none focus:border-black uppercase rounded-lg font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!checkoutPromoInput.trim()) return;
                          const res = applyPromoCode(checkoutPromoInput);
                          if (!res.success) {
                            setCheckoutPromoError(res.message || 'Invalid coupon code.');
                          } else {
                            setCheckoutPromoInput('');
                            setCheckoutPromoError('');
                          }
                        }}
                        className="px-3.5 py-1.5 bg-black text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-neutral-800 rounded-lg transition-colors shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {checkoutPromoError && (
                      <p className="text-[11px] text-rose-600 font-medium">{checkoutPromoError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-2 space-y-1">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>₱{cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount Savings ({appliedPromo?.code})</span>
                    <span>-₱{cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Fulfillment Fee ({formData.fulfillment === 'pickup' ? 'In-Store Pickup' : 'Local Delivery'})</span>
                  <span>₱{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-black pt-1 border-t border-neutral-300">
                  <span>Grand Total</span>
                  <span className="text-lg">₱{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-neutral-400 mt-2 font-light">
                Your order will be registered and available for tracking immediately.
              </p>
            </div>

          </form>
        ) : (
          /* Order Confirmation View */
          <div className="p-6 sm:p-10 space-y-8 animate-fade-in text-center">
            
            <div className="inline-flex p-3 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-full mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
                Order Received Successfully
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-black">
                Thank You, {createdOrder?.customer.name}!
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
                Your order has been placed successfully. You can track its fulfillment status in real time.
              </p>
            </div>

            {/* Order Highlight Card */}
            <div className="bg-[#FAF9F5] border border-neutral-300 p-6 text-left max-w-lg mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400">Order Reference</span>
                  <div className="text-lg font-mono font-bold text-black tracking-wide">
                    {createdOrder?.id}
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase tracking-wider px-2.5 py-1 font-medium">
                  {createdOrder?.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-light">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Fulfillment Method</span>
                  <span className="font-medium text-black">
                    {createdOrder?.fulfillment === 'pickup' ? 'In-Store Pickup' : 'Courier Delivery'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Payment</span>
                  <span className="font-medium text-black">{createdOrder?.paymentMethod}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-400 block text-[10px] uppercase">
                    {createdOrder?.fulfillment === 'pickup' ? 'Pickup Details' : 'Delivery Address'}
                  </span>
                  <span className="text-neutral-700">
                    {createdOrder?.fulfillment === 'pickup' 
                      ? `${createdOrder?.pickupLocation} • Slot: ${createdOrder?.pickupTimeSlot}`
                      : createdOrder?.deliveryAddress}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="border-t border-neutral-200 pt-3">
                <span className="text-[10px] uppercase text-neutral-400 tracking-wider">Ordered Items</span>
                <ul className="mt-1 space-y-1 text-xs text-neutral-700">
                  {createdOrder?.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-mono">₱{(it.price * it.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-neutral-200 mt-2 pt-2 flex justify-between font-semibold text-sm text-black">
                  <span>Total Amount Paid / Due</span>
                  <span>₱{createdOrder?.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
              <button
                onClick={handleTrackNewOrder}
                className="w-full sm:w-auto flex-1 py-3 px-5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Track This Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleViewTransactions}
                className="w-full sm:w-auto px-4 py-3 bg-white border border-neutral-300 text-neutral-800 hover:border-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <Receipt className="w-4 h-4" />
                <span>My Transactions</span>
              </button>

              <button
                onClick={handlePrintOrder}
                className="w-full sm:w-auto px-3.5 py-3 border border-neutral-300 text-neutral-600 hover:text-black hover:border-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                title="Print order slip"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </ModalOverlay>
  );
}
