import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SERVICE_INQUIRIES,
  PROMOTIONS,
  STORE_INFO
} from '../data/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Products state (persisted in localStorage)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_products_v2');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('mm_products_v1');
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart state (persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state (persisted in localStorage)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Printing Service Inquiries
  const [serviceInquiries, setServiceInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_inquiries_v1');
      return saved ? JSON.parse(saved) : INITIAL_SERVICE_INQUIRIES;
    } catch {
      return INITIAL_SERVICE_INQUIRIES;
    }
  });

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mm_products_v2', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mm_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mm_orders_v1', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Sync inquiries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mm_inquiries_v1', JSON.stringify(serviceInquiries));
    } catch (e) {
      console.error(e);
    }
  }, [serviceInquiries]);

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === prev?.id ? null : prev));
    }, 3500);
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: Math.min(quantity, product.stock) }];
    });
    showToast(`Added "${product.name}" to bag`, 'success');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === productId) {
            const product = products.find(p => p.id === productId);
            const maxStock = product ? product.stock : 999;
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(newQty, maxStock) } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = productId => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const trimmed = code.trim().toUpperCase();
    const found = PROMOTIONS.find(p => p.code === trimmed);
    if (found) {
      setAppliedPromo(found);
      showToast(`Promo code "${trimmed}" applied!`, 'success');
      return { success: true, promo: found };
    } else {
      showToast('Invalid or expired promotional code', 'error');
      return { success: false, message: 'Invalid code' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Cart Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let cartDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.code === 'STUDENT15') {
      cartDiscount = Math.round(cartSubtotal * 0.15);
    } else if (appliedPromo.code === 'FACULTYPACK') {
      cartDiscount = 150; // Discount credit
    } else if (appliedPromo.code === 'THESIS2026') {
      cartDiscount = 200;
    }
  }

  // Order Placement
  const placeOrder = (orderData) => {
    const newOrderId = `MM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      status: 'Order Placed',
      statusNotes: orderData.fulfillment === 'pickup' 
        ? 'Order received. Store staff will pack your essentials shortly.'
        : 'Order received. Being prepared for local courier dispatch.',
      ...orderData
    };

    // Update stock levels
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = orderData.items.find(ci => ci.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Admin Order Updates
  const updateOrderStatus = (orderId, newStatus, newNotes) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              statusNotes: newNotes || order.statusNotes
            }
          : order
      )
    );
    showToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
  };

  // Admin Product Operations
  const addProduct = (productData) => {
    const newProd = {
      ...productData,
      id: `prod-${Date.now()}`,
      sku: productData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Product "${productData.name}" added successfully!`, 'success');
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updatedData } : p))
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted from inventory', 'info');
  };

  // Submit Printing Inquiries
  const submitServiceInquiry = (inquiryData) => {
    const newInquiryId = `SRV-INQ-${Math.floor(100 + Math.random() * 900)}`;
    const newInq = {
      id: newInquiryId,
      date: new Date().toISOString(),
      status: 'In Review',
      ...inquiryData
    };
    setServiceInquiries(prev => [newInq, ...prev]);
    showToast(`Service request ${newInquiryId} submitted! Our print team will contact you.`, 'success');
    return newInq;
  };

  const updateInquiryStatus = (inquiryId, newStatus) => {
    setServiceInquiries(prev =>
      prev.map(inq => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
    showToast(`Inquiry ${inquiryId} updated to ${newStatus}`, 'success');
  };

  // Reset to default sample demonstration state
  const resetToDefaultData = () => {
    localStorage.removeItem('mm_products_v1');
    localStorage.removeItem('mm_products_v2');
    localStorage.removeItem('mm_orders_v1');
    localStorage.removeItem('mm_inquiries_v1');
    localStorage.removeItem('mm_cart_v1');
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setServiceInquiries(INITIAL_SERVICE_INQUIRIES);
    setCart([]);
    setAppliedPromo(null);
    showToast('Demonstration data has been reset to defaults', 'info');
  };

  const navigateTo = (tab, params = {}) => {
    setActiveTab(tab);
    if (params.category) setSelectedCategory(params.category);
    if (params.search !== undefined) setSearchQuery(params.search);
    if (params.trackingId) setTrackingOrderNumber(params.trackingId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        orders,
        serviceInquiries,
        promotions: PROMOTIONS,
        storeInfo: STORE_INFO,
        activeTab,
        selectedCategory,
        searchQuery,
        isCartOpen,
        quickViewProduct,
        trackingOrderNumber,
        appliedPromo,
        toastMessage,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartFinalTotal: Math.max(0, cartSubtotal - cartDiscount),
        setActiveTab,
        setSelectedCategory,
        setSearchQuery,
        setIsCartOpen,
        setQuickViewProduct,
        setTrackingOrderNumber,
        navigateTo,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        submitServiceInquiry,
        updateInquiryStatus,
        resetToDefaultData,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
