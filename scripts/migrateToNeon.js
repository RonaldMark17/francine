import { neon } from '@neondatabase/serverless'
import { db, getAllData } from '../server/db.js'

if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before running this migration.')
const sql = neon(process.env.DATABASE_URL)
await sql`CREATE TABLE IF NOT EXISTS app_records (
  bucket text NOT NULL, record_id text NOT NULL, payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (bucket, record_id)
)`
await sql`CREATE INDEX IF NOT EXISTS app_records_bucket_idx ON app_records (bucket)`
const existing = await sql`SELECT count(*)::int AS count FROM app_records`
if (existing[0].count && !process.argv.includes('--force')) {
  throw new Error(`Neon already has ${existing[0].count} records. Migration stopped to avoid overwriting them. Review the target database or pass --force to replace it.`)
}
if (process.argv.includes('--force')) await sql`DELETE FROM app_records`

const data = getAllData()
// Preserve password hashes for customer accounts. Demo admins are intentionally
// excluded; the production administrator is created from ADMIN_EMAIL/PASSWORD.
const users = db.prepare('SELECT * FROM users').all()
  .filter(user => user.role !== 'admin')
  .map(user => ({ ...user }))
const buckets = {
  users,
  products: data.products,
  categories: data.categories,
  orders: data.orders,
  serviceInquiries: data.serviceInquiries,
  promotionsList: data.promotionsList,
  inventoryLedger: data.inventoryLedger,
  customPages: data.customPages,
  navigationConfig: [{ id: 'main', ...data.navigationConfig }],
  mediaLibrary: data.mediaLibrary,
  storeInfo: data.storeInfo ? [{ id: 'main', ...data.storeInfo }] : [],
  auditLogs: db.prepare('SELECT * FROM security_audit_logs ORDER BY id').all()
}
let count = 0
for (const [bucket, records] of Object.entries(buckets)) {
  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const id = String(record?.id || `${bucket}-${i}`)
    await sql`INSERT INTO app_records (bucket, record_id, payload) VALUES (${bucket}, ${id}, ${JSON.stringify(record)}::jsonb)
      ON CONFLICT (bucket, record_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`
    count++
  }
}
db.close()
console.log(`Migrated ${count} records to Neon. Demo admin accounts were excluded; configure ADMIN_EMAIL and ADMIN_PASSWORD in Vercel.`)
