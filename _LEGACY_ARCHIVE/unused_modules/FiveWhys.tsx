/**
 * ARCHIVE NOTICE
 * Original Use: Used for 5-Whys root cause analysis.
 * Moved to: unused_modules
 */

import { useState } from 'react';
import type { KaizenProject } from '../../types';

interface FiveWhysProps {
    project?: KaizenProject;
    onUpdateProject?: (p: KaizenProject) => void;
    onClose?: () => void;
}

export default function FiveWhys({ project, onUpdateProject, onClose }: FiveWhysProps) {
    const [whys, setWhys] = useState<string[]>(project?.fiveWhysData || ['', '', '', '', '']);
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const handleNext = () => {
        if (!whys[currentStep].trim()) return; // Prevent advancing if empty
        if (project && onUpdateProject) {
            onUpdateProject({ ...project, fiveWhysData: whys });
        }
        if (currentStep < 4) {
            setCurrentStep(s => s + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleSaveAsProblemStatement = () => {
        if (!project || !onUpdateProject || !onClose) return;
        const rootCause = whys[4];
        const newStatement = `Issue: ${project.problemStatement}\nRoot Cause (5 Whys): ${rootCause}`;
        onUpdateProject({ ...project, problemStatement: newStatement, fiveWhysData: whys });
        onClose();
    };

    const resetAnalysis = () => {
        if (confirm('Clear all answers and start over?')) {
            setWhys(['', '', '', '', '']);
            setCurrentStep(0);
            setIsComplete(false);
        }
    }

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            {onClose && (
                <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={onClose}>
                    ← Back to Dashboard
                </button>
            )}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
                    <h2 style={{ margin: 0, fontSize: '2rem' }}>5 Whys Analysis</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Drill down past symptoms to find the true root cause.</p>
                </header>

                {project ? (
                    <div className="card" style={{ marginBottom: '2rem', background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Original Problem Statement</h4>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{project.problemStatement}</p>
                    </div>
                ) : (
                    <div className="card" style={{ marginBottom: '2rem', background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Training Mode: Generic Problem</h4>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>"The robotic welding arm stopped unexpectedly during production."</p>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                    {whys.map((why, index) => {
                        const isPast = index < currentStep;
                        const isCurrent = index === currentStep;
                        const isFuture = index > currentStep;

                        if (isFuture && !isComplete) return null;

                        return (
                            <div key={index} style={{
                                opacity: isPast ? 0.7 : 1,
                                transition: 'all 0.3s ease',
                                transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                                borderLeft: isCurrent ? '4px solid var(--accent-primary)' : '4px solid transparent',
                                paddingLeft: isCurrent ? '1rem' : '0'
                            }}>
                                <label className="input-label" style={{ fontSize: '1.1rem', color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                    Why {index + 1}?
                                    {index === 0 && <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', fontWeight: 'normal' }}>(Why did the above problem happen?)</span>}
                                    {index > 0 && <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', fontWeight: 'normal' }}>(Why did "{whys[index - 1]}" happen?)</span>}
                                </label>
                                <textarea
                                    className="input-field"
                                    rows={isCurrent ? 3 : 1}
                                    value={why}
                                    onChange={(e) => {
                                        const newWhys = [...whys];
                                        newWhys[index] = e.target.value;
                                        setWhys(newWhys);
                                    }}
                                    onBlur={() => {
                                        if (project && onUpdateProject) {
                                            onUpdateProject({ ...project, fiveWhysData: whys });
                                        }
                                    }}
                                    disabled={isPast || isComplete}
                                    style={{
                                        fontSize: '1.1rem',
                                        background: isCurrent ? 'var(--bg-input)' : 'rgba(0,0,0,0.2)',
                                        border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)'
                                    }}
                                    autoFocus={isCurrent}
                                />
                                {isCurrent && !isComplete && (
                                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                        <button className="btn btn-primary" onClick={handleNext} disabled={!why.trim()}>
                                            {index < 4 ? 'Next Why →' : 'Find Root Cause 🎯'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isComplete && (
                    <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0.2) 100%)', border: '1px solid var(--accent-success)', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-success)' }}>Root Cause Identified</h3>
                        <p style={{ fontSize: '1.25rem', fontWeight: 600, maxWidth: '600px', margin: '0 auto 2rem' }}>
                            "{whys[4]}"
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={resetAnalysis}>Restart Analysis</button>
                            {project && onClose && (
                                <button className="btn btn-primary" onClick={handleSaveAsProblemStatement}>Append to Project Problem Statement</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
