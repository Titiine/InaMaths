import type { Route } from '../App'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import { TopBar } from '../components/TopBar'
import { HistoryChart } from '../components/HistoryChart'
import {
  FACTORS,
  factKey,
  getStatus,
  getTrend,
  summarize,
  priorityFacts,
  STATUS_COLOR,
} from '../logic/mastery'
import type { MasteryStatus } from '../logic/mastery'
import type { TranslationKey } from '../i18n/translations'

const LEGEND_ORDER: MasteryStatus[] = ['known', 'fluctuating', 'weak', 'new']
const LEGEND_KEY: Record<MasteryStatus, TranslationKey> = {
  known: 'tables_legend_known',
  fluctuating: 'tables_legend_fluctuating',
  weak: 'tables_legend_weak',
  new: 'tables_legend_new',
}

export function TablesScreen({ back, navigate }: { back: () => void; navigate: (r: Route) => void }) {
  const { t } = useLanguage()
  const { tableStats, tableHistory, chronoBest, resetTables } = useGame()

  const summary = summarize(tableStats)
  const priority = priorityFacts(tableStats, 8)
  const masteredPct = Math.round((summary.known / summary.total) * 100)

  return (
    <>
      <TopBar onBack={back} />
      <h2 className="section-title">✖️ {t('tables_title')}</h2>
      <p className="muted" style={{ marginTop: -2, marginBottom: 14 }}>
        {t('tables_intro')}
      </p>

      {/* Progression globale */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ justifyContent: 'space-between', fontWeight: 700, marginBottom: 8 }}>
          <span>
            🌟 {t('tables_mastered')}
          </span>
          <span>
            {summary.known} / {summary.total}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${masteredPct}%` }} />
        </div>
      </div>

      {/* Courbe de progression (jour après jour) */}
      {tableHistory.length >= 2 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between', fontWeight: 700, marginBottom: 6 }}>
            <span>📈 {t('tables_progress')}</span>
          </div>
          <HistoryChart data={tableHistory} max={summary.total} />
        </div>
      )}

      {/* Panorama : table de multiplication colorée */}
      <p className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
        {t('tables_grid_hint')}
      </p>
      <div className="mult-grid" role="table" aria-label={t('tables_title')}>
        <div className="mult-corner">×</div>
        {FACTORS.map((c) => (
          <div key={`h${c}`} className="mult-head">
            {c}
          </div>
        ))}
        {FACTORS.map((a) => (
          <div key={`row${a}`} style={{ display: 'contents' }}>
            <div className="mult-head">{a}</div>
            {FACTORS.map((b) => {
              const history = tableStats[factKey(a, b)]
              const status = getStatus(history)
              const trend = getTrend(history)
              return (
                <div
                  key={`${a}x${b}`}
                  className={`mult-cell ${status === 'new' ? 'mult-cell--new' : ''}`}
                  style={{ background: STATUS_COLOR[status] }}
                  title={`${a} × ${b} = ${a * b}`}
                >
                  <span className="mult-prod">{a * b}</span>
                  {trend !== 'flat' && (
                    <span className="mult-trend">{trend === 'up' ? '▲' : '▼'}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="legend">
        {LEGEND_ORDER.map((status) => (
          <span key={status} className="legend-item">
            <span className="legend-dot" style={{ background: STATUS_COLOR[status] }} />
            {t(LEGEND_KEY[status])}
          </span>
        ))}
      </div>

      {/* À revoir en priorité */}
      <h3 className="section-title" style={{ fontSize: 18, marginTop: 20 }}>
        🎯 {t('tables_priority')}
      </h3>
      {priority.length === 0 ? (
        <p className="muted">{t('tables_none_priority')}</p>
      ) : (
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          {priority.map((f) => (
            <span key={factKey(f.a, f.b)} className="pill" style={{ fontSize: 16 }}>
              {f.a} × {f.b}
            </span>
          ))}
        </div>
      )}

      {/* Choix d'une table précise (ou mélange adaptatif) */}
      <h3 className="section-title" style={{ fontSize: 18, marginTop: 20 }}>
        📚 {t('tables_choose')}
      </h3>
      <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {FACTORS.map((n) => (
          <button
            key={`t${n}`}
            className="pill"
            style={{ fontSize: 16, minWidth: 44 }}
            onClick={() => navigate({ name: 'multiplication', table: n })}
          >
            × {n}
          </button>
        ))}
      </div>

      <button className="btn green" style={{ marginTop: 22 }} onClick={() => navigate({ name: 'multiplication' })}>
        🎲 {t('tables_mix')}
      </button>

      <button className="btn accent" style={{ marginTop: 12 }} onClick={() => navigate({ name: 'chrono' })}>
        ⏱️ {t('chrono_go')} · 🏆 {chronoBest}
      </button>

      <button
        className="btn secondary"
        style={{ marginTop: 12 }}
        onClick={() => {
          if (window.confirm(t('tables_reset') + ' ?')) resetTables()
        }}
      >
        ♻️ {t('tables_reset')}
      </button>
    </>
  )
}
