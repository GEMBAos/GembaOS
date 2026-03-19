import React, { useState, useEffect } from 'react';

// The three stages of identifying layout/visual problems
interface MinigameStage {
    title: string;
    description: string;
    question: string;
    options: { text: string; correct: boolean; explanation: string }[];
    visualEffect: React.CSSProperties; // The CSS we apply to the wrapper to make it "messy"
}

const STAGES: MinigameStage[] = [
    {
        title: "Stage 1: The Bottleneck",
        description: "Welcome to the Gemba! Right now, this digital workspace is a mess. It's hard to read, content is overlapping, and data flow is blocked. \n\n🎯 INSTRUCTIONS: Read the options below and select the correct root cause to clear the waste.",
        question: "Why is the current layout a bottleneck for the user?",
        options: [
            { text: "Because the colors aren't pretty.", correct: false, explanation: "Aesthetics matter, but they don't stop the user from finding the 'Log In' button." },
            { text: "Because finding the main navigation requires searching through overlapping, blurred elements.", correct: true, explanation: "Exactly. Just like having to dig through a messy toolbox to find a wrench, 'search time' on a screen is pure waste. A user shouldn't have to hunt for the primary action." },
            { text: "Because there's not enough text on the screen.", correct: false, explanation: "Adding more text to a messy layout actually increases the bottleneck." }
        ],
        visualEffect: {
            filter: 'blur(3px) contrast(150%) saturate(50%)',
            transform: 'scale(1.05) rotate(-1deg)',
            opacity: 0.8,
            pointerEvents: 'none', // Block interaction with the app underneath
        }
    },
    {
        title: "Stage 2: Visual Management",
        description: "We've removed the blur, but everything is still visually chaotic and misaligned. \n\n🎯 INSTRUCTIONS: Select the correct impact below to restore alignment.",
        question: "How does this lack of 'Visual Management' impact daily work?",
        options: [
            { text: "It causes 'mental fatigue' as the brain has to process where things are every time.", correct: true, explanation: "Correct! If the layout changes or is unaligned, the brain wastes energy 're-learning' the screen. This is the digital equivalent of a factory floor where parts bins are moved to a different temporary spot every single shift." },
            { text: "It makes the website load slower on the server.", correct: false, explanation: "Visual alignment doesn't affect server speed, just human speed." },
            { text: "It requires buying a bigger monitor.", correct: false, explanation: "A bad layout is still bad on a 50-inch screen." }
        ],
        visualEffect: {
            filter: 'hue-rotate(90deg) brightness(80%)',
            transform: 'scale(0.95) skewX(-2deg)',
            opacity: 0.9,
            pointerEvents: 'none',
        }
    },
    {
        title: "Stage 3: 5S & Standardization",
        description: "The colors are back, but the proportions are completely wrong.\n\n🎯 INSTRUCTIONS: Identify the correct Lean countermeasure to finalize fixing this UI.",
        question: "How do we apply 5S to fix this final layout layer?",
        options: [
            { text: "Buy an entirely new software platform.", correct: false, explanation: "Replacing the tool doesn't fix the process. You'll just make a new mess." },
            { text: "Hide half the buttons so there are fewer things on screen.", correct: false, explanation: "Hiding necessary tools creates missing-tool waste." },
            { text: "Set elements to standardized grids (Set in Order) so everything has a home.", correct: true, explanation: "Boom. Just like taping out the floor so a pallet goes in the exact same spot every time (Set in order), locking UI elements to a grid ensures Standard Work." }
        ],
        visualEffect: {
            transform: 'perspective(1000px) rotateX(5deg) scale(0.9)',
            filter: 'grayscale(30%)',
            opacity: 0.95,
            pointerEvents: 'none',
        }
    }
];

