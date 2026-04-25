const VERDICT_STYLES = {
  safe: { badge: 'bg-emerald-100 text-emerald-800', label: 'Safe', dot: 'bg-emerald-500' },
  caution: { badge: 'bg-amber-100 text-amber-800', label: 'Caution', dot: 'bg-amber-500' },
  avoid: { badge: 'bg-red-100 text-red-800', label: 'Avoid', dot: 'bg-red-500' },
}

const CATEGORY_STYLES = {
  Chat: 'bg-sky-100 text-sky-700',
  Writing: 'bg-blue-100 text-blue-700',
  Image: 'bg-purple-100 text-purple-700',
  Video: 'bg-orange-100 text-orange-700',
  Voice: 'bg-pink-100 text-pink-700',
  Productivity: 'bg-indigo-100 text-indigo-700',
}

const SCORE_LABELS = [
  { key: 'privacy', label: 'Privacy' },
  { key: 'dataUse', label: 'Data Use' },
  { key: 'transparency', label: 'Transparency' },
  { key: 'quality', label: 'Quality' },
]

function scoreBarColor(score) {
  if (score <= 2) return 'bg-red-400'
  if (score === 3) return 'bg-amber-400'
  return 'bg-emerald-500'
}

export default function ToolCard({ tool, onClick }) {
  const verdict = VERDICT_STYLES[tool.verdict] ?? VERDICT_STYLES.caution
  const categoryStyle = CATEGORY_STYLES[tool.category] ?? 'bg-slate-100 text-slate-700'
  const topFlags = tool.flags?.slice(0, 2) ?? []

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-900">{tool.name}</span>
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-sky-600 transition-colors"
                aria-label={`Visit ${tool.name}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">{tool.oneliner}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${verdict.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${verdict.dot}`} />
          {verdict.label}
        </span>
      </div>

      <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle}`}>
        {tool.category}
      </span>

      <div className="space-y-2">
        {SCORE_LABELS.map(({ key, label }) => {
          const score = tool.scores?.[key] ?? 0
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${scoreBarColor(score)}`} style={{ width: `${(score / 5) * 100}%` }} />
              </div>
              <span className="text-xs font-medium text-slate-600 w-6 text-right">{score}/5</span>
            </div>
          )
        })}
      </div>

      {topFlags.length > 0 && (
        <ul className="space-y-1 border-t border-slate-100 pt-3">
          {topFlags.map((flag, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-snug">
              <span className="text-slate-400 mt-0.5 shrink-0">•</span>
              {flag}
            </li>
          ))}
        </ul>
      )}

      {onClick && (
        <p className="text-xs text-sky-600 font-medium">Tap for full analysis →</p>
      )}
    </div>
  )
}
