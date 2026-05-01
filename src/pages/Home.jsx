import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import NativeAd from '../components/NativeAd';
import '../App.css';

export default function Home() {
  const { history, setCurrentSong, setPlayerOpen } = useMusicStore();

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setPlayerOpen(true);
  };

  const madeForYou = [
    { id: 6, title: 'BGMI Drop Anthems', artist: 'High energy beats for Erangel', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=500&auto=format&fit=crop' },
    { id: 7, title: 'Valorant Clutch', artist: 'Focus and win the 1v5', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop' },
    { id: 8, title: 'PC Master Race', artist: 'EDM & Dubstep mix', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500&auto=format&fit=crop' },
    { id: 9, title: 'Lofi Gaming Chill', artist: 'Relaxed vibes for long grinds', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=500&auto=format&fit=crop' },
  ];

  return (
    <div className="page-container">
      {/* Top Bar */}
      <div className="top-bar">
        <h1 className="app-title gradient-text">Tunefy</h1>
        <button className="user-profile-btn">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" className="avatar" />
        </button>
      </div>

      <div className="section-header">
        <h2 className="section-title gradient-text">Good Evening</h2>
      </div>

      {/* Hero Section or Featured */}
      <div style={{
        width: '100%',
        height: '240px',
        borderRadius: '16px',
        background: 'linear-gradient(90deg, rgba(124, 59, 237, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%), url(https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginBottom: '40px',
        boxShadow: '0 10px 30px rgba(124, 59, 237, 0.3)'
      }}>
        <div style={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '2px', marginBottom: '8px' }}>Gamer's Choice</div>
        <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Ultimate Gaming Mix</div>
        <div>
          <button style={{
            background: 'white',
            color: 'black',
            padding: '12px 32px',
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '14px',
            marginRight: '16px',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
          }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => handlePlaySong(madeForYou[0])}
          >Play Now</button>
        </div>
      </div>

      {/* Recently Played */}
      <div className="section-header">
        <h2 className="section-title">Recently Played</h2>
        <a href="#" className="see-all">See all</a>
      </div>

      <div className="horizontal-scroll">
        {history.length > 0 ? history.map((song) => (
          <div key={song.id} className="music-card" onClick={() => handlePlaySong(song)}>
            <div className="card-img-wrapper">
              <img src={song.artwork || song.img} alt={song.title} className="card-img" />
              <button className="card-play-btn">
                <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
              </button>
            </div>
            <div className="card-title">{song.title}</div>
            <div className="card-subtitle">{song.artist}</div>
          </div>
        )) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>
            No recent history. Play a song to see it here!
          </div>
        )}
      </div>

      <div style={{ margin: '24px 0' }}>
        <NativeAd />
      </div>

      {/* Made For You */}
      <div className="section-header">
        <h2 className="section-title">Made For You</h2>
        <a href="#" className="see-all">See all</a>
      </div>

      <div className="horizontal-scroll">
        {madeForYou.map((playlist) => (
          <div key={playlist.id} className="music-card" onClick={() => handlePlaySong(playlist)}>
            <div className="card-img-wrapper">
              <img src={playlist.img} alt={playlist.title} className="card-img" />
              <button className="card-play-btn">
                <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
              </button>
            </div>
            <div className="card-title">{playlist.title}</div>
            <div className="card-subtitle">{playlist.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
