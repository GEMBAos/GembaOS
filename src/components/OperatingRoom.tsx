import { useState } from 'react';
import KaizenSessionCreator from './tools/kaizen/KaizenSessionCreator';

interface OperatingRoomProps {
    onNavigate: (view: any) => void;
}

type BucketType = 'main' | 'learning' | 'waste' | 'system';

export default function OperatingRoom({ onNavigate }: OperatingRoomProps) {
    const [view, setView] = useState<BucketType | 'create' | 'join'>('main');

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

    const renderBucketCard = (title: string, subtitle: string, icon: string, bgClass: string, onClick: () => void) => (
        <div 
            className={`bucket-card ${bgClass}`}
            onClick={onClick}
            style={{
                flex: '1 1 300px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
        >
            <div className="bucket-bg-icon">{icon}</div>
            <div style={{ position: 'relative', zIndex: 10 }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'white', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-headings)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{subtitle}</p>
            </div>
            
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <span style={{ color: 'white', fontSize: '1.2rem' }}>➔</span>
                </div>
            </div>
        </div>
    );

    const renderToolBtn = (action: string, icon: string, name: string, desc: string) => (
        <button className="shadow-btn-accent tool-card" onClick={() => onNavigate(action)} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'left', minHeight: '160px' }}>
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{icon}</span>
            <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 900, fontSize: '1.25rem', fontFamily: 'var(--font-headings)', marginBottom: '0.25rem' }}>{name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>{desc}</div>
            </div>
        </button>
    );

    return (
        <div className="or-master-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-main)',
            background: 'var(--bg-dark)'
        }}>
            <style dangerouslySetInnerHTML={{__html: `
                .or-master-container { overflow-y: auto; overflow-x: hidden; }
                .bucket-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.7); border-color: var(--zone-yellow); }
                .bucket-card:hover .bucket-bg-icon { transform: scale(1.1) rotate(5deg); opacity: 0.15; }
                .bucket-bg-icon { position: absolute; font-size: 15rem; top: -2rem; right: -2rem; opacity: 0.05; transition: all 0.5s ease; pointer-events: none; filter: grayscale(1); }
                
                .bg-learning { background: linear-gradient(135deg, #1e3a8a, #0f172a); }
                .bg-waste { background: linear-gradient(135deg, #b91c1c, #450a0a); }
                .bg-system { background: linear-gradient(135deg, #047857, #064e3b); }
                
                .tool-card:hover { transform: translateY(-4px); border-color: var(--zone-yellow); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
                
                .bucket-header {
                    padding: clamp(2rem, 5vw, 4rem);
                    background: var(--bg-panel);
                    border-radius: 16px;
                    border: 1px solid var(--border-light);
                    margin-bottom: 2rem;
                    position: relative;
                    overflow: hidden;
                }
                .bucket-header::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: var(--zone-yellow);
                }
            `}} />

            <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                
                {/* BACK BUTTON (If not main) */}
                {view !== 'main' && (
                    <button 
                        onClick={() => setView('main')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0 1.5rem 0', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--zone-yellow)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <span>←</span> BACK TO ALL HUBS
                    </button>
                )}

                {/* MAIN BUCKET SELECTION VIEW */}
                {view === 'main' && (
                    <>
                        <div style={{ marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-headings)', fontWeight: 900, color: 'var(--gemba-black)', margin: '0 0 0.5rem 0' }}>OPERATING ROOM</h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--steel-gray)', margin: 0 }}>Select your operational focus area to begin.</p>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                            {renderBucketCard('Learning & Education', 'Quizzes, Simulations, Win Sharing & Best Practices', '🎓', 'bg-learning', () => setView('learning'))}
                            {renderBucketCard('Waste Identification', 'DOWNTIME Analysis, Motion Mapping & 5S Tools', '🗑️', 'bg-waste', () => setView('waste'))}
                            {renderBucketCard('Execution & Focus', 'Improvement Logs, Line Balance & KPIs', '📈', 'bg-system', () => setView('system'))}
                        </div>
                    </>
                )}

                {/* 1. LEARNING & EDUCATION BUCKET */}
                {view === 'learning' && (
                    <div className="animate-fade-in">
                        <div className="bucket-header">
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ fontSize: '5rem', lineHeight: 1 }}>🎓</div>
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-headings)', color: 'var(--gemba-black)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Learning & Education</h2>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                        Continuous improvement begins with "training the eye to see." This hub contains interactive simulations, quizzes, safety best practices, and win-sharing from the floor to build your lean muscles.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {renderToolBtn('gemba-challenge', '🎯', 'Gemba Challenge', 'Test your ability to spot the 8 Wastes in real-world factory scenarios.')}
                            {renderToolBtn('lean-academy', '📚', 'Lean Academy', 'Interactive curriculum simulations and experiential homework.')}
                            {renderToolBtn('video-hub', '📺', 'Video Hub', 'Curated library of Lippert best practices, safety talks, and training.')}
                            {renderToolBtn('kaizen-hub', '🏆', 'Kaizen Hub', 'Win Sharing: Browse successfully executed global improvements.')}
                        </div>
                    </div>
                )}

                {/* 2. WASTE IDENTIFICATION BUCKET */}
                {view === 'waste' && (
                    <div className="animate-fade-in">
                        <div className="bucket-header">
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ fontSize: '5rem', lineHeight: 1 }}>🗑️</div>
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-headings)', color: 'var(--gemba-black)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Waste Identification</h2>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                                        Utilize these diagnostic tools to stand in the circle and root out <strong>DOWNTIME</strong> in your processes:
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>D</strong>efects</div>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>O</strong>verproduction</div>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>W</strong>aiting</div>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>N</strong>on-utilized Talent</div>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>T</strong>ransportation</div>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>I</strong>nventory</div>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>M</strong>otion</div>
                                        <div style={{ color: 'var(--text-main)' }}><strong style={{color: '#d97706'}}>E</strong>xtra-Processing</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {renderToolBtn('motion-v2', '🏃‍♂️', 'Motion Mapper', 'Track spaghetti diagrams of operator movement in real-time.')}
                            {renderToolBtn('process-check', '📋', 'Process Check', 'Structured evaluation of current standardization versus actual execution.')}
                            {renderToolBtn('value-scanner', '🔳', '5S Scanner', 'Conduct rapid 5S audits of any workstation layout.')}
                            {renderToolBtn('time-study', '⏱️', 'Time Study', 'Measure precise cycle times and identify VA vs NVA proportions.')}
                            {renderToolBtn('gemba', '🧭', 'Gemba Walk', 'Guided floor walk framework to engage operators and spot friction.')}
                        </div>
                    </div>
                )}

                {/* 3. SYSTEM EXECUTION BUCKET */}
                {view === 'system' && (
                    <div className="animate-fade-in">
                        <div className="bucket-header">
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ fontSize: '5rem', lineHeight: 1 }}>⚙️</div>
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-headings)', color: 'var(--gemba-black)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Execution & Focus</h2>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                        Data is useless without action. Use this hub to balance workloads, track global facility KPIs, and drive identified action items to completion.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {renderToolBtn('improvement-card', '⚡', 'Improvement Action', 'Log, track, and assign formal countermeasures (Just Fix It).')}
                            {renderToolBtn('line-balance', '⚖️', 'Line Balance', 'Yamazumi chart builder to eliminate bottleneck operations.')}
                            {renderToolBtn('goal-gap', '📈', 'Goal Gap Monitor', 'Facility-wide SQDC metric tracking and gap analysis algorithms.')}
                            {renderToolBtn('action-items', '☑️', 'Master Task List', 'Your personal queue of assigned countermeasures.')}
                        </div>
                    </div>
                )}

            </div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }`}} />
        </div>
    );
}
