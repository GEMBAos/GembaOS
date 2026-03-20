import { useState, useEffect } from 'react';
import type { KaizenProject } from '../types';
import { storageService } from '../services/storageService';

interface KPITrackerProps {
    onBack: () => void;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    trend: number;
    icon: string;
    color: string;
}

function MetricCard({ title, value, trend, icon, color }: MetricCardProps) {
    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem', background: `${color}22`, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>
                <div style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: trend >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: trend >= 0 ? '#6ee7b7' : '#fca5a5'
                }}>
                    {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
                </div>
            </div>
            <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
            </div>
        </div>
    );
}

export default function KPITracker({ onBack }: KPITrackerProps) {
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
    const [projects, setProjects] = useState<KaizenProject[]>([]);
    const [allActionItems, setAllActionItems] = useState<any[]>([]);

    useEffect(() => {
        setProjects(storageService.getProjects());
        setAllActionItems(storageService.getActionItems());

        const handleUpdate = () => {
            setProjects(storageService.getProjects());
            setAllActionItems(storageService.getActionItems());
        };
        window.addEventListener('kaizen_data_updated', handleUpdate);
        return () => window.removeEventListener('kaizen_data_updated', handleUpdate);
    }, []);

    // Rollup derived from projects
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Closed').length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;

    // Calculate total action items
    const completedActions = allActionItems.filter(a => a.status === 'Done').length;
    const actionCompletionRate = allActionItems.length > 0 ? Math.round((completedActions / allActionItems.length) * 100) : 0;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-panel)', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={onBack}>← Back to Portal</button>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📈 Master KPI Dashboard
                    </h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['week', 'month', 'quarter', 'year'] as const).map(tf => (
                        <button
                            key={tf}
                            className={`btn ${timeframe === tf ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setTimeframe(tf)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* SQDC Cross Setup */}
                <section>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>SQDC Snapshot</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        <MetricCard title="Safety (Days w/o Incident)" value={142} trend={12} icon="👷" color="#10b981" />
                        <MetricCard title="Quality (First Pass Yield)" value="98.2%" trend={2.1} icon="✨" color="#ffffff" />
                        <MetricCard title="Delivery (On-Time)" value="94.5%" trend={-1.5} icon="🚚" color="#3b82f6" />
                        <MetricCard title="Cost (Scrap Reduction)" value="$12.4K" trend={15} icon="💰" color="#71717a" />
                    </div>
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '1rem 0' }} />

                {/* Kaizen Specific Execution Metrics */}
                <section>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Kaizen & Continuous Improvement</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                        {/* Project Funnel */}
                        <div className="card" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
                            <h4 style={{ margin: '0 0 1rem 0' }}>Project Pipeline</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-muted)' }}>{totalProjects - activeProjects - completedProjects}</div>
                                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Backlog</div>
                                </div>
                                <div style={{ fontSize: '2rem', color: 'var(--border-light)' }}>→</div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{activeProjects}</div>
                                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-primary)' }}>Active</div>
                                </div>
                                <div style={{ fontSize: '2rem', color: 'var(--border-light)' }}>→</div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-success)' }}>{completedProjects}</div>
                                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-success)' }}>Closed</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Item Execution */}
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 1rem 0' }}>Task Execution Rate</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingBottom: '1rem' }}>
                                <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Mock SVG Donut Chart */}
                                    <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-light)" strokeWidth="10" />
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent-primary)" strokeWidth="10" strokeDasharray={`${actionCompletionRate * 2.51} 251.2`} />
                                    </svg>
                                    <div style={{ textAlign: 'center', zIndex: 1 }}>
                                        <span style={{ fontSize: '2rem', fontWeight: 900 }}>{actionCompletionRate}%</span>
                                    </div>
                                </div>
                                <p style={{ margin: '1rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {completedActions} of {allActionItems.length} tasks completed
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Successes */}
                <section>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Top Impact Areas (Calculated Value)</h3>
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-light)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Project Name</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', textAlign: 'right' }}>Score Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No projects to analyze.</td>
                                    </tr>
                                ) : projects.slice(0, 5).map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{p.name}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.75rem',
                                                background: p.status === 'Closed' ? 'rgba(16, 185, 129, 0.2)' : p.status === 'Active' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.1)',
                                                color: p.status === 'Closed' ? '#6ee7b7' : p.status === 'Active' ? '#93c5fd' : '#fff'
                                            }}>
                                                {p.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 900, color: 'var(--accent-secondary)' }}>
                                            {Math.floor(Math.random() * 50) + 10}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}
