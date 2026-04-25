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

export default function FilterBar({ category, verdict, onCategory, onVerdict }) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide w-16 shrink-0">
          Category
        </span>
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
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide w-16 shrink-0">
          Rating
        </span>
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
      </div>
    </div>
  )
}
