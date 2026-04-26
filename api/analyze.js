import Anthropic from '@anthropic-ai/sdk'

const MAX_CHARS = 30000

// Compact prompt keeps token cost low while covering all key risk signals
const SYSTEM_PROMPT = `You are a privacy policy analyst. Analyze the policy and return ONLY valid JSON — no markdown, no backticks, nothing else:
{"verdict":"safe|caution|avoid","summary":"one plain-English sentence bottom line","score":0,"flags":[{"level":"red|yellow|green","label":"short plain-English finding"}]}
Score 70-100 = safe, 40-69 = caution, 0-39 = avoid. Verdict must match score range.
Check: data selling, third-party sharing, retention periods, opt-out rights, children's data, AI training use, account deletion rights, location tracking, behavioral profiling.
Red = serious concern, yellow = moderate concern, green = positive practice. 4-8 flags, sorted red first. Return ONLY the JSON object.`

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
    const truncated = policyText.slice(0, MAX_CHARS)
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: truncated }],
    })

    const raw = message.content[0].text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '')
    const result = JSON.parse(raw)
    return res.json(result)
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'The AI returned an unexpected response. Please try again.' })
    }
    return res.status(500).json({ error: err.message || 'Something went wrong. Please try again.' })
  }
}
