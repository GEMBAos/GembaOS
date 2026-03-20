/**
 * ARCHIVE NOTICE
 * Original Use: Used for longer term roadmap viewing.
 * Moved to: unused_modules
 */

import { useState } from 'react';
import type { KaizenPhase, KaizenProject, PhaseEvidence } from '../types';
import AgentPanel from './AgentPanel';
import gembaosIcon from '../assets/branding/gembaos-icon.png';

interface RoadmapViewProps {
    project: KaizenProject;
    setProject: (p: KaizenProject) => void;
}

export default function RoadmapView({ project, setProject }: RoadmapViewProps) {
    const [activePhaseIndex, setActivePhaseIndex] = useState(0);

    const activePhase = project.phases[activePhaseIndex];

    const updatePhaseStatus = (status: KaizenPhase['status']) => {
        const updated = { ...project };
        updated.phases[activePhaseIndex].status = status;
        setProject(updated);
    };

    const addEvidence = (type: PhaseEvidence['type'], content: string) => {
        const ev: PhaseEvidence = {
            id: Date.now().toString(),
            type,
            content,
            timestamp: new Date().toLocaleTimeString()
        };
        const updated = { ...project };
        updated.phases[activePhaseIndex].evidence.push(ev);
        setProject(updated);
    };

    return (
        <div style={{ display: 'flex', gap: '2rem', height: '100%', flexWrap: 'wrap' }}>
            {/* Left side: Roadmap timeline */}
            <div style={{ flex: '1 1 320px', minWidth: 'min(100%, 400px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <img src={gembaosIcon} alt="GembaOS Icon" style={{ width: '48px', height: '48px', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.75rem' }}>Execution Roadmap</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Select a phase to view details and upload evidence.</p>
                    </div>
                </div>

                <div className="timeline">
                    {project.phases.map((phase, idx) => (
                        <div
                            key={phase.id}
                            className="timeline-item"
                            style={{
                                cursor: 'pointer',
                                opacity: activePhaseIndex === idx ? 1 : 0.6,
                                transform: activePhaseIndex === idx ? 'translateX(0.5rem)' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setActivePhaseIndex(idx)}
                        >
                            <div
                                className="card"
                                style={{
                                    borderColor: activePhaseIndex === idx ? 'var(--accent-primary)' : 'var(--border-color)',
                                    backgroundColor: activePhaseIndex === idx ? 'var(--bg-panel-hover)' : 'var(--bg-panel)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span className="pill" style={{
                                        backgroundColor: phase.status === 'completed' ? 'var(--accent-success)' : 'rgba(59, 130, 246, 0.1)',
                                        color: phase.status === 'completed' ? '#fff' : 'var(--accent-primary)',
                                        borderColor: 'transparent'
                                    }}>
                                        {phase.status.toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Day {phase.day}</span>
                                </div>
                                <h4 style={{ marginBottom: '0.25rem' }}>{phase.title}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{phase.description}</p>

                                {phase.evidence.length > 0 && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                                        📎 {phase.evidence.length} pieces of evidence attached
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side: Phase Execution & Agent */}
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '100%' }}>
                {/* Active Phase Dashboard */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Phase Execution</h3>
                        <select
                            value={activePhase.status}
                            onChange={e => updatePhaseStatus(e.target.value as any)}
                            className="input-field"
                            style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: 'var(--accent-primary)' }}>{activePhase.title}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {activePhase.suggestedTools.map(t => (
                                <span key={t} className="pill" style={{ background: '#374151', color: '#e5e7eb', borderColor: '#4b5563' }}>
                                    🛠 {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Evidence & Data Log</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <button className="btn" onClick={() => {
                                const note = prompt('Enter text note or URL for evidence:');
                                if (note) addEvidence('note', note);
                            }}>+ Add Note</button>
                            <button className="btn" onClick={() => {
                                const url = prompt('Enter Image URL (or photo path):');
                                if (url) addEvidence('photo', url);
                            }}>+ Upload Photo</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {activePhase.evidence.map(ev => (
                                <div key={ev.id} style={{ padding: '0.75rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                                    <strong>{ev.type.toUpperCase()}</strong> ({ev.timestamp}): {ev.content}
                                </div>
                            ))}
                            {activePhase.evidence.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>No evidence logged for this phase yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Agent Panel */}
                <div className="card glass-panel" style={{ position: 'sticky', top: '2rem' }}>
                    <AgentPanel phase={activePhase} />
                </div>
            </div>
        </div>
    );
}
