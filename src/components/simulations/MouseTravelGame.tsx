import { useState, useRef, useEffect } from 'react';

// Distance calculation helper
const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export default function MouseTravelGame() {
    const [phase, setPhase] = useState<'intro' | 'scattered' | 'cellular' | 'results'>('intro');
    const [currentTarget, setCurrentTarget] = useState(1);

    // Tracking total distance in pixels
    const [scatteredDistance, setScatteredDistance] = useState(0);
    const [cellularDistance, setCellularDistance] = useState(0);

    const prevMousePos = useRef<{ x: number; y: number } | null>(null);
    const isTracking = useRef(false);

    // Track mouse movement globally when a phase is active
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isTracking.current) return;

            const currentPos = { x: e.clientX, y: e.clientY };

            if (prevMousePos.current) {
                const dist = calculateDistance(prevMousePos.current, currentPos);

                if (phase === 'scattered') {
                    setScatteredDistance(prev => prev + dist);
                } else if (phase === 'cellular') {
                    setCellularDistance(prev => prev + dist);
                }
            }

            prevMousePos.current = currentPos;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [phase]);

    // Start Phase
    const startPhase = (newPhase: 'scattered' | 'cellular') => {
        setPhase(newPhase);
        setCurrentTarget(1);
        prevMousePos.current = null;
        isTracking.current = true;
    };

    // Handle clicking a target button
    const handleTargetClick = (targetNumber: number) => {
        if (targetNumber === currentTarget) {
            if (currentTarget < 5) {
                setCurrentTarget(currentTarget + 1);
            } else {
                // Phase complete
                isTracking.current = false;
                if (phase === 'scattered') {
                    setPhase('intro'); // Wait for user to trigger next phase
                } else if (phase === 'cellular') {
                    setPhase('results');
                }
            }
        }
    };

    const renderIntro = () => (
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
            <h2>Spaghetti Diagram Simulator</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                In this simulation, we track exactly how many pixels your mouse travels to complete a 5-step process.
                <br /><br />
                First, you will experience a "Poor Layout" where tools (buttons) are scattered randomly.
            </p>
            {scatteredDistance === 0 ? (
                <button className="btn" onClick={() => startPhase('scattered')} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Start Phase 1: Poor Layout</button>
            ) : (
                <>
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                        <strong>Phase 1 Complete!</strong><br />
                        You traveled {Math.round(scatteredDistance)} pixels.
                    </div>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Now, let's try an "Optimized Cellular Layout" where tools are clustered together sequentially.
                    </p>
                    <button className="btn" onClick={() => startPhase('cellular')} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Start Phase 2: Cellular Layout</button>
                </>
            )}
        </div>
    );

    const renderScattered = () => (
        <div style={{ position: 'relative', height: '600px', width: '100%', background: 'var(--bg-panel)', border: '2px dashed var(--border-color)', borderRadius: '0.5rem', marginTop: '2rem' }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                Pixels Traveled: {Math.round(scatteredDistance)}
            </div>
            {/* Random scattered layout */}
            <button onClick={() => handleTargetClick(1)} className="btn" style={{ position: 'absolute', top: '10%', left: '10%', padding: '2rem', background: currentTarget === 1 ? '#ec4899' : '', color: currentTarget === 1 ? 'white' : '' }}>1. Assemble Base</button>
            <button onClick={() => handleTargetClick(2)} className="btn" style={{ position: 'absolute', bottom: '20%', right: '15%', padding: '2rem', background: currentTarget === 2 ? '#ec4899' : '', color: currentTarget === 2 ? 'white' : '' }}>2. Attach Wiring</button>
            <button onClick={() => handleTargetClick(3)} className="btn" style={{ position: 'absolute', top: '15%', right: '20%', padding: '2rem', background: currentTarget === 3 ? '#ec4899' : '', color: currentTarget === 3 ? 'white' : '' }}>3. Install Motor</button>
            <button onClick={() => handleTargetClick(4)} className="btn" style={{ position: 'absolute', bottom: '10%', left: '30%', padding: '2rem', background: currentTarget === 4 ? '#ec4899' : '', color: currentTarget === 4 ? 'white' : '' }}>4. Seal Casing</button>
            <button onClick={() => handleTargetClick(5)} className="btn" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '2rem', background: currentTarget === 5 ? '#ec4899' : '', color: currentTarget === 5 ? 'white' : '' }}>5. Final Paint</button>
        </div>
    );

    const renderCellular = () => (
        <div style={{ position: 'relative', height: '600px', width: '100%', background: 'var(--bg-panel)', border: '2px solid var(--accent-success)', borderRadius: '0.5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                Pixels Traveled: {Math.round(cellularDistance)}
            </div>
            {/* Optimized Cellular Layout */}
            <div style={{ background: 'var(--bg-dark)', padding: '2rem', borderRadius: '1rem', border: '2px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleTargetClick(1)} className="btn" style={{ padding: '2rem', background: currentTarget === 1 ? '#ec4899' : '', color: currentTarget === 1 ? 'white' : '' }}>1. Assemble Base</button>
                <div style={{ alignSelf: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>➔</div>
                <button onClick={() => handleTargetClick(2)} className="btn" style={{ padding: '2rem', background: currentTarget === 2 ? '#ec4899' : '', color: currentTarget === 2 ? 'white' : '' }}>2. Attach Wiring</button>
                <div style={{ alignSelf: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>➔</div>
                <button onClick={() => handleTargetClick(3)} className="btn" style={{ padding: '2rem', background: currentTarget === 3 ? '#ec4899' : '', color: currentTarget === 3 ? 'white' : '' }}>3. Install Motor</button>
                <div style={{ alignSelf: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>➔</div>
                <button onClick={() => handleTargetClick(4)} className="btn" style={{ padding: '2rem', background: currentTarget === 4 ? '#ec4899' : '', color: currentTarget === 4 ? 'white' : '' }}>4. Seal Casing</button>
                <div style={{ alignSelf: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>➔</div>
                <button onClick={() => handleTargetClick(5)} className="btn" style={{ padding: '2rem', background: currentTarget === 5 ? '#ec4899' : '', color: currentTarget === 5 ? 'white' : '' }}>5. Final Paint</button>
            </div>
        </div>
    );

    const renderResults = () => {
        const distanceSaved = scatteredDistance - cellularDistance;
        const percentSaved = ((distanceSaved / scatteredDistance) * 100).toFixed(1);

        return (
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '4rem auto' }}>
                <h2>Simulation Complete</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                    <div className="card" style={{ border: '2px solid var(--accent-danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <h3 style={{ color: 'var(--accent-danger)' }}>Poor Layout</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{Math.round(scatteredDistance)}</div>
                        <div style={{ color: 'var(--text-muted)' }}>Pixels Traveled</div>
                    </div>
                    <div className="card" style={{ border: '2px solid var(--accent-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                        <h3 style={{ color: 'var(--accent-success)' }}>Cellular Layout</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{Math.round(cellularDistance)}</div>
                        <div style={{ color: 'var(--text-muted)' }}>Pixels Traveled</div>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-panel)', borderRadius: '1rem', borderLeft: '4px solid var(--accent-success)', textAlign: 'left' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-primary)' }}>🎓 Lesson Learned: The Power of Cellular Flow</h3>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginTop: '1rem', lineHeight: 1.6 }}>
                        By bringing tools and processes next to each other in a continuous cell, you reduced travel waste by <strong style={{ color: 'var(--accent-success)', fontSize: '1.5rem' }}>{percentSaved}%</strong> ({Math.round(distanceSaved)} pixels).
                    </p>
                    <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '1rem', paddingLeft: '1.5rem', fontSize: '1.1rem' }}>
                        <li><strong>Motion is Waste:</strong> Every step (or mouse movement) taken to retrieve a tool or move a part adds Lead Time without adding any Value to the product.</li>
                        <li><strong>Spaghetti Diagrams:</strong> By mapping movement, you make the invisible waste visible. The tangled path of Phase 1 represents wasted human energy.</li>
                        <li><strong>Point-of-Use:</strong> Organizing workstations into a "Cellular Layout" ensures operators have what they need, exactly when they need it, right at their fingertips.</li>
                    </ul>
                </div>

                <button
                    className="btn"
                    onClick={() => {
                        setPhase('intro');
                        setScatteredDistance(0);
                        setCellularDistance(0);
                    }}
                    style={{ marginTop: '2rem', background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                    Restart Simulation
                </button>
            </div>
        );
    };

    return (
        <div>
            {phase === 'intro' && renderIntro()}
            {phase === 'scattered' && renderScattered()}
            {phase === 'cellular' && renderCellular()}
            {phase === 'results' && renderResults()}
        </div>
    );
}
