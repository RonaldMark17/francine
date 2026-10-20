import { printRequestToOrder } from '../src/utils/printRequest.js';
import Database from 'better-sqlite3';
import { getAccountReference } from '../src/utils/accountReference.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { 
  hashPassword, 
  verifyPassword, 
  sanitizeUser, 
  generateToken, 
  validatePasswordPolicy, 
  SECURITY_EVENTS,
  sanitizeString,
  sanitizeEmail 
} from './security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../database.sqlite');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('secure_delete = ON'); // Overwrites deleted data with zeroes for disk security
db.pragma('trusted_schema = OFF'); // Hardens SQLite against untrusted schema exploits
db.pragma('cell_size_check = ON'); // Guards against btree boundary corruption exploits

export function initDatabase(initialData = {}) {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'buyer',
      affiliation TEXT,
      idNumber TEXT,
      joinedDate TEXT,
      savedAddress TEXT,
      ordersCount INTEGER DEFAULT 0
    );
  `);

  // 2. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      originalPrice REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      isFeatured INTEGER DEFAULT 0,
      isDiscounted INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviewsCount INTEGER DEFAULT 0,
      description TEXT,
      features TEXT, -- JSON array
      sku TEXT,
      image TEXT,
      fallbackCategory TEXT
    );
  `);

  // 3. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      userId TEXT,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      customerPhone TEXT,
      customerType TEXT,
      fulfillment TEXT NOT NULL DEFAULT 'pickup',
      pickupLocation TEXT,
      pickupTimeSlot TEXT,
      deliveryAddress TEXT,
      deliveryNotes TEXT,
      paymentMethod TEXT,
      status TEXT NOT NULL DEFAULT 'Order Placed',
      statusNotes TEXT,
      subtotal REAL NOT NULL DEFAULT 0,
      discountAmount REAL NOT NULL DEFAULT 0,
      appliedPromoCode TEXT,
      deliveryFee REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0,
      notes TEXT,
      rawItems TEXT -- JSON array of items
    );
  `);

  // 4. Order Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      productId TEXT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      sku TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // 5. Service Inquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_inquiries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      clientName TEXT NOT NULL,
      clientPhone TEXT,
      clientEmail TEXT,
      serviceType TEXT NOT NULL,
      pageCount INTEGER DEFAULT 1,
      paperType TEXT,
      bindingDetails TEXT,
      quantity INTEGER DEFAULT 1,
      estimatedCost REAL NOT NULL DEFAULT 0,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'In Review'
    );
  `);

  // 6. Promotions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      discountType TEXT DEFAULT 'percentage',
      discountValue REAL DEFAULT 15,
      minSpend REAL DEFAULT 0,
      startDate TEXT,
      endDate TEXT,
      active INTEGER DEFAULT 1,
      usageCount INTEGER DEFAULT 0,
      usageLimit INTEGER,
      usage_limit INTEGER,
      times_used INTEGER DEFAULT 0,
      tagline TEXT,
      condition TEXT,
      badge TEXT,
      accentColor TEXT
    );
  `);

  // Add usageLimit, usage_limit, and times_used columns if missing (migration for existing databases)
  try {
    db.exec(`ALTER TABLE promotions ADD COLUMN usageLimit INTEGER`);
  } catch { /* column already exists */ }

  try {
    db.exec(`ALTER TABLE promotions ADD COLUMN usage_limit INTEGER`);
  } catch { /* column already exists */ }
  try {
    db.exec(`ALTER TABLE promotions ADD COLUMN times_used INTEGER DEFAULT 0`);
  } catch { /* column already exists */ }

  // 7. Inventory Ledger Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_ledger (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      productName TEXT NOT NULL,
      changeAmount INTEGER NOT NULL,
      previousStock INTEGER NOT NULL,
      newStock INTEGER NOT NULL,
      reason TEXT NOT NULL,
      date TEXT NOT NULL,
      user TEXT
    );
  `);

  // 8. Custom Pages Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS custom_pages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      author TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      publishedAt TEXT,
      showInNav INTEGER DEFAULT 1,
      showInFooter INTEGER DEFAULT 1,
      components TEXT, -- JSON array
      systemRoute TEXT
    );
  `);
  try {
    db.exec(`ALTER TABLE custom_pages ADD COLUMN systemRoute TEXT`);
  } catch { /* column already exists */ }

  if (!db.prepare('PRAGMA table_info(custom_pages)').all().some(column => column.name === 'nativeContent')) {
    db.exec(`ALTER TABLE custom_pages ADD COLUMN nativeContent TEXT DEFAULT '{}'`);
  }

  // 9. Navigation Config Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS navigation_config (
      navKey TEXT PRIMARY KEY,
      items TEXT NOT NULL -- JSON array
    );
  `);

  // 10. Media Library Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_library (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT,
      size TEXT,
      uploadDate TEXT,
      alt TEXT,
      category TEXT
    );
  `);

  // Add category column if missing (migration for existing databases)
  try {
    db.exec(`ALTER TABLE media_library ADD COLUMN category TEXT`);
  } catch { /* column already exists */ }

  // 11. Store Info Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS store_info (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL -- JSON object
    );
  `);

  // 12. Normalized Categories Table (3NF)
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      displayOrder INTEGER DEFAULT 0
    );
  `);

  // 13. Normalized Product Features Table (1NF atomic values)
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT NOT NULL,
      featureText TEXT NOT NULL,
      displayOrder INTEGER DEFAULT 0,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // 14. Normalized Order Status History Table (Audit & lifecycle tracking)
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      changedAt TEXT NOT NULL,
      changedBy TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // 15. Normalized Custom Page Components Table (1NF CMS components)
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_components (
      id TEXT PRIMARY KEY,
      pageId TEXT NOT NULL,
      type TEXT NOT NULL,
      orderIndex INTEGER DEFAULT 0,
      data TEXT NOT NULL,
      FOREIGN KEY (pageId) REFERENCES custom_pages(id) ON DELETE CASCADE
    );
  `);

  // 16. Security: User Sessions Table (Cryptographic 256-bit session tokens)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      createdAt TEXT NOT NULL,
      expiresAt TEXT NOT NULL,
      lastActive TEXT NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      isValid INTEGER DEFAULT 1,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 17. Security: Audit Logs Table (Tamper-evident activity logs)
  db.exec(`
    CREATE TABLE IF NOT EXISTS security_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventType TEXT NOT NULL,
      userId TEXT,
      ipAddress TEXT,
      details TEXT,
      timestamp TEXT NOT NULL,
      severity TEXT DEFAULT 'info'
    );
  `);

  // 18. Security: Brute-Force Rate Limits Table (Persistent protection)
  db.exec(`
    CREATE TABLE IF NOT EXISTS auth_rate_limits (
      identifier TEXT PRIMARY KEY,
      attemptsCount INTEGER DEFAULT 0,
      firstAttemptAt INTEGER NOT NULL,
      lockedUntil INTEGER
    );
  `);

  // Seed Data if tables are empty
  seedInitialData(initialData);

  // Upgrade any unhashed legacy user passwords to secure scrypt hashes
  upgradeExistingUserPasswords();

  // Populate & synchronize normalized relational tables
  syncNormalizedData();
  // Move legacy print requests atomically, preserving references and contact inquiries.
  db.transaction(() => {
    const requests = db.prepare("SELECT * FROM service_inquiries WHERE COALESCE(paperType, '') != 'Contact inquiry'").all();
    for (const request of requests) {
      if (!db.prepare('SELECT id FROM orders WHERE id = ?').get(request.id)) {
        saveOrderToDb(printRequestToOrder(request));
      }
      db.prepare('DELETE FROM service_inquiries WHERE id = ?').run(request.id);
    }
  })();
}

