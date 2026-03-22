import { useState } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';

const MOCK_VIDEOS = [
    { title: 'Gemba Walks 101: Go and See', duration: '5:42', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80', description: 'Learn the proper technique for executing a daily Gemba Walk.' },
    { title: 'The 8 Wastes of Lean', duration: '12:15', thumbnail: 'https://images.unsplash.com/photo-1542382103-2470659a224a?w=500&q=80', description: 'Identify defects, overproduction, waiting, and other DOWNTIME wastes.' },
    { title: 'Standardized Work Basics', duration: '8:30', thumbnail: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&q=80', description: 'How to write effective, visual standard operating procedures.' },
    { title: '5S Organization Tour', duration: '15:20', thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80', description: 'A walk-through of a world-class 5S-certified production line.' },
];

export default function VideoHub({ onClose }: { onClose: () => void }) {
    const [activeVideo, setActiveVideo] = useState<typeof MOCK_VIDEOS[0] | null>(null);

    return (
        <HardwareConsoleLayout toolId="VID-01 LIBRARY" toolName="TRAINING VIDEOS" onClose={onClose}>
            <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', position: 'relative' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-headings)', color: 'var(--lean-white)' }}>
                        OPERATIONAL TRAINING HUB
                    </h2>
                    <p style={{ color: 'var(--steel-gray)', margin: 0 }}>
                        Select a video below to launch the integrated training player.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {MOCK_VIDEOS.map((vid, idx) => (
                        <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid var(--border-light)' }} 
                             onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'var(--zone-yellow)'; }}
                             onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                             onClick={() => setActiveVideo(vid)}
                        >
                            <div style={{ 
                                height: '180px', 
                                backgroundImage: `url(${vid.thumbnail})`, 
                                backgroundSize: 'cover', 
                                backgroundPosition: 'center',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {vid.duration}
                                </div>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255, 194, 14, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '1.5rem', opacity: 0.8, pointerEvents: 'none' }}>
                                    ▶
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--lean-white)' }}>{vid.title}</h3>
                                <p style={{ margin: 0, color: 'var(--steel-gray)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {vid.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL PLAYER OVERLAY */}
                {activeVideo && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 5, 5, 0.98)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: 'clamp(1rem, 5vh, 4rem)', animation: 'fadeIn 0.2s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
                            <h2 style={{ margin: 0, color: 'var(--zone-yellow)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontFamily: 'var(--font-headings)' }}>{activeVideo.title}</h2>
                            <button onClick={() => setActiveVideo(null)} className="shadow-btn-danger" style={{ padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', border: 'none', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px' }}>✕ CLOSE PLAYER</button>
                        </div>
                        
                        <div style={{ flex: 1, background: '#000', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${activeVideo.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(15px) brightness(0.25)' }} />
                            
                            <div style={{ zIndex: 1, textAlign: 'center', color: '#f8fafc', padding: '2rem' }}>
                                <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '1rem', color: 'rgba(255, 194, 14, 0.6)' }}>🔒</div>
                                <h3 style={{ margin: '0 0 1rem 0', fontSize: 'clamp(2rem, 5vw, 2.5rem)', letterSpacing: '1px' }}>Premium License Required</h3>
                                <p style={{ color: '#e2e8f0', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', lineHeight: 1.6 }}>
                                    This operational training module is locked. To access the full media library and deploy it across your organization, please upgrade your GembaOS deployment tier.
                                </p>
                                <button className="shadow-btn-accent" style={{ marginTop: '2.5rem', padding: '1.25rem 2.5rem', borderRadius: '6px', cursor: 'pointer', border: 'none', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px' }}>
                                    UPGRADE DEPLOYMENT
                                </button>
                            </div>
                            
                            {/* Fake progress bar */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: '#222' }}>
                                <div style={{ height: '100%', width: '0%', background: 'var(--zone-yellow)' }} />
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--bg-panel)', borderRadius: '8px', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0, color: 'var(--lean-white)', fontSize: '1.1rem' }}>Module Overview</h4>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-dark)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #333' }}>{activeVideo.duration}</span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5 }}>{activeVideo.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </HardwareConsoleLayout>
    );
}
