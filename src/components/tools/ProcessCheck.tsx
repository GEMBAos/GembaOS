import { useState, useEffect } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { MotionPath, ProcessCheck as ProcessCheckType } from '../../types/improvement';

export default function ProcessCheck({ onClose }: { onClose: () => void }) {
    const [sessions, setSessions] = useState<MotionPath[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');
    const [step, setStep] = useState<number>(0);

    // Diagnostic State
    const [interruptionCause, setInterruptionCause] = useState<string>('');
    const [isValueWork, setIsValueWork] = useState<boolean | null>(null);
    const [rootCauseNotes, setRootCauseNotes] = useState<string>('');

    const CAUSE_CATEGORIES = [
        "Material not at point of use",
        "Tool not available",
        "Searching",
        "Waiting",
        "Setup / preparation",
        "Quality issue",
        "Information missing",
        "Layout / reach problem",
        "Other"
    ];

    const refreshData = () => {
        setSessions(ImprovementEngine.getItemsByType<MotionPath>('MotionPath'));
    };

    useEffect(() => {
        refreshData();
        const listener = () => refreshData();
        window.addEventListener('improvement_data_updated', listener);
        return () => window.removeEventListener('improvement_data_updated', listener);
    }, []);

    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    const handleSaveDiagnosis = () => {
        if (!selectedSession) return;

        ImprovementEngine.createItem<ProcessCheckType>({
            type: 'ProcessCheck',
            motionSessionId: selectedSession.id,
            processName: selectedSession.sessionName,
            operatorId: selectedSession.operatorId,
            findings: `Interruption: ${interruptionCause}\nValue Classification: ${isValueWork ? 'Value Work' : 'Preparation/Waste'}\nNotes: ${rootCauseNotes}`,
            wasteTypes: [interruptionCause],
            targetCycleTime: 0,
            actualCycleTime: 0
        });

        // Reset
        setStep(0);
        setSelectedSessionId('');
        setInterruptionCause('');
        setIsValueWork(null);
        setRootCauseNotes('');
        alert("Diagnosis Saved. Ready for Improvement Handoff.");
    };

    return (
        <HardwareConsoleLayout 
            toolId="DIAG-01 ROOT CAUSE" 
            toolName="PROCESS CHECK" 
            onClose={onClose}
        >
            <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Step 0: Observation Intake */}
                {step === 0 && (
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        <h2 style={{ color: '#38bdf8', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>OBSERVATION INTAKE</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Select a recorded Motion Mapping session to diagnose field exits and motion waste.</p>
                        
                        {sessions.length === 0 ? (
                            <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center', color: '#64748b', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                No Motion Mapping sessions found. Go to the Observe module first.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {sessions.map(s => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => setSelectedSessionId(s.id)}
                                        style={{ 
                                            padding: 'clamp(1rem, 2vw, 1.25rem)', 
                                            background: selectedSessionId === s.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.4)', 
                                            border: `1px solid ${selectedSessionId === s.id ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`, 
                                            borderRadius: '8px', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.2s',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div>
                                            <div style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.sessionName}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Surgeon: {s.operatorId}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
                                            <div>
                                                <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Field Exits</div>
                                                <div style={{ color: s.longestSegment > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{s.longestSegment}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Distance</div>
                                                <div style={{ color: '#a78bfa', fontWeight: 'bold' }}>{s.totalDistance} ft</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <button 
                                    onClick={() => setStep(1)}
                                    disabled={!selectedSessionId}
                                    style={{ 
                                        marginTop: '1.5rem', 
                                        padding: '1rem', 
                                        background: '#38bdf8', 
                                        color: '#0f172a', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        fontWeight: 'bold', 
                                        fontSize: '1rem', 
                                        cursor: !selectedSessionId ? 'not-allowed' : 'pointer',
                                        opacity: !selectedSessionId ? 0.5 : 1
                                    }}
                                >
                                    BEGIN DIAGNOSIS →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 1: Cause Classification */}
                {step === 1 && selectedSession && (
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h2 style={{ color: '#f59e0b', margin: 0, fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>FIELD EXIT ANALYSIS</h2>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Analyzing: <strong style={{ color: '#e2e8f0' }}>{selectedSession.sessionName}</strong></span>
                        </div>
                        
                        <p style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '1.5rem' }}>What was the primary reason the surgeon left the operating field or stopped working?</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                            {CAUSE_CATEGORIES.map(cause => (
                                <button
                                    key={cause}
                                    onClick={() => setInterruptionCause(cause)}
                                    style={{
                                        padding: '1rem',
                                        background: interruptionCause === cause ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0,0,0,0.4)',
                                        border: `1px solid ${interruptionCause === cause ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                                        color: interruptionCause === cause ? '#fcd34d' : '#cbd5e1',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        fontWeight: interruptionCause === cause ? 'bold' : 'normal'
                                    }}
                                >
                                    {cause}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(0)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                            <button 
                                onClick={() => setStep(2)}
                                disabled={!interruptionCause}
                                style={{ flex: 1, padding: '0.75rem', background: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: !interruptionCause ? 'not-allowed' : 'pointer', opacity: !interruptionCause ? 0.5 : 1 }}
                            >
                                NEXT: VALUE CLASSIFICATION →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Value vs Preparation */}
                {step === 2 && selectedSession && (
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h2 style={{ color: '#a78bfa', margin: 0, fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>VALUE CLASSIFICATION</h2>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Cause: <strong style={{ color: '#f59e0b' }}>{interruptionCause}</strong></span>
                        </div>
                        
                        <p style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}>Did this interrupted step actually change the product (patient) in a way the customer values?</p>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                            <div 
                                onClick={() => setIsValueWork(true)}
                                style={{ 
                                    flex: 1, 
                                    padding: '2rem', 
                                    background: isValueWork === true ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.4)', 
                                    border: `2px solid ${isValueWork === true ? '#10b981' : 'rgba(255,255,255,0.1)'}`, 
                                    borderRadius: '12px', 
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                                <div style={{ color: isValueWork === true ? '#10b981' : '#f1f5f9', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>YES</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>This was Value Work.</div>
                            </div>
                            
                            <div 
                                onClick={() => setIsValueWork(false)}
                                style={{ 
                                    flex: 1, 
                                    padding: '2rem', 
                                    background: isValueWork === false ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.4)', 
                                    border: `2px solid ${isValueWork === false ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, 
                                    borderRadius: '12px', 
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛑</div>
                                <div style={{ color: isValueWork === false ? '#ef4444' : '#f1f5f9', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>NO</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>This was Preparation or Support Work.</div>
                            </div>
                        </div>

                        {isValueWork === false && (
                            <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', color: '#fca5a5', marginBottom: '2rem', borderRadius: '4px' }}>
                                <strong>Operating Room Principle:</strong> Preparation should happen <em>before</em> the operation begins. If the surgeon is preparing during the procedure, the system is failing the surgeon.
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(1)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                            <button 
                                onClick={() => setStep(3)}
                                disabled={isValueWork === null}
                                style={{ flex: 1, padding: '0.75rem', background: '#a78bfa', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isValueWork === null ? 'not-allowed' : 'pointer', opacity: isValueWork === null ? 0.5 : 1 }}
                            >
                                NEXT: ROOT CAUSE NOTES →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Summary and Handoff */}
                {step === 3 && selectedSession && (
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <h2 style={{ color: '#10b981', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>DIAGNOSIS SUMMARY</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Observed Action</div>
                                <div style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedSession.sessionName}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>{selectedSession.longestSegment} Field Exits observed.</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Diagnostic Conclusion</div>
                                <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.1rem' }}>{interruptionCause}</div>
                                <div style={{ color: isValueWork ? '#10b981' : '#ef4444', fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: 'bold' }}>
                                    {isValueWork ? 'Value Work' : 'Preparation / Waste'}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>Root Cause Notes & Context</label>
                            <textarea
                                value={rootCauseNotes}
                                onChange={(e) => setRootCauseNotes(e.target.value)}
                                placeholder="e.g., Surgeon had to walk 40ft to retrieve the drill because the shadow board was empty..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(16, 185, 129, 0.4)', textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Ready for Improvement</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>This diagnosis will be handed off to the Improve module to generate experiments and solutions.</div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setStep(2)} style={{ flex: '1 1 100px', padding: '0.75rem 1.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                            <button 
                                onClick={handleSaveDiagnosis}
                                style={{ flex: '2 1 200px', padding: '1rem', background: '#10b981', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            >
                                SAVE & CREATE IMPROVEMENT CARD ⚡
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </HardwareConsoleLayout>
    );
}
