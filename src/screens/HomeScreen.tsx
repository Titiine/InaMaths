import type { Route } from '../App'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import { LANGUAGES } from '../i18n/translations'
import { Avatar } from '../components/Avatar'
import { TopBar } from '../components/TopBar'

export function HomeScreen({ navigate }: { navigate: (r: Route) => void }) {
  const { avatar } = useGame()
  const { t, lang, setLang } = useLanguage()

  return (
    <>
      <TopBar />

      <div className="center" style={{ marginBottom: 8 }}>
        <div className="avatar-stage" style={{ marginBottom: 12 }}>
          <Avatar config={avatar} size={190} />
        </div>
        <h1 className="brand" style={{ fontSize: 34 }}>
          {t('appName')}
        </h1>
        <p className="muted" style={{ marginTop: 4 }}>
          {t('tagline')}
        </p>
      </div>

      <div className="grid grid-2" style={{ marginTop: 12 }}>
        <button className="tile" onClick={() => navigate({ name: 'play' })}>
          <span className="emoji">🎓</span>
          <span className="tile-title">{t('home_play')}</span>
        </button>
        <button className="tile" onClick={() => navigate({ name: 'avatar' })}>
          <span className="emoji">🧑‍🎨</span>
          <span className="tile-title">{t('home_avatar')}</span>
        </button>
        <button className="tile" onClick={() => navigate({ name: 'shop' })}>
          <span className="emoji">🛍️</span>
          <span className="tile-title">{t('home_shop')}</span>
        </button>
        <button className="tile" onClick={() => navigate({ name: 'game' })}>
          <span className="emoji">🎮</span>
          <span className="tile-title">{t('home_game')}</span>
        </button>
      </div>

      <div className="row" style={{ justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            className={`pill ${lang === l.code ? 'active' : ''}`}
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
          >
            {l.flag} {l.label}
          </button>
        ))}
      </div>
    </>
  )
}
