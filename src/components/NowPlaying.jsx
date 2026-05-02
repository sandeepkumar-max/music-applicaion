import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, Share2, Shuffle, SkipBack, Play, Pause,
  SkipForward, Repeat, ListMusic, Heart,
  Moon, Sliders, X
} from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import { adManager } from '../utils/adManager';
import { sleepTimerManager } from '../utils/sleepTimer';
import './NowPlaying.css';

// NowPlaying is the SINGLE SOURCE OF TRUTH for audio playback.
export default function NowPlaying() {
  const {
    currentSong,
    isPlayerOpen,
    setPlayerOpen,
    isPlaying,
    setIsPlaying,
    toggleLike,
    isLiked,
    addToHistory,
    eqValues,
    setEqValues,
    playNext,
    playPrev,
  } = useMusicStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooped, setIsLooped] = useState(false);
  const [showEQ, setShowEQ] = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState(null);
  // eqValues lives in Zustand store — no local state needed
  const audioRef = useRef(null);

  const sleepOptions = [15, 30, 45, 60];

  const activateSleep = (min) => {
    setSleepMinutes(min);
    sleepTimerManager.start(min);
    setShowSleep(false);
  };

  const cancelSleep = () => {
    setSleepMinutes(null);
    sleepTimerManager.clear();
    setShowSleep(false);
  };

  const handleEq = (band, val) => {
    setEqValues({ ...eqValues, [band]: val });
    // TODO: connect to Web Audio API BiquadFilter
  };

  const song = currentSong;
  const songIsLiked = song ? isLiked(song.id) : false;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  // Load & auto-play when song changes
  useEffect(() => {
    if (!audioRef.current || !song?.src) return;
    audioRef.current.load();
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        addToHistory(song);
      })
      .catch(() => setIsPlaying(false));
  }, [song?.id]); // eslint-disable-line

  // MediaSession lock screen API
  useEffect(() => {
    if (!song || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      artwork: [
        { src: song.artwork || song.img || '', sizes: '512x512', type: 'image/jpeg' },
      ],
    });
    navigator.mediaSession.setActionHandler('play', () => {
      audioRef.current?.play();
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      // Hardware/Lockscreen previous track
      playPrev();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      // Hardware/Lockscreen next track
      playNext();
      adManager.logSongChange();
    });
  }, [song?.id]); // eslint-disable-line

  // Sleep timer stop + mini player toggle-play
  useEffect(() => {
    const handleStop = () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    };
    const handleMiniToggle = () => {
      if (!audioRef.current) return;
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('stop-music', handleStop);
    window.addEventListener('toggle-play-mini', handleMiniToggle);
    return () => {
      window.removeEventListener('stop-music', handleStop);
      window.removeEventListener('toggle-play-mini', handleMiniToggle);
    };
  }, []); // eslint-disable-line

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleShare = async () => {
    if (!song) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Listening to ${song.title}`,
          text: `I'm listening to ${song.title} by ${song.artist} on Tunefy!`,
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Share error', err);
      }
    } else {
      alert(`Playing: ${song.title} by ${song.artist}`);
    }
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Hidden audio — always mounted */}
      <audio
        ref={audioRef}
        src={song?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop={isLooped}
        style={{ display: 'none' }}
      />

      {isPlayerOpen && song && (
        <div className="np-overlay">
          {/* Blurred BG */}
          <div className="np-bg" style={{ backgroundImage: `url(${song.artwork || song.img})` }} />
          <div className="np-bg-dim" />

          {/* ═══════════ HEADER ═══════════ */}
          <div className="np-header" style={{ position: 'relative' }}>
            {/* Left: close */}
            <button className="np-icon-btn" onClick={() => { setPlayerOpen(false); setShowEQ(false); setShowSleep(false); }}>
              <ChevronDown size={28} />
            </button>

            {/* Center: title */}
            <span className="np-header-label">Now Playing</span>

            {/* Right: EQ + Share icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                className={`np-icon-btn ${showEQ ? 'np-header-icon-active' : ''}`}
                onClick={() => { setShowEQ(v => !v); setShowSleep(false); }}
                title="Equalizer"
              >
                <Sliders size={20} />
              </button>
              <button className="np-icon-btn" onClick={handleShare}>
                <Share2 size={20} />
              </button>
            </div>

            {/* ─── EQ POP-UP (drops down from header) ─── */}
            {showEQ && (
              <div className="np-eq-popup">
                {/* Arrow pointer */}
                <div className="np-eq-popup-arrow" />

                <div className="np-eq-popup-inner">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: 'white' }}>🎚️ Equalizer</span>
                    <button
                      onClick={() => setShowEQ(false)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 2 }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* EQ Preset chips */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Flat',   vals: { bass: 50, mid: 50, treble: 50 } },
                      { label: 'Bass↑',  vals: { bass: 80, mid: 50, treble: 40 } },
                      { label: 'Vocal',  vals: { bass: 40, mid: 70, treble: 55 } },
                      { label: 'Treble', vals: { bass: 40, mid: 45, treble: 80 } },
                    ].map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => setEqValues(preset.vals)}
                        style={{
                          padding: '5px 12px', borderRadius: 14, border: '1px solid rgba(124,59,237,0.5)',
                          background: JSON.stringify(eqValues) === JSON.stringify(preset.vals)
                            ? '#7c3aed' : 'rgba(255,255,255,0.08)',
                          color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Sliders */}
                  {[['bass', '🔊 Bass'], ['mid', '🎵 Mid'], ['treble', '✨ Treble']].map(([band, label]) => (
                    <div key={band} className="np-eq-row">
                      <span className="np-eq-label">{label}</span>
                      <input
                        type="range" min={0} max={100} value={eqValues[band]}
                        onChange={e => handleEq(band, Number(e.target.value))}
                        className="np-eq-slider"
                        style={{
                          background: `linear-gradient(to right, #7c3aed ${eqValues[band]}%, rgba(255,255,255,0.15) ${eqValues[band]}%)`,
                        }}
                      />
                      <span className="np-eq-val">{eqValues[band]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══════════ ALBUM ART ═══════════ */}
          <div className="np-art-wrapper">
            <div className="np-art-glow" style={{ backgroundImage: `url(${song.artwork || song.img})` }} />
            <img
              src={song.artwork || song.img}
              alt={song.title}
              className={`np-art-img ${isPlaying ? 'np-art-playing' : ''}`}
            />
          </div>

          {/* ═══════════ SONG INFO + LIKE ═══════════ */}
          <div className="np-info-row">
            <div className="np-info">
              <h1 className="np-song-name">{song.title}</h1>
              <p className="np-song-artist">{song.artist}</p>
            </div>
            <button className="np-icon-btn np-like-btn" onClick={() => toggleLike(song)}>
              <Heart
                size={26}
                fill={songIsLiked ? '#f43f5e' : 'none'}
                color={songIsLiked ? '#f43f5e' : 'rgba(255,255,255,0.7)'}
              />
            </button>
          </div>

          {/* ═══════════ WAVEFORM SEEK ═══════════ */}
          <div className="np-progress-section">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="np-simple-scrubber"
              style={{
                background: `linear-gradient(to right, #7c3aed ${progress}%, rgba(255,255,255,0.15) ${progress}%)`
              }}
            />
            <div className="np-time-row">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* ═══════════ CONTROLS ═══════════ */}
          <div className="np-controls">
            <button
              className={`np-icon-btn np-secondary-btn ${isShuffled ? 'np-active-btn' : ''}`}
              onClick={() => setIsShuffled(!isShuffled)}
            >
              <Shuffle size={22} />
            </button>
            <button className="np-icon-btn np-skip-btn" onClick={playPrev}>
              <SkipBack size={30} fill="white" />
            </button>
            <button className="np-play-pause-btn" onClick={togglePlay}>
              {isPlaying
                ? <Pause size={38} fill="white" color="white" />
                : <Play size={38} fill="white" color="white" style={{ marginLeft: 4 }} />
              }
            </button>
            <button className="np-icon-btn np-skip-btn" onClick={() => { playNext(); adManager.logSongChange(); }}>
              <SkipForward size={30} fill="white" />
            </button>
            <button
              className={`np-icon-btn np-secondary-btn ${isLooped ? 'np-active-btn' : ''}`}
              onClick={() => setIsLooped(!isLooped)}
            >
              <Repeat size={22} />
            </button>
          </div>

          {/* ═══════════ SLEEP POPUP (above bottom bar) ═══════════ */}
          {showSleep && (
            <div className="np-panel" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="np-panel-title" style={{ margin: 0 }}>😴 Sleep Timer</span>
                <button onClick={() => setShowSleep(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
              <div className="np-panel-options">
                {sleepOptions.map(min => (
                  <button
                    key={min}
                    className={`np-option-btn ${sleepMinutes === min ? 'np-option-active' : ''}`}
                    onClick={() => activateSleep(min)}
                  >
                    {min} min
                  </button>
                ))}
                <button
                  className={`np-option-btn ${!sleepMinutes ? 'np-option-active' : ''}`}
                  onClick={cancelSleep}
                >
                  Off
                </button>
              </div>
              {sleepMinutes && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>
                  ✅ Timer set for {sleepMinutes} minutes
                </p>
              )}
            </div>
          )}

          {/* ═══════════ BOTTOM BAR ═══════════ */}
          <div className="np-bottom-tabs">
            <button
              className={`np-tab-btn ${showSleep ? 'np-tab-active' : ''}`}
              onClick={() => { setShowSleep(v => !v); setShowEQ(false); }}
            >
              <Moon size={22} />
              <span>{sleepMinutes ? `${sleepMinutes}m` : 'Sleep'}</span>
            </button>
            <button className="np-tab-btn">
              <ListMusic size={22} />
              <span>Queue</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
