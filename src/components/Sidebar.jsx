import { NavLink } from 'react-router-dom';
import { Home, Search, Library, User, Music } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Music size={24} />
        </div>
        MusicApp
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={22} className="nav-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/search" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={22} className="nav-icon" />
          <span>Discover</span>
        </NavLink>
        <NavLink to="/library" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Library size={22} className="nav-icon" />
          <span>Library</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={22} className="nav-icon" />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-heading">Your Playlists</div>
      <div className="playlist-menu">
        <button className="playlist-item">Chill Vibes 2026</button>
        <button className="playlist-item">Coding Sessions</button>
        <button className="playlist-item">Top Hits</button>
        <button className="playlist-item">Daily Mix</button>
        <button className="playlist-item">Indie Discoveries</button>
      </div>
    </aside>
  );
}
