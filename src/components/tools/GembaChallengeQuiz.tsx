import { useState } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { userService } from '../../services/userService';

const QUIZ_QUESTIONS = [
    {
        id: 1,
        scenario: 'An operator leaves their workstation every 10 minutes to grab a specialized wrench from the community toolbox 50 feet away.',
        options: ['Transportation', 'Motion', 'Waiting', 'Extra-Processing'],
        answer: 'Motion',
        explanation: 'Motion waste refers to unnecessary movement of people or equipment. Walking 50 feet back and forth for a frequently used tool is a classic example of excessive motion. The fix is point-of-use storage.',
        icon: '🚶'
    },
    {
        id: 2,
        scenario: 'The stamping press produces 1,000 door panels, but the assembly line only needs 100 panels today. The rest sit in the aisle.',
        options: ['Inventory', 'Defects', 'Overproduction', 'Non-utilized Talent'],
        answer: 'Overproduction',
        explanation: 'Overproduction is making more, earlier, or faster than the next process or customer requires. It hides other wastes and creates excess inventory.',
        icon: '🏭'
    },
    {
        id: 3,
        scenario: 'A forklift moves a pallet of raw materials from the receiving dock to a warehouse rack, and then later moves it from the rack to the production line.',
        options: ['Motion', 'Transportation', 'Overprocessing', 'Waiting'],
        answer: 'Transportation',
        explanation: 'Transportation waste is the unnecessary movement of products, materials, or information. Every time a pallet is touched or moved without being transformed, it adds cost and risk of damage, but no value.',
        icon: '🚚'
    },
    {
        id: 4,
        scenario: 'A highly skilled CNC machinist spends 2 hours every morning sweeping floors and taking out the trash because there is no janitorial standard.',
        options: ['Waiting', 'Extra-Processing', 'Non-utilized Talent', 'Defects'],
        answer: 'Non-utilized Talent',
        explanation: 'Non-utilized talent fails to use people\'s skills, creativity, or experience. While 5S is everyone\'s job, having highly paid specialists do basic routine tasks instead of value-add work is a waste of their capabilities.',
        icon: '🧠'
    },
    {
        id: 5,
        scenario: 'An assembly worker finishes their task in 30 seconds, but has to patiently stand there for 15 seconds watching the machine complete its cycle before they can unload the part.',
        options: ['Waiting', 'Motion', 'Inventory', 'Overproduction'],
        answer: 'Waiting',
        explanation: 'Waiting occurs when people or machines are idle. The operator is being paced by the machine, leading to lost productivity and frustration.',
        icon: '⏳'
    },
    {
        id: 6,
        scenario: 'A plastic molded part comes out with a sharp flashing edge. The operator uses a scraper to manually deburr the edge before passing it down the line.',
        options: ['Extra-Processing', 'Defects', 'Transportation', 'Motion'],
        answer: 'Defects',
        explanation: 'This is a defect requiring rework. While the scraping action looks like work (processing), it is actually rework caused by a defective molding process. Fixing the mold stops the waste.',
        icon: '❌'
    },
    {
        id: 7,
        scenario: 'To create a daily production report, a manager exports data from the ERP, reformats it manually in Excel, prints it, signs it, and scans it back into a PDF.',
        options: ['Defects', 'Overproduction', 'Extra-Processing', 'Inventory'],
        answer: 'Extra-Processing',
        explanation: 'Extra-processing (or over-processing) is doing more work or having tighter tolerances than required by the customer. Printing and scanning a digital document is a classic administrative waste.',
        icon: '🖨️'
    },
    {
        id: 8,
        scenario: 'Three weeks worth of finished goods are stacked to the ceiling in the shipping bay waiting for trucks that only arrive twice a week.',
        options: ['Inventory', 'Waiting', 'Transportation', 'Overproduction'],
        answer: 'Inventory',
        explanation: 'Inventory waste is excess products or materials not being actively processed. It ties up capital, takes up floor space, and hides underlying supply chain problems.',
        icon: '📦'
    }
];

