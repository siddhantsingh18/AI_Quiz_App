import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const medals = ['🥇', '🥈', '🥉'];
const rankColors = ['#f59e0b', '#94a3b8', '#cd7c3a'];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/quiz/leaderboard')
      .then(r => { setLeaders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const barWidth = (score) => `${Math.max(10, score)}%`;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <div className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Header */}
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '52px', marginBottom: '12px' }}>🏆</div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>
              <span className="shimmer-text">Leaderboard</span>
            </h1>
            <p style={{ color: '#8888aa', marginTop: '8px', fontSize: '14px' }}>Top performers ranked by average score</p>
          </div>

          {/* Top 3 Podium */}
          {!loading && leaders.length >= 3 && (
            <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
              {[leaders[1], leaders[0], leaders[2]].map((l, idx) => {
                const realRank = idx === 0 ? 1 : idx === 1 ? 0 : 2;
                const heights = ['160px', '200px', '140px'];
                return (
                  <div key={l._id || idx} style={{ flex: 1, maxWidth: '200px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0f0ff', marginBottom: '6px' }}>{l.username}</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: rankColors[realRank], marginBottom: '8px' }}>{l.avgScore}%</div>
                    <div style={{
                      height: heights[idx],
                      background: realRank === 0
                        ? 'linear-gradient(180deg, rgba(245,158,11,0.3), rgba(245,158,11,0.05))'
                        : realRank === 1
                          ? 'linear-gradient(180deg, rgba(148,163,184,0.2), rgba(148,163,184,0.05))'
                          : 'linear-gradient(180deg, rgba(205,124,58,0.2), rgba(205,124,58,0.05))',
                      border: `1px solid ${rankColors[realRank]}44`,
                      borderBottom: 'none',
                      borderRadius: '12px 12px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      <div style={{ fontSize: '32px' }}>{medals[realRank]}</div>
                      <div style={{ fontSize: '11px', color: '#8888aa', fontFamily: 'Space Mono' }}>{l.totalQuizzes} quizzes</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Rankings */}
          <div className="fade-up" style={{ background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #2a2a3a', display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#8888aa', fontWeight: 700, letterSpacing: '0.08em' }}>#</div>
              <div style={{ fontSize: '11px', color: '#8888aa', fontWeight: 700, letterSpacing: '0.08em' }}>PLAYER</div>
              <div style={{ fontSize: '11px', color: '#8888aa', fontWeight: 700, letterSpacing: '0.08em', textAlign: 'center' }}>AVG</div>
              <div style={{ fontSize: '11px', color: '#8888aa', fontWeight: 700, letterSpacing: '0.08em', textAlign: 'center' }}>BEST</div>
              <div style={{ fontSize: '11px', color: '#8888aa', fontWeight: 700, letterSpacing: '0.08em', textAlign: 'center' }}>QUIZZES</div>
            </div>

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#8888aa' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #2a2a3a', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin-slow 1s linear infinite', margin: '0 auto 12px' }} />
                Loading rankings...
              </div>
            ) : leaders.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎮</div>
                <div style={{ color: '#8888aa' }}>No players yet — be the first!</div>
              </div>
            ) : (
              leaders.map((l, i) => {
                const isMe = l.username === user?.username;
                return (
                  <div key={l._id || i} style={{
                    padding: '16px 24px',
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr 80px 80px 80px',
                    gap: '12px',
                    alignItems: 'center',
                    borderBottom: i < leaders.length - 1 ? '1px solid #1a1a24' : 'none',
                    background: isMe ? 'rgba(124,58,237,0.08)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                    onMouseOver={e => { if (!isMe) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseOut={e => { if (!isMe) e.currentTarget.style.background = 'transparent'; }}>

                    <div style={{ fontWeight: 800, fontSize: '18px', color: i < 3 ? rankColors[i] : '#8888aa', textAlign: 'center' }}>
                      {i < 3 ? medals[i] : `${i + 1}`}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: `hsl(${(l.username.charCodeAt(0) * 37) % 360}, 60%, 25%)`,
                        border: `1px solid hsl(${(l.username.charCodeAt(0) * 37) % 360}, 60%, 40%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: 800, color: `hsl(${(l.username.charCodeAt(0) * 37) % 360}, 80%, 70%)`,
                        flexShrink: 0
                      }}>
                        {l.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: isMe ? '#a78bfa' : '#f0f0ff' }}>
                          {l.username} {isMe && <span style={{ fontSize: '11px', color: '#7c3aed', background: 'rgba(124,58,237,0.2)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>You</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8888aa', fontFamily: 'Space Mono' }}>{l.totalQuestions} Qs answered</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: l.avgScore >= 80 ? '#10b981' : l.avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>{l.avgScore}%</div>
                      <div style={{ height: '3px', background: '#1a1a24', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: barWidth(l.avgScore), background: l.avgScore >= 80 ? '#10b981' : l.avgScore >= 60 ? '#f59e0b' : '#ef4444', borderRadius: '2px' }} />
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '15px', color: '#f59e0b', fontFamily: 'Space Mono' }}>{l.bestScore}%</div>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '15px', color: '#8888aa', fontFamily: 'Space Mono' }}>{l.totalQuizzes}</div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button onClick={() => navigate('/setup')}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
              🚀 Take a Quiz to Rank Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
