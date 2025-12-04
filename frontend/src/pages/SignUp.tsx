import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SignUpProps {
  setIsLoggedIn: (value: boolean) => void;
  setUser: (value: any) => void;
}

export default function SignUp({ setIsLoggedIn, setUser }: SignUpProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    user_type: 'student',
    level: 'form_1',
    subjects: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];
  const levels = [
    { value: 'form_1', label: 'Form 1' },
    { value: 'form_2', label: 'Form 2' },
    { value: 'form_3', label: 'Form 3' },
    { value: 'form_4', label: 'Form 4' },
    { value: 'form_5', label: 'Form 5' },
    { value: 'form_6', label: 'Form 6' },
    { value: 'university', label: 'University' },
  ];

  const userTypes = [
    { value: 'student', label: 'Student', description: 'Learn from others' },
    { value: 'teacher', label: 'Teacher', description: 'Share your knowledge' },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.full_name) {
        setError('Please fill all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    setError('');
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    if (step > 1) setStep(step - 1);
  };

  const toggleSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subject)
        ? formData.subjects.filter((s) => s !== subject)
        : [...formData.subjects, subject],
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/signup', {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsLoggedIn(true);
      setUser(response.data.user);
      navigate('/feed');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.detail || 'Sign up failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1D3557 0%, #7F5AF0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      paddingTop: '48px',
      paddingBottom: '48px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
        padding: '32px',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', gap: '8px' }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                height: '8px',
                flex: 1,
                borderRadius: '9999px',
                background: s <= step ? '#4DD5C8' : '#F5F5F5',
                transition: 'all 0.3s ease',
              }}
            ></div>
          ))}
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            borderLeft: '4px solid #EF4444',
            color: '#991B1B',
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          {/* Step 1 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D3557', marginBottom: '8px' }}>
                  Create Your Account
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Step 1 of 4</p>
              </div>

              <div>
                <label style={{ display: 'block', color: '#1D3557', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#F5F5F5',
                    border: '2px solid #F5F5F5',
                    borderRadius: '16px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#1D3557', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#F5F5F5',
                    border: '2px solid #F5F5F5',
                    borderRadius: '16px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#1D3557', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#F5F5F5',
                    border: '2px solid #F5F5F5',
                    borderRadius: '16px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#1D3557', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#F5F5F5',
                    border: '2px solid #F5F5F5',
                    borderRadius: '16px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D3557', marginBottom: '8px' }}>
                  I am a...
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Step 2 of 4</p>
              </div>

              {userTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, user_type: type.value })}
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    border: formData.user_type === type.value ? '2px solid #4DD5C8' : '2px solid #F5F5F5',
                    background: formData.user_type === type.value ? '#F5F5F5' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                >
                  <h3 style={{ color: '#1D3557', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    {type.label}
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D3557', marginBottom: '8px' }}>
                  Your {formData.user_type === 'student' ? 'Level' : 'Teaching Level'}
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Step 3 of 4</p>
              </div>

              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#F5F5F5',
                  border: '2px solid #F5F5F5',
                  borderRadius: '16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D3557', marginBottom: '8px' }}>
                  Your Subjects
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Step 4 of 4 - Select at least one</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    style={{
                      padding: '12px',
                      borderRadius: '16px',
                      border: formData.subjects.includes(subject) ? '2px solid #4DD5C8' : '2px solid #F5F5F5',
                      background: formData.subjects.includes(subject) ? '#4DD5C8' : 'white',
                      color: formData.subjects.includes(subject) ? '#1D3557' : '#666',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '14px',
                    }}
                  >
                    {formData.subjects.includes(subject) ? '✓ ' : ''}{subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  flex: 1,
                  background: '#F5F5F5',
                  color: '#1D3557',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #1D3557 0%, #7F5AF0 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || formData.subjects.length === 0}
                style={{
                  flex: 1,
                  background: '#4DD5C8',
                  color: '#1D3557',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: loading || formData.subjects.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: loading || formData.subjects.length === 0 ? 0.5 : 1,
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <p style={{ textAlign: 'center', color: '#666', marginTop: '24px', fontSize: '14px' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#4DD5C8',
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}