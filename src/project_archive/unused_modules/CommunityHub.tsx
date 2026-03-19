/**
 * ARCHIVE NOTICE
 * Original Use: Used for social community features.
 * Moved to: unused_modules
 */



import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AcronymDictionary from './tools/AcronymDictionary';

export default function CommunityHub({ onNavigateBack }: { onNavigateBack: () => void }) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showDictionary, setShowDictionary] = useState(false);
    const [userScore, setUserScore] = useState(() => {
        return parseInt(localStorage.getItem('kaizen_user_score') || '1250', 10);
    });

    useEffect(() => {
        const handleScoreUpdate = () => {
            setUserScore(parseInt(localStorage.getItem('kaizen_user_score') || '1250', 10));
        };
        window.addEventListener('kaizen_score_updated', handleScoreUpdate);
        return () => window.removeEventListener('kaizen_score_updated', handleScoreUpdate);

    }, []);

    const quotes = t('quotes', { returnObjects: true }) as Array<{text: string, savings: string, impact: string}>;
    const filteredQuotes = Array.isArray(quotes) ? quotes.filter(q =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.impact.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    if (showDictionary) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem max(1.5rem, 3vw) 0' }}>
                    <button className="btn btn-secondary" onClick={() => setShowDictionary(false)} style={{ alignSelf: 'flex-start' }}>
                        ← Back to Community Flow
                    </button>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <AcronymDictionary />
                </div>
            </div>
        );
    }

    return (
        <div className="community-container" style={{ maxWidth: '100%', margin: '0 auto', padding: 'max(1.5rem, 3vw)', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header className="community-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '250px' }}>
                    <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 950, letterSpacing: '-1.5px' }}>
                        Community Hub
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Connect, share, and optimize your daily life.
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={onNavigateBack} style={{ whiteSpace: 'nowrap' }}>
                    ← Back to Portal
                </button>
            </header>

            <div className="community-grid" style={{ gap: '2rem', flex: 1, overflow: 'hidden' }}>
                {/* Main Feed: Lean Hacks */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <div style={{ position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 10, paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: 'clamp(1.5rem, 3vw, 2rem)', // Made larger
                                fontWeight: 900,
                                color: 'var(--text-main)', // Ensured solid color
                                letterSpacing: '-0.5px'
                            }}>
                                💡 Lean Life Hacks
                            </h2>
                            <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.65rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {filteredQuotes.length} active
                            </span>
                        </div>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Search hacks (e.g. 'kitchen', 'morning', 'digital')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredQuotes.map((quote, idx) => (
                            <div key={idx} className="hack-card">
                                <div className="hack-header">
                                    <span className="hack-category">Everyday Lean</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted by LeanBot</span>
                                </div>
                                <p className="hack-text">"{quote.text}"</p>
                                <div className="hack-impact-row">
                                    <div className="impact-tag" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
                                        <span style={{ color: '#34d399', fontWeight: 'bold' }}>Saves:</span> {quote.savings}
                                    </div>
                                    <div className="impact-tag" style={{ border: '1px solid rgba(14, 165, 233, 0.3)', background: 'rgba(14, 165, 233, 0.05)' }}>
                                        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Impact:</span> {quote.impact}
                                    </div>
                                </div>
                                <div className="hack-actions">
                                    <button className="action-btn">👍 Helpful</button>
                                    <button className="action-btn">🔖 Save</button>
                                    <button className="action-btn">💬 Discuss</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sidebar: Community & News */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
                    <div className="card" style={{ padding: '1.5rem', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📖</span> Lean Glossary</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Decode plant terminology or drop your own knowledge for the community.</p>
                        <button className="btn btn-primary" onClick={() => setShowDictionary(true)} style={{ width: '100%', padding: '0.6rem', fontWeight: 'bold' }}>
                            Open Acronym Dictionary
                        </button>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>📢 Latest from Gemba</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="news-item">
                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>PRODUCT UPDATE</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Spatial Hub Deep Linking is Live!</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Link your 3D scans directly to project phases now.</div>
                            </div>
                            <div className="news-item">
                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>COMMUNITY WIN</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>User "LeanMasterX" saved 40 hours/year</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Using the new Fridge Organization standard.</div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, transparent 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🏅 Your Badges</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{userScore} XP</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
                            {[
                                { threshold: 0, title: 'Novice Observer', icon: '🌱' },
                                { threshold: 1260, title: 'Waste Spotter', icon: '🔍' },
                                { threshold: 1300, title: 'Lean Practitioner', icon: '🛠️' },
                                { threshold: 1500, title: 'Gemba Guide', icon: '🧭' },
                                { threshold: 2000, title: 'Kaizen Master', icon: '👑' }
                            ].map((badge, idx) => {
                                const earned = userScore >= badge.threshold;
                                return (
                                    <div key={idx} title={badge.title + (earned ? " (Earned)" : ` (Unlocks at ${badge.threshold} XP)`)} style={{
                                        width: '40px', height: '40px', borderRadius: '50%', background: earned ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                        opacity: earned ? 1 : 0.4, border: earned ? '2px solid white' : '1px dashed rgba(255,255,255,0.2)',
                                        boxShadow: earned ? '0 4px 10px rgba(14, 165, 233, 0.4)' : 'none', cursor: 'help'
                                    }}>
                                        {badge.icon}
                                    </div>
                                );
                            })}
                        </div>

                        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>🏆 Top Optimizers (Beta)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { name: 'Beta Tester 1', points: 2450, rank: '🥇' },
                                { name: 'Beta Tester 2', points: 1920, rank: '🥈' },
                                { name: 'Beta Tester 3', points: 1810, rank: '🥉' },
                                { name: 'You', points: userScore, rank: '👤' }
                            ].sort((a, b) => b.points - a.points).map((user, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', padding: '0.5rem', background: user.name === 'You' ? 'rgba(56, 189, 248, 0.1)' : 'transparent', borderRadius: '0.5rem', border: user.name === 'You' ? '1px solid var(--accent-primary)' : 'none' }}>
                                    <span>{user.name === 'You' && i > 2 ? '👤' : ['🥇', '🥈', '🥉'][i] || '🏅'}</span>
                                    <span style={{ flex: 1, fontWeight: 'bold', color: user.name === 'You' ? 'var(--accent-primary)' : 'inherit' }}>{user.name}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user.points.toLocaleString()} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', border: '1px solid #f97316', background: 'rgba(249, 115, 22, 0.05)' }}>
                        <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: '#f97316' }}>⚡ Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button className="btn btn-primary" style={{ background: '#f97316', border: 'none', width: '100%', fontSize: '0.8rem' }} onClick={() => window.open('https://form.jotform.com/233406028319149', '_blank')}>🚀 Submit a JFI</button>
                            <button className="btn" style={{ borderColor: '#f97316', color: '#f97316', width: '100%', fontSize: '0.8rem' }} onClick={() => window.open('https://padlet.com/leanballers/just-fix-it-npfyeasab7v06qb8', '_blank')}>📌 Gemba Videos</button>
                            <button className="btn" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', width: '100%', fontSize: '0.8rem' }} onClick={() => window.open('https://app.gembadocs.com/', '_blank')}>📑 GembaDocs</button>
                        </div>
                    </div>
                </aside>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hack-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border-light);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    transition: transform 0.2s;
                }
                .hack-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .hack-category {
                    font-size: 0.7rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: var(--accent-primary);
                    letter-spacing: 1px;
                }
                .hack-text {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin: 0 0 1rem 0;
                    line-height: 1.4;
                    letter-spacing: -0.2px;
                }
                .hack-impact-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                    flex-wrap: wrap;
                }
                .impact-tag {
                    background: rgba(255,255,255,0.05);
                    padding: 0.4rem 0.8rem;
                    border-radius: 0.5rem;
                    font-size: 0.8rem;
                    color: var(--text-main);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .hack-actions {
                    display: flex;
                    gap: 1rem;
                    border-top: 1px solid var(--border-light);
                    padding-top: 1rem;
                }
                .action-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                }
                .action-btn:hover {
                    color: var(--text-main);
                    background: rgba(255,255,255,0.05);
                }
                .news-item {
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-light);
                }
                .news-item:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                .community-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 350px; /* Better space usage */
                    gap: 3rem; /* Increased gap */
                }
                @media (max-width: 900px) {
                    .community-grid {
                        grid-template-columns: 1fr;
                        overflow-y: auto;
                    }
                    .community-container {
                        overflow-y: auto !important;
                    }
                    aside {
                        overflow-y: visible !important;
                    }
                }
                @media (max-width: 600px) {
                    .community-header {
                        flex-direction: column;
                        align-items: stretch !important;
                    }
                    .btn-secondary {
                        width: 100%;
                        text-align: center;
                    }
                }
            `}} />
        </div>
    );
}
