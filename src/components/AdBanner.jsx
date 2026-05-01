import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export default function AdBanner({ label = 'Advertisement' }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // On real Android app, load actual AdMob banner
      loadNativeBanner();
    }
  }, []);

  async function loadNativeBanner() {
    try {
      const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
      await AdMob.showBanner({
        adId: 'ca-app-pub-3271133689051975/5478491338',
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      });
    } catch (e) {
      console.error('AdMob Banner Error', e);
    }
  }

  // Always show a beautiful placeholder banner in browser
  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      borderRadius: '12px',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '12px 0',
      border: '1px solid rgba(124, 59, 237, 0.3)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '60px',
    }}>
      {/* Glowing side accent */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: 'linear-gradient(180deg, #7c3aed, #3b82f6)',
        borderRadius: '3px 0 0 3px'
      }} />

      {/* Ad icon */}
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '20px',
        marginLeft: '8px',
      }}>
        🎮
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 600,
          letterSpacing: '1px',
          marginBottom: '2px'
        }}>
          SPONSORED
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'white',
          marginBottom: '2px'
        }}>
          Level Up Your Game!
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          Get premium gaming gear at 30% off
        </div>
      </div>

      {/* CTA Button */}
      <button style={{
        background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '7px 14px',
        fontSize: '12px',
        fontWeight: 700,
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(124,59,237,0.4)'
      }}>
        Install
      </button>
    </div>
  );
}
