import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions = [], topic = '', difficulty = 'medium' } = location.state || {};

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const timerRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!questions.length) { navigate('/setup'); return; }
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  if (!questions.length) return null;

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const isAnswered = selected !== null;
  const isLast = current === questions.length - 1;

  const handleSelect = (opt) => {
    if (isAnswered) return;
    setSelected(opt);
    setShowExplanation(true);
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    setShowExplanation(false);

    if (isLast) {
      setSubmitting(true);
      clearInterval(timerRef.current);
      try {
        const { data } = await axios.post('/api/quiz/submit', {
          topic, questions, userAnswers: newAnswers, timeTaken: elapsed
        });
        navigate('/result', { state: { ...data, topic, timeTaken: elapsed } });
      } catch (err) {
        alert('Failed to submit: ' + (err.response?.data?.message || err.message));
        setSubmitting(false);
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const optionColors = {
    default: { bg: 'rgba(17,17,24,0.8)', border: '#2a2a3a', color: '#f0f0ff' },
    selected_correct: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', color: '#10b981' },
    selected_wrong: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', color: '#ef4444' },
    correct_hint: { bg: 'rgba(16,185,129,0.08)', border: '#10b98166', color: '#10b981' },
  };

  const getOptStyle = (opt) => {
    if (!isAnswered) return optionColors.default;
    if (opt === q.correctAnswer) return optionColors.correct_hint;
    if (opt === selected && opt !== q.correctAnswer) return optionColors.selected_wrong;
    if (opt === selected && opt === q.correctAnswer) return optionColors.selected_correct;
    return optionColors.default;
  };

  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <div className="grid-bg" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#8888aa', marginBottom: '4px' }} className="mono">
                {topic} • {difficulty}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#f0f0ff' }}>
                Question {current + 1} <span style={{ color: '#8888aa', fontWeight: 400 }}>/ {questions.length}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(17,17,24,0.8)', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '10px 16px' }}>
              <span style={{ fontSize: '16px' }}>⏱️</span>
              <span className="mono" style={{ fontSize: '18px', fontWeight: 700, color: '#7c3aed' }}>{formatTime(elapsed)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '6px', background: '#1a1a24', borderRadius: '3px', marginBottom: '32px', overflow: 'hidden' }}>
            <div className="progress-bar" style={{ height: '100%', borderRadius: '3px', width: `${progress}%` }} />
          </div>

          {/* Question Card */}
          <div className="fade-up" key={current} style={{ background: 'rgba(17,17,24,0.9)', border: '1px solid #2a2a3a', borderRadius: '20px', padding: '32px', marginBottom: '16px', backdropFilter: 'blur(20px)' }}>
            <p style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: '#f0f0ff', margin: '0 0 28px 0' }}>
              {q.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {q.options.map((opt, i) => {
                const style = getOptStyle(opt);
                const letter = ['A', 'B', 'C', 'D'][i];
                return (
                  <button key={opt} onClick={() => handleSelect(opt)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: style.bg, border: `1px solid ${style.border}`, borderRadius: '12px', cursor: isAnswered ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Syne', width: '100%' }}
                    onMouseOver={e => { if (!isAnswered) { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; } }}
                    onMouseOut={e => { if (!isAnswered) { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.background = 'rgba(17,17,24,0.8)'; } }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isAnswered ? (opt === q.correctAnswer ? 'rgba(16,185,129,0.2)' : opt === selected ? 'rgba(239,68,68,0.2)' : '#1a1a24') : '#1a1a24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: style.color, flexShrink: 0 }}>
                      {isAnswered && opt === q.correctAnswer ? '✓' : isAnswered && opt === selected && opt !== q.correctAnswer ? '✗' : letter}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: style.color }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="fade-up" style={{ background: selected === q.correctAnswer ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selected === q.correctAnswer ? '#10b98144' : '#ef444444'}`, borderRadius: '14px', padding: '18px 20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: selected === q.correctAnswer ? '#10b981' : '#ef4444', marginBottom: '6px' }}>
                {selected === q.correctAnswer ? '✅ Correct!' : '❌ Wrong!'}
              </div>
              <div style={{ fontSize: '14px', color: '#c0c0d8', lineHeight: 1.6 }}>{q.explanation}</div>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button onClick={handleNext} disabled={submitting}
              className="glow-pulse"
              style={{ width: '100%', padding: '16px', background: submitting ? '#2a2a3a' : 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '8px' }}>
              {submitting ? '⏳ Calculating Results...' : isLast ? '🏁 Finish Quiz' : `Next Question →`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
