import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
import VisualPageEditor from '../components/builder/VisualPageEditor';
import MediaLibraryModal from '../components/builder/MediaLibraryModal';
import NavigationManagerModal from '../components/builder/NavigationManagerModal';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';
import { 
  Package, 
  ShoppingBag, 
  Printer, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  Search,
  Eye,
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Layout,
  Layers,
  Image as ImageIcon,
  Tag,
  BarChart3,
  Download,
  Copy,
  ExternalLink,
  Sliders,
  CheckCircle2,
  FileText,
  Filter,
  Truck,
  Store,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  Percent,
  Calendar,
  DollarSign,
  ArrowLeft,
  LogOut,
  Menu
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

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    serviceInquiries, 
    customPages,
    navigationConfig,
    mediaLibrary,
    inventoryLedger,
    promotionsList,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    updateInquiryStatus,
    saveCustomPage,
    duplicateCustomPage,
    deleteCustomPage,
    publishCustomPage,
    unpublishCustomPage,
    addPromotion,
    deletePromotion,
    togglePromotion,
    resetToDefaultData,
    navigateTo,
    currentUser,
    logout
  } = useApp();

  // Active admin tab: 'orders' | 'inventory' | 'pages' | 'promotions' | 'inquiries' | 'analytics' | 'settings'
  const [activeAdminTab, setActiveAdminTab] = useState('orders');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Product management modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'School Supplies',
    price: 150,
    originalPrice: 180,
    stock: 50,
    isFeatured: true,
    isDiscounted: true,
    description: '',
    image: 'https://images.unsplash.com/photo-1585336261026-40742f15923b?auto=format&fit=crop&w=600&q=80',
    sku: ''
  });

  // Website Builder modal states
  const [editingCustomPage, setEditingCustomPage] = useState(null);
  const [isVisualEditorOpen, setIsVisualEditorOpen] = useState(false);
  const [isNavManagerOpen, setIsNavManagerOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  // Stock Adjustment modal state
  const [stockAdjustProduct, setStockAdjustProduct] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [inventorySubTab, setInventorySubTab] = useState('catalog'); // 'catalog' | 'ledger'
  const [productSearch, setProductSearch] = useState('');
  const [lowStockFilterOnly, setLowStockFilterOnly] = useState(false);

  // Promotions modal state
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    active: true
  });
  const [copiedPromoCode, setCopiedPromoCode] = useState(null);

  // Order filters
  const [orderFilterStatus, setOrderFilterStatus] = useState('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderPreview, setSelectedOrderPreview] = useState(null);

  // Status options for orders
  const orderStatusOptions = [
    'Order Placed',
    'Processing',
    'Ready for Pickup',
    'Out for Delivery',
    'Completed'
  ];

  // Quick stats calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalUnitsInStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status !== 'Completed').length;
  const lowStockProductsCount = products.filter(p => p.stock <= 15).length;
  const pickupOrdersCount = orders.filter(o => o.fulfillment === 'pickup').length;
  const deliveryOrdersCount = orders.filter(o => o.fulfillment === 'delivery').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const totalInventoryValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  // Navigation Items Config for Admin Sidebar
  const adminNavItems = [
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, count: orders.length },
    { id: 'inventory', label: 'Inventory & Stock Ledger', icon: Package, count: products.length },
    { id: 'pages', label: 'Dynamic Pages & CMS', icon: Layout, count: customPages.length },
    { id: 'promotions', label: 'Discounts & Promos', icon: Tag, count: promotionsList.length },
    { id: 'inquiries', label: 'Print Requests', icon: Printer, count: serviceInquiries.length },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  // Export Orders CSV
  const handleExportOrdersCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Fulfillment', 'Payment Method', 'Items Count', 'Total (PHP)', 'Status'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.date).toLocaleDateString(),
      `"${o.name || o.customer?.name || 'Walk-in'}"`,
      `"${o.email || o.customer?.email || 'N/A'}"`,
      `"${o.phone || o.customer?.phone || 'N/A'}"`,
      o.fulfillment || 'pickup',
      `"${o.paymentMethod || 'Cash'}"`,
      o.items?.length || 0,
      o.total || 0,
      o.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mama_mo_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Inventory CSV
  const handleExportInventoryCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Price (PHP)', 'Stock Quantity', 'Stock Status'];
    const rows = products.map(p => [
      p.sku || 'SKU-NONE',
      `"${p.name}"`,
      `"${p.category}"`,
      p.price,
      p.stock,
      p.stock === 0 ? 'Out of Stock' : p.stock <= 15 ? 'Low Stock' : 'Optimal'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mama_mo_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Product modal handlers
  const handleOpenAddModal = () => {
    setProductForm({
      name: '',
      category: 'School Supplies',
      price: 150,
      originalPrice: 180,
      stock: 40,
      isFeatured: false,
      isDiscounted: false,
      description: 'High quality student and office supply item.',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setEditingProduct(null);
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setIsAddProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock)
      });
    } else {
      addProduct({
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock)
      });
    }
    setIsAddProductModalOpen(false);
  };

  // Website Builder Handlers
  const handleOpenCreatePage = () => {
    setEditingCustomPage({
      id: `page-${Date.now()}`,
      title: 'New Store Campaign',
      slug: `campaign-${Math.floor(100 + Math.random() * 900)}`,
      description: 'Special seasonal stationery and print promo.',
      status: 'draft',
      showInNav: false,
      showInFooter: true,
      components: [
        {
          id: `comp-${Date.now()}-1`,
          type: 'hero',
          data: {
            eyebrow: 'New Campaign',
            title: 'Welcome to Mama Mo Store',
            subtitle: 'Exclusive student bundles and same-day express printing.',
            buttonText: 'Shop Catalog',
            buttonLink: 'shop',
            imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=80',
            align: 'center',
            theme: 'dark'
          }
        }
      ]
    });
    setIsVisualEditorOpen(true);
  };

  const handleEditCustomPage = (page) => {
    setEditingCustomPage(page);
    setIsVisualEditorOpen(true);
  };

  // Promotions Handlers
  const handleSavePromo = (e) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;
    addPromotion(promoForm);
    setIsAddPromoOpen(false);
    setPromoForm({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 15,
      minSpend: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      active: true
    });
  };

  const handleCopyPromo = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedPromoCode(code);
    setTimeout(() => setCopiedPromoCode(null), 2000);
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderFilterStatus === 'All' || o.status === orderFilterStatus;
    const matchesSearch = o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (o.name || o.customer?.name || '').toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered products for inventory
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      (p.sku || '').toLowerCase().includes(productSearch.toLowerCase());
    const matchesLowStock = lowStockFilterOnly ? p.stock <= 15 : true;
    return matchesSearch && matchesLowStock;
  });

  // Get status color styles for orders
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Ready for Pickup':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Processing':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const activeTabMeta = adminNavItems.find(t => t.id === activeAdminTab);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#121212] flex flex-col md:flex-row antialiased font-sans">
      
      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION (Desktop Fixed / Mobile Drawer)       */}
      {/* ========================================================= */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#111111] text-neutral-200 flex flex-col justify-between border-r border-neutral-800 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand & Back to Store */}
        <div className="p-5 border-b border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigateTo('home')}
              className="text-left group focus:outline-none"
            >
              <div className="text-xl font-light font-editorial tracking-[0.22em] text-white uppercase group-hover:text-amber-300 transition-colors">
                MAMA MO
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-sans mt-0.5">
                ADMIN CONSOLE
              </div>
            </button>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Direct Return to Storefront CTA */}
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 text-xs font-medium transition-all group shadow-2xs"
            title="Exit Admin and return to live website"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Storefront</span>
            </span>
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </button>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
          <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-widest text-neutral-500">
            Operations & Logistics
          </div>

          {adminNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveAdminTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-white text-black font-semibold shadow-xs' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom: Store Location & Admin User Profile */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/60 space-y-3">
          
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="truncate">Banago, Nagcarlan Hub</span>
          </div>

          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold font-mono text-xs">
                AC
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="font-semibold text-white">Anne Francine</div>
                <div className="text-[10px] text-neutral-400">Store Manager • 4BSBA-MM1</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigateTo('home');
              }}
              className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ========================================================= */}
      {/* MAIN ADMIN WORKSPACE                                      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header App Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Mobile hamburger + Active View Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-md text-neutral-700 hover:bg-neutral-100"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h2 className="text-lg sm:text-xl font-light font-editorial uppercase tracking-wider text-black font-semibold flex items-center gap-2">
                  {activeTabMeta?.label || 'Control Center'}
                </h2>
              </div>
            </div>

            {/* Right: Operational Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              <button
                onClick={() => setIsNavManagerOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-black text-xs uppercase tracking-wider font-medium shadow-2xs transition-colors"
                title="Manage Navigation Menus"
              >
                <Layers className="w-3.5 h-3.5 text-neutral-500" />
                <span>Store Menus</span>
              </button>

              <button
                onClick={() => setIsMediaLibraryOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-black text-xs uppercase tracking-wider font-medium shadow-2xs transition-colors"
                title="Manage Media & Product Photos"
              >
                <ImageIcon className="w-3.5 h-3.5 text-neutral-500" />
                <span>Media Assets</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-black text-xs uppercase tracking-wider font-semibold shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-700" />
                <span>Add Product</span>
              </button>

              <button
                onClick={handleOpenCreatePage}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-wider font-semibold shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Custom Page</span>
                <span className="sm:hidden">Page</span>
              </button>

            </div>

          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* KPI Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Gross Sales */}
            <div className="bg-white rounded-xl border border-neutral-200/90 p-5 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-medium">
                  Total Gross Sales
                </span>
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-tight">
                ₱{totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                  +18.4%
                </span>
                <span>Across {orders.length} orders</span>
              </div>
            </div>

            {/* Card 2: Active Orders */}
            <div className="bg-white rounded-xl border border-neutral-200/90 p-5 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-medium">
                  Active Fulfillment
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-tight">
                {pendingOrdersCount}
              </div>
              <div className="text-[11px] text-neutral-500">
                {pickupOrdersCount} in-store pickups • {deliveryOrdersCount} courier deliveries
              </div>
            </div>

            {/* Card 3: Inventory Units */}
            <div className="bg-white rounded-xl border border-neutral-200/90 p-5 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-medium">
                  Inventory Stock
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-tight">
                {totalUnitsInStock} <span className="text-xs font-sans text-neutral-400 font-normal">units</span>
              </div>
              <div className="text-[11px]">
                {lowStockProductsCount > 0 ? (
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {lowStockProductsCount} products low stock
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium">All stock optimal</span>
                )}
              </div>
            </div>

            {/* Card 4: Dynamic CMS Pages */}
            <div className="bg-white rounded-xl border border-neutral-200/90 p-5 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-medium">
                  Dynamic CMS Pages
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Layout className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-tight">
                {customPages.length}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{customPages.filter(p => p.status === 'published').length} published on website</span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* TAB 1: ORDERS & FULFILLMENT QUEUE                         */}
          {/* ========================================================= */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  {['All', ...orderStatusOptions].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        orderFilterStatus === st 
                          ? 'bg-neutral-900 text-white shadow-xs' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Search & Export */}
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search order ID or client..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    onClick={handleExportOrdersCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-black text-xs uppercase tracking-wider font-medium transition-all shadow-xs"
                    title="Export Orders to CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>

              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl border border-neutral-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                        <th className="py-3.5 px-4">Order Code</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Fulfillment Mode</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-neutral-400 text-xs font-light">
                            <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                            No orders found matching the filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const customerName = order.name || order.customer?.name || 'Walk-in Customer';
                          const initials = customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                          const isPickup = order.fulfillment === 'pickup';

                          return (
                            <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                              <td className="py-4 px-4 font-mono font-bold text-black whitespace-nowrap">
                                <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-800 text-[11px]">
                                  {order.id}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-black leading-tight">{customerName}</div>
                                    <div className="text-[10px] text-neutral-400 mt-0.5">
                                      {order.phone || order.customer?.phone || 'No phone'} • {order.email || order.customer?.email || 'No email'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border ${
                                    isPickup 
                                      ? 'bg-amber-50 text-amber-900 border-amber-200' 
                                      : 'bg-sky-50 text-sky-900 border-sky-200'
                                  }`}>
                                    {isPickup ? <Store className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                                    {isPickup ? 'Counter 2 Pickup' : 'Courier Delivery'}
                                  </span>
                                  <div className="text-[10px] text-neutral-500 truncate max-w-[170px]" title={isPickup ? order.pickupSlot : order.deliveryAddress}>
                                    {isPickup ? order.pickupSlot : order.deliveryAddress}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px] font-medium">
                                  {order.paymentMethod || 'Cash'}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-mono font-bold text-black text-sm whitespace-nowrap">
                                ₱{order.total?.toLocaleString()}
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium focus:outline-none focus:ring-1 focus:ring-black cursor-pointer transition-all ${getStatusBadge(order.status)}`}
                                >
                                  {orderStatusOptions.map(st => (
                                    <option key={st} value={st} className="bg-white text-black font-normal">{st}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                <button
                                  onClick={() => setSelectedOrderPreview(order)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-black text-[11px] font-medium transition-colors bg-white shadow-xs"
                                >
                                  <Eye className="w-3 h-3 text-neutral-500" />
                                  <span>Inspect</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: INVENTORY & STOCK LEDGER                           */}
          {/* ========================================================= */}
          {activeAdminTab === 'inventory' && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex rounded-lg bg-neutral-100 p-1 border border-neutral-200">
                  <button
                    onClick={() => setInventorySubTab('catalog')}
                    className={`px-3.5 py-1.5 rounded-md text-xs uppercase tracking-wider font-medium transition-all ${
                      inventorySubTab === 'catalog' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Catalog Items ({products.length})
                  </button>
                  <button
                    onClick={() => setInventorySubTab('ledger')}
                    className={`px-3.5 py-1.5 rounded-md text-xs uppercase tracking-wider font-medium transition-all ${
                      inventorySubTab === 'ledger' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Stock Movement Ledger ({inventoryLedger.length})
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleExportInventoryCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-black text-xs uppercase tracking-wider font-medium transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>

                  <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-wider font-semibold transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Low stock warning */}
              {lowStockProductsCount > 0 && inventorySubTab === 'catalog' && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Warning: <strong>{lowStockProductsCount} products</strong> have reached low-stock threshold (≤ 15 units).</span>
                  </div>
                  <button
                    onClick={() => setLowStockFilterOnly(!lowStockFilterOnly)}
                    className="px-2.5 py-1 rounded bg-rose-200/60 hover:bg-rose-200 text-rose-900 font-semibold text-[11px] transition-colors"
                  >
                    {lowStockFilterOnly ? 'Show All Products' : 'Filter Low Stock Only'}
                  </button>
                </div>
              )}

              {inventorySubTab === 'catalog' ? (
                <div className="space-y-4">
                  <div className="relative max-w-sm">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search product title or SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 bg-white text-xs focus:outline-none focus:border-black shadow-xs transition-all"
                    />
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                            <th className="py-3.5 px-4">Photo & SKU</th>
                            <th className="py-3.5 px-4">Product Name</th>
                            <th className="py-3.5 px-4">Category</th>
                            <th className="py-3.5 px-4">Retail Price</th>
                            <th className="py-3.5 px-4">Stock Health</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {filteredProducts.map((product) => {
                            const isLowStock = product.stock <= 15;
                            const isOutOfStock = product.stock === 0;
                            const stockPercent = Math.min(100, (product.stock / 50) * 100);

                            return (
                              <tr key={product.id} className="hover:bg-neutral-50/70 transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-10 h-10 rounded-lg object-cover border border-neutral-200 bg-neutral-100 shrink-0 shadow-2xs"
                                    />
                                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                                      {product.sku || 'N/A'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-black max-w-xs">
                                  <div>{product.name}</div>
                                  {product.isFeatured && (
                                    <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono font-bold">
                                      Featured
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-neutral-600 font-medium">
                                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[11px]">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-black text-sm">
                                  ₱{product.price}
                                </td>
                                <td className="py-3.5 px-4 min-w-[130px]">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-mono">
                                      <span className="font-bold text-black">{product.stock} units</span>
                                      <button
                                        onClick={() => {
                                          setStockAdjustProduct(product);
                                          setIsStockModalOpen(true);
                                        }}
                                        className="text-[10px] text-neutral-500 hover:text-black font-medium underline flex items-center gap-0.5"
                                        title="Record audit stock adjustment"
                                      >
                                        <Sliders className="w-2.5 h-2.5" />
                                        Adjust
                                      </button>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full transition-all ${
                                          isOutOfStock ? 'bg-rose-500 w-0' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${stockPercent}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border ${
                                    isOutOfStock 
                                      ? 'bg-rose-50 text-rose-800 border-rose-200' 
                                      : isLowStock 
                                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  }`}>
                                    {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleOpenEditModal(product)}
                                      className="p-1.5 rounded-lg text-neutral-500 hover:text-black border border-neutral-200 hover:border-black bg-white shadow-xs transition-colors"
                                      title="Edit Product"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete "${product.name}" from catalog?`)) {
                                          deleteProduct(product.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:border-rose-300 bg-white shadow-xs transition-colors"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    <strong>Audited Stock Movement Ledger:</strong> Every manual stock modification, order cancellation, and customer checkout is registered below with real-time audit trail tracking.
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                            <th className="py-3.5 px-4">Date & Time</th>
                            <th className="py-3.5 px-4">Product Name</th>
                            <th className="py-3.5 px-4">Quantity Delta</th>
                            <th className="py-3.5 px-4">Previous → Final</th>
                            <th className="py-3.5 px-4">Operational Reason</th>
                            <th className="py-3.5 px-4">Operator</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {inventoryLedger.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                              <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">{item.date}</td>
                              <td className="py-3.5 px-4 font-semibold text-black max-w-xs">{item.productName}</td>
                              <td className="py-3.5 px-4">
                                <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                  item.changeAmount > 0 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : item.changeAmount < 0 
                                    ? 'bg-rose-100 text-rose-800' 
                                    : 'bg-neutral-100 text-neutral-700'
                                }`}>
                                  {item.changeAmount > 0 ? `+${item.changeAmount}` : item.changeAmount} units
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-neutral-700">
                                {item.previousStock} → <strong className="text-black">{item.newStock}</strong>
                              </td>
                              <td className="py-3.5 px-4 text-neutral-700 font-light">{item.reason}</td>
                              <td className="py-3.5 px-4 text-neutral-500 text-[11px] font-mono">{item.user}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DYNAMIC PAGES & WEBSITE BUILDER                    */}
          {/* ========================================================= */}
          {activeAdminTab === 'pages' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-light font-editorial uppercase tracking-[0.16em] text-black font-semibold">
                    Visual Dynamic CMS Page Manager
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">
                    Build promotions, seasonal showcases, and university supply landing pages.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsNavManagerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:border-black text-xs uppercase tracking-wider font-medium shadow-xs"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Configure Menus</span>
                  </button>

                  <button
                    onClick={handleOpenCreatePage}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Page</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customPages.map((page) => {
                  const isPublished = page.status === 'published';
                  return (
                    <div
                      key={page.id}
                      className="bg-white rounded-xl border border-neutral-200/90 p-6 flex flex-col justify-between space-y-5 hover:border-neutral-400 hover:shadow-md transition-all shadow-xs group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                            isPublished ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}>
                            {page.status}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                            {page.components?.length || 0} sections
                          </span>
                        </div>

                        <div>
                          <h4 className="font-editorial text-xl text-black font-semibold leading-snug group-hover:text-amber-800 transition-colors">
                            {page.title}
                          </h4>
                          <p className="font-mono text-[11px] text-neutral-500 mt-1">
                            /{page.slug}
                          </p>
                        </div>

                        <p className="text-xs text-neutral-600 font-light line-clamp-2 leading-relaxed">
                          {page.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCustomPage(page)}
                            className="px-3 py-1.5 rounded-lg bg-black text-white text-[11px] uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors shadow-xs"
                          >
                            Visual Editor
                          </button>

                          <button
                            onClick={() => navigateTo(page.slug)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-black border border-neutral-200 hover:border-black bg-white transition-colors"
                            title="Live Preview"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => duplicateCustomPage(page.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-black border border-neutral-200 hover:border-black bg-white transition-colors"
                            title="Duplicate Page"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isPublished ? (
                            <button
                              onClick={() => unpublishCustomPage(page.id)}
                              className="text-[11px] text-neutral-500 hover:text-black underline"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              onClick={() => publishCustomPage(page.id)}
                              className="text-[11px] text-emerald-700 font-semibold hover:underline"
                            >
                              Publish
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Delete page "${page.title}"? This cannot be undone.`)) {
                                deleteCustomPage(page.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: DISCOUNTS & PROMOTIONS                             */}
          {/* ========================================================= */}
          {activeAdminTab === 'promotions' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-light font-editorial uppercase tracking-[0.16em] text-black font-semibold">
                    Discount Codes & Academic Vouchers
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">
                    Manage active coupons applicable across checkout carts.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddPromoOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-wider font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotionsList.map(promo => (
                  <div 
                    key={promo.id}
                    className={`bg-white rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all shadow-xs ${
                      promo.active ? 'border-neutral-200/90 hover:shadow-md' : 'border-dashed border-neutral-300 opacity-60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 bg-neutral-900 text-amber-300 font-mono font-bold text-xs tracking-wider rounded-md">
                            {promo.code}
                          </span>
                          <button
                            onClick={() => handleCopyPromo(promo.code)}
                            className="p-1 text-neutral-400 hover:text-black"
                            title="Copy code"
                          >
                            {copiedPromoCode === promo.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <button
                          onClick={() => togglePromotion(promo.id)}
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border transition-all ${
                            promo.active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {promo.active ? 'Active' : 'Disabled'}
                        </button>
                      </div>

                      <div>
                        <h4 className="font-semibold text-black text-sm">{promo.title}</h4>
                        <p className="text-xs text-neutral-500 font-light mt-1">{promo.description}</p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 text-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500">Discount:</span>
                          <span className="font-bold text-black font-mono text-sm">
                            {promo.discountType === 'percentage' ? `${promo.discountValue}% Off` : `₱${promo.discountValue} Flat Off`}
                          </span>
                        </div>
                        {promo.minSpend > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">Min. Spend:</span>
                            <span className="font-mono text-neutral-700">₱{promo.minSpend}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500">Redemptions:</span>
                          <span className="font-mono font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[10px]">
                            {promo.usageCount || 0} times
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm(`Delete promotion code "${promo.code}"?`)) {
                            deletePromotion(promo.id);
                          }
                        }}
                        className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: PRINTING SERVICES INQUIRIES                        */}
          {/* ========================================================= */}
          {activeAdminTab === 'inquiries' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs">
                <h3 className="text-base font-light font-editorial uppercase tracking-[0.16em] text-black font-semibold">
                  Printing & Thesis Quotation Submissions
                </h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Client submissions from the website printing estimator tool.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                        <th className="py-3.5 px-4">Inquiry ID</th>
                        <th className="py-3.5 px-4">Client Contact</th>
                        <th className="py-3.5 px-4">Service Type</th>
                        <th className="py-3.5 px-4">Specifications</th>
                        <th className="py-3.5 px-4">Estimated Total</th>
                        <th className="py-3.5 px-4">Status & Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {serviceInquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-black whitespace-nowrap">
                            <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-800 text-[11px]">
                              {inq.id}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-black">{inq.clientName}</div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">{inq.clientPhone} • {inq.clientEmail}</div>
                          </td>
                          <td className="py-4 px-4 text-black font-medium">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[11px]">
                              {inq.serviceType}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-neutral-800">{inq.pageCount} pages • {inq.paperType}</div>
                            <div className="text-[10px] text-neutral-500 mt-0.5">{inq.bindingDetails}</div>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-black text-sm whitespace-nowrap">
                            ₱{inq.estimatedCost?.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={inq.status}
                              onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white font-medium focus:outline-none focus:border-black cursor-pointer shadow-2xs"
                            >
                              <option value="In Review">In Review</option>
                              <option value="Approved & Printing">Approved & Printing</option>
                              <option value="Ready for Pickup">Ready for Pickup</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: FINANCIAL REPORTING & ANALYTICS                    */}
          {/* ========================================================= */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-light font-editorial uppercase tracking-[0.16em] text-black font-semibold">
                    Financial Analytics & Omnichannel Breakdown
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">
                    Real-time transaction volume and revenue recognized from verified orders.
                  </p>
                </div>

                <button
                  onClick={handleExportOrdersCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 bg-white hover:border-black text-xs uppercase tracking-wider font-medium shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Financial CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl border border-neutral-200/90 shadow-xs space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Total Recognized Revenue</span>
                  <div className="text-3xl font-light font-editorial text-black tracking-tight">
                    ₱{totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-neutral-500 font-light">
                    Cumulative sales across {orders.length} completed and pending orders.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl border border-neutral-200/90 shadow-xs space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Average Order Value (AOV)</span>
                  <div className="text-3xl font-light font-editorial text-black tracking-tight">
                    ₱{avgOrderValue.toLocaleString()}
                  </div>
                  <p className="text-xs text-neutral-500 font-light">
                    Average basket size per customer checkout.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl border border-neutral-200/90 shadow-xs space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Catalog Inventory Value</span>
                  <div className="text-3xl font-light font-editorial text-black tracking-tight">
                    ₱{totalInventoryValuation.toLocaleString()}
                  </div>
                  <p className="text-xs text-neutral-500 font-light">
                    Total retail value across {products.length} catalog items.
                  </p>
                </div>
              </div>

              {/* Channel Distribution */}
              <div className="p-6 bg-white rounded-xl border border-neutral-200/90 shadow-xs space-y-5">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500">
                  Fulfillment Channel Distribution
                </h4>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-black">
                        <Store className="w-4 h-4 text-amber-600" />
                        In-Store Counter 2 Pickup
                      </span>
                      <span className="font-mono font-bold text-neutral-800">
                        {pickupOrdersCount} orders ({orders.length > 0 ? Math.round((pickupOrdersCount / orders.length) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${orders.length > 0 ? (pickupOrdersCount / orders.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-black">
                        <Truck className="w-4 h-4 text-sky-600" />
                        Banago, Nagcarlan &amp; Laguna Courier Delivery
                      </span>
                      <span className="font-mono font-bold text-neutral-800">
                        {deliveryOrdersCount} orders ({orders.length > 0 ? Math.round((deliveryOrdersCount / orders.length) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 rounded-full" 
                        style={{ width: `${orders.length > 0 ? (deliveryOrdersCount / orders.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: STORE SETTINGS                                     */}
          {/* ========================================================= */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              
              <div className="bg-white rounded-xl border border-neutral-200/90 p-6 space-y-5 shadow-xs">
                <h3 className="text-base font-light font-editorial uppercase tracking-[0.16em] text-black font-semibold">
                  Business Identity &amp; Store Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-neutral-700">
                  <div className="p-4 rounded-lg bg-neutral-50/70 border border-neutral-200 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Business Name</span>
                    <div className="font-medium text-black">Mama Mo Ink Print and Supplies</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50/70 border border-neutral-200 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Physical Store Address</span>
                    <div className="font-medium text-black flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>Purok 5, Barangay Banago, Nagcarlan, Laguna 4002</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50/70 border border-neutral-200 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Fulfillment Modes</span>
                    <div className="font-medium text-black">Counter 2 Pickup & Laguna Courier Dispatch</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50/70 border border-neutral-200 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Academic Policy</span>
                    <div className="font-medium text-black">Active (15% with promo code STUDENT15)</div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl border border-rose-200 p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Reset System Database & Store Records
                    </h4>
                    <p className="text-xs text-neutral-500 font-light mt-0.5">
                      Restores default verified catalog, pages, and sample orders to initial factory state.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Reset all store data to defaults? Your custom modifications will be refreshed.')) {
                        resetToDefaultData();
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Reset To Defaults
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT                               */}
      {/* ========================================================= */}
      {isAddProductModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setIsAddProductModalOpen(false)}
        >
          <div 
            className="bg-white max-w-lg w-full rounded-2xl border border-neutral-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-modal-pop text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-editorial text-xl text-black font-semibold">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Price (₱) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Original Price (₱)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Photo URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[11px] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaLibraryOpen(true)}
                    className="px-3.5 py-2 rounded-lg border border-neutral-200 hover:border-black shrink-0 font-medium bg-neutral-50"
                  >
                    Library
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-black w-4 h-4"
                  />
                  <span className="font-medium text-neutral-800">Featured in Showcase</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isDiscounted}
                    onChange={(e) => setProductForm({ ...productForm, isDiscounted: e.target.checked })}
                    className="accent-black w-4 h-4"
                  />
                  <span className="font-medium text-neutral-800">Discounted Deal</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 hover:text-black font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-black text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ORDER DETAILS PREVIEW                            */}
      {/* ========================================================= */}
      {selectedOrderPreview && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedOrderPreview(null)}
        >
          <div 
            className="bg-white max-w-xl w-full rounded-2xl border border-neutral-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-modal-pop text-xs text-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400">Order Verification</span>
                <h3 className="font-editorial text-xl text-black font-semibold">{selectedOrderPreview.id}</h3>
              </div>
              <button onClick={() => setSelectedOrderPreview(null)} className="text-neutral-400 hover:text-black p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF9F5] rounded-xl border border-neutral-200 text-xs">
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block font-mono font-bold">Customer</span>
                <span className="font-semibold text-black">{selectedOrderPreview.name || selectedOrderPreview.customer?.name}</span>
                <div className="text-neutral-500 mt-0.5">{selectedOrderPreview.phone || selectedOrderPreview.customer?.phone}</div>
                <div className="text-neutral-500">{selectedOrderPreview.email || selectedOrderPreview.customer?.email}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block font-mono font-bold">Fulfillment</span>
                <span className="font-semibold text-black">
                  {selectedOrderPreview.fulfillment === 'pickup' ? 'Counter Pickup (Banago, Nagcarlan Main Store)' : 'Courier Delivery'}
                </span>
                <div className="text-neutral-600 mt-0.5">
                  {selectedOrderPreview.fulfillment === 'pickup' ? selectedOrderPreview.pickupSlot : selectedOrderPreview.deliveryAddress}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-semibold text-black text-xs uppercase tracking-wider">Ordered Products</span>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {(selectedOrderPreview.items || []).map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-black">{item.name}</div>
                      <div className="text-[10px] text-neutral-500">Qty: {item.quantity} × ₱{item.price}</div>
                    </div>
                    <div className="font-mono font-bold text-black">
                      ₱{(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center text-sm font-bold border-t border-neutral-100">
              <span className="text-neutral-700">Total Payable:</span>
              <span className="font-mono text-black text-base">₱{selectedOrderPreview.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CREATE PROMOTION CODE                            */}
      {/* ========================================================= */}
      {isAddPromoOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsAddPromoOpen(false)}
        >
          <div 
            className="bg-white max-w-md w-full rounded-2xl border border-neutral-200 shadow-2xl p-6 space-y-4 animate-modal-pop text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-editorial text-lg text-black uppercase tracking-wider font-semibold">
                Create Promotion Voucher
              </h3>
              <button onClick={() => setIsAddPromoOpen(false)} className="text-neutral-400 hover:text-black p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-3.5">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. EXAM20"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 font-mono font-bold text-black focus:outline-none focus:border-black uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Midterm Examination Discount"
                  value={promoForm.title}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Discount Type</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white"
                  >
                    <option value="percentage">Percentage (% Off)</option>
                    <option value="fixed">Fixed Amount (₱ Flat Off)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={promoForm.discountValue}
                    onChange={(e) => setPromoForm({ ...promoForm, discountValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Minimum Cart Spend (₱)</label>
                <input
                  type="number"
                  value={promoForm.minSpend}
                  onChange={(e) => setPromoForm({ ...promoForm, minSpend: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddPromoOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: FULL VISUAL WEBSITE BUILDER                      */}
      {/* ========================================================= */}
      {isVisualEditorOpen && (
        <VisualPageEditor
          page={editingCustomPage}
          onClose={() => {
            setIsVisualEditorOpen(false);
            setEditingCustomPage(null);
          }}
          onSave={(updatedPage) => {
            saveCustomPage(updatedPage);
            setIsVisualEditorOpen(false);
            setEditingCustomPage(null);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL 5: MEDIA LIBRARY                                    */}
      {/* ========================================================= */}
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={(url) => {
          if (isAddProductModalOpen) {
            setProductForm({ ...productForm, image: url });
          }
        }}
      />

      {/* ========================================================= */}
      {/* MODAL 6: NAVIGATION MANAGER                               */}
      {/* ========================================================= */}
      <NavigationManagerModal
        isOpen={isNavManagerOpen}
        onClose={() => setIsNavManagerOpen(false)}
      />

      {/* ========================================================= */}
      {/* MODAL 7: STOCK ADJUSTMENT & INVENTORY LEDGER              */}
      {/* ========================================================= */}
      <StockAdjustmentModal
        product={stockAdjustProduct}
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setStockAdjustProduct(null);
        }}
      />

    </div>
  );
}
