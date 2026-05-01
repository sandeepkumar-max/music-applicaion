import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const adManager = {
  interstitialId: 'ca-app-pub-3271133689051975/3390324552',
  nextSongCounter: 0,

  initialize: async function() {
    if (!Capacitor.isNativePlatform()) return;
    
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info) => {
      console.log('Interstitial Ad Loaded', info);
    });
    
    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      this.prepareInterstitial(); // Load next one
    });

    this.prepareInterstitial();
  },

  prepareInterstitial: async function() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.prepareInterstitial({
        adId: this.interstitialId,
      });
    } catch (e) {
      console.error('Error preparing interstitial', e);
    }
  },

  showInterstitial: async function() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.showInterstitial();
    } catch (e) {
      console.error('Error showing interstitial', e);
      // Fallback: try to prepare again
      this.prepareInterstitial();
    }
  },

  // Log song change and show ad every 5 songs
  logSongChange: function() {
    this.nextSongCounter++;
    if (this.nextSongCounter >= 5) {
      this.showInterstitial();
      this.nextSongCounter = 0;
    }
  }
};
