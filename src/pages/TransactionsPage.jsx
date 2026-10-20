import { CoreSectionSlot } from '../components/builder/CoreSectionSlot';
import { useCoreContent } from '../components/builder/CoreContentContext';
import React, { useState, useMemo } from 'react';
import { doesOrderBelongToUser } from '../utils/orderUtils';
import { useApp } from '../context/AppContext';
import { 
  Receipt, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Store, 
  Search, 
  ArrowRight, 
  Printer, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShoppingBag,
  MapPin,
  Calendar,
  CreditCard,
  Tag,
  ShieldCheck,
  Filter,
  Check
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

export default function TransactionsPage() {
  const coreContent = useCoreContent();
  const { 
    orders = [], 
    currentUser, 
    navigateTo, 
    addToCart, 
    setIsCartOpen,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [adminViewAll, setAdminViewAll] = useState(false);
  const [expandedTrackerOrderId, setExpandedTrackerOrderId] = useState(null);
  const [printingOrderId, setPrintingOrderId] = useState(null);

  // Status progression helper for in-line tracking
  const getTimelineSteps = (order) => {
    const isPickup = order?.fulfillment === 'pickup';
    const currentStatus = order?.status;

    const baseSteps = isPickup 
      ? [
          { key: 'Order Placed', label: 'Order Placed', desc: 'Received at Banago store system' },
          { key: 'Processing', label: order?.items?.some(item => item.sku === 'PRINT-SERVICE') ? 'Printing' : 'Processing', desc: order?.items?.some(item => item.sku === 'PRINT-SERVICE') ? 'Print request in production' : 'Items packed at Counter 2' },
          { key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Awaiting customer collection' },
          { key: 'Completed', label: 'Completed', desc: 'Collected & signed for' }
        ]
      : [
          { key: 'Order Placed', label: 'Order Placed', desc: 'Received at Banago store system' },
          { key: 'Processing', label: 'Processing', desc: 'Packed & packaged for courier' },
          { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'In transit with local rider' },
          { key: 'Completed', label: 'Completed', desc: 'Delivered to address' }
        ];

    let activeIdx = 0;
    if (currentStatus === 'Processing') activeIdx = 1;
    else if (currentStatus === 'Ready for Pickup' || currentStatus === 'Out for Delivery') activeIdx = 2;
    else if (currentStatus === 'Completed') activeIdx = 3;

    return { steps: baseSteps, activeIdx };
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      case 'Processing':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Ready for Pickup':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Out for Delivery':
        return 'bg-sky-50 text-sky-900 border-sky-300';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  // Compute user's own orders
  const myOrders = useMemo(() => {
    if (!currentUser) return orders;
    return orders.filter(o => doesOrderBelongToUser(o, currentUser));
  }, [orders, currentUser]);

  // Base orders: for non-admin, always myOrders. For admin, toggle between myOrders and all.
  const baseOrders = useMemo(() => {
    if (!currentUser) return orders;
    if (currentUser.role === 'admin' && adminViewAll) return orders;
    return myOrders;
  }, [orders, myOrders, currentUser, adminViewAll]);

  // Filtered transactions
  const filteredOrders = useMemo(() => {
    return baseOrders.filter(order => {
      // Status filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active') {
          if (order.status === 'Completed' || order.status === 'Cancelled') return false;
        } else if (order.status !== statusFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesId = order.id?.toLowerCase().includes(query);
        const matchesCust = (order.customer?.name || order.name || '').toLowerCase().includes(query);
        const matchesPhone = (order.customer?.phone || order.phone || '').toLowerCase().includes(query);
        const matchesItem = (order.items || []).some(item => 
          item.name?.toLowerCase().includes(query) || item.sku?.toLowerCase().includes(query)
        );
        if (!matchesId && !matchesCust && !matchesPhone && !matchesItem) return false;
      }

      return true;
    });
  }, [baseOrders, statusFilter, searchQuery]);

  // Calculations based on filtered base orders (user's own orders)
  const stats = useMemo(() => {
    const totalTransactions = baseOrders.length;
    const activeCount = baseOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
    const completedCount = baseOrders.filter(o => o.status === 'Completed').length;
    const totalSpent = baseOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return { totalTransactions, activeCount, completedCount, totalSpent };
  }, [baseOrders]);

  // Action handlers
  const handleTrackOrder = (orderId) => {
    navigateTo('tracking', { trackingId: orderId });
  };

  const toggleInlineTracker = (orderId) => {
    setExpandedTrackerOrderId(prev => prev === orderId ? null : orderId);
  };

  const handleReorderItems = (order) => {
    if (!order.items || order.items.length === 0) return;
    if (order.items.some(item => item.sku === 'PRINT-SERVICE')) {
      navigateTo('services');
      return;
    }
    order.items.forEach(it => {
      addToCart({
        id: it.id,
        name: it.name,
        price: it.price,
        stock: 50,
        sku: it.sku || 'SKU-REORDER',
        image: LOCAL_PRODUCT_IMAGES[it.id] || '/images/paper_one_ream.jpg'
      }, it.quantity || 1);
    });
    setIsCartOpen(true);
    if (showToast) {
      showToast(`Added ${order.items.length} items from ${order.id} to your bag!`, 'success');
    }
  };

  const handlePrintSlip = (order) => {
    setPrintingOrderId(order.id);
    setTimeout(() => {
      window.print();
      setPrintingOrderId(null);
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      <CoreSectionSlot placement="before:0" />
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 mb-2">
              <Receipt className="w-3.5 h-3.5 text-neutral-600" />
              <span>{coreContent.text("content-1", "Purchase History & Fulfillment")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide uppercase">{coreContent.text("content-2", "Transactions & Checked Out Items")}</h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1.5 max-w-2xl leading-relaxed">{coreContent.text("content-3", "Detailed record of all checked-out orders, items breakdown, payment receipts, and real-time fulfillment tracking.")}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('tracking')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 hover:border-black text-xs uppercase tracking-widest font-medium transition-all shadow-xs"
            >
              <Truck className="w-4 h-4 text-neutral-600" />
              <span>{coreContent.text("content-4", "Track Order Portal")}</span>
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-widest font-medium transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>{coreContent.text("content-5", "Continue Shopping")}</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 animate-fade-up delay-75">
          <div className="p-4 bg-white border border-neutral-200/90 rounded-none shadow-xs space-y-1 hover-lift card-interactive group">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">{coreContent.text("content-6", "Total Transactions")}</span>
            <div className="text-2xl font-editorial font-bold text-black group-hover:scale-105 origin-left transition-transform duration-300">{stats.totalTransactions}</div>
            <div className="text-[10px] text-neutral-500 font-light">{coreContent.text("content-7", "Registered in system")}</div>
          </div>

          <div className="p-4 bg-white border border-neutral-200/90 rounded-none shadow-xs space-y-1 hover-lift card-interactive group">
            <span className="text-[10px] uppercase tracking-wider text-amber-600 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 group-hover:rotate-45 transition-transform duration-300" />{coreContent.text("content-8", "Active Fulfillment")}</span>
            <div className="text-2xl font-editorial font-bold text-amber-900 group-hover:scale-105 origin-left transition-transform duration-300">{stats.activeCount}</div>
            <div className="text-[10px] text-neutral-500 font-light">{coreContent.text("content-9", "Processing or out for delivery")}</div>
          </div>

          <div className="p-4 bg-white border border-neutral-200/90 rounded-none shadow-xs space-y-1 hover-lift card-interactive group">
            <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 group-hover:scale-110 transition-transform duration-300 text-emerald-600" />{coreContent.text("content-10", "Completed Orders")}</span>
            <div className="text-2xl font-editorial font-bold text-emerald-900 group-hover:scale-105 origin-left transition-transform duration-300">{stats.completedCount}</div>
            <div className="text-[10px] text-neutral-500 font-light">{coreContent.text("content-11", "Successfully collected / delivered")}</div>
          </div>

          <div className="p-4 bg-white border border-neutral-200/90 rounded-none shadow-xs space-y-1 hover-lift card-interactive group">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">{coreContent.text("content-12", "Total Value")}</span>
            <div className="text-2xl font-editorial font-bold text-black group-hover:scale-105 origin-left transition-transform duration-300">{coreContent.text("content-13", "₱")}{stats.totalSpent.toLocaleString()}</div>
            <div className="text-[10px] text-neutral-500 font-light">{coreContent.text("content-14", "Total checkout revenue")}</div>
          </div>
        </div>
      </div>

      <CoreSectionSlot placement="before:1" />
      {/* Filter & Search Bar */}
      <div className="bg-white border border-neutral-200 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {[
            { id: 'All', label: 'All Transactions' },
            { id: 'Active', label: 'Active In-Progress' },
            { id: 'Order Placed', label: 'Placed' },
            { id: 'Processing', label: 'Processing' },
            { id: 'Ready for Pickup', label: 'Pickup Ready' },
            { id: 'Out for Delivery', label: 'Out for Delivery' },
            { id: 'Completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 whitespace-nowrap uppercase tracking-wider text-[11px] font-medium transition-all border ${
                statusFilter === tab.id
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right side: Search */}
        <div className="flex items-center gap-3">

          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={coreContent("content-15", "Search reference, item name, buyer...")}
              className="w-full text-xs pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

      </div>

      <CoreSectionSlot placement="before:2" />
      {/* Transactions List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#FAF9F5] border border-neutral-300 p-12 text-center space-y-4">
          <Receipt className="w-12 h-12 text-neutral-300 mx-auto stroke-[1]" />
          <h3 className="font-editorial text-2xl text-black">{coreContent.text("content-16", "No Transactions Found")}</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
            {searchQuery || statusFilter !== 'All' 
              ? 'No transactions matched your search or filter settings. Try clearing the filters.' 
              : 'You have not checked out any items yet. Browse our inventory to place your first order!'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {(searchQuery || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                }}
                className="px-5 py-2.5 border border-neutral-300 bg-white text-xs uppercase tracking-widest font-medium hover:border-black transition-colors"
              >{coreContent.text("content-17", "Clear Filters")}</button>
            )}
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
            >{coreContent.text("content-18", "Browse Catalog")}</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const customerName = order.customer?.name || order.name || 'Walk-in Buyer';
            const customerPhone = order.customer?.phone || order.phone || '';
            const customerEmail = order.customer?.email || order.email || '';
            const isPickup = order.fulfillment === 'pickup';
            const items = order.items || [];
            const isTrackerExpanded = expandedTrackerOrderId === order.id;
            const timeline = getTimelineSteps(order);
            const formattedDate = new Date(order.date || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={order.id} 
                className="bg-white border border-neutral-300 shadow-xs hover:border-black transition-all overflow-hidden hover-lift card-interactive"
              >
                {/* Transaction Header Bar */}
                <div className="bg-[#FAF9F5] border-b border-neutral-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">{coreContent.text("content-19", "Order ID:")}</span>
                      <span className="font-mono font-bold text-sm sm:text-base text-black px-2 py-0.5 bg-white border border-neutral-300 shadow-2xs">
                        {order.id}
                      </span>
                    </div>

                    <span className="hidden sm:inline text-neutral-300">{coreContent.text("content-20", "•")}</span>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-light">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formattedDate}</span>
                    </div>

                    <span className="hidden sm:inline text-neutral-300">{coreContent.text("content-21", "•")}</span>

                    {/* Fulfillment Mode */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {isPickup ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium">
                          <Store className="w-3 h-3" />{coreContent.text("content-22", "In-Store Pickup (Banago Counter 2)")}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-sky-50 text-sky-900 border border-sky-200 text-[11px] font-medium">
                          <Truck className="w-3 h-3" />{coreContent.text("content-23", "Local Courier Delivery")}</span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge + Track Button */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>

                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-widest font-medium transition-all shadow-xs"
                      title={coreContent("content-24", "View real-time delivery status")}
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-300" />
                      <span>{coreContent.text("content-25", "Track Order")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Body: Items Breakdown & Details */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (2 spans): Checked Out Items Table */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="text-xs uppercase tracking-[0.18em] font-semibold text-black">{coreContent.text("content-26", "Checked Out Items (")}{items.reduce((s, it) => s + (it.quantity || 1), 0)}{coreContent.text("content-27", ")")}</span>
                      <span className="text-[11px] text-neutral-400 font-mono">{coreContent.text("content-28", "Verified Inventory")}</span>
                    </div>

                    <div className="space-y-3">
                      {items.map((item, idx) => {
                        const itemImg = LOCAL_PRODUCT_IMAGES[item.id] || item.image || '/images/paper_one_ream.jpg';
                        const itemQty = item.quantity || 1;
                        const lineTotal = item.price * itemQty;

                        return (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-3 bg-[#FAF9F5] border border-neutral-200 gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-14 h-16 bg-white border border-neutral-200 shrink-0 overflow-hidden">
                                <img 
                                  src={itemImg} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/images/paper_one_ream.jpg';
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-black truncate max-w-xs sm:max-w-md">
                                  {item.name}
                                </h4>
                                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                                  {item.sku || 'SKU-INVENTORY'}{coreContent.text("content-29", " • ₱")}{item.price?.toLocaleString()}{coreContent.text("content-30", " each")}</div>
                                <div className="text-[11px] text-neutral-700 font-medium mt-1">{coreContent.text("content-31", "Qty: ")}<span className="font-mono font-bold text-black">{itemQty}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="font-mono font-bold text-sm text-black">{coreContent.text("content-32", "₱")}{lineTotal.toLocaleString()}
                              </div>
                              <span className="text-[10px] text-neutral-400">{coreContent.text("content-33", "Total")}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {order.notes && <p className="text-xs text-neutral-600 whitespace-pre-wrap">{order.notes}</p>}
                    {/* In-Line Live Tracking Toggle */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleInlineTracker(order.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-black font-medium underline underline-offset-4 transition-colors"
                      >
                        {isTrackerExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>{coreContent.text("content-34", "Hide Live Tracking Timeline")}</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>{coreContent.text("content-35", "View Live Order Fulfillment Status & Timeline")}</span>
                          </>
                        )}
                      </button>

                      {/* Expandable Tracking Timeline */}
                      {isTrackerExpanded && (
                        <div className="mt-4 p-5 bg-[#FAF9F5] border border-neutral-300 space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-black flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-neutral-600" />{coreContent.text("content-36", "Fulfillment Timeline • ")}{order.id}
                            </span>
                            <button
                              onClick={() => handleTrackOrder(order.id)}
                              className="text-[10px] uppercase font-mono tracking-wider text-black underline flex items-center gap-1"
                            >
                              <span>{coreContent.text("content-37", "Open Full Tracker")}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Steps progress */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                            {timeline.steps.map((st, sidx) => {
                              const isStepDone = sidx <= timeline.activeIdx;
                              const isCurrent = sidx === timeline.activeIdx;

                              return (
                                <div key={st.key} className="space-y-1.5 text-left">
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      isStepDone 
                                        ? 'bg-black text-white' 
                                        : 'bg-neutral-200 text-neutral-500'
                                    }`}>
                                      {isStepDone ? '✓' : sidx + 1}
                                    </div>
                                    <span className={`text-[11px] font-medium leading-tight ${
                                      isCurrent ? 'text-black font-bold' : isStepDone ? 'text-neutral-700' : 'text-neutral-400'
                                    }`}>
                                      {st.label}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-neutral-500 pl-6 leading-tight">
                                    {st.desc}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {order.statusNotes && (
                            <div className="p-2.5 bg-white border border-neutral-200 text-xs text-neutral-700 mt-2">
                              <span className="font-semibold text-black text-[11px]">{coreContent.text("content-38", "Latest Dispatch Note: ")}</span>
                              {order.statusNotes}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Order Summary, Destination & Quick Actions */}
                  <div className="bg-[#FAF9F5] border border-neutral-200 p-5 space-y-5 flex flex-col justify-between">
                    
                    {/* Destination & Customer Info */}
                    <div className="space-y-3">
                      <div className="text-xs uppercase tracking-[0.18em] font-semibold text-black border-b border-neutral-200 pb-1.5">{coreContent.text("content-39", "Fulfillment & Destination")}</div>

                      <div className="text-xs space-y-1.5">
                        <div className="text-neutral-400 text-[10px] uppercase font-mono">{coreContent.text("content-40", "Recipient:")}</div>
                        <div className="font-semibold text-black">{customerName}</div>
                        {(customerPhone || customerEmail) && (
                          <div className="text-[11px] text-neutral-500 font-mono">
                            {customerPhone} {customerPhone && customerEmail && '•'} {customerEmail}
                          </div>
                        )}
                      </div>

                      <div className="text-xs space-y-1 pt-2 border-t border-neutral-200/60">
                        <div className="text-neutral-400 text-[10px] uppercase font-mono">
                          {isPickup ? 'Store Collection Slot:' : 'Delivery Address:'}
                        </div>
                        <div className="text-neutral-700 font-light text-[11px] leading-relaxed flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                          <span>
                            {isPickup 
                              ? `${order.pickupLocation || 'Ground Floor Express Counter 2, Banago, Nagcarlan'} (${order.pickupTimeSlot || 'Standard Slot'})`
                              : (order.deliveryAddress || 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002')}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 pt-2 border-t border-neutral-200/60">
                        <div className="text-neutral-400 text-[10px] uppercase font-mono">{coreContent.text("content-41", "Payment Mode:")}</div>
                        <div className="font-medium text-black flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{order.paymentMethod || 'Cash on Pickup / COD'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-neutral-300 pt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-neutral-600">
                        <span>{coreContent.text("content-42", "Items Subtotal:")}</span>
                        <span className="font-mono">{coreContent.text("content-43", "₱")}{(order.subtotal || order.total || 0).toLocaleString()}</span>
                      </div>

                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />{coreContent.text("content-44", "Discount Savings:")}</span>
                          <span className="font-mono">{coreContent.text("content-45", "-₱")}{order.discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-neutral-600">
                        <span>{coreContent.text("content-46", "Fulfillment Fee:")}</span>
                        <span className="font-mono">
                          {order.deliveryFee ? `₱${order.deliveryFee}` : 'Free'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-bold text-black pt-2 border-t border-neutral-300">
                        <span>{coreContent.text("content-47", "Total Paid / Due:")}</span>
                        <span className="font-mono text-base">{coreContent.text("content-48", "₱")}{order.total?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Transaction Action Buttons */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => handleTrackOrder(order.id)}
                        className="w-full py-2.5 bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-300" />
                        <span>{coreContent.text("content-49", "Track This Order")}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handlePrintSlip(order)}
                          className="py-2 px-3 bg-white border border-neutral-300 hover:border-black text-[11px] uppercase tracking-wider text-neutral-700 hover:text-black font-medium transition-colors flex items-center justify-center gap-1.5"
                          title={coreContent("content-50", "Print official transaction receipt")}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{coreContent.text("content-51", "Receipt")}</span>
                        </button>

                        <button
                          onClick={() => handleReorderItems(order)}
                          className="py-2 px-3 bg-white border border-neutral-300 hover:border-black text-[11px] uppercase tracking-wider text-neutral-700 hover:text-black font-medium transition-colors flex items-center justify-center gap-1.5"
                          title={coreContent("content-52", "Reorder these items")}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{coreContent.text("content-53", "Reorder")}</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      <CoreSectionSlot placement="before:3" />
      {/* Footer Info Banner */}
      <div className="bg-[#FAF9F5] border border-neutral-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
          <div>
            <div className="font-semibold text-black uppercase tracking-wider text-[11px]">{coreContent.text("content-54", "Omnichannel Order Guarantee")}</div>
            <p className="text-[11px] text-neutral-500 font-light mt-0.5">{coreContent.text("content-55", "All transactions are logged in Mama Mo's real-time inventory ledger at Banago, Nagcarlan, Laguna. Present your order reference number at Counter 2 for instant collection.")}</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('contact')}
          className="shrink-0 px-4 py-2 border border-neutral-300 hover:border-black bg-white text-xs uppercase tracking-wider transition-colors font-medium"
        >{coreContent.text("content-56", "Need Assistance? Contact Us")}</button>
      </div>

    </div>
  );
}