export default function ResponsiveSimulator({ children }: { children: React.ReactNode }) {
    const [isTested, setIsTested] = useState(() => {
        // First check if it's explicitly being requested by the global action button
        if (sessionStorage.getItem('force_chaos_sim') === 'true') {
            sessionStorage.removeItem('force_chaos_sim');
            return false;
        }

        // Feature is now disabled from auto-triggering on splash screen / navigation.
        // Users must actively start it from the action button menu.
        return true;
    });

    const [currentStage, setCurrentStage] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Global reset exposed to dev
    useEffect(() => {
        const handleReset = () => {
            sessionStorage.setItem('force_chaos_sim', 'true');
            setIsTested(false);
            setCurrentStage(0);
            setSelectedOption(null);
            // We do NOT wipe the localStorage marker here so they keep their original "completion" status,
            // we just forcefully trigger the component to remount/show.
        };
        window.addEventListener('reset-responsive-simulator', handleReset);
        return () => window.removeEventListener('reset-responsive-simulator', handleReset);
    }, []);

    // Also listen for explicit manual triggers without tearing down local storage
    useEffect(() => {
        const handleForceTrigger = () => {
            setIsTested(false);
            setCurrentStage(0);
            setSelectedOption(null);
        };
        window.addEventListener('trigger-chaos-sim', handleForceTrigger);
        return () => window.removeEventListener('trigger-chaos-sim', handleForceTrigger);
    }, []);

    if (isTested) {
        return <>{children}</>;
    }

    const stageData = STAGES[currentStage];
    const isAnswered = selectedOption !== null;
    const isCorrect = isAnswered && stageData.options[selectedOption].correct;

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleNextStage = () => {
        if (currentStage < STAGES.length - 1) {
            setCurrentStage(currentStage + 1);
            setSelectedOption(null);
        } else {
            localStorage.setItem('kaizen_layout_tested', 'true');
            setIsTested(true);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
            {/* The Actual Application, rendered behind the chaos */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                ...stageData.visualEffect // Apply the messiness
            }}>
                {children}
            </div>

            {/* The Game Overlay / Dialogue Box */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)', // Dim the background to make modal pop
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999, // Ensure it sits over the app's top nav
                padding: '1rem'
            }}>
                <div className="animate-slide-up" style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '1rem',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Header */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h2 style={{ margin: 0, color: '#f97316', fontSize: '1.25rem', fontWeight: 900 }}>{stageData.title}</h2>
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold' }}>Phase {currentStage + 1} of 3</span>
                        </div>
                        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>{stageData.description}</p>
                    </div>

                    {/* Question Area */}
                    <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.1rem' }}>{stageData.question}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {stageData.options.map((option, idx) => {
                                const selected = selectedOption === idx;
                                let bg = 'rgba(15, 23, 42, 0.5)';
                                let border = '1px solid #334155';

                                if (isAnswered) {
                                    if (option.correct) {
                                        bg = 'rgba(16, 185, 129, 0.2)';
                                        border = '1px solid #10b981';
                                    } else if (selected) {
                                        bg = 'rgba(239, 68, 68, 0.2)';
                                        border = '1px solid #ef4444';
                                    }
                                } else if (selected) {
                                    border = '1px solid #38bdf8';
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => handleOptionSelect(idx)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '1rem',
                                            borderRadius: '0.5rem',
                                            backgroundColor: bg,
                                            border: border,
                                            color: '#f8fafc',
                                            cursor: isAnswered ? 'default' : 'pointer',
                                            transition: 'all 0.2s',
                                            fontSize: '0.95rem'
                                        }}
                                        onMouseOver={(e) => { if (!isAnswered) e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.6)'; }}
                                        onMouseOut={(e) => { if (!isAnswered) e.currentTarget.style.backgroundColor = bg; }}
                                    >
                                        {option.text}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation Area */}
                        {isAnswered && (
                            <div className="animate-slide-up" style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`
                            }}>
                                <strong style={{ color: isCorrect ? '#34d399' : '#fca5a5', display: 'block', marginBottom: '0.25rem' }}>
                                    {isCorrect ? 'Correct!' : 'Not Quite.'}
                                </strong>
                                <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                                    {stageData.options[selectedOption].explanation}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #334155', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleNextStage}
                            disabled={!isCorrect}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: isCorrect ? '#f97316' : '#334155',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: 'bold',
                                cursor: isCorrect ? 'pointer' : 'not-allowed',
                                opacity: isCorrect ? 1 : 0.5,
                                transition: 'all 0.3s'
                            }}
                        >
                            {currentStage === STAGES.length - 1 ? 'Unlock GembaOS' : 'Apply Fix & Continue ➔'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
