/**
 * ARCHIVE NOTICE
 * Original Use: Used for generating PDF or visual report outs.
 * Moved to: unused_modules
 */

import type { KaizenProject } from '../types';
import gembaosIcon from '../assets/branding/gembaos-icon.png';

interface ReportOutProps {
    project: KaizenProject;
}

export default function ReportOut({ project }: ReportOutProps) {
    const completedPhases = project.phases.filter(p => p.status === 'completed').length;
    const progressPercent = Math.round((completedPhases / project.phases.length) * 100);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <img src={gembaosIcon} alt="GembaOS Icon" style={{ width: '48px', height: '48px', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                            Kaizen Report Out
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>An auto-generated presentation of your event.</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => window.print()} style={{ width: 'auto' }}>
                    🖨 Print / Export PDF
                </button>
            </header>

            {/* Overview Block */}
            <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{project.name}</h3>
                    <span className="pill">{project.duration?.toUpperCase()} • {project.intensity?.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Problem Statement</h4>
                        <p style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.95rem' }}>
                            {project.problemStatement || 'Not defined.'}
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Target Outcome</h4>
                        <p style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.95rem' }}>
                            {project.targetOutcome || 'Not defined.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* KPIs & Stakeholders */}
            <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table style={{ width: '100%', minWidth: '300px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Baseline</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--accent-success)' }}>Target</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.kpis && project.kpis.map(kpi => (
                                    <tr key={kpi.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>{kpi.name}</td>
                                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{kpi.baseline}</td>
                                        <td className="accent-success-print" style={{ padding: '0.75rem 0.5rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>{kpi.target}</td>
                                    </tr>
                                ))}
                                {(!project.kpis || project.kpis.length === 0) && (
                                    <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No KPIs defined.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Kaizen Team</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(project.stakeholders || []).map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-dark)', borderRadius: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>{s.name}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{s.role}</span>
                            </div>
                        ))}
                        {(!project.stakeholders || project.stakeholders.length === 0) && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No team members added.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Execution Progress */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Execution Log</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div className="accent-success-print" style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--accent-success)', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <span className="accent-success-print" style={{ fontWeight: 'bold', color: 'var(--accent-success)' }}>{progressPercent}% Complete</span>
                </div>

                <div className="grid grid-cols-2">
                    {project.phases.map((phase) => (
                        <div key={phase.id} style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong style={{ fontSize: '0.95rem' }}>{phase.title}</strong>
                                <span className={phase.status === 'completed' ? 'accent-success-print' : ''} style={{ fontSize: '0.75rem', opacity: 0.8, color: phase.status === 'completed' ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                                    {phase.status.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{phase.description}</p>

                            {phase.evidence.length > 0 && (
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>EVIDENCE:</span>
                                    <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                                        {phase.evidence.map(ev => (
                                            <li key={ev.id} style={{ marginBottom: '0.25rem' }}>
                                                {ev.type === 'photo' ? '📸' : '📝'} {ev.content.substring(0, 40)}{ev.content.length > 40 ? '...' : ''}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
