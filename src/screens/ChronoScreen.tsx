import { useEffect, useRef, useState } from 'react'
import type { Route } from '../App'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import { TopBar } from '../components/TopBar'
import { pickAdaptiveFacts, buildChoices, factKey } from '../logic/mastery'

const DURATION = 60 // secondes
const TICK = 100 // ms

interface Q {
  a: number
  b: number
  choices: number[]
}

type Phase = 'intro' | 'playing' | 'done'

export function ChronoScreen({ back, navigate }: { back: () => void; navigate: (r: Route) => void }) {
  const { t } = useLanguage()
  const { tableStats, recordTableResult, addCoins, submitChronoScore, chronoBest } = useGame()

  const [phase, setPhase] = useState<Phase>('intro')
  const [timeLeftMs, setTimeLeftMs] = useState(DURATION * 1000)
  const [question, setQuestion] = useState<Q | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [isRecord, setIsRecord] = useState(false)

  // Références pour éviter les fermetures périmées.
  const statsRef = useRef(tableStats)
  const recentRef = useRef<string[]>([])
  const phaseRef = useRef<Phase>('intro')
  const advanceTimer = useRef<number | undefined>(undefined)
  useEffect(() => {
    statsRef.current = tableStats
  }, [tableStats])
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

  function nextQuestion() {
    const [fact] = pickAdaptiveFacts(statsRef.current, 1, new Set(recentRef.current))
    recentRef.current = [...recentRef.current, factKey(fact.a, fact.b)].slice(-6)
    setQuestion({ a: fact.a, b: fact.b, choices: buildChoices(fact.a, fact.b) })
    setPicked(null)
  }

  function start() {
    recentRef.current = []
    setCorrect(0)
    setTimeLeftMs(DURATION * 1000)
    setIsRecord(false)
    setPhase('playing')
    nextQuestion()
  }

  // Décompte du temps.
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      setTimeLeftMs((tm) => Math.max(0, tm - TICK))
    }, TICK)
    return () => window.clearInterval(id)
  }, [phase])

  // Fin de partie quand le temps est écoulé.
  useEffect(() => {
    if (phase === 'playing' && timeLeftMs <= 0) {
      window.clearTimeout(advanceTimer.current)
      if (correct > 0) addCoins(correct)
      setIsRecord(submitChronoScore(correct))
      setPhase('done')
    }
  }, [timeLeftMs, phase, correct, addCoins, submitChronoScore])

  function choose(choice: number) {
    if (!question || picked !== null || phaseRef.current !== 'playing') return
    const answer = question.a * question.b
    const ok = choice === answer
    setPicked(choice)
    if (ok) setCorrect((c) => c + 1)
    recordTableResult(question.a, question.b, ok)
    advanceTimer.current = window.setTimeout(() => {
      if (phaseRef.current === 'playing') nextQuestion()
    }, 300)
  }

  // --- Écran d'intro ---
  if (phase === 'intro') {
    return (
      <>
        <TopBar onBack={back} />
        <h2 className="section-title">⏱️ {t('chrono_title')}</h2>
        <div className="card stack center">
          <div style={{ fontSize: 56 }}>⚡</div>
          <p>{t('chrono_intro')}</p>
          <p className="muted">
            🏆 {t('chrono_best')} : <strong>{chronoBest}</strong>
          </p>
          <button className="btn green" onClick={start}>
            ▶ {t('chrono_start')}
          </button>
        </div>
      </>
    )
  }

  // --- Écran de fin ---
  if (phase === 'done') {
    return (
      <>
        <TopBar />
        <div className="card center stack" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 64 }}>{isRecord ? '🏆' : '⚡'}</div>
          <h2 className="section-title">{isRecord ? t('chrono_record') : t('chrono_title')}</h2>
          <p style={{ fontSize: 40, fontFamily: 'Anton, sans-serif' }}>{correct}</p>
          <p className="muted">
            🏆 {t('chrono_best')} : <strong>{Math.max(chronoBest, correct)}</strong>
          </p>
          <div className="row" style={{ justifyContent: 'center', color: '#e0a500', fontWeight: 700, fontSize: 20 }}>
            {t('results_earned')} +{correct} 🪙
          </div>
        </div>
        <div className="stack" style={{ marginTop: 20 }}>
          <button className="btn green" onClick={start}>
            🔁 {t('replay')}
          </button>
          <button className="btn secondary" onClick={() => navigate({ name: 'tables' })}>
            📊 {t('tables_view_panorama')}
          </button>
        </div>
      </>
    )
  }

  // --- Écran de jeu ---
  const seconds = Math.ceil(timeLeftMs / 1000)
  const answer = question ? question.a * question.b : 0
  return (
    <>
      <TopBar onBack={back} />
      <div className="chrono-hud">
        <span>⚡ {correct}</span>
        <div className="chrono-bar">
          <div className="chrono-bar-fill" style={{ width: `${(timeLeftMs / (DURATION * 1000)) * 100}%` }} />
        </div>
        <span className={seconds <= 10 ? 'chrono-low' : ''}>⏱ {seconds}s</span>
      </div>

      {question && (
        <>
          <div className="card center" style={{ marginTop: 8 }}>
            <div className="prompt-big">
              {question.a} × {question.b}
            </div>
          </div>
          <div className="choices">
            {question.choices.map((choice, i) => {
              const state =
                picked !== null ? (choice === answer ? 'correct' : choice === picked ? 'wrong' : '') : ''
              return (
                <button
                  key={`${choice}-${i}`}
                  className={`choice ${state}`}
                  disabled={picked !== null}
                  onClick={() => choose(choice)}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
