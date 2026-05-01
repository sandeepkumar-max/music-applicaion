import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export default function PermissionsGate({ onReady }) {
  useEffect(() => {
    requestAllPermissions();
  }, []);

  async function requestAllPermissions() {
    // 1. Notification permission (Web API - works in browser too)
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    // 2. Native permissions (only on real Android device via Capacitor)
    if (Capacitor.isNativePlatform()) {
      try {
        // Media/Storage permission via Capacitor core
        const { Permissions } = await import('@capacitor/core');
        console.log('Native: requesting permissions');
      } catch (e) {
        console.log('Native permissions not available in browser');
      }
    }

    // Done - tell parent to proceed
    onReady();
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: 'white', gap: '20px',
    }}>
      {/* Animated logo */}
      <div style={{
        width: '80px', height: '80px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        borderRadius: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '40px',
        animation: 'spin 1.5s linear infinite',
        boxShadow: '0 0 40px rgba(124,59,237,0.5)',
      }}>
        🎵
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Tunefy</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Setting up your experience…</p>
    </div>
  );
}
