import { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export default function AdBanner() {
  useEffect(() => {
    // Only run on native platforms (Android/iOS)
    if (Capacitor.isNativePlatform()) {
      showBanner();
    }
  }, []);

  async function showBanner() {
    const options = {
      adId: 'ca-app-pub-3271133689051975/5478491338',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      // isTesting: true // Set to true while testing
    };
    try {
      await AdMob.showBanner(options);
    } catch (e) {
      console.error('AdMob Error', e);
    }
  }

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#f1f1f1',
      color: '#000',
      textAlign: 'center',
      padding: '12px',
      margin: '16px 0',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 'bold',
      border: '1px solid #ccc',
      display: Capacitor.isNativePlatform() ? 'none' : 'block' // Hide placeholder on native
    }}>
      [ Google AdMob Banner Ad ]
    </div>
  );
}
