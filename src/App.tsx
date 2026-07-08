import { useState, useCallback } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { PlayScreen } from './screens/PlayScreen'
import { ExerciseScreen } from './screens/ExerciseScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { ShopScreen } from './screens/ShopScreen'
import { AvatarScreen } from './screens/AvatarScreen'
import { GameScreen } from './screens/GameScreen'

export type Route =
  | { name: 'home' }
  | { name: 'play' }
  | { name: 'exercise'; kind: 'math' | 'shape'; level: number }
  | { name: 'results'; kind: 'math' | 'shape'; level: number; score: number; total: number; earned: number }
  | { name: 'shop' }
  | { name: 'avatar' }
  | { name: 'game' }

export function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' })

  const navigate = useCallback((r: Route) => setRoute(r), [])
  const goHome = useCallback(() => setRoute({ name: 'home' }), [])

  return (
    <div className="app">
      {route.name === 'home' && <HomeScreen navigate={navigate} />}
      {route.name === 'play' && <PlayScreen navigate={navigate} back={goHome} />}
      {route.name === 'exercise' && (
        <ExerciseScreen kind={route.kind} level={route.level} navigate={navigate} back={() => navigate({ name: 'play' })} />
      )}
      {route.name === 'results' && <ResultsScreen route={route} navigate={navigate} />}
      {route.name === 'shop' && <ShopScreen back={goHome} />}
      {route.name === 'avatar' && <AvatarScreen back={goHome} navigate={navigate} />}
      {route.name === 'game' && <GameScreen back={goHome} />}
    </div>
  )
}
