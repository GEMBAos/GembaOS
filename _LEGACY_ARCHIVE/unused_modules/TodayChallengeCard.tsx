/**
 * ARCHIVE NOTICE
 * Original Use: Used for daily challenges.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GEMBA_CHALLENGES } from '../../data/gembaChallenges';
import { userService, type UserProfile } from '../../services/userService';

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

type ChallengeStep = 'observe' | 'describe' | 'capture' | 'submit';

interface TodayChallengeCardProps {
    profile: UserProfile | null;
    onRequireAuth?: () => void;
    onProfileUpdate?: () => void;
}

export default function TodayChallengeCard({ profile, onRequireAuth, onProfileUpdate }: TodayChallengeCardProps) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState<ChallengeStep>('observe');
    const [bugDescription, setBugDescription] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [completionMessage, setCompletionMessage] = useState('');
    const [dailyPromptMessage, setDailyPromptMessage] = useState('');

    const FEEDBACK_MESSAGES = [
        "Nice catch!",
        "Great observation!",
        "Improvement spotted!",
        "Good eye!",
        "That's how improvement starts!",
        "Friction identified!",
        "Kaizen in action!"
    ];

    const DAILY_PROMPTS = [
        "Take a quick walk and see what bugs you.",
        "What's one thing that could work better today?",
        "Where is the friction hiding today?",
        "Go See. Notice Friction. Improve Something.",
        "Your next improvement is waiting out there."
    ];

    useEffect(() => {
        // Pick random messages on mount
        setCompletionMessage(FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)]);
        setDailyPromptMessage(DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)]);
    }, []);

    // Randomization Engine logic

    const getRandomUncompletedIndex = () => {
        const storageKey = profile ? `gembaos_completed_challenges_${profile.id}` : `gembaos_completed_challenges_guest`;
        const completedIdsStr = localStorage.getItem(storageKey) || "[]";
        let completedIds: string[] = [];
        try { completedIds = JSON.parse(completedIdsStr); } catch(e) {}

        if (completedIds.length >= GEMBA_CHALLENGES.length) {
            completedIds = [];
            localStorage.setItem(storageKey, "[]");
        }
        
        const availableIndices = [];
        for (let i = 0; i < GEMBA_CHALLENGES.length; i++) {
            if (!completedIds.includes(GEMBA_CHALLENGES[i].id)) {
                availableIndices.push(i);
            }
        }
        
        if (availableIndices.length === 0) return 0;
        return availableIndices[Math.floor(Math.random() * availableIndices.length)];
    };

    // Initialize with a randomly selected uncompleted challenge so it doesn't repeat on refresh
    useEffect(() => {
        setChallengeIndex(getRandomUncompletedIndex());
    }, [profile]);

    const challenge = GEMBA_CHALLENGES[challengeIndex];

    useEffect(() => {
        const todayStr = getTodayDateStr();
        const storageKey = profile ? `gembaos_daily_challenge_${profile.id}` : `gembaos_daily_challenge_guest`;
        const lastCompleted = localStorage.getItem(storageKey);
        
        if (lastCompleted === todayStr) {
            setIsCompleted(true);
        } else {
            setIsCompleted(false);
        }
    }, [profile]);

    const handleAnotherOne = () => {
        setIsCompleted(false);
        setCurrentStep('observe');
        setBugDescription('');
        setChallengeIndex(getRandomUncompletedIndex());
    };

    const handleNextStep = () => {
        if (currentStep === 'observe') setCurrentStep('describe');
        else if (currentStep === 'describe') setCurrentStep('capture');
    };

    const handleCapture = () => {
        setIsCapturing(true);
        // Simulate camera capture delay
        setTimeout(() => {
            setIsCapturing(false);
            setCurrentStep('submit');
        }, 1500);
    };

    const handleComplete = async () => {
        const todayStr = getTodayDateStr();
        const dailyStorageKey = profile ? `gembaos_daily_challenge_${profile.id}` : `gembaos_daily_challenge_guest`;
        
        // Mark today as having done a challenge
        localStorage.setItem(dailyStorageKey, todayStr);
        setIsCompleted(true);

        // Add to completed history to prevent repeats
        const historyKey = profile ? `gembaos_completed_challenges_${profile.id}` : `gembaos_completed_challenges_guest`;
        const completedIdsStr = localStorage.getItem(historyKey) || "[]";
        let completedIds: string[] = [];
        try { completedIds = JSON.parse(completedIdsStr); } catch(e) {}
        if (!completedIds.includes(challenge.id)) {
            completedIds.push(challenge.id);
            localStorage.setItem(historyKey, JSON.stringify(completedIds));
        }

        // Update streak logic (crude local tracking for guest or rely on backend for auth users)
        if (!profile) {
            const streakKey = 'gembaos_guest_streak';
            const lastActiveKey = 'gembaos_guest_last_active';
            const lastActive = localStorage.getItem(lastActiveKey);
            let currentStreak = parseInt(localStorage.getItem(streakKey) || '0', 10);
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastActive === yesterdayStr) {
                currentStreak++;
            } else if (lastActive !== todayStr) {
                currentStreak = 1; // Resets if more than 1 day passed
            }
            
            localStorage.setItem(streakKey, currentStreak.toString());
            localStorage.setItem(lastActiveKey, todayStr);
        }

        if (profile) {
            await userService.addXP(profile.id, challenge.xp);
            // Award a badge for completing a challenge
            await userService.awardBadge(profile.id, 'daily_warrior');
            if (onProfileUpdate) onProfileUpdate();
        } else {
            // For guests, track tentative XP
            const guestXp = parseInt(localStorage.getItem('kaizen_user_score') || '0', 10);
            localStorage.setItem('kaizen_user_score', (guestXp + challenge.xp).toString());
            window.dispatchEvent(new Event('kaizen_score_updated'));
            
            if (onRequireAuth) {
                // Delay to let them see success, then prompt signup explicitly
                setTimeout(() => {
                    onRequireAuth();
                }, 2500); // Wait a bit longer so they enjoy the confetti
            }
        }

        // Habit Loop: Visual Celebration
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#10b981', '#fbbf24', '#3b82f6'] // Green, Yellow, Blue (Lean colors)
        });
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            {/* True Industrial Card styling */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : '#1C1F24',
                border: isCompleted ? '2px solid #10b981' : '1px solid #475569',
                borderTop: isCompleted ? '4px solid #10b981' : '4px solid #2D7FF9',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
            }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {!isCompleted && currentStep === 'observe' && (
                            <span style={{ fontSize: '0.8rem', color: '#7FB4FF', fontStyle: 'italic' }}>
                                "{dailyPromptMessage}"
                            </span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem', color: isCompleted ? '#10b981' : '#7FB4FF' }}>❖</span>
                            <h4 style={{ 
                                margin: 0, 
                                fontSize: '1rem', 
                                color: '#C7CDD3', 
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: 'bold'
                            }}>
                                Today's Gemba Challenge
                            </h4>
                        </div>
                    </div>
                    {!isCompleted && currentStep === 'observe' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2D7FF9', boxShadow: '0 0 8px #2D7FF9' }} className="pulse-dot" />
                            <span style={{ fontSize: '0.8rem', color: '#7FB4FF', fontWeight: 'bold' }}>ACTIVE</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div>
                    <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', 
                        color: isCompleted ? '#34d399' : '#fff', 
                        fontWeight: '900',
                        lineHeight: '1.2'
                    }}>
                        {challenge.action}
                    </h3>
                    {currentStep === 'observe' && (
                        <p style={{ 
                            margin: 0, 
                            fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', 
                            color: '#A0AAB5',
                            lineHeight: '1.5'
                        }}>
                            {challenge.scenario}
                        </p>
                    )}
                </div>

                {/* Interactive Flow Steps */}
                {!isCompleted && currentStep === 'describe' && (
                    <div className="animate-slide-up">
                        <label style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Step 2: Describe What Bugs You
                        </label>
                        <textarea 
                            placeholder="E.g., I have to walk 20 extra feet to grab this tool every cycle..."
                            value={bugDescription}
                            onChange={(e) => setBugDescription(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)',
                                color: 'white', fontSize: '1rem', minHeight: '80px', resize: 'vertical'
                            }}
                        />
                    </div>
                )}

                {!isCompleted && currentStep === 'capture' && (
                    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-light)', borderRadius: '0.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Step 3: Capture the Friction
                        </label>
                        <button
                            onClick={handleCapture}
                            disabled={isCapturing}
                            style={{
                                padding: '1rem 2rem', borderRadius: '4px', border: '1px solid var(--accent-primary)',
                                background: 'rgba(45, 127, 249, 0.1)', color: 'var(--accent-primary)', fontSize: '1rem',
                                fontWeight: 'bold', cursor: isCapturing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center',
                                gap: '0.5rem', margin: '0 auto'
                            }}
                        >
                            {isCapturing ? 'Opening Camera...' : '📷 Photo of What Bugs You'}
                        </button>
                    </div>
                )}

                {/* Insight Pill */}
                {currentStep === 'observe' && (
                    <div style={{ 
                        marginTop: '0.5rem', 
                        fontSize: '0.85rem', 
                        color: '#C7CDD3', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '0.5rem 0.75rem', 
                        borderRadius: '4px',
                        borderLeft: '3px solid #7FB4FF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ color: '#2D7FF9' }}>ℹ</span> {challenge.insight}
                    </div>
                )}
            </div>

            {/* Action State Below the Frame */}
            <div style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}>
                {!isCompleted && <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Earn +{challenge.xp} Gemba Points</div>}
                {isCompleted ? (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', 
                        borderRadius: '0.5rem', border: '1px solid #10b981', fontWeight: 'bold',
                        animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: '#10b981' }}>{completionMessage}</div>
                        ✅ Challenge Complete! +{challenge.xp} Gemba Points Earned
                        
                        <button 
                            className="btn btn-primary" 
                            onClick={handleAnotherOne} 
                            style={{ 
                                marginTop: '1rem', width: '100%', padding: '0.5rem', 
                                fontSize: '0.9rem', background: '#10b981', color: 'white', 
                                border: 'none', borderRadius: '4px', cursor: 'pointer',
                                fontWeight: 'bold', textTransform: 'uppercase', transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                        >
                            Start Another Observation ↺
                        </button>
                        
                        {!profile && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'white', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>You are playing as a Guest.</span>
                                <button className="btn btn-secondary" onClick={onRequireAuth} style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem', border: '1px solid var(--accent-primary)', color: 'white' }}>
                                    Create Profile to Save Streak
                                </button>
                            </div>
                        )}
                        
                        <style>{`
                            @keyframes bounceIn {
                                0% { transform: scale(0.9); opacity: 0; }
                                50% { transform: scale(1.05); }
                                100% { transform: scale(1); opacity: 1; }
                            }
                        `}</style>
                    </div>
                ) : (
                    <>
                        {currentStep === 'observe' && (
                            <button 
                                onClick={handleNextStep}
                                style={{ 
                                    width: '100%', padding: '0.75rem', borderRadius: '4px',
                                    fontWeight: 'bold', fontSize: '1rem', background: '#2D7FF9', 
                                    color: '#fff', border: 'none', textTransform: 'uppercase', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center'
                                }}
                            >
                                Start Challenge <span style={{ fontSize: '1.2rem' }}>➔</span>
                            </button>
                        )}
                        {currentStep === 'describe' && (
                            <button 
                                onClick={handleNextStep}
                                style={{ 
                                    width: '100%', padding: '0.75rem', borderRadius: '4px',
                                    fontWeight: 'bold', fontSize: '1rem', background: '#2D7FF9', 
                                    color: '#fff', border: 'none', textTransform: 'uppercase', cursor: 'pointer'
                                }}
                            >
                                Continue
                            </button>
                        )}
                        {currentStep === 'submit' && (
                            <button 
                                onClick={handleComplete}
                                className="pulse-dot"
                                style={{ 
                                    width: '100%', padding: '0.75rem', borderRadius: '4px',
                                    fontWeight: 'bold', fontSize: '1rem', background: '#10b981', 
                                    color: '#fff', border: 'none', textTransform: 'uppercase', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center'
                                }}
                            >
                                Submit Improvement <span style={{ fontSize: '1.2rem' }}>✓</span>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
