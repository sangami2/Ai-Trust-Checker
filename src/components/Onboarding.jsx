import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'ai-trust-tour-v1-done'
const PAD = 6
const TOOLTIP_W = 292

const STEPS = [
  {
    target: null,
    placement: 'center',
    welcome: true,
    title: "Know what you're agreeing to.",
    body: 'Most people sign up to AI tools without reading a word of the privacy policy. AI Trust Checker breaks it all down — so you can make an informed choice in seconds.',
  },
  {
    target: '[data-tour="tab-directory"]',
    placement: 'bottom',
    title: 'AI Tool Directory',
    body: '50 popular AI tools, each scored on Privacy, Data Use, Transparency, and Quality. Click any card for a full breakdown.',
  },
  {
    target: '[data-tour="filter-bar"]',
    placement: 'bottom',
    title: 'Filter by Category & Rating',
    body: 'Filter by category (Chat, Writing, Image...) or by verdict (Safe, Caution, Avoid) to narrow down what you care about.',
  },
  {
    target: '[data-tour="sort-select"]',
    placement: 'left',
    title: 'Sort the Results',
    body: 'Sort by riskiest first, safest first, alphabetically, or by score — whatever makes comparing easiest.',
  },
  {
    target: '[data-tour="tab-lookup"]',
    placement: 'bottom',
    title: 'Look Up Any Tool',
    body: "Paste any AI tool's URL and get an instant trust card — even tools not in our directory.",
  },
  {
    target: '[data-tour="tab-analyzer"]',
    placement: 'bottom',
    title: 'Policy Analyzer',
    body: 'Paste any privacy policy text and get a plain-English verdict, risk score, and color-coded key findings — powered by Claude AI.',
  },
  {
    target: null,
    placement: 'center',
    title: 'Built by Akash Sangami',
    body: "This tool is free, requires no account, and never stores your data. If you find it useful — or just want to chat — I'd love to connect!",
    cta: { label: 'Connect on LinkedIn', href: 'https://www.linkedin.com/in/akashsangami' },
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [rect, setRect] = useState(null)
  // spotRect drives the spotlight position — initialized to center so it glides outward
  const [spotRect, setSpotRect] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const measureTarget = useCallback(() => {
    const s = STEPS[step]
    if (!s.target) {
      setRect(null)
      return
    }
    const el = document.querySelector(s.target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      const r = el.getBoundingClientRect()
      setRect(r)
      // If coming from a centered step (spotRect null), first place spotlight at
      // screen center so CSS transition glides it to the target instead of jumping
      setSpotRect(prev => {
        if (!prev) {
          const cr = {
            top: window.innerHeight / 2 - 50,
            left: window.innerWidth / 2 - 100,
            width: 200,
            height: 100,
          }
          // After one frame, update to real target so transition fires
          requestAnimationFrame(() => setSpotRect(r))
          return cr
        }
        return r
      })
    }
  }, [step])

  useEffect(() => {
    if (!visible) return
    measureTarget()
    const onResize = () => measureTarget()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [visible, measureTarget])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else dismiss()
  }

  function prev() {
    if (step > 0) setStep(step - 1)
  }

  if (!visible) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const isCentered = current.placement === 'center'

  // Tooltip position
  let tipTop = 0
  let tipLeft = 0
  if (!isCentered && rect) {
    const gap = 14
    const vw = window.innerWidth
    const vh = window.innerHeight
    switch (current.placement) {
      case 'bottom':
        tipTop = rect.bottom + PAD + gap
        tipLeft = rect.left + rect.width / 2 - TOOLTIP_W / 2
        break
      case 'top':
        tipTop = rect.top - PAD - gap - 200
        tipLeft = rect.left + rect.width / 2 - TOOLTIP_W / 2
        break
      case 'left':
        tipTop = rect.top - PAD
        tipLeft = rect.left - PAD - TOOLTIP_W - gap
        break
      case 'right':
        tipTop = rect.top - PAD
        tipLeft = rect.right + PAD + gap
        break
    }
    tipLeft = Math.max(8, Math.min(tipLeft, vw - TOOLTIP_W - 8))
    tipTop = Math.max(8, Math.min(tipTop, vh - 260))
  }

  const TRANSITION = 'top 0.35s cubic-bezier(0.4,0,0.2,1), left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1)'

  return (
    <>
      <style>{`
        @keyframes tourSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tour-card-enter { animation: tourSlideIn 0.22s ease forwards; }
      `}</style>

      {/* Click-to-dismiss */}
      <div className="fixed inset-0 z-[49]" onClick={dismiss} />

      {/* Full backdrop for centered steps */}
      {isCentered && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={dismiss} />
      )}

      {/* Spotlight for targeted steps — slides from center on first appearance */}
      {!isCentered && spotRect && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            top: spotRect.top - PAD,
            left: spotRect.left - PAD,
            width: spotRect.width + PAD * 2,
            height: spotRect.height + PAD * 2,
            borderRadius: 12,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.58)',
            border: '2px solid rgba(56,189,248,0.8)',
            transition: TRANSITION,
          }}
        />
      )}

      {/* Centered card (welcome / last step) */}
      {isCentered && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
          <div key={step} className="tour-card-enter pointer-events-auto w-full max-w-sm">
            <Card
              current={current}
              step={step}
              isLast={isLast}
              onDismiss={dismiss}
              onNext={next}
              onPrev={prev}
              onGoTo={setStep}
              centered
            />
          </div>
        </div>
      )}

      {/* Positioned tooltip card */}
      {!isCentered && rect && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{ top: tipTop, left: tipLeft, width: TOOLTIP_W, transition: TRANSITION }}
        >
          <div key={step} className="tour-card-enter pointer-events-auto">
            <Card
              current={current}
              step={step}
              isLast={isLast}
              onDismiss={dismiss}
              onNext={next}
              onPrev={prev}
              onGoTo={setStep}
            />
          </div>
        </div>
      )}
    </>
  )
}

function Card({ current, step, isLast, onDismiss, onNext, onPrev, onGoTo, centered }) {
  const isWelcome = current.welcome

  if (isWelcome) {
    return (
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-4 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip
        </button>

        <div className="mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-3 leading-tight">{current.title}</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-7">{current.body}</p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onDismiss}
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={onNext}
            className="flex-[2] px-5 py-2.5 rounded-xl bg-sky-600 text-white text-[13px] font-semibold hover:bg-sky-700 transition-colors"
          >
            Take the tour →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-white rounded-2xl shadow-2xl p-5 flex flex-col ${centered ? 'items-center text-center' : ''}`}>
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
      >
        Skip
      </button>

      <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1.5">
        {step} of {STEPS.length - 1}
      </p>

      <h3 className={`text-sm font-bold text-slate-900 mb-2 ${centered ? '' : 'pr-8'}`}>{current.title}</h3>
      <p className="text-[13px] text-slate-500 leading-relaxed mb-4">{current.body}</p>

      {current.cta && (
        <a
          href={current.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-sky-50 text-sky-700 text-[13px] font-semibold hover:bg-sky-100 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          {current.cta.label}
        </a>
      )}

      <div className="flex items-center gap-1.5 mb-4">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className={`rounded-full transition-all duration-200 ${
              i === step ? 'w-4 h-2 bg-sky-500' : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 w-full">
        {step > 0 && (
          <button
            onClick={onPrev}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 px-3 py-2 rounded-xl bg-sky-600 text-white text-[13px] font-semibold hover:bg-sky-700 transition-colors"
        >
          {isLast ? 'Get started' : 'Next'}
        </button>
      </div>
    </div>
  )
}
