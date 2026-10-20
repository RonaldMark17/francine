import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { doesOrderBelongToUser } from '../utils/orderUtils';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Store, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Receipt,
  ExternalLink
} from 'lucide-react';

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

export default function OrderTrackingPage() {
  const { orders, currentUser, trackingOrderNumber, setTrackingOrderNumber, navigateTo } = useApp();
  const [searchInput, setSearchInput] = useState(trackingOrderNumber || '');
  const [activeOrder, setActiveOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  // Compute user's own orders
  const myOrders = useMemo(() => {
    if (!currentUser) return orders;
    return orders.filter(o => doesOrderBelongToUser(o, currentUser));
  }, [orders, currentUser]);

  // Sync if trackingOrderNumber state changed from outside
  useEffect(() => {
    if (trackingOrderNumber) {
      setSearchInput(trackingOrderNumber);
      // Allow tracking any order by direct ID search (even if not the user's own)
      const match = orders.find(o => o.id.toLowerCase() === trackingOrderNumber.toLowerCase());
      if (match) {
        setActiveOrder(match);
        setSearched(true);
      }
    } else if (myOrders.length > 0 && !activeOrder) {
      // Default to user's own most recent order
      setActiveOrder(myOrders[0]);
      setSearchInput(myOrders[0].id);
      setSearched(true);
    }
  }, [trackingOrderNumber, orders, myOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const query = searchInput.trim().toUpperCase();
    const match = orders.find(o => o.id.toUpperCase() === query);
    setActiveOrder(match || null);
  };

  const loadOrder = (id) => {
    setSearchInput(id);
    const match = orders.find(o => o.id.toUpperCase() === id.toUpperCase());
    setActiveOrder(match || null);
    setSearched(true);
  };

  // Status step progression definition
  const getTimelineSteps = (order) => {
    const isPickup = order?.fulfillment === 'pickup';
    const currentStatus = order?.status;

    const baseSteps = isPickup 
      ? [
          { key: 'Order Placed', label: 'Order Placed', desc: 'Received in store system' },
          { key: 'Processing', label: 'Processing', desc: 'Being packed at Counter 2' },
          { key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Awaiting customer collection' },
          { key: 'Completed', label: 'Completed', desc: 'Picked up by customer' }
        ]
      : [
          { key: 'Order Placed', label: 'Order Placed', desc: 'Received in store system' },
          { key: 'Processing', label: 'Processing', desc: 'Packed and boxed' },
          { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'With local courier rider' },
          { key: 'Completed', label: 'Completed', desc: 'Successfully delivered' }
        ];

    // Determine current index
    let activeIdx = 0;
    if (currentStatus === 'Processing') activeIdx = 1;
    else if (currentStatus === 'Ready for Pickup' || currentStatus === 'Out for Delivery') activeIdx = 2;
    else if (currentStatus === 'Completed') activeIdx = 3;

    return { steps: baseSteps, activeIdx };
  };

  const timelineData = activeOrder ? getTimelineSteps(activeOrder) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-8 text-center max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
          Omnichannel Fulfillment
        </span>
        <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide mt-1 uppercase">
          Order Tracking Portal
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2">
          Track the real-time fulfillment status of your in-store pickup or local delivery order.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Order reference number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order Reference (e.g. MM-2026-1038)"
              className="w-full text-xs pl-9 pr-3 py-3 rounded-lg bg-white border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 focus:border-black uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-lg bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
          >
            Track
          </button>
        </form>

        {/* Recent Orders Quick Access & Transactions Shortcut */}
        {orders.length > 0 && (
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px]">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-neutral-400">Quick Track:</span>
              {myOrders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  onClick={() => loadOrder(o.id)}
                  className={`px-2.5 py-1 font-mono transition-all border ${
                    activeOrder?.id === o.id
                      ? 'bg-neutral-900 text-white border-black'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                  }`}
                >
                  {o.id}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline text-neutral-300">•</span>

            <button
              onClick={() => navigateTo('transactions')}
              className="text-black font-semibold uppercase tracking-wider underline flex items-center gap-1 hover:text-neutral-600"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>All Checked Out Transactions →</span>
            </button>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {activeOrder ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-8 space-y-6 shadow-sm animate-fade-in">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Order Number:</span>
                <span className="text-lg font-mono font-bold text-black">{activeOrder.id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-2 leading-relaxed">
                <span>Placed on {new Date(activeOrder.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>Customer: {activeOrder.customer.name} ({activeOrder.customer.type})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs tracking-wide px-3 py-1.5 font-medium">
                {activeOrder.status}
              </span>
            </div>
          </div>

          {/* Dynamic Timeline Bar */}
          <div className="py-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-6">
              Fulfillment Progress Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
              {timelineData.steps.map((step, idx) => {
                const isPassed = idx <= timelineData.activeIdx;
                const isCurrent = idx === timelineData.activeIdx;

                return (
                  <div 
                    key={step.key} 
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`p-4 rounded-xl border relative ${
                      isCurrent 
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : isPassed 
                        ? 'border-neutral-200 bg-white'
                        : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-neutral-400">
                        0{idx + 1}
                      </span>
                      {isPassed ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-black animate-pop-in' : 'text-emerald-600'}`} />
                      ) : (
                        <Clock className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-black uppercase tracking-wider flex items-center gap-1.5">
                      <span>{step.label}</span>
                      {isCurrent && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Current Status Explanation Note */}
            <div className="mt-5 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-sm leading-relaxed text-neutral-700 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-black">Latest Update: </span>
                <span>{activeOrder.statusNotes || 'Your order is progressing smoothly.'}</span>
              </div>
            </div>
          </div>

          {/* Details Grid: Fulfillment + Receipt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200">
            
            {/* Fulfillment & Contact info */}
            <div className="min-w-0 bg-white rounded-xl p-5 border border-neutral-200 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-black flex items-center gap-2">
                {activeOrder.fulfillment === 'pickup' ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                <span>{activeOrder.fulfillment === 'pickup' ? 'In-Store Pickup Details' : 'Delivery Address'}</span>
              </h4>

              <div className="text-sm leading-relaxed space-y-3 text-neutral-600 break-words">
                {activeOrder.fulfillment === 'pickup' ? (
                  <>
                    <p><strong className="text-black font-medium">Pickup Branch:</strong> {activeOrder.pickupLocation || 'Mama Mo Ink Main Store (Purok 5, Banago, Nagcarlan, Laguna)'}</p>
                    <p><strong className="text-black font-medium">Designated Window:</strong> {activeOrder.pickupTimeSlot || 'Standard Business Hours (7:00 AM - 7:00 PM)'}</p>
                    <p><strong className="text-black font-medium">Counter Instructions:</strong> Proceed to Ground Floor Cashier / Express Counter and present Order ID <code className="font-mono bg-neutral-100 px-1">{activeOrder.id}</code>.</p>
                  </>
                ) : (
                  <>
                    <p><strong className="text-black font-medium">Delivery Address:</strong> {activeOrder.deliveryAddress}</p>
                    {activeOrder.deliveryNotes && (
                      <p><strong className="text-black font-medium">Rider Notes:</strong> {activeOrder.deliveryNotes}</p>
                    )}
                    <p><strong className="text-black font-medium">Courier Fee:</strong> ₱{activeOrder.deliveryFee ?? 30} (Banago &amp; Nearby Laguna Barangays Delivery)</p>
                  </>
                )}
                <p><strong className="text-black font-medium">Customer Phone:</strong> {activeOrder.customer.phone}</p>
                <p><strong className="text-black font-medium">Payment Channel:</strong> {activeOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Itemized Order Receipt */}
            <div className="min-w-0 bg-white rounded-xl p-5 border border-neutral-200 space-y-4">
              <div className="flex flex-wrap gap-3 items-center justify-between border-b border-neutral-200 pb-3">
                <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-black flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  <span>Checked Out Items ({activeOrder.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 0})</span>
                </h4>
                <button
                  onClick={() => navigateTo('transactions')}
                  className="text-[10px] uppercase font-mono tracking-wider text-black underline flex items-center gap-1"
                >
                  <span>All Transactions</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {activeOrder.items.map((it, idx) => {
                  const itImg = LOCAL_PRODUCT_IMAGES[it.id] || it.image || '/images/paper_one_ream.jpg';
                  const itQty = it.quantity || 1;
                  return (
                    <div key={idx} className="flex items-center justify-between py-1.5 border-b border-neutral-100 gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-10 bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden">
                          <img 
                            src={itImg} 
                            alt={it.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/paper_one_ream.jpg'; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-black truncate block">{it.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">Qty: {itQty} × ₱{it.price?.toLocaleString()}</span>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-xs text-black shrink-0">₱{(it.price * itQty).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-xs space-y-1 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>₱{activeOrder.subtotal?.toLocaleString()}</span>
                </div>
                {activeOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount Deducted</span>
                    <span>-₱{activeOrder.discountAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Fulfillment Fee</span>
                  <span>₱{activeOrder.deliveryFee || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-neutral-300">
                  <span>Total Amount</span>
                  <span>₱{activeOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="border-t border-neutral-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 font-light text-[11px]">
              Order tracking updates are synchronized in real time with our Banago, Nagcarlan store.
            </span>
            <button
              onClick={() => navigateTo('transactions')}
              className="px-4 py-2 border border-neutral-300 hover:border-black bg-white uppercase tracking-wider text-[11px] font-medium transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Browse All Transactions</span>
            </button>
          </div>

        </div>
      ) : searched ? (
        <div className="p-12 text-center bg-[#FAF9F5] border border-neutral-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="font-editorial text-xl text-black">Order Not Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">
            We could not locate an order matching "{searchInput}". Please verify your order number and try again.
          </p>
        </div>
      ) : null}

    </div>
  );
}