export function upgradeExistingUserPasswords() {
  const users = db.prepare('SELECT id, email, password FROM users').all();
  const updatePw = db.prepare('UPDATE users SET password = ? WHERE id = ?');
  const runTx = db.transaction(() => {
    for (const u of users) {
      if (!u.password.startsWith('scrypt$')) {
        const hashed = hashPassword(u.password);
        updatePw.run(hashed, u.id);
        recordAuditLog(SECURITY_EVENTS.PASSWORD_UPGRADED, u.id, '127.0.0.1', `Upgraded legacy password for ${u.email} to scrypt`, 'info');
      }
    }
  });
  runTx();
}

export function syncNormalizedData() {
  // 1. Sync Categories Table (3NF)
  const catCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
  if (catCount === 0) {
    const defaultCategories = [
      { id: 'stationery', name: 'School & Office Stationery', slug: 'stationery', description: 'Everyday student and office administrative essentials', displayOrder: 1 },
      { id: 'pens', name: 'Pens & Writing Instruments', slug: 'pens', description: 'Gel pens, ballpoints, fine-liners, highlighters, and pencils', displayOrder: 2 },
      { id: 'paper', name: 'Specialty Papers & Boards', slug: 'paper', description: 'Copier paper reams, cardstock, sticker papers, and specialty boards', displayOrder: 3 },
      { id: 'ink', name: 'Printer Inks & Cartridges', slug: 'ink', description: 'Authentic Epson, Canon, and HP bottles and toner supplies', displayOrder: 4 },
      { id: 'binding', name: 'Binding & Presentation', slug: 'binding', description: 'Thermal binding covers, spiral wire rings, and laminating film pouches', displayOrder: 5 },
      { id: 'equipment', name: 'Office Tools & Cutting', slug: 'equipment', description: 'Rotary trimmers, staplers, tape dispensers, and student calculators', displayOrder: 6 }
    ];

    const insertCat = db.prepare('INSERT OR IGNORE INTO categories (id, name, slug, description, displayOrder) VALUES (@id, @name, @slug, @description, @displayOrder)');
    const catTx = db.transaction((rows) => {
      for (const row of rows) insertCat.run(row);
    });
    catTx(defaultCategories);
  }

  // 2. Sync Product Features (1NF - Atomic normalized records)
  const featCount = db.prepare('SELECT COUNT(*) AS count FROM product_features').get().count;
  if (featCount === 0) {
    const products = db.prepare('SELECT id, features FROM products').all();
    const insertFeat = db.prepare('INSERT INTO product_features (productId, featureText, displayOrder) VALUES (?, ?, ?)');
    const featTx = db.transaction(() => {
      for (const p of products) {
        if (!p.features) continue;
        try {
          const list = JSON.parse(p.features);
          if (Array.isArray(list)) {
            list.forEach((f, idx) => {
              if (f && typeof f === 'string') {
                insertFeat.run(p.id, f.trim(), idx + 1);
              }
            });
          }
        } catch {}
      }
    });
    featTx();
  }

  // 3. Sync Custom Page Components (1NF - Relational CMS components)
  const compCount = db.prepare('SELECT COUNT(*) AS count FROM page_components').get().count;
  if (compCount === 0) {
    const pages = db.prepare('SELECT id, components FROM custom_pages').all();
    const insertComp = db.prepare('INSERT OR IGNORE INTO page_components (id, pageId, type, orderIndex, data) VALUES (?, ?, ?, ?, ?)');
    const compTx = db.transaction(() => {
      for (const p of pages) {
        if (!p.components) continue;
        try {
          const comps = JSON.parse(p.components);
          if (Array.isArray(comps)) {
            comps.forEach((c, idx) => {
              const compId = c.id || `comp-${p.id}-${idx}`;
              insertComp.run(compId, p.id, c.type || 'section', idx + 1, JSON.stringify(c.data || {}));
            });
          }
        } catch {}
      }
    });
    compTx();
  }

  // 4. Sync Order Status History (Audit lifecycle tracking)
  const historyCount = db.prepare('SELECT COUNT(*) AS count FROM order_status_history').get().count;
  if (historyCount === 0) {
    const orders = db.prepare('SELECT id, status, statusNotes, date FROM orders').all();
    const insertHist = db.prepare('INSERT INTO order_status_history (orderId, status, notes, changedAt, changedBy) VALUES (?, ?, ?, ?, ?)');
    const histTx = db.transaction(() => {
      for (const o of orders) {
        insertHist.run(o.id, o.status || 'Order Placed', o.statusNotes || 'Initial retail checkout registration', o.date || new Date().toISOString(), 'System');
      }
    });
    histTx();
  }

  // 5. Initial Security Audit Log Event
  const auditCount = db.prepare('SELECT COUNT(*) AS count FROM security_audit_logs').get().count;
  if (auditCount === 0) {
    recordAuditLog(
      'DATABASE_SECURITY_INITIALIZED',
      'system',
      '127.0.0.1',
      'SQLite database initialized with scrypt password hashing, timing-safe equality, foreign key enforcement, and normalized schema.',
      'info'
    );
  }
}

