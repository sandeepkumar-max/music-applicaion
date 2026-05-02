import { useState } from 'react';
import { Search as SearchIcon, Play, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusicStore } from '../store/useMusicStore';
import { FREE_CATEGORIES } from '../data/freeMusicData';
import '../App.css';

export default function Search() {
  const navigate = useNavigate();
  const { setCurrentSong, setPlayerOpen } = useMusicStore();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null); // null = show all grid

  const playSong = (song) => {
    setCurrentSong(song);
    setPlayerOpen(true);
  };

  // Filter songs by search query
  const searchResults = query.trim()
    ? FREE_CATEGORIES.flatMap(c => c.songs).filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const openCat = activeCategory
    ? FREE_CATEGORIES.find(c => c.id === activeCategory)
    : null;

  return (
    <div className="page-container">

      {/* ── Header ── */}
      <div className="top-bar">
        <h1 className="app-title gradient-text">Discover</h1>
        <button className="user-profile-btn" onClick={() => navigate('/profile')}>
          <img
            src={useMusicStore.getState().userAvatar}
            alt="User"
            className="avatar"
          />
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--surface-hover)', borderRadius: 14,
        padding: '12px 16px', marginBottom: 24,
        border: '1px solid rgba(124,59,237,0.2)',
      }}>
        <SearchIcon size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search BGM, Sleep, Lofi…"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveCategory(null); }}
          style={{
            background: 'none', border: 'none', color: 'white',
            width: '100%', fontSize: 14, outline: 'none',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}>×</button>
        )}
      </div>

      {/* ── Search Results ── */}
      {query.trim() && (
        <>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
            {searchResults.length} results for "{query}"
          </p>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
              <p>No songs found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {searchResults.map(song => (
                <SongRow key={song.id} song={song} onPlay={playSong} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Category Detail View ── */}
      {!query && openCat && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => setActiveCategory(null)}
              style={{ color: 'var(--text-muted)', fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
            >‹</button>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>{openCat.label}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {openCat.songs.map(song => (
              <SongRow key={song.id} song={song} onPlay={playSong} accentColor={openCat.color} />
            ))}
          </div>
        </>
      )}

      {/* ── Category Grid ── */}
      {!query && !openCat && (
        <>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <h2 className="section-title">🎵 Free Music</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No login needed</span>
          </div>

          {/* Category Pills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
            {FREE_CATEGORIES.map(cat => (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: `linear-gradient(135deg, ${cat.color}cc, ${cat.color}66)`,
                  border: `1px solid ${cat.color}55`,
                  borderRadius: 14, padding: '18px 16px',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.15s',
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{cat.label.split(' ')[0]}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'white' }}>
                  {cat.label.slice(cat.label.indexOf(' ') + 1)}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                  {cat.songs.length} songs · Free
                </div>
                <ChevronRight
                  size={18}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}
                />
              </div>
            ))}
          </div>

          {/* Featured picks — 3 songs from each category */}
          {FREE_CATEGORIES.map(cat => (
            <div key={cat.id} style={{ marginBottom: 28 }}>
              <div className="section-header" style={{ marginBottom: 12 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>{cat.label}</h3>
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  See all
                </button>
              </div>
              <div className="horizontal-scroll">
                {cat.songs.slice(0, 4).map(song => (
                  <div
                    key={song.id}
                    className="music-card"
                    onClick={() => playSong(song)}
                  >
                    <div className="card-img-wrapper">
                      <img src={song.img} alt={song.title} className="card-img" />
                      <button className="card-play-btn">
                        <Play size={22} fill="white" color="white" style={{ marginLeft: 3 }} />
                      </button>
                    </div>
                    <div className="card-title">{song.title}</div>
                    <div className="card-subtitle">{song.artist}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Reusable Song Row ────────────────────────────────────────────────────────
function SongRow({ song, onPlay, accentColor = '#7c3aed' }) {
  return (
    <div
      onClick={() => onPlay(song)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 8px', borderRadius: 12, cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--surface-hover)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={song.img} alt={song.title}
          style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.15s',
        }}
          className="song-play-overlay"
        >
          <Play size={18} fill="white" color="white" />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {song.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{song.artist}</div>
      </div>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: accentColor, flexShrink: 0, opacity: 0.7,
      }} />
    </div>
  );
}
