/**
 * ARCHIVE NOTICE
 * Original Use: Used for building Leader Standard Work.
 * Moved to: unused_modules
 */

import { useState } from 'react';

type Step = 'current' | 'gap' | 'goals' | 'result';

interface LSWBuilderProps {
    onClose?: () => void;
}

export default function LSWBuilder({ onClose }: LSWBuilderProps) {
    const [step, setStep] = useState<Step>('current');

    // Form State
    const [currentWork, setCurrentWork] = useState('');
    const [timeGap, setTimeGap] = useState('');
    const [goals, setGoals] = useState('');

    // Loading State
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setStep('result');
        }, 1500); // Simulate AI generation delay
    };

    const renderStepContent = () => {
        switch (step) {
            case 'current':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>1. Your Current Reality</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            What are the main tasks consuming your time every day? List firefighting, meetings, email, or daily routines.
                        </p>
                        <textarea
                            className="input-field"
                            style={{ width: '100%', height: '120px', resize: 'vertical', marginBottom: '1.5rem' }}
                            placeholder="e.g. Checking emails, sitting in update meetings, troubleshooting machine breakdowns..."
                            value={currentWork}
                            onChange={(e) => setCurrentWork(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-primary"
                                disabled={!currentWork.trim()}
                                onClick={() => setStep('gap')}
                            >
                                Next Step →
                            </button>
                        </div>
                    </div>
                );
            case 'gap':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-danger)' }}>2. The Time Gap</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            What important tasks do you feel like you <b>never have time for</b>? What keeps getting pushed to tomorrow?
                        </p>
                        <textarea
                            className="input-field"
                            style={{ width: '100%', height: '120px', resize: 'vertical', marginBottom: '1.5rem' }}
                            placeholder="e.g. Coaching my team one-on-one, walking the floor (Gemba), strategic planning..."
                            value={timeGap}
                            onChange={(e) => setTimeGap(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary" onClick={() => setStep('current')}>← Back</button>
                            <button
                                className="btn btn-primary"
                                disabled={!timeGap.trim()}
                                onClick={() => setStep('goals')}
                            >
                                Next Step →
                            </button>
                        </div>
                    </div>
                );
            case 'goals':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-success)' }}>3. Your Core Objectives</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            What are you ultimately trying to achieve in your role right now?
                        </p>
                        <textarea
                            className="input-field"
                            style={{ width: '100%', height: '120px', resize: 'vertical', marginBottom: '1.5rem' }}
                            placeholder="e.g. Improve overall team morale, reduce defect rate by 10%, establish a culture of continuous improvement..."
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary" disabled={isGenerating} onClick={() => setStep('gap')}>← Back</button>
                            <button
                                className="btn btn-primary"
                                disabled={!goals.trim() || isGenerating}
                                onClick={handleGenerate}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {isGenerating ? '⏳ Generating Plan...' : '✨ Create Time Budget'}
                            </button>
                        </div>
                    </div>
                );
            case 'result':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-out', border: '1px solid var(--accent-primary)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗓️</div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Your Leadership Standard Work</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                A loose, achievable time budget designed to bridge your gaps and hit your goals.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {/* Daily Habits */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', borderTop: '4px solid var(--accent-success)' }}>
                                <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                                    <span>☀️</span> Daily Intentions
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                                        <div style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>1</div>
                                        <div>
                                            <strong>15-Min Gemba Walk:</strong> Spend the first 15 minutes of the shift on the floor. Don't fix problems; just observe and greet your team.
                                        </div>
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                                        <div style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>2</div>
                                        <div>
                                            <strong>Block 30 Mins for "The Gap":</strong> Schedule 30 inviolable minutes purely dedicated to the items you said you never have time for.
                                        </div>
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                                        <div style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>3</div>
                                        <div>
                                            <strong>End-of-Day Triage (10m):</strong> Review what got derailed today and pick exactly One Thing that must absolutely get done tomorrow.
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Weekly Habits */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', borderTop: '4px solid var(--accent-primary)' }}>
                                <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                                    <span>📅</span> Weekly Commitments
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                                        <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>1</div>
                                        <div>
                                            <strong>One 1:1 Coaching Session:</strong> Pick one direct report each week for a 20-minute development conversation (not a status update).
                                        </div>
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                                        <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>2</div>
                                        <div>
                                            <strong>"Meeting Diet" Review:</strong> Look at next week's calendar and decline/delegate at least ONE recurring meeting that doesn't serve your goals.
                                        </div>
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                                        <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>3</div>
                                        <div>
                                            <strong>Friday Wins Reflection:</strong> Spend 5 minutes on Friday afternoon documenting one small improvement (Kaizen) your team made.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => {
                                setStep('current');
                                setCurrentWork('');
                                setTimeGap('');
                                setGoals('');
                            }}>
                                🔄 Start Over
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', background: 'var(--bg-panel)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {onClose && (
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={onClose}>← Back</button>
                        )}
                        <h2 style={{ margin: 0 }}>Leadership Standard Work</h2>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {['current', 'gap', 'goals', 'result'].map((s, i) => {
                        const steps = ['current', 'gap', 'goals', 'result'];
                        const currentIndex = steps.indexOf(step);
                        const isActive = i <= currentIndex;
                        return (
                            <div
                                key={s}
                                style={{
                                    flex: 1,
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    transition: 'background 0.3s'
                                }}
                            />
                        );
                    })}
                </div>

                {/* Main Content Area */}
                {renderStepContent()}

            </div>
        </div>
    );
}
