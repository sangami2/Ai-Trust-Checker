import { useState } from 'react'
import ToolCard from './ToolCard.jsx'
import ToolModal from './ToolModal.jsx'

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function ToolLookup() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [selectedTool, setSelectedTool] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
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

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Look Up Any AI Tool</h2>
        <p className="text-sm text-slate-500">
          Paste the link to any AI tool's website and we'll analyse it and generate a trust card.
          Works best with the tool's homepage or privacy policy page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://some-ai-tool.com"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!url.trim() || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {loading ? <Spinner /> : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          )}
          {loading ? 'Analysing…' : 'Analyse'}
        </button>
      </form>

      <p className="mt-2 text-xs text-slate-400">
        The analysis is AI-generated based on publicly available page content — treat it as a starting point, not a definitive verdict.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <strong>Couldn't analyse that URL:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Analysis Result</p>
          <div className="max-w-sm">
            <ToolCard tool={result} onClick={() => setSelectedTool(result)} />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Click the card to see the full breakdown.
          </p>
        </div>
      )}

      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  )
}
