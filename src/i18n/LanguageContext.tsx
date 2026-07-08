import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { translations, LANGUAGES } from './translations'
import type { LanguageCode, TranslationKey } from './translations'

interface LanguageContextValue {
  lang: LanguageCode
  setLang: (lang: LanguageCode) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'inamaths.lang'

function getInitialLang(): LanguageCode {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && LANGUAGES.some((l) => l.code === saved)) {
    return saved as LanguageCode
  }
  return 'fr'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(getInitialLang)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: LanguageCode) => setLangState(next), [])

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.fr[key] ?? key,
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage doit être utilisé dans un LanguageProvider')
  return ctx
}
