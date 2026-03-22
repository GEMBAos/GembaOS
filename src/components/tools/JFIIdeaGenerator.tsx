import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { type JFIIdea, JFI_IDEAS } from '../../data/jfiIdeas';
import { userService } from '../../services/userService';
import { storageService } from '../../services/storageService';
import { jfiService } from '../../services/jfiService';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { Idea } from '../../types/improvement';
import { IdeaEngineService } from '../../services/IdeaEngineService';

interface JFIIdeaGeneratorProps {
    onIdeaGenerated: (idea: JFIIdea) => void;
    profile?: any;
    onRequireAuth?: () => void;
}

export default function JFIIdeaGenerator({ onIdeaGenerated, profile, onRequireAuth }: JFIIdeaGeneratorProps) {
    const [currentIdea, setCurrentIdea] = useState<JFIIdea | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [bugDescription, setBugDescription] = useState('');
    const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
    
    // Idea Carousel State
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselItems = JFI_IDEAS.slice(0, 10); // Take first 10 for carousel

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

    // Rotate Carousel
    useEffect(() => {
        if (!currentIdea && !isAnalyzing) {
            const int = setInterval(() => {
                setCarouselIndex(prev => (prev + 1) % carouselItems.length);
            }, 6000);
            return () => clearInterval(int);
        }
    }, [currentIdea, isAnalyzing, carouselItems.length]);

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
        <div className="gemba-panel" style={{ 
            padding: 'max(1.5rem, 3vw)', 
            width: '100%',
            position: 'relative',
        }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div className="panel-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                        <span style={{ marginRight: '0.75rem' }}>⚙️</span> 
                        IDEA <span style={{ color: 'var(--zone-yellow)' }}>ENGINE</span>
                    </div>
                </div>
                {!profile && onRequireAuth && (
                    <button onClick={onRequireAuth} className="shadow-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderColor: 'var(--accent-danger)', color: 'var(--accent-danger)' }}>LOG IN</button>
                )}
            </div>
            
            <div className="panel-rule" style={{ margin: '0 0 2rem 0' }}></div>

            {/* Core Idea Input */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--steel-gray)', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'var(--font-headings)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    🕵️‍♂️ PROBLEM DESCRIPTION / DESIRED RESULT (OPTIONAL)
                </label>
                <input 
                    type="text" 
                    className="gemba-input"
                    placeholder="Type what you observed, or what outcome you want..."
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}
                />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <button
                    onClick={handleGenerateRandom}
                    disabled={cooldownTime > 0}
                    className="shadow-btn"
                    style={{ flex: 1, minWidth: '200px', padding: '1.5rem', flexDirection: 'row', gap: '1rem', opacity: cooldownTime > 0 ? 0.5 : 1, cursor: cooldownTime > 0 ? 'not-allowed' : 'pointer' }}
                >
                    <span className="shadow-btn-icon" style={{ margin: 0 }}>🎲</span>
                    {cooldownTime > 0 ? `COOLDOWN: ${cooldownTime}m` : 'RANDOM IDEA'}
                </button>
                <label
                    className="shadow-btn shadow-btn-accent"
                    style={{ flex: 1, minWidth: '200px', padding: '1.5rem', flexDirection: 'row', gap: '1rem', cursor: isAnalyzing ? 'not-allowed' : 'pointer', opacity: isAnalyzing ? 0.7 : 1 }}
                >
                    {isAnalyzing ? (
                         <span style={{ color: '#000', fontWeight: 900, fontFamily: 'var(--font-headings)', letterSpacing: '1px' }}>SCANNING...</span>
                    ) : (
                        <>
                            <span className="shadow-btn-icon" style={{ margin: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>📷</span> 
                            <span style={{ fontWeight: 900, color: '#000' }}>PHOTO SCAN</span>
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

            {/* Loading State */}
            {isAnalyzing && (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#000', border: '2px dashed var(--zone-yellow)' }}>
                    {capturedPhotoUrl && (
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <img src={capturedPhotoUrl} alt="Analyzing Target" style={{ width: '120px', height: '120px', objectFit: 'cover', filter: 'grayscale(100%) contrast(120%)', border: '2px solid var(--zone-yellow)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
                        </div>
                    )}
                    <div className="spinner" style={{ width: '32px', height: '32px', border: '4px solid rgba(255,194,14,0.2)', borderTop: '4px solid var(--zone-yellow)', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', fontFamily: 'var(--font-headings)', color: 'var(--zone-yellow)', letterSpacing: '1.5px' }}>AI SCANNING WORKPLACE...</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--steel-gray)', fontWeight: 'bold' }}>EXTRACTING WASTE METRICS</p>
                    <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
                </div>
            )}

            {/* Result State (Enlarged Typography per request) */}
            {currentIdea && !isAnalyzing && (
                <div style={{
                    padding: 'max(2rem, 4vw)',
                    background: '#040404',
                    border: '2px solid var(--zone-yellow)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    animation: 'slideUpFade 0.5s ease forwards'
                }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {capturedPhotoUrl && (
                            <img src={capturedPhotoUrl} alt="Captured Friction" style={{ width: '140px', height: '140px', objectFit: 'cover', border: '2px solid var(--border-light)' }} />
                        )}
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <span style={{ display: 'inline-block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--zone-yellow)', marginBottom: '1rem', fontWeight: '900', fontFamily: 'var(--font-headings)' }}>
                                // {currentIdea.category}
                            </span>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--lean-white)', fontSize: '2.25rem', fontWeight: '900', fontFamily: 'var(--font-headings)', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                                {currentIdea.title}
                            </h4>
                            <p style={{ margin: '0 0 1rem 0', color: '#b0b0b0', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: '500' }}>
                                {currentIdea.description}
                            </p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderLeft: '6px solid var(--zone-yellow)', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                        <span style={{ fontSize: '1.75rem', color: '#000' }}>📉</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', textTransform: 'uppercase', fontWeight: '900', fontFamily: 'var(--font-headings)', letterSpacing: '2px', marginBottom: '0.5rem' }}>EXPECTED IMPACT</div>
                            <div style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: '600', lineHeight: 1.5 }}>{currentIdea.impact}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State / Idea Carousel */}
            {!isAnalyzing && (
                <div style={{ marginTop: '1rem', borderTop: '2px dashed var(--border-light)', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: 'var(--steel-gray)', fontSize: '0.85rem', fontWeight: '900', fontFamily: 'var(--font-headings)', letterSpacing: '2px' }}>
                            INSPIRATION ARCHIVE
                        </h3>
                        <span style={{ color: 'var(--zone-yellow)', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'var(--font-headings)' }}>
                            {(carouselIndex % carouselItems.length) + 1} / {carouselItems.length}
                        </span>
                    </div>

                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                        {carouselItems.map((item, idx) => {
                            const isActive = idx === carouselIndex;
                            return (
                                <div 
                                    key={item.id}
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%',
                                        padding: '1.5rem',
                                        background: '#040404',
                                        border: '1px solid var(--border-light)',
                                        opacity: isActive ? 1 : 0,
                                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                        pointerEvents: isActive ? 'auto' : 'none',
                                        zIndex: isActive ? 10 : 1
                                    }}
                                >
                                    <div style={{ fontSize: '0.65rem', color: 'var(--zone-yellow)', textTransform: 'uppercase', fontWeight: '900', fontFamily: 'var(--font-headings)', letterSpacing: '1px', marginBottom: '0.5rem' }}>{item.category}</div>
                                    <div style={{ fontSize: '1.25rem', color: 'var(--lean-white)', fontWeight: '900', fontFamily: 'var(--font-headings)', marginBottom: '0.5rem' }}>{item.title}</div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--steel-gray)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
