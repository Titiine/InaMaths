import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { GameProvider } from './state/GameContext'
import { LanguageProvider } from './i18n/LanguageContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
