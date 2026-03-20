import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const confettiRef = useRef(null);

  if (!state) { navigate('/'); return null; }

  const { score, correctCount, totalQuestions, feedback, questionResults, topic, timeTaken } = state;

  const formatTime = s => s ? `${Math.floor(s/60)}m ${s%60}s` : 'N/A';
  const grade = score >= 90 ? { label: 'S', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', msg: 'Outstanding!' }
    : score >= 80 ? { label: 'A', color: '#10b981', bg: 'rgba(16,185,129,0.15)', msg: 'Excellent!' }
    : score >= 70 ? { label: 'B', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', msg: 'Good Job!' }
    : score >= 60 ? { label: 'C', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)', msg: 'Not Bad!' }
    : { label: 'F', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', msg: 'Keep Practicing!' };

  const circumference = 2 * Math.PI * 52;
  const strokeDash = (score / 100) * circumference;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <div className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>

          {/* Score Card */}
          <div className="fade-up" style={{ background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '24px', padding: '40px', marginBottom: '24px', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#8888aa', marginBottom: '8px' }} className="mono">{topic}</div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 32px 0' }}>
              Quiz <span className="shimmer-text">Complete!</span>
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {/* Circular progress */}
              <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#1a1a24" strokeWidth="10" />
                  <circle cx="70" cy="70" r="52" fill="none" stroke={grade.color} strokeWidth="10"
                    strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: grade.color }}>{score}%</div>
                  <div style={{ fontSize: '11px', color: '#8888aa' }}>Score</div>
                </div>
              </div>

              {/* Grade */}
              <div>
                <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: grade.bg, border: `2px solid ${grade.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 800, color: grade.color, marginBottom: '8px' }}>
                  {grade.label}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: grade.color }}>{grade.msg}</div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Correct', value: `${correctCount} / ${totalQuestions}`, color: '#10b981' },
                  { label: 'Wrong', value: totalQuestions - correctCount, color: '#ef4444' },
                  { label: 'Time', value: formatTime(timeTaken), color: '#7c3aed' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#8888aa', width: '50px' }}>{s.label}</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: s.color }} className="mono">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Feedback */}
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '14px', padding: '20px 24px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>🤖 AI FEEDBACK</div>
              <p style={{ fontSize: '15px', color: '#c0c0d8', lineHeight: 1.7, margin: 0 }}>{feedback}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px' }}>
              <button onClick={() => navigate('/setup')}
                style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                🔄 New Quiz
              </button>
              <button onClick={() => navigate('/')}
                style={{ padding: '12px 28px', background: 'transparent', border: '1px solid #2a2a3a', borderRadius: '10px', color: '#f0f0ff', fontFamily: 'Syne', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                🏠 Dashboard
              </button>
            </div>
          </div>

          {/* Question Review */}
          <div className="fade-up">
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>📋 Question Review</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {questionResults?.map((q, i) => (
                <div key={i} style={{ background: 'rgba(17,17,24,0.8)', border: `1px solid ${q.isCorrect ? '#10b98133' : '#ef444433'}`, borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: q.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                      {q.isCorrect ? '✅' : '❌'}
                    </span>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0ff', margin: 0, lineHeight: 1.5 }}>Q{i+1}. {q.question}</p>
                  </div>
                  <div style={{ marginLeft: '40px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Your answer: <span style={{ color: q.isCorrect ? '#10b981' : '#ef4444', fontWeight: 600 }}>{q.userAnswer}</span></div>
                    {!q.isCorrect && <div>Correct: <span style={{ color: '#10b981', fontWeight: 600 }}>{q.correctAnswer}</span></div>}
                    <div style={{ color: '#8888aa', marginTop: '4px', lineHeight: 1.5 }}>💡 {q.explanation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
