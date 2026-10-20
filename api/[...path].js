import { handleVercelApi } from '../server/vercelApi.js'

export default async function handler(req, res) {
  try {
    await handleVercelApi(req, res)
  } catch (error) {
    const message = String(error?.message || '')
    const cause = String(error?.cause?.message || '')
    const databaseUnavailable = !error?.status && (String(error?.code || '').startsWith('PGRST') || /SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|Supabase table check|fetch failed|Failed to fetch|Invalid API key/i.test(`${message} ${cause}`))
    if (databaseUnavailable) {
      // Log diagnostic text but never log DATABASE_URL or its credentials.
      console.error('Supabase database request failed:', { name: error?.name, message, cause, code: error?.code })
      if (!res.headersSent) res.status(503).json({
        error: 'Supabase is unavailable. Check SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and that the app_records table and RPC functions are installed.',
        code: 'DATABASE_UNAVAILABLE'
      })
      return
    }
    console.error('API request failed:', error)
    if (!res.headersSent) res.status(error.status || 500).json({ error: error.status ? error.message : 'The request could not be completed.' })
  }
}
