import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/initialData';
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
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    serviceInquiries, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    updateInquiryStatus,
    resetToDefaultData,
    navigateTo 
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // 'orders' | 'products' | 'inquiries' | 'settings'

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

  // Filter products in admin
  const [productSearch, setProductSearch] = useState('');

  // Status options for orders
  const orderStatusOptions = [
    'Order Placed',
    'Processing',
    'Ready for Pickup',
    'Out for Delivery',
    'Completed'
  ];

  // Calculations for quick dashboard stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalUnitsInStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status !== 'Completed').length;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Top Banner */}
      <div className="border-b border-neutral-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
              Store Owner Portal
            </span>
            <span className="bg-amber-100 text-amber-900 text-[9px] uppercase tracking-wider px-2 py-0.5 border border-amber-300 font-semibold">
              Live Demo Mode
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide mt-1 uppercase">
            Administrative Console
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
            Manage inventory pricing, fulfill customer pickup/delivery orders, and review incoming print inquiries.
          </p>
        </div>

        {/* Global Reset Button */}
        <button
          onClick={resetToDefaultData}
          className="flex items-center gap-2 text-xs uppercase tracking-wider px-4 py-2.5 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black transition-colors"
          title="Reset sample inventory and orders to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Total Orders</span>
          <div className="text-2xl font-bold font-mono text-black">{orders.length}</div>
          <span className="text-[11px] text-amber-700 font-medium">{pendingOrdersCount} pending fulfillment</span>
        </div>

        <div className="p-5 bg-white border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Simulated Sales</span>
          <div className="text-2xl font-bold font-mono text-black">₱{totalRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-neutral-500 font-light">Philippine Pesos</span>
        </div>

        <div className="p-5 bg-white border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Active Products</span>
          <div className="text-2xl font-bold font-mono text-black">{products.length}</div>
          <span className="text-[11px] text-neutral-500 font-light">{totalUnitsInStock} total units in stock</span>
        </div>

        <div className="p-5 bg-white border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Print Inquiries</span>
          <div className="text-2xl font-bold font-mono text-black">{serviceInquiries.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Active requests</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        {[
          { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Inventory & Pricing (${products.length})`, icon: Package },
          { id: 'inquiries', label: `Printing Requests (${serviceInquiries.length})`, icon: Printer },
          { id: 'settings', label: 'Store Information', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-5 text-xs uppercase tracking-wider font-medium border-b-2 whitespace-nowrap transition-all ${
                isActive 
                  ? 'border-black text-black bg-neutral-100/60' 
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CUSTOMER ORDERS */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-light font-editorial uppercase tracking-[0.18em] text-black">
              Orders Queue &amp; Status Control
            </h2>
            <span className="text-xs text-neutral-500 font-light">
              Tip for presenter: Change an order status here, then check the Order Tracking page to see it update!
            </span>
          </div>

          <div className="overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="p-4">Order ID &amp; Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Fulfillment</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-black">{order.id}</div>
                      <div className="text-[10px] text-neutral-400">
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-black">{order.customer.name}</div>
                      <div className="text-[10px] text-neutral-500">{order.customer.type} • {order.customer.phone}</div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium ${
                        order.fulfillment === 'pickup' 
                          ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {order.fulfillment === 'pickup' ? 'In-Store Pickup' : 'Delivery'}
                      </span>
                      <p className="text-[10px] text-neutral-500 truncate max-w-xs mt-0.5">
                        {order.fulfillment === 'pickup' ? order.pickupTimeSlot : order.deliveryAddress}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="font-medium">{order.items?.length || 0} items</span>
                      <div className="text-[10px] text-neutral-500 truncate max-w-xs">
                        {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-semibold text-black">
                      ₱{order.total?.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs px-2.5 py-1.5 border border-neutral-300 bg-white font-medium focus:outline-none focus:border-black cursor-pointer"
                      >
                        {orderStatusOptions.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigateTo('tracking', { trackingId: order.id })}
                        className="text-[11px] uppercase tracking-wider text-neutral-600 hover:text-black underline"
                      >
                        View in Tracking
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY PRODUCTS MANAGEMENT */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products in inventory..."
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-black"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (₱)</th>
                  <th className="p-4">Orig. Price (₱)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Featured / Promo</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products
                  .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div>
                            <span className="font-semibold text-black line-clamp-1">{product.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">{product.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-neutral-600">{product.category}</td>

                      <td className="p-4 font-mono font-bold text-black">₱{product.price.toLocaleString()}</td>

                      <td className="p-4 font-mono text-neutral-400">
                        {product.originalPrice ? `₱${product.originalPrice.toLocaleString()}` : '-'}
                      </td>

                      <td className="p-4 font-mono">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold ${
                          product.stock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>

                      <td className="p-4 space-x-2">
                        {product.isFeatured && (
                          <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 border border-neutral-300">Featured</span>
                        )}
                        {product.isDiscounted && (
                          <span className="text-[10px] bg-black text-white px-1.5 py-0.5">Discount</span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1 text-neutral-500 hover:text-black transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRINTING REQUESTS */}
      {activeAdminTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-light font-editorial uppercase tracking-[0.18em] text-black">
              Incoming Printing &amp; Bookbinding Inquiries
            </h2>
            <span className="text-xs text-neutral-500 font-light">
              Requests submitted through the Printing Services page
            </span>
          </div>

          <div className="overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="p-4">Inquiry ID</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Service Type</th>
                  <th className="p-4">Specs &amp; Pages</th>
                  <th className="p-4">Estimated Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {serviceInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-black">{inq.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-black">{inq.clientName}</div>
                      <div className="text-[10px] text-neutral-500">{inq.clientPhone} • {inq.clientEmail}</div>
                    </td>
                    <td className="p-4 text-black font-medium">{inq.serviceType}</td>
                    <td className="p-4">
                      <div>{inq.pageCount} pages • {inq.paperType}</div>
                      <div className="text-[10px] text-neutral-500">{inq.bindingDetails}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-black">₱{inq.estimatedCost?.toLocaleString()}</td>
                    <td className="p-4">
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-neutral-300 bg-white"
                      >
                        <option value="In Review">In Review</option>
                        <option value="Approved & Printing">Approved &amp; Printing</option>
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
      )}

      {/* TAB 4: STORE INFO CONFIGURATION */}
      {activeAdminTab === 'settings' && (
        <div className="bg-[#FAF9F5] border border-neutral-300 p-8 space-y-6 max-w-2xl">
          <h2 className="text-base font-light font-editorial uppercase tracking-[0.18em] text-black">
            Business &amp; Omnichannel Settings
          </h2>
          <div className="space-y-4 text-xs font-light text-neutral-600 leading-relaxed">
            <p>
              <strong className="text-black font-medium">Business Name:</strong> Mama Mo Ink Print and Supplies
            </p>
            <p>
              <strong className="text-black font-medium">Fulfillment Channels:</strong> Express Campus In-Store Pickup (Counter 2) &amp; Local Courier Delivery (Metro Manila)
            </p>
            <p>
              <strong className="text-black font-medium">Store Physical Address:</strong> 1249 F. Cayco St. corner España Boulevard, Sampaloc, Manila (Across Gate 3)
            </p>
            <p>
              <strong className="text-black font-medium">Academic Discount Policy:</strong> Active (15% with promo code STUDENT15)
            </p>
            <p>
              <strong className="text-black font-medium">Demonstration Notice:</strong> All administrative modifications update the browser's local state and persistent storage, enabling a fully autonomous presentation without an external database.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-neutral-300 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-editorial text-lg text-black">
                {editingProduct ? 'Edit Inventory Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 bg-white"
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
                    className="w-full px-3 py-2 border border-neutral-300 font-mono"
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
                    className="w-full px-3 py-2 border border-neutral-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Original Price (₱)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-black"
                  />
                  <span>Mark as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isDiscounted}
                    onChange={(e) => setProductForm({ ...productForm, isDiscounted: e.target.checked })}
                    className="accent-black"
                  />
                  <span>Mark as Discounted</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
