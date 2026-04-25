import { useState } from 'react'
import Directory from './components/Directory.jsx'
import ToolLookup from './components/ToolLookup.jsx'
import PolicyAnalyzer from './components/PolicyAnalyzer.jsx'

const TABS = [
  { id: 'directory', label: 'Directory' },
  { id: 'lookup', label: 'Look Up a Tool' },
  { id: 'analyzer', label: 'Policy Analyzer' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl font-bold tracking-tight">AI Trust Checker</h1>
          </div>
          <p className="text-slate-400 text-sm ml-10">
            Know what AI tools do with your data — in plain English, no legal speak.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sky-400 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'directory' && <Directory />}
        {activeTab === 'lookup' && <ToolLookup />}
        {activeTab === 'analyzer' && <PolicyAnalyzer />}
      </main>
    </div>
  )
}
