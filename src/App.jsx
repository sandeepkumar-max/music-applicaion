import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import BottomNav from './components/BottomNav';
import BottomPlayer from './components/BottomPlayer';
import NowPlaying from './components/NowPlaying';
import Onboarding from './components/Onboarding';
import PermissionsGate from './components/PermissionsGate';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useMusicStore } from './store/useMusicStore';
import './App.css';

function App() {
  const [permsDone, setPermsDone] = useState(false);
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem('tunefy-onboarded') === 'true'
  );
  const { scanDone, setLocalSongs, setScanDone } = useMusicStore();

  // ── Background scan: as soon as permissions are done, scan in background ──
  useEffect(() => {
    if (!permsDone) return;
    if (scanDone) return;        // already scanned before
    if (!Capacitor.isNativePlatform()) return; // only on Android

    (async () => {
      try {
        const { scanNativeMusic } = await import('./utils/musicScanner');
        const songs = await scanNativeMusic();
        if (songs.length > 0) {
          setLocalSongs(songs);
          setScanDone(true);
        }
      } catch {
        // silent — user can manually rescan from Library
      }
    })();
  }, [permsDone, scanDone, setLocalSongs, setScanDone]);

  // Step 1: Request permissions
  if (!permsDone) {
    return <PermissionsGate onReady={() => setPermsDone(true)} />;
  }

  // Step 2: Show onboarding for new users
  if (!onboarded) {
    return <Onboarding onDone={() => setOnboarded(true)} />;
  }

  // Step 3: Main App
  return (
    <Router>
      <div className="app-container">
        <NowPlaying />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <BottomPlayer />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
