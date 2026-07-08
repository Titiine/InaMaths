import { useEffect, useRef, useState, useCallback } from 'react'
import { useGame } from '../state/GameContext'
import { useLanguage } from '../i18n/LanguageContext'
import { TopBar } from '../components/TopBar'
import { Coin } from '../components/Coin'

const PLAY_COST = 5
const START_LIVES = 3
const DURATION = 30 // secondes
const TICK = 60 // ms
const COIN_TTL = 1400 // durée de vie d'une pièce à l'écran
const SPAWN_INTERVAL = 850 // ms entre deux pièces

type Phase = 'intro' | 'playing' | 'over' | 'won'

interface FallingCoin {
  id: number
  x: number // %
  y: number // %
  ttl: number
}

interface Loop {
  coins: FallingCoin[]
  lives: number
  caught: number
  timeLeftMs: number
  sinceSpawn: number
  nextId: number
}

export function GameScreen({ back }: { back: () => void }) {
  const { t } = useLanguage()
  const { coins, spendCoins, addCoins } = useGame()

  const [phase, setPhase] = useState<Phase>('intro')
  const [, forceRender] = useState(0)
  const loop = useRef<Loop>({
    coins: [],
    lives: START_LIVES,
    caught: 0,
    timeLeftMs: DURATION * 1000,
    sinceSpawn: 0,
    nextId: 1,
  })
  const intervalRef = useRef<number | undefined>(undefined)

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  useEffect(() => () => stopInterval(), [stopInterval])

  function start() {
    if (coins < PLAY_COST) return
    if (!spendCoins(PLAY_COST)) return
    loop.current = {
      coins: [],
      lives: START_LIVES,
      caught: 0,
      timeLeftMs: DURATION * 1000,
      sinceSpawn: 0,
      nextId: 1,
    }
    setPhase('playing')
    intervalRef.current = window.setInterval(tick, TICK)
  }

  function endGame(result: 'over' | 'won') {
    stopInterval()
    if (result === 'won' && loop.current.caught > 0) {
      addCoins(loop.current.caught)
    }
    setPhase(result)
  }

  function tick() {
    const g = loop.current

    // Temps
    g.timeLeftMs -= TICK
    if (g.timeLeftMs <= 0) {
      g.timeLeftMs = 0
      endGame('won')
      return
    }

    // Apparition des pièces
    g.sinceSpawn += TICK
    if (g.sinceSpawn >= SPAWN_INTERVAL) {
      g.sinceSpawn = 0
      g.coins.push({
        id: g.nextId++,
        x: 4 + Math.random() * 84,
        y: 8 + Math.random() * 74,
        ttl: COIN_TTL,
      })
    }

    // Vieillissement des pièces ; celles ratées coûtent une vie
    const survivors: FallingCoin[] = []
    let lost = 0
    for (const c of g.coins) {
      c.ttl -= TICK
      if (c.ttl <= 0) lost++
      else survivors.push(c)
    }
    g.coins = survivors
    if (lost > 0) {
      g.lives -= lost
      if (g.lives <= 0) {
        g.lives = 0
        endGame('over')
        return
      }
    }

    forceRender((n) => n + 1)
  }

  function catchCoin(id: number) {
    const g = loop.current
    const before = g.coins.length
    g.coins = g.coins.filter((c) => c.id !== id)
    if (g.coins.length < before) {
      g.caught += 1
      forceRender((n) => n + 1)
    }
  }

  const g = loop.current

  return (
    <>
      <TopBar onBack={back} />
      <h2 className="section-title">🎮 {t('game_title')}</h2>

      {phase === 'intro' && (
        <div className="card stack center">
          <div style={{ fontSize: 56 }}>🪙</div>
          <p>{t('game_intro')}</p>
          <p className="muted">
            {t('game_cost')} : {PLAY_COST} {t('coins')}
          </p>
          {coins < PLAY_COST ? (
            <p className="feedback bad">{t('game_notEnough')}</p>
          ) : (
            <button className="btn green" onClick={start}>
              ▶ {t('game_start')}
            </button>
          )}
        </div>
      )}

      {phase === 'playing' && (
        <>
          <div className="game-hud">
            <span className="hearts" aria-label={t('game_lives')}>
              {'❤️'.repeat(g.lives)}
              {'🖤'.repeat(START_LIVES - g.lives)}
            </span>
            <span>
              🪙 {g.caught}
            </span>
            <span>
              ⏱ {Math.ceil(g.timeLeftMs / 1000)}s
            </span>
          </div>
          <div className="game-arena">
            {g.coins.map((c) => (
              <div
                key={c.id}
                className="falling-coin"
                style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: c.ttl < 400 ? c.ttl / 400 : 1 }}
                onPointerDown={() => catchCoin(c.id)}
              >
                <Coin size={46} />
              </div>
            ))}
          </div>
        </>
      )}

      {(phase === 'over' || phase === 'won') && (
        <div className="card stack center">
          <div style={{ fontSize: 64 }}>{phase === 'won' ? '🎉' : '💥'}</div>
          <h2 className="section-title">{phase === 'won' ? t('game_won') : t('game_over')}</h2>
          <p style={{ fontSize: 20, fontWeight: 700 }}>
            {t('game_score')} : {g.caught}
          </p>
          {phase === 'won' && g.caught > 0 && (
            <div className="row" style={{ justifyContent: 'center', color: '#e0a500', fontWeight: 700, fontSize: 22 }}>
              +{g.caught} <Coin size={26} />
            </div>
          )}
          <button className="btn" onClick={() => setPhase('intro')}>
            🔁 {t('replay')}
          </button>
          <button className="btn secondary" onClick={back}>
            🏠 {t('back')}
          </button>
        </div>
      )}
    </>
  )
}
