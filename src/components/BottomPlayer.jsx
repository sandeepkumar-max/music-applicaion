import { Play, Pause, SkipForward, Heart, X } from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import './BottomPlayer.css';

// BottomPlayer is ONLY a display component - it has NO audio element.
// All audio is handled inside NowPlaying.jsx
export default function BottomPlayer() {
  const {
    currentSong: song,
    isPlaying,
    isPlayerOpen,
    setPlayerOpen,
    toggleLike,
    isLiked,
    clearCurrentSong,
    localSongs,
    history,
    setCurrentSong,
  } = useMusicStore();

  if (!song || isPlayerOpen) return null; // Hide when full player is open

  const songIsLiked = isLiked(song.id);

  // Clicking art/info opens full player
  const openPlayer = () => setPlayerOpen(true);

  // ── Close: stop audio + dismiss player ──────────────────────────
  const handleClose = (e) => {
    e.stopPropagation();
    // Tell NowPlaying to pause via custom event
    window.dispatchEvent(new CustomEvent('stop-music'));
    clearCurrentSong();
  };

  // ── Next song ───────────────────────────────────────────────────
  const handleNext = (e) => {
    e.stopPropagation();

    // Build a queue: localSongs first, then history (deduplicated)
    const queue = localSongs.length > 0 ? localSongs : history;
    if (queue.length === 0) return;

    const currentIdx = queue.findIndex(s => s.id === song.id);
    const nextIdx = currentIdx === -1 || currentIdx === queue.length - 1
      ? 0
      : currentIdx + 1;

    setCurrentSong(queue[nextIdx]);
    // NowPlaying will auto-play because song?.id changed
  };

  // ── Play/Pause toggle via custom event ─────────────────────────
  const handlePlayPause = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('toggle-play-mini'));
  };

  return (
    <div className="mini-player" onClick={openPlayer}>

      {/* Progress bar at top */}
      <div className="mini-progress-bar">
        <div className="mini-progress-fill mini-progress-animated" />
      </div>

      {/* Album Art */}
      <img
        src={song.artwork || song.img}
        alt={song.title}
        className="mini-player-art"
      />

      {/* Song Info */}
      <div className="mini-player-info">
        <div className="mini-song-title">{song.title}</div>
        <div className="mini-artist-name">{song.artist}</div>
      </div>

      {/* Controls */}
      <div className="mini-player-right" onClick={(e) => e.stopPropagation()}>

        {/* Play / Pause */}
        <button className="mini-control-btn" onClick={handlePlayPause} title="Play / Pause">
          {isPlaying
            ? <Pause size={22} fill="currentColor" />
            : <Play  size={22} fill="currentColor" />
          }
        </button>

        {/* Next Song */}
        <button className="mini-control-btn mini-next-btn" onClick={handleNext} title="Next Song">
          <SkipForward size={22} fill="currentColor" />
        </button>

        {/* Close */}
        <button className="mini-control-btn mini-close-btn" onClick={handleClose} title="Close Player">
          <X size={20} />
        </button>

      </div>
    </div>
  );
}
