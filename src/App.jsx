import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  const [permsDone, setPermsDone] = useState(false);
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem('tunefy-onboarded') === 'true'
  );

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
