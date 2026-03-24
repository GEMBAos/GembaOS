import { useEffect, useState } from 'react';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2 } from '../../../types/motion_v2';

interface Props {
    onCreateNew: () => void;
    onOpenSession: (sessionId: string) => void;
}

export default function MotionHostDashboardV2({ onCreateNew, onOpenSession }: Props) {
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'active' | 'closed'>('active');

    useEffect(() => {
        ImprovementEngine.syncFromCloud().finally(() => {
            setLoading(false);
        });
    }, []);

    const allSessions = ImprovementEngine.getItemsByType<MotionSessionV2>('MotionSessionV2');
    const activeSessions = allSessions.filter(s => s.status !== 'CLOSED')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const closedSessions = allSessions.filter(s => s.status === 'CLOSED')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const displaySessions = tab === 'active' ? activeSessions : closedSessions;

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Delete this mapping session permanently?')) {
            ImprovementEngine.deleteItem(id);
            // Quick force refresh
            setLoading(true);
            setTimeout(() => setLoading(false), 10);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            {/* Hero Action Buttons */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <div 
                    onClick={onCreateNew}
                    style={{ 
                        flex: '1 1 300px', 
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', 
                        border: '2px solid var(--zone-yellow)', 
                        borderRadius: '12px', 
                        padding: '2rem', 
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {/* Abstract Spaghetti Diagram Background */}
                    <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
                        <path d="M10,90 Q30,10 50,50 T90,10" fill="none" stroke="var(--zone-yellow)" strokeWidth="3" />
                        <path d="M10,10 Q50,90 90,90" fill="none" stroke="#ff4444" strokeWidth="2" strokeDasharray="5,5" />
                        <path d="M30,50 Q70,50 50,90" fill="none" stroke="#44aa44" strokeWidth="4" />
                    </svg>
                    <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 2px 4px rgba(255,194,14,0.5))' }}>🗺️</div>
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--text-main)', letterSpacing: '1px' }}>HOST NEW SESSION</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>Create a new floor plan and invite observers.</p>
                </div>

                <div 
                    onClick={() => {
                        const sid = window.prompt("Enter Session ID to Join:");
                        if (sid) onOpenSession(sid);
                    }}
                    style={{ 
                        flex: '1 1 300px', 
                        background: 'var(--bg-panel)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '12px', 
                        padding: '2rem', 
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'var(--text-main)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                >
                    {/* Abstract QR Code Background */}
                    <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05, fontSize: '10rem', lineHeight: 1, pointerEvents: 'none', fontFamily: 'monospace' }}>
                        QR
                    </div>
                    <div style={{ fontSize: '3rem', filter: 'grayscale(100%) brightness(200%)' }}>📱</div>
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--text-main)', letterSpacing: '1px' }}>JOIN SESSION</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>Enter a code to join an active observation.</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <h3 
                        onClick={() => setTab('active')}
                        style={{ margin: 0, cursor: 'pointer', color: tab === 'active' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: tab === 'active' ? '2px solid var(--accent-primary)' : 'none', paddingBottom: '0.5rem', marginBottom: '-0.6rem', fontSize: '1.1rem' }}
                    >
                        Active Sessions ({activeSessions.length})
                    </h3>
                    <h3 
                        onClick={() => setTab('closed')}
                        style={{ margin: 0, cursor: 'pointer', color: tab === 'closed' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: tab === 'closed' ? '2px solid var(--accent-primary)' : 'none', paddingBottom: '0.5rem', marginBottom: '-0.6rem', fontSize: '1.1rem' }}
                    >
                        Closed Archives ({closedSessions.length})
                    </h3>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                    Loading sessions...
                </div>
            ) : displaySessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Sessions Yet</h4>
                    <p style={{ color: 'var(--text-muted)' }}>{tab === 'active' ? 'Create a layout-calibrated session to begin mapping.' : 'No closed sessions available.'}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {displaySessions.map(s => (
                        <div 
                            key={s.id} 
                            onClick={() => onOpenSession(s.id)}
                            className="card"
                            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', opacity: s.status === 'CLOSED' ? 0.7 : 1 }}
                        >
                            <button 
                                onClick={(e) => handleDelete(e, s.id)}
                                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,0,0,0.1)', color: 'var(--accent-danger)', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer', zIndex: 10 }}
                                title="Delete Session"
                            >
                                🗑️
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' }}>
                                <strong style={{ color: 'var(--accent-primary)' }}>{s.sessionName}</strong>
                                <span className="pill">{s.status}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {new Date(s.createdAt).toLocaleDateString()}
                            </div>
                            {s.layoutImageUrl ? (
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', marginTop: '0.5rem' }}>✓ Layout Attached</div>
                            ) : (
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', marginTop: '0.5rem' }}>⚠ Needs Layout</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
