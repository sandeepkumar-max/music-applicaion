import { Capacitor } from '@capacitor/core';

export const adManager = {
  interstitialId: 'ca-app-pub-3271133689051975/3390324552',
  nextSongCounter: 0,
  admobLoaded: false,

  initialize: async function () {
    // Only initialize on real Android/iOS - skip in browser
    if (!Capacitor.isNativePlatform()) {
      console.log('AdManager: Browser mode - skipping native AdMob');
      return;
    }
    try {
      const { AdMob, InterstitialAdPluginEvents } = await import('@capacitor-community/admob');

      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        this.prepareInterstitial();
      });

      await this.prepareInterstitial();
      this.admobLoaded = true;
    } catch (e) {
      console.warn('AdMob init failed (non-critical):', e);
    }
  },

  prepareInterstitial: async function () {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.prepareInterstitial({ adId: this.interstitialId });
    } catch (e) {
      console.warn('Interstitial prep failed:', e);
    }
  },

  showInterstitial: async function () {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.showInterstitial();
    } catch (e) {
      console.warn('Interstitial show failed:', e);
      this.prepareInterstitial();
    }
  },

  // Show ad every 5 song changes
  logSongChange: function () {
    this.nextSongCounter++;
    if (this.nextSongCounter >= 5) {
      this.showInterstitial();
      this.nextSongCounter = 0;
    }
  }
};
