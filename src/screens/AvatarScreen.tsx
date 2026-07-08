import { useState, useRef, useEffect } from 'react'
import type { Route } from '../App'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'
import type { AvatarType, PartCategory } from '../types'
import { CATALOG } from '../data/catalog'
import { TopBar } from '../components/TopBar'
import { Avatar } from '../components/Avatar'
import { Coin } from '../components/Coin'
import { OptionPreview } from '../components/OptionPreview'

const TYPES: { id: AvatarType; emoji: string; labelKey: TranslationKey }[] = [
  { id: 'monster', emoji: '👾', labelKey: 'avatar_type_monster' },
  { id: 'human', emoji: '🧑', labelKey: 'avatar_type_human' },
  { id: 'animal', emoji: '🐱', labelKey: 'avatar_type_animal' },
  { id: 'robot', emoji: '🤖', labelKey: 'avatar_type_robot' },
]

// Catégories éditables et si elles acceptent l'option « aucun ».
const EDIT_TABS: { cat: PartCategory; labelKey: TranslationKey; nullable: boolean }[] = [
  { cat: 'bodyColor', labelKey: 'avatar_part_bodyColor', nullable: false },
  { cat: 'eyes', labelKey: 'avatar_part_eyes', nullable: false },
  { cat: 'mouth', labelKey: 'avatar_part_mouth', nullable: false },
  { cat: 'accessory', labelKey: 'avatar_part_accessory_monster', nullable: true },
  { cat: 'head', labelKey: 'avatar_zone_head', nullable: true },
  { cat: 'belly', labelKey: 'avatar_zone_belly', nullable: true },
  { cat: 'legs', labelKey: 'avatar_zone_legs', nullable: true },
]

export function AvatarScreen({ back, navigate }: { back: () => void; navigate: (r: Route) => void }) {
  const { t } = useLanguage()
  const { avatar, isOwned, setAvatarType, setAvatarPart, setAvatarClothes } = useGame()
  const [cat, setCat] = useState<PartCategory>('bodyColor')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])
  function showToast(msg: string) {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1600)
  }

  const accessoryLabel = `avatar_part_accessory_${avatar.type}` as TranslationKey

  function currentValue(c: PartCategory): string | null {
    switch (c) {
      case 'bodyColor':
        return avatar.bodyColor
      case 'eyes':
        return avatar.eyes
      case 'mouth':
        return avatar.mouth
      case 'accessory':
        return avatar.accessory
      case 'head':
        return avatar.clothes.head
      case 'belly':
        return avatar.clothes.belly
      case 'legs':
        return avatar.clothes.legs
    }
  }

  function equip(c: PartCategory, id: string | null) {
    switch (c) {
      case 'bodyColor':
      case 'eyes':
      case 'mouth':
        if (id) setAvatarPart(c, id)
        break
      case 'accessory':
        setAvatarPart('accessory', id)
        break
      case 'head':
      case 'belly':
      case 'legs':
        setAvatarClothes(c, id)
        break
    }
  }

  function handlePick(c: PartCategory, id: string | null) {
    if (id !== null && !isOwned(id)) {
      showToast(`🔒 ${t('avatar_locked')}`)
      return
    }
    equip(c, id)
  }

  const tab = EDIT_TABS.find((tb) => tb.cat === cat)!
  const options = CATALOG[cat]

  return (
    <>
      <TopBar onBack={back} />
      <h2 className="section-title">🧑‍🎨 {t('avatar_title')}</h2>

      <div className="avatar-stage" style={{ marginBottom: 14 }}>
        <Avatar config={avatar} size={200} />
      </div>

      {/* Type d'avatar */}
      <p className="muted" style={{ marginBottom: 6, fontWeight: 600 }}>
        {t('avatar_type')}
      </p>
      <div className="row" style={{ marginBottom: 16 }}>
        {TYPES.map((ty) => (
          <button
            key={ty.id}
            className={`pill ${avatar.type === ty.id ? 'active' : ''}`}
            style={{ flex: 1, padding: '12px 4px', fontSize: 13 }}
            onClick={() => setAvatarType(ty.id)}
            aria-pressed={avatar.type === ty.id}
          >
            <span style={{ fontSize: 22, display: 'block' }}>{ty.emoji}</span>
            {t(ty.labelKey)}
          </button>
        ))}
      </div>

      {/* Onglets des pièces */}
      <div className="tabs">
        {EDIT_TABS.map((tb) => (
          <button key={tb.cat} className={`tab ${cat === tb.cat ? 'active' : ''}`} onClick={() => setCat(tb.cat)}>
            {tb.cat === 'accessory' ? t(accessoryLabel) : t(tb.labelKey)}
          </button>
        ))}
      </div>

      <div className="option-grid">
        {tab.nullable && (
          <button
            className={`option ${currentValue(cat) === null ? 'selected' : ''}`}
            onClick={() => handlePick(cat, null)}
          >
            <div
              style={{
                width: 66,
                height: 66,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
              }}
            >
              🚫
            </div>
            <span className="price">{t('avatar_none')}</span>
          </button>
        )}
        {options.map((o) => {
          const selected = currentValue(cat) === o.id
          const owned = isOwned(o.id)
          return (
            <button
              key={o.id}
              className={`option ${selected ? 'selected' : ''}`}
              onClick={() => handlePick(cat, o.id)}
            >
              <OptionPreview base={avatar} category={cat} optionId={o.id} />
              {owned ? (
                <span className="price" style={{ color: selected ? 'var(--primary)' : 'var(--ink-soft)' }}>
                  {selected ? '✓ ' : ''}
                  {o.price === 0 ? '★' : t('shop_owned')}
                </span>
              ) : (
                <span className="price lock">
                  🔒 {o.price} <Coin size={14} />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <button className="btn secondary" style={{ marginTop: 18 }} onClick={() => navigate({ name: 'shop' })}>
        🛍️ {t('home_shop')}
      </button>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
