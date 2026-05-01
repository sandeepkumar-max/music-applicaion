import { useNavigate } from 'react-router-dom';
import { Settings, Edit3 } from 'lucide-react';
import '../App.css';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="top-bar">
        <h1 className="app-title gradient-text">Tunefy</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="icon-btn" style={{ width: '32px', height: '32px' }}><Edit3 size={18} /></button>
          <button className="icon-btn" onClick={() => navigate('/settings')} style={{ width: '32px', height: '32px' }}><Settings size={18} /></button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop" 
          alt="User Profile" 
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            marginBottom: '16px'
          }}
        />
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0', letterSpacing: '-1px' }}>Alex Walker</h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          12 Playlists • 342 Followers • 45 Following
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Top Artists</h2>
      </div>

      <div className="horizontal-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ textAlign: 'center', cursor: 'pointer' }}>
            <img 
              src={`https://images.unsplash.com/photo-${1500000000000 + i * 1234567}?q=80&w=200&auto=format&fit=crop`} 
              alt={`Artist ${i}`}
              style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                background: 'var(--surface-hover)'
              }}
            />
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Artist {i}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
