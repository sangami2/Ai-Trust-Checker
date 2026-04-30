import Anthropic from '@anthropic-ai/sdk'

const MAX_PAGE_CHARS = 6000

const SYSTEM_PROMPT = `You are an AI tool privacy researcher. Analyze the tool at the given URL and return ONLY valid JSON — no markdown, no backticks, nothing else:
{
  "name": "tool name",
  "category": "Chat|Writing|Image|Video|Voice|Productivity",
  "oneliner": "one sentence describing what the tool does",
  "verdict": "safe|caution|avoid",
  "scores": { "privacy": 1, "dataUse": 1, "transparency": 1, "quality": 1 },
  "flags": ["plain-English finding or concern"],
  "detail": "2-3 sentence plain-English explanation of the verdict for a non-technical audience"
}

Score each field 1-5: privacy=how well they protect your data (5=excellent), dataUse=how they use your data (5=minimal/ethical use), transparency=how clearly they explain their practices (5=very clear), quality=how good the product is (5=excellent).

If page content is provided, base your analysis on it. If not, use your training knowledge about the tool, its company, and known privacy practices. Either way, always return a complete, well-reasoned result — never refuse or return empty fields.

Verdict: safe (mostly green practices), caution (some concerns or uncertainty), avoid (significant risks).
Write 4-6 plain-English flags — mix of concerns and positives if appropriate.
Return ONLY the JSON object.`

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url)
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

  const { url } = req.body ?? {}
  if (!url?.trim()) {
    return res.status(400).json({ error: 'No URL provided.' })
  }
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Please provide a valid public URL starting with https://' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on the server.' })
  }

  try {
    let pageText = ''
    let fetchFailed = false

    try {
      const pageRes = await fetch(url, {
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
      if (pageRes.ok) {
        const html = await pageRes.text()
        pageText = stripHtml(html).slice(0, MAX_PAGE_CHARS)
      } else {
        fetchFailed = true
      }
    } catch {
      fetchFailed = true
    }

    const userContent = fetchFailed
      ? `URL: ${url}\n\nNote: The page could not be fetched directly. Use your training knowledge about this tool and its privacy practices to complete the analysis.`
      : `URL: ${url}\n\nPage content:\n${pageText}`

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const raw = message.content[0].text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '')
    const result = JSON.parse(raw)
    result.url = url
    return res.json(result)
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return res.status(408).json({ error: 'The page took too long to load. Try a different URL or use the Policy Analyzer tab.' })
    }
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'The AI returned an unexpected response. Please try again.' })
    }
    return res.status(500).json({ error: err.message || 'Something went wrong. Please try again.' })
  }
}
