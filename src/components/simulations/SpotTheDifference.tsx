import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Defect {
    id: string;
    x: number; // percentage %
    y: number; // percentage %
    radius: number; // percentage %
    wasteType: 'Defects' | 'Overproduction' | 'Waiting' | 'Non-utilized Talent' | 'Transportation' | 'Inventory' | 'Motion' | 'Extra-processing';
    title: string;
    description: string;
    lesson: string;
}

export default function SpotTheDifference() {
    const { t } = useTranslation();
    // We will use a placeholder system for now where we imagine an image and map coordinates to it.
    // In reality, the user will upload/pass in a specific image with a pre-configured JSON map of defects.
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
    const [foundDefects, setFoundDefects] = useState<string[]>([]);
    const [activePopup, setActivePopup] = useState<Defect | null>(null);

    // Mock scenario
    const scenarioImage = '/mock-factory.jpg'; // We'll just define a solid dark box if image is missing initially
    const defects: Defect[] = [
        {
            id: 'd1', x: 15, y: 75, radius: 6, wasteType: 'Inventory', title: 'Excess Raw Materials',
            description: 'Pallets of unused steel are blocking the primary forklift lane.',
            lesson: 'Inventory is a "hiding place" for process inefficiency. It consumes cash flow and floor space while increasing lead times.'
        },
        {
            id: 'd2', x: 85, y: 45, radius: 5, wasteType: 'Motion', title: 'Tool Retrieval Walk',
            description: 'The operator must leave the workstation to find a wrench because there is no shadowed tool board.',
            lesson: 'Unnecessary motion is "non-value added." Every step away from the work piece is time taken from the customer.'
        },
        {
            id: 'd3', x: 50, y: 85, radius: 4, wasteType: 'Waiting', title: 'Idle Processing',
            description: 'A technician is standing with arms crossed because the previous station is delayed.',
            lesson: 'Waiting is the waste of time. It indicates a lack of flow or a bottleneck in the value stream.'
        },
        {
            id: 'd4', x: 30, y: 30, radius: 5, wasteType: 'Defects', title: 'Rework Pile',
            description: 'A "Red Bin" is overflowing with parts that need to be re-welded.',
            lesson: 'Defects require rework, which is "doing the job twice." It doubles the cost but adds zero value.'
        },
        {
            id: 'd5', x: 70, y: 20, radius: 6, wasteType: 'Overproduction', title: 'Batch Ahead',
            description: 'Station 2 has produced 20 extra units while Station 3 is still on the first unit.',
            lesson: 'Overproduction is the worst of all wastes because it causes all other seven wastes.'
        },
        {
            id: 'd6', x: 45, y: 55, radius: 5, wasteType: 'Transportation', title: 'Multiple Handling',
            description: 'Parts are being moved from the machine to a temporary holding area before going to assembly.',
            lesson: 'Transportation adds zero value. Every touch point is an opportunity for damage or delay.'
        }
    ];

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (gameState !== 'playing' || activePopup) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        // Check if click falls within a defect radius
        const clickedDefect = defects.find(d => {
            const distance = Math.sqrt(Math.pow(d.x - xPercent, 2) + Math.pow(d.y - yPercent, 2));
            return distance <= d.radius;
        });

        if (clickedDefect && !foundDefects.includes(clickedDefect.id)) {
            setActivePopup(clickedDefect);
            setFoundDefects([...foundDefects, clickedDefect.id]);
        }
    };

    const closePopup = () => {
        setActivePopup(null);
        if (foundDefects.length === defects.length) {
            setGameState('results');
        }
    };

    if (gameState === 'intro') {
        return (
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '4rem auto', padding: '2rem', background: 'var(--bg-panel)', borderRadius: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px var(--accent-primary))' }}>🔎</div>
                <h2 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '1rem', fontFamily: 'var(--font-headings)', fontWeight: '900' }}>{t('sim.spot.title')}</h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                    {t('sim.spot.intro')}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
                    {['Defects', 'Overproduction', 'Waiting', 'Non-utilized Talent', 'Transportation', 'Inventory', 'Motion', 'Extra-processing'].map(w => (
                        <span key={w} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{w}</span>
                    ))}
                </div>
                <button className="promo-pulse-btn" onClick={() => setGameState('playing')} style={{ padding: '1.25rem 4rem', fontSize: '1.5rem', fontWeight: '900', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '3rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)' }}>{t('sim.spot.start')}</button>
            </div>
        );
    }

    if (gameState === 'results') {
        return (
            <div style={{ textAlign: 'center', maxWidth: '900px', margin: '4rem auto' }}>
                <h2 style={{ fontSize: '3.5rem', color: 'var(--accent-success)', marginBottom: '1rem', fontFamily: 'var(--font-headings)', fontWeight: '900' }}>{t('sim.spot.complete')}</h2>
                <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>{t('sim.spot.success', { count: defects.length })}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 100%, 400px), 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                    {defects.map(d => (
                        <div key={d.id} className="card" style={{ borderLeft: '4px solid var(--accent-primary)', background: 'var(--bg-panel)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', padding: '1.5rem' }}>
                            <div style={{ color: 'var(--accent-primary)', fontWeight: '950', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>{d.wasteType}</div>
                            <div style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>{d.title}</div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>{d.description}</div>
                            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '1rem', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>💡</span> {d.lesson}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '4rem' }}>
                    <button className="promo-pulse-btn" onClick={() => { setGameState('intro'); setFoundDefects([]); }} style={{ padding: '1rem 4rem', fontSize: '1.2rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '3rem', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{t('sim.spot.restart')}</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', background: 'var(--bg-panel)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--accent-primary)', letterSpacing: '0.5px' }}>{t('sim.spot.active')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>{t('sim.spot.found')}:</span>
                    <span style={{ fontWeight: '950', fontSize: '1.4rem', color: foundDefects.length === defects.length ? 'var(--accent-success)' : '#fff', textShadow: foundDefects.length === defects.length ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none' }}>
                        {foundDefects.length} / {defects.length}
                    </span>
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#1e293b', borderRadius: '0.5rem', border: '2px solid var(--border-light)', overflow: 'hidden', cursor: 'crosshair', backgroundImage: `url(${scenarioImage}), radial-gradient(circle at center, #334155 0%, #0f172a 100%)`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={handleImageClick}>
                {/* Drawing area for the observation photo is handled by the backgroundImage in the parent div */}

                {/* Draw hit circles for debug/visual clarity if found */}
                {defects.map(d => {
                    const isFound = foundDefects.includes(d.id);
                    return (
                        <div key={d.id} style={{
                            position: 'absolute',
                            left: `${d.x}%`,
                            top: `${d.y}%`,
                            width: `${d.radius * 2}%`,
                            height: `${d.radius * 2}%`,
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            border: isFound ? '3px solid var(--accent-success)' : 'none',
                            background: isFound ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                            pointerEvents: 'none',
                            transition: 'all 0.3s'
                        }}></div>
                    );
                })}
            </div>

            {/* Popup Modal */}
            {
                activePopup && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={closePopup}>
                        <div style={{ background: 'var(--bg-panel)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '600px', width: '90%', animation: 'fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards', cursor: 'default', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                            <div style={{ color: 'var(--accent-primary)', fontWeight: '950', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.75rem', fontSize: '0.85rem' }}>{t('sim.spot.detected', { type: activePopup.wasteType })}</div>
                            <h3 style={{ fontSize: '2.2rem', margin: '0 0 1.25rem 0', color: 'var(--text-main)', fontFamily: 'var(--font-headings)', fontWeight: '900', lineHeight: 1.1 }}>{activePopup.title}</h3>
                            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>{activePopup.description}</p>

                            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.5rem', borderRadius: '1.25rem', color: 'var(--text-main)', marginBottom: '2.5rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                                <span style={{ fontWeight: '950', color: 'var(--accent-success)', display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('sim.5s.lessons')}:</span>
                                <div style={{ lineHeight: 1.6 }}>{activePopup.lesson}</div>
                            </div>

                            <button className="promo-pulse-btn" onClick={closePopup} style={{ width: '100%', padding: '1.25rem', fontWeight: '900', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '1rem', cursor: 'pointer', fontSize: '1.1rem' }}>{t('sim.spot.continue')}</button>
                        </div>
                    </div>
                )
            }

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInScale {
                    0% { transform: scale(0.9) translateY(20px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}} />
        </div>
    );
}
