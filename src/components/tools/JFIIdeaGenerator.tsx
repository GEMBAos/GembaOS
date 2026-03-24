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
            gap: '1.25rem', 
            width: '100%', 
            maxWidth: '600px', 
            margin: '0 auto', 
            padding: '2rem',
            background: '#18181b', // Deep industrial dark
            borderRadius: '16px',
            borderTop: '4px solid var(--zone-yellow)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
            {/* Header */}
            <h2 style={{ 
                margin: 0, 
                color: 'var(--zone-yellow)', 
                fontSize: '1.5rem', 
                fontFamily: 'var(--font-headings)', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '2px',
                textAlign: 'center',
                filter: 'drop-shadow(0 2px 10px rgba(255,194,14,0.3))'
            }}>
                <span style={{ filter: 'grayscale(1)', color: '#fff' }}>⚙️</span> IDEA ENGINE
            </h2>
            
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0' }} />
            
            {/* Core Idea Input */}
            <div style={{ width: '100%', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-0.75rem', left: '0.5rem', fontSize: '0.5rem', color: 'var(--zone-yellow)', background: '#18181b', padding: '0 0.5rem', fontWeight: 900, letterSpacing: '1px' }}>
                    🔍 PROBLEM DESCRIPTION / DESIRED RESULT (OPTIONAL)
                </span>
                <input 
                    type="text" 
                    placeholder="Type what you observed, or what outcome you want..."
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    style={{ 
                        width: '100%', 
                        fontSize: '0.95rem', 
                        padding: '1rem', 
                        margin: 0, 
                        background: '#ffffff', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        color: '#111', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                />
            </div>

            {/* AI Action Buttons - Black and Yellow Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem', alignItems: 'stretch' }}>
                <button
                    onClick={handleGenerateRandom}
                    disabled={cooldownTime > 0}
                    style={{ 
                        padding: '1rem 0.5rem', 
                        display: 'flex',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.25rem', 
                        opacity: cooldownTime > 0 ? 0.5 : 1, 
                        cursor: cooldownTime > 0 ? 'not-allowed' : 'pointer', 
                        background: '#0a0a0a', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        color: '#fff', 
                        borderRadius: '8px', 
                        fontWeight: '900', 
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02)'
                    }}
                >
                    <span style={{ fontSize: '1.2rem', filter: 'grayscale(1)' }}>🎲</span>
                    <span style={{ textAlign: 'center' }}>RANDOM<br/>IDEA</span>
                </button>
                <label
                    style={{ 
                        padding: '1rem 0.5rem', 
                        display: 'flex',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.25rem', 
                        cursor: isAnalyzing ? 'not-allowed' : 'pointer', 
                        opacity: isAnalyzing ? 0.7 : 1, 
                        background: 'var(--zone-yellow)', 
                        border: 'none', 
                        color: '#000', 
                        borderRadius: '8px', 
                        fontWeight: '900', 
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 15px rgba(255,194,14,0.3), inset 0 2px 0 rgba(255,255,255,0.4)'
                    }}
                >
                    {isAnalyzing ? (
                         <span>SCANNING...</span>
                    ) : (
                        <>
                            <span style={{ fontSize: '1.5rem', color: '#000' }}>📷</span> 
                            <span style={{ textAlign: 'center' }}>PHOTO<br/>SCAN</span>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '0.75rem', marginTop: '-0.25rem' }}>
                <a
                    href="https://form.jotform.com/240536481745157"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                        padding: '0.75rem 0.5rem', 
                        display: 'flex',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.25rem', 
                        textDecoration: 'none', 
                        background: '#0a0a0a', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        color: '#fff', 
                        borderRadius: '8px', 
                        fontSize: '0.6rem', 
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02)'
                    }}
                >
                    <span style={{ fontSize: '1rem', filter: 'grayscale(1)' }}>📝</span>
                    <span style={{ textAlign: 'center' }}>JOTFORM</span>
                </a>
                <button
                    onClick={() => onNavigate && onNavigate('gemba-challenge')}
                    style={{ 
                        padding: '0.75rem 0.5rem', 
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.25rem', 
                        background: '#0a0a0a', 
                        border: '1px solid rgba(255,194,14,0.3)', 
                        color: 'var(--zone-yellow)', 
                        borderRadius: '8px', 
                        fontSize: '0.6rem', 
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02)'
                    }}
                >
                    <span style={{ fontSize: '1rem' }}>🎯</span>
                    <span style={{ textAlign: 'center' }}>QUIZZES</span>
                </button>
                <a
                    href="https://padlet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                        padding: '0.75rem 0.5rem', 
                        display: 'flex',
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.25rem', 
                        textDecoration: 'none', 
                        background: '#0a0a0a', 
                        border: '1px dashed #3b82f6', 
                        color: '#3b82f6', 
                        borderRadius: '8px', 
                        fontSize: '0.6rem', 
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02)'
                    }}
                >
                    <span style={{ fontSize: '1rem' }}>📺</span>
                    <span style={{ textAlign: 'center' }}>VIDEOS</span>
                </a>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px dashed rgba(255,194,14,0.3)', margin: '1rem 0 0 0' }} />
            
            {/* INSPIRATION ARCHIVE SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>INSPIRATION ARCHIVE</h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--zone-yellow)' }}>0/100</span>
            </div>
            
            <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,194,14,0.2)', borderLeft: '3px solid var(--zone-yellow)', borderRadius: '4px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--zone-yellow)', fontWeight: 900, textTransform: 'uppercase' }}>⭐ HIGHEST ROI ORGANIZATION</div>
                <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 900 }}>Trash Chute / Drop</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>An established hardware addition that removes the non-value added time of tying bags and throwing them out...</div>
            </div>



            {/* Loading State Overlay */}
            {isAnalyzing && (
                <div style={{ width: '100%', marginTop: '1rem', padding: '2rem', textAlign: 'center', background: 'var(--lean-white)', border: '1px dashed var(--zone-yellow)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
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
                    background: 'var(--lean-white)',
                    border: '1px solid var(--zone-yellow)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
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
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--gemba-black)', fontSize: '1.75rem', fontWeight: '900', fontFamily: 'var(--font-headings)', lineHeight: 1.1 }}>
                                {currentIdea.title}
                            </h4>
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
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
