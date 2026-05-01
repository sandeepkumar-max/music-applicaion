import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Camera, Check, X, Edit2 } from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import '../App.css';

export default function Profile() {
  const navigate = useNavigate();
  const { userName, setUserName, userAvatar, setUserAvatar, likedSongs, playlists, history } = useMusicStore();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const fileInputRef = useRef(null);

  const saveName = () => {
    if (tempName.trim()) setUserName(tempName.trim());
    setEditingName(false);
  };

  const cancelEdit = () => {
    setTempName(userName);
    setEditingName(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserAvatar(url);
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <h1 className="app-title gradient-text">Tunefy</h1>
        <button className="icon-btn" onClick={() => navigate('/settings')} style={{ width: '36px', height: '36px' }}>
          <Settings size={20} />
        </button>
      </div>

      {/* Avatar + Name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        {/* Avatar with camera button */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <img
            src={userAvatar}
            alt="Profile"
            style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 3px var(--primary), 0 8px 24px rgba(0,0,0,0.5)' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute', bottom: 4, right: 4,
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--primary)', border: 'none',
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
            }}
          >
            <Camera size={16} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>

        {/* Name edit */}
        {editingName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              autoFocus
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEdit(); }}
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--primary)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '22px',
                fontWeight: 800,
                padding: '6px 14px',
                textAlign: 'center',
                outline: 'none',
                width: '200px'
              }}
            />
            <button onClick={saveName} style={{ background: '#22c55e', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}><Check size={18} /></button>
            <button onClick={cancelEdit} style={{ background: 'var(--surface)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}><X size={18} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>{userName}</h1>
            <button
              onClick={() => { setTempName(userName); setEditingName(true); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
            >
              <Edit2 size={18} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          {[
            { label: 'Playlists', val: playlists.length },
            { label: 'Liked', val: likedSongs.length },
            { label: 'History', val: history.length },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{stat.val}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liked Songs Preview */}
      {likedSongs.length > 0 && (
        <>
          <div className="section-header" style={{ marginBottom: '12px' }}>
            <h2 className="section-title">❤️ Liked Songs</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {likedSongs.slice(0, 5).map(song => (
              <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', borderRadius: '12px', padding: '10px 14px' }}>
                <img src={song.artwork || song.img} alt={song.title} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{song.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{song.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Playlists */}
      <div className="section-header" style={{ marginBottom: '12px' }}>
        <h2 className="section-title">🎵 Playlists</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {playlists.map(pl => (
          <div key={pl.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--surface)', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎮</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{pl.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{pl.songs.length} songs</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
