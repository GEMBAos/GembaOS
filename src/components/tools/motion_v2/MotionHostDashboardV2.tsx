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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <h3 
                        onClick={() => setTab('active')}
                        style={{ margin: 0, cursor: 'pointer', color: tab === 'active' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: tab === 'active' ? '2px solid var(--accent-primary)' : 'none', paddingBottom: '0.25rem' }}
                    >
                        Active ({activeSessions.length})
                    </h3>
                    <h3 
                        onClick={() => setTab('closed')}
                        style={{ margin: 0, cursor: 'pointer', color: tab === 'closed' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: tab === 'closed' ? '2px solid var(--accent-primary)' : 'none', paddingBottom: '0.25rem' }}
                    >
                        Closed ({closedSessions.length})
                    </h3>
                </div>
                <button 
                    onClick={onCreateNew}
                    className="btn btn-primary"
                >
                    + New Session
                </button>
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
                <div className="grid grid-cols-2">
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
