import { useEffect } from 'react'

const VERDICT_STYLES = {
  safe: { badge: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', label: 'Safe', dot: 'bg-emerald-500' },
  caution: { badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', label: 'Use with Caution', dot: 'bg-amber-500' },
  avoid: { badge: 'bg-red-100 text-red-800', bar: 'bg-red-500', label: 'Avoid', dot: 'bg-red-500' },
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
  { key: 'privacy', label: 'Privacy Protection', desc: 'How well the tool protects your personal data' },
  { key: 'dataUse', label: 'Data Use', desc: 'How ethically they use data they collect' },
  { key: 'transparency', label: 'Transparency', desc: 'How clearly they explain their practices' },
  { key: 'quality', label: 'Product Quality', desc: 'How good the tool actually is at its job' },
]

function scoreBarColor(score) {
  if (score <= 2) return 'bg-red-400'
  if (score === 3) return 'bg-amber-400'
  return 'bg-emerald-500'
}

function scoreLabel(score) {
  if (score === 1) return 'Very poor'
  if (score === 2) return 'Poor'
  if (score === 3) return 'Fair'
  if (score === 4) return 'Good'
  return 'Excellent'
}

export default function ToolModal({ tool, onClose }) {
  const verdict = VERDICT_STYLES[tool.verdict] ?? VERDICT_STYLES.caution
  const categoryStyle = CATEGORY_STYLES[tool.category] ?? 'bg-slate-100 text-slate-700'

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">{tool.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryStyle}`}>
                {tool.category}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{tool.oneliner}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Verdict */}
          <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${verdict.badge}`}>
            <span className={`w-3 h-3 rounded-full shrink-0 ${verdict.dot}`} />
            <div>
              <p className="font-bold text-sm">{verdict.label}</p>
              {tool.detail && <p className="text-sm mt-0.5 leading-relaxed opacity-90">{tool.detail}</p>}
            </div>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Score Breakdown</h3>
            <div className="space-y-3">
              {SCORE_LABELS.map(({ key, label, desc }) => {
                const score = tool.scores?.[key] ?? 0
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-sm font-bold text-slate-800">{score}/5</span>
                        <p className={`text-xs font-medium ${score <= 2 ? 'text-red-500' : score === 3 ? 'text-amber-500' : 'text-emerald-600'}`}>
                          {scoreLabel(score)}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${scoreBarColor(score)}`}
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* All flags */}
          {tool.flags?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                All Findings ({tool.flags.length})
              </h3>
              <ul className="space-y-2">
                {tool.flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-snug">
                    <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Link */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Visit {tool.name}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
