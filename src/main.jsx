import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdMob } from '@capacitor-community/admob';
import { adManager } from './utils/adManager';
import App from './App.jsx'
import './index.css'

// Initialize AdMob
AdMob.initialize();
adManager.initialize();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
