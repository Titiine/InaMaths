import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import type { AvatarConfig, AvatarType, GameState } from '../types'
import { findOption, CATALOG } from '../data/catalog'
import { factKey, pushResult, knownCount } from '../logic/mastery'

const STORAGE_KEY = 'inamaths.state'

const DEFAULT_AVATAR: AvatarConfig = {
  type: 'monster',
  bodyColor: 'color_green',
  eyes: 'eyes_round',
  mouth: 'mouth_smile',
  accessory: 'accessory_a',
  clothes: { head: null, belly: null, legs: null },
}

const DEFAULT_STATE: GameState = {
  coins: 20,
  ownedItems: [],
  avatar: DEFAULT_AVATAR,
  tableStats: {},
  tableHistory: [],
  chronoBest: 0,
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<GameState>
    return {
      coins: typeof parsed.coins === 'number' ? parsed.coins : DEFAULT_STATE.coins,
      ownedItems: Array.isArray(parsed.ownedItems) ? parsed.ownedItems : [],
      avatar: { ...DEFAULT_AVATAR, ...parsed.avatar, clothes: { ...DEFAULT_AVATAR.clothes, ...parsed.avatar?.clothes } },
      tableStats: parsed.tableStats && typeof parsed.tableStats === 'object' ? parsed.tableStats : {},
      tableHistory: Array.isArray(parsed.tableHistory) ? parsed.tableHistory : [],
      chronoBest: typeof parsed.chronoBest === 'number' ? parsed.chronoBest : 0,
    }
  } catch {
    return DEFAULT_STATE
  }
}

const HISTORY_CAP = 30

// Renvoie la date du jour au format AAAA-MM-JJ (heure locale).
function today(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// Met à jour l'instantané du jour dans l'historique (upsert).
function upsertHistory(history: { date: string; known: number }[], known: number) {
  const date = today()
  const last = history[history.length - 1]
  if (last && last.date === date) {
    const copy = history.slice()
    copy[copy.length - 1] = { date, known }
    return copy
  }
  return [...history, { date, known }].slice(-HISTORY_CAP)
}

interface GameContextValue extends GameState {
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  buyItem: (id: string, price: number) => boolean
  isOwned: (id: string | null) => boolean
  setAvatarType: (type: AvatarType) => void
  setAvatarPart: (key: 'bodyColor' | 'eyes' | 'mouth' | 'accessory', id: string | null) => void
  setAvatarClothes: (zone: 'head' | 'belly' | 'legs', id: string | null) => void
  recordTableResult: (a: number, b: number, correct: boolean) => void
  submitChronoScore: (score: number) => boolean
  resetTables: () => void
  resetProgress: () => void
  // Mode testeur / parent : rien n'est enregistré pendant qu'il est actif.
  testerMode: boolean
  enterTesterMode: () => void
  exitTesterMode: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState)
  const [testerMode, setTesterMode] = useState(false)
  // Sauvegarde de l'état réel de l'enfant pendant le mode testeur.
  const realStateBackup = useRef<GameState | null>(null)

  useEffect(() => {
    // On n'écrit jamais sur le disque tant que le mode testeur est actif :
    // les essais du parent ne touchent donc pas le compte de l'enfant.
    if (!testerMode) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, testerMode])

  const enterTesterMode = useCallback(() => {
    setState((s) => {
      realStateBackup.current = s // mémorise l'état réel
      return s
    })
    setTesterMode(true)
  }, [])

  const exitTesterMode = useCallback(() => {
    setTesterMode(false)
    if (realStateBackup.current) setState(realStateBackup.current) // restaure l'état réel
    realStateBackup.current = null
  }, [])

  const isOwned = useCallback(
    (id: string | null) => {
      if (!id) return true
      const opt = findOption(id)
      if (opt && opt.price === 0) return true
      return state.ownedItems.includes(id)
    },
    [state.ownedItems],
  )

  const addCoins = useCallback((amount: number) => {
    setState((s) => ({ ...s, coins: s.coins + amount }))
  }, [])

  const spendCoins = useCallback((amount: number) => {
    let ok = false
    setState((s) => {
      if (s.coins >= amount) {
        ok = true
        return { ...s, coins: s.coins - amount }
      }
      return s
    })
    return ok
  }, [])

  const buyItem = useCallback((id: string, price: number) => {
    let ok = false
    setState((s) => {
      if (s.ownedItems.includes(id)) return s
      if (s.coins < price) return s
      ok = true
      return { ...s, coins: s.coins - price, ownedItems: [...s.ownedItems, id] }
    })
    return ok
  }, [])

  const setAvatarType = useCallback((type: AvatarType) => {
    setState((s) => ({ ...s, avatar: { ...s.avatar, type } }))
  }, [])

  const setAvatarPart = useCallback(
    (key: 'bodyColor' | 'eyes' | 'mouth' | 'accessory', id: string | null) => {
      setState((s) => ({ ...s, avatar: { ...s.avatar, [key]: id } }))
    },
    [],
  )

  const setAvatarClothes = useCallback((zone: 'head' | 'belly' | 'legs', id: string | null) => {
    setState((s) => ({ ...s, avatar: { ...s.avatar, clothes: { ...s.avatar.clothes, [zone]: id } } }))
  }, [])

  const recordTableResult = useCallback((a: number, b: number, correct: boolean) => {
    setState((s) => {
      const key = factKey(a, b)
      const tableStats = { ...s.tableStats, [key]: pushResult(s.tableStats[key], correct) }
      const tableHistory = upsertHistory(s.tableHistory, knownCount(tableStats))
      return { ...s, tableStats, tableHistory }
    })
  }, [])

  const submitChronoScore = useCallback((score: number) => {
    let record = false
    setState((s) => {
      if (score > s.chronoBest) {
        record = true
        return { ...s, chronoBest: score }
      }
      return s
    })
    return record
  }, [])

  const resetTables = useCallback(() => {
    setState((s) => ({ ...s, tableStats: {}, tableHistory: [], chronoBest: 0 }))
  }, [])

  const resetProgress = useCallback(() => setState(DEFAULT_STATE), [])

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      addCoins,
      spendCoins,
      buyItem,
      isOwned,
      setAvatarType,
      setAvatarPart,
      setAvatarClothes,
      recordTableResult,
      submitChronoScore,
      resetTables,
      resetProgress,
      testerMode,
      enterTesterMode,
      exitTesterMode,
    }),
    [
      state,
      addCoins,
      spendCoins,
      buyItem,
      isOwned,
      setAvatarType,
      setAvatarPart,
      setAvatarClothes,
      recordTableResult,
      submitChronoScore,
      resetTables,
      resetProgress,
      testerMode,
      enterTesterMode,
      exitTesterMode,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame doit être utilisé dans un GameProvider')
  return ctx
}

// Réexport pratique pour éviter les imports croisés dans les écrans.
export { CATALOG }
