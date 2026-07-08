import { useState } from 'react'
import type { Route } from '../App'
import { useLanguage } from '../i18n/LanguageContext'
import { TopBar } from '../components/TopBar'
import { Shape } from '../components/Shape'

export function PlayScreen({ navigate, back }: { navigate: (r: Route) => void; back: () => void }) {
  const { t } = useLanguage()
  const [level, setLevel] = useState(1)

  const levelDescKey = (['level_1_desc', 'level_2_desc', 'level_3_desc'] as const)[level - 1]

  return (
    <>
      <TopBar onBack={back} />

      <h2 className="section-title">{t('chooseLevel')}</h2>
      <div className="row" style={{ marginBottom: 20 }}>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={`pill ${level === n ? 'active' : ''}`}
            style={{ flex: 1, fontSize: 18, padding: '14px 0' }}
            onClick={() => setLevel(n)}
            aria-pressed={level === n}
          >
            {'⭐'.repeat(n)}
            <br />
            {t(`level_${n}` as 'level_1')}
          </button>
        ))}
      </div>
      <p className="muted center" style={{ marginTop: -12, marginBottom: 18 }}>
        {t(levelDescKey)}
      </p>

      <h2 className="section-title">{t('chooseExercise')}</h2>
      <div className="grid" style={{ marginTop: 8 }}>
        <button className="tile" onClick={() => navigate({ name: 'exercise', kind: 'math', level })}>
          <span className="emoji">➕✖️</span>
          <span className="tile-title">{t('exercise_math')}</span>
          <span className="tile-sub">{t('exercise_math_desc')}</span>
        </button>
        <button className="tile" onClick={() => navigate({ name: 'exercise', kind: 'shape', level })}>
          <span style={{ display: 'flex', gap: 6 }}>
            <Shape id="triangle" color="#ff6392" size={44} />
            <Shape id="circle" color="#2ec4b6" size={44} />
            <Shape id="square" color="#ffd23f" size={44} />
          </span>
          <span className="tile-title">{t('exercise_shapes')}</span>
          <span className="tile-sub">{t('exercise_shapes_desc')}</span>
        </button>
      </div>
    </>
  )
}
