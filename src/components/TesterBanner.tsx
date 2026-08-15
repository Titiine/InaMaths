import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'

// Bandeau affiché en permanence tant que le mode parent/testeur est actif.
export function TesterBanner() {
  const { testerMode, exitTesterMode } = useGame()
  const { t } = useLanguage()
  if (!testerMode) return null
  return (
    <div className="tester-banner">
      <span>🧪 {t('tester_banner')}</span>
      <button className="tester-exit" onClick={exitTesterMode}>
        {t('tester_exit')}
      </button>
    </div>
  )
}
