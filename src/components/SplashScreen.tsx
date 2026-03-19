import { useState, useEffect } from 'react';
import gembaosLogo from '../assets/branding/gembaos-logo.png';

interface SplashScreenProps {
    onComplete: () => void;
}

type SplashStage = 'init' | 'logo' | 'text' | 'enter' | 'done';

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [stage, setStage] = useState<SplashStage>('init');
    const [bootStage, setBootStage] = useState<number>(0);

    useEffect(() => {
        // Boot Stage 1 (Initial Kernel Load)
        const boot1Timer = setTimeout(() => setBootStage(1), 100);

        // Stage 1: Logo fades in (Duration ~1.5s)
        setStage('logo');
        
        // Boot Stage 2 (Observational Engine)
        const boot2Timer = setTimeout(() => setBootStage(2), 1000);

        // Stage 2: Reveal System Text (Duration ~1.5s)
        const textTimer = setTimeout(() => {
            setStage('text');
        }, 1500);

        // Boot Stage 3 (Improvement Framework)
        const boot3Timer = setTimeout(() => setBootStage(3), 2000);

        // Stage 3: Reveal Enter Button
        const enterTimer = setTimeout(() => {
            setStage('enter');
            setBootStage(4); // Boot Stage 4 (System Ready)
        }, 3000);

        return () => {
            clearTimeout(boot1Timer);
            clearTimeout(boot2Timer);
            clearTimeout(boot3Timer);
            clearTimeout(textTimer);
            clearTimeout(enterTimer);
        };
    }, [onComplete]);

    const handleEnter = () => {
        setStage('done');
        // Wait for fade out transition before notifying parent
        setTimeout(onComplete, 600);
    };

    if (stage === 'init') return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'opacity 0.6s ease-in-out',
            opacity: stage === 'done' ? 0 : 1,
            overflow: 'hidden'
        }}>
            {/* Pure Black Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#000000',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '3rem',
                padding: '2rem',
                width: '100%',
                maxWidth: '900px'
            }}>
                {/* Stage 1: Main Brand Logo / Title */}
                <div style={{
                    transition: 'all 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    opacity: (stage === 'logo' || stage === 'text' || stage === 'enter') ? 1 : 0,
                    transform: stage === 'logo' ? 'scale(0.92)' : 'scale(1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <img 
                        src={gembaosLogo} 
                        alt="GEMBA OS" 
                        style={{
                            maxWidth: '750px',
                            width: '90%',
                            height: 'auto',
                            filter: 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.9))'
                        }} 
                    />
                </div>

                {/* Stage 2: Full System Title Expansion */}
                <div style={{
                    transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0.2s',
                    opacity: (stage === 'text' || stage === 'enter') ? 1 : 0,
                    transform: (stage === 'text' || stage === 'enter') ? 'translateY(0)' : 'translateY(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    position: 'relative'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(1.2rem, 3.5vw, 2.2rem)',
                        color: '#f8fafc',
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 700,
                        letterSpacing: '5px',
                        textShadow: '0 4px 30px rgba(0,0,0,0.9)'
                    }}>
                        GEMBA OPERATING SYSTEM
                    </h1>
                    <div style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        margin: '0.5rem 0',
                        width: '100%',
                    }} />
                    <p style={{
                        margin: 0,
                        fontSize: 'clamp(0.7rem, 1.5vw, 1rem)',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        fontWeight: 500,
                        fontFamily: "'Orbitron', sans-serif"
                    }}>
                        Continuous Improvement Platform
                    </p>
                </div>

                {/* Stage 3: Entry Gateway */}
                <div style={{
                    transition: 'all 1.5s ease',
                    transitionDelay: '0.3s',
                    opacity: stage === 'enter' ? 1 : 0,
                    transform: stage === 'enter' ? 'translateY(0)' : 'translateY(15px)',
                    marginTop: '2rem',
                    height: '70px', // reserve strict space
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div 
                        className="cinematic-button-wrapper"
                        style={{
                            position: 'relative',
                            display: 'inline-flex',
                            padding: '1px',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                            borderRadius: '4px',
                            cursor: stage === 'enter' ? 'pointer' : 'default',
                            pointerEvents: stage === 'enter' ? 'auto' : 'none',
                        }}
                        onClick={handleEnter}
                    >
                        <div style={{
                            padding: '1rem 3.5rem',
                            background: 'rgba(10, 11, 14, 0.95)',
                            borderRadius: '3px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                             e.currentTarget.style.background = 'rgba(20, 22, 28, 0.95)';
                             e.currentTarget.style.boxShadow = 'inset 0 1px 10px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                             e.currentTarget.style.background = 'rgba(10, 11, 14, 0.95)';
                             e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.05)';
                        }}
                        >
                            <span style={{
                                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                                fontWeight: '600',
                                fontFamily: "'Orbitron', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '4px',
                                color: '#e2e8f0',
                                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                            }}>
                                ENTER THE OPERATING ROOM
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subtle System Boot Text Overlay */}
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
                    marginTop: '1rem',
                    zIndex: 10
                }}>
                    <div style={{ color: '#94a3b8', transition: 'opacity 0.4s ease', opacity: bootStage >= 1 ? 0.6 : 0 }}>
                        Initializing GembaOS kernel...
                    </div>
                    <div style={{ color: '#94a3b8', transition: 'opacity 0.4s ease', opacity: bootStage >= 2 ? 0.6 : 0 }}>
                        Loading Observation Engine...
                    </div>
                    <div style={{ color: '#94a3b8', transition: 'opacity 0.4s ease', opacity: bootStage >= 3 ? 0.6 : 0 }}>
                        Mounting Improvement Framework...
                    </div>
                    <div style={{ color: '#10b981', transition: 'opacity 0.4s ease', opacity: bootStage >= 4 ? 0.8 : 0, fontWeight: 'bold', paddingTop: '0.5rem' }}>
                        System Ready
                    </div>
                </div>
            </div>
        </div>
    );
}
