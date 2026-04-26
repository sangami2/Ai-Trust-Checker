import { useState, useMemo } from 'react'
import tools from '../data/tools.json'
import FilterBar from './FilterBar.jsx'
import ToolCard from './ToolCard.jsx'
import ToolModal from './ToolModal.jsx'

const VERDICT_ORDER = { avoid: 0, caution: 1, safe: 2 }
const VERDICT_ORDER_SAFE_FIRST = { safe: 0, caution: 1, avoid: 2 }

const SORT_OPTIONS = [
  { value: 'risk-first', label: 'Riskiest first' },
  { value: 'safe-first', label: 'Safest first' },
  { value: 'a-z',        label: 'A → Z' },
  { value: 'z-a',        label: 'Z → A' },
  { value: 'top-rated',  label: 'Top rated' },
  { value: 'low-rated',  label: 'Lowest rated' },
]

function avgScore(t) {
  const s = t.scores
  return (s.privacy + s.dataUse + s.transparency + s.quality) / 4
}

export default function Directory() {
  const [category, setCategory] = useState('all')
  const [verdict, setVerdict] = useState('all')
  const [sort, setSort] = useState('risk-first')
  const [search, setSearch] = useState('')
  const [selectedTool, setSelectedTool] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = tools.filter((t) => {
      const catMatch = category === 'all' || t.category === category
      const verdictMatch = verdict === 'all' || t.verdict === verdict
      const searchMatch = !q || t.name.toLowerCase().includes(q) || t.oneliner.toLowerCase().includes(q)
      return catMatch && verdictMatch && searchMatch
    })

    return list.sort((a, b) => {
      switch (sort) {
        case 'risk-first': return VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict]
        case 'safe-first': return VERDICT_ORDER_SAFE_FIRST[a.verdict] - VERDICT_ORDER_SAFE_FIRST[b.verdict]
        case 'a-z':        return a.name.localeCompare(b.name)
        case 'z-a':        return b.name.localeCompare(a.name)
        case 'top-rated':  return avgScore(b) - avgScore(a)
        case 'low-rated':  return avgScore(a) - avgScore(b)
        default:           return 0
      }
    })
  }, [category, verdict, sort, search])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">AI Tool Directory</h2>
        <p className="text-sm text-slate-500">
          {tools.length} tools reviewed · click any card for a full breakdown · scores based on public privacy policies and independent research
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools by name or description…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <FilterBar
        category={category}
        verdict={verdict}
        onCategory={setCategory}
        onVerdict={setVerdict}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No tools match these filters.</p>
          <button
            onClick={() => { setCategory('all'); setVerdict('all'); setSearch('') }}
            className="mt-3 text-sm text-sky-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-400">Showing {filtered.length} of {tools.length} tools</p>
            <div data-tour="sort-select" className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Sort
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => (
              <ToolCard key={tool.name} tool={tool} onClick={() => setSelectedTool(tool)} />
            ))}
          </div>
        </>
      )}

      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  )
}
