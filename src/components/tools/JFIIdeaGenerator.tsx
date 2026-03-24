import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { type JFIIdea } from '../../data/jfiIdeas';
import { userService } from '../../services/userService';
import { storageService } from '../../services/storageService';
import { jfiService } from '../../services/jfiService';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { Idea } from '../../types/improvement';
import type { UserProfile } from '../../services/userService';
import { IdeaEngineService } from '../../services/IdeaEngineService';

interface JFIIdeaGeneratorProps {
    onIdeaGenerated: (idea: JFIIdea) => void;
    profile?: UserProfile | null;
    onNavigate?: (route: string) => void;
}

export default function JFIIdeaGenerator({ onIdeaGenerated, profile, onNavigate }: JFIIdeaGeneratorProps) {
    const [currentIdea, setCurrentIdea] = useState<JFIIdea | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [bugDescription, setBugDescription] = useState('');
    const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
    
    // Cooldown State
    const [cooldownTime, setCooldownTime] = useState(0);

    // Initialize Cooldown from LocalStorage
    useEffect(() => {
        const storedSpins = localStorage.getItem('ideaEngine_spins');
        if (storedSpins) {
            const parsed = JSON.parse(storedSpins);
            if (parsed.timestamp) {
                const now = Date.now();
                const diff = now - parsed.timestamp;
                // If they spun 3 times and it's been less than 1 hour (3600000ms)
                if (parsed.count >= 3 && diff < 3600000) {
                    setCooldownTime(Math.ceil((3600000 - diff) / 60000)); // Minutes left
                } else if (diff >= 3600000) {
                    // Reset if over an hour
                    localStorage.removeItem('ideaEngine_spins');
                }
            }
        }
    }, []);

    const checkAndConsumeCooldown = (): boolean => {
        if (cooldownTime > 0) return false;
        
        let count = 0;
        const storedSpins = localStorage.getItem('ideaEngine_spins');
        if (storedSpins) {
            const parsed = JSON.parse(storedSpins);
            count = parsed.count;
            
            // If an hour passed, count should be reset. Double checking.
            if ((Date.now() - parsed.timestamp) >= 3600000) count = 0;
        }

        if (count >= 2) { // About to hit 3rd spin
            localStorage.setItem('ideaEngine_spins', JSON.stringify({ count: count + 1, timestamp: Date.now() }));
            setCooldownTime(60); // 1 hour
        } else {
            localStorage.setItem('ideaEngine_spins', JSON.stringify({ count: count + 1, timestamp: Date.now() }));
        }

        return true;
    };

    const handleGenerateRandom = async () => {
        if (!checkAndConsumeCooldown()) return;

        const idea = IdeaEngineService.getRandomIdea();
        setCurrentIdea(idea);
        setCapturedPhotoUrl(null);
        onIdeaGenerated(idea);
        
        // Track the submission to the database
        await jfiService.submitJfi(idea, 'Unknown', null, profile?.id || null);

        ImprovementEngine.createItem<Idea>({
            type: 'Idea',
            title: idea.title,
            description: idea.description,
            status: 'Approved',
            areaId: 'Unknown',
            owner: profile?.id || 'Unknown'
        });
    };

    const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setCurrentIdea(null);
        setCapturedPhotoUrl(URL.createObjectURL(file));

        try {
            // Upload to Supabase 
            const uploadedUrl = await storageService.uploadJFIPhoto(file);
            
            // Trigger semantic Vision AI engine (fallback to heuristic text until key is provided)
            const idea = await IdeaEngineService.analyzePhotoWithContext(file, bugDescription);
            
            setCurrentIdea(idea);
            onIdeaGenerated(idea);
            
            // Track the submission
            await jfiService.submitJfi(idea, 'Unknown', uploadedUrl, profile?.id || null);
            
            ImprovementEngine.createItem<Idea>({
                type: 'Idea',
                title: idea.title,
                description: idea.description,
                status: 'Approved',
                areaId: 'Unknown',
                owner: profile?.id || 'Unknown'
            });

            // Habit Loop: Visual Success Moment
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#ffffff']
            });

            if (profile) await userService.awardBadge(profile.id, 'sharp_eyes');
            
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '1.25rem', 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            padding: '1rem',
            background: 'transparent'
        }}>
            
            {/* Core Idea Input - Narrower and longer */}
            <div style={{ width: '100%', position: 'relative', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.7, fontSize: '1.2rem' }}>🕵️‍♂️</div>
                <input 
                    type="text" 
                    placeholder="Type what you observed, or what outcome you want..."
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    style={{ 
                        width: '100%', 
                        fontSize: '0.95rem', 
                        padding: '0.8rem 1rem 0.8rem 3rem', 
                        margin: 0, 
                        background: '#0a0a0a', 
                        border: '1px solid var(--border-light)', 
                        color: 'white', 
                        borderRadius: '30px',
                        boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.6)'
                    }}
                />
            </div>

            {/* AI Action Buttons - Centered */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={handleGenerateRandom}
                    disabled={cooldownTime > 0}
                    style={{ 
                        padding: '0.6rem 1.25rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        opacity: cooldownTime > 0 ? 0.5 : 1, 
                        cursor: cooldownTime > 0 ? 'not-allowed' : 'pointer', 
                        background: 'linear-gradient(145deg, #1f1f1f, #0a0a0a)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-main)', 
                        borderRadius: '20px', 
                        fontWeight: '800', 
                        fontSize: '0.7rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                        letterSpacing: '0.5px'
                    }}
                    title={cooldownTime > 0 ? `COOLDOWN: ${cooldownTime}m` : 'Generate Random Idea'}
                >
                    <span style={{ fontSize: '1rem' }}>🎲</span>
                    <span>GENERATE RANDOM IDEA</span>
                </button>
                <label
                    style={{ 
                        padding: '0.6rem 1.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        cursor: isAnalyzing ? 'not-allowed' : 'pointer', 
                        opacity: isAnalyzing ? 0.7 : 1, 
                        background: 'linear-gradient(145deg, var(--zone-yellow), #d4a000)', 
                        border: '1px solid #b8860b', 
                        color: '#000', 
                        borderRadius: '20px', 
                        fontWeight: '900', 
                        fontSize: '0.75rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
                    }}
                    title="Scans environment"
                >
                    {isAnalyzing ? (
                         <span>SCANNING...</span>
                    ) : (
                        <>
                            <span style={{ fontSize: '1.1rem' }}>📷</span> 
                            <span>PHOTO</span>
                        </>
                    )}
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

        {/* Explicit Form & Video Links - Separate Line */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => onNavigate && onNavigate('gemba-challenge')}
                    style={{ 
                        padding: '0.4rem 1rem', 
                        cursor: 'pointer',
                        background: 'rgba(255,194,14,0.1)', 
                        border: '1px solid var(--zone-yellow)', 
                        color: 'var(--zone-yellow)', 
                        borderRadius: '20px', 
                        fontSize: '0.65rem', 
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(255,194,14,0.2)'
                    }}
                >
                    <span style={{ fontSize: '1rem' }}>🎯</span> PRACTICAL QUIZZES
                </button>
                <a
                    href="https://form.jotform.com/240536481745157"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                        padding: '0.4rem 1rem', 
                        textDecoration: 'none', 
                        background: 'transparent', 
                        border: '1px dashed var(--steel-gray)', 
                        color: 'var(--steel-gray)', 
                        borderRadius: '20px', 
                        fontSize: '0.65rem', 
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        textTransform: 'uppercase'
                    }}
                >
                    <span style={{ fontSize: '0.8rem', filter: 'grayscale(1)' }}>📝</span> JFI Just Fix It Submissions for Lippert
                </a>
                <a
                    href="https://padlet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                        padding: '0.4rem 1rem', 
                        textDecoration: 'none', 
                        background: 'transparent', 
                        border: '1px dashed #3b82f6', 
                        color: '#3b82f6', 
                        borderRadius: '20px', 
                        fontSize: '0.65rem', 
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        textTransform: 'uppercase'
                    }}
                >
                    <span style={{ fontSize: '0.8rem' }}>📺</span> Their Videos from Lippert
                </a>
            </div>

            {/* Loading State Overlay */}
            {isAnalyzing && (
                <div style={{ width: '100%', marginTop: '1rem', padding: '2rem', textAlign: 'center', background: '#0a0a0a', border: '1px dashed var(--zone-yellow)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
                    {capturedPhotoUrl && (
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <img src={capturedPhotoUrl} alt="Analyzing Target" style={{ width: '120px', height: '120px', objectFit: 'cover', filter: 'grayscale(100%) contrast(120%)', border: '2px solid var(--zone-yellow)', borderRadius: '8px' }} />
                        </div>
                    )}
                    <div className="spinner" style={{ width: '32px', height: '32px', border: '4px solid rgba(255,194,14,0.2)', borderTop: '4px solid var(--zone-yellow)', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: '900', fontFamily: 'var(--font-headings)', color: 'var(--zone-yellow)' }}>AI SCANNING WORKPLACE...</p>
                    <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
                </div>
            )}

            {/* Result State Block */}
            {currentIdea && !isAnalyzing && (
                <div style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '2rem',
                    background: '#040404',
                    border: '1px solid var(--zone-yellow)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    animation: 'slideDownFade 0.4s ease forwards'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {capturedPhotoUrl && (
                            <img src={capturedPhotoUrl} alt="Captured Friction" style={{ width: '140px', height: '140px', objectFit: 'cover', border: '2px solid var(--border-light)', borderRadius: '8px' }} />
                        )}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--lean-white)', fontSize: '1.75rem', fontWeight: '900', fontFamily: 'var(--font-headings)', lineHeight: 1.1 }}>
                                {currentIdea.title}
                            </h4>
                            <p style={{ margin: '0 0 1rem 0', color: '#b0b0b0', fontSize: '1rem', lineHeight: 1.6 }}>
                                {currentIdea.description}
                            </p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', padding: '1rem 1.5rem', borderLeft: '4px solid var(--zone-yellow)', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '4px' }}>
                        <span style={{ fontSize: '1.5rem', color: '#000' }}>📉</span>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--gemba-black)', fontWeight: '900', letterSpacing: '1px' }}>EXPECTED IMPACT</div>
                            <div style={{ fontSize: '1rem', color: 'var(--gemba-black)', fontWeight: '700' }}>{currentIdea.impact}</div>
                        </div>
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideDownFade {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
