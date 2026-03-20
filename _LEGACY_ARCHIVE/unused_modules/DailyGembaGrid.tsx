/**
 * ARCHIVE NOTICE
 * Original Use: Used for daily challenge tracking.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import { GEMBA_CHALLENGES } from '../../data/gembaChallenges';
import { userService, type UserProfile } from '../../services/userService';

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

interface DailyGembaGridProps {
    profile: UserProfile;
    onProfileUpdate: () => void;
}

export default function DailyGembaGrid({ profile, onProfileUpdate }: DailyGembaGridProps) {
    const [gridTargets, setGridTargets] = useState<string[]>([]);
    const [completedIds, setCompletedIds] = useState<string[]>([]);
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
    const [hintUsed, setHintUsed] = useState(false);
    const [observationText, setObservationText] = useState('');

    useEffect(() => {
        const todayStr = getTodayDateStr();
        
        let savedDate = profile.daily_grid_date;
        let savedProgress = profile.daily_grid_progress || [];
        let savedTargets: string[] = [];

        try {
            const localTargets = localStorage.getItem(`gemba_grid_targets_${profile.id}_${todayStr}`);
            if (localTargets) {
                savedTargets = JSON.parse(localTargets);
            }
        } catch(e) {}

        if (savedDate !== todayStr || savedTargets.length !== 9) {
            // Generate new 3x3 Grid
            const shuffled = [...GEMBA_CHALLENGES].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 9).map(c => c.id);
            setGridTargets(selected);
            setCompletedIds([]);
            
            userService.updateProfile(profile.id, {
                daily_grid_date: todayStr,
                daily_grid_progress: []
            });
            localStorage.setItem(`gemba_grid_targets_${profile.id}_${todayStr}`, JSON.stringify(selected));
        } else {
            setGridTargets(savedTargets);
            setCompletedIds(savedProgress);
        }
    }, [profile]);

    const activeChallenge = GEMBA_CHALLENGES.find(c => c.id === activeChallengeId);

    const handleComplete = async () => {
        if (!activeChallengeId) return;

        let xpAward = hintUsed ? 20 : 40;
        const newProgress = [...completedIds, activeChallengeId];
        
        // If they just finished the 9th grid target
        if (newProgress.length === 9) {
            xpAward += 200; // Bonus +200 XP for full grid completion
        }

        // Add XP
        await userService.addXP(profile.id, xpAward);
        
        // Update Profile
        await userService.updateProfile(profile.id, {
            daily_grid_progress: newProgress
        });

        // Award badge for clean shot logic? E.g. 
        if (!hintUsed && !profile.badges?.includes('Clean Shot')) {
            await userService.awardBadge(profile.id, 'Clean Shot');
        }

        setCompletedIds(newProgress);
        setActiveChallengeId(null);
        setHintUsed(false);
        setObservationText('');
        onProfileUpdate(); // Refresh profile in parent
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(135deg, rgba(30,30,30,0.8), rgba(20,20,20,0.9))', border: '1px solid var(--accent-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-secondary)' }}>Today's Gemba Grid</h3>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: completedIds.length === 9 ? 'var(--accent-success)' : 'white' }}>
                    {completedIds.length} / 9
                </div>
            </div>

            {completedIds.length === 9 && (
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #10b981', textAlign: 'center', fontWeight: 'bold' }}>
                    🎉 Grid Complete! +200 XP Bonus Awarded
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {gridTargets.map(id => {
                    const challenge = GEMBA_CHALLENGES.find(c => c.id === id);
                    if (!challenge) return null;
                    const isDone = completedIds.includes(id);

                    return (
                        <button
                            key={id}
                            disabled={isDone || completedIds.length === 9}
                            onClick={() => {
                                setActiveChallengeId(id);
                                setHintUsed(false);
                                setObservationText('');
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '1.5rem',
                                background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-panel-hover)',
                                border: `1px solid ${isDone ? 'var(--accent-success)' : 'var(--border-color)'}`,
                                borderRadius: '0.75rem',
                                cursor: isDone ? 'default' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: isDone ? 0.6 : 1
                            }}
                        >
                            <span style={{ fontSize: '2rem', filter: isDone ? 'grayscale(1)' : 'none' }}>
                                {isDone ? '✅' : challenge.icon}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 'bold' }}>
                                {challenge.category}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Challenge Modal */}
            {activeChallenge && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '1.5rem'
                }}>
                    <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '500px', border: '2px solid var(--accent-primary)', position: 'relative' }}>
                        <button 
                            onClick={() => setActiveChallengeId(null)} 
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                        >✕</button>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '3rem' }}>{activeChallenge.icon}</span>
                            <div>
                                <h2 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.5rem' }}>{activeChallenge.category}</h2>
                                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Observation Task</p>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: 1.5 }}>
                            {activeChallenge.scenario}
                        </div>

                        {hintUsed ? (
                            <div style={{ background: 'rgba(14, 165, 233, 0.15)', borderLeft: '4px solid var(--accent-secondary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                                <strong style={{ color: 'var(--accent-secondary)', display: 'block', marginBottom: '0.5rem' }}>💡 Hint: What's the impact?</strong>
                                {activeChallenge.impact}
                            </div>
                        ) : (
                            <button 
                                onClick={() => setHintUsed(true)}
                                style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px dashed var(--accent-secondary)', color: 'var(--accent-secondary)', borderRadius: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Get Hint (Reduces XP to +20)
                            </button>
                        )}

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                Briefly describe your observation to earn XP:
                            </label>
                            <textarea
                                value={observationText}
                                onChange={(e) => setObservationText(e.target.value)}
                                placeholder="E.g., I noticed a trip hazard by the assembly line and moved it..."
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    background: 'var(--bg-panel-hover)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white',
                                    resize: 'vertical',
                                    fontFamily: 'var(--font-family)'
                                }}
                            />
                        </div>

                        <button 
                            onClick={handleComplete}
                            disabled={observationText.trim().length < 5}
                            className="btn btn-primary"
                            style={{ 
                                width: '100%', 
                                padding: '1rem', 
                                fontSize: '1.1rem', 
                                fontWeight: 900,
                                opacity: observationText.trim().length < 5 ? 0.5 : 1,
                                cursor: observationText.trim().length < 5 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Mark Complete (+{hintUsed ? 20 : 40} XP)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
