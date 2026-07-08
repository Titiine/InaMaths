import { useMemo, useState } from 'react'
import type { Route } from '../App'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import { TopBar } from '../components/TopBar'
import { Shape } from '../components/Shape'
import { generateQuestions, SET_SIZE } from '../data/exercises'
import type { ShapeId } from '../data/exercises'

const COINS_PER_CORRECT = 2

const SHAPE_COLORS = ['#4d96ff', '#ff6392', '#2ec4b6', '#ffd23f', '#9b5de5', '#ff8c42']

export function ExerciseScreen({
  kind,
  level,
  navigate,
  back,
}: {
  kind: 'math' | 'shape'
  level: number
  navigate: (r: Route) => void
  back: () => void
}) {
  const { t } = useLanguage()
  const { addCoins } = useGame()
  const questions = useMemo(() => generateQuestions(kind, level), [kind, level])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const q = questions[index]
  const answered = picked !== null
  const isCorrect = picked === q.answer

  function choose(choice: string) {
    if (answered) return
    setPicked(choice)
    if (choice === q.answer) setScore((s) => s + 1)
  }

  function nextQuestion() {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setPicked(null)
    } else {
      const finalScore = score
      const earned = finalScore * COINS_PER_CORRECT
      if (earned > 0) addCoins(earned)
      navigate({ name: 'results', kind, level, score: finalScore, total: questions.length, earned })
    }
  }

  return (
    <>
      <TopBar onBack={back} />

      <div className="progress-dots">
        {questions.map((_, i) => (
          <span key={i} className={`dot ${i < index ? 'done' : i === index ? 'current' : ''}`} />
        ))}
      </div>
      <p className="muted center">
        {t('question')} {index + 1} / {SET_SIZE}
      </p>

      <div className="card center" style={{ marginTop: 8 }}>
        {kind === 'math' ? (
          <div className="prompt-big">{q.promptText}</div>
        ) : (
          <>
            <p className="muted" style={{ marginBottom: 6 }}>
              {t('whichShape')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Shape id={q.shape!} color="#6c5ce7" size={150} />
            </div>
          </>
        )}
      </div>

      <div className="choices">
        {q.choices.map((choice, i) => {
          const state = answered ? (choice === q.answer ? 'correct' : choice === picked ? 'wrong' : '') : ''
          return (
            <button
              key={choice + i}
              className={`choice ${state}`}
              disabled={answered}
              onClick={() => choose(choice)}
            >
              {kind === 'shape' ? (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Shape id={choice as ShapeId} color={SHAPE_COLORS[i % SHAPE_COLORS.length]} size={54} />
                  <span style={{ fontSize: 16 }}>{t(`shape_${choice}` as 'shape_circle')}</span>
                </span>
              ) : (
                choice
              )}
            </button>
          )
        })}
      </div>

      <div className={`feedback ${answered ? (isCorrect ? 'good' : 'bad') : ''}`}>
        {answered ? (isCorrect ? `✅ ${t('correct')}` : `❌ ${t('wrong')}`) : ''}
      </div>

      {answered && (
        <button className="btn" style={{ marginTop: 8 }} onClick={nextQuestion}>
          {index + 1 < questions.length ? t('next') : t('validate')} →
        </button>
      )}
    </>
  )
}
