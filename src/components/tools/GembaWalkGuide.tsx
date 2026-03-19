import { useState, useEffect } from 'react';
import { GEMBA_CHALLENGES, type GembaChallenge } from '../../data/gembaChallenges';

type WalkPhase = 'intro' | 'observe' | 'engage' | 'reflect' | 'summary';

interface GembaWalkGuideProps {
    onClose?: () => void;
}

export default function GembaWalkGuide({ onClose }: GembaWalkGuideProps) {
    const [phase, setPhase] = useState<WalkPhase>('intro');

    // Notes state
    const [wastesObserved, setWastesObserved] = useState('');
    const [operatorFeedback, setOperatorFeedback] = useState('');
    const [actionItems, setActionItems] = useState('');

    // Randomized Challenge State
    const [currentChallenge, setCurrentChallenge] = useState<GembaChallenge | null>(null);

    useEffect(() => {
        // Initialize with a random challenge
        shuffleChallenge();
    }, []);

    const shuffleChallenge = () => {
        // Get viewed challenge IDs from localStorage
        const viewedStr = localStorage.getItem('gembaos_viewed_challenges') || '[]';
        let viewedIds: string[] = JSON.parse(viewedStr);

        // Find available challenges that haven't been viewed yet
        let availableChallenges = GEMBA_CHALLENGES.filter(c => !viewedIds.includes(c.id));

        // If all challenges have been viewed, reset the history
        if (availableChallenges.length === 0) {
            viewedIds = [];
            availableChallenges = GEMBA_CHALLENGES;
        }

        // Pick a random challenge from the available pool
        const randomIndex = Math.floor(Math.random() * availableChallenges.length);
        const selected = availableChallenges[randomIndex];

        // Save progress to prevent repeats
        viewedIds.push(selected.id);
        localStorage.setItem('gembaos_viewed_challenges', JSON.stringify(viewedIds));

        setCurrentChallenge(selected);
    };

    const renderPhaseContent = () => {
        switch (phase) {
            case 'intro':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out', borderTop: '4px solid var(--accent-primary)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🚶</span> The Guided Gemba Walk
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            "Gemba" implies "the real place" where value is created. Standardize your floor walks to ensure you're looking for the right things and engaging effectively.
                        </p>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--accent-secondary)', margin: '0 0 1rem 0' }}>The Rules of Gemba</h4>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>Go see, ask why, show respect.</li>
                                <li>Focus on the <strong>process</strong>, not the people.</li>
                                <li>Do not fix problems immediately during the walk; observe and record.</li>
                                <li>Listen more than you speak.</li>
                            </ul>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => setPhase('observe')}>Start the Walk →</button>
                        </div>
                    </div>
                );
            case 'observe':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out', borderTop: '4px solid #f59e0b' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>👀</span> Step 1: Silent Observation
                        </h3>

                        {currentChallenge && (
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-warning)', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '2rem' }}>{currentChallenge.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-warning)', fontWeight: 'bold', letterSpacing: '1px' }}>Observation Target</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{currentChallenge.category}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={shuffleChallenge}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                                        title="Get a different observation challenge"
                                    >
                                        🔄 Shuffle
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                                    {currentChallenge.scenario}
                                </p>
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <strong style={{ color: 'var(--accent-success)', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Quantifiable Impact</strong>
                                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                        {currentChallenge.impact}
                                    </div>
                                </div>
                            </div>
                        )}

                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Stand in one spot for 5 minutes focusing on the target above. What is the process actually doing versus what it is supposed to be doing?
                        </p>
                        <textarea
                            className="input-field"
                            style={{ width: '100%', height: '120px', resize: 'vertical', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)' }}
                            placeholder="Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra-processing..."
                            value={wastesObserved}
                            onChange={(e) => setWastesObserved(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary" onClick={() => setPhase('intro')}>← Back</button>
                            <button className="btn btn-primary" onClick={() => setPhase('engage')}>Next Step →</button>
                        </div>
                    </div>
                );
            case 'engage':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out', borderTop: '4px solid var(--accent-secondary)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🤝</span> Step 2: Engage Operators
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            Ask open-ended questions to the people doing the work. Try asking: <strong style={{ color: '#fff' }}>"What is the biggest boulder blocking your process today?"</strong>
                        </p>
                        <textarea
                            className="input-field"
                            style={{ width: '100%', height: '120px', resize: 'vertical', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)' }}
                            placeholder="Document feedback here. What is frustrating the frontline?"
                            value={operatorFeedback}
                            onChange={(e) => setOperatorFeedback(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary" onClick={() => setPhase('observe')}>← Back</button>
                            <button className="btn btn-primary" onClick={() => setPhase('reflect')}>Next Step →</button>
                        </div>
                    </div>
                );
            case 'reflect':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out', borderTop: '4px solid var(--accent-success)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📝</span> Step 3: Reflection & Action
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            Based on your observations and conversations, what actions need to be taken? Pick 1-2 small things to fix immediately (JFI).
                        </p>
                        <textarea
                            className="input-field"
                            style={{ width: '100%', height: '120px', resize: 'vertical', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)' }}
                            placeholder="List immediate follow-ups. E.g., Move the trash can closer to station 3, order new labels for the bin..."
                            value={actionItems}
                            onChange={(e) => setActionItems(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary" onClick={() => setPhase('engage')}>← Back</button>
                            <button className="btn btn-primary" onClick={() => setPhase('summary')}>Finish Walk ✅</button>
                        </div>
                    </div>
                );
            case 'summary':
                return (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-out', border: '1px solid var(--accent-success)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--accent-success)' }}>Gemba Walk Complete</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Great job getting out of the office and onto the floor.
                            </p>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-main)', marginTop: 0 }}>Walk Summary</h4>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Wastes Observed:</div>
                                <div style={{ color: '#fff', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{wastesObserved || 'None recorded.'}</div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Operator Feedback:</div>
                                <div style={{ color: '#fff', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{operatorFeedback || 'None recorded.'}</div>
                            </div>

                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Action Items:</div>
                                <div style={{ color: 'var(--accent-secondary)', fontSize: '0.95rem', fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{actionItems || 'None recorded.'}</div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => {
                                setPhase('intro');
                                setWastesObserved('');
                                setOperatorFeedback('');
                                setActionItems('');
                            }}>
                                🔄 Start Another Walk
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
                        <h2 style={{ margin: 0 }}>Guided Gemba Walk</h2>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {['intro', 'observe', 'engage', 'reflect', 'summary'].map((s, i) => {
                        const steps = ['intro', 'observe', 'engage', 'reflect', 'summary'];
                        const currentIndex = steps.indexOf(phase);
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
                {renderPhaseContent()}

            </div>
        </div>
    );
}
