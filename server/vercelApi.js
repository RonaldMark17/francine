import { neon } from '@neondatabase/serverless'
import { randomBytes } from 'node:crypto'
import { hashPassword, verifyPassword, sanitizeUser, validatePasswordPolicy, sanitizeEmail, sanitizeString } from './security.js'
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SERVICE_INQUIRIES, PROMOTIONS, STORE_INFO } from '../src/data/initialData.js'
import { INITIAL_NAV_CONFIG, INITIAL_CUSTOM_PAGES, INITIAL_MEDIA_LIBRARY, INITIAL_INVENTORY_LEDGER, INITIAL_PROMOTIONS_LIST } from '../src/data/builderData.js'

const validInquiryStatuses = new Set(['In Review', 'Responded', 'Closed'])
const validOrderStatuses = new Set(['Order Placed', 'Processing', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled'])
const privateBuckets = new Set(['users', 'orders', 'serviceInquiries', 'inventoryLedger', 'auditLogs'])

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.')
  return neon(process.env.DATABASE_URL)
}

async function ensureSchema(sql) {
  await sql`CREATE TABLE IF NOT EXISTS app_records (
    bucket text NOT NULL,
    record_id text NOT NULL,
    payload jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (bucket, record_id)
  )`
  await sql`CREATE INDEX IF NOT EXISTS app_records_bucket_idx ON app_records (bucket)`
}

const idOf = (value, prefix) => value?.id || `${prefix}-${randomBytes(10).toString('hex')}`
const json = (value) => JSON.stringify(value ?? {})
async function rows(sql, bucket) {
  const found = await sql`SELECT payload FROM app_records WHERE bucket = ${bucket}`
  return found.map(row => row.payload)
}
async function one(sql, bucket, id) {
  const found = await sql`SELECT payload FROM app_records WHERE bucket = ${bucket} AND record_id = ${id} LIMIT 1`
  return found[0]?.payload ?? null
}
async function put(sql, bucket, id, payload) {
  await sql`INSERT INTO app_records (bucket, record_id, payload) VALUES (${bucket}, ${id}, ${json(payload)}::jsonb)
    ON CONFLICT (bucket, record_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`
}
async function remove(sql, bucket, id) {
  await sql`DELETE FROM app_records WHERE bucket = ${bucket} AND record_id = ${id}`
}
async function inc(sql, bucket, id, key) {
  if (bucket === 'promotionsList' && key === 'usageCount') {
    await sql`UPDATE app_records SET payload = jsonb_set(jsonb_set(payload, '{usageCount}', to_jsonb(COALESCE((payload->>'usageCount')::int, (payload->>'times_used')::int, 0) + 1), true), '{times_used}', to_jsonb(COALESCE((payload->>'usageCount')::int, (payload->>'times_used')::int, 0) + 1), true), updated_at = now() WHERE bucket = ${bucket} AND record_id = ${id}`
    return
  }
  await sql`UPDATE app_records SET payload = jsonb_set(payload, ARRAY[${key}], to_jsonb(COALESCE((payload->>${key})::int, 0) + 1), true), updated_at = now() WHERE bucket = ${bucket} AND record_id = ${id}`
}
function safeUser(user) { return sanitizeUser(user) }
function getToken(req) { return (req.headers.authorization || '').replace(/^Bearer\s+/i, '') }

async function currentUser(sql, req) {
  const token = getToken(req)
  if (!token) return null
  const session = await one(sql, 'sessions', token)
  if (!session || !session.valid || new Date(session.expiresAt) <= new Date()) return null
  const user = await one(sql, 'users', session.userId)
  if (!user) return null
  return safeUser(user)
}
async function requireUser(sql, req) {
  const user = await currentUser(sql, req)
  if (!user) throw Object.assign(new Error('Sign in to continue.'), { status: 401 })
  return user
}
async function requireAdmin(sql, req) {
  const user = await requireUser(sql, req)
  if (user.role !== 'admin') throw Object.assign(new Error('Administrator access is required.'), { status: 403 })
  return user
}
async function bootstrapAdmin(sql) {
  const email = sanitizeEmail(process.env.ADMIN_EMAIL)
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters.')
  const existing = (await rows(sql, 'users')).find(user => user.email?.toLowerCase() === email)
  if (existing) {
    if (existing.role !== 'admin') throw new Error('ADMIN_EMAIL is already assigned to a non-admin account. Choose a separate administrator email.')
    if (!verifyPassword(password, existing.password).match) {
      existing.password = hashPassword(password)
      await put(sql, 'users', existing.id, existing)
    }
    return
  }
  const user = {
    id: `usr-${randomBytes(10).toString('hex')}`, email, password: hashPassword(password),
    name: process.env.ADMIN_NAME || 'Store Administrator', role: 'admin', phone: '', affiliation: '',
    idNumber: 'ADMIN', joinedDate: new Date().toISOString().slice(0, 10), savedAddress: '', ordersCount: 0
  }
  await put(sql, 'users', user.id, user)
}

function responseData(records, user) {
  const allowed = user?.role === 'admin'
  const data = Object.fromEntries(Object.entries(records).map(([key, value]) => [key, privateBuckets.has(key) && !allowed ? [] : value]))
  if (user?.role === 'buyer') data.orders = (records.orders || []).filter(order => order.userId === user.id)
  if (!allowed) data.customPages = (data.customPages || []).filter(page => page.status === 'published')
  data.users = allowed ? data.users.map(safeUser) : []
  data.securitySummary = { engine: 'Neon Postgres', activeSessions: records.sessions?.filter(x => x.valid).length || 0, totalAuditLogs: records.auditLogs?.length || 0 }
  delete data.sessions
  delete data.rateLimits
  return data
}

async function allData(sql, user) {
  const buckets = ['users','products','categories','orders','serviceInquiries','promotionsList','inventoryLedger','customPages','navigationConfig','mediaLibrary','storeInfo','auditLogs','sessions','rateLimits']
  const results = await Promise.all(buckets.map(bucket => rows(sql, bucket)))
  const data = Object.fromEntries(buckets.map((bucket, index) => [bucket, results[index]]))
  data.navigationConfig = data.navigationConfig[0] || { headerNav: [], footerNav: [] }
  data.storeInfo = data.storeInfo[0] || null
  data.auditLogs = data.auditLogs.slice(-20).reverse()
  return responseData(data, user)
}
async function resetSeedData(sql) {
  await sql`DELETE FROM app_records WHERE bucket NOT IN ('users','sessions')`
  const seed = {
    products: INITIAL_PRODUCTS, orders: INITIAL_ORDERS, serviceInquiries: INITIAL_SERVICE_INQUIRIES,
    promotionsList: INITIAL_PROMOTIONS_LIST, inventoryLedger: INITIAL_INVENTORY_LEDGER,
    customPages: INITIAL_CUSTOM_PAGES, navigationConfig: [{ id: 'main', ...INITIAL_NAV_CONFIG }],
    mediaLibrary: INITIAL_MEDIA_LIBRARY, storeInfo: [{ id: 'main', ...STORE_INFO }],
    categories: [], auditLogs: []
  }
  // Keep explicit legacy promotion definitions while the application reads its list.
  for (const [bucket, entries] of Object.entries(seed)) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      await put(sql, bucket, String(entry?.id || `${bucket}-${i}`), entry)
    }
  }
  for (const promo of PROMOTIONS) {
    const id = String(promo.id || promo.code || `promo-${randomBytes(6).toString('hex')}`)
    await put(sql, 'promotionsList', id, { ...promo, id })
  }
}

