import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
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
  Receipt
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { orders, trackingOrderNumber, setTrackingOrderNumber } = useApp();
  const [searchInput, setSearchInput] = useState(trackingOrderNumber || '');
  const [activeOrder, setActiveOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  // Sync if trackingOrderNumber state changed from outside
  useEffect(() => {
    if (trackingOrderNumber) {
      setSearchInput(trackingOrderNumber);
      const match = orders.find(o => o.id.toLowerCase() === trackingOrderNumber.toLowerCase());
      if (match) {
        setActiveOrder(match);
        setSearched(true);
      }
    } else if (orders.length > 0 && !activeOrder) {
      // Default to most recent order if available
      setActiveOrder(orders[0]);
      setSearchInput(orders[0].id);
      setSearched(true);
    }
  }, [trackingOrderNumber, orders]);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
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
        <form onSubmit={handleSearch} className="mt-8 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order Reference (e.g. MM-2026-1038)"
              className="w-full text-xs pl-9 pr-4 py-3 bg-white border border-neutral-300 focus:outline-none focus:border-black uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
          >
            Track
          </button>
        </form>

        {/* Recent Orders Quick Access */}
        {orders.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <span className="text-neutral-400">Recent Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                onClick={() => loadOrder(o.id)}
                className={`px-2.5 py-1 font-mono transition-all border ${
                  activeOrder?.id === o.id
                    ? 'bg-neutral-900 text-white border-black'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                }`}
              >
                {o.id} ({o.fulfillment})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {activeOrder ? (
        <div className="bg-[#FAF9F5] border border-neutral-300 p-6 sm:p-10 space-y-8 animate-fade-in">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Order Number:</span>
                <span className="text-lg font-mono font-bold text-black">{activeOrder.id}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-light mt-1">
                <span>Placed on {new Date(activeOrder.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>Customer: {activeOrder.customer.name} ({activeOrder.customer.type})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-xs uppercase tracking-widest px-3 py-1 font-medium">
                {activeOrder.status}
              </span>
            </div>
          </div>

          {/* Dynamic Timeline Bar */}
          <div className="py-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400 mb-6">
              Fulfillment Progress Timeline
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {timelineData.steps.map((step, idx) => {
                const isPassed = idx <= timelineData.activeIdx;
                const isCurrent = idx === timelineData.activeIdx;

                return (
                  <div 
                    key={step.key} 
                    className={`p-4 border transition-all ${
                      isCurrent 
                        ? 'border-black bg-white shadow-sm ring-1 ring-black' 
                        : isPassed 
                        ? 'border-neutral-300 bg-white' 
                        : 'border-neutral-200 bg-neutral-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-neutral-400">
                        0{idx + 1}
                      </span>
                      {isPassed ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-black' : 'text-emerald-600'}`} />
                      ) : (
                        <Clock className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-black uppercase tracking-wider">
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-light mt-1">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Current Status Explanation Note */}
            <div className="mt-6 p-4 bg-white border border-neutral-200 text-xs text-neutral-700 flex items-start gap-3">
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
            <div className="bg-white p-5 border border-neutral-200 space-y-3">
              <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-black flex items-center gap-2">
                {activeOrder.fulfillment === 'pickup' ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                <span>{activeOrder.fulfillment === 'pickup' ? 'In-Store Pickup Details' : 'Delivery Address'}</span>
              </h4>

              <div className="text-xs space-y-2 text-neutral-600 font-light">
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
            <div className="bg-white p-5 border border-neutral-200 space-y-3">
              <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-black flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                <span>Purchased Items &amp; Charges</span>
              </h4>

              <div className="space-y-1.5 text-xs text-neutral-700">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="truncate max-w-[70%]">{it.quantity}x {it.name}</span>
                    <span className="font-mono font-medium text-black">₱{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
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

          {/* Status Notice */}
          <div className="text-[11px] text-neutral-500 text-center font-light border-t border-neutral-200 pt-4">
            Order tracking updates are reflected here in real time. For any concerns, please contact our store at the number listed in the footer.
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
