import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{
    background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '16px',
    padding: '24px', backdropFilter: 'blur(10px)', transition: 'border 0.2s'
  }}
    onMouseOver={e => e.currentTarget.style.borderColor = color + '66'}
    onMouseOut={e => e.currentTarget.style.borderColor = '#2a2a3a'}>
    <div style={{ fontSize: '28px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '32px', fontWeight: 800, color }}>{value}</div>
    <div style={{ fontSize: '13px', color: '#f0f0ff', fontWeight: 600, marginTop: '4px' }}>{label}</div>
    {sub && <div style={{ fontSize: '11px', color: '#8888aa', marginTop: '2px' }}>{sub}</div>}
  </div>
);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/quiz/stats')
      .then(r => { setStats(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/auth'); };
  const avatarHue = user ? (user.username.charCodeAt(0) * 37) % 360 : 200;
  const memberSince = user ? new Date().getFullYear() : '';

  const getScoreTier = (avg) => {
    if (avg >= 90) return { label: 'Grandmaster', icon: '👑', color: '#f59e0b' };
    if (avg >= 80) return { label: 'Expert', icon: '🏆', color: '#10b981' };
    if (avg >= 70) return { label: 'Advanced', icon: '⭐', color: '#06b6d4' };
    if (avg >= 60) return { label: 'Intermediate', icon: '🎯', color: '#7c3aed' };
    if (avg > 0)   return { label: 'Beginner', icon: '🌱', color: '#8888aa' };
    return { label: 'Unranked', icon: '❓', color: '#8888aa' };
  };

  const tier = stats ? getScoreTier(stats.avgScore) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <div className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Profile Header Card */}
          <div className="fade-up" style={{
            background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '24px',
            padding: '36px', marginBottom: '24px', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap'
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '96px', height: '96px', borderRadius: '24px',
                background: `linear-gradient(135deg, hsl(${avatarHue},60%,20%), hsl(${avatarHue},60%,30%))`,
                border: `2px solid hsl(${avatarHue},60%,45%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '40px', fontWeight: 800,
                color: `hsl(${avatarHue},80%,75%)`,
                boxShadow: `0 0 24px hsl(${avatarHue},60%,30%)40`
              }}>
                {user?.username[0].toUpperCase()}
              </div>
              {tier && (
                <div style={{
                  position: 'absolute', bottom: '-8px', right: '-8px',
                  background: '#0a0a0f', border: `1px solid ${tier.color}44`,
                  borderRadius: '8px', padding: '4px 6px', fontSize: '16px'
                }}>{tier.icon}</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', color: '#f0f0ff' }}>
                {user?.username}
              </h1>
              <div style={{ fontSize: '14px', color: '#8888aa', fontFamily: 'Space Mono', marginBottom: '12px' }}>
                {user?.email}
              </div>
              {tier && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${tier.color}15`, border: `1px solid ${tier.color}44`, borderRadius: '8px', padding: '4px 12px' }}>
                  <span style={{ fontSize: '14px' }}>{tier.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: tier.color }}>{tier.label}</span>
                </div>
              )}
            </div>

            {/* Streak */}
            {stats && stats.streak > 0 && (
              <div style={{ textAlign: 'center', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '16px 24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>🔥</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>{stats.streak}</div>
                <div style={{ fontSize: '11px', color: '#8888aa' }}>Day Streak</div>
              </div>
            )}

            <button onClick={handleLogout} style={{
              padding: '10px 20px', background: 'transparent',
              border: '1px solid #ef444433', borderRadius: '10px', color: '#ef4444',
              fontFamily: 'Syne', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
              transition: 'all 0.2s', flexShrink: 0
            }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              Sign Out
            </button>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8888aa' }}>
              <div style={{ width: 32, height: 32, border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin-slow 1s linear infinite', margin: '0 auto 12px' }} />
              Loading stats...
            </div>
          ) : stats ? (
            <>
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <StatCard icon="📝" label="Quizzes Taken" value={stats.totalQuizzes} color="#7c3aed" sub="Total attempts" />
                <StatCard icon="🎯" label="Avg Score" value={`${stats.avgScore}%`} color="#06b6d4" sub="Across all topics" />
                <StatCard icon="🏅" label="Best Score" value={`${stats.bestScore}%`} color="#f59e0b" sub="Personal record" />
                <StatCard icon="💡" label="Questions" value={stats.totalQuestions} color="#10b981" sub="Total answered" />
              </div>

              {/* Top Topics */}
              {stats.topTopics?.length > 0 && (
                <div className="fade-up" style={{ background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '28px', marginBottom: '24px', backdropFilter: 'blur(20px)' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0' }}>📚 Top Topics</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats.topTopics.map((t, i) => {
                      const maxCount = stats.topTopics[0].count;
                      const pct = (t.count / maxCount) * 100;
                      const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];
                      return (
                        <div key={t.topic}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#f0f0ff' }}>{t.topic}</span>
                            <span style={{ fontSize: '13px', color: '#8888aa', fontFamily: 'Space Mono' }}>{t.count} quiz{t.count > 1 ? 'zes' : ''}</span>
                          </div>
                          <div style={{ height: '8px', background: '#1a1a24', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: '4px', transition: 'width 1s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Score Breakdown Visual */}
              <div className="fade-up" style={{ background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '28px', backdropFilter: 'blur(20px)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0' }}>🎖️ Performance Tiers</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Grandmaster', range: '90–100%', icon: '👑', color: '#f59e0b', min: 90 },
                    { label: 'Expert', range: '80–89%', icon: '🏆', color: '#10b981', min: 80 },
                    { label: 'Advanced', range: '70–79%', icon: '⭐', color: '#06b6d4', min: 70 },
                    { label: 'Intermediate', range: '60–69%', icon: '🎯', color: '#7c3aed', min: 60 },
                    { label: 'Beginner', range: '0–59%', icon: '🌱', color: '#8888aa', min: 0 },
                  ].map(t => {
                    const isCurrentTier = stats.avgScore >= t.min && (t.min === 90 ? true : stats.avgScore < t.min + 10 || t.min === 0);
                    const active = tier?.label === t.label;
                    return (
                      <div key={t.label} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        borderRadius: '10px', background: active ? `${t.color}10` : 'transparent',
                        border: `1px solid ${active ? t.color + '44' : 'transparent'}`,
                        transition: 'all 0.2s'
                      }}>
                        <span style={{ fontSize: '20px' }}>{t.icon}</span>
                        <span style={{ flex: 1, fontWeight: active ? 700 : 500, color: active ? t.color : '#8888aa', fontSize: '14px' }}>{t.label}</span>
                        <span style={{ fontSize: '12px', color: '#8888aa', fontFamily: 'Space Mono' }}>{t.range}</span>
                        {active && <span style={{ fontSize: '11px', background: `${t.color}20`, color: t.color, padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>YOU ARE HERE</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(17,17,24,0.8)', border: '1px solid #2a2a3a', borderRadius: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
              <div style={{ color: '#8888aa', marginBottom: '20px' }}>Take some quizzes to see your stats!</div>
              <button onClick={() => navigate('/setup')} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, cursor: 'pointer' }}>Start Quiz</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
