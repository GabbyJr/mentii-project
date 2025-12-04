import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      emoji: '👥',
      title: 'Connect',
      description: 'Join thousands of students and teachers',
    },
    {
      emoji: '💬',
      title: 'Learn Together',
      description: 'Share knowledge and grow together',
    },
    {
      emoji: '🏆',
      title: 'Earn Badges',
      description: 'Get recognized for your contributions',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1D3557 0%, #7F5AF0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Logo & Title */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            width: '96px',
            height: '96px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            margin: '0 auto 24px',
            fontSize: '48px',
          }}
        >
          📚
        </div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 8px 0',
          }}
        >
          Mentii
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
          }}
        >
          Social Learning. Real Connections.
        </p>
      </div>

      {/* Features */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          marginBottom: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '24px', marginTop: '4px' }}>
              {feature.emoji}
            </div>
            <div>
              <h3
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  margin: '0 0 4px 0',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <button
          onClick={() => navigate('/signup')}
          style={{
            width: '100%',
            background: '#4DD5C8',
            color: '#1D3557',
            fontWeight: 'bold',
            padding: '16px 24px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 'bold',
            padding: '16px 24px',
            borderRadius: '9999px',
            border: '2px solid white',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
        >
          Already have an account?
        </button>
      </div>

      {/* Footer */}
      <p
        style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '12px',
          marginTop: '32px',
          textAlign: 'center',
        }}
      >
        Join the revolution in social learning
      </p>
    </div>
  );
}