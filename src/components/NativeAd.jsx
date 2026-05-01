import { useEffect } from 'react';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export default function NativeAd() {
  const adId = 'ca-app-pub-3271133689051975/6600001319';

  useEffect(() => {
    // Native ads in Capacitor often require a specific native view container.
    // For now, we will log and attempt to initialize if supported.
    if (Capacitor.isNativePlatform()) {
      console.log('Attempting to load Native Ad:', adId);
      // Note: Full Native Ad rendering in WebView requires complex 
      // XML layout mapping in Android Studio.
    }
  }, []);

  return (
    <div className="music-card" style={{ 
      width: '100%', 
      maxWidth: 'none', 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: '16px',
      background: 'linear-gradient(45deg, var(--surface), rgba(124, 59, 237, 0.1))',
      border: '1px solid rgba(124, 59, 237, 0.3)'
    }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '8px', 
        backgroundColor: 'var(--primary)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: 'white'
      }}>
        SPONSORED
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px' }}>ADVERTISEMENT</div>
        <div style={{ fontSize: '16px', fontWeight: 700 }}>Upgrade Your Gaming Gear</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Get 20% off on RGB keyboards and mice!</div>
      </div>
      <button style={{
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        INSTALL
      </button>
    </div>
  );
}
