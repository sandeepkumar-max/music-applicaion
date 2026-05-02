import { useState, useRef, useEffect } from 'react';
import { Play, FolderPlus, Loader2, ArrowDownUp, Heart, ListMusic, Music2, RefreshCw, MoreVertical, Plus, X } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useMusicStore } from '../store/useMusicStore';
import { scanNativeMusic, scanBrowserFiles } from '../utils/musicScanner';
import '../App.css';

export default function Library() {
  const {
    localSongs, setLocalSongs,
    scanDone, setScanDone,
    likedSongs, playlists,
    setCurrentSong, setPlayerOpen,
    createPlaylist, addToPlaylist,
  } = useMusicStore();

  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [sortAZ, setSortAZ] = useState(false);
  const [tab, setTab] = useState('songs'); // 'songs' | 'liked' | 'playlists'
  const [optionsMenuSong, setOptionsMenuSong] = useState(null); // Used for "Add to playlist" modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const fileInputRef = useRef(null);

  // ── Auto-scan on first open (native Android only) ──────────────────────
  useEffect(() => {
    if (!scanDone && Capacitor.isNativePlatform()) {
      runNativeScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Native Android scan ────────────────────────────────────────────────
  async function runNativeScan() {
    setIsScanning(true);
    setScanCount(0);
    try {
      const songs = await scanNativeMusic((n) => setScanCount(n));
      setLocalSongs(songs);
      setScanDone(true);
    } catch (err) {
      console.warn('Native scan failed', err);
    }
    setIsScanning(false);
  }

  // ── Browser / manual file-picker scan ─────────────────────────────────
  const handleFilePicker = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsScanning(true);
    setScanCount(0);
    const songs = await scanBrowserFiles(files, (n) => setScanCount(n));
    setLocalSongs(songs);
    setScanDone(true);
    setIsScanning(false);
  };

  // ── Play a song ───────────────────────────────────────────────────────
  const playSong = (song) => {
    setCurrentSong(song);
    setPlayerOpen(true);
  };

  // ── Sort ──────────────────────────────────────────────────────────────
  const displaySongs = sortAZ
    ? [...localSongs].sort((a, b) => a.title.localeCompare(b.title))
    : localSongs;

  return (
    <div className="page-container">

      {/* ── Header ── */}
      <div className="top-bar">
        <h1 className="app-title gradient-text">Library</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Rescan button */}
          <button
            onClick={Capacitor.isNativePlatform() ? runNativeScan : () => fileInputRef.current.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--primary)', color: 'white',
              border: 'none', borderRadius: 20, padding: '8px 14px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {isScanning
              ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              : <RefreshCw size={15} />}
            {Capacitor.isNativePlatform() ? 'Rescan' : 'Pick Files'}
          </button>

          {/* Sort */}
          <button
            onClick={() => setSortAZ(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: sortAZ ? 'var(--primary)' : 'var(--surface-hover)',
              color: 'white', border: 'none', borderRadius: 20,
              padding: '8px 12px', fontSize: 13, cursor: 'pointer',
            }}
          >
            <ArrowDownUp size={14} /> {sortAZ ? 'A–Z' : 'Sort'}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        accept="audio/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFilePicker}
      />

      {/* ── Tab Pills ── */}
      <div style={{ display: 'flex', gap: 8, margin: '12px 0 20px' }}>
        {[
          { key: 'songs',     label: `Songs (${localSongs.length})` },
          { key: 'liked',     label: `Liked (${likedSongs.length})` },
          { key: 'playlists', label: `Playlists (${playlists.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 16px', borderRadius: 20, border: 'none',
            background: tab === t.key ? 'var(--primary)' : 'var(--surface-hover)',
            color: tab === t.key ? 'white' : 'var(--text-muted)',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════ SONGS TAB ════════════ */}
      {tab === 'songs' && (
        <>
          {/* Scanning spinner */}
          {isScanning && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎵</div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>Scanning your music…</p>
              <p style={{ fontSize: 13 }}>{scanCount} songs found</p>
              <div style={{
                width: 200, height: 4, background: 'var(--surface-hover)',
                borderRadius: 4, margin: '16px auto 0',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', background: 'var(--primary)',
                  width: '60%',
                  animation: 'shimmer 1.2s ease-in-out infinite',
                }} />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isScanning && (localSongs || []).length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Music2 size={56} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No songs found yet</p>
              {Capacitor.isNativePlatform() ? (
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Tap <strong style={{ color: 'var(--primary)' }}>Rescan</strong> to scan your phone's music folders
                  <br />(Music, Downloads, WhatsApp Audio…)
                </p>
              ) : (
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Tap <strong style={{ color: 'var(--primary)' }}>Pick Files</strong> to choose audio files from your PC
                </p>
              )}
              <button
                onClick={Capacitor.isNativePlatform() ? runNativeScan : () => fileInputRef.current.click()}
                style={{
                  marginTop: 20, background: 'var(--primary)', color: 'white',
                  border: 'none', borderRadius: 24, padding: '12px 32px',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(124,59,237,0.4)',
                }}
              >
                <FolderPlus size={18} />
                {Capacitor.isNativePlatform() ? 'Scan Music Now' : 'Pick Files'}
              </button>
            </div>
          )}

          {/* Song list */}
          {!isScanning && displaySongs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(displaySongs || []).map((song, idx) => (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Artwork / index */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={song.img}
                      alt={song.title}
                      style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                      borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.15s',
                    }}
                      className="song-hover-play"
                    >
                      <Play size={20} fill="white" color="white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: 'var(--text-main)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {song.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {song.artist}
                    </div>
                  </div>

                  {/* Track number / Options */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      #{idx + 1}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOptionsMenuSong(song); }}
                      style={{ padding: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ════════════ LIKED TAB ════════════ */}
      {tab === 'liked' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(likedSongs || []).length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <Heart size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>Heart a song in the player to see it here!</p>
            </div>
          )}
          {(likedSongs || []).map(song => (
            <div
              key={song.id}
              onClick={() => playSong(song)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--surface-hover)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <img src={song.img} alt={song.title} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{song.artist}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Heart size={18} fill="#f43f5e" color="#f43f5e" />
                <button
                  onClick={(e) => { e.stopPropagation(); setOptionsMenuSong(song); }}
                  style={{ padding: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════ PLAYLISTS TAB ════════════ */}
      {tab === 'playlists' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {/* Create Playlist Button */}
          <div
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'rgba(124, 59, 237, 0.1)', borderRadius: 12,
              padding: 16, display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center', gap: 8,
              border: '1px dashed var(--primary)', cursor: 'pointer',
              justifyContent: 'center'
            }}>
            <Plus size={32} color="var(--primary)" />
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>Create Folder</div>
          </div>
          {(playlists || []).map(pl => (
            <div key={pl.id} style={{
              background: 'var(--surface-hover)', borderRadius: 12,
              padding: 16, display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center', gap: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer',
            }}>
              <ListMusic size={32} color="var(--primary)" />
              <div style={{ fontSize: 14, fontWeight: 700 }}>{pl.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pl.songs.length} songs</div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════ OPTIONS MODAL ════════════ */}
      {optionsMenuSong && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }} onClick={() => setOptionsMenuSong(null)}>
          <div style={{
            background: 'var(--surface)', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24,
            animation: 'slideUp 0.3s ease'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>Add to Folder</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{optionsMenuSong.title}</div>
              </div>
              <button onClick={() => setOptionsMenuSong(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            {!(playlists && playlists.length) ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                No folders created yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '40vh', overflowY: 'auto' }}>
                {(playlists || []).map(pl => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      addToPlaylist(pl.id, optionsMenuSong);
                      setOptionsMenuSong(null);
                    }}
                    style={{
                      background: 'var(--surface-hover)', padding: '14px 16px', borderRadius: 12,
                      display: 'flex', alignItems: 'center', gap: 12, border: 'none', color: 'white',
                      textAlign: 'left', cursor: 'pointer'
                    }}
                  >
                    <FolderPlus size={20} color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>{pl.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
                      {(pl.songs || []).length} songs
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════ CREATE PLAYLIST MODAL ════════════ */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setShowCreateModal(false)}>
          <div style={{
            background: 'var(--surface)', padding: 24, borderRadius: 16, width: '100%', maxWidth: 320,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'slideUp 0.2s ease'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 800 }}>Create New Folder</h3>
            <input
              autoFocus
              type="text"
              placeholder="E.g. Workout, Chill Vibes..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)',
                background: 'var(--bg-color)', color: 'white', fontSize: 15, marginBottom: 20, outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => { setShowCreateModal(false); setNewPlaylistName(''); }}
                style={{ padding: '8px 16px', color: 'var(--text-muted)', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPlaylistName.trim()) {
                    createPlaylist(newPlaylistName.trim());
                    setShowCreateModal(false);
                    setNewPlaylistName('');
                  }
                }}
                style={{
                  padding: '8px 20px', background: 'var(--primary)', color: 'white',
                  borderRadius: 8, fontWeight: 700
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .song-hover-play { opacity: 0 !important; }
        div:hover > div > .song-hover-play { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
