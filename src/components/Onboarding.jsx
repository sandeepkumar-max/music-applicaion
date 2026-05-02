import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: '🎮',
    title: 'Welcome to Tunefy!',
    subtitle: 'Music built for Gamers',
    desc: 'Play your local music files while gaming. No internet needed for your personal library.',
    bg: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
  },
  {
    icon: '📂',
    title: 'Your Music Library',
    subtitle: 'Scan local songs instantly',
    desc: 'Go to Library tab → tap "Scan Music" to load all MP3/audio files from your phone storage.',
    bg: 'linear-gradient(135deg, #0891b2, #7c3aed)',
  },
  {
    icon: '🎵',
    title: 'Now Playing',
    subtitle: 'Full player with all controls',
    desc: 'Tap any song to open the full player. Adjust Sleep Timer & Equalizer right inside the player!',
    bg: 'linear-gradient(135deg, #be185d, #7c3aed)',
  },
  {
    icon: '😴',
    title: 'Sleep Timer',
    subtitle: 'Auto-stop after you sleep',
    desc: 'In the player, tap the Sleep icon to set 15, 30, 45 or 60 min timer. Music stops automatically.',
    bg: 'linear-gradient(135deg, #0f766e, #1d4ed8)',
  },
  {
    icon: '🎚️',
    title: 'Equalizer',
    subtitle: 'Tune Bass, Mid & Treble',
    desc: 'In the player, tap the EQ icon to customize your sound for gaming or chilling.',
    bg: 'linear-gradient(135deg, #b45309, #7c3aed)',
  },
  {
    icon: '❤️',
    title: 'Liked Songs & Playlists',
    subtitle: 'Save your favorites',
    desc: 'Heart any song to save it. Create custom playlists from the Library tab. All stored locally!',
    bg: 'linear-gradient(135deg, #9f1239, #7c3aed)',
  },
];

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);

  const isLast = step === slides.length - 1;
  const slide = slides[step];

  const handleDone = () => {
    localStorage.setItem('tunefy-onboarded', 'true');
    onDone();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: slide.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 28px',
      transition: 'background 0.5s ease',
      color: 'white',
    }}>
      {/* Skip button */}
      {!isLast && (
        <button
          onClick={handleDone}
          style={{ position: 'absolute', top: 50, right: 24, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
        >
          Skip
        </button>
      )}

      {/* Icon */}
      <div style={{ fontSize: '80px', marginBottom: '24px', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}>
        {slide.icon}
      </div>

      {/* Text */}
      <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', textAlign: 'center', lineHeight: 1.2 }}>
        {slide.title}
      </h1>
      <p style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textAlign: 'center' }}>
        {slide.subtitle}
      </p>
      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 1.6, maxWidth: '320px' }}>
        {slide.desc}
      </p>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '8px', margin: '36px 0' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setStep(i)} style={{
            width: i === step ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: i === step ? 'white' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.3s',
            cursor: 'pointer',
          }} />
        ))}
      </div>

      {/* Button */}
      {isLast ? (
        <button
          onClick={handleDone}
          style={{
            background: 'white', color: '#7c3aed',
            border: 'none', borderRadius: '30px',
            padding: '16px 48px', fontSize: '18px', fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            width: '100%', maxWidth: '320px',
          }}
        >
          🚀 Let's Go!
        </button>
      ) : (
        <button
          onClick={() => setStep(s => s + 1)}
          style={{
            background: 'rgba(255,255,255,0.2)', color: 'white',
            border: '2px solid rgba(255,255,255,0.4)', borderRadius: '30px',
            padding: '14px 48px', fontSize: '16px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', maxWidth: '320px', justifyContent: 'center',
          }}
        >
          Next <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
