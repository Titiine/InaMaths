import { useMemo, useState } from 'react'
import type { Route } from '../App'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import { TopBar } from '../components/TopBar'
import { pickAdaptiveFacts, FACTORS } from '../logic/mastery'
import type { Fact } from '../logic/mastery'

const SESSION_SIZE = 8
const COINS_PER_CORRECT = 2

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildChoices(a: number, b: number): number[] {
  const answer = a * b
  const candidates = [
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    a * (b + 1),
    a * (b - 1),
    (a + 1) * b,
    answer + 10,
  ]
  const distractors = new Set<number>()
  for (const c of shuffle(candidates)) {
    if (c > 0 && c !== answer) distractors.add(c)
    if (distractors.size >= 3) break
  }
  let extra = answer + 3
  while (distractors.size < 3) {
    if (extra !== answer && extra > 0) distractors.add(extra)
    extra++
  }
  return shuffle([answer, ...distractors])
}

interface Q extends Fact {
  choices: number[]
}

function shuffledFactors(): number[] {
  return shuffle(FACTORS)
}

export function MultiplicationScreen({
  table,
  back,
  navigate,
}: {
  table?: number
  back: () => void
  navigate: (r: Route) => void
}) {
  const { t } = useLanguage()
  const { tableStats, recordTableResult, addCoins } = useGame()

  // Questions figées au montage : soit une table précise, soit une sélection
  // adaptative qui cible les faits les moins sûrs.
  const questions = useMemo<Q[]>(() => {
    let facts: Fact[]
    if (table) {
      // Table précise : chaque facteur 2..10 une fois, dans un ordre mélangé
      // (complété si besoin pour atteindre la taille de séance).
      const order = shuffledFactors()
      while (order.length < SESSION_SIZE) order.push(...shuffledFactors())
      facts = order.slice(0, SESSION_SIZE).map((b) => ({ a: table, b }))
    } else {
      facts = pickAdaptiveFacts(tableStats, SESSION_SIZE)
    }
    return facts.map((f) => ({ ...f, choices: buildChoices(f.a, f.b) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const q = questions[index]
  const answered = picked !== null
  const answer = q ? q.a * q.b : 0
  const isCorrect = picked === answer

  function choose(choice: number) {
    if (answered) return
    setPicked(choice)
    const correct = choice === answer
    if (correct) setScore((s) => s + 1)
    recordTableResult(q.a, q.b, correct)
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setPicked(null)
    } else {
      if (score > 0) addCoins(score * COINS_PER_CORRECT)
      setDone(true)
    }
  }

  if (done) {
    return (
      <>
        <TopBar />
        <div className="card center stack" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 64 }}>{score === questions.length ? '🏆' : '💪'}</div>
          <h2 className="section-title">{t('tables_session_done')}</h2>
          <p style={{ fontSize: 22, fontWeight: 700 }}>
            {t('results_score')} : {score} / {questions.length}
          </p>
          <div className="row" style={{ justifyContent: 'center', color: '#e0a500', fontWeight: 700, fontSize: 20 }}>
            {t('results_earned')} +{score * COINS_PER_CORRECT} 🪙
          </div>
        </div>
        <div className="stack" style={{ marginTop: 20 }}>
          <button className="btn green" onClick={() => navigate({ name: 'tables' })}>
            📊 {t('tables_view_panorama')}
          </button>
          <button className="btn secondary" onClick={() => navigate({ name: 'home' })}>
            🏠 {t('home_hello')}
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar onBack={back} />
      {table && (
        <h2 className="section-title center" style={{ marginBottom: 6 }}>
          ✖️ {t('tables_table_of')} {table}
        </h2>
      )}
      <div className="progress-dots">
        {questions.map((_, i) => (
          <span key={i} className={`dot ${i < index ? 'done' : i === index ? 'current' : ''}`} />
        ))}
      </div>
      <p className="muted center">
        {t('question')} {index + 1} / {questions.length}
      </p>

      <div className="card center" style={{ marginTop: 8 }}>
        <div className="prompt-big">
          {q.a} × {q.b}
        </div>
      </div>

      <div className="choices">
        {q.choices.map((choice, i) => {
          const state = answered ? (choice === answer ? 'correct' : choice === picked ? 'wrong' : '') : ''
          return (
            <button key={`${choice}-${i}`} className={`choice ${state}`} disabled={answered} onClick={() => choose(choice)}>
              {choice}
            </button>
          )
        })}
      </div>

      <div className={`feedback ${answered ? (isCorrect ? 'good' : 'bad') : ''}`}>
        {answered ? (isCorrect ? `✅ ${t('correct')}` : `❌ ${q.a} × ${q.b} = ${answer}`) : ''}
      </div>

      {answered && (
        <button className="btn" style={{ marginTop: 8 }} onClick={next}>
          {index + 1 < questions.length ? t('next') : t('validate')} →
        </button>
      )}
    </>
  )
}
