import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Share2, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, MessageSquare, Cast, ListMusic, Heart } from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import './NowPlaying.css';

export default function NowPlaying() {
  const { currentSong, isPlayerOpen, setPlayerOpen, toggleLike, isLiked } = useMusicStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooped, setIsLooped] = useState(false);
  const audioRef = useRef(null);

  const song = currentSong;
  const songIsLiked = song ? isLiked(song.id) : false;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (isPlayerOpen && audioRef.current && song?.src) {
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [song, isPlayerOpen]);

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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!isPlayerOpen || !song) return null;

  return (
    <div className="np-overlay">
      {/* Background blur art */}
      <div
        className="np-bg"
        style={{ backgroundImage: `url(${song.artwork || song.img})` }}
      />
      <div className="np-bg-dim" />

      <audio
        ref={audioRef}
        src={song.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop={isLooped}
      />

      {/* Header */}
      <div className="np-header">
        <button className="np-icon-btn" onClick={() => setPlayerOpen(false)}>
          <ChevronDown size={28} />
        </button>
        <div className="np-header-center">
          <span className="np-header-label">Now Playing</span>
        </div>
        <button className="np-icon-btn">
          <Share2 size={22} />
        </button>
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

      {/* Progress / Waveform */}
      <div className="np-progress-section">
        {/* Waveform visual */}
        <div className="np-waveform">
          {Array.from({ length: 40 }).map((_, i) => {
            const heights = [3,5,8,12,7,14,18,10,6,16,20,13,8,5,11,17,9,14,20,16,12,8,4,10,18,15,7,12,19,14,9,6,13,17,11,8,5,14,10,7];
            const h = heights[i] || 8;
            const isActive = (i / 40) * 100 <= progress;
            return (
              <div
                key={i}
                className={`wf-bar ${isActive ? 'wf-active' : ''}`}
                style={{ height: `${h * 2}px` }}
              />
            );
          })}
          {/* Scrubber dot */}
          <div className="np-scrubber" style={{ left: `${progress}%` }} />
        </div>

        {/* Clickable seek bar */}
        <div className="np-seek-track" onClick={handleSeek}>
          <div className="np-seek-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="np-time-row">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
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

        <button className="np-icon-btn np-skip-btn">
          <SkipForward size={30} fill="white" />
        </button>

        <button
          className={`np-icon-btn np-secondary-btn ${isLooped ? 'np-active-btn' : ''}`}
          onClick={() => setIsLooped(!isLooped)}
        >
          <Repeat size={22} />
        </button>
      </div>

      {/* Bottom Tab Icons */}
      <div className="np-bottom-tabs">
        <button className="np-tab-btn">
          <MessageSquare size={22} />
          <span>Lyrics</span>
        </button>
        <button className="np-tab-btn">
          <Cast size={22} />
          <span>Cast</span>
        </button>
        <button className="np-tab-btn">
          <ListMusic size={22} />
          <span>Queue</span>
        </button>
      </div>
    </div>
  );
}
