export const sleepTimer = {
  timeoutId: null,
  endTime: null,
  currentSetting: 'Off',
  
  start: function(minutes) {
    this.stop();
    this.currentSetting = minutes;
    
    if (minutes === 'Off') {
      window.dispatchEvent(new CustomEvent('timer-updated', { detail: 'Off' }));
      return;
    }
    
    const ms = minutes * 60 * 1000;
    this.endTime = Date.now() + ms;
    
    this.timeoutId = setTimeout(() => {
      // dispatch pause event to stop music
      window.dispatchEvent(new Event('stop-music'));
      this.endTime = null;
      this.currentSetting = 'Off';
      window.dispatchEvent(new CustomEvent('timer-updated', { detail: 'Off' }));
    }, ms);
    
    window.dispatchEvent(new CustomEvent('timer-updated', { detail: minutes }));
  },
  
  stop: function() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
      this.endTime = null;
    }
  },

  clear: function() {
    this.stop();
    this.currentSetting = 'Off';
  },
  
  getRemaining: function() {
    if (!this.endTime) return null;
    return Math.max(0, Math.ceil((this.endTime - Date.now()) / 60000));
  }
};

// Alias for convenience
export const sleepTimerManager = sleepTimer;
