import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/auth'); };
  const nav = [
    { label: 'Dashboard', path: '/', icon: '⚡' },
    { label: 'New Quiz', path: '/setup', icon: '🎯' },
    { label: 'History', path: '/history', icon: '📊' },
    { label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
  ];

  return (
    <nav style={{ background: 'rgba(17,17,24,0.95)', borderBottom: '1px solid #2a2a3a', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ fontSize: '24px' }}>🧠</span>
          <span className="shimmer-text" style={{ fontSize: '20px', fontWeight: 800 }}>QuizMind AI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {nav.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                background: location.pathname === item.path ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: location.pathname === item.path ? '#a78bfa' : '#8888aa' }}>
              <span style={{ marginRight: '4px' }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div onClick={() => navigate('/profile')} style={{ textAlign: 'right', cursor: 'pointer' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f0f0ff' }}>{user?.username}</div>
            <div style={{ fontSize: '11px', color: '#8888aa' }} className="mono">{user?.email}</div>
          </div>
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: `hsl(${user ? (user.username.charCodeAt(0) * 37) % 360 : 200},60%,22%)`,
              border: `1px solid hsl(${user ? (user.username.charCodeAt(0) * 37) % 360 : 200},60%,40%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 800,
              color: `hsl(${user ? (user.username.charCodeAt(0) * 37) % 360 : 200},80%,70%)`,
              cursor: 'pointer', flexShrink: 0
            }}>
            {user?.username[0].toUpperCase()}
          </div>
        </div>
      </div>
    </nav>
  );
}
