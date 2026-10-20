// SQLite Client API Service
// Connects React frontend directly to the SQLite backend

const API_BASE = '/api';

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`SQLite API request to ${url} failed:`, err.message);
    throw err;
  }
}

export const sqliteApi = {
  // Check health and connection to SQLite
  async checkHealth() {
    return await fetchJson(`${API_BASE}/health`);
  },

  // Fetch all tables from SQLite
  async getAllData() {
    return await fetchJson(`${API_BASE}/all-data`);
  },

  // Orders / Transactions
  async createOrder(orderPayload) {
    return await fetchJson(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  },

  async updateOrderStatus(orderId, status, notes = '') {
    return await fetchJson(`${API_BASE}/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },

  // Products
  async saveProduct(product) {
    return await fetchJson(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(product)
    });
  },

  async deleteProduct(productId) {
    return await fetchJson(`${API_BASE}/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    });
  },

  async adjustStock({ productId, changeAmount, reason, user }) {
    return await fetchJson(`${API_BASE}/products/${encodeURIComponent(productId)}/adjust-stock`, {
      method: 'POST',
      body: JSON.stringify({ changeAmount, reason, user })
    });
  },

  // Hardened Authentication & User Security
  async login(emailOrUsername, password) {
    return await fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: emailOrUsername, password })
    });
  },

  async register(userData) {
    return await fetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async logout(token) {
    return await fetchJson(`${API_BASE}/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },

  async verifySession(token) {
    return await fetchJson(`${API_BASE}/auth/verify?token=${encodeURIComponent(token)}`);
  },

  async getSecurityAuditLogs() {
    return await fetchJson(`${API_BASE}/security/audit-logs`);
  },

  // Users
  async saveUser(user) {
    return await fetchJson(`${API_BASE}/users`, {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  // Promotions
  async savePromotion(promo) {
    return await fetchJson(`${API_BASE}/promotions`, {
      method: 'POST',
      body: JSON.stringify(promo)
    });
  },

  async deletePromotion(promoId) {
    return await fetchJson(`${API_BASE}/promotions/${encodeURIComponent(promoId)}`, {
      method: 'DELETE'
    });
  },

  async togglePromotion(promoId) {
    return await fetchJson(`${API_BASE}/promotions/${encodeURIComponent(promoId)}/toggle`, {
      method: 'POST'
    });
  },

  // Custom Pages
  async saveCustomPage(page) {
    return await fetchJson(`${API_BASE}/custom-pages`, {
      method: 'POST',
      body: JSON.stringify(page)
    });
  },

  async deleteCustomPage(pageId) {
    return await fetchJson(`${API_BASE}/custom-pages/${encodeURIComponent(pageId)}`, {
      method: 'DELETE'
    });
  },

  // Navigation
  async saveNavigation(navConfig) {
    return await fetchJson(`${API_BASE}/navigation`, {
      method: 'PUT',
      body: JSON.stringify(navConfig)
    });
  },

  // Service Inquiries
  async getInquiries() {
    return await fetchJson(`${API_BASE}/inquiries`);
  },

  async createInquiry(inquiry) {
    return await fetchJson(`${API_BASE}/inquiries`, {
      method: 'POST',
      body: JSON.stringify(inquiry)
    });
  },

  async updateInquiryStatus(inquiryId, status) {
    return await fetchJson(`${API_BASE}/inquiries/${encodeURIComponent(inquiryId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Media Library
  async saveMediaItem(mediaItem) {
    return await fetchJson(`${API_BASE}/media`, {
      method: 'POST',
      body: JSON.stringify(mediaItem)
    });
  },

  async deleteMediaItem(mediaId) {
    return await fetchJson(`${API_BASE}/media/${encodeURIComponent(mediaId)}`, {
      method: 'DELETE'
    });
  },

  // Promotion Usage Tracking
  async incrementPromoUsage(promoId) {
    return await fetchJson(`${API_BASE}/promotions/${encodeURIComponent(promoId)}/increment-usage`, {
      method: 'POST'
    });
  },

  // Database Reset
  async resetDatabase() {
    return await fetchJson(`${API_BASE}/reset`, {
      method: 'POST'
    });
  }
};
