import type { KaizenProject } from '../types';
import ProgressRing from './charts/ProgressRing';
import KPITrends from './charts/KPITrends';
import type { UserProfile } from '../services/userService';
import gembaosLogo from '../assets/branding/gembaos-logo.png';

interface DashboardProps {
    project: KaizenProject | null;
    profile: UserProfile | null;
    onStartNew: () => void;
    onContinue: () => void;
}

export default function Dashboard({ project, profile, onStartNew, onContinue }: DashboardProps) {
    // Determine stats
    const xp = profile ? profile.xp : parseInt(localStorage.getItem('kaizen_user_score') || '0', 10);
    const streak = profile ? profile.streak_count : parseInt(localStorage.getItem('gembaos_guest_streak') || '0', 10);
    const badgesCount = profile?.badges ? profile.badges.length : 0;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={gembaosLogo} alt="Gemba Logo" style={{ width: '100%', maxWidth: '400px', objectFit: 'contain', marginBottom: '1rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500 }}>
                    Your autonomous assistant for running highly effective Lean events.
                </p>
            </header>

            {/* Real User Stats Section */}
            <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-around', padding: '2rem', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, transparent 100%)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{streak} Day</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Streak</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{xp.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gemba Points</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏅</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{badgesCount}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Badges Earned</div>
                </div>
            </div>

            <div className="grid grid-cols-2">
                <div className="card interactive-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }} onClick={onStartNew}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                    <h3>Start New Project</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                        Initialize a new Kaizen charter, define KPIs, and let the agent generate your roadmap automatically.
                    </p>
                    <button className="btn btn-primary" onClick={onStartNew} style={{ width: '100%', padding: '0.75rem' }}>
                        Create Charter
                    </button>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <h3>Active Project</h3>
                    {project ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', textAlign: 'left', width: '100%' }}>
                                <ProgressRing
                                    radius={40}
                                    stroke={6}
                                    progress={Math.round((project.phases.filter(p => p.status === 'completed').length / project.phases.length) * 100)}
                                    color="var(--accent-primary)"
                                />
                                <div>
                                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.25rem', fontSize: '1.2rem' }}>{project.name}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{project.duration} • {project.intensity}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                                        {project.phases.filter(p => p.status === 'completed').length} of {project.phases.length} phases completed
                                    </p>
                                </div>
                            </div>
                            <button className="btn" onClick={onContinue} style={{ width: '100%', padding: '0.75rem' }}>
                                Resume Execution
                            </button>

                            {project.kpis && project.kpis.length > 0 && (
                                <div style={{ marginTop: '1.5rem', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'left' }}>
                                    <h5 style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                        {project.kpis[0].name} Tracker
                                    </h5>
                                    <div style={{ background: 'var(--bg-dark)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                                        <KPITrends
                                            data={
                                                project.phases.filter(p => p.status === 'completed').map((p, i) => {
                                                    const base = parseFloat(project.kpis![0].baseline) || 0;
                                                    const targ = parseFloat(project.kpis![0].target) || 100;
                                                    const progressRatio = (i + 1) / project.phases.length;
                                                    const simulatedValue = base + ((targ - base) * progressRatio * (0.8 + Math.random() * 0.4));
                                                    return { day: p.day, value: Math.round(simulatedValue) };
                                                })
                                            }
                                            baseline={parseFloat(project.kpis[0].baseline) || 0}
                                            target={parseFloat(project.kpis[0].target) || 100}
                                            width={340}
                                            height={160}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                No active project found in local storage. Start a new one to begin.
                            </p>
                            <button className="btn" disabled style={{ width: '100%', padding: '0.75rem', opacity: 0.5 }}>
                                Resume Execution
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* End Dashboard Sections */}
        </div>
    );
}
