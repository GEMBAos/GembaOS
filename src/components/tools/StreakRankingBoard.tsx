import { useState, useEffect } from 'react';
import { userService, type UserProfile } from '../../services/userService';
import { supabase } from '../../lib/supabase';

interface StreakRankingBoardProps {
    onClose: () => void;
}

export default function StreakRankingBoard({ onClose }: StreakRankingBoardProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const p = await userService.getProfile(session.user.id);
                setProfile(p);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const userStreak = profile?.streak_count || 0;
    const userBestStreak = Math.max(
        profile?.best_streak_count || 0,
        parseInt(localStorage.getItem('kaizen_best_streak') || '0'),
        userStreak
    );

    // Simulated top ranks for engagement
    const leaderboards = [
        { rank: 1, name: 'LeanMasterX', streak: 42, isCurrentUser: false },
        { rank: 2, name: 'GembaNinja', streak: 38, isCurrentUser: false },
        { rank: 3, name: 'SixSigmaSam', streak: 21, isCurrentUser: false },
        { rank: 12, name: profile?.username || 'You', streak: userStreak, isCurrentUser: true }
    ].sort((a, b) => b.streak - a.streak);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
        }}>
            <div className="animate-slide-up card" style={{
                position: 'relative',
                background: 'var(--bg-panel)',
                width: '100%',
                maxWidth: '500px',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,1), 0 0 40px rgba(249, 115, 22, 0.1)',
                padding: '0'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    ✕
                </button>

                <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--border-light)' }}>
                    <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.8rem' }}>🔥 Streak Board</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Daily Kaizen consistency is key.</p>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <div style={{ padding: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Current Streak</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-primary)', lineHeight: 1 }}>{userStreak}</div>
                                <div style={{ fontSize: '0.75rem', color: '#f8fafc', marginTop: '0.5rem' }}>Days in a row</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Personal Best</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', lineHeight: 1 }}>{userBestStreak}</div>
                                <div style={{ fontSize: '0.75rem', color: '#f8fafc', marginTop: '0.5rem' }}>All-time record</div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>🏆 Top Leaders</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {leaderboards.map((user, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem 1rem',
                                    background: user.isCurrentUser ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.03)',
                                    borderRadius: '0.5rem',
                                    border: user.isCurrentUser ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent'
                                }}>
                                    <div style={{ width: '2rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${user.rank}`}
                                    </div>
                                    <div style={{ flex: 1, fontWeight: user.isCurrentUser ? 'bold' : 'normal', color: user.isCurrentUser ? 'white' : 'var(--text-main)' }}>
                                        {user.name}
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                        {user.streak} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>days</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
