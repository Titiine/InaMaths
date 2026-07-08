import { useState, useRef, useEffect } from 'react'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'
import type { PartCategory } from '../types'
import { CATALOG, SHOP_CATEGORIES } from '../data/catalog'
import { TopBar } from '../components/TopBar'
import { Coin } from '../components/Coin'
import { OptionPreview } from '../components/OptionPreview'

const CAT_LABEL: Record<PartCategory, TranslationKey> = {
  bodyColor: 'shop_cat_bodyColor',
  eyes: 'shop_cat_eyes',
  mouth: 'shop_cat_mouth',
  accessory: 'shop_cat_accessory',
  head: 'shop_cat_head',
  belly: 'shop_cat_belly',
  legs: 'shop_cat_legs',
}

export function ShopScreen({ back }: { back: () => void }) {
  const { t } = useLanguage()
  const { avatar, coins, isOwned, buyItem } = useGame()
  const [cat, setCat] = useState<PartCategory>('bodyColor')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  function showToast(msg: string) {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1600)
  }

  function handleBuy(id: string, price: number) {
    if (isOwned(id)) return
    if (coins < price) {
      showToast(`❌ ${t('shop_notEnough')}`)
      return
    }
    if (buyItem(id, price)) {
      showToast(`✅ ${t('shop_owned')} !`)
    }
  }

  const items = CATALOG[cat].filter((o) => o.price > 0)

  return (
    <>
      <TopBar onBack={back} />
      <h2 className="section-title">🛍️ {t('shop_title')}</h2>

      <div className="tabs">
        {SHOP_CATEGORIES.map((c) => (
          <button key={c} className={`tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {t(CAT_LABEL[c])}
          </button>
        ))}
      </div>

      <div className="option-grid">
        {items.map((o) => {
          const owned = isOwned(o.id)
          return (
            <button
              key={o.id}
              className={`option ${owned ? 'selected' : ''}`}
              onClick={() => handleBuy(o.id, o.price)}
              disabled={owned}
            >
              <OptionPreview base={avatar} category={cat} optionId={o.id} />
              {owned ? (
                <span className="price" style={{ color: 'var(--green)' }}>
                  ✓ {t('shop_owned')}
                </span>
              ) : (
                <span className="price">
                  {o.price} <Coin size={16} />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
