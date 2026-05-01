import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, Share2, Shuffle, SkipBack, Play, Pause,
  SkipForward, Repeat, MessageSquare, Cast, ListMusic, Heart
} from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import { adManager } from '../utils/adManager';
import './NowPlaying.css';

// NowPlaying is the SINGLE SOURCE OF TRUTH for audio playback.
// BottomPlayer only reads isPlaying from the store for its display.
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
  } = useMusicStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooped, setIsLooped] = useState(false);
  const audioRef = useRef(null);

  const song = currentSong;
  const songIsLiked = song ? isLiked(song.id) : false;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  // Load & auto-play when song changes or player opens
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
  }, [song?.id]);

  // Setup MediaSession lock screen API
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
      if (audioRef.current) audioRef.current.currentTime = 0;
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      adManager.logSongChange();
    });
  }, [song?.id]);

  // Sleep timer stop
  useEffect(() => {
    const handleStop = () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    };
    window.addEventListener('stop-music', handleStop);
    return () => window.removeEventListener('stop-music', handleStop);
  }, []);

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
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Always render audio so it persists; overlay only shows when open
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

          {/* Header */}
          <div className="np-header">
            <button className="np-icon-btn" onClick={() => setPlayerOpen(false)}>
              <ChevronDown size={28} />
            </button>
            <span className="np-header-label">Now Playing</span>
            <button className="np-icon-btn"><Share2 size={22} /></button>
          </div>

          {/* Album Art */}
          <div className="np-art-wrapper">
            <div className="np-art-glow" style={{ backgroundImage: `url(${song.artwork || song.img})` }} />
            <img
              src={song.artwork || song.img}
              alt={song.title}
              className={`np-art-img ${isPlaying ? 'np-art-playing' : ''}`}
            />
          </div>

          {/* Song Info + Like */}
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

          {/* Waveform + Seek */}
          <div className="np-progress-section">
            <div className="np-waveform" onClick={handleSeek} style={{ cursor: 'pointer' }}>
              {Array.from({ length: 40 }).map((_, i) => {
                const heights = [3,5,8,12,7,14,18,10,6,16,20,13,8,5,11,17,9,14,20,16,12,8,4,10,18,15,7,12,19,14,9,6,13,17,11,8,5,14,10,7];
                const h = heights[i] || 8;
                const isActive = (i / 40) * 100 <= progress;
                return (
                  <div key={i} className={`wf-bar ${isActive ? 'wf-active' : ''}`} style={{ height: `${h * 2}px` }} />
                );
              })}
              <div className="np-scrubber" style={{ left: `${progress}%` }} />
            </div>
            <div className="np-time-row">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="np-controls">
            <button
              className={`np-icon-btn np-secondary-btn ${isShuffled ? 'np-active-btn' : ''}`}
              onClick={() => setIsShuffled(!isShuffled)}
            >
              <Shuffle size={22} />
            </button>
            <button className="np-icon-btn np-skip-btn">
              <SkipBack size={30} fill="white" />
            </button>
            <button className="np-play-pause-btn" onClick={togglePlay}>
              {isPlaying
                ? <Pause size={38} fill="white" color="white" />
                : <Play size={38} fill="white" color="white" style={{ marginLeft: 4 }} />
              }
            </button>
            <button className="np-icon-btn np-skip-btn" onClick={() => adManager.logSongChange()}>
              <SkipForward size={30} fill="white" />
            </button>
            <button
              className={`np-icon-btn np-secondary-btn ${isLooped ? 'np-active-btn' : ''}`}
              onClick={() => setIsLooped(!isLooped)}
            >
              <Repeat size={22} />
            </button>
          </div>

          {/* Bottom Tabs */}
          <div className="np-bottom-tabs">
            <button className="np-tab-btn"><MessageSquare size={22} /><span>Lyrics</span></button>
            <button className="np-tab-btn"><Cast size={22} /><span>Cast</span></button>
            <button className="np-tab-btn"><ListMusic size={22} /><span>Queue</span></button>
          </div>
        </div>
      )}
    </>
  );
}
