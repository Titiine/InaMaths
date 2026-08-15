import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// Petit verrou « adultes » : un calcul volontairement au-dessus du niveau
// des enfants de l'app, pour éviter qu'ils n'entrent dans l'espace parent
// par accident. Ce n'est pas une sécurité, juste un garde-fou.
export function ParentGate({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const { t } = useLanguage()
  const [question] = useState(() => {
    const a = 12 + Math.floor(Math.random() * 8) // 12..19
    const b = 3 + Math.floor(Math.random() * 7) // 3..9
    return { a, b, answer: a * b }
  })
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (parseInt(value, 10) === question.answer) {
      onSuccess()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 40 }}>👪</div>
        <h2 className="section-title" style={{ marginBottom: 4 }}>
          {t('parent_gate_title')}
        </h2>
        <p className="muted" style={{ marginTop: 0 }}>
          {t('parent_gate_hint')}
        </p>
        <p style={{ fontFamily: 'Anton, sans-serif', fontSize: 34, margin: '6px 0' }}>
          {question.a} × {question.b} = ?
        </p>
        <form onSubmit={submit} className="stack">
          <input
            className="text-input"
            inputMode="numeric"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/[^0-9]/g, ''))
              setError(false)
            }}
            placeholder={t('parent_gate_placeholder')}
            aria-label={t('parent_gate_placeholder')}
          />
          {error && <p className="feedback bad" style={{ margin: 0 }}>{t('parent_gate_wrong')}</p>}
          <button type="submit" className="btn" disabled={value === ''}>
            {t('parent_gate_enter')} →
          </button>
          <button type="button" className="btn secondary" onClick={onClose}>
            {t('close')}
          </button>
        </form>
      </div>
    </div>
  )
}
