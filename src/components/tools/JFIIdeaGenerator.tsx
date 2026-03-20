import { useState } from 'react';
import confetti from 'canvas-confetti';
import { type JFIImpactLevel, getRandomJFI, type JFIIdea } from '../../data/jfiIdeas';
import { userService } from '../../services/userService';
import { storageService } from '../../services/storageService';
import { jfiService } from '../../services/jfiService';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { Idea } from '../../types/improvement';

interface JFIIdeaGeneratorProps {
    onIdeaGenerated: (idea: JFIIdea) => void;
    profile?: any;
    localScore?: number;
    onRequireAuth?: () => void;
    initialZone?: string;
}

// Simulated Rank Thresholds for UI (usually handled by backend)
const RANKS = [
    { name: 'White Belt', xp: 0 },
    { name: 'Yellow Belt', xp: 50 },
    { name: 'Orange Belt', xp: 150 },
    { name: 'Green Belt', xp: 300 },
    { name: 'Blue Belt', xp: 500 },
    { name: 'Brown Belt', xp: 800 },
    { name: 'Black Belt', xp: 1200 },
    { name: 'Master Black Belt', xp: 2000 },
];

export default function JFIIdeaGenerator({ onIdeaGenerated, profile, localScore = 0, onRequireAuth, initialZone }: JFIIdeaGeneratorProps) {
    const [selectedLevel, setSelectedLevel] = useState<JFIImpactLevel | 'Random'>('Random');
    const [currentIdea, setCurrentIdea] = useState<JFIIdea | null>(() => getRandomJFI('Random'));
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [location, setLocation] = useState(initialZone || '');
    const [bugDescription, setBugDescription] = useState('');
    const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
    
    // UI State for triggering animations
    const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);

    const levels: ('Random' | JFIImpactLevel)[] = ['Random', 'Quick Win', 'Moderate', 'Heavy Hitter'];

    // Calculate Progress
    const currentXP = profile ? profile.xp : localScore;
    let currentRankIndex = RANKS.findIndex(r => r.xp > currentXP) - 1;
    if (currentRankIndex < 0) currentRankIndex = 0; // Fallback
    if (currentRankIndex === RANKS.length - 1) currentRankIndex = RANKS.length - 2; // Maxed out logic

    const currentRankTitle = profile?.rank || RANKS[currentRankIndex].name;
    const nextRank = RANKS[currentRankIndex + 1];
    const previousRankXP = RANKS[currentRankIndex].xp;
    
    // Calculate percentage for progress bar
    const xpIntoCurrentLevel = currentXP - previousRankXP;
    const xpNeededForNextLevel = nextRank.xp - previousRankXP;
    const progressPercentage = Math.min(100, Math.max(0, (xpIntoCurrentLevel / xpNeededForNextLevel) * 100));

    const handleGenerateRandom = async () => {
        const idea = getRandomJFI(selectedLevel);
        setCurrentIdea(idea);
        setCapturedPhotoUrl(null);
        onIdeaGenerated(idea);
        
        // Track the submission to the database
        await jfiService.submitJfi(idea, location, null, profile?.id || null);

        // Track in centralized ImprovementEngine
        ImprovementEngine.createItem<Idea>({
            type: 'Idea',
            title: idea.title,
            description: idea.description,
            status: 'Approved',
            areaId: location || 'Unknown',
            owner: profile?.id || 'Unknown'
        });
        
        // Trigger pulse effect
        setShowLevelUpAnimation(true);
        setTimeout(() => setShowLevelUpAnimation(false), 1000);
    };

    const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setCurrentIdea(null);
        setCapturedPhotoUrl(URL.createObjectURL(file)); // Show immediate local preview

        try {
            // Upload to Supabase (or fallback locally if guest/error)
            const uploadedUrl = await storageService.uploadJFIPhoto(file);
            
            // Artificial delay to simulate AI parsing the image for waste (UX Choice)
            await new Promise(res => setTimeout(res, 1500));
            
            const idea = getRandomJFI(selectedLevel);
            
            // If the user typed a specific bug description, overwrite the AI title temporarily
            if (bugDescription.trim().length > 0) {
                idea.title = bugDescription.trim();
            }

            setCurrentIdea(idea);
            onIdeaGenerated(idea);
            
            // Track the submission
            await jfiService.submitJfi(idea, location, uploadedUrl, profile?.id || null);
            
            ImprovementEngine.createItem<Idea>({
                type: 'Idea',
                title: idea.title,
                description: idea.description,
                status: 'Approved',
                areaId: location || 'Unknown',
                owner: profile?.id || 'Unknown'
            });

            // Habit Loop: Visual Success Moment
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#ffffff']
            });

            // Habit Loop: Award a unique badge on their first photo capture
            if (profile) {
                await userService.awardBadge(profile.id, 'sharp_eyes');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="card" style={{ 
            padding: '2.5rem', 
            background: 'linear-gradient(180deg, rgba(16, 24, 39, 0.9) 0%, rgba(11, 13, 16, 0.95) 100%)', 
            borderRadius: '1.5rem', 
            border: '2px solid rgba(45, 127, 249, 0.2)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Glow */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100px', background: 'radial-gradient(ellipse at top, rgba(45, 127, 249, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Top Section: Rank & Progress UI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '2rem', fontWeight: '950', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px rgba(45, 127, 249, 0.4))' }}>⚙️</span> 
                            JFI System Engine
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Current Rank: {currentRankTitle}
                        </p>
                    </div>
                    
                    <div style={{ textAlign: 'right', minWidth: '150px' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: showLevelUpAnimation ? '#10b981' : 'var(--text-main)', transition: 'color 0.3s ease', display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '0.25rem' }}>
                            {currentXP} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Improvement Points</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                            {nextRank.xp - currentXP} Points to {nextRank.name}
                        </div>
                    </div>
                </div>

                {/* The Progress Bar */}
                <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        width: `${progressPercentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--accent-primary), #60a5fa)',
                        boxShadow: '0 0 20px rgba(45, 127, 249, 0.6)',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                    }}>
                        {/* Shimmer effect inside bar */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', animation: 'shimmer 2s infinite' }} />
                    </div>
                </div>

                {!profile && onRequireAuth && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px dashed rgba(239, 68, 68, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#fca5a5' }}>Points are saving locally. Log in to permanently sync your progress.</span>
                        <button onClick={onRequireAuth} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#ef4444', color: 'white' }}>Save Progress</button>
                    </div>
                )}
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0 0 2rem 0' }} />

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', alignSelf: 'center', marginRight: '0.5rem' }}>FILTER BY IMPACT:</span>
                {levels.map(level => (
                    <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '2rem',
                            border: `1px solid ${selectedLevel === level ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                            background: selectedLevel === level ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                            color: selectedLevel === level ? 'var(--accent-primary)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                            fontWeight: selectedLevel === level ? 'bold' : 'normal'
                        }}
                    >
                        {level === 'Random' ? '🎲 Any' : 
                         level === 'Quick Win' ? '⚡ 2-Second Lean' : 
                         level === 'Moderate' ? '🛠️ Moderate' : '🚀 Heavy Hitter'}
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        📍 Location / Machine
                    </label>
                    <input 
                        type="text" 
                        placeholder="E.g., Assembly Line 1, CNC Node 4..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)',
                            color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: 'bold'
                        }}
                    />
                </div>
                <div style={{ flex: '2 1 300px' }}>
                    <label style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        🕵️‍♂️ Describe What Bugs You (Optional)
                    </label>
                    <input 
                        type="text" 
                        placeholder="E.g., Walking across the cell to get a wrench every cycle..."
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)',
                        color: 'white', fontSize: '1rem'
                    }}
                />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                    onClick={handleGenerateRandom}
                    className="btn"
                    style={{ flex: 1, minWidth: '200px', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                >
                    🎲 Random
                </button>
                <label
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '200px', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'var(--accent-primary)', color: '#000', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(45, 127, 249, 0.3)', cursor: isAnalyzing ? 'not-allowed' : 'pointer', opacity: isAnalyzing ? 0.7 : 1 }}
                >
                    {isAnalyzing ? 'Scanning Environment...' : '📷 Photo of What Bugs You'}
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        onChange={handlePhotoCapture} 
                        disabled={isAnalyzing}
                        style={{ display: 'none' }} 
                    />
                </label>
            </div>

            {isAnalyzing && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-primary)' }}>
                    {capturedPhotoUrl && (
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <img src={capturedPhotoUrl} alt="Analyzing Target" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '1rem', border: '2px dashed var(--accent-primary)', opacity: 0.5 }} />
                        </div>
                    )}
                    <div className="pulse-dot" style={{ width: '2rem', height: '2rem', background: 'var(--accent-primary)', margin: '0 auto 1rem', borderRadius: '50%' }}></div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>GembaVision AI is scanning your workplace...</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Identifying 5S and motion waste opportunities.</p>
                </div>
            )}

            {currentIdea && !isAnalyzing && (
                <div className="animate-slide-up" style={{
                    padding: '2rem',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid var(--accent-success)',
                    borderRadius: '1rem',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(16, 185, 129, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ position: 'absolute', top: '-1rem', right: '2rem', background: 'var(--accent-success)', color: '#000', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '900', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚡</span> +5 Improvement Points Granted
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {capturedPhotoUrl && (
                            <img src={capturedPhotoUrl} alt="Captured Friction" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '1rem', border: '2px solid rgba(16, 185, 129, 0.3)' }} />
                        )}
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <span style={{ display: 'inline-block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-success)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                {currentIdea.impactLevel} • {currentIdea.category}
                            </span>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem', fontWeight: '900' }}>{currentIdea.title}</h4>
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>
                                {currentIdea.description}
                            </p>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', borderLeft: '3px solid #10b981' }}>
                        <span style={{ fontSize: '1.5rem', marginTop: '-0.2rem' }}>📈</span>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.25rem' }}>Expected Impact</div>
                            <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '500', lineHeight: 1.4 }}>{currentIdea.impact}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
