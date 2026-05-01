import { Search as SearchIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import '../App.css';

export default function Search() {
  const categories = [
    { title: 'Pop', color: '#ff4632' },
    { title: 'Hip-Hop', color: '#bc5900' },
    { title: 'Electronic', color: '#7358ff' },
    { title: 'Rock', color: '#e13300' },
    { title: 'Chill', color: '#1e3264' },
    { title: 'Focus', color: '#509bf5' },
    { title: 'Sleep', color: '#0d73ec' },
    { title: 'Indie', color: '#e91429' },
  ];

  return (
    <div className="page-container">
      {/* Top Bar with Search */}
      <div className="top-bar" style={{ flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="app-title gradient-text">Tunefy</h1>
          <button className="user-profile-btn">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" className="avatar" />
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--surface-hover)',
          padding: '12px 16px',
          borderRadius: '8px',
          width: '100%',
        }}>
          <SearchIcon size={20} color="var(--text-muted)" style={{ marginRight: '10px' }} />
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              width: '100%',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <AdBanner />

      <div className="section-header" style={{ marginTop: '16px' }}>
        <h2 className="section-title">Browse All</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{
            backgroundColor: cat.color,
            height: '200px',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{cat.title}</h3>
            {/* Dummy angled element for styling */}
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              transform: 'rotate(25deg)',
              borderRadius: '10px'
            }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
