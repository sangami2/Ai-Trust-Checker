const POINTS = [
  { icon: '🚫', text: 'We never store what you submit — text and URLs are processed in real-time and immediately discarded.' },
  { icon: '🍪', text: 'No cookies, no tracking, no analytics scripts, no ads. Ever.' },
  { icon: '👤', text: 'No account or login needed to use any feature.' },
  { icon: '🤖', text: 'Analysis is powered by Anthropic\'s Claude API. Your input is subject to Anthropic\'s privacy policy — not ours, because we don\'t keep it.' },
  { icon: '🔓', text: 'Fully open source. Read every line of code on GitHub.' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-slate-800 mb-1">How we handle your data</h2>
          <p className="text-xs text-slate-500">
            Short version: we don't. Here's the full picture.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {POINTS.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-xl px-4 py-3">
              <span className="text-base shrink-0 mt-0.5">{p.icon}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            AI Trust Checker is free, open source, and has no business model built on your data.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sangami2/Ai-Trust-Checker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View source on GitHub
            </a>
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Anthropic privacy policy ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
