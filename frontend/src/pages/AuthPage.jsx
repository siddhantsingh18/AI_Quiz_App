import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const { data } = await axios.post(endpoint, payload);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {/* Decorative orbs */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="fade-up" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="float" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', marginBottom: '16px', fontSize: '32px' }}>
            🧠
          </div>
          <h1 className="shimmer-text" style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>QuizMind AI</h1>
          <p style={{ color: '#8888aa', marginTop: '8px', fontSize: '14px' }} className="mono">Powered by AI</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '36px', backdropFilter: 'blur(20px)' }}>
          {/* Tab Switch */}
          <div style={{ display: 'flex', background: '#0a0a0f', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
            {['Login', 'Register'].map((tab) => (
              <button key={tab} onClick={() => { setIsLogin(tab === 'Login'); setError(''); }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                  background: (isLogin ? tab === 'Login' : tab === 'Register') ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
                  color: (isLogin ? tab === 'Login' : tab === 'Register') ? '#fff' : '#8888aa' }}>
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#8888aa', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>USERNAME</label>
                <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="cooluser123" required
                  style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: '#f0f0ff', fontFamily: 'Space Mono', fontSize: '14px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#2a2a3a'} />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8888aa', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>EMAIL</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" required
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: '#f0f0ff', fontFamily: 'Space Mono', fontSize: '14px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#2a2a3a'} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8888aa', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>PASSWORD</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required
                style={{ width: '100%', padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2a2a3a', borderRadius: '10px', color: '#f0f0ff', fontFamily: 'Space Mono', fontSize: '14px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#2a2a3a'} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#2a2a3a' : 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', letterSpacing: '0.02em' }}>
              {loading ? '⏳ Please wait...' : isLogin ? '🚀 Sign In' : '✨ Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
