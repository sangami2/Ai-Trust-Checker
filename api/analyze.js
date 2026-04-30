import Anthropic from '@anthropic-ai/sdk'

const MAX_CHARS = 30000
const MAX_PAGE_CHARS = 20000

const SYSTEM_PROMPT = `You are a privacy policy analyst. Analyze the policy and return ONLY valid JSON — no markdown, no backticks, nothing else:
{"verdict":"safe|caution|avoid","summary":"one plain-English sentence bottom line","score":0,"flags":[{"level":"red|yellow|green","label":"short plain-English finding"}]}
Score 70-100 = safe, 40-69 = caution, 0-39 = avoid. Verdict must match score range.
Check: data selling, third-party sharing, retention periods, opt-out rights, children's data, AI training use, account deletion rights, location tracking, behavioral profiling.
Red = serious concern, yellow = moderate concern, green = positive practice. 4-8 flags, sorted red first. Return ONLY the JSON object.`

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isValidUrl(str) {
  try {
    const parsed = new URL(str)
    if (!['http:', 'https:'].includes(parsed.protocol)) return false
    const host = parsed.hostname.toLowerCase()
    if (host === 'localhost') return false
    if (/^127\./.test(host)) return false
    if (/^10\./.test(host)) return false
    if (/^192\.168\./.test(host)) return false
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false
    return true
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { policyText } = req.body ?? {}
  if (!policyText?.trim()) {
    return res.status(400).json({ error: 'No policy text provided.' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on the server.' })
  }

  try {
    let content = policyText.trim()

    // If input looks like a URL, fetch the page and extract text
    if (isValidUrl(content)) {
      const pageRes = await fetch(content, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
      })
      if (!pageRes.ok) {
        return res.status(400).json({ error: `Could not fetch that page (status ${pageRes.status}). Try pasting the privacy policy text directly instead.` })
      }
      const html = await pageRes.text()
      content = stripHtml(html).slice(0, MAX_PAGE_CHARS)
    } else {
      content = content.slice(0, MAX_CHARS)
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    })

    const raw = message.content[0].text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '')
    const result = JSON.parse(raw)
    return res.json(result)
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return res.status(408).json({ error: 'The page took too long to load. Try pasting the privacy policy text directly instead.' })
    }
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'The AI returned an unexpected response. Please try again.' })
    }
    return res.status(500).json({ error: err.message || 'Something went wrong. Please try again.' })
  }
}
