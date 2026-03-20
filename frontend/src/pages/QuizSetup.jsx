import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function QuizSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const difficulties = [
    { value: 'easy', label: 'Easy', icon: '🌱', desc: 'Beginner friendly' },
    { value: 'medium', label: 'Medium', icon: '🔥', desc: 'Balanced challenge' },
    { value: 'hard', label: 'Hard', icon: '💀', desc: 'Expert level' },
  ];

  const handleStart = async () => {
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/quiz/generate', { topic: topic.trim(), numQuestions, difficulty });
      navigate('/quiz', { state: { questions: data.questions, topic: data.topic, difficulty } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz. Make sure your GROK_API_KEY is set in backend/.env and the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <div className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', padding: '60px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: '560px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0 }}>Configure <span className="shimmer-text">Your Quiz</span></h1>
            <p style={{ color: '#8888aa', marginTop: '8px' }}>Set up your AI-powered quiz experience</p>
          </div>

          <div style={{ background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '36px', backdropFilter: 'blur(20px)' }}>

            {/* Topic Input */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8888aa', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.08em' }}>QUIZ TOPIC</label>
              <input value={topic} onChange={e => { setTopic(e.target.value); setError(''); }}
                placeholder="e.g. Python, React, World History, Quantum Physics..."
                onKeyDown={e => e.key === 'Enter' && handleStart()}
                style={{ width: '100%', padding: '14px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '12px', color: '#f0f0ff', fontFamily: 'Space Mono', fontSize: '14px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#2a2a3a'} />
            </div>

            {/* Number of Questions */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8888aa', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.08em' }}>NUMBER OF QUESTIONS: <span style={{ color: '#7c3aed', fontFamily: 'Space Mono' }}>{numQuestions}</span></label>
              <input type="range" min="3" max="20" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                {[3, 5, 10, 15, 20].map(n => (
                  <button key={n} onClick={() => setNumQuestions(n)}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: `1px solid ${numQuestions === n ? '#7c3aed' : '#2a2a3a'}`, background: numQuestions === n ? 'rgba(124,58,237,0.2)' : 'transparent', color: numQuestions === n ? '#a78bfa' : '#8888aa', fontFamily: 'Space Mono', fontSize: '12px', cursor: 'pointer' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8888aa', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.08em' }}>DIFFICULTY</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {difficulties.map(d => (
                  <button key={d.value} onClick={() => setDifficulty(d.value)}
                    style={{ padding: '16px 12px', borderRadius: '12px', border: `1px solid ${difficulty === d.value ? '#7c3aed' : '#2a2a3a'}`, background: difficulty === d.value ? 'rgba(124,58,237,0.15)' : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'Syne' }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{d.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: difficulty === d.value ? '#a78bfa' : '#f0f0ff', marginBottom: '2px' }}>{d.label}</div>
                    <div style={{ fontSize: '11px', color: '#8888aa' }}>{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleStart} disabled={loading}
              className={loading ? '' : 'glow-pulse'}
              style={{ width: '100%', padding: '16px', background: loading ? '#2a2a3a' : 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', letterSpacing: '0.02em' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  Generating Questions with AI...
                </span>
              ) : `🚀 Start Quiz — ${numQuestions} Questions`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
