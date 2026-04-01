import { useState, useEffect, useRef } from 'react';

interface BumpingSimulationProps {
    onClose?: () => void;
}

export default function BumpingSimulation({ onClose }: BumpingSimulationProps) {
    const [lang, setLang] = useState<'EN' | 'ES'>('ES');
    
    // T = { English, Spanish }
    const T = {
        title: lang === 'EN' ? 'BUMPING (BATON-ZONE) SIMULATION' : 'SIMULACIÓN DE BUMPING (TIPO BASTÓN)',
        desc: lang === 'EN' ? 'Understand why flexible flow is faster than traditional batching.' : 'Entienda por qué el flujo continuo es más rápido que los lotes tradicionales.',
        batchBtn: lang === 'EN' ? 'RUN BATCH (TRADITIONAL)' : 'CORRER LOTES (TRADICIONAL)',
        flowBtn: lang === 'EN' ? 'RUN BUMPING (ONE PIECE FLOW)' : 'CORRER BUMPING (FLUJO DE UNA PIEZA)',
        resetBtn: lang === 'EN' ? 'Reset' : 'Reiniciar',
        wip: lang === 'EN' ? 'WIP (Inventory Waiting)' : 'WIP (Inventario Esperando)',
        leadTime: lang === 'EN' ? 'Time to First Part:' : 'Tiempo para la 1ra Pieza:',
        totalTime: lang === 'EN' ? 'Total Time:' : 'Tiempo Total:',
        batchDesc: lang === 'EN' 
            ? 'In Batching, each worker builds 5 parts before passing them to the next worker. Notice the massive pile of inventory (WIP) waiting between stations, and how long the customer waits for the first part!'
            : 'En "Lotes", cada persona construye 5 piezas antes de pasarlas. ¡Mire la enorme montaña de piezas esperando entre estaciones y cuánto tiempo tarda en salir la primera pieza!',
        flowDesc: lang === 'EN'
            ? 'In Bumping, workers take a part and move down the line until they meet the next worker. They "pass the baton" and walk back to get another part. Flow is continuous, WIP is near zero, and the first part comes out instantly!'
            : 'En "Bumping", el operador camina con la pieza hasta encontrar a su compañero. Le pasa "el bastón" y regresa por otra pieza. ¡El flujo nunca para, el inventario es mínimo y la primera pieza sale casi al instante!'
    };

    const [mode, setMode] = useState<'IDLE' | 'BATCH' | 'BUMPING'>('IDLE');
    const [timer, setTimer] = useState(0);
    const [status, setStatus] = useState<'RUNNING' | 'DONE'>('DONE');
    
    // Animation Refs
    const requestRef = useRef<number>(0);
    
    // Abstract State for the visualizer
    // Simulation: 10 parts need to cross 3 "zones". Total distance = 100%.
    const [parts, setParts] = useState<{id: number, pos: number, status: 'wip' | 'done'}[]>(
        Array.from({length: 10}, (_, i) => ({ id: i, pos: 0, status: 'wip' }))
    );

    // Operator visual positions (0 to 100%)
    const [ops, setOps] = useState<{id: number, pos: number}[]>([
        { id: 1, pos: 10 }, { id: 2, pos: 50 }, { id: 3, pos: 80 }
    ]);

    const [firstPartTime, setFirstPartTime] = useState<number | null>(null);

    const resetSim = () => {
        setMode('IDLE');
        setStatus('DONE');
        setTimer(0);
        setFirstPartTime(null);
        setParts(Array.from({length: 10}, (_, i) => ({ id: i, pos: 0, status: 'wip' })));
        setOps([
            { id: 1, pos: 15 }, { id: 2, pos: 50 }, { id: 3, pos: 85 }
        ]);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const startSim = (m: 'BATCH' | 'BUMPING') => {
        resetSim();
        setMode(m);
        setStatus('RUNNING');
    };

    // Main Game Loop for the simulation
    useEffect(() => {
        if (status !== 'RUNNING') return;

        let lastTime = performance.now();
        let currentTimer = 0;
        
        // Deep copy state for mutations
        let activeParts = Array.from({length: 10}, (_, i) => ({ id: i, pos: 0, status: 'wip' as 'wip' | 'done' }));
        let activeOps = [
            { id: 1, pos: 15, carryingQueue: 0, target: 15 },
            { id: 2, pos: 50, carryingQueue: 0, target: 50 },
            { id: 3, pos: 85, carryingQueue: 0, target: 85 }
        ];

        let isDone = false;
        
        const update = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;
            currentTimer += dt;
            setTimer(currentTimer);

            if (mode === 'BATCH') {
                // Highly simplified visual for Batching (3 stops: 0->33, 33->66, 66->100)
                // Every 3 seconds, a batch of 5 moves.
                const speed = 15; // pos percentage per second
                
                // Parts are batched in groups of 5.
                // Group 1: parts 0-4. Group 2: parts 5-9.
                if (currentTimer < 5) {
                    // Op 1 working on Group 1
                    activeOps[0].pos = 15 + Math.sin(currentTimer * 10) * 2; // shaking
                    for (let i = 0; i < 5; i++) {
                        if (activeParts[i].pos < 30) activeParts[i].pos += speed * dt;
                    }
                } else if (currentTimer >= 5 && currentTimer < 10) {
                    // Op 1 pushes Group 1 to Buffer 1 (at 33)
                    for (let i = 0; i < 5; i++) {
                        activeParts[i].pos = 33;
                    }
                    // Op 1 works on Group 2
                    for (let i = 5; i < 10; i++) {
                        if (activeParts[i].pos < 30) activeParts[i].pos += speed * dt;
                    }
                } else if (currentTimer >= 10 && currentTimer < 15) {
                    // Op 2 works on Group 1
                    activeOps[1].pos = 50 + Math.sin(currentTimer * 10) * 2;
                    for (let i = 0; i < 5; i++) {
                        if (activeParts[i].pos < 66) activeParts[i].pos += speed * dt;
                    }
                } else if (currentTimer >= 15 && currentTimer < 20) {
                    // Op 3 works on Group 1
                    activeOps[2].pos = 85 + Math.sin(currentTimer * 10) * 2;
                    for (let i = 0; i < 5; i++) {
                        if (activeParts[i].pos < 100) activeParts[i].pos += speed * dt;
                        if (activeParts[i].pos >= 100) activeParts[i].status = 'done';
                    }
                    // Op 2 works on Group 2
                    for (let i = 5; i < 10; i++) {
                        if (activeParts[i].pos < 66) activeParts[i].pos += speed * dt;
                    }
                } else if (currentTimer >= 20 && currentTimer < 25) {
                    // Op 3 works on Group 2
                    activeOps[2].pos = 85 + Math.sin(currentTimer * 10) * 2;
                    for (let i = 5; i < 10; i++) {
                        if (activeParts[i].pos < 100) activeParts[i].pos += speed * dt;
                        if (activeParts[i].pos >= 100) activeParts[i].status = 'done';
                    }
                } else {
                    isDone = true;
                    setStatus('DONE');
                }

            } else if (mode === 'BUMPING') {
                // Continuous Flow - bumping mechanic
                // Op 1 moves from 0 to 40, meets Op 2, drops piece, goes back to 0.
                // Op 2 moves 40 to 70, meets Op 3, drops piece, goes back.
                const speed = 20;

                // For a smooth flow, we stagger parts 1 second apart.
                const stagger = 1.0;
                
                activeParts.forEach((part, i) => {
                    const startDelay = i * stagger;
                    if (currentTimer > startDelay && part.pos < 100) {
                        part.pos += speed * dt;
                        if (part.pos >= 100) part.status = 'done';

                        // Animate Ops to follow the lead parts in their zones
                        if (part.pos > 0 && part.pos < 35) {
                            activeOps[0].pos = part.pos;
                        } else if (part.pos > 35 && part.pos < 70) {
                            activeOps[1].pos = part.pos;
                        } else if (part.pos > 70 && part.pos < 100) {
                            activeOps[2].pos = part.pos;
                        }
                    }
                });

                if (activeParts.every(p => p.status === 'done')) {
                    isDone = true;
                    setStatus('DONE');
                }
            }

            // Record first part time
            if (activeParts[0].status === 'done' && !firstPartTime) {
                setFirstPartTime(currentTimer);
            }

            setParts([...activeParts]);
            setOps([
                { id: 1, pos: activeOps[0].pos },
                { id: 2, pos: activeOps[1].pos },
                { id: 3, pos: activeOps[2].pos }
            ]);

            if (!isDone) {
                requestRef.current = requestAnimationFrame(update);
            }
        };

        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [mode, status]);

    const completedCount = parts.filter(p => p.status === 'done').length;
    // Calculate WIP waiting between stations (pos between 30-35 or 60-70 while batching)
    const wipCount = mode === 'BATCH' 
        ? parts.filter(p => (p.pos === 33 || p.pos >= 65 && p.pos < 100) && p.status !== 'done').length 
        : parts.filter(p => p.pos > 0 && p.pos < 100).length - 3; // Bumping: Anything more than 3 active means WIP, though in our hardcoded anim it doesn't pile up.

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-main)' }}>
            
            {/* Header */}
            <header style={{ 
                padding: '1.5rem', 
                background: 'linear-gradient(180deg, #1a1a1c 0%, #111 100%)', 
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0, color: 'var(--lean-white)', fontSize: '1.25rem', fontFamily: 'var(--font-headings)' }}>{T.title}</h1>
                    <p style={{ margin: 0, color: 'var(--steel-gray)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{T.desc}</p>
                </div>
                <div style={{ display: 'flex', background: '#000', borderRadius: '20px', padding: '4px', border: '1px solid #333' }}>
                    <button onClick={() => setLang('EN')} style={{ padding: '0.25rem 0.75rem', borderRadius: '16px', border: 'none', cursor: 'pointer', background: lang === 'EN' ? 'var(--zone-yellow)' : 'transparent', color: lang === 'EN' ? '#000' : '#888', fontWeight: 'bold', fontSize: '0.75rem' }}>EN</button>
                    <button onClick={() => setLang('ES')} style={{ padding: '0.25rem 0.75rem', borderRadius: '16px', border: 'none', cursor: 'pointer', background: lang === 'ES' ? 'var(--zone-yellow)' : 'transparent', color: lang === 'ES' ? '#000' : '#888', fontWeight: 'bold', fontSize: '0.75rem' }}>ES</button>
                </div>
                {onClose && <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '0.5rem', marginLeft: '1rem' }}>✕</button>}
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                
                {/* Control Panel */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => startSim('BATCH')}
                        disabled={status === 'RUNNING'}
                        style={{ flex: 1, padding: '1rem', background: '#301818', border: '2px solid #ff4444', color: '#ff4444', borderRadius: '8px', cursor: status === 'RUNNING' ? 'not-allowed' : 'pointer', fontWeight: 800, fontFamily: 'var(--font-headings)', opacity: mode === 'BATCH' || mode === 'IDLE' ? 1 : 0.5, boxShadow: mode === 'BATCH' ? '0 0 15px rgba(255,68,68,0.3)' : 'none' }}
                    >
                        {T.batchBtn}
                    </button>
                    <button 
                        onClick={() => startSim('BUMPING')}
                        disabled={status === 'RUNNING'}
                        style={{ flex: 1, padding: '1rem', background: '#1a2a1a', border: '2px solid #44ff44', color: '#44ff44', borderRadius: '8px', cursor: status === 'RUNNING' ? 'not-allowed' : 'pointer', fontWeight: 800, fontFamily: 'var(--font-headings)', opacity: mode === 'BUMPING' || mode === 'IDLE' ? 1 : 0.5, boxShadow: mode === 'BUMPING' ? '0 0 15px rgba(68,255,68,0.3)' : 'none' }}
                    >
                        {T.flowBtn}
                    </button>
                </div>

                {/* Scoreboard */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-headings)' }}>{T.totalTime}</div>
                        <div style={{ color: 'var(--lean-white)', fontSize: '2.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{timer.toFixed(1)}s</div>
                    </div>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${firstPartTime ? 'var(--zone-yellow)' : '#333'}`, textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-headings)' }}>{T.leadTime}</div>
                        <div style={{ color: firstPartTime ? 'var(--zone-yellow)' : '#555', fontSize: '2.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                            {firstPartTime ? firstPartTime.toFixed(1) + 's' : '--'}
                        </div>
                    </div>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${wipCount > 3 ? '#ff4444' : '#333'}`, textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-headings)' }}>{T.wip}</div>
                        <div style={{ color: wipCount > 3 ? '#ff4444' : 'var(--lean-white)', fontSize: '2.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{wipCount > 0 ? wipCount : 0}</div>
                    </div>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${completedCount === 10 ? '#44ff44' : '#333'}`, textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-headings)' }}>Completed / 10</div>
                        <div style={{ color: completedCount === 10 ? '#44ff44' : 'var(--lean-white)', fontSize: '2.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{completedCount}</div>
                    </div>
                </div>

                {/* Educational Banner */}
                {mode !== 'IDLE' && (
                    <div style={{ padding: '1.5rem', background: mode === 'BATCH' ? 'rgba(255,68,68,0.1)' : 'rgba(68,255,68,0.1)', borderLeft: `4px solid ${mode === 'BATCH' ? '#ff4444' : '#44ff44'}`, borderRadius: '4px' }}>
                        <p style={{ margin: 0, color: 'var(--lean-white)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            {mode === 'BATCH' ? T.batchDesc : T.flowDesc}
                        </p>
                    </div>
                )}

                {/* THE SIMULATION TRACK */}
                <div style={{ 
                    position: 'relative', 
                    height: '240px', 
                    background: '#0a0a0c', 
                    borderRadius: '12px', 
                    border: '1px solid #333',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.8)'
                 }}>
                    {/* Background Grid / Zones */}
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '33.3%', width: '1px', background: 'rgba(255,255,255,0.1)', borderRight: '1px dashed #555' }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '66.6%', width: '1px', background: 'rgba(255,255,255,0.1)', borderRight: '1px dashed #555' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '16%', transform: 'translateX(-50%)', color: '#666', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>ZONE A</div>
                    <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', color: '#666', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>ZONE B</div>
                    <div style={{ position: 'absolute', top: '10px', left: '83%', transform: 'translateX(-50%)', color: '#666', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>ZONE C</div>

                    {/* Work in Progress (WIP) Dots */}
                    {parts.map(p => (
                        <div key={p.id} style={{
                            position: 'absolute',
                            left: `${Math.min(96, Math.max(0, p.pos))}%`,
                            top: `${40 + (p.id % 3) * 15}%`,
                            width: '24px',
                            height: '24px',
                            background: p.status === 'done' ? '#44ff44' : 'var(--zone-yellow)',
                            borderRadius: '50%',
                            boxShadow: `0 0 10px ${p.status === 'done' ? '#44ff44' : 'var(--zone-yellow)'}`,
                            transition: 'left 0.1s linear',
                            border: '2px solid #000',
                            zIndex: 10,
                            display: p.status === 'done' && p.pos > 105 ? 'none' : 'block',
                            opacity: p.status === 'done' ? 0.3 : 1
                        }} />
                    ))}

                    {/* Operators */}
                    {ops.map(o => (
                        <div key={o.id} style={{
                            position: 'absolute',
                            left: `${Math.min(95, Math.max(0, o.pos))}%`,
                            bottom: '10%',
                            fontSize: '2.5rem',
                            transition: 'left 0.1s linear',
                            zIndex: 20,
                            filter: 'drop-shadow(0px 5px 2px rgba(0,0,0,0.5))'
                        }}>
                            👷🏽
                        </div>
                    ))}

                    {/* Massive WIP Warning for Batch Mode */}
                    {mode === 'BATCH' && wipCount > 3 && (
                        <div style={{ position: 'absolute', top: '50%', left: '33%', transform: 'translate(-50%, -50%)', fontSize: '3rem', zIndex: 5 }}>
                            📦📦📦📦
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
