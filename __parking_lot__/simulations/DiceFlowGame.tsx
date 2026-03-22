import { useState, useRef, useEffect } from 'react';

type FlowMode = 'batch' | 'onepiece' | null;

export default function DiceFlowGame() {
    const [mode, setMode] = useState<FlowMode>(null);
    const [isRunning, setIsRunning] = useState(false);

    // Stations A, B, C for 10 dice total
    const [stationA, setStationA] = useState(0); // 0 to 10 completed
    const [stationB, setStationB] = useState(0);
    const [stationC, setStationC] = useState(0);

    // Timing
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [firstProductTime, setFirstProductTime] = useState<number | null>(null);
    const [totalTime, setTotalTime] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    // Track First Product Delivery
    useEffect(() => {
        if (stationC >= 1 && firstProductTime === null && isRunning) {
            setFirstProductTime(timeElapsed);
        }
        if (stationC === 10 && isRunning) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            setTotalTime(timeElapsed);
        }
    }, [stationC, isRunning, timeElapsed, firstProductTime]);

    const startGame = (selectedMode: FlowMode) => {
        setMode(selectedMode);
        setStationA(0);
        setStationB(0);
        setStationC(0);
        setTimeElapsed(0);
        setFirstProductTime(null);
        setTotalTime(null);

        setIsRunning(true);
        startTimeRef.current = Date.now();
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = window.setInterval(() => {
            if (startTimeRef.current) {
                setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
            }
        }, 100);
    };

    const handleProcessA = () => {
        if (!isRunning || stationA >= 10) return;
        setStationA(prev => prev + 1);
    };

    const handleProcessB = () => {
        if (!isRunning || stationB >= 10) return;

        // Batch constraints: B cannot start until A is fully 10/10
        if (mode === 'batch' && stationA < 10) return;

        // One Piece Flow constraints: B can process whatever A has finished
        if (mode === 'onepiece' && stationB >= stationA) return;

        setStationB(prev => prev + 1);
    };

    const handleProcessC = () => {
        if (!isRunning || stationC >= 10) return;

        // Batch constraints: C cannot start until B is fully 10/10
        if (mode === 'batch' && stationB < 10) return;

        // One Piece Flow constraints: C can process whatever B has finished
        if (mode === 'onepiece' && stationC >= stationB) return;

        setStationC(prev => prev + 1);
    };

    const renderDiceContainer = (count: number, label: string, isClickable: boolean, onClick: () => void, isPendingConstraint: boolean, completedConstraint: number) => {
        const canClick = isClickable && !isPendingConstraint && count < 10 && count < completedConstraint;
        const totalPending = completedConstraint - count;

        return (
            <div className={`card ${canClick ? 'pulse' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isPendingConstraint ? 0.5 : 1, transition: 'all 0.3s' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>{label}</h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', minHeight: '100px', marginBottom: '1rem', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', width: '100%' }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} style={{
                            width: '40px', height: '40px',
                            background: i < count ? 'var(--accent-success)' : 'var(--bg-panel)',
                            border: `2px solid ${i < count ? 'var(--accent-success)' : 'var(--border-color)'}`,
                            borderRadius: '0.5rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem',
                            color: i < count ? 'white' : 'transparent',
                            transition: 'all 0.2s'
                        }}>
                            {i < count ? '🎲' : ''}
                        </div>
                    ))}
                </div>

                <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-panel)',
                    width: '100%',
                    borderRadius: '0.25rem'
                }}>
                    Inventory buffer: {Math.max(0, totalPending)} units waiting
                </div>

                <button
                    className="btn"
                    onClick={onClick}
                    disabled={!canClick}
                    style={{ width: '100%', padding: '1rem', background: canClick ? 'var(--accent-primary)' : 'var(--bg-panel)', color: canClick ? 'white' : 'var(--text-muted)', border: 'none', fontWeight: 'bold' }}
                >
                    {count >= 10 ? 'Finished' : isPendingConstraint ? 'Waiting on Batch' : 'Process (Click)'}
                </button>
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulsing {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                .pulse { animation: pulsing 1.5s infinite; border-color: var(--accent-primary); }
                `
            }} />

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Batch vs. One-Piece Flow</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Process 10 dice through 3 workstations. Compare how long it takes to get the <strong>first</strong> finished product to the customer.
                </p>

                {!isRunning && stationC === 0 && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button className="btn" onClick={() => startGame('batch')} style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: 'bold' }}>
                            Simulate Batch 📦
                        </button>
                        <button className="btn" onClick={() => startGame('onepiece')} style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: '#ec4899', color: 'white', border: 'none', fontWeight: 'bold' }}>
                            Simulate Flow 🌊
                        </button>
                    </div>
                )}
            </div>

            {/* Game Board */}
            {mode && (
                <div style={{ background: 'var(--bg-panel-hover)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>

                    {/* HUD */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', alignItems: 'center' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Current Simulation</span><br />
                            <strong style={{ fontSize: '1.2rem', color: mode === 'batch' ? '#ffffff' : '#3b82f6' }}>
                                {mode === 'batch' ? 'Batch Processing (10 Units)' : 'One-Piece Flow'}
                            </strong>
                        </div>
                        <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '2.5rem', fontWeight: 'bold' }}>
                            {timeElapsed.toFixed(1)}s
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {renderDiceContainer(
                            stationA,
                            'Station A (Op 10)',
                            isRunning,
                            handleProcessA,
                            false,
                            10 // A can always process up to 10
                        )}
                        <div style={{ alignSelf: 'center', fontSize: '2rem', color: 'var(--border-color)' }}>➔</div>
                        {renderDiceContainer(
                            stationB,
                            'Station B (Op 20)',
                            isRunning,
                            handleProcessB,
                            mode === 'batch' && stationA < 10, // Wait for Batch A?
                            stationA // B constraint
                        )}
                        <div style={{ alignSelf: 'center', fontSize: '2rem', color: 'var(--border-color)' }}>➔</div>
                        {renderDiceContainer(
                            stationC,
                            'Station C (Op 30)',
                            isRunning,
                            handleProcessC,
                            mode === 'batch' && stationB < 10, // Wait for Batch B?
                            stationB // C constraint
                        )}
                    </div>

                    {/* Customer Finish Line */}
                    <div style={{ marginTop: '2rem', borderTop: '2px dashed var(--accent-success)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏁</div>
                        <h3 style={{ margin: '0 0 1rem 0' }}>Customer Delivery</h3>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div className="card" style={{ textAlign: 'center', minWidth: '150px', background: firstProductTime ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-dark)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time to 1st Product</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: firstProductTime ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                                    {firstProductTime ? `${firstProductTime.toFixed(1)}s` : '--'}
                                </div>
                            </div>
                            <div className="card" style={{ textAlign: 'center', minWidth: '150px', background: totalTime ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-dark)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Lead Time (10)</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: totalTime ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                                    {totalTime ? `${totalTime.toFixed(1)}s` : '--'}
                                </div>
                            </div>
                        </div>

                        {totalTime && (
                            <>
                                <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-panel)', borderRadius: '1rem', borderLeft: '4px solid #3b82f6', textAlign: 'left', maxWidth: '800px', alignSelf: 'center' }}>
                                    <h3 style={{ margin: '0 0 1rem 0', color: '#3b82f6' }}>🎓 Lesson Learned: The Benefit of One-Piece Flow</h3>
                                    <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.5rem', fontSize: '1.1rem', margin: 0 }}>
                                        <li style={{ marginBottom: '0.5rem' }}><strong>Shorter Lead Time:</strong> In a Batch system, units sit entirely idle waiting for the rest of their batch to finish processing. One-Piece Flow allows products to continuously move toward the customer, drastically shrinking Lead Time.</li>
                                        <li style={{ marginBottom: '0.5rem' }}><strong>Faster Cash Flow:</strong> Notice how much sooner the very <em>first</em> product arrived at the customer in One-Piece Flow. That means you get paid sooner.</li>
                                        <li><strong>Defect Detection:</strong> If Station A makes a defect, Batch flow produces 10 defects before anyone notices. One-Piece flow reveals the error on the very first unit at Station B.</li>
                                    </ul>
                                </div>
                                <button className="btn" onClick={() => setMode(null)} style={{ marginTop: '2rem', background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Back to Menu / Play Again</button>
                            </>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
