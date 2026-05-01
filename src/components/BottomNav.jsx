import { NavLink } from 'react-router-dom';
import { Home, Search, Library, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <nav className="bottom-nav glass">
      <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} className="nav-icon" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/search" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={24} className="nav-icon" />
        <span>Search</span>
      </NavLink>
      <NavLink to="/library" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <Library size={24} className="nav-icon" />
        <span>Library</span>
      </NavLink>
      <NavLink to="/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} className="nav-icon" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
