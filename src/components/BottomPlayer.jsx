import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, SkipForward } from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import { adManager } from '../utils/adManager';
import './BottomPlayer.css';

export default function BottomPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const { toggleLike, isLiked, addToHistory } = useMusicStore();

  const song = {
    id: "song-1", // added ID
    title: "Neon Nights",
    artist: "Synthwave Journey",
    album: "Midnight Drive",
    artwork: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150&auto=format&fit=crop",
    // Royalty free audio url for testing
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  };

  const songIsLiked = isLiked(song.id);

  // Swipe Gesture State
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      console.log('Swiped Left - Next Song');
      adManager.logSongChange();
      alert("Next Song (Swiped Left < )");
    }
    if (isRightSwipe) {
      console.log('Swiped Right - Previous Song');
      // Call previous song logic here
      alert("Previous Song (Swiped Right > )");
    }
  };

  useEffect(() => {
    // Add to history when player mounts
    addToHistory(song);
    
    // Setup Media Session API for Lock Screen Controls & Background Playback
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: [
          { src: song.artwork, sizes: '96x96', type: 'image/jpeg' },
          { src: song.artwork, sizes: '128x128', type: 'image/jpeg' },
          { src: song.artwork, sizes: '192x192', type: 'image/jpeg' },
          { src: song.artwork, sizes: '256x256', type: 'image/jpeg' },
          { src: song.artwork, sizes: '384x384', type: 'image/jpeg' },
          { src: song.artwork, sizes: '512x512', type: 'image/jpeg' },
        ]
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
        // Reset to start for now
        if (audioRef.current) audioRef.current.currentTime = 0;
      });
      
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        console.log("Next track triggered from lock screen");
      });
    }

    const handleStopMusic = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('stop-music', handleStopMusic);
    
    return () => {
      window.removeEventListener('stop-music', handleStopMusic);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  return (
    <div className="mini-player" onClick={(e) => {
      // Prevent toggling play when clicking specific buttons
      if(e.target.closest('button')) return;
      togglePlay();
    }}>
      <audio 
        ref={audioRef} 
        src={song.src} 
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
      />
      
      <div className="mini-player-left">
        <img 
          src={song.artwork} 
          alt="Album Art" 
          className="mini-playing-img"
        />
        <div className="mini-playing-info">
          <div className="mini-song-title">{song.title}</div>
          <div className="mini-artist-name">{song.artist}</div>
        </div>
      </div>

      <div className="mini-player-right">
        <button className="mini-control-btn" onClick={() => toggleLike(song)}>
          <Heart size={20} fill={songIsLiked ? "var(--primary)" : "none"} color={songIsLiked ? "var(--primary)" : "currentColor"} />
        </button>
        <button className="mini-control-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <button className="mini-control-btn"><SkipForward size={20} fill="currentColor" /></button>
      </div>
      
      <div className="mini-progress-bar">
        <div className="mini-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
