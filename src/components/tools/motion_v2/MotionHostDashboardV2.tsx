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
                        background: 'var(--gemba-black)', 
                        border: '1px solid var(--zone-yellow)', 
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
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,194,14,0.3)'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.6), inset 0 2px 0 var(--zone-yellow)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,194,14,0.3)';
                    }}
                >
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--zone-yellow)' }}></div>
                    <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🗺️</div>
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', letterSpacing: '1px' }}>HOST NEW SESSION</h2>
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
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'var(--text-muted)';
                        e.currentTarget.style.background = '#1a1a1a';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'var(--bg-panel)';
                    }}
                >
                    <div style={{ fontSize: '3rem', filter: 'grayscale(100%) brightness(200%)' }}>📱</div>
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', letterSpacing: '1px' }}>JOIN SESSION</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>Enter a code to join an active observation.</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <h3 
                        onClick={() => setTab('active')}
                        style={{ margin: 0, cursor: 'pointer', color: tab === 'active' ? 'var(--gemba-black)' : 'var(--text-muted)', borderBottom: tab === 'active' ? '2px solid var(--gemba-black)' : 'none', paddingBottom: '0.5rem', marginBottom: '-0.6rem', fontSize: '1.1rem', fontFamily: 'var(--font-headings)' }}
                    >
                        Active Sessions ({activeSessions.length})
                    </h3>
                    <h3 
                        onClick={() => setTab('closed')}
                        style={{ margin: 0, cursor: 'pointer', color: tab === 'closed' ? 'var(--gemba-black)' : 'var(--text-muted)', borderBottom: tab === 'closed' ? '2px solid var(--gemba-black)' : 'none', paddingBottom: '0.5rem', marginBottom: '-0.6rem', fontSize: '1.1rem', fontFamily: 'var(--font-headings)' }}
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
                            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', opacity: s.status === 'CLOSED' ? 0.7 : 1, background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
                        >
                            <button 
                                onClick={(e) => handleDelete(e, s.id)}
                                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '1rem', cursor: 'pointer', zIndex: 10 }}
                                title="Delete Session"
                                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                ✕
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' }}>
                                <strong style={{ color: 'var(--gemba-black)', fontSize: '1.1rem', fontFamily: 'var(--font-headings)' }}>{s.sessionName}</strong>
                                <span className="pill" style={{ background: s.status === 'CLOSED' ? 'var(--bg-dark)' : 'rgba(255,194,14,0.1)', color: s.status === 'CLOSED' ? 'var(--text-muted)' : 'var(--gemba-black)', border: s.status === 'CLOSED' ? '1px solid var(--border-color)' : '1px solid var(--zone-yellow)' }}>{s.status}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {new Date(s.createdAt).toLocaleDateString()}
                            </div>
                            {s.layoutImageUrl ? (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', padding: '0.2rem 0.5rem', background: 'var(--bg-dark)', display: 'inline-block', borderRadius: '4px', border: '1px solid var(--border-light)' }}>MAPPED LAYOUT ATTACHED</div>
                            ) : (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', padding: '0.2rem 0.5rem', background: 'var(--bg-dark)', display: 'inline-block', borderRadius: '4px', border: '1px solid var(--border-light)' }}>BLANK CANVAS GRID</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
