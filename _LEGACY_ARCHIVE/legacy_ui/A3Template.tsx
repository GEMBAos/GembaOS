/**
 * ARCHIVE NOTICE
 * Original Use: Used as an A3 problem-solving digital form.
 * Moved to: legacy_ui
 */

import type { KaizenProject, A3ReportData } from '../../types';

interface A3TemplateProps {
    project: KaizenProject;
    onBack: () => void;
    onUpdateProject: (p: KaizenProject) => void;
}

export default function A3Template({ project, onBack, onUpdateProject }: A3TemplateProps) {
    const updateA3Data = (field: keyof A3ReportData, value: string) => {
        const currentData = project.a3Data || {
            background: project.problemStatement || '',
            currentCondition: '',
            rootCauseAnalysis: project.fiveWhysData ? project.fiveWhysData[4] || '' : '',
            targetCondition: project.kpis ? project.kpis.map(k => `${k.name}: ${k.baseline} -> ${k.target}`).join('\n') : '',
            implementationPlan: project.phases ? project.phases.map(p => `- Phase ${p.day}: ${p.title}`).join('\n') : '',
            followUp: ''
        };
        
        onUpdateProject({
            ...project,
            a3Data: { ...currentData, [field]: value }
        });
    };

    const data = project.a3Data || {
        background: project.problemStatement || '',
        currentCondition: '',
        rootCauseAnalysis: project.fiveWhysData ? project.fiveWhysData[4] || '' : '',
        targetCondition: project.kpis && project.kpis.length > 0 ? project.kpis.map(k => `${k.name}: ${k.baseline} -> ${k.target}`).join('\n') : '',
        implementationPlan: project.phases && project.phases.length > 0 ? project.phases.map(p => `- Day ${p.day}: ${p.title}`).join('\n') : '',
        followUp: ''
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Back to Dashboard
                </button>
                <h2 style={{ margin: 0 }}>A3 Problem Solving Report</h2>
                <button className="btn btn-primary" onClick={() => window.print()}>
                    🖨️ Print A3
                </button>
            </div>

            <div className="print-area" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: 'white', color: 'black', padding: '2rem', borderRadius: '4px', minHeight: '800px', outline: '1px solid #ccc' }}>
                
                {/* Header */}
                <div style={{ gridColumn: '1 / -1', borderBottom: '2px solid #333', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Theme / Project Name</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{project.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Owner / Date</div>
                        <div>{project.team?.[0] || 'Team'} | {new Date(Number(project.createdAt)).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Left Side (Problem, Current, Root Cause) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid #eee', paddingRight: '2rem' }}>
                    <section>
                        <h3 style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>1. Background / Problem Statement</h3>
                        <textarea 
                            style={{ width: '100%', minHeight: '100px', border: 'none', resize: 'none', background: 'transparent' }}
                            value={data.background}
                            onChange={(e) => updateA3Data('background', e.target.value)}
                            placeholder="Why is this important? What is the business context?"
                        />
                    </section>

                    <section>
                        <h3 style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>2. Current Condition</h3>
                        {project.vsmData && project.vsmData.length > 0 && (
                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', fontStyle: 'italic' }}>Auto-synced from Value Stream Map</div>
                        )}
                        <textarea 
                            style={{ width: '100%', minHeight: '150px', border: 'none', resize: 'none', background: 'transparent' }}
                            value={data.currentCondition}
                            onChange={(e) => updateA3Data('currentCondition', e.target.value)}
                            placeholder="What is happening today? Draw the process."
                        />
                    </section>

                    <section>
                        <h3 style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>3. Target Condition / Goals</h3>
                        <textarea 
                            style={{ width: '100%', minHeight: '100px', border: 'none', resize: 'none', background: 'transparent' }}
                            value={data.targetCondition}
                            onChange={(e) => updateA3Data('targetCondition', e.target.value)}
                            placeholder="What specific outcome are we aiming for?"
                        />
                    </section>
                    
                    <section style={{ flex: 1 }}>
                        <h3 style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>4. Root Cause Analysis</h3>
                        {project.fiveWhysData && project.fiveWhysData.length > 0 && (
                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', fontStyle: 'italic' }}>Auto-synced from 5-Whys Tool</div>
                        )}
                        <textarea 
                            style={{ width: '100%', minHeight: '150px', border: 'none', resize: 'none', background: 'transparent' }}
                            value={data.rootCauseAnalysis}
                            onChange={(e) => updateA3Data('rootCauseAnalysis', e.target.value)}
                            placeholder="What is the root cause? (e.g., Fishbone, 5 Whys)"
                        />
                    </section>
                </div>

                {/* Right Side (Target, Countermeasures, Plan, Followup) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <section>
                        <h3 style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>5. Countermeasures</h3>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', fontStyle: 'italic' }}>Auto-synced from Action Items</div>
                        <div style={{ fontSize: '0.9rem', minHeight: '150px' }}>
                            See Execution Hub Action Items list.
                        </div>
                    </section>

                    <section style={{ flex: 1 }}>
                        <h3 style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>6. Implementation Plan</h3>
                        {project.phases && project.phases.length > 0 && (
                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', fontStyle: 'italic' }}>Auto-synced from Project Roadmap</div>
                        )}
                        <textarea 
                            style={{ width: '100%', minHeight: '150px', border: 'none', resize: 'none', background: 'transparent' }}
                            value={data.implementationPlan}
                            onChange={(e) => updateA3Data('implementationPlan', e.target.value)}
                            placeholder="Who, what, when?"
                        />
                    </section>

                    <section>
                        <h3 style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>7. Follow-up / Check</h3>
                        <textarea 
                            style={{ width: '100%', minHeight: '100px', border: 'none', resize: 'none', background: 'transparent' }}
                            value={data.followUp}
                            onChange={(e) => updateA3Data('followUp', e.target.value)}
                            placeholder="How will we sustain the gains? (e.g. Leader Standard Work)"
                        />
                    </section>
                </div>
                
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none; }
                }
            `}} />
        </div>
    );
}