function seedInitialData({
  users = [],
  products = [],
  orders = [],
  serviceInquiries = [],
  promotions = [],
  promotionsList = [],
  inventoryLedger = [],
  customPages = [],
  navigationConfig = null,
  mediaLibrary = [],
  storeInfo = null
}) {
  // Seed Users
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount === 0 && users.length > 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password, name, phone, role, affiliation, idNumber, joinedDate, savedAddress, ordersCount)
      VALUES (@id, @email, @password, @name, @phone, @role, @affiliation, @idNumber, @joinedDate, @savedAddress, @ordersCount)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        const hashedPassword = row.password.startsWith('scrypt$') ? row.password : hashPassword(row.password);
        insertUser.run({
          id: row.id,
          email: row.email.toLowerCase(),
          password: hashedPassword,
          name: row.name,
          phone: row.phone || '',
          role: row.role || 'buyer',
          affiliation: row.affiliation || '',
          idNumber: row.idNumber || '',
          joinedDate: row.joinedDate || new Date().toISOString().split('T')[0],
          savedAddress: row.savedAddress || '',
          ordersCount: row.ordersCount || 0
        });
      }
    });
    insertMany(users);
  }

  // Seed Products
  const prodCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  if (prodCount === 0 && products.length > 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, category, price, originalPrice, stock, isFeatured, isDiscounted, rating, reviewsCount, description, features, sku, image, fallbackCategory)
      VALUES (@id, @name, @category, @price, @originalPrice, @stock, @isFeatured, @isDiscounted, @rating, @reviewsCount, @description, @features, @sku, @image, @fallbackCategory)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertProduct.run({
          id: row.id,
          name: row.name,
          category: row.category,
          price: row.price,
          originalPrice: row.originalPrice || row.price,
          stock: row.stock ?? 50,
          isFeatured: row.isFeatured ? 1 : 0,
          isDiscounted: row.isDiscounted ? 1 : 0,
          rating: row.rating || 5.0,
          reviewsCount: row.reviewsCount || 0,
          description: row.description || '',
          features: JSON.stringify(row.features || []),
          sku: row.sku || '',
          image: row.image || '',
          fallbackCategory: row.fallbackCategory || ''
        });
      }
    });
    insertMany(products);
  }

  // Seed Orders
  const orderCount = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
  if (orderCount === 0 && orders.length > 0) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, date, userId, customerName, customerEmail, customerPhone, customerType, fulfillment, pickupLocation, pickupTimeSlot, deliveryAddress, deliveryNotes, paymentMethod, status, statusNotes, subtotal, discountAmount, appliedPromoCode, deliveryFee, total, notes, rawItems)
      VALUES (@id, @date, @userId, @customerName, @customerEmail, @customerPhone, @customerType, @fulfillment, @pickupLocation, @pickupTimeSlot, @deliveryAddress, @deliveryNotes, @paymentMethod, @status, @statusNotes, @subtotal, @discountAmount, @appliedPromoCode, @deliveryFee, @total, @notes, @rawItems)
    `);
    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, productId, name, price, quantity, sku)
      VALUES (@orderId, @productId, @name, @price, @quantity, @sku)
    `);

    const insertManyOrders = db.transaction((rows) => {
      for (const row of rows) {
        insertOrder.run({
          id: row.id,
          date: row.date || new Date().toISOString(),
          userId: row.userId || null,
          customerName: row.customer?.name || row.name || 'Customer',
          customerEmail: row.customer?.email || row.email || '',
          customerPhone: row.customer?.phone || row.phone || '',
          customerType: row.customer?.type || 'Buyer',
          fulfillment: row.fulfillment || 'pickup',
          pickupLocation: row.pickupLocation || '',
          pickupTimeSlot: row.pickupTimeSlot || '',
          deliveryAddress: row.deliveryAddress || '',
          deliveryNotes: row.deliveryNotes || '',
          paymentMethod: row.paymentMethod || 'Cash on Pickup',
          status: row.status || 'Order Placed',
          statusNotes: row.statusNotes || '',
          subtotal: row.subtotal || row.total || 0,
          discountAmount: row.discountAmount || 0,
          appliedPromoCode: row.appliedPromoCode || null,
          deliveryFee: row.deliveryFee || 0,
          total: row.total || 0,
          notes: row.notes || '',
          rawItems: JSON.stringify(row.items || [])
        });

        for (const it of (row.items || [])) {
          insertItem.run({
            orderId: row.id,
            productId: it.id || '',
            name: it.name || '',
            price: it.price || 0,
            quantity: it.quantity || 1,
            sku: it.sku || ''
          });
        }
      }
    });
    insertManyOrders(orders);
  }

  // Seed Service Inquiries
  const inqCount = db.prepare('SELECT COUNT(*) AS count FROM service_inquiries').get().count;
  if (inqCount === 0 && serviceInquiries.length > 0) {
    const insertInquiry = db.prepare(`
      INSERT INTO service_inquiries (id, date, clientName, clientPhone, clientEmail, serviceType, pageCount, paperType, bindingDetails, quantity, estimatedCost, notes, status)
      VALUES (@id, @date, @clientName, @clientPhone, @clientEmail, @serviceType, @pageCount, @paperType, @bindingDetails, @quantity, @estimatedCost, @notes, @status)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertInquiry.run({
          id: row.id,
          date: row.date || new Date().toISOString(),
          clientName: row.clientName,
          clientPhone: row.clientPhone || '',
          clientEmail: row.clientEmail || '',
          serviceType: row.serviceType,
          pageCount: row.pageCount || 1,
          paperType: row.paperType || '',
          bindingDetails: row.bindingDetails || '',
          quantity: row.quantity || 1,
          estimatedCost: row.estimatedCost || 0,
          notes: row.notes || '',
          status: row.status || 'In Review'
        });
      }
    });
    insertMany(serviceInquiries);
  }

  // Seed Promotions
  const promoCount = db.prepare('SELECT COUNT(*) AS count FROM promotions').get().count;
  const combinedPromos = [...(promotionsList || []), ...(promotions || [])];
  const uniquePromos = [];
  const seenIds = new Set();
  const seenCodes = new Set();
  for (const p of combinedPromos) {
    const promoId = p.id || `promo-${p.code.toLowerCase()}`;
    const promoCode = p.code.trim().toUpperCase();
    if (!seenIds.has(promoId) && !seenCodes.has(promoCode)) {
      seenIds.add(promoId);
      seenCodes.add(promoCode);
      uniquePromos.push({ ...p, id: promoId, code: promoCode });
    }
  }

  if (promoCount === 0 && uniquePromos.length > 0) {
    const insertPromo = db.prepare(`
      INSERT OR REPLACE INTO promotions (id, code, title, description, discountType, discountValue, minSpend, startDate, endDate, active, usageCount, tagline, condition, badge, accentColor)
      VALUES (@id, @code, @title, @description, @discountType, @discountValue, @minSpend, @startDate, @endDate, @active, @usageCount, @tagline, @condition, @badge, @accentColor)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertPromo.run({
          id: row.id,
          code: row.code,
          title: row.title || row.code,
          description: row.description || '',
          discountType: row.discountType || 'percentage',
          discountValue: row.discountValue || row.discountPercentage || 15,
          minSpend: row.minSpend || 0,
          startDate: row.startDate || new Date().toISOString().split('T')[0],
          endDate: row.endDate || '2026-12-31',
          active: row.active !== false ? 1 : 0,
          usageCount: row.usageCount || 0,
          tagline: row.tagline || '',
          condition: row.condition || '',
          badge: row.badge || '',
          accentColor: row.accentColor || '#121212'
        });
      }
    });
    insertMany(uniquePromos);
  }

  // Seed Inventory Ledger
  const ledgerCount = db.prepare('SELECT COUNT(*) AS count FROM inventory_ledger').get().count;
  if (ledgerCount === 0 && inventoryLedger.length > 0) {
    const insertLedger = db.prepare(`
      INSERT INTO inventory_ledger (id, productId, productName, changeAmount, previousStock, newStock, reason, date, user)
      VALUES (@id, @productId, @productName, @changeAmount, @previousStock, @newStock, @reason, @date, @user)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertLedger.run({
          id: row.id,
          productId: row.productId,
          productName: row.productName,
          changeAmount: row.changeAmount,
          previousStock: row.previousStock,
          newStock: row.newStock,
          reason: row.reason,
          date: row.date,
          user: row.user || 'Store Manager'
        });
      }
    });
    insertMany(inventoryLedger);
  }

  // Seed Custom Pages
  const pageCount = db.prepare('SELECT COUNT(*) AS count FROM custom_pages').get().count;
  if (pageCount === 0 && customPages.length > 0) {
    const insertPage = db.prepare(`
      INSERT INTO custom_pages (id, title, slug, description, status, author, createdAt, updatedAt, publishedAt, showInNav, showInFooter, components)
      VALUES (@id, @title, @slug, @description, @status, @author, @createdAt, @updatedAt, @publishedAt, @showInNav, @showInFooter, @components)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertPage.run({
          id: row.id,
          title: row.title,
          slug: row.slug,
          description: row.description || '',
          status: row.status || 'draft',
          author: row.author || 'Store Manager',
          createdAt: row.createdAt || new Date().toISOString(),
          updatedAt: row.updatedAt || new Date().toISOString(),
          publishedAt: row.publishedAt || null,
          showInNav: row.showInNav !== false ? 1 : 0,
          showInFooter: row.showInFooter !== false ? 1 : 0,
          components: JSON.stringify(row.components || [])
        });
      }
    });
    insertMany(customPages);
  }

  // Seed Navigation Config
  const navCount = db.prepare('SELECT COUNT(*) AS count FROM navigation_config').get().count;
  if (navCount === 0 && navigationConfig) {
    const insertNav = db.prepare(`
      INSERT INTO navigation_config (navKey, items)
      VALUES (@navKey, @items)
    `);
    if (navigationConfig.headerNav) {
      insertNav.run({ navKey: 'headerNav', items: JSON.stringify(navigationConfig.headerNav) });
    }
    if (navigationConfig.footerNav) {
      insertNav.run({ navKey: 'footerNav', items: JSON.stringify(navigationConfig.footerNav) });
    }
  }

  // Seed Media Library
  const mediaCount = db.prepare('SELECT COUNT(*) AS count FROM media_library').get().count;
  if (mediaCount === 0 && mediaLibrary.length > 0) {
    const insertMedia = db.prepare(`
      INSERT INTO media_library (id, name, url, type, size, uploadDate, alt, category)
      VALUES (@id, @name, @url, @type, @size, @uploadDate, @alt, @category)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertMedia.run({
          id: row.id,
          name: row.name,
          url: row.url,
          type: row.type || 'image',
          size: row.size || '100 KB',
          uploadDate: row.uploadDate || row.uploadedAt || new Date().toISOString().split('T')[0],
          alt: row.alt || '',
          category: row.category || 'Uploads'
        });
      }
    });
    insertMany(mediaLibrary);
  }

  // Seed Store Info
  const infoCount = db.prepare('SELECT COUNT(*) AS count FROM store_info').get().count;
  if (infoCount === 0 && storeInfo) {
    db.prepare('INSERT INTO store_info (id, data) VALUES (1, ?)').run(JSON.stringify(storeInfo));
  }
}

// ==========================================
// SQLITE DATA ACCESSORS & OPERATIONS
// ==========================================

export function getAllData() {
  const users = db.prepare('SELECT id, email, name, phone, role, affiliation, idNumber, joinedDate, savedAddress, ordersCount FROM users').all();
  
  // Normalized Categories (3NF)
  const categories = db.prepare('SELECT * FROM categories ORDER BY displayOrder ASC').all();

  // Normalized Product Features (1NF)
  const featuresByProduct = {};
  try {
    const allFeatures = db.prepare('SELECT productId, featureText FROM product_features ORDER BY displayOrder ASC').all();
    for (const f of allFeatures) {
      if (!featuresByProduct[f.productId]) featuresByProduct[f.productId] = [];
      featuresByProduct[f.productId].push(f.featureText);
    }
  } catch {}

  const productsRaw = db.prepare('SELECT * FROM products').all();
  const products = productsRaw.map(p => ({
    ...p,
    isFeatured: Boolean(p.isFeatured),
    isDiscounted: Boolean(p.isDiscounted),
    features: (featuresByProduct[p.id] && featuresByProduct[p.id].length > 0)
      ? featuresByProduct[p.id] 
      : (p.features ? JSON.parse(p.features) : [])
  }));

  // Normalized Order Status History (Lifecycle tracking)
  const historyByOrder = {};
  try {
    const allHistory = db.prepare('SELECT * FROM order_status_history ORDER BY id ASC').all();
    for (const h of allHistory) {
      if (!historyByOrder[h.orderId]) historyByOrder[h.orderId] = [];
      historyByOrder[h.orderId].push(h);
    }
  } catch {}

  const ordersRaw = db.prepare('SELECT * FROM orders ORDER BY date DESC').all();
  const orders = ordersRaw.map(o => {
    // Relational items from order_items (1NF/2NF)
    let items = db.prepare('SELECT productId as id, name, price, quantity, sku FROM order_items WHERE orderId = ?').all(o.id);
    if ((!items || items.length === 0) && o.rawItems) {
      try { items = JSON.parse(o.rawItems); } catch { items = []; }
    }

    return {
      id: o.id,
      date: o.date,
      userId: o.userId,
      customer: {
        name: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        type: o.customerType
      },
      name: o.customerName,
      email: o.customerEmail,
      phone: o.customerPhone,
      fulfillment: o.fulfillment,
      pickupLocation: o.pickupLocation,
      pickupTimeSlot: o.pickupTimeSlot,
      deliveryAddress: o.deliveryAddress,
      deliveryNotes: o.deliveryNotes,
      paymentMethod: o.paymentMethod,
      status: o.status,
      statusNotes: o.statusNotes,
      subtotal: o.subtotal,
      discountAmount: o.discountAmount,
      appliedPromoCode: o.appliedPromoCode,
      deliveryFee: o.deliveryFee,
      total: o.total,
      notes: o.notes,
      items,
      statusHistory: historyByOrder[o.id] || []
    };
  });

  const inquiries = db.prepare('SELECT * FROM service_inquiries ORDER BY date DESC').all();
  
  const promosRaw = db.prepare('SELECT * FROM promotions').all();
  const promotionsList = promosRaw.map(p => {
    const lim = p.usage_limit !== undefined && p.usage_limit !== null ? Number(p.usage_limit) : (p.usageLimit !== null && p.usageLimit !== undefined ? Number(p.usageLimit) : null);
    const used = p.times_used !== undefined && p.times_used !== null ? Number(p.times_used) : (p.usageCount || 0);
    return {
      ...p,
      active: Boolean(p.active),
      usage_limit: lim,
      usageLimit: lim,
      times_used: used,
      usageCount: used
    };
  });

  const inventoryLedger = db.prepare('SELECT * FROM inventory_ledger ORDER BY id DESC').all();

  const pagesRaw = db.prepare('SELECT * FROM custom_pages').all();
  const customPages = pagesRaw.map(p => ({
    ...p,
    showInNav: Boolean(p.showInNav),
    showInFooter: Boolean(p.showInFooter),
    components: p.components ? JSON.parse(p.components) : [],
    nativeContent: p.nativeContent ? JSON.parse(p.nativeContent) : {}
  }));

  const navRows = db.prepare('SELECT * FROM navigation_config').all();
  const navigationConfig = {
    headerNav: [],
    footerNav: []
  };
  for (const r of navRows) {
    if (r.navKey === 'headerNav') navigationConfig.headerNav = JSON.parse(r.items);
    if (r.navKey === 'footerNav') navigationConfig.footerNav = JSON.parse(r.items);
  }

  const mediaRows = db.prepare('SELECT * FROM media_library ORDER BY id DESC').all();
  const mediaLibrary = mediaRows.map(m => ({
    ...m,
    category: m.category || 'Uploads',
    uploadedAt: m.uploadDate || m.uploadedAt || new Date().toISOString().split('T')[0]
  }));

  const storeInfoRow = db.prepare('SELECT data FROM store_info WHERE id = 1').get();
  const storeInfo = storeInfoRow ? JSON.parse(storeInfoRow.data) : null;

  let recentAuditLogs = [];
  try {
    recentAuditLogs = db.prepare('SELECT * FROM security_audit_logs ORDER BY id DESC LIMIT 20').all();
  } catch {}

  return {
    users,
    products,
    categories,
    orders,
    serviceInquiries: inquiries,
    promotionsList,
    inventoryLedger,
    customPages,
    navigationConfig,
    mediaLibrary,
    storeInfo,
    securitySummary: {
      engine: 'SQLite 3 with WAL, Foreign Keys & Scrypt Hashing',
      normalizedTables: ['users', 'categories', 'products', 'product_features', 'orders', 'order_items', 'order_status_history', 'inventory_ledger', 'custom_pages', 'page_components'],
      securityTables: ['user_sessions', 'security_audit_logs', 'auth_rate_limits'],
      activeSessions: db.prepare('SELECT COUNT(*) AS count FROM user_sessions WHERE isValid = 1').get()?.count || 0,
      totalAuditLogs: db.prepare('SELECT COUNT(*) AS count FROM security_audit_logs').get()?.count || 0
    },
    auditLogs: recentAuditLogs
  };
}

export function saveOrderToDb(order) {
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, date, userId, customerName, customerEmail, customerPhone, customerType,
      fulfillment, pickupLocation, pickupTimeSlot, deliveryAddress, deliveryNotes,
      paymentMethod, status, statusNotes, subtotal, discountAmount, appliedPromoCode,
      deliveryFee, total, notes, rawItems
    ) VALUES (
      @id, @date, @userId, @customerName, @customerEmail, @customerPhone, @customerType,
      @fulfillment, @pickupLocation, @pickupTimeSlot, @deliveryAddress, @deliveryNotes,
      @paymentMethod, @status, @statusNotes, @subtotal, @discountAmount, @appliedPromoCode,
      @deliveryFee, @total, @notes, @rawItems
    )
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (orderId, productId, name, price, quantity, sku)
    VALUES (@orderId, @productId, @name, @price, @quantity, @sku)
  `);

  const updateProductStock = db.prepare(`
    UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?
  `);

  const insertLedger = db.prepare(`
    INSERT INTO inventory_ledger (id, productId, productName, changeAmount, previousStock, newStock, reason, date, user)
    VALUES (@id, @productId, @productName, @changeAmount, @previousStock, @newStock, @reason, @date, @user)
  `);

  const runTx = db.transaction(() => {
    insertOrder.run({
      id: order.id,
      date: order.date || new Date().toISOString(),
      userId: order.userId || null,
      customerName: order.customer?.name || order.name || 'Customer',
      customerEmail: order.customer?.email || order.email || '',
      customerPhone: order.customer?.phone || order.phone || '',
      customerType: order.customer?.type || 'Buyer',
      fulfillment: order.fulfillment || 'pickup',
      pickupLocation: order.pickupLocation || '',
      pickupTimeSlot: order.pickupTimeSlot || '',
      deliveryAddress: order.deliveryAddress || '',
      deliveryNotes: order.deliveryNotes || '',
      paymentMethod: order.paymentMethod || 'Cash on Pickup',
      status: order.status || 'Order Placed',
      statusNotes: order.statusNotes || '',
      subtotal: order.subtotal || order.total || 0,
      discountAmount: order.discountAmount || 0,
      appliedPromoCode: order.appliedPromoCode || null,
      deliveryFee: order.deliveryFee || 0,
      total: order.total || 0,
      notes: order.notes || '',
      rawItems: JSON.stringify(order.items || [])
    });

    for (const item of (order.items || [])) {
      insertItem.run({
        orderId: order.id,
        productId: item.id || '',
        name: item.name || '',
        price: item.price || 0,
        quantity: item.quantity || 1,
        sku: item.sku || ''
      });

      // Update product stock and record ledger
      const p = db.prepare('SELECT stock, name FROM products WHERE id = ?').get(item.id);
      if (p) {
        const prevStock = p.stock;
        const newStock = Math.max(0, prevStock - item.quantity);
        updateProductStock.run(item.quantity, item.id);

        insertLedger.run({
          id: `led-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productId: item.id,
          productName: p.name,
          changeAmount: -item.quantity,
          previousStock: prevStock,
          newStock,
          reason: `Customer Checkout #${order.id} (${order.fulfillment === 'pickup' ? 'Store Pickup' : 'Courier Delivery'})`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          user: order.customer?.name || 'Customer Checkout'
        });
      }
    }

    if (order.appliedPromoCode) {
      db.prepare('UPDATE promotions SET usageCount = usageCount + 1 WHERE code = ?').run(order.appliedPromoCode);
    }
  });

  runTx();
  return order;
}

