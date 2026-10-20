import { handleVercelApi } from '../server/vercelApi.js'

export default async function handler(req, res) {
  try {
    await handleVercelApi(req, res)
  } catch (error) {
    console.error('API request failed:', error)
    if (!res.headersSent) res.status(error.status || 500).json({ error: error.status ? error.message : 'The request could not be completed.' })
  }
}
