import { useState, useMemo } from 'react'
import tools from '../data/tools.json'
import FilterBar from './FilterBar.jsx'
import ToolCard from './ToolCard.jsx'
import ToolModal from './ToolModal.jsx'

const VERDICT_ORDER = { avoid: 0, caution: 1, safe: 2 }

export default function Directory() {
  const [category, setCategory] = useState('all')
  const [verdict, setVerdict] = useState('all')
  const [selectedTool, setSelectedTool] = useState(null)

  const filtered = useMemo(() => {
    return tools
      .filter((t) => {
        const catMatch = category === 'all' || t.category === category
        const verdictMatch = verdict === 'all' || t.verdict === verdict
        return catMatch && verdictMatch
      })
      .sort((a, b) => VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict])
  }, [category, verdict])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">AI Tool Directory</h2>
        <p className="text-sm text-slate-500">
          {tools.length} tools reviewed · click any card for a full breakdown · scores based on public privacy policies and independent research
        </p>
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
            onClick={() => { setCategory('all'); setVerdict('all') }}
            className="mt-3 text-sm text-sky-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-4">Showing {filtered.length} of {tools.length} tools</p>
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
