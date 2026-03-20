import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/quiz/history').then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const avgScore = history.length ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0;
  const topicsDone = [...new Set(history.map(h => h.topic))].length;

  const topics = [
    { name: 'Python', icon: '🐍', color: '#3b82f6' },
    { name: 'JavaScript', icon: '⚡', color: '#f59e0b' },
    { name: 'Java', icon: '☕', color: '#ef4444' },
    { name: 'React', icon: '⚛️', color: '#06b6d4' },
    { name: 'SQL', icon: '🗄️', color: '#10b981' },
    { name: 'Machine Learning', icon: '🤖', color: '#8b5cf6' },
    { name: 'Data Structures', icon: '🌳', color: '#f97316' },
    { name: 'CSS', icon: '🎨', color: '#ec4899' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <div className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Hero */}
          <div className="fade-up" style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
              Welcome back,<br />
              <span className="shimmer-text">{user?.username}! 👋</span>
            </h1>
            <p style={{ color: '#8888aa', marginTop: '12px', fontSize: '16px' }}>Ready to challenge your knowledge with AI-generated quizzes?</p>
          </div>

          {/* Stats */}
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
            {[
              { label: 'Quizzes Taken', value: history.length, icon: '📝', color: '#7c3aed' },
              { label: 'Avg Score', value: `${avgScore}%`, icon: '🎯', color: '#06b6d4' },
              { label: 'Topics Explored', value: topicsDone, icon: '🌐', color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(17,17,24,0.8)', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#8888aa', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Start Topics */}
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Quick Start</h2>
              <button onClick={() => navigate('/setup')}
                style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'Syne', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                Custom Topic →
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {topics.map(t => (
                <button key={t.name} onClick={() => navigate('/setup', { state: { topic: t.name } })}
                  style={{ padding: '20px 16px', background: 'rgba(17,17,24,0.8)', border: `1px solid ${t.color}22`, borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Syne' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = `${t.color}11`; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = `${t.color}22`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(17,17,24,0.8)'; }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{t.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0f0ff' }}>{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent History */}
          {history.length > 0 && (
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Recent Quizzes</h2>
                <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600, fontSize: '13px' }}>See All →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.slice(0, 3).map(item => (
                  <div key={item._id} style={{ background: 'rgba(17,17,24,0.8)', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f0f0ff', marginBottom: '4px' }}>{item.topic}</div>
                      <div style={{ fontSize: '12px', color: '#8888aa' }} className="mono">{new Date(item.createdAt).toLocaleDateString()} • {item.totalQuestions} questions</div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {item.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
