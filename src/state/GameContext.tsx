import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AvatarConfig, AvatarType, GameState } from '../types'
import { findOption, CATALOG } from '../data/catalog'
import { factKey, pushResult } from '../logic/mastery'

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
    }
  } catch {
    return DEFAULT_STATE
  }
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
  resetTables: () => void
  resetProgress: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

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
      return { ...s, tableStats: { ...s.tableStats, [key]: pushResult(s.tableStats[key], correct) } }
    })
  }, [])

  const resetTables = useCallback(() => {
    setState((s) => ({ ...s, tableStats: {} }))
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
      resetTables,
      resetProgress,
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
      resetTables,
      resetProgress,
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
