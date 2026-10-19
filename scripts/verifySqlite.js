import { db, getAllData } from '../server/db.js';

console.log('--- Inspecting SQLite Database (database.sqlite) ---');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

tables.forEach(t => {
  const count = db.prepare(`SELECT COUNT(*) as c FROM ${t.name}`).get().c;
  console.log(` - ${t.name.padEnd(22)}: ${count} records`);
});

const sampleProduct = db.prepare("SELECT id, name, price, stock, category FROM products LIMIT 1").get();
console.log('\nSample Product from SQLite:', sampleProduct);

const sampleOrder = db.prepare("SELECT id, customerName, total, status FROM orders LIMIT 1").get();
console.log('Sample Order/Transaction from SQLite:', sampleOrder);

const sampleUser = db.prepare("SELECT id, email, name, role FROM users LIMIT 1").get();
console.log('Sample User from SQLite:', sampleUser);
console.log('----------------------------------------------------');
