import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

interface AuthOverlayProps {
    onClose: () => void;
}

export default function AuthOverlay({ onClose }: AuthOverlayProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sidebar-overlay visible" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
            <div className="card" style={{ maxWidth: '400px', width: '90%', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}
                >
                    &times;
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontFamily: '"Orbitron", sans-serif', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        {isSignUp ? t('auth.signUpTitle', 'CREATE PORTAL ACCESS') : t('auth.loginTitle', 'OPERATOR LOGIN')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isSignUp ? t('auth.signUpDesc', 'Join the GembaOS network.') : t('auth.loginDesc', 'Authenticate to sync measurement data.')}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={() => setIsSignUp(false)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', background: !isSignUp ? 'rgba(96, 165, 250, 0.15)' : 'transparent', color: !isSignUp ? '#60a5fa' : '#94a3b8', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                    >
                        {t('auth.login', 'LOGIN')}
                    </button>
                    <button
                        onClick={() => setIsSignUp(true)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', background: isSignUp ? 'rgba(96, 165, 250, 0.15)' : 'transparent', color: isSignUp ? '#60a5fa' : '#94a3b8', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                    >
                        {t('auth.signUp', 'SIGN UP')}
                    </button>
                </div>

                <form onSubmit={handleAuth} className="grid" style={{ gap: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                        {loading ? 'PROCESSING...' : (isSignUp ? 'CREATE ACCOUNT ➔' : 'AUTHENTICATE ➔')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </span>
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem' }}
                    >
                        {isSignUp ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
