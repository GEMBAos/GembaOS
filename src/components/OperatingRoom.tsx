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

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            fontFamily: 'var(--font-family)',
            color: 'var(--text-main)',
            background: 'var(--bg-dark)'
        }}>


            {/* Main Content: Single Pane of Glass Layout */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: 'clamp(0.5rem, 2vw, 2.5rem)', 
                gap: 'clamp(1rem, 3vw, 4rem)',
                overflow: 'hidden',
                minHeight: 0
            }}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    flexWrap: 'wrap', 
                    width: '100%', 
                    height: '100%', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: 'clamp(1rem, 3vw, 2rem)',
                    minHeight: 0,
                    overflow: 'hidden'
                }}>
                
                {/* LEFT PANE - PRIMARY ACTIONS */}
                <div style={{ 
                    flex: '1 1 300px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    maxWidth: '600px',
                    height: 'auto',
                    maxHeight: '100%',
                    minHeight: 0,
                    overflow: 'hidden'
                }}>
                    
                    {view === 'main' && (
                        <>
                            <div style={{ color: 'var(--text-main)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 800, fontFamily: 'var(--font-headings)' }}>
                                COMMAND HUB
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 400 }}>
                                Initiate or Join a Live Operation
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                                <button 
                                    onClick={() => setView('create')}
                                    className="btn-primary"
                                    style={{ 
                                        width: '100%',
                                        padding: '1.5rem 2rem', 
                                        fontSize: '1.75rem', 
                                    }}
                                >
                                    <span>⚡</span> START KAIZEN
                                </button>

                                <button 
                                    onClick={() => setView('join')}
                                    style={{ 
                                        width: '100%',
                                        padding: '1.5rem 2rem', 
                                        fontSize: '1.25rem', 
                                        borderRadius: '8px', 
                                        background: 'var(--bg-panel)',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--border-light)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-headings)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        transition: 'all 0.15s ease-in-out'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-panel-hover)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                                >
                                    <span>🔗</span> JOIN KAIZEN
                                </button>
                            </div>
                        </>
                    )}

                    {view === 'join' && (
                        <div style={{ width: '100%', animation: 'fadeIn 0.2s ease-out' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                                <button onClick={() => setView('main')} className="global-action-btn" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                                    ← Back
                                </button>
                                <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontFamily: 'var(--font-headings)', fontSize: '1.5rem', color: 'white', letterSpacing: '2px' }}>
                                    JOIN SESSION
                                </h2>
                                <div style={{ width: '60px' }} />
                            </div>

                            <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-panel)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                    Enter the 6-character access PIN, or scan the QR code using your phone camera.
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Enter PIN (e.g. A3X9Z)"
                                    value={joinCode}
                                    onChange={e => setJoinCode(e.target.value)}
                                    className="input-field-light"
                                    style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '4px', textTransform: 'uppercase', padding: '1rem' }}
                                    maxLength={8}
                                    autoFocus
                                />
                                <button 
                                    type="submit"
                                    disabled={joinCode.trim().length === 0}
                                    className="btn-primary"
                                    style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
                                >
                                    ENTER KAIZEN
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* RIGHT PANE - SIDE NODE (JFI HUB) */}
                <div style={{ 
                    flex: '1 1 250px', 
                    maxWidth: '400px',
                    display: 'flex', 
                    flexDirection: 'column',
                    background: 'var(--bg-panel)',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: 'clamp(1rem, 3vw, 2rem)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    minHeight: 0,
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-muted)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '3px', 
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '2.5rem'
                    }}>
                        Just-Do-It (JFI) System
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1.25rem'
                    }}>
                        <button 
                            onClick={() => setShowJFI(true)}
                            style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem' }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--text-main)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>💡</span> 
                            <span>Instant Idea Generator</span>
                        </button>
                        <a 
                            href="https://form.jotform.com/233406028319149" 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem' }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--text-main)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>📝</span> 
                            <span>Submit Formal JFI Ticket</span>
                        </a>
                        <a 
                            href="https://padlet.com" 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem' }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--text-main)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>📺</span> 
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
