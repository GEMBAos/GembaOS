import { useState } from 'react';
import JFIIdeaGenerator from './tools/JFIIdeaGenerator';
import KaizenSessionCreator from './tools/kaizen/KaizenSessionCreator';

interface OperatingRoomProps {
    onNavigate: (view: any) => void;
}

export default function OperatingRoom({ onNavigate }: OperatingRoomProps) {
    type ViewState = 'main' | 'create' | 'join';
    const [view, setView] = useState<ViewState>('main');

    if (view === 'create') {
        return (
            <KaizenSessionCreator 
                onBack={() => setView('main')} 
                onSessionCreated={(id) => {
                    window.location.hash = `/kaizen-hub?session=${id}`;
                    onNavigate('kaizen-hub');
                }} 
            />
        );
    }

    return (
        <div className="or-master-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            fontFamily: 'var(--font-family)',
            color: 'var(--text-main)',
            background: 'var(--bg-dark)'
        }}>

            <style dangerouslySetInnerHTML={{__html: `
                .or-master-container {
                    /* Container locks */
                    overflow: hidden;
                }
                .or-grid-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: clamp(0.5rem, 1vw, 2.5rem);
                    gap: clamp(0.5rem, 2vh, 4rem);
                    overflow: hidden;
                    min-height: 0;
                }
                .or-grid-inner {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    width: 100%;
                    height: 100%;
                    justify-content: center;
                    align-items: center;
                    gap: clamp(0.5rem, 3vw, 2rem);
                    min-height: 0;
                    overflow: hidden;
                }
                .or-left-pane {
                    flex: 1 1 250px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    max-width: 600px;
                    height: auto;
                    max-height: 100%;
                    min-height: 0;
                    overflow: hidden;
                }
                .or-right-pane {
                    flex: 1 1 250px;
                    max-width: 400px;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-panel);
                    border-radius: 4px;
                    border: 1px solid #000;
                    padding: clamp(0.5rem, 3vh, 2rem);
                    box-shadow: inset 0 8px 16px rgba(0,0,0,0.5);
                    min-height: 0;
                    overflow: hidden;
                }
                
                .or-title {
                    color: var(--text-main);
                    font-size: clamp(1rem, 4vh, 2.5rem);
                    margin-bottom: 0.25rem;
                    text-align: center;
                    font-weight: 800;
                    font-family: var(--font-headings);
                }
                .or-subtitle {
                    color: var(--text-muted);
                    font-size: clamp(0.75rem, 2vh, 1rem);
                    margin-bottom: clamp(0.5rem, 3vh, 3rem);
                    text-align: center;
                    font-weight: 400;
                }
                
                .or-btn-primary {
                    width: 100%;
                    padding: clamp(0.5rem, 2vh, 1.5rem) clamp(1rem, 2vw, 2rem);
                    font-size: clamp(1rem, 3vh, 1.75rem);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    border-radius: 4px;
                    border: 2px solid #000;
                }
                .or-btn-secondary {
                    width: 100%;
                    padding: clamp(0.5rem, 2vh, 1.5rem) clamp(1rem, 2vw, 2rem);
                    font-size: clamp(0.85rem, 2.5vh, 1.25rem);
                    border-radius: 4px;
                    background: var(--bg-panel);
                    color: var(--text-main);
                    border: 2px solid var(--border-light);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    font-weight: 700;
                    font-family: var(--font-headings);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    transition: all 0.15s ease-in-out;
                }
                .or-btn-secondary:hover {
                    background: var(--bg-panel-hover);
                    border-color: var(--tape-yellow);
                }
                
                .or-jfi-title {
                    font-size: clamp(0.6rem, 1.5vh, 0.85rem);
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: clamp(0.5rem, 2vh, 2.5rem);
                }
                
                .or-jfi-btn {
                    padding: clamp(0.5rem, 1.5vh, 1.25rem);
                    background: var(--bg-dark);
                    border: 2px dashed var(--border-light);
                    color: var(--text-main);
                    border-radius: 4px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 1rem;
                    font-size: clamp(0.75rem, 2vh, 1rem);
                }
                .or-jfi-btn:hover {
                    background: var(--bg-panel-hover);
                    border-color: var(--accent-primary);
                }
                .or-jfi-icon {
                    font-size: clamp(1rem, 3vh, 1.5rem);
                }

                @media (max-height: 500px) and (orientation: landscape) {
                    /* Extreme squash rules for landscape mobile */
                    .or-grid-inner {
                        flex-wrap: nowrap;
                    }
                    .or-left-pane {
                        flex: 2;
                    }
                    .or-right-pane {
                        flex: 1;
                        padding: 0.5rem;
                        gap: 0.25rem;
                    }
                    .or-jfi-btn {
                        padding: 0.5rem;
                        gap: 0.5rem;
                    }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
            `}} />

            {/* Main Content: Left Toolbar & Center Void */}
            <div className="gemba-floor" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', height: '100%', width: '100%', flex: 1 }}>
                
                {view === 'main' && (
                    <>
                        {/* 1. Left Lateral Toolbar */}
                        <div className="lateral-sidebar" style={{
                            width: 'clamp(60px, 12vw, 100px)',
                            backgroundColor: '#0a0a0a',
                            borderRight: '1px solid #333',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: 'clamp(1rem, 2vh, 2rem) 0',
                            gap: 'clamp(0.8rem, 2vh, 1.5rem)',
                            overflowY: 'auto',
                            boxShadow: '4px 0 15px rgba(0,0,0,0.8)',
                            flexShrink: 0,
                            zIndex: 20,
                            transition: 'width 0.3s ease'
                        }}>
                            {[
                                { id: 'motion', name: 'MOTION', icon: '🏃‍♂️', action: () => onNavigate('motion-v2') },
                                { id: 'time', name: 'TIME', icon: '⏱️', action: () => onNavigate('time-study') },
                                { id: 'waste', name: 'WASTE', icon: '🗑️', action: () => onNavigate('process-check') },
                                { id: '5s', name: '5S SCAN', icon: '🔳', action: () => onNavigate('value-scanner') },
                                { id: 'lsubmit', name: 'SUBMIT', icon: '📋', action: () => onNavigate('action-items') },
                                { id: 'lvideos', name: 'VIDEOS', icon: '🎬', action: () => onNavigate('video-hub') },
                                { id: 'learning', name: 'LEARN', icon: '🎓', action: () => onNavigate('lean-academy') },
                            ].map(tool => (
                                <button 
                                    key={tool.id} 
                                    onClick={tool.action}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        width: '100%'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.25)';
                                        const label = e.currentTarget.querySelector('.tool-label') as HTMLElement;
                                        if(label) {
                                            label.style.opacity = '1';
                                            label.style.color = '#ffc20e';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        const label = e.currentTarget.querySelector('.tool-label') as HTMLElement;
                                        if(label) {
                                            label.style.opacity = '0.7';
                                            label.style.color = '#aaa';
                                        }
                                    }}
                                    title={tool.name}
                                >
                                    <div style={{
                                        width: 'clamp(40px, 8vw, 56px)',
                                        height: 'clamp(40px, 8vw, 56px)',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(145deg, #2a2a2a, #111111)',
                                        boxShadow: '4px 4px 8px #050505, -4px -4px 8px #2b2b2b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
                                        border: '1px solid #333'
                                    }}>
                                        <span style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}>{tool.icon}</span>
                                    </div>
                                    <span className="tool-label" style={{
                                        color: '#aaa',
                                        fontSize: 'clamp(0.45rem, 1vw, 0.6rem)',
                                        fontWeight: 800,
                                        fontFamily: "'Orbitron', sans-serif",
                                        textAlign: 'center',
                                        letterSpacing: '0.5px',
                                        opacity: 0.7,
                                        transition: 'all 0.2s'
                                    }}>
                                        {tool.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* 2. Main Content Void */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                            
                            {/* Center Canvas (Idea Generator) */}
                            <div style={{ flex: 1, padding: '2rem clamp(1rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                                <div style={{ width: '100%', maxWidth: '1000px', marginTop: '1rem' }}>
                                    {/* Inline JFIIdeaGenerator */}
                                    <JFIIdeaGenerator 
                                        onIdeaGenerated={() => {}}
                                        profile={null}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
