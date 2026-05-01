import { useState, useEffect } from 'react';
import { ChevronLeft, Moon, Clock, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sleepTimer } from '../utils/sleepTimer';
import '../App.css';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTimer, setActiveTimer] = useState(sleepTimer.currentSetting);

  const [eq, setEq] = useState({ bass: 50, mid: 50, treble: 50 });

  const timerOptions = [
    { label: 'Off', value: 'Off' },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
  ];

  const handleTimerChange = (val) => {
    sleepTimer.start(val);
    setActiveTimer(val);
  };

  useEffect(() => {
    const handleTimerUpdate = (e) => {
      setActiveTimer(e.detail);
    };
    window.addEventListener('timer-updated', handleTimerUpdate);
    return () => window.removeEventListener('timer-updated', handleTimerUpdate);
  }, []);

  return (
    <div className="page-container">
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="icon-btn" onClick={() => navigate(-1)} style={{ width: '36px', height: '36px' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="app-title">Settings</h1>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Equalizer Settings */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#3b82f6',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <Sliders size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Equalizer</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Adjust audio frequencies</p>
            </div>
          </div>

          {['bass', 'mid', 'treble'].map((band) => (
            <div key={band} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ width: '50px', textTransform: 'capitalize', fontSize: '14px', color: 'var(--text-muted)' }}>{band}</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={eq[band]} 
                onChange={(e) => setEq({...eq, [band]: parseInt(e.target.value)})}
                style={{ flex: 1, accentColor: 'var(--primary)' }}
              />
              <span style={{ width: '30px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)' }}>{eq[band]}</span>
            </div>
          ))}
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
            Note: Actual audio filtering requires Web Audio API integration and CORS-enabled audio sources.
          </p>
        </div>

        {/* Sleep Timer Settings */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div style={{
              backgroundColor: 'rgba(124, 59, 237, 0.2)',
              color: 'var(--primary)',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <Moon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Sleep Timer</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Stop music after a set amount of time</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timerOptions.map((option) => (
              <button 
                key={option.value}
                onClick={() => handleTimerChange(option.value)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: activeTimer === option.value ? 'var(--surface-hover)' : 'transparent',
                  borderRadius: '12px',
                  border: `1px solid ${activeTimer === option.value ? 'var(--primary)' : 'var(--border-color)'}`,
                  transition: 'all 0.2s',
                  color: activeTimer === option.value ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: activeTimer === option.value ? 700 : 500,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={18} />
                  <span>{option.label}</span>
                </div>
                {activeTimer === option.value && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 0 10px var(--primary)'
                  }} />
                )}
              </button>
            ))}
          </div>
          
          {activeTimer !== 'Off' && (
            <div style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>
              Timer set for {activeTimer} minutes. Sleep tight! 🌙
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
