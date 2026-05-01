import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdMob } from '@capacitor-community/admob';
import App from './App.jsx'
import './index.css'

// Initialize AdMob
AdMob.initialize();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
