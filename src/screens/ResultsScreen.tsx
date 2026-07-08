import type { Route } from '../App'
import { useLanguage } from '../i18n/LanguageContext'
import { TopBar } from '../components/TopBar'
import { Coin } from '../components/Coin'

type ResultsRoute = Extract<Route, { name: 'results' }>

export function ResultsScreen({ route, navigate }: { route: ResultsRoute; navigate: (r: Route) => void }) {
  const { t } = useLanguage()
  const { score, total, earned, kind, level } = route

  const perfect = score === total
  const good = score >= Math.ceil(total / 2)
  const emoji = perfect ? '🏆' : good ? '🎉' : '💪'
  const msg = perfect ? t('results_perfect') : good ? t('results_good') : t('results_tryAgain')

  return (
    <>
      <TopBar />
      <div className="card center stack" style={{ marginTop: 20 }}>
        <div style={{ fontSize: 72 }}>{emoji}</div>
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          {t('results_title')}
        </h1>
        <p style={{ fontSize: 22, fontWeight: 700 }}>
          {t('results_score')} : {score} / {total}
        </p>
        <p style={{ fontSize: 20 }}>{msg}</p>

        <div
          className="row"
          style={{ justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#e0a500' }}
        >
          {t('results_earned')} +{earned} <Coin size={30} />
        </div>
      </div>

      <div className="stack" style={{ marginTop: 20 }}>
        <button className="btn green" onClick={() => navigate({ name: 'exercise', kind, level })}>
          🔁 {t('replay')}
        </button>
        <button className="btn secondary" onClick={() => navigate({ name: 'shop' })}>
          🛍️ {t('home_shop')}
        </button>
        <button className="btn secondary" onClick={() => navigate({ name: 'home' })}>
          🏠 {t('home_hello')}
        </button>
      </div>
    </>
  )
}
