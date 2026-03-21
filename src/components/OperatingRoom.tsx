import { useState } from 'react';
import JFIIdeaGenerator from './tools/JFIIdeaGenerator';
import KaizenSessionCreator from './tools/kaizen/KaizenSessionCreator';

interface OperatingRoomProps {
    onNavigate: (view: any) => void;
}

export default function OperatingRoom({ onNavigate }: OperatingRoomProps) {
    type ViewState = 'main' | 'create' | 'join';
    const [view, setView] = useState<ViewState>('main');
    const [showJFI, setShowJFI] = useState(false);

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
            `}} />

            {/* Main Content: Single Pane of Glass Layout */}
            <div className="or-grid-wrapper gemba-floor" style={{ padding: '1rem', overflowY: 'auto' }}>
                
                {view === 'main' && (
                    <div className="floor-zone-box" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '6rem' }}>
                        
                        {/* PANEL 1: IMPROVEMENT IDEA GENERATOR */}
                        <div className="gemba-panel zone-marker zone-marker-tl">
                            <div className="panel-title">
                                IMPROVEMENT IDEAS
                                <span className="panel-title-accent" style={{ fontSize: '0.5em', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>GENERATE</span>
                            </div>
                            <div className="panel-subtitle">LOCATION / MACHINE & ISSUE DESCRIPTION</div>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: '1 1 250px' }}>
                                    <input type="text" className="gemba-input" placeholder="Type or Scan Location Code" />
                                </div>
                                <div style={{ flex: '2 1 300px' }}>
                                    <input type="text" className="gemba-input" placeholder="Describe Waste or Issue..." />
                                </div>
                            </div>
                            
                            <button className="shadow-btn shadow-btn-accent" onClick={() => setShowJFI(true)} style={{ width: '100%', flexDirection: 'row', gap: '1rem', padding: '1.25rem' }}>
                                <span className="shadow-btn-icon" style={{ margin: 0 }}>🎲</span> RANDOM SUGGESTION
                            </button>
                            <div className="caster-wheel caster-wheel-left"></div>
                            <div className="caster-wheel caster-wheel-right"></div>
                        </div>

                        {/* PANEL 2: KAIZEN */}
                        <div className="gemba-panel zone-marker zone-marker-br">
                            <div className="panel-title">KAIZEN <span style={{ color: 'var(--zone-yellow)', marginLeft: '0.5rem' }}>BOARD</span></div>
                            <div className="panel-subtitle">ANALYZE PROCESSES AND ELIMINATE WASTE</div>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <button className="shadow-btn" onClick={() => onNavigate('motion-v2')} style={{ flex: '1 1 140px' }}>
                                    <span className="shadow-btn-icon">👣</span> MOTION MAP
                                </button>
                                <button className="shadow-btn" onClick={() => onNavigate('process-check')} style={{ flex: '1 1 140px' }}>
                                    <span className="shadow-btn-icon">🗑️</span> WASTE
                                </button>
                                <button className="shadow-btn" onClick={() => setShowJFI(true)} style={{ flex: '1 1 140px' }}>
                                    <span className="shadow-btn-icon">💡</span> IDEAS
                                </button>
                                <div className="shadow-btn" style={{ flex: '1 1 140px', opacity: 0.5, cursor: 'not-allowed' }}>
                                    <span className="shadow-btn-icon">📋</span> A3 REPORT
                                </div>
                            </div>
                            <div className="panel-rule"></div>
                            <div style={{ textAlign: 'center', fontFamily: 'var(--font-headings)', fontWeight: 900, fontSize: '0.9rem', color: 'var(--steel-gray)', letterSpacing: '4px' }}>STANDARDIZE. IMPROVE. REPEAT.</div>
                            <div className="caster-wheel caster-wheel-left"></div>
                            <div className="caster-wheel caster-wheel-right"></div>
                        </div>

                        {/* PANEL 3: TOOL BAG */}
                        <div className="gemba-panel zone-marker zone-marker-tl">
                            <div className="panel-title">TOOL BAG</div>
                            <div className="panel-subtitle">CORE WORKSPACE UTILITIES</div>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <button className="shadow-btn" onClick={() => onNavigate('time-study')} style={{ flex: '1 1 140px' }}>
                                    <span className="shadow-btn-icon">⏱️</span> STOPWATCH
                                </button>
                                <button className="shadow-btn" onClick={() => onNavigate('value-scanner')} style={{ flex: '1 1 140px' }}>
                                    <span className="shadow-btn-icon">🔳</span> 5S SCAN
                                </button>
                                <div className="shadow-btn" style={{ flex: '1 1 140px', opacity: 0.5, cursor: 'not-allowed' }}>
                                    <span className="shadow-btn-icon">🧾</span> AUDIT
                                </div>
                                <div className="shadow-btn" style={{ flex: '1 1 140px', opacity: 0.5, cursor: 'not-allowed' }}>
                                    <span className="shadow-btn-icon">📄</span> STANDARD WORK
                                </div>
                            </div>
                            <div className="caster-wheel caster-wheel-left"></div>
                            <div className="caster-wheel caster-wheel-right"></div>
                        </div>

                        {/* PANEL 4: LEARNING TO SEE */}
                        <div className="gemba-panel zone-marker zone-marker-br">
                            <div className="panel-title">LEARNING TO SEE</div>
                            <div className="panel-subtitle">TRAINING AND BEST PRACTICES</div>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <button className="shadow-btn" style={{ flex: '1 1 140px' }}>
                                    <span className="shadow-btn-icon" style={{ color: 'var(--zone-yellow)' }}>👷</span> SAFETY
                                </button>
                                <button className="shadow-btn" style={{ flex: '1 1 140px' }}>
                                    <span className="shadow-btn-icon">🔧</span> LEAN TOOLS
                                </button>
                                <a href="https://padlet.com" target="_blank" rel="noreferrer" className="shadow-btn" style={{ flex: '1 1 140px', textDecoration: 'none' }}>
                                    <span className="shadow-btn-icon">▶️</span> VIDEOS
                                </a>
                                <a href="https://form.jotform.com/233406028319149" target="_blank" rel="noreferrer" className="shadow-btn shadow-btn-accent" style={{ flex: '1 1 140px', textDecoration: 'none' }}>
                                    <span className="shadow-btn-icon" style={{ margin: 0 }}>📝</span> JFI FORM
                                </a>
                            </div>
                            <div className="panel-rule"></div>
                            <div style={{ textAlign: 'center', fontFamily: 'var(--font-headings)', fontWeight: 900, fontSize: '0.9rem', color: 'var(--steel-gray)', letterSpacing: '4px' }}>DESIGNED TO MOVE BETTER.</div>
                            <div className="caster-wheel caster-wheel-left"></div>
                            <div className="caster-wheel caster-wheel-right"></div>
                        </div>

                    </div>
                )}
            </div>

            {showJFI && (
                 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto', backdropFilter: 'blur(10px)' }}>
                     <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
                         <button 
                             onClick={() => setShowJFI(false)}
                             style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: '#ffffff', fontSize: '2rem', cursor: 'pointer', zIndex: 10001 }}
                         >
                             ×
                         </button>
                         <JFIIdeaGenerator 
                            onIdeaGenerated={() => {}}
                            profile={null}
                            localScore={parseInt(localStorage.getItem('kaizen_user_score') || '0', 10)}
                        />
                     </div>
                 </div>
             )}
        </div>
    );
}
