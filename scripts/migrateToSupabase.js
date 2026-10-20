import { createClient } from '@supabase/supabase-js'
import { db, getAllData } from '../server/db.js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env before running this migration.')
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
})
const { count: existingCount, error: countError } = await supabase.from('app_records').select('record_id', { count: 'exact', head: true })
if (countError) throw new Error(`Supabase schema check failed: ${countError.message}. Run supabase/schema.sql in the Supabase SQL Editor first.`)
if (existingCount && !process.argv.includes('--force')) {
  throw new Error(`Supabase already has ${existingCount} records. Migration stopped to avoid overwriting them. Review the target project or pass --force to replace its application records.`)
}
if (process.argv.includes('--force')) {
  const { error } = await supabase.from('app_records').delete().neq('record_id', '')
  if (error) throw error
}

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
    const { error } = await supabase.from('app_records').upsert({ bucket, record_id: id, payload: record }, { onConflict: 'bucket,record_id' })
    if (error) throw new Error(`Failed importing ${bucket}/${id}: ${error.message}`)
    count++
  }
}
db.close()
console.log(`Migrated ${count} records to Supabase. Demo admin accounts were excluded; configure ADMIN_EMAIL and ADMIN_PASSWORD in Vercel.`)