export default function GembaChallengeQuiz({ onClose }: { onClose: () => void }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [xpAwarded, setXpAwarded] = useState(false);

    const question = QUIZ_QUESTIONS[currentQuestionIdx];

    const handleAnswer = (option: string) => {
        if (selectedAnswer !== null) return; // Prevent double clicking
        
        setSelectedAnswer(option);
        if (option === question.answer) {
            setIsCorrect(true);
            setScore(prev => prev + 1);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNext = async () => {
        if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            setQuizComplete(true);
            
            // Calculate XP based on score
            const xpEarned = score * 50; 
            
            if (xpEarned > 0) {
                try {
                    const userId = (await import('../../lib/supabase')).supabase.auth.getSession().then(({data}) => data?.session?.user?.id);
                    const id = await userId;
                    if (id) {
                        await userService.addXP(id, xpEarned);
                    } else {
                        // Guest mode
                        const currentTokens = parseInt(localStorage.getItem('gembaos_guest_tokens') || '0', 10);
                        localStorage.setItem('gembaos_guest_tokens', (currentTokens + xpEarned).toString());
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new Event('profileUpdated'));
                        }
                    }
                    setXpAwarded(true);
                } catch (e) {
                    console.error('Error awarding XP:', e);
                }
            }
        }
    };

    return (
        <HardwareConsoleLayout toolId="L-02 KNOWLEDGE" toolName="GEMBA CHALLENGE" onClose={onClose}>
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                
                <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-headings)', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Learning to See
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0 }}>
                        Identify the 8 Wastes of Lean (DOWNTIME) in real-world scenarios.
                    </p>
                </header>

                {!quizComplete ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Progress Bar */}
                        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1, height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${((currentQuestionIdx) / QUIZ_QUESTIONS.length) * 100}%`, background: 'var(--accent-primary)', transition: 'width 0.3s ease' }}></div>
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                                Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
                            </span>
                        </div>

                        {/* Scenario Card */}
                        <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1.5rem, 3vw, 3rem)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>{question.icon}</div>
                            <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', color: 'var(--text-panel)', lineHeight: 1.5, textAlign: 'center', margin: '0 0 2rem 0', fontWeight: 500 }}>
                                "{question.scenario}"
                            </h3>

                            {/* Options Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: 'auto' }}>
                                {question.options.map((opt, idx) => {
                                    let btnStyle: React.CSSProperties = {
                                        padding: '1.25rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        border: '2px solid var(--border-light)',
                                        background: 'transparent',
                                        color: 'var(--text-panel)',
                                        cursor: selectedAnswer === null ? 'pointer' : 'default',
                                        transition: 'all 0.2s',
                                        textAlign: 'center'
                                    };

                                    if (selectedAnswer !== null) {
                                        if (opt === question.answer) {
                                            btnStyle.background = 'rgba(16, 185, 129, 0.2)';
                                            btnStyle.borderColor = '#10b981';
                                            btnStyle.color = '#10b981';
                                            btnStyle.boxShadow = '0 0 15px rgba(16, 185, 129, 0.3)';
                                        } else if (opt === selectedAnswer) {
                                            btnStyle.background = 'rgba(239, 68, 68, 0.2)';
                                            btnStyle.borderColor = '#ef4444';
                                            btnStyle.color = '#ef4444';
                                        } else {
                                            btnStyle.opacity = 0.5;
                                        }
                                    }

                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => handleAnswer(opt)} 
                                            style={btnStyle}
                                            onMouseEnter={(e) => {
                                                if (selectedAnswer === null) {
                                                    e.currentTarget.style.background = 'var(--bg-panel-hover)';
                                                    e.currentTarget.style.borderColor = 'var(--zone-yellow)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedAnswer === null) {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.borderColor = 'var(--border-light)';
                                                }
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback Result */}
                            {selectedAnswer !== null && (
                                <div style={{ 
                                    marginTop: '2rem', 
                                    padding: '1.5rem', 
                                    borderRadius: '8px', 
                                    background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    border: `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                                    animation: 'fadeIn 0.3s ease-out'
                                }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: isCorrect ? '#10b981' : '#ef4444', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isCorrect ? '✅ Spot On!' : '❌ Not Quite.'}
                                    </h4>
                                    <p style={{ margin: 0, color: 'var(--text-panel)', lineHeight: 1.5 }}>
                                        {question.explanation}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                        <button 
                                            onClick={handleNext}
                                            className="btn btn-primary"
                                            style={{ padding: '0.75rem 2rem', fontWeight: 'bold' }}
                                        >
                                            {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Scenario ➔' : 'View Results ➔'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Quiz Complete Screen
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(2rem, 5vw, 4rem)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                            {score === QUIZ_QUESTIONS.length ? '👑' : score >= QUIZ_QUESTIONS.length / 2 ? '👍' : '📚'}
                        </div>
                        <h2 style={{ color: 'var(--lean-white)', fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-headings)' }}>
                            Challenge Complete!
                        </h2>
                        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            You successfully identified <strong style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>{score}</strong> out of {QUIZ_QUESTIONS.length} wastes.
                        </div>

                        <div style={{ 
                            background: 'rgba(56, 189, 248, 0.1)', 
                            border: '1px solid var(--zone-yellow)', 
                            padding: '1.5rem', 
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '3rem',
                            minWidth: '250px'
                        }}>
                            <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>XP Earned</span>
                            <span style={{ fontSize: '3rem', color: 'var(--zone-yellow)', fontWeight: 900, fontFamily: 'var(--font-headings)' }}>+{score * 50}</span>
                            {xpAwarded && <span style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.5rem' }}>✓ Added to Profile</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button onClick={() => { setCurrentQuestionIdx(0); setScore(0); setQuizComplete(false); setSelectedAnswer(null); setIsCorrect(null); setXpAwarded(false); }} className="btn" style={{ background: 'transparent', border: '2px solid var(--border-light)', color: 'var(--text-main)', padding: '1rem 2rem', fontWeight: 'bold' }}>
                                Retake Challenge
                            </button>
                            <button onClick={onClose} className="btn btn-primary" style={{ padding: '1rem 2rem', fontWeight: 'bold' }}>
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </HardwareConsoleLayout>
    );
}
