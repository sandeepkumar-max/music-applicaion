import { ChevronDown, Share2, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, MessageSquare, Cast, ListMusic } from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import './NowPlaying.css';

export default function NowPlaying() {
  const { currentSong, isPlayerOpen, setPlayerOpen } = useMusicStore();

  if (!isPlayerOpen || !currentSong) return null;

  return (
    <div className={`now-playing-overlay ${isPlayerOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="np-header">
        <button className="np-close-btn" onClick={() => setPlayerOpen(false)}>
          <ChevronDown size={28} />
        </button>
        <span className="np-title">Now Playing</span>
        <button className="np-share-btn">
          <Share2 size={24} />
        </button>
      </div>

      {/* Album Art */}
      <div className="np-art-container">
        <div className="np-art-glow" style={{ backgroundImage: `url(${currentSong.artwork || currentSong.img})` }}></div>
        <img src={currentSong.artwork || currentSong.img} alt={currentSong.title} className="np-art-img" />
      </div>

      {/* Info */}
      <div className="np-info">
        <h1 className="np-song-title">{currentSong.title}</h1>
        <p className="np-song-artist">{currentSong.artist}</p>
      </div>

      {/* Progress Bar (Waveform Placeholder) */}
      <div className="np-progress-section">
        <div className="np-waveform">
          <div className="wave-bar active"></div>
          <div className="wave-bar active"></div>
          <div className="wave-bar active"></div>
          <div className="wave-bar active"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-dot"></div>
        </div>
        <div className="np-time">
          <span>1:45</span>
          <span>3:50</span>
        </div>
      </div>

      {/* Controls */}
      <div className="np-controls">
        <button className="np-ctrl-btn secondary"><Shuffle size={20} /></button>
        <button className="np-ctrl-btn"><SkipBack size={32} fill="currentColor" /></button>
        <button className="np-play-btn">
          <Pause size={36} fill="currentColor" />
        </button>
        <button className="np-ctrl-btn"><SkipForward size={32} fill="currentColor" /></button>
        <button className="np-ctrl-btn secondary active"><Repeat size={20} /></button>
      </div>

      {/* Bottom Actions */}
      <div className="np-footer">
        <button className="np-footer-btn"><MessageSquare size={22} /></button>
        <button className="np-footer-btn"><Cast size={22} /></button>
        <button className="np-footer-btn"><ListMusic size={22} /></button>
      </div>
    </div>
  );
}
