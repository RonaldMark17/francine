import { 
  getAllData, 
  saveOrderToDb, 
  updateOrderStatusInDb, 
  saveProductToDb, 
  deleteProductFromDb, 
  adjustProductStockInDb, 
  saveUserToDb, 
  authenticateUser,
  registerUser,
  logoutSession,
  verifySessionToken,
  getSecurityAuditLogs,
  savePromotionToDb, 
  deletePromotionFromDb, 
  togglePromotionInDb, 
  saveCustomPageToDb, 
  deleteCustomPageFromDb, 
  saveNavigationToDb, 
  saveInquiryToDb, 
  updateInquiryStatusInDb,
  resetDatabase,
  initDatabase
} from './db.js';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_SERVICE_INQUIRIES, 
  PROMOTIONS, 
  STORE_INFO 
} from '../src/data/initialData.js';
import { INITIAL_USERS } from '../src/data/authUsers.js';
import { 
  INITIAL_NAV_CONFIG, 
  INITIAL_CUSTOM_PAGES, 
  INITIAL_MEDIA_LIBRARY, 
  INITIAL_INVENTORY_LEDGER, 
  INITIAL_PROMOTIONS_LIST 
} from '../src/data/builderData.js';

// Ensure DB is initialized
initDatabase({
  users: INITIAL_USERS,
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS,
  serviceInquiries: INITIAL_SERVICE_INQUIRIES,
  promotions: PROMOTIONS,
  promotionsList: INITIAL_PROMOTIONS_LIST,
  inventoryLedger: INITIAL_INVENTORY_LEDGER,
  customPages: INITIAL_CUSTOM_PAGES,
  navigationConfig: INITIAL_NAV_CONFIG,
  mediaLibrary: INITIAL_MEDIA_LIBRARY,
  storeInfo: STORE_INFO
});

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function sqliteApiMiddleware() {
  return async (req, res, next) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (!pathname.startsWith('/api/')) {
      return next();
    }

    try {
      // 1. Health check
      if (pathname === '/api/health' && req.method === 'GET') {
        return sendJson(res, 200, { status: 'ok', engine: 'SQLite 3 (better-sqlite3)' });
      }

      // 2. Initial / All Data
      if (pathname === '/api/all-data' && req.method === 'GET') {
        const data = getAllData();
        return sendJson(res, 200, data);
      }

      // 3. Orders / Transactions
      if (pathname === '/api/orders' && req.method === 'POST') {
        const body = await parseBody(req);
        const saved = saveOrderToDb(body);
        return sendJson(res, 201, saved);
      }

      if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && (req.method === 'PUT' || req.method === 'POST')) {
        const parts = pathname.split('/');
        const orderId = parts[3];
        const body = await parseBody(req);
        updateOrderStatusInDb(orderId, body.status, body.notes);
        return sendJson(res, 200, { success: true, orderId, status: body.status });
      }

      // 4. Products
      if (pathname === '/api/products' && req.method === 'POST') {
        const body = await parseBody(req);
        saveProductToDb(body);
        return sendJson(res, 201, body);
      }

      if (pathname.startsWith('/api/products/') && pathname.endsWith('/adjust-stock') && req.method === 'POST') {
        const parts = pathname.split('/');
        const productId = parts[3];
        const body = await parseBody(req);
        const result = adjustProductStockInDb({ productId, ...body });
        return sendJson(res, 200, result);
      }

      if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
        const parts = pathname.split('/');
        const productId = parts[3];
        const body = await parseBody(req);
        saveProductToDb({ ...body, id: productId });
        return sendJson(res, 200, { ...body, id: productId });
      }

      if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
        const parts = pathname.split('/');
        const productId = parts[3];
        deleteProductFromDb(productId);
        return sendJson(res, 200, { success: true, deletedId: productId });
      }

      // 5. Hardened Authentication & User Management
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await parseBody(req);
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
        const result = authenticateUser(body.email || body.username, body.password, ip);
        if (!result.success) {
          return sendJson(res, 401, result);
        }
        return sendJson(res, 200, result);
      }

      if (pathname === '/api/auth/register' && req.method === 'POST') {
        const body = await parseBody(req);
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
        const result = registerUser(body, ip);
        if (!result.success) {
          return sendJson(res, 400, result);
        }
        return sendJson(res, 201, result);
      }

      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        const body = await parseBody(req);
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
        const result = logoutSession(body.token, ip);
        return sendJson(res, 200, result);
      }

      if (pathname === '/api/auth/verify' && req.method === 'GET') {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace(/^Bearer\s+/i, '') || url.searchParams.get('token');
        const user = verifySessionToken(token);
        if (!user) {
          return sendJson(res, 401, { success: false, message: 'Invalid or expired session token.' });
        }
        return sendJson(res, 200, { success: true, user });
      }

      if (pathname === '/api/security/audit-logs' && req.method === 'GET') {
        const logs = getSecurityAuditLogs(100);
        return sendJson(res, 200, { success: true, logs });
      }

      if (pathname === '/api/users' && req.method === 'POST') {
        const body = await parseBody(req);
        const saved = saveUserToDb(body);
        return sendJson(res, 201, saved);
      }

      if (pathname.startsWith('/api/users/') && req.method === 'PUT') {
        const parts = pathname.split('/');
        const userId = parts[3];
        const body = await parseBody(req);
        const saved = saveUserToDb({ ...body, id: userId });
        return sendJson(res, 200, saved);
      }

      // 6. Promotions
      if (pathname === '/api/promotions' && req.method === 'POST') {
        const body = await parseBody(req);
        savePromotionToDb(body);
        return sendJson(res, 201, body);
      }

      if (pathname.startsWith('/api/promotions/') && pathname.endsWith('/toggle') && req.method === 'POST') {
        const parts = pathname.split('/');
        const id = parts[3];
        togglePromotionInDb(id);
        return sendJson(res, 200, { success: true, toggledId: id });
      }

      if (pathname.startsWith('/api/promotions/') && req.method === 'DELETE') {
        const parts = pathname.split('/');
        const id = parts[3];
        deletePromotionFromDb(id);
        return sendJson(res, 200, { success: true, deletedId: id });
      }

      // 7. Custom Pages
      if (pathname === '/api/custom-pages' && req.method === 'POST') {
        const body = await parseBody(req);
        saveCustomPageToDb(body);
        return sendJson(res, 201, body);
      }

      if (pathname.startsWith('/api/custom-pages/') && req.method === 'DELETE') {
        const parts = pathname.split('/');
        const id = parts[3];
        deleteCustomPageFromDb(id);
        return sendJson(res, 200, { success: true, deletedId: id });
      }

      // 8. Navigation
      if (pathname === '/api/navigation' && req.method === 'PUT') {
        const body = await parseBody(req);
        saveNavigationToDb(body);
        return sendJson(res, 200, { success: true });
      }

      // 9. Printing Service Inquiries
      if (pathname === '/api/inquiries' && req.method === 'POST') {
        const body = await parseBody(req);
        saveInquiryToDb(body);
        return sendJson(res, 201, body);
      }

      if (pathname.startsWith('/api/inquiries/') && pathname.endsWith('/status') && (req.method === 'PUT' || req.method === 'POST')) {
        const parts = pathname.split('/');
        const id = parts[3];
        const body = await parseBody(req);
        updateInquiryStatusInDb(id, body.status);
        return sendJson(res, 200, { success: true, id, status: body.status });
      }

      // 10. Database Reset
      if (pathname === '/api/reset' && req.method === 'POST') {
        const data = resetDatabase({
          users: INITIAL_USERS,
          products: INITIAL_PRODUCTS,
          orders: INITIAL_ORDERS,
          serviceInquiries: INITIAL_SERVICE_INQUIRIES,
          promotions: PROMOTIONS,
          promotionsList: INITIAL_PROMOTIONS_LIST,
          inventoryLedger: INITIAL_INVENTORY_LEDGER,
          customPages: INITIAL_CUSTOM_PAGES,
          navigationConfig: INITIAL_NAV_CONFIG,
          mediaLibrary: INITIAL_MEDIA_LIBRARY,
          storeInfo: STORE_INFO
        });
        return sendJson(res, 200, { success: true, message: 'SQLite database reset to initial seed data', data });
      }

      return sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      console.error('SQLite API Error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  };
}

export function viteSqlitePlugin() {
  return {
    name: 'vite-plugin-sqlite-api',
    configureServer(server) {
      server.middlewares.use(sqliteApiMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(sqliteApiMiddleware());
    }
  };
}
