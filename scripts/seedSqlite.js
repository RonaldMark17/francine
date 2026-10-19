import { initDatabase, getAllData, resetDatabase } from '../server/db.js';
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

console.log('--- Initializing & Seeding SQLite Database ---');

const initialData = {
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
};

// Reset & Seed with clean initial data
const data = resetDatabase(initialData);

console.log('✅ SQLite Database successfully created & populated!');
console.log(`📦 Products: ${data.products.length}`);
console.log(`👥 Users: ${data.users.length}`);
console.log(`🛍️ Orders/Transactions: ${data.orders.length}`);
console.log(`🖨️ Service Inquiries: ${data.serviceInquiries.length}`);
console.log(`🏷️ Promotions: ${data.promotionsList.length}`);
console.log(`📑 Custom Pages: ${data.customPages.length}`);
console.log(`📊 Inventory Ledger: ${data.inventoryLedger.length}`);
console.log(`🖼️ Media Library: ${data.mediaLibrary.length}`);
console.log(`🏪 Store Info: ${data.storeInfo ? data.storeInfo.name : 'Configured'}`);
console.log('------------------------------------------------');
