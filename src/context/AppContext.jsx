import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SERVICE_INQUIRIES,
  PROMOTIONS,
  STORE_INFO
} from '../data/initialData';
import { INITIAL_USERS } from '../data/authUsers';
import {
  INITIAL_NAV_CONFIG,
  INITIAL_CUSTOM_PAGES,
  INITIAL_MEDIA_LIBRARY,
  INITIAL_INVENTORY_LEDGER,
  INITIAL_PROMOTIONS_LIST
} from '../data/builderData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Products state (persisted in localStorage)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_products_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure images are up to date with INITIAL_PRODUCTS if previously pointing to old/external links
        return parsed.map(p => {
          const fresh = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if (fresh && (!p.image || p.image.includes('unsplash.com'))) {
            return { ...p, image: fresh.image };
          }
          return p;
        });
      }
      // Migrate from v2 or v1 if needed
      const oldSaved = localStorage.getItem('mm_products_v2');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        const migrated = parsed.map(p => {
          const fresh = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          return fresh ? { ...p, image: fresh.image } : p;
        });
        localStorage.setItem('mm_products_v3', JSON.stringify(migrated));
        return migrated;
      }
      localStorage.removeItem('mm_products_v1');
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Registered Users state (persisted in localStorage)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_users_v1');
      let loaded = saved ? JSON.parse(saved) : INITIAL_USERS;

      // Ensure admin with password 'admin123' exists even if older data was saved in localStorage
      const adminExists = loaded.some(u => u.email.toLowerCase() === 'admin' && u.password === 'admin123');
      if (!adminExists) {
        const nonAdmins = loaded.filter(u => u.role !== 'admin' && !u.email.toLowerCase().startsWith('admin'));
        const adminAccounts = INITIAL_USERS.filter(u => u.role === 'admin');
        loaded = [...adminAccounts, ...nonAdmins];
      }

      return loaded.map(u => ({
        ...u,
        role: u.role === 'admin' ? 'admin' : 'buyer'
      }));
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Logged-in User Session (starts logged out)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_current_user_v1');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        role: parsed.role === 'admin' ? 'admin' : 'buyer'
      };
    } catch {
      return null;
    }
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

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

  // =========================================================
  // WEBSITE BUILDER, CMS, NAVIGATION, MEDIA & INVENTORY LEDGER
  // =========================================================
  const [customPages, setCustomPages] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_custom_pages_v1');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOM_PAGES;
    } catch {
      return INITIAL_CUSTOM_PAGES;
    }
  });

  const [navigationConfig, setNavigationConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_navigation_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.footerNav) {
          parsed.footerNav = parsed.footerNav.map(item => 
            (item.label === 'Sampaloc Store Location' || item.label === 'San Pablo Store Location')
              ? { ...item, label: 'Banago Store Location' } 
              : item
          );
        }
        return parsed;
      }
      return INITIAL_NAV_CONFIG;
    } catch {
      return INITIAL_NAV_CONFIG;
    }
  });

  const [mediaLibrary, setMediaLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_media_library_v1');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_LIBRARY;
    } catch {
      return INITIAL_MEDIA_LIBRARY;
    }
  });

  const [inventoryLedger, setInventoryLedger] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_inventory_ledger_v1');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY_LEDGER;
    } catch {
      return INITIAL_INVENTORY_LEDGER;
    }
  });

  const [promotionsList, setPromotionsList] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_promotions_v1');
      return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS_LIST;
    } catch {
      return INITIAL_PROMOTIONS_LIST;
    }
  });

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState('home');
  const [activeCustomPageSlug, setActiveCustomPageSlug] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mm_products_v3', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_users_v1', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('mm_current_user_v1', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('mm_current_user_v1');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_orders_v1', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_inquiries_v1', JSON.stringify(serviceInquiries));
    } catch (e) {
      console.error(e);
    }
  }, [serviceInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_custom_pages_v1', JSON.stringify(customPages));
    } catch (e) {
      console.error(e);
    }
  }, [customPages]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_navigation_v1', JSON.stringify(navigationConfig));
    } catch (e) {
      console.error(e);
    }
  }, [navigationConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_media_library_v1', JSON.stringify(mediaLibrary));
    } catch (e) {
      console.error(e);
    }
  }, [mediaLibrary]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_inventory_ledger_v1', JSON.stringify(inventoryLedger));
    } catch (e) {
      console.error(e);
    }
  }, [inventoryLedger]);

  useEffect(() => {
    try {
      localStorage.setItem('mm_promotions_v1', JSON.stringify(promotionsList));
    } catch (e) {
      console.error(e);
    }
  }, [promotionsList]);

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === prev?.id ? null : prev));
    }, 3500);
  };

  // ==========================================
  // AUTHENTICATION & ROLE MANAGEMENT
  // ==========================================
  const login = (emailOrUsername, password) => {
    const trimmed = emailOrUsername.trim().toLowerCase();
    
    // Find user by exact email/username OR if entering 'admin' for an admin account
    let user = users.find(u => u.email.toLowerCase() === trimmed);
    if (!user && (trimmed === 'admin' || trimmed === 'admin@mamamoinkprint.ph')) {
      user = users.find(u => u.role === 'admin' || u.email.toLowerCase().includes('admin'));
    }

    if (!user) {
      return { success: false, message: 'No registered account found with this email or username.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const normalizedUser = {
      ...user,
      role: user.role === 'admin' ? 'admin' : 'buyer'
    };

    setCurrentUser(normalizedUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${normalizedUser.name}! (${normalizedUser.role.toUpperCase()})`, 'success');
    return { success: true, user: normalizedUser };
  };

  const register = (userData) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      role: 'buyer', // Automatically assigned as buyer
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      phone: userData.phone || '0917-000-0000',
      affiliation: userData.affiliation || '',
      idNumber: userData.idNumber || '',
      joinedDate: new Date().toISOString().split('T')[0],
      savedAddress: userData.savedAddress || 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002',
      ordersCount: 0
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Account created! Logged in as ${newUser.name} (BUYER)`, 'success');
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out from your account.', 'info');
    if (activeTab === 'admin') {
      setActiveTab('home');
      setActiveCustomPageSlug(null);
    }
  };

  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    showToast('Profile information updated successfully.', 'success');
  };

  // ==========================================
  // NAVIGATION ROUTING
  // ==========================================
  const navigateTo = (destination, params = {}) => {
    if (!destination) destination = 'home';

    if (destination.startsWith('page:')) {
      const slug = destination.replace('page:', '');
      setActiveCustomPageSlug(slug);
      setActiveTab('custom_page');
    } else {
      // Check if destination matches any published custom page slug
      const matchingPage = customPages.find(p => p.slug === destination && p.status === 'published');
      if (matchingPage) {
        setActiveCustomPageSlug(destination);
        setActiveTab('custom_page');
      } else {
        setActiveTab(destination);
        setActiveCustomPageSlug(null);
      }
    }

    if (params.category) setSelectedCategory(params.category);
    if (params.trackingId) setTrackingOrderNumber(params.trackingId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // CART OPERATIONS
  // ==========================================
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
    // Check dynamic promotionsList first
    const dynamicPromo = promotionsList.find(p => p.code === trimmed && p.active);
    if (dynamicPromo) {
      setAppliedPromo(dynamicPromo);
      showToast(`Promo code "${trimmed}" applied: ${dynamicPromo.title}!`, 'success');
      return { success: true, promo: dynamicPromo };
    }

    // Fallback to static PROMOTIONS
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
    if (appliedPromo.discountType === 'percentage' || appliedPromo.discountPercentage) {
      const pct = appliedPromo.discountValue || appliedPromo.discountPercentage || 15;
      cartDiscount = Math.round(cartSubtotal * (pct / 100));
    } else if (appliedPromo.discountType === 'fixed' || appliedPromo.discountAmount) {
      cartDiscount = appliedPromo.discountValue || appliedPromo.discountAmount || 50;
    } else if (appliedPromo.code === 'STUDENT15') {
      cartDiscount = Math.round(cartSubtotal * 0.15);
    } else if (appliedPromo.code === 'FACULTYPACK') {
      cartDiscount = 150;
    } else if (appliedPromo.code === 'THESIS2026') {
      cartDiscount = 200;
    }
  }

  // ==========================================
  // ORDER PLACEMENT & INVENTORY LEDGER
  // ==========================================
  const placeOrder = (orderData) => {
    const newOrderId = `MM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      userId: currentUser ? currentUser.id : null,
      status: 'Order Placed',
      statusNotes: orderData.fulfillment === 'pickup' 
        ? 'Order verified. Store counter is packaging your items for collection.'
        : 'Order verified. Packaging scheduled for local courier pickup.',
      ...orderData
    };

    // Update stock levels and record inventory movements to ledger
    const ledgerEntries = [];
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = orderData.items.find(ci => ci.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          ledgerEntries.push({
            id: `led-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            productId: p.id,
            productName: p.name,
            changeAmount: -cartItem.quantity,
            previousStock: p.stock,
            newStock,
            reason: `Online Customer Order #${newOrderId} (${orderData.fulfillment === 'pickup' ? 'Store Pickup' : 'Delivery'})`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            user: currentUser?.name || 'Customer Checkout'
          });
          return { ...p, stock: newStock };
        }
        return p;
      });
    });

    if (ledgerEntries.length > 0) {
      setInventoryLedger(prev => [...ledgerEntries, ...prev]);
    }

    // Increment promotion usage if applicable
    if (appliedPromo) {
      setPromotionsList(prev => prev.map(p => {
        if (p.code === appliedPromo.code) {
          return { ...p, usageCount: (p.usageCount || 0) + 1 };
        }
        return p;
      }));
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

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

  // Stock Adjustment with Required Ledger Reason (Section 5)
  const adjustStockWithReason = (productId, newStock, changeDelta, reason, operatorName) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: newStock };
      }
      return p;
    }));

    const ledgerItem = {
      id: `led-${Date.now()}`,
      productId,
      productName: product.name,
      changeAmount: changeDelta,
      previousStock: product.stock,
      newStock,
      reason,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: operatorName || currentUser?.name || 'Store Admin'
    };

    setInventoryLedger(prev => [ledgerItem, ...prev]);
    showToast(`Stock updated for "${product.name}". Recorded to audit ledger.`, 'success');
  };

  // Product Operations
  const addProduct = (productData) => {
    const newProd = {
      ...productData,
      id: `prod-${Date.now()}`,
      sku: productData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts(prev => [newProd, ...prev]);

    // Record initial stock entry
    const ledgerItem = {
      id: `led-${Date.now()}`,
      productId: newProd.id,
      productName: newProd.name,
      changeAmount: +newProd.stock,
      previousStock: 0,
      newStock: newProd.stock,
      reason: 'Initial Product Catalog Creation',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: currentUser?.name || 'Store Admin'
    };
    setInventoryLedger(prev => [ledgerItem, ...prev]);

    showToast(`Product "${productData.name}" added to store inventory!`, 'success');
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updatedData } : p))
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product removed from store catalog', 'info');
  };

  // Printing Inquiries
  const submitServiceInquiry = (inquiryData) => {
    const newInquiryId = `SRV-INQ-${Math.floor(100 + Math.random() * 900)}`;
    const newInq = {
      id: newInquiryId,
      date: new Date().toISOString(),
      status: 'In Review',
      ...inquiryData
    };
    setServiceInquiries(prev => [newInq, ...prev]);
    showToast('Printing request submitted! Our production desk will review your specifications.', 'success');
    return newInq;
  };

  const updateInquiryStatus = (inquiryId, newStatus) => {
    setServiceInquiries(prev =>
      prev.map(inq => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
    showToast(`Inquiry ${inquiryId} marked as "${newStatus}"`, 'info');
  };

  // ==========================================
  // WEBSITE BUILDER & CMS METHODS (Section 7)
  // ==========================================
  const saveCustomPage = (pageData) => {
    const existingIndex = customPages.findIndex(p => p.id === pageData.id || p.slug === pageData.slug);
    let updatedList;
    if (existingIndex >= 0) {
      updatedList = customPages.map((p, idx) => idx === existingIndex ? { ...p, ...pageData } : p);
    } else {
      updatedList = [pageData, ...customPages];
    }
    setCustomPages(updatedList);

    // Sync navigation if requested
    if (pageData.showInNav) {
      setNavigationConfig(prev => {
        const exists = prev.headerNav.some(n => n.path === pageData.slug);
        if (!exists) {
          const newItem = {
            id: `nav-${Date.now()}`,
            label: pageData.title,
            path: pageData.slug,
            isCustom: true,
            visible: true,
            order: prev.headerNav.length + 1
          };
          return { ...prev, headerNav: [...prev.headerNav, newItem] };
        }
        return prev;
      });
    }

    showToast(`Page "${pageData.title}" saved successfully (${pageData.status.toUpperCase()})!`, 'success');
  };

  const duplicateCustomPage = (pageId) => {
    const target = customPages.find(p => p.id === pageId);
    if (!target) return;
    const cloned = {
      ...JSON.parse(JSON.stringify(target)),
      id: `page-${Date.now()}`,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCustomPages([cloned, ...customPages]);
    showToast(`Duplicated page as draft: "${cloned.title}"`, 'info');
  };

  const deleteCustomPage = (pageId) => {
    const target = customPages.find(p => p.id === pageId);
    setCustomPages(prev => prev.filter(p => p.id !== pageId));
    if (target) {
      // Remove from navigation config if linked
      setNavigationConfig(prev => ({
        headerNav: prev.headerNav.filter(n => n.path !== target.slug),
        footerNav: prev.footerNav.filter(n => n.path !== target.slug)
      }));
    }
    showToast('Page removed from website builder.', 'info');
  };

  const publishCustomPage = (pageId) => {
    setCustomPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          status: 'published',
          publishedAt: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
    showToast('Page published live to storefront!', 'success');
  };

  const unpublishCustomPage = (pageId) => {
    setCustomPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return { ...p, status: 'draft' };
      }
      return p;
    }));
    showToast('Page unpublished and reverted to draft status.', 'info');
  };

  const updateNavigationConfig = (type, items) => {
    setNavigationConfig(prev => ({
      ...prev,
      [type]: items
    }));
  };

  const addMediaItem = (mediaItem) => {
    setMediaLibrary(prev => [mediaItem, ...prev]);
    showToast(`Asset "${mediaItem.name}" uploaded to Media Library!`, 'success');
  };

  const deleteMediaItem = (mediaId) => {
    setMediaLibrary(prev => prev.filter(m => m.id !== mediaId));
    showToast('Asset removed from Media Library.', 'info');
  };

  // Promotions Management (Section 8)
  const addPromotion = (promo) => {
    const newPromo = {
      ...promo,
      id: `promo-${Date.now()}`,
      code: promo.code.trim().toUpperCase(),
      usageCount: 0
    };
    setPromotionsList(prev => [newPromo, ...prev]);
    showToast(`Promotion code "${newPromo.code}" created!`, 'success');
  };

  const deletePromotion = (promoId) => {
    setPromotionsList(prev => prev.filter(p => p.id !== promoId));
    showToast('Promotion code deleted.', 'info');
  };

  const togglePromotion = (promoId) => {
    setPromotionsList(prev => prev.map(p => {
      if (p.id === promoId) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
    showToast('Promotion status toggled.', 'info');
  };

  // Reset helper
  const resetToDefaultData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setServiceInquiries(INITIAL_SERVICE_INQUIRIES);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setCart([]);
    setCustomPages(INITIAL_CUSTOM_PAGES);
    setNavigationConfig(INITIAL_NAV_CONFIG);
    setMediaLibrary(INITIAL_MEDIA_LIBRARY);
    setInventoryLedger(INITIAL_INVENTORY_LEDGER);
    setPromotionsList(INITIAL_PROMOTIONS_LIST);
    showToast('System data reset to verified retail defaults.', 'info');
    setActiveTab('home');
    setActiveCustomPageSlug(null);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        serviceInquiries,
        promotions: PROMOTIONS,
        promotionsList,
        storeInfo: STORE_INFO,
        users,
        currentUser,
        isAuthModalOpen,
        authModalMode,
        activeTab,
        activeCustomPageSlug,
        customPages,
        navigationConfig,
        mediaLibrary,
        inventoryLedger,
        selectedCategory,
        searchQuery,
        cart,
        setCart,
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
        setActiveCustomPageSlug,
        setSelectedCategory,
        setSearchQuery,
        setIsCartOpen,
        setQuickViewProduct,
        setTrackingOrderNumber,
        setIsAuthModalOpen,
        setAuthModalMode,
        login,
        register,
        logout,
        updateUserProfile,
        navigateTo,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        updateOrderStatus,
        adjustStockWithReason,
        addProduct,
        updateProduct,
        deleteProduct,
        submitServiceInquiry,
        updateInquiryStatus,
        saveCustomPage,
        duplicateCustomPage,
        deleteCustomPage,
        publishCustomPage,
        unpublishCustomPage,
        updateNavigationConfig,
        addMediaItem,
        deleteMediaItem,
        addPromotion,
        deletePromotion,
        togglePromotion,
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
