import { useState, useEffect } from 'react';
import { ImprovementEngine } from '../services/ImprovementEngine';
import JFIIdeaGenerator from './tools/JFIIdeaGenerator';
import KaizenSessionCreator from './tools/kaizen/KaizenSessionCreator';

interface OperatingRoomProps {
    onNavigate: (view: any) => void;
}

export default function OperatingRoom({ onNavigate }: OperatingRoomProps) {
    type ViewState = 'main' | 'create' | 'join';
    const [view, setView] = useState<ViewState>('main');
    const [joinCode, setJoinCode] = useState('');
    const [topStripInfo, setTopStripInfo] = useState('LIVE OPERATIONS • KAIZEN COMMAND');
    const [showJFI, setShowJFI] = useState(false);

    useEffect(() => {
        const loadLiveData = () => {
            const obsV2 = ImprovementEngine.getItemsByType<any>('MotionSessionV2');
            if (obsV2.length > 0) {
                setTopStripInfo(`LIVE OPERATIONS • ${obsV2.length} ACTIVE SESSIONS`);
            }
        };
        
        loadLiveData();
        window.addEventListener('improvement_data_updated', loadLiveData);
        return () => window.removeEventListener('improvement_data_updated', loadLiveData);
    }, []);

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
            {/* Minimal Top Strip */}
            <div style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.05)', 
                padding: '0.6rem 2rem', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                textTransform: 'uppercase', 
                letterSpacing: '3px',
                textAlign: 'center',
                fontWeight: 600,
                background: 'rgba(0,0,0,0.2)'
            }}>
                {topStripInfo}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>
                    
                    {view === 'main' && (
                        <>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 400 }}>
                                Participate in Kaizen
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                                <button 
                                    onClick={() => setView('create')}
                                    style={{ 
                                        width: '100%',
                                        padding: '1.5rem 2rem', 
                                        fontSize: '1.75rem', 
                                        borderRadius: '12px', 
                                        background: '#F15A29',
                                        color: '#FFFFFF',
                                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1.5rem',
                                        fontWeight: 800,
                                        fontFamily: 'var(--font-headings)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        transition: 'all 0.15s ease-in-out'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
                                        e.currentTarget.style.background = '#d94a1d';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.25)';
                                        e.currentTarget.style.background = '#F15A29';
                                    }}
                                    onMouseDown={e => {
                                        e.currentTarget.style.transform = 'translateY(2px)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                                    }}
                                >
                                    <span>⚡</span> START NEW KAIZEN
                                </button>

                                <button 
                                    onClick={() => setView('join')}
                                    style={{ 
                                        width: '100%',
                                        padding: '1.5rem 2rem', 
                                        fontSize: '1.25rem', 
                                        borderRadius: '12px', 
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
                                    <span>🔗</span> JOIN ONGOING KAIZEN
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

                {/* JFI HUB */}
                <div style={{ marginTop: '6rem', width: '100%', maxWidth: '800px', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-muted)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '3px', 
                        fontWeight: 700,
                        textAlign: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        JFI System
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <button 
                            onClick={() => setShowJFI(true)}
                            style={{ padding: '0.8rem 1.75rem', background: 'var(--bg-panel)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-panel-hover)'}
                            onMouseOut={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                        >
                            💡 JFI Generator
                        </button>
                        <a 
                            href="https://form.jotform.com/233406028319149" 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ padding: '0.8rem 1.75rem', background: 'var(--bg-panel)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-panel-hover)'}
                            onMouseOut={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                        >
                            📝 Submit JFI
                        </a>
                        <a 
                            href="https://padlet.com" 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ padding: '0.8rem 1.75rem', background: 'var(--bg-panel)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-panel-hover)'}
                            onMouseOut={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                        >
                            📺 Video Library
                        </a>
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
