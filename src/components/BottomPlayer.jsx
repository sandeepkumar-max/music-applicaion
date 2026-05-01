import { Play, Pause, SkipForward, Heart } from 'lucide-react';
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
  } = useMusicStore();

  if (!song || isPlayerOpen) return null; // Hide when full player is open

  const songIsLiked = isLiked(song.id);

  // Clicking the art/info area opens full player
  const openPlayer = () => setPlayerOpen(true);

  return (
    <div className="mini-player" onClick={openPlayer}>
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

      {/* Controls - stop propagation so clicks don't open player */}
      <div className="mini-player-right" onClick={(e) => e.stopPropagation()}>
        <button
          className="mini-control-btn"
          onClick={() => toggleLike(song)}
        >
          <Heart
            size={20}
            fill={songIsLiked ? '#f43f5e' : 'none'}
            color={songIsLiked ? '#f43f5e' : 'currentColor'}
          />
        </button>

        {/* Play/Pause — opens player for actual control */}
        <button
          className="mini-control-btn"
          onClick={openPlayer}
        >
          {isPlaying
            ? <Pause size={22} fill="currentColor" />
            : <Play size={22} fill="currentColor" />
          }
        </button>

        <button className="mini-control-btn" onClick={openPlayer}>
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
