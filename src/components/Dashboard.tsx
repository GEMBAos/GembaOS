import { useEffect, useState } from 'react';
import type { KaizenProject, ActionItem, KamishibaiCard } from '../types';
import type { UserProfile } from '../services/userService';
import { storageService } from '../services/storageService';
import DynamicBadge from './ui/DynamicBadge';
import ProgressRing from './charts/ProgressRing';

interface DashboardProps {
    profile: UserProfile | null;
    onNavigate?: (view: string) => void;
}

export default function Dashboard({ profile, onNavigate }: DashboardProps) {
    const [actions, setActions] = useState<ActionItem[]>([]);
    const [projects, setProjects] = useState<KaizenProject[]>([]);
    const [audits, setAudits] = useState<KamishibaiCard[]>([]);

    useEffect(() => {
        // Load live data
        setActions(storageService.getActionItems());
        setProjects(storageService.getProjects());
        setAudits(storageService.getKamishibaiCards());

        const handleUpdate = () => {
            setActions(storageService.getActionItems());
            setProjects(storageService.getProjects());
            setAudits(storageService.getKamishibaiCards());
        };
        window.addEventListener('kaizen_data_updated', handleUpdate);
        return () => window.removeEventListener('kaizen_data_updated', handleUpdate);
    }, []);

    // Stats
    const xp = profile ? profile.xp : parseInt(localStorage.getItem('gembaos_guest_tokens') || localStorage.getItem('kaizen_user_score') || '0', 10);
    const streak = profile ? profile.streak_count : parseInt(localStorage.getItem('gembaos_guest_streak') || '0', 10);
    const roleTitle = profile ? (profile.role === 'admin' ? 'SYSTEM ADMIN' : 'OPERATOR') : 'LOCAL GUEST';

    const pendingActions = actions.filter(a => a.status !== 'Done');
    const activeProjects = projects.filter(p => p.status !== 'Closed');
    
    // Check if audits are due today
    const auditsDue = audits.filter(a => {
        if (!a.lastAudited) return true;
        const lastAuditDate = new Date(a.lastAudited).toDateString();
        const today = new Date().toDateString();
        return lastAuditDate !== today; // simplified logic: due if not audited today
    });

    return (
        <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header / Identity Strip */}
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <DynamicBadge xp={xp} avatarUrl={profile?.avatar_url || undefined} username={profile?.username || 'Guest'} size={80} />
                    <div>
                        <h2 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', letterSpacing: '2px', fontSize: '1.8rem', textTransform: 'uppercase' }}>
                            {profile?.username || 'Guest Operator'}
                        </h2>
                        <div style={{ color: 'var(--zone-yellow)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px' }}>{roleTitle}</div>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--steel-gray)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span>TOTAL GEMBA XP</span>
                        <span style={{ color: 'var(--lean-white)' }}>{xp.toLocaleString()} pts</span>
                    </div>
                    <div style={{ height: '8px', background: '#111', borderRadius: '4px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, (xp % 1000) / 10)}%`, background: 'var(--zone-yellow)', boxShadow: '0 0 10px rgba(255,194,14,0.5)', transition: 'width 1s ease-out' }}></div>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem', color: '#666' }}>Next Level: {1000 - (xp % 1000)} pts needed</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid #222' }}>
                    <div style={{ fontSize: '2rem', lineHeight: 1 }}>🔥</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{streak}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--steel-gray)', textTransform: 'uppercase', letterSpacing: '1px' }}>Day Streak</div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
                
                {/* Pending Actions */}
                <div style={{ background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid #222', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #222', background: 'linear-gradient(180deg, #1a1a1c 0%, #111 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', letterSpacing: '1px', fontSize: '1.2rem' }}>ACTION ITEMS</h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--steel-gray)' }}>Kaizens assigned to you</p>
                        </div>
                        <span style={{ background: 'rgba(255,194,14,0.1)', color: 'var(--zone-yellow)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{pendingActions.length} Pending</span>
                    </div>
                    
                    <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                        {pendingActions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
                                <p>All items cleared. Great work today.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {pendingActions.map(action => (
                                    <div key={action.id} style={{ padding: '1rem', background: '#1c1c1f', borderRadius: '8px', borderLeft: `3px solid ${action.difficulty === 'Hard' ? '#ef4444' : action.difficulty === 'Medium' ? '#f59e0b' : '#3b82f6'}`, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                         onMouseEnter={e => e.currentTarget.style.background = '#252529'}
                                         onMouseLeave={e => e.currentTarget.style.background = '#1c1c1f'}
                                         onClick={() => onNavigate && onNavigate('action-items')}
                                    >
                                        <div>
                                            <div style={{ color: 'var(--lean-white)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{action.title}</div>
                                            <div style={{ color: '#888', fontSize: '0.8rem' }}>Status: {action.status} • Owner: {action.owner}</div>
                                        </div>
                                        <div style={{ color: '#555' }}>➔</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Projects & Audits */}
                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '2rem' }}>
                    
                    {/* Active Kaizen Projects */}
                    <div style={{ background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid #222', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid #222', background: 'linear-gradient(180deg, #1a1a1c 0%, #111 100%)' }}>
                            <h3 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', letterSpacing: '1px', fontSize: '1.2rem' }}>ACTIVE PROJECTS</h3>
                        </div>
                        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                            {activeProjects.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('kaizen-hub')}>
                                    <p>No active projects.</p>
                                    <button className="btn" style={{ fontSize: '0.8rem' }}>Launch Kaizen</button>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {activeProjects.map(proj => {
                                        const totalPhases = proj.phases?.length || 1;
                                        const compPhases = proj.phases?.filter(p => p.status === 'completed').length || 0;
                                        const progress = Math.round((compPhases / totalPhases) * 100);
                                        return (
                                            <div key={proj.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#1c1c1f', padding: '1rem', borderRadius: '8px', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('kaizen-hub')}>
                                                <ProgressRing radius={28} stroke={4} progress={progress} color="var(--zone-yellow)" />
                                                <div>
                                                    <div style={{ color: 'var(--lean-white)', fontWeight: 'bold', fontSize: '0.95rem' }}>{proj.name}</div>
                                                    <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.2rem' }}>{compPhases} of {totalPhases} phases completed</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kamishibai Audits */}
                    <div style={{ background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid #222', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid #222', background: 'linear-gradient(180deg, #1a1a1c 0%, #111 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', letterSpacing: '1px', fontSize: '1.2rem' }}>DAILY AUDITS</h3>
                            {auditsDue.length > 0 && <span style={{ background: '#ef4444', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>DUE NOW</span>}
                        </div>
                        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                            {auditsDue.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666' }}>
                                    <p>All standards verified today.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {auditsDue.map(audit => (
                                        <div key={audit.id} style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '0.9rem' }}>{audit.title}</div>
                                                <div style={{ color: '#ef4444', fontSize: '0.8rem', opacity: 0.8 }}>Kamishibai Check Required</div>
                                            </div>
                                            <button className="btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: '#ef4444', color: '#fff', border: 'none' }}>Audit</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    );
}
