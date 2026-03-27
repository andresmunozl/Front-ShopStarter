import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './css/globals.css'
import App from './App.tsx'

// 👇 IMPORTANTE
import { RegistroProvider } from './views/auth/contex/RegistroContext'

createRoot(document.getElementById('root')!).render(
  <Suspense>
    <RegistroProvider>
      <App />
    </RegistroProvider>
  </Suspense>
)