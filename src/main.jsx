import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core';
import App from './App.jsx'
import './index.css'

// Initialize AdMob ONLY on real Android/iOS device - never in browser
async function initAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.initialize({
      requestTrackingAuthorization: false,
      testingDevices: [],
      initializeForTesting: false,
    });
    console.log('AdMob initialized successfully');
  } catch (e) {
    console.warn('AdMob init failed (non-critical):', e);
  }
}

// Init ads in background - don't block app render
initAdMob();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
