import { useState } from 'react';
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
            display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-sans)', color: 'var(--text-main)', background: 'transparent'
        }}>
            <div style={{ flex: 1, padding: '2rem clamp(1rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '1000px', marginTop: '1rem' }}>
                    
                    {/* Advanced Systems Widget */}
                    <div style={{ marginTop: '0', width: '100%', paddingTop: '2rem', paddingBottom: '4rem' }}>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-headings)' }}>ADVANCED SYSTEMS</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <button className="shadow-btn-accent" onClick={() => onNavigate('kaizen-hub')} style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', background: 'var(--gemba-black)', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--zone-yellow)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.8)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)'; }}>
                                <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>⚡</span>
                                <span style={{ color: 'var(--lean-white)', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-headings)' }}>KAIZEN HUB</span>
                                <span style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.4 }}>Master Continuous Improvement Dashboard</span>
                            </button>
                            <button className="shadow-btn-accent" onClick={() => onNavigate('gemba')} style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', background: 'var(--gemba-black)', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--zone-yellow)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.8)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)'; }}>
                                <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🧭</span>
                                <span style={{ color: 'var(--lean-white)', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-headings)' }}>GEMBA WALK</span>
                                <span style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.4 }}>Structured Floor Walk Builder</span>
                            </button>
                            <button className="shadow-btn-accent" onClick={() => onNavigate('line-balance')} style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', background: 'var(--gemba-black)', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--zone-yellow)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.8)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)'; }}>
                                <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>⚖️</span>
                                <span style={{ color: 'var(--lean-white)', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-headings)' }}>LINE BALANCE</span>
                                <span style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.4 }}>Cycle Time Analysis Engine</span>
                            </button>
                            <button className="shadow-btn-accent" onClick={() => onNavigate('goal-gap')} style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', background: 'var(--gemba-black)', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--zone-yellow)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.8)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)'; }}>
                                <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>📈</span>
                                <span style={{ color: 'var(--lean-white)', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-headings)' }}>GOAL GAP</span>
                                <span style={{ color: '#888', fontSize: '0.8rem', textAlign: 'center', lineHeight: 1.4 }}>KPI Tracking Matrix</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
