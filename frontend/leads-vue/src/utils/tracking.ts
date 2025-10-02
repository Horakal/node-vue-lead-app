const STORAGE_KEY = 'campaign_tracking'
const KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
]

export function persistUtmsFromUrl(ttlDays = 30) {
  try {
    const params = new URLSearchParams(window.location.search)
    const data: Record<string, string> = {}
    let has = false
    for (const k of KEYS) {
      const v = params.get(k)
      if (v) {
        data[k] = v
        has = true
      }
    }
    if (!has) return
    const expires = Date.now() + ttlDays * 24 * 60 * 60 * 1000
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, expires }))
  } catch {}
}

export function readPersistedUtms(): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.expires) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    if (Date.now() > parsed.expires) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed.data as Record<string, string>
  } catch {
    return null
  }
}

export function clearPersistedUtms() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
