import { useState } from 'react';
import JFIIdeaGenerator from './tools/JFIIdeaGenerator';
import KaizenSessionCreator from './tools/kaizen/KaizenSessionCreator';

interface OperatingRoomProps {
    onNavigate: (view: any) => void;
}

export default function OperatingRoom({ onNavigate }: OperatingRoomProps) {
    type ViewState = 'main' | 'create' | 'join';
    const [view, setView] = useState<ViewState>('main');
    const [joinCode, setJoinCode] = useState('');
    const [showJFI, setShowJFI] = useState(false);

    const handleJoinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinCode.trim()) {
            // App.tsx handleNavigate overwrites the hash, so we just set the view via prop, but append manually
            onNavigate('motion-v2');
            setTimeout(() => {
                window.location.hash = `/motion-v2?session=${joinCode.trim().toUpperCase()}`;
            }, 0);
        }
    };

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
                    border-radius: 1.5rem;
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: clamp(0.5rem, 3vh, 2rem);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
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
                }
                .or-btn-secondary {
                    width: 100%;
                    padding: clamp(0.5rem, 2vh, 1.5rem) clamp(1rem, 2vw, 2rem);
                    font-size: clamp(0.85rem, 2.5vh, 1.25rem);
                    border-radius: 8px;
                    background: var(--bg-panel);
                    color: var(--text-main);
                    border: 1px solid var(--border-light);
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
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border-light);
                    color: var(--text-main);
                    border-radius: 8px;
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
                    background: rgba(255,255,255,0.08);
                    border-color: var(--text-main);
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
            <div className="or-grid-wrapper">
                <div className="or-grid-inner">
                
                {/* LEFT PANE - PRIMARY ACTIONS */}
                <div className="or-left-pane">
                    
                    {view === 'main' && (
                        <>
                            <div className="or-title">COMMAND HUB</div>
                            <div className="or-subtitle">Initiate or Join a Live Operation</div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 2vh, 1.5rem)', width: '100%' }}>
                                <button 
                                    onClick={() => setView('create')}
                                    className="btn-primary or-btn-primary"
                                >
                                    <span>⚡</span> START KAIZEN
                                </button>

                                <button 
                                    onClick={() => setView('join')}
                                    className="or-btn-secondary"
                                >
                                    <span>🔗</span> JOIN KAIZEN
                                </button>
                            </div>
                        </>
                    )}

                    {view === 'join' && (
                        <div style={{ width: '100%', animation: 'fadeIn 0.2s ease-out', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'clamp(0.5rem, 2vh, 2rem)' }}>
                                <button onClick={() => setView('main')} className="global-action-btn" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                                    ← Back
                                </button>
                                <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontFamily: 'var(--font-headings)', fontSize: 'clamp(1rem, 2.5vh, 1.5rem)', color: 'white', letterSpacing: '2px' }}>
                                    JOIN SESSION
                                </h2>
                                <div style={{ width: '60px' }} />
                            </div>

                            <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.5vh, 1rem)', background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vh, 2.5rem)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', flex: 1 }}>
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: 'clamp(0.7rem, 1.8vh, 1rem)' }}>
                                    Enter 6-char PIN or scan QR.
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="e.g. A3X9Z"
                                    value={joinCode}
                                    onChange={e => setJoinCode(e.target.value)}
                                    className="input-field-light"
                                    style={{ fontSize: 'clamp(1rem, 3vh, 1.5rem)', textAlign: 'center', letterSpacing: '4px', textTransform: 'uppercase', padding: 'clamp(0.5rem, 2vh, 1rem)' }}
                                    maxLength={8}
                                    autoFocus
                                />
                                <button 
                                    type="submit"
                                    disabled={joinCode.trim().length === 0}
                                    className="btn-primary or-btn-primary"
                                    style={{ marginTop: 'auto' }}
                                >
                                    ENTER KAIZEN
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* RIGHT PANE - SIDE NODE (JFI HUB) */}
                <div className="or-right-pane">
                    <div className="or-jfi-title">
                        Just-Do-It (JFI) System
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'clamp(0.25rem, 1.5vh, 1.25rem)'
                    }}>
                        <button 
                            onClick={() => setShowJFI(true)}
                            className="or-jfi-btn"
                        >
                            <span className="or-jfi-icon">💡</span> 
                            <span>Instant Idea Generator</span>
                        </button>
                        <a 
                            href="https://form.jotform.com/233406028319149" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="or-jfi-btn"
                        >
                            <span className="or-jfi-icon">📝</span> 
                            <span>Submit Formal JFI Ticket</span>
                        </a>
                        <a 
                            href="https://padlet.com" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="or-jfi-btn"
                        >
                            <span className="or-jfi-icon">📺</span> 
                            <span>Library & Training Videos</span>
                        </a>
                    </div>
                </div>
                </div>
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
