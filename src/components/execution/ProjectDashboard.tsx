import { useState } from 'react';
import type { KaizenPhase, PhaseEvidence } from '../../types';
import ActionItems from './ActionItems';
import { useTranslation } from 'react-i18next';

interface ProjectDashboardProps {
    project: any;
    onBack: () => void;
    onUpdateProject: (updated: any) => void;
    onViewSpatial: (url: string) => void;
}

type DashboardView = 'main' | 'charter' | 'actions' | 'report' | 'five-whys' | 'time-study' | 'vsm' | 'a3';

export default function ProjectDashboard({ project, onBack, onUpdateProject, onViewSpatial }: ProjectDashboardProps) {
    const { t } = useTranslation();
    const [view, setView] = useState<DashboardView>('main');
    const [activePhaseIndex, setActivePhaseIndex] = useState(0);

    const activePhase = project.phases[activePhaseIndex];

    const togglePhaseStatus = (phaseId: string) => {
        const updatedPhases = project.phases.map((ph: KaizenPhase) => {
            if (ph.id === phaseId) {
                const nextStatus: KaizenPhase['status'] =
                    ph.status === 'pending' ? 'in-progress' :
                        ph.status === 'in-progress' ? 'completed' : 'pending';
                return { ...ph, status: nextStatus };
            }
            return ph;
        });
        onUpdateProject({ ...project, phases: updatedPhases });
    };

    const addNoteToPhase = (phaseId: string, note: string) => {
        if (!note.trim()) return;
        const newEvidence: PhaseEvidence = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'note',
            content: note,
            timestamp: new Date().toISOString()
        };

        const updatedPhases = project.phases.map((ph: any) => {
            if (ph.id === phaseId) {
                return { ...ph, evidence: [...ph.evidence, newEvidence] };
            }
            return ph;
        });
        onUpdateProject({ ...project, phases: updatedPhases });
    };

    // Charter and Report views removed for active rebuild

    if (view === 'actions') {
        return (
            <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
                <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => setView('main')}>
                    ← Back to Dashboard
                </button>
                <ActionItems project={project} />
            </div>
        );
    }

    // Legacy tool views removed for active rebuild

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-panel)' }}>
            {/* Project Header */}
            <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={onBack}>{t('executionHub.backToRoadmaps')}</button>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{project.name}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className={`tab-btn ${(view as string) === 'main' ? 'active' : ''}`} onClick={() => setView('main')}>{t('projectDashboard.overview')}</button>
                        <button className={`tab-btn ${(view as string) === 'actions' ? 'active' : ''}`} onClick={() => setView('actions')}>{t('projectDashboard.actionItems')}</button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('projectDashboard.overallProgress')}</div>
                        <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
                            <div style={{
                                width: `${(project.phases.filter((p: KaizenPhase) => p.status === 'completed').length / project.phases.length) * 100}%`,
                                height: '100%',
                                background: 'var(--accent-success)',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Phases Sidebar */}
                <div style={{ width: '300px', borderRight: '1px solid var(--border-light)', overflowY: 'auto', padding: '1.5rem', background: 'rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem', letterSpacing: '1px', fontWeight: 900 }}>{t('projectDashboard.milestones')}</h3>
                    {project.phases.map((ph: KaizenPhase, idx: number) => (
                        <div
                            key={ph.id}
                            onClick={() => setActivePhaseIndex(idx)}
                            style={{
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                background: activePhaseIndex === idx ? 'var(--bg-dark)' : 'transparent',
                                border: '1px solid',
                                borderColor: activePhaseIndex === idx ? 'var(--accent-primary)' : 'transparent',
                                marginBottom: '0.75rem',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>{t('projectDashboard.day')} {ph.day}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: activePhaseIndex === idx ? 'var(--text-main)' : 'var(--text-muted)' }}>{ph.title}</div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePhaseStatus(ph.id); }}
                                    style={{
                                        width: '24px', height: '24px', borderRadius: '50%', border: '2px solid',
                                        borderColor: ph.status === 'completed' ? 'var(--accent-success)' : ph.status === 'in-progress' ? 'var(--accent-primary)' : 'var(--border-light)',
                                        background: ph.status === 'completed' ? 'var(--accent-success)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '0.6rem', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {ph.status === 'completed' ? '✓' : ''}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Phase Detail */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px' }}>{activePhase.title}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>{activePhase.description}</p>
                        </div>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(var(--accent-primary-rgb), 0.1)', borderRadius: '0.5rem', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                            {activePhase.status.toUpperCase()}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Evidence Log */}
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginTop: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('projectDashboard.evidenceLog')}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder={t('projectDashboard.addObservation')}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value;
                                                if (val) addNoteToPhase(activePhase.id, val);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                    <button className="btn btn-primary">{t('projectDashboard.add')}</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {activePhase.evidence.map((ev: any) => (
                                        <div key={ev.id} style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{ev.type.toUpperCase()}</span>
                                                <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div style={{ fontSize: '0.95rem' }}>{ev.content}</div>
                                            {ev.type === 'spatial' && (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.8rem' }}
                                                    onClick={() => onViewSpatial(ev.content)}
                                                >
                                                    {t('projectDashboard.viewSpatial')}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {activePhase.evidence.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                            {t('projectDashboard.noEvidence')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.1) 0%, transparent 100%)' }}>
                                <h3 style={{ marginTop: 0, fontSize: '1.2rem' }}>Notice</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                                    Legacy execution tools have been removed for the GembaOS Operating Room rebuild. Use the top navigation for Observe, Diagnose, and Improve modules.
                                </p>
                            </div>

                            <div className="card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginTop: 0, fontSize: '1.2rem' }}>{t('projectDashboard.suggestedTools')}</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                                    {activePhase.suggestedTools.length > 0 ? activePhase.suggestedTools.map((tool: any) => (
                                        <span key={tool} className="pill" style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', padding: '0.5rem 1rem' }}>
                                            {tool}
                                        </span>
                                    )) : <p style={{ color: 'var(--text-muted)' }}>{t('projectDashboard.noTools')}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .tab-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: var(--text-muted);
                    padding: 0.4rem 0.8rem;
                    border-radius: 0.5rem;
                    font-size: 0.8rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: var(--text-main);
                }
            `}} />
        </div>
    );
}
