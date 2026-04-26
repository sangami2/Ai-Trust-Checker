import { useState } from 'react'

const MAX_CHARS = 30000

const VERDICT_STYLES = {
  safe: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bar: 'bg-emerald-500',
    label: 'Safe',
    icon: '✓',
  },
  caution: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    bar: 'bg-amber-500',
    label: 'Use with Caution',
    icon: '⚠',
  },
  avoid: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    bar: 'bg-red-500',
    label: 'Avoid',
    icon: '✕',
  },
}

const FLAG_STYLES = {
  red: 'bg-red-50 text-red-800 border border-red-200',
  yellow: 'bg-amber-50 text-amber-800 border border-amber-200',
  green: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
}

const FLAG_ORDER = { red: 0, yellow: 1, green: 2 }

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-sky-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function PolicyAnalyzer() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const charCount = text.length
  const overLimit = charCount > MAX_CHARS

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || loading || overLimit) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policyText: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Could not reach the server. Make sure the app is running correctly.')
    } finally {
      setLoading(false)
    }
  }

  const verdict = result ? VERDICT_STYLES[result.verdict] : null
  const sortedFlags = result
    ? [...result.flags].sort((a, b) => FLAG_ORDER[a.level] - FLAG_ORDER[b.level])
    : []

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Policy Analyzer</h2>
        <p className="text-sm text-slate-500">
          Paste any AI tool's privacy policy and get a plain-English breakdown of what it means for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a privacy policy here… (up to 30,000 characters)"
            rows={10}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent resize-y leading-relaxed ${
              overLimit
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 focus:ring-sky-500'
            }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`text-xs ${
              overLimit ? 'text-red-600 font-semibold' : 'text-slate-400'
            }`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            {overLimit && ' — please trim before submitting'}
          </span>

          <button
            type="submit"
            disabled={!text.trim() || loading || overLimit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Spinner />}
            {loading ? 'Analyzing…' : 'Check this policy'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <strong>Something went wrong:</strong> {error}
        </div>
      )}

      {result && verdict && (
        <div className="mt-8 space-y-6">
          <div className={`rounded-xl border px-5 py-4 ${verdict.badge}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold">{verdict.icon}</span>
              <span className="text-base font-bold">{verdict.label}</span>
            </div>
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Privacy Score
              </span>
              <span className="text-sm font-bold text-slate-800">{result.score} / 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${verdict.bar}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>High risk</span>
              <span>Low risk</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Key Findings
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortedFlags.map((flag, i) => (
                <span
                  key={i}
                  className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium leading-snug ${FLAG_STYLES[flag.level]}`}
                >
                  {flag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
