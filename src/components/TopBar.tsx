import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import { Coin } from './Coin'

export function TopBar({ onBack, title }: { onBack?: () => void; title?: string }) {
  const { coins } = useGame()
  const { t } = useLanguage()
  return (
    <div className="topbar">
      {onBack ? (
        <button className="back-btn" onClick={onBack}>
          ← {t('back')}
        </button>
      ) : (
        <span className="brand">{title ?? t('appName')}</span>
      )}
      <span className="coin-badge" aria-label={`${coins} ${t('coins')}`}>
        <Coin size={22} />
        {coins}
      </span>
    </div>
  )
}
