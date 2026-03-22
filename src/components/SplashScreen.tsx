import { useState, useEffect } from 'react';
import brandLogo from '../assets/branding/splash-crash-cart.jpg';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [stage, setStage] = useState<'init' | 'logo-in' | 'text' | 'enter' | 'fade-out' | 'done'>('init');
    const [bootStage, setBootStage] = useState<number>(0);

    useEffect(() => {
        // Stage 1: Logo Drops In
        const timer1 = setTimeout(() => {
            setStage('logo-in');
            setBootStage(1); 
        }, 100);
        
        // Stage 2: Logo settles, fade in system text
        const textTimer = setTimeout(() => {
            setStage('text');
            setBootStage(2); 
        }, 1200);

        // More boot stages
        const boot3Timer = setTimeout(() => setBootStage(3), 1800);

        // Stage 3: Reveal Enter Button
        const enterTimer = setTimeout(() => {
            setStage('enter');
            setBootStage(4); 
        }, 2200);

        return () => {
            clearTimeout(timer1);
            clearTimeout(textTimer);
            clearTimeout(boot3Timer);
            clearTimeout(enterTimer);
        };
    }, []);

    const handleEnter = () => {
        setStage('fade-out');
        setTimeout(() => {
            setStage('done');
            onComplete();
        }, 600);
    };

    if (stage === 'init' || stage === 'done') return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#ffffff', // Pure white
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stage === 'fade-out' ? 0 : 1,
            transition: 'opacity 0.6s ease-out',
            overflow: 'hidden' 
        }}>
            
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
                maxWidth: '900px',
                padding: '2rem',
                transform: 'translateY(-5vh)' // shift slightly up from dead center
            }}>
                
                {/* THE AUTHENTIC LOGO */}
                <div style={{
                    transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    opacity: (stage === 'logo-in' || stage === 'text' || stage === 'enter' || stage === 'fade-out') ? 1 : 0,
                    transform: (stage === 'logo-in' || stage === 'text' || stage === 'enter' || stage === 'fade-out') ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-40px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem' // space before text
                }}>
                    <img 
                        src={brandLogo} 
                        alt="GEMBA OS Tool Cart Logo" 
                        style={{ 
                            width: 'clamp(250px, 90vw, 550px)',
                            maxHeight: '55vh',
                            objectFit: 'contain',
                            mixBlendMode: 'multiply',
                            filter: 'brightness(1.1) contrast(1.3)'
                        }} 
                    />
                </div>

                {/* Typography Block */}
                <div style={{
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: (stage === 'text' || stage === 'enter' || stage === 'fade-out') ? 1 : 0,
                    transform: (stage === 'text' || stage === 'enter' || stage === 'fade-out') ? 'translateY(0)' : 'translateY(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    position: 'relative',
                    width: '100%'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(1.2rem, 3.5vw, 2.2rem)',
                        color: '#111111', 
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 900,
                        letterSpacing: '5px'
                    }}>
                        GEMBA OPERATING SYSTEM
                    </h1>
                    <div style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)', 
                        margin: '0.5rem 0',
                        width: '100%',
                    }} />
                    <p style={{
                        margin: 0,
                        fontSize: 'clamp(0.7rem, 1.5vw, 1rem)',
                        color: 'rgba(0, 0, 0, 0.6)', 
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        fontWeight: 700,
                        fontFamily: "'Orbitron', sans-serif"
                    }}>
                        Continuous Improvement Platform
                    </p>
                </div>

                {/* Entry Gateway (Button) */}
                <div style={{
                    transition: 'all 1s ease',
                    transitionDelay: '0.1s', // slightly staggered after text
                    opacity: stage === 'enter' ? 1 : 0,
                    transform: stage === 'enter' ? 'translateY(0)' : 'translateY(15px)',
                    marginTop: '2.5rem',
                    height: '70px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div 
                        style={{
                            position: 'relative',
                            display: 'inline-flex',
                            padding: '3px', 
                            background: '#111', 
                            borderRadius: '6px',
                            cursor: stage === 'enter' ? 'pointer' : 'default',
                            pointerEvents: stage === 'enter' ? 'auto' : 'none',
                        }}
                        onClick={handleEnter}
                    >
                        <div style={{
                            padding: '1.25rem 4rem',
                            background: '#ffc20e', 
                            borderRadius: '4px',
                            boxShadow: '0 4px 15px rgba(255, 194, 14, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                             e.currentTarget.style.background = '#ffcf3d'; 
                             e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 194, 14, 0.5)';
                             e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                             e.currentTarget.style.background = '#ffc20e';
                             e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 194, 14, 0.2)';
                             e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }}
                        >
                            <span style={{
                                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                                fontWeight: '900',
                                fontFamily: "'Orbitron', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '4px',
                                color: '#111111', 
                            }}>
                                GO TO THE GEMBA
                            </span>
                        </div>
                    </div>
                </div>

                {/* Boot Log Output */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.4rem',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    pointerEvents: 'none',
                    marginTop: '3rem', 
                    zIndex: 10
                }}>
                    <div style={{ color: '#64748b', transition: 'opacity 0.4s ease', opacity: bootStage >= 1 ? 0.8 : 0 }}>
                        Initializing GembaOS kernel...
                    </div>
                    <div style={{ color: '#64748b', transition: 'opacity 0.4s ease', opacity: bootStage >= 2 ? 0.8 : 0 }}>
                        Loading Observation Engine...
                    </div>
                    <div style={{ color: '#64748b', transition: 'opacity 0.4s ease', opacity: bootStage >= 3 ? 0.8 : 0 }}>
                        Mounting Improvement Framework...
                    </div>
                    <div style={{ color: '#10b981', transition: 'opacity 0.4s ease', opacity: bootStage >= 4 ? 1 : 0, fontWeight: 'bold', paddingTop: '0.5rem' }}>
                        System Ready
                    </div>
                </div>

            </div>
        </div>
    );
}
