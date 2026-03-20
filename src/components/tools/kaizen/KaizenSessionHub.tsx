import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2 } from '../../../types/motion_v2';

interface KaizenSessionHubProps {
    onNavigate: (view: any) => void;
}

export default function KaizenSessionHub({ onNavigate }: KaizenSessionHubProps) {
    const [session, setSession] = useState<MotionSessionV2 | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    
    useEffect(() => {
        const loadSession = () => {
            const searchParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || "");
            const sid = searchParams.get('session') || hashParams.get('session');
            if (sid) {
                const s = ImprovementEngine.getItem<MotionSessionV2>(sid);
                if (s && s.type === 'MotionSessionV2') {
                    setSession(s);
                }
            }
        };
        
        loadSession();
        window.addEventListener('improvement_data_updated', loadSession);
        return () => window.removeEventListener('improvement_data_updated', loadSession);
    }, []);

    if (!session) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                LOADING SESSION CONTEXT...
            </div>
        );
    }

    const joinUrl = `${window.location.origin}/#/?session=${session.accessCode}`;

    const handleCopySync = () => {
        navigator.clipboard.writeText(joinUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-family)', background: 'var(--bg-dark)', color: 'var(--text-main)', animation: 'fadeIn 0.25s ease-out' }}>
            
            {/* Header / Top Strip */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                <button onClick={() => { window.location.hash = '/'; onNavigate('dashboard'); }} className="global-action-btn" style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none' }}>
                    ← Exit & Suspend
                </button>
                <div style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }} onClick={handleCopySync} title="Click to copy join link">
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-headings)', fontSize: '1.25rem', letterSpacing: '1px' }}>
                        {session.sessionName.toUpperCase()}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        ACTIVE KAIZEN CONTAINER
                    </div>
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
                    ● LIVE
                </div>
            </div>

            <div style={{ flex: 1, padding: '2rem', display: 'flex', gap: '3rem', maxWidth: '1400px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
                
                {/* Left Column: Context & Invites */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '380px', gap: '2rem' }}>
                    
                    {/* QR Code Panel */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
                            DIRECT JOIN CODE
                        </div>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <QRCodeSVG value={joinUrl} size={180} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-headings)', fontSize: '2.5rem', letterSpacing: '6px', color: '#FFFFFF', marginBottom: '1rem' }}>
                            {session.accessCode}
                        </div>
                        <button onClick={handleCopySync} className="btn-secondary" style={{ width: '100%', padding: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                            {copySuccess ? 'LINK COPIED' : 'COPY INVITE LINK'}
                        </button>
                    </div>

                    {/* Team Connected */}
                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                            TEAM CONNECTED
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Participants joining this session will appear here in real-time.
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Toolkit */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        SESSION TOOLKIT
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        
                        {/* Tool: Motion Mapper */}
                        <div style={{ background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📍</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-headings)', color: 'white' }}>Motion Mapping</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', flex: 1, lineHeight: 1.5 }}>
                                Live tracking of operator and material movement. Identify walk times, spaghetti pathways, and geographic waste.
                            </p>
                            <button 
                                onClick={() => {
                                    window.location.hash = `/motion-v2?session=${session.id}&role=host`;
                                    onNavigate('motion-v2');
                                }}
                                className="btn-primary" 
                                style={{ padding: '1rem', width: '100%', textTransform: 'uppercase', letterSpacing: '1px' }}
                            >
                                Enter Canvas
                            </button>
                        </div>

                        {/* Tool: Spaghetti Diagram (Future or Alias) */}
                        <div style={{ background: 'var(--bg-panel)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏱️</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-headings)', color: 'white' }}>Time Study</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', flex: 1, lineHeight: 1.5 }}>
                                Capture elemental cycle times to build Standard Work and calculate target vs. actual operating pace.
                            </p>
                            <button className="btn-secondary" style={{ padding: '1rem', width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                                Awaiting Capture
                            </button>
                        </div>

                        {/* Tool: Process Check */}
                        <div style={{ background: 'var(--bg-panel)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-headings)', color: 'white' }}>Process Check</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', flex: 1, lineHeight: 1.5 }}>
                                Evaluate adherence to standard work, log immediate friction points, and document current state.
                            </p>
                            <button 
                                onClick={() => {
                                    window.location.hash = `/process-check`;
                                    onNavigate('process-check');
                                }}
                                className="btn-secondary" style={{ padding: '1rem', width: '100%', textTransform: 'uppercase', letterSpacing: '1px' }}
                            >
                                Launch Checklist
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
