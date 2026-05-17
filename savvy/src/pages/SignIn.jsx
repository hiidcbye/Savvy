import { useState } from 'react';
import { api } from '../services/api';

export default function SignIn({ onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const data = isSignUp
                ? await api.signup(email, password, name)
                : await api.signin(email, password);
            if (data.user_id || data.access_token) {
                onLogin(data.user_id);
            } else {
                setError('Invalid credentials');
            }
        } catch { setError('Something went wrong'); }
        setLoading(false);
    };

    const inp = {
        width: '100%', marginBottom: 12, padding: '13px 16px',
        borderRadius: 10, backgroundColor: '#1A1A26',
        border: '1px solid #2A2A3A', color: '#fff',
        fontSize: 14, outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#0E0E18', borderRadius: 16, padding: '40px 36px', width: 420, border: '1px solid #2A2A3A' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 28 }}>📊</span>
                    <span style={{ fontSize: 28, fontWeight: '600', color: '#6C63FF' }}>Savvy</span>
                </div>
                <p style={{ textAlign: 'center', color: '#444', fontSize: 13, marginBottom: 32 }}>Smart financial guidance for students</p>

                <form onSubmit={handleSubmit}>
                    {isSignUp && <input style={inp} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />}
                    <input style={inp} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input style={inp} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    {error && <p style={{ color: '#FF6B6B', fontSize: 12, textAlign: 'center', marginBottom: 10 }}>{error}</p>}
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '13px', borderRadius: 10,
                        backgroundColor: '#6C63FF', color: '#fff', fontSize: 14,
                        fontWeight: '600', border: 'none', cursor: 'pointer',
                        opacity: loading ? 0.7 : 1, marginBottom: 12,
                    }}>
                        {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
                    </button>
                </form>

                <button onClick={() => setIsSignUp(!isSignUp)} style={{
                    width: '100%', textAlign: 'center', color: '#444',
                    fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
                }}>
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
            </div>
        </div>
    );
}