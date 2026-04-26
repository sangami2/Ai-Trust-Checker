import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Directory from './components/Directory.jsx'
import ToolLookup from './components/ToolLookup.jsx'
import PolicyAnalyzer from './components/PolicyAnalyzer.jsx'
import Footer from './components/Footer.jsx'
import Logo from './components/Logo.jsx'

const TABS = [
  { id: 'directory', label: 'Directory' },
  { id: 'lookup', label: 'Look Up a Tool' },
  { id: 'analyzer', label: 'Policy Analyzer' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <header className="relative bg-[#04060f] text-white overflow-hidden shrink-0">

        {/* ── Aurora background ── */}
        <div className="pointer-events-none absolute inset-0">
          {/* Left orb — sky */}
          <div className="absolute -top-40 -left-32 w-[700px] h-[500px] rounded-full bg-sky-500/[0.18] blur-[130px]" />
          {/* Right orb — indigo */}
          <div className="absolute -top-24 -right-24 w-[580px] h-[420px] rounded-full bg-indigo-600/[0.16] blur-[110px]" />
          {/* Bottom centre — violet, keeps the tab bar moody */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[180px] rounded-full bg-violet-700/[0.12] blur-[90px]" />
          {/* Noise overlay for texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px',
            }}
          />
        </div>

        {/* ── Top gradient line ── */}
        <div className="relative h-[2px] bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-500" />

        {/* ── Byline — top right ── */}
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex justify-end pt-3.5">
            <a
              href="https://www.linkedin.com/in/akashsangami"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-md transition-all hover:border-white/[0.18] hover:bg-white/[0.08]"
            >
              <span className="text-[11px] text-slate-500">by</span>
              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors">
                Akash Sangami
              </span>
              {/* LinkedIn icon */}
              <svg className="h-3 w-3 text-sky-400 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Brand row ── */}
        <div className="relative max-w-6xl mx-auto px-4 pt-5 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">

            {/* Logo + wordmark */}
            <div className="flex items-center gap-4">
              {/* Logo glow halo */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 scale-[1.8] rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-500/30 blur-2xl" />
                <Logo size={50} />
              </div>

              <div>
                <h1 className="text-[1.85rem] font-black tracking-tight leading-none text-white">
                  AI Trust Checker
                </h1>
                <p className="mt-2 text-sm leading-snug text-slate-400 max-w-sm">
                  Look up any AI tool. Paste any privacy policy.<br />
                  <span className="text-slate-300">Know exactly what you're agreeing to.</span>
                </p>
              </div>
            </div>

            {/* Glass stat pills */}
            <div className="flex flex-wrap items-center gap-2 sm:pb-0.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
                <span className="text-xs font-medium text-slate-300">50 tools reviewed</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_2px_rgba(56,189,248,0.5)]" />
                <span className="text-xs font-medium text-slate-300">Free · No account</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="relative border-t border-white/[0.07]">
          {/* subtle glass sheen on tab bar */}
          <div className="absolute inset-0 bg-white/[0.015] backdrop-blur-sm" />
          <div className="relative max-w-6xl mx-auto px-4">
            <nav className="flex">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {/* Active tab glass bg */}
                  {activeTab === tab.id && (
                    <span className="absolute inset-x-0 inset-y-1 rounded-lg bg-white/[0.07]" />
                  )}
                  <span className="relative">{tab.label}</span>
                  {/* Active underline */}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">
        {activeTab === 'directory' && <Directory />}
        {activeTab === 'lookup' && <ToolLookup />}
        {activeTab === 'analyzer' && <PolicyAnalyzer />}
      </main>

      <Footer />
      <Analytics />
    </div>
  )
}
