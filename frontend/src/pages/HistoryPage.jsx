import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/quiz/history').then(r => { setHistory(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const formatTime = s => s ? `${Math.floor(s/60)}m ${s%60}s` : 'N/A';
  const scoreColor = s => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <div className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Quiz <span className="shimmer-text">History</span></h1>
              <p style={{ color: '#8888aa', marginTop: '6px', fontSize: '14px' }}>{history.length} quizzes completed</p>
            </div>
            <button onClick={() => navigate('/setup')}
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              + New Quiz
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#8888aa' }}>Loading...</div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: 'rgba(17,17,24,0.8)', border: '1px solid #2a2a3a', borderRadius: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0f0ff', marginBottom: '8px' }}>No quizzes yet</div>
              <div style={{ color: '#8888aa', marginBottom: '24px' }}>Take your first AI-powered quiz!</div>
              <button onClick={() => navigate('/setup')} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, cursor: 'pointer' }}>Start Quiz</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((item, i) => (
                <div key={item._id} className="fade-up" style={{ animationDelay: `${i * 0.05}s`, background: 'rgba(17,17,24,0.8)', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '20px', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#7c3aed33'; e.currentTarget.style.background = 'rgba(124,58,237,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.background = 'rgba(17,17,24,0.8)'; }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#f0f0ff', marginBottom: '6px' }}>{item.topic}</div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#8888aa' }} className="mono">📝 {item.totalQuestions} questions</span>
                      <span style={{ fontSize: '12px', color: '#8888aa' }} className="mono">✅ {item.correctAnswers} correct</span>
                      {item.timeTaken && <span style={{ fontSize: '12px', color: '#8888aa' }} className="mono">⏱ {formatTime(item.timeTaken)}</span>}
                      <span style={{ fontSize: '12px', color: '#8888aa' }} className="mono">📅 {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: scoreColor(item.score) }}>{item.score}%</div>
                    <div style={{ height: '4px', width: '80px', background: '#1a1a24', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.score}%`, background: scoreColor(item.score), borderRadius: '2px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
