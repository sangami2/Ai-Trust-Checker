const CATEGORIES = ['Chat', 'Writing', 'Image', 'Video', 'Voice', 'Productivity']

const VERDICTS = [
  { value: 'all', label: 'All' },
  { value: 'safe', label: 'Safe' },
  { value: 'caution', label: 'Caution' },
  { value: 'avoid', label: 'Avoid' },
]

const VERDICT_ACTIVE = {
  all: 'bg-slate-700 text-white',
  safe: 'bg-emerald-600 text-white',
  caution: 'bg-amber-500 text-white',
  avoid: 'bg-red-600 text-white',
}

function FilterRow({ label, children }) {
  return (
    <div className="space-y-1.5 sm:space-y-0">
      {/* Label above pills on mobile, inline on desktop */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide sm:w-16 sm:shrink-0 w-full sm:w-auto">
          {label}
        </span>
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function FilterBar({ category, verdict, onCategory, onVerdict }) {
  return (
    <div data-tour="filter-bar" className="space-y-3 mb-6">

      {/* Category */}
      <FilterRow label="Category">
        <button
          onClick={() => onCategory('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
            category === 'all'
              ? 'bg-slate-700 text-white border-slate-700'
              : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              category === cat
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </FilterRow>

      {/* Verdict */}
      <FilterRow label="Rating">
        {VERDICTS.map((v) => (
          <button
            key={v.value}
            onClick={() => onVerdict(v.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              verdict === v.value
                ? `${VERDICT_ACTIVE[v.value]} border-transparent`
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            {v.label}
          </button>
        ))}
      </FilterRow>

    </div>
  )
}
