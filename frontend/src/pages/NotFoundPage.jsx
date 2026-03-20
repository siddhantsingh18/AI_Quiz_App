import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="grid-bg" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '24px'
    }}>
      {/* Glowing 404 */}
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <div style={{
          fontSize: '140px', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, #2a2a3a, #1a1a24)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          userSelect: 'none', fontFamily: 'Syne'
        }}>404</div>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: '140px', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, #7c3aed40, #06b6d420)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'blur(16px)', userSelect: 'none', fontFamily: 'Syne'
        }}>404</div>
      </div>

      <div className="float" style={{ fontSize: '56px', marginBottom: '20px' }}>🧠</div>

      <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0' }}>
        <span className="shimmer-text">Page Not Found</span>
      </h1>
      <p style={{ color: '#8888aa', maxWidth: '380px', lineHeight: 1.7, marginBottom: '32px' }}>
        Looks like this page went missing — kind of like the answer you weren't sure about on the last quiz.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate('/')} style={{
          padding: '14px 28px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'Syne',
          fontWeight: 700, fontSize: '15px', cursor: 'pointer'
        }}>
          🏠 Go Home
        </button>
        <button onClick={() => navigate('/setup')} style={{
          padding: '14px 28px', background: 'transparent',
          border: '1px solid #2a2a3a', borderRadius: '12px', color: '#f0f0ff',
          fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', cursor: 'pointer'
        }}>
          🎯 Start a Quiz
        </button>
      </div>
    </div>
  );
}
