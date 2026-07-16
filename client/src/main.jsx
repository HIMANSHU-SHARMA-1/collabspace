
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import SocketProvider from './context/SocketContext.jsx'
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
})
// console.log('DSN:',import.meta.env.VITE_SENTRY_DSN)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
    <App />
      </SocketProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