export function updateOrderStatusInDb(orderId, status, notes) {
  if (notes) {
    db.prepare('UPDATE orders SET status = ?, statusNotes = ? WHERE id = ?').run(status, notes, orderId);
  } else {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
  }
}

export function saveProductToDb(product) {
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(product.id);
  if (existing) {
    db.prepare(`
      UPDATE products SET
        name = @name, category = @category, price = @price, originalPrice = @originalPrice,
        stock = @stock, isFeatured = @isFeatured, isDiscounted = @isDiscounted,
        description = @description, sku = @sku, image = @image, features = @features
      WHERE id = @id
    `).run({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      stock: product.stock,
      isFeatured: product.isFeatured ? 1 : 0,
      isDiscounted: product.isDiscounted ? 1 : 0,
      description: product.description || '',
      sku: product.sku || '',
      image: product.image || '',
      features: JSON.stringify(product.features || [])
    });
  } else {
    db.prepare(`
      INSERT INTO products (id, name, category, price, originalPrice, stock, isFeatured, isDiscounted, rating, reviewsCount, description, features, sku, image, fallbackCategory)
      VALUES (@id, @name, @category, @price, @originalPrice, @stock, @isFeatured, @isDiscounted, 5.0, 0, @description, @features, @sku, @image, '')
    `).run({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      stock: product.stock,
      isFeatured: product.isFeatured ? 1 : 0,
      isDiscounted: product.isDiscounted ? 1 : 0,
      description: product.description || '',
      sku: product.sku || '',
      image: product.image || '',
      features: JSON.stringify(product.features || [])
    });
  }
}

