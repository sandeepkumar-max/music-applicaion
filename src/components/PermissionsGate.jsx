import { useEffect } from 'react';

export default function PermissionsGate({ onReady }) {
  const requestAllPermissions = async () => {
    try {
      // Notification permission (non-blocking)
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission(); // fire and forget, no await
      }
    } catch {
      // ignore all errors
    }

    // On native Android - permissions handled by Capacitor automatically
    // No blocking calls here
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Always proceed after 1.5 seconds max - never block the user
    const fallbackTimer = setTimeout(() => {
      onReady();
    }, 1500);

    requestAllPermissions().finally(() => {
      clearTimeout(fallbackTimer);
      onReady();
    });
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: 'white', gap: '16px',
    }}>
      <div style={{
        width: '90px', height: '90px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        borderRadius: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '44px',
        boxShadow: '0 0 60px rgba(124,59,237,0.5)',
        animation: 'pulse 1.2s ease-in-out infinite',
      }}>
        🎵
      </div>
      <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>
        Tunefy
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
        Gaming Music Player
      </p>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#7c3aed',
            animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(124,59,237,0.5); }
          50% { transform: scale(1.05); box-shadow: 0 0 70px rgba(124,59,237,0.8); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
