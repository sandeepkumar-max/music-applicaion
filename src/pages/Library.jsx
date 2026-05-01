import { useState, useRef } from 'react';
import { Play, FolderPlus, Loader2, ArrowDownUp, Heart, ListMusic } from 'lucide-react';
import * as jsmediatags from 'jsmediatags';
import AdBanner from '../components/AdBanner';
import { useMusicStore } from '../store/useMusicStore';
import '../App.css';

export default function Library() {
  const [localSongs, setLocalSongs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);
  const { likedSongs, playlists } = useMusicStore();

  const handleScan = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('audio/') || file.name.endsWith('.mp3'));
    if (files.length === 0) return;
    
    setIsScanning(true);
    let scannedSongs = [];
    let processed = 0;

    files.forEach((file) => {
      jsmediatags.read(file, {
        onSuccess: (tag) => {
          let imageUrl = 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b5?q=80&w=300&auto=format&fit=crop'; // Fallback
          
          if (tag.tags.picture) {
            try {
              const { data, format } = tag.tags.picture;
              const blob = new Blob([new Uint8Array(data)], { type: format });
              imageUrl = URL.createObjectURL(blob);
            } catch (e) {
              console.error('Error parsing album art', e);
            }
          }

          scannedSongs.push({
            id: file.name + processed,
            title: tag.tags.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: tag.tags.artist || 'Unknown Artist',
            img: imageUrl,
            file: file // Store the actual file to play it later
          });

          checkComplete();
        },
        onError: (error) => {
          console.log('Error reading tags', error);
          scannedSongs.push({
            id: file.name + processed,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: 'Unknown Artist',
            img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b5?q=80&w=300&auto=format&fit=crop',
            file: file
          });
          checkComplete();
        }
      });

      function checkComplete() {
        processed++;
        if (processed === files.length) {
          setLocalSongs(scannedSongs);
          setIsScanning(false);
        }
      }
    });
  };

  const playSong = (song) => {
    // URL.createObjectURL(song.file) can be used to set audio src globally
    console.log("Play this file URL globally:", URL.createObjectURL(song.file));
    alert(`Will play: ${song.title}`);
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <h1 className="app-title gradient-text">Tunefy</h1>
        <button className="user-profile-btn">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" className="avatar" />
        </button>
      </div>

      <AdBanner />

      <div className="section-header" style={{ alignItems: 'center', marginTop: '16px' }}>
        <h2 className="section-title">Your Playlists</h2>
      </div>

      <div className="horizontal-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          gridColumn: '1 / -1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '8px', backgroundColor: 'var(--primary)',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <Heart size={24} fill="white" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>Liked Songs</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{likedSongs.length} songs</div>
          </div>
        </div>

        {playlists.map((playlist) => (
          <div key={playlist.id} style={{
            backgroundColor: 'var(--surface-hover)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <ListMusic size={32} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{playlist.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{playlist.songs.length} songs</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ alignItems: 'center', marginTop: '32px' }}>
        <h2 className="section-title">Local Music</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-main)',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '13px',
          }}>
            <ArrowDownUp size={14} />
            Sort
          </button>
          <button 
            onClick={() => fileInputRef.current.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            {isScanning ? <Loader2 size={16} className="animate-spin" /> : <FolderPlus size={16} />}
            Scan
          </button>
        </div>
        <input 
          type="file" 
          webkitdirectory="true" 
          directory="true" 
          multiple 
          accept="audio/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleScan}
        />
      </div>

      {isScanning && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 16px' }} />
          <p>Scanning your music...</p>
        </div>
      )}

      {!isScanning && localSongs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <p>Click "Scan Folder" to find local MP3 files on your device.</p>
        </div>
      )}

      {!isScanning && localSongs.length > 0 && (
        <div className="horizontal-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {localSongs.map((song) => (
            <div key={song.id} className="music-card" onClick={() => playSong(song)}>
              <div className="card-img-wrapper">
                <img src={song.img} alt={song.title} className="card-img" />
                <button className="card-play-btn">
                  <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
                </button>
              </div>
              <div className="card-title">{song.title}</div>
              <div className="card-subtitle">{song.artist}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