export function deleteProductFromDb(productId) {
  db.prepare('DELETE FROM products WHERE id = ?').run(productId);
}

export function adjustProductStockInDb({ productId, changeAmount, reason, user }) {
  const p = db.prepare('SELECT name, stock FROM products WHERE id = ?').get(productId);
  if (!p) return null;

  const previousStock = p.stock;
  const newStock = Math.max(0, previousStock + changeAmount);
  
  const tx = db.transaction(() => {
    db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(newStock, productId);
    const ledgerId = `led-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT INTO inventory_ledger (id, productId, productName, changeAmount, previousStock, newStock, reason, date, user)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ledgerId,
      productId,
      p.name,
      changeAmount,
      previousStock,
      newStock,
      reason,
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user || 'Store Manager'
    );
  });

  tx();
  return { productId, previousStock, newStock };
}

export function saveUserToDb(user) {
  const existing = db.prepare('SELECT id, password, idNumber FROM users WHERE id = ? OR email = ?').get(user.id, user.email.toLowerCase());
  user = { ...user, idNumber: getAccountReference(existing || { id: user.id }) };
  
  if (existing) {
    if (user.password) {
      const hashedPassword = user.password.startsWith('scrypt$') ? user.password : hashPassword(user.password);
      db.prepare(`
        UPDATE users SET
          name = @name, phone = @phone, role = @role, affiliation = @affiliation,
          idNumber = @idNumber, savedAddress = @savedAddress, password = @password
        WHERE id = @id
      `).run({
        id: existing.id,
        name: user.name,
        phone: user.phone || '',
        role: user.role || 'buyer',
        affiliation: user.affiliation || '',
        idNumber: user.idNumber || '',
        savedAddress: user.savedAddress || '',
        password: hashedPassword
      });
    } else {
      db.prepare(`
        UPDATE users SET
          name = @name, phone = @phone, role = @role, affiliation = @affiliation,
          idNumber = @idNumber, savedAddress = @savedAddress
        WHERE id = @id
      `).run({
        id: existing.id,
        name: user.name,
        phone: user.phone || '',
        role: user.role || 'buyer',
        affiliation: user.affiliation || '',
        idNumber: user.idNumber || '',
        savedAddress: user.savedAddress || ''
      });
    }
    return sanitizeUser({ ...user, id: existing.id });
  } else {
    const rawPassword = user.password || 'password123';
    const hashedPassword = rawPassword.startsWith('scrypt$') ? rawPassword : hashPassword(rawPassword);
    db.prepare(`
      INSERT INTO users (id, email, password, name, phone, role, affiliation, idNumber, joinedDate, savedAddress, ordersCount)
      VALUES (@id, @email, @password, @name, @phone, @role, @affiliation, @idNumber, @joinedDate, @savedAddress, 0)
    `).run({
      id: user.id || `usr-${Date.now()}`,
      email: user.email.toLowerCase(),
      password: hashedPassword,
      name: user.name,
      phone: user.phone || '',
      role: user.role || 'buyer',
      affiliation: user.affiliation || '',
      idNumber: user.idNumber || '',
      joinedDate: user.joinedDate || new Date().toISOString().split('T')[0],
      savedAddress: user.savedAddress || ''
    });
    return sanitizeUser(user);
  }
}

// ==========================================
// SECURITY AUDIT LOGGING
// ==========================================
export function recordAuditLog(eventType, userId = null, ipAddress = '127.0.0.1', details = '', severity = 'info') {
  try {
    db.prepare(`
      INSERT INTO security_audit_logs (eventType, userId, ipAddress, details, timestamp, severity)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      eventType,
      userId,
      ipAddress,
      typeof details === 'object' ? JSON.stringify(details) : String(details),
      new Date().toISOString(),
      severity
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

export function getSecurityAuditLogs(limit = 100) {
  try {
    return db.prepare('SELECT * FROM security_audit_logs ORDER BY id DESC LIMIT ?').all(Math.min(limit, 500));
  } catch {
    return [];
  }
}

// ==========================================
// PERSISTENT BRUTE-FORCE RATE LIMITER
// ==========================================
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 3 * 60 * 1000; // 3 minutes

export function checkDbRateLimit(identifier) {
  const cleanId = String(identifier).trim().toLowerCase();
  try {
    const row = db.prepare('SELECT attemptsCount, firstAttemptAt, lockedUntil FROM auth_rate_limits WHERE identifier = ?').get(cleanId);
    const now = Date.now();

    if (!row) return { allowed: true };

    if (row.lockedUntil && now < row.lockedUntil) {
      const remainingSeconds = Math.ceil((row.lockedUntil - now) / 1000);
      return {
        allowed: false,
        message: `Too many failed login attempts. Account temporarily locked for security. Try again in ${remainingSeconds} seconds.`
      };
    }

    if (now - row.firstAttemptAt > LOCKOUT_MS) {
      db.prepare('DELETE FROM auth_rate_limits WHERE identifier = ?').run(cleanId);
      return { allowed: true };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordDbFailedLogin(identifier) {
  const cleanId = String(identifier).trim().toLowerCase();
  const now = Date.now();
  try {
    const row = db.prepare('SELECT attemptsCount, firstAttemptAt FROM auth_rate_limits WHERE identifier = ?').get(cleanId);
    if (!row) {
      db.prepare('INSERT INTO auth_rate_limits (identifier, attemptsCount, firstAttemptAt, lockedUntil) VALUES (?, 1, ?, NULL)').run(cleanId, now);
    } else {
      const newCount = row.attemptsCount + 1;
      const lockedUntil = newCount >= MAX_ATTEMPTS ? now + LOCKOUT_MS : null;
      db.prepare('UPDATE auth_rate_limits SET attemptsCount = ?, lockedUntil = ? WHERE identifier = ?').run(newCount, lockedUntil, cleanId);
    }
  } catch (err) {
    console.error('Rate limit record error:', err.message);
  }
}

export function clearDbFailedLogin(identifier) {
  const cleanId = String(identifier).trim().toLowerCase();
  try {
    db.prepare('DELETE FROM auth_rate_limits WHERE identifier = ?').run(cleanId);
  } catch {}
}

// ==========================================
// USER AUTHENTICATION & SESSION MANAGEMENT
// ==========================================
export function authenticateUser(emailOrUsername, plainPassword, ipAddress = '127.0.0.1') {
  const cleanId = (emailOrUsername || '').trim().toLowerCase();
  
  // 1. Rate Limit Check
  const rateLimit = checkDbRateLimit(cleanId);
  if (!rateLimit.allowed) {
    recordAuditLog(SECURITY_EVENTS.ACCOUNT_LOCKED, null, ipAddress, `Lockout triggered for ${cleanId}`, 'warning');
    return { success: false, message: rateLimit.message };
  }

  // 2. Query User
  let user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanId);
  if (!user && (cleanId === 'admin' || cleanId === 'admin@mamamoinkprint.ph')) {
    user = db.prepare("SELECT * FROM users WHERE role = 'admin' OR LOWER(email) LIKE '%admin%' LIMIT 1").get();
  }

  if (!user) {
    recordDbFailedLogin(cleanId);
    recordAuditLog(SECURITY_EVENTS.LOGIN_FAILURE, null, ipAddress, `Unknown identifier: ${cleanId}`, 'warning');
    return { success: false, message: 'Invalid credentials. Please verify your email/username and password.' };
  }

  // 3. Password Verification (scrypt timing-safe check)
  const { match, needsUpgrade } = verifyPassword(plainPassword, user.password);
  if (!match) {
    recordDbFailedLogin(cleanId);
    recordAuditLog(SECURITY_EVENTS.LOGIN_FAILURE, user.id, ipAddress, `Invalid password attempt for ${user.email}`, 'warning');
    return { success: false, message: 'Invalid credentials. Please verify your email/username and password.' };
  }

  // 4. Success: Clear failed attempts
  clearDbFailedLogin(cleanId);

  // 5. Upgrade password to scrypt if legacy
  if (needsUpgrade) {
    const upgraded = hashPassword(plainPassword);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(upgraded, user.id);
    recordAuditLog(SECURITY_EVENTS.PASSWORD_UPGRADED, user.id, ipAddress, 'Upgraded plaintext password to scrypt hash', 'info');
  }

  // 6. Generate 256-bit Session Token
  const token = generateToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    db.prepare(`
      INSERT INTO user_sessions (id, userId, token, createdAt, expiresAt, lastActive, ipAddress, isValid)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(`sess-${Date.now()}`, user.id, token, now.toISOString(), expiresAt, now.toISOString(), ipAddress);
  } catch (err) {
    console.error('Session insert error:', err.message);
  }

  // 7. Record Login Success
  recordAuditLog(SECURITY_EVENTS.LOGIN_SUCCESS, user.id, ipAddress, `User logged in: ${user.email} (${user.role})`, 'info');

  return {
    success: true,
    user: sanitizeUser(user),
    token
  };
}

export function registerUser(userData, ipAddress = '127.0.0.1') {
  const email = sanitizeEmail(userData.email);
  if (!email) {
    return { success: false, message: 'A valid email address is required.' };
  }

  const policy = validatePasswordPolicy(userData.password);
  if (!policy.valid) {
    return { success: false, message: policy.message };
  }

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(email);
  if (existing) {
    return { success: false, message: 'An account with this email address already exists.' };
  }

  // Cryptographic scrypt hash
  const hashedPassword = hashPassword(userData.password);
  const userId = `usr-${Date.now()}`;
  const nowStr = new Date().toISOString().split('T')[0];

  db.prepare(`
    INSERT INTO users (id, email, password, name, phone, role, affiliation, idNumber, joinedDate, savedAddress, ordersCount)
    VALUES (@id, @email, @password, @name, @phone, @role, @affiliation, @idNumber, @joinedDate, @savedAddress, 0)
  `).run({
    id: userId,
    email,
    password: hashedPassword,
    name: sanitizeString(userData.name || 'Student Customer', 100),
    phone: sanitizeString(userData.phone || '', 50),
    role: 'buyer',
    affiliation: sanitizeString(userData.affiliation || '', 120),
    idNumber: getAccountReference({ id: userId }),
    joinedDate: nowStr,
    savedAddress: sanitizeString(userData.savedAddress || 'Purok 5, Banago, Nagcarlan, Laguna 4002', 200)
  });

  const createdUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const token = generateToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    db.prepare(`
      INSERT INTO user_sessions (id, userId, token, createdAt, expiresAt, lastActive, ipAddress, isValid)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(`sess-${Date.now()}`, userId, token, now.toISOString(), expiresAt, now.toISOString(), ipAddress);
  } catch {}

  recordAuditLog(SECURITY_EVENTS.USER_REGISTERED, userId, ipAddress, `New user registered: ${email}`, 'info');

  return {
    success: true,
    user: sanitizeUser(createdUser),
    token
  };
}

export function logoutSession(token, ipAddress = '127.0.0.1') {
  if (!token) return { success: true };
  try {
    const session = db.prepare('SELECT userId FROM user_sessions WHERE token = ?').get(token);
    db.prepare('UPDATE user_sessions SET isValid = 0 WHERE token = ?').run(token);
    if (session) {
      recordAuditLog(SECURITY_EVENTS.USER_LOGOUT, session.userId, ipAddress, 'User signed out', 'info');
    }
  } catch {}
  return { success: true };
}

export function verifySessionToken(token) {
  if (!token) return null;
  try {
    const session = db.prepare(`
      SELECT s.userId, s.expiresAt, s.isValid, u.*
      FROM user_sessions s
      JOIN users u ON s.userId = u.id
      WHERE s.token = ? AND s.isValid = 1
    `).get(token);

    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      db.prepare('UPDATE user_sessions SET isValid = 0 WHERE token = ?').run(token);
      return null;
    }

    db.prepare("UPDATE user_sessions SET lastActive = datetime('now') WHERE token = ?").run(token);
    return sanitizeUser(session);
  } catch {
    return null;
  }
}

export function savePromotionToDb(promo) {
  const limit = (promo.usage_limit !== undefined && promo.usage_limit !== null && promo.usage_limit !== '')
    ? Number(promo.usage_limit)
    : ((promo.usageLimit !== undefined && promo.usageLimit !== null && promo.usageLimit !== '') ? Number(promo.usageLimit) : null);
  const used = (promo.times_used !== undefined && promo.times_used !== null)
    ? Number(promo.times_used)
    : (promo.usageCount || 0);

  db.prepare(`
    INSERT OR REPLACE INTO promotions (id, code, title, description, discountType, discountValue, minSpend, startDate, endDate, active, usageCount, usageLimit, usage_limit, times_used, tagline, condition, badge, accentColor)
    VALUES (@id, @code, @title, @description, @discountType, @discountValue, @minSpend, @startDate, @endDate, @active, @usageCount, @usageLimit, @usage_limit, @times_used, @tagline, @condition, @badge, @accentColor)
  `).run({
    id: promo.id || `promo-${Date.now()}`,
    code: promo.code.trim().toUpperCase(),
    title: promo.title,
    description: promo.description || '',
    discountType: promo.discountType || 'percentage',
    discountValue: promo.discountValue || 15,
    minSpend: promo.minSpend || 0,
    startDate: promo.startDate || new Date().toISOString().split('T')[0],
    endDate: promo.endDate || '2026-12-31',
    active: promo.active !== false ? 1 : 0,
    usageCount: used,
    times_used: used,
    usageLimit: limit,
    usage_limit: limit,
    tagline: promo.tagline || '',
    condition: promo.condition || '',
    badge: promo.badge || '',
    accentColor: promo.accentColor || '#121212'
  });
}

export function incrementPromoUsageInDb(promoId) {
  db.prepare('UPDATE promotions SET usageCount = COALESCE(usageCount, 0) + 1, times_used = COALESCE(times_used, 0) + 1 WHERE id = ?').run(promoId);
}

// Media Library CRUD
export function saveMediaItemToDb(mediaItem) {
  db.prepare(`
    INSERT OR REPLACE INTO media_library (id, name, url, type, size, uploadDate, alt, category)
    VALUES (@id, @name, @url, @type, @size, @uploadDate, @alt, @category)
  `).run({
    id: mediaItem.id,
    name: mediaItem.name,
    url: mediaItem.url,
    type: mediaItem.type || 'image',
    size: mediaItem.size || '100 KB',
    uploadDate: mediaItem.uploadDate || mediaItem.uploadedAt || new Date().toISOString().split('T')[0],
    alt: mediaItem.alt || '',
    category: mediaItem.category || 'Uploads'
  });
}

export function deleteMediaItemFromDb(mediaId) {
  db.prepare('DELETE FROM media_library WHERE id = ?').run(mediaId);
}

export function deletePromotionFromDb(id) {
  db.prepare('DELETE FROM promotions WHERE id = ?').run(id);
}

export function togglePromotionInDb(id) {
  db.prepare('UPDATE promotions SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
}

export function saveCustomPageToDb(page) {
  db.prepare(`
    INSERT OR REPLACE INTO custom_pages (id, title, slug, description, status, author, createdAt, updatedAt, publishedAt, showInNav, showInFooter, components, systemRoute, nativeContent)
    VALUES (@id, @title, @slug, @description, @status, @author, @createdAt, @updatedAt, @publishedAt, @showInNav, @showInFooter, @components, @systemRoute, @nativeContent)
  `).run({
    id: page.id || `page-${Date.now()}`,
    title: page.title,
    slug: page.slug,
    description: page.description || '',
    status: page.status || 'draft',
    author: page.author || 'Store Manager',
    createdAt: page.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: page.publishedAt || null,
    showInNav: page.showInNav !== false ? 1 : 0,
    showInFooter: page.showInFooter !== false ? 1 : 0,
    components: JSON.stringify(page.components || []),
    systemRoute: page.systemRoute || null,
    nativeContent: JSON.stringify(page.nativeContent || {})
  });
}

export function deleteCustomPageFromDb(id) {
  db.prepare('DELETE FROM custom_pages WHERE id = ?').run(id);
}

export function saveNavigationToDb(navConfig) {
  if (navConfig.headerNav) {
    db.prepare('INSERT OR REPLACE INTO navigation_config (navKey, items) VALUES (?, ?)').run('headerNav', JSON.stringify(navConfig.headerNav));
  }
  if (navConfig.footerNav) {
    db.prepare('INSERT OR REPLACE INTO navigation_config (navKey, items) VALUES (?, ?)').run('footerNav', JSON.stringify(navConfig.footerNav));
  }
}

export function saveInquiryToDb(inquiry) {
  db.prepare(`
    INSERT INTO service_inquiries (id, date, clientName, clientPhone, clientEmail, serviceType, pageCount, paperType, bindingDetails, quantity, estimatedCost, notes, status)
    VALUES (@id, @date, @clientName, @clientPhone, @clientEmail, @serviceType, @pageCount, @paperType, @bindingDetails, @quantity, @estimatedCost, @notes, @status)
  `).run({
    id: inquiry.id || `SRV-INQ-${Math.floor(100 + Math.random() * 900)}`,
    date: inquiry.date || new Date().toISOString(),
    clientName: inquiry.clientName,
    clientPhone: inquiry.clientPhone || '',
    clientEmail: inquiry.clientEmail || '',
    serviceType: inquiry.serviceType,
    pageCount: inquiry.pageCount || 1,
    paperType: inquiry.paperType || '',
    bindingDetails: inquiry.bindingDetails || '',
    quantity: inquiry.quantity || 1,
    estimatedCost: inquiry.estimatedCost || 0,
    notes: inquiry.notes || '',
    status: inquiry.status || 'In Review'
  });
}

export function updateInquiryStatusInDb(id, status) {
  db.prepare('UPDATE service_inquiries SET status = ? WHERE id = ?').run(status, id);
}

export function resetDatabase(initialData) {
  db.exec(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS service_inquiries;
    DROP TABLE IF EXISTS promotions;
    DROP TABLE IF EXISTS inventory_ledger;
    DROP TABLE IF EXISTS custom_pages;
    DROP TABLE IF EXISTS navigation_config;
    DROP TABLE IF EXISTS media_library;
    DROP TABLE IF EXISTS store_info;
  `);
  initDatabase(initialData);
  return getAllData();
}