async function log(sql, event, userId, req, details = '') {
  const entry = { id: `audit-${Date.now()}-${randomBytes(4).toString('hex')}`, eventType: event, userId: userId || null,
    ipAddress: String(req.headers['x-forwarded-for'] || '').split(',')[0].slice(0, 64), details: String(details).slice(0, 500), timestamp: new Date().toISOString(), severity: 'info' }
  await put(sql, 'auditLogs', entry.id, entry)
}
async function newSession(sql, user) {
  const token = randomBytes(32).toString('hex')
  await put(sql, 'sessions', token, { userId: user.id, valid: true, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() })
  return { success: true, user: safeUser(user), token }
}

export async function handleVercelApi(req, res) {
  const sql = db()
  await ensureSchema(sql)
  await bootstrapAdmin(sql)
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  const path = url.pathname.replace(/\/+$/, '') || '/'
  const method = req.method.toUpperCase()
  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent)
  let user = null
  const send = (status, value) => res.status(status).json(value)
  const admin = async () => { user = await requireAdmin(sql, req); return user }
  const profile = async () => { user = await requireUser(sql, req); return user }

  if (method === 'OPTIONS') return res.status(204).end()
  if (path === '/api/health' && method === 'GET') return send(200, { status: 'ok', engine: 'Neon Postgres' })
  if (path === '/api/all-data' && method === 'GET') {
    user = await currentUser(sql, req)
    return send(200, await allData(sql, user))
  }
  if (path === '/api/auth/login' && method === 'POST') {
    const identifier = sanitizeString(body.email || body.username, 120).toLowerCase()
    const bucketId = identifier
    const attempts = (await one(sql, 'rateLimits', bucketId)) || { count: 0, until: 0 }
    if (attempts.until > Date.now()) return send(429, { success: false, message: 'Too many failed attempts. Try again later.' })
    const account = (await rows(sql, 'users')).find(x => x.email?.toLowerCase() === identifier || (identifier === 'admin' && x.role === 'admin'))
    const passwordCheck = account && verifyPassword(body.password, account.password)
    const verified = passwordCheck?.match
    if (!verified) {
      const count = attempts.count + 1
      await put(sql, 'rateLimits', bucketId, { count, until: count >= 5 ? Date.now() + 180000 : 0 })
      await log(sql, 'AUTH_LOGIN_FAILURE', account?.id, req, identifier)
      return send(401, { success: false, message: 'Invalid credentials. Please verify your email/username and password.' })
    }
    if (passwordCheck.needsUpgrade) { account.password = hashPassword(body.password); await put(sql, 'users', account.id, account) }
    await remove(sql, 'rateLimits', bucketId)
    await log(sql, 'AUTH_LOGIN_SUCCESS', account.id, req, 'User logged in')
    return send(200, await newSession(sql, account))
  }
  if (path === '/api/auth/register' && method === 'POST') {
    const email = sanitizeEmail(body.email)
    const policy = validatePasswordPolicy(body.password)
    if (!email || !email.includes('@')) return send(400, { success: false, message: 'A valid email address is required.' })
    if (!policy.valid) return send(400, { success: false, message: policy.message })
    if ((await rows(sql, 'users')).some(x => x.email?.toLowerCase() === email)) return send(409, { success: false, message: 'An account with this email address already exists.' })
    const account = { id: idOf(null, 'usr'), email, password: hashPassword(body.password), name: sanitizeString(body.name || 'Customer', 100),
      phone: sanitizeString(body.phone || '', 50), role: 'buyer', affiliation: sanitizeString(body.affiliation || '', 120), idNumber: '', joinedDate: new Date().toISOString().slice(0,10), savedAddress: sanitizeString(body.savedAddress || '', 200), ordersCount: 0 }
    await put(sql, 'users', account.id, account)
    return send(201, await newSession(sql, account))
  }
  if (path === '/api/auth/verify' && method === 'GET') {
    user = await currentUser(sql, req)
    if (!user) return send(401, { success: false, message: 'Invalid or expired session token.' })
    return send(200, { success: true, user })
  }
  if (path === '/api/auth/logout' && method === 'POST') {
    const token = body.token || getToken(req)
    if (token) { const session = await one(sql, 'sessions', token); if (session) await put(sql, 'sessions', token, { ...session, valid: false }) }
    return send(200, { success: true })
  }
  if (path === '/api/inquiries' && method === 'POST') {
    const required = ['clientName','serviceType']
    if (required.some(key => !sanitizeString(body[key], 200))) return send(400, { error: 'Name and service type are required.' })
    const inquiry = { ...body, id: idOf(body, 'SRV-INQ'), date: new Date().toISOString(), clientName: sanitizeString(body.clientName, 120), clientEmail: sanitizeString(body.clientEmail || '', 160), clientPhone: sanitizeString(body.clientPhone || '', 50), serviceType: sanitizeString(body.serviceType, 100), status: 'In Review' }
    await put(sql, 'serviceInquiries', inquiry.id, inquiry)
    return send(201, inquiry)
  }
  if (path === '/api/inquiries' && method === 'GET') { await admin(); return send(200, (await rows(sql, 'serviceInquiries')).sort((a,b) => String(b.date).localeCompare(String(a.date)))) }
  if (parts[1] === 'inquiries' && parts[3] === 'status' && ['PUT','POST'].includes(method)) {
    await admin(); if (!validInquiryStatuses.has(body.status)) return send(400, { error: 'Invalid inquiry status.' })
    const inquiry = await one(sql, 'serviceInquiries', parts[2]); if (!inquiry) return send(404, { error: 'Inquiry not found.' })
    await put(sql, 'serviceInquiries', parts[2], { ...inquiry, status: body.status }); return send(200, { success: true, id: parts[2], status: body.status })
  }
  if (path === '/api/orders' && method === 'POST') {
    const customer = await currentUser(sql, req)
    const order = { ...body, id: idOf(body, 'order'), date: new Date().toISOString(), userId: customer?.id || null, status: 'Order Placed' }
    if (!Array.isArray(order.items) || !order.items.length) return send(400, { error: 'An order must contain at least one item.' })
    const productChanges = new Map()
    for (const item of order.items) {
      const quantity = Number(item.quantity)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000 || !Number.isFinite(Number(item.price)) || Number(item.price) < 0) {
        return send(400, { error: 'Order items must have a valid quantity and price.' })
      }
      const product = await one(sql, 'products', String(item.id || ''))
      if (product) {
        item.name = product.name
        item.price = Number(product.price)
        item.sku = product.sku || item.sku || ''
        productChanges.set(product.id, (productChanges.get(product.id) || 0) + quantity)
      } else if (item.sku !== 'PRINT-SERVICE') {
        return send(400, { error: 'An order contains an unavailable product.' })
      }
    }
    await put(sql, 'orders', order.id, order)
    for (const [productId, quantity] of productChanges) {
      const changed = await sql`WITH prior AS (
          SELECT record_id, COALESCE((payload->>'stock')::int, 0) AS previous_stock
          FROM app_records WHERE bucket = 'products' AND record_id = ${productId} FOR UPDATE
        ), updated AS (
          UPDATE app_records AS record SET payload = jsonb_set(record.payload, '{stock}',
            to_jsonb(GREATEST(0, prior.previous_stock - ${quantity})), true), updated_at = now()
          FROM prior WHERE record.bucket = 'products' AND record.record_id = prior.record_id
          RETURNING prior.previous_stock, record.payload
        ) SELECT previous_stock, COALESCE((payload->>'stock')::int, 0) AS new_stock, payload->>'name' AS name FROM updated`
      if (!changed.length) continue
      const { previous_stock: previousStock, new_stock: newStock, name } = changed[0]
      const entry = { id: idOf(null, 'led'), productId, productName: name, changeAmount: -quantity,
        previousStock, newStock, reason: `Customer Checkout #${order.id}`, date: new Date().toISOString(), user: customer?.name || 'Customer Checkout' }
      await put(sql, 'inventoryLedger', entry.id, entry)
    }
    return send(201, order)
  }
  if (parts[1] === 'orders' && parts[3] === 'status' && ['PUT','POST'].includes(method)) {
    await admin(); if (!validOrderStatuses.has(body.status)) return send(400, { error: 'Invalid order status.' })
    const order = await one(sql, 'orders', parts[2]); if (!order) return send(404, { error: 'Order not found.' })
    order.status = body.status; order.statusNotes = sanitizeString(body.notes || '', 500); order.statusHistory = [...(order.statusHistory || []), { status: body.status, notes: order.statusNotes, changedAt: new Date().toISOString(), changedBy: user.name }]
    await put(sql, 'orders', parts[2], order); return send(200, { success: true, orderId: parts[2], status: body.status })
  }
  if (parts[1] === 'orders' && parts.length === 3 && method === 'GET') {
    const order = await one(sql, 'orders', parts[2])
    if (!order) return send(404, { error: 'Order not found.' })
    const owner = await currentUser(sql, req)
    if (owner?.role !== 'admin' && (!owner || order.userId !== owner.id)) {
      const publicItems = (order.items || []).map(({ id, name, price, quantity, sku }) => ({ id, name, price, quantity, sku }))
      return send(200, { id: order.id, date: order.date, status: order.status, statusNotes: order.statusNotes, fulfillment: order.fulfillment, pickupLocation: order.pickupLocation, pickupTimeSlot: order.pickupTimeSlot, items: publicItems, total: order.total, statusHistory: order.statusHistory || [] })
    }
    return send(200, order)
  }

  // Administrative and profile endpoints
  if (path === '/api/users' && method === 'POST') {
    await profile(); const existing = await one(sql, 'users', user.id)
    const updated = { ...existing, name: sanitizeString(body.name || existing.name, 100), phone: sanitizeString(body.phone || '', 50), affiliation: sanitizeString(body.affiliation || '', 120), savedAddress: sanitizeString(body.savedAddress || '', 200) }
    await put(sql, 'users', user.id, updated); return send(200, safeUser(updated))
  }
  if (path === '/api/security/audit-logs' && method === 'GET') { await admin(); return send(200, { success: true, logs: (await rows(sql, 'auditLogs')).slice(-100).reverse() }) }
  if (path === '/api/reset' && method === 'POST') { await admin(); await resetSeedData(sql); return send(200, { success: true, message: 'Application data reset to initial store data.', data: await allData(sql, user) }) }

  const bucket = ({ products:'products', promotions:'promotionsList', 'custom-pages':'customPages', media:'mediaLibrary' })[parts[1]]
  if (bucket && parts.length === 2 && method === 'POST') {
    await admin(); const id = idOf(body, parts[1] === 'products' ? 'product' : parts[1]); const entry = { ...body, id }; await put(sql, bucket, id, entry); return send(201, entry)
  }
  if (parts[1] === 'products' && parts.length === 3 && method === 'PUT') {
    await admin(); const product = { ...body, id: parts[2] }; await put(sql, 'products', product.id, product); return send(200, product)
  }
  if (bucket && parts.length === 3 && method === 'DELETE' && !['toggle','increment-usage','adjust-stock'].includes(parts[3])) {
    await admin(); await remove(sql, bucket, parts[2]); return send(200, { success: true, deletedId: parts[2] })
  }
  if (parts[1] === 'products' && parts[3] === 'adjust-stock' && method === 'POST') {
    await admin(); const product = await one(sql, 'products', parts[2]); if (!product) return send(404, { error: 'Product not found.' })
    const change = Number(body.changeAmount); if (!Number.isInteger(change) || Math.abs(change) > 100000) return send(400, { error: 'changeAmount must be a valid whole number.' })
    const changed = await sql`WITH prior AS (
        SELECT record_id, COALESCE((payload->>'stock')::int, 0) AS previous_stock
        FROM app_records WHERE bucket = 'products' AND record_id = ${parts[2]} FOR UPDATE
      ), updated AS (
        UPDATE app_records AS record SET payload = jsonb_set(record.payload, '{stock}',
          to_jsonb(GREATEST(0, prior.previous_stock + ${change})), true), updated_at = now()
        FROM prior WHERE record.bucket = 'products' AND record.record_id = prior.record_id
        RETURNING prior.previous_stock, record.payload
      ) SELECT previous_stock, COALESCE((payload->>'stock')::int, 0) AS new_stock, payload->>'name' AS name FROM updated`
    if (!changed.length) return send(404, { error: 'Product not found.' })
    const { previous_stock: previousStock, new_stock: newStock, name } = changed[0]
    const entry = { id: idOf(null,'led'), productId: parts[2], productName: name, changeAmount: change, previousStock, newStock, reason: sanitizeString(body.reason || '', 250), date: new Date().toISOString(), user: user.name }
    await put(sql, 'inventoryLedger', entry.id, entry); return send(200, { productId: parts[2], previousStock, newStock })
  }
  if (parts[1] === 'promotions' && parts[3] === 'toggle' && method === 'POST') {
    await admin(); const promo = await one(sql,'promotionsList',parts[2]); if (!promo) return send(404,{error:'Promotion not found.'}); promo.active = !promo.active; await put(sql,'promotionsList',parts[2],promo); return send(200,{success:true,toggledId:parts[2]})
  }
  if (parts[1] === 'promotions' && parts[3] === 'increment-usage' && method === 'POST') {
    const promo = await one(sql,'promotionsList',parts[2]); if (promo) await inc(sql,'promotionsList',parts[2],'usageCount'); return send(200,{success:true,incrementedId:parts[2]})
  }
  if (parts[1] === 'navigation' && method === 'PUT') {
    await admin(); const existing = (await rows(sql,'navigationConfig'))[0] || {}; const next = { ...existing, ...body }; await put(sql,'navigationConfig','main',next); return send(200,{success:true})
  }
  if (parts[1] === 'inquiries' || parts[1] === 'auth' || parts[1] === 'orders' || parts[1] === 'users' || parts[1] === 'security') return send(405,{error:'Method not allowed.'})
  return send(404, { error: 'Not found.' })
}
