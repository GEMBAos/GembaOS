import { useState } from 'react';

type BoardSpace = {
    id: number;
    type: 'normal' | 'waste' | 'start' | 'finish';
    label?: string;
};

type WasteEvent = {
    title: string;
    description: string;
    stepsLost: number;
    wasteType: string;
};

const WASTE_EVENTS: WasteEvent[] = [
    { title: 'Missing Tool!', description: 'You have to walk back to the tool crib to find a 10mm socket.', stepsLost: 3, wasteType: 'Motion' },
    { title: 'Material Stockout', description: 'The kanban bin is empty. Walk to the warehouse to fetch more parts.', stepsLost: 4, wasteType: 'Motion / Waiting' },
    { title: 'Printer Jam', description: 'You walk to the community printer, but it is jammed. You spend time fixing it.', stepsLost: 2, wasteType: 'Non-Value Add' },
    { title: 'Search for Manager', description: 'You need an approval signature but your manager is not at their desk. Walk around the floor looking for them.', stepsLost: 3, wasteType: 'Motion' },
    { title: 'Disorganized Workbench', description: 'You spend time looking for the right drill bit buried under a pile of scrap.', stepsLost: 2, wasteType: 'Motion / Inventory' },
    { title: 'Tool Not Balanced', description: 'You had to walk to a different bench to use the balancer.', stepsLost: 1, wasteType: 'Motion' }
];

export default function ProcessBoardGame() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'event' | 'results'>('intro');
    const [playerPos, setPlayerPos] = useState(0);
    const [diceRoll, setDiceRoll] = useState(0);
    const [activeEvent, setActiveEvent] = useState<WasteEvent | null>(null);
    const [stats, setStats] = useState({
        turns: 0,
        totalPotenialSteps: 0,
        totalLostSteps: 0
    });

    // Create a board of 30 spaces.
    const BOARD_SIZE = 30;
    const board: BoardSpace[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
        id: i,
        type: i === 0 ? 'start' : i === BOARD_SIZE - 1 ? 'finish' : 'normal',
        label: i === 0 ? 'START' : i === BOARD_SIZE - 1 ? 'FINISH' : undefined
    }));

    const rollDice = () => {
        // Roll a custom D8 (1-8 steps)
        const roll = Math.floor(Math.random() * 8) + 1;
        setDiceRoll(roll);

        let newPos = playerPos + roll;
        let eventTriggered: WasteEvent | null = null;

        // 40% chance of a waste event happening during a turn
        if (Math.random() < 0.40) {
            eventTriggered = WASTE_EVENTS[Math.floor(Math.random() * WASTE_EVENTS.length)];
            // Don't let steps lost exceed the roll, and ensure they move at least 0 spaces
            const actualStepsLost = Math.min(eventTriggered.stepsLost, roll);
            eventTriggered = { ...eventTriggered, stepsLost: actualStepsLost };
            newPos = playerPos + (roll - actualStepsLost);
        }

        if (newPos >= BOARD_SIZE - 1) {
            newPos = BOARD_SIZE - 1; // Cap at finish
        }

        setStats(prev => ({
            turns: prev.turns + 1,
            totalPotenialSteps: prev.totalPotenialSteps + roll,
            totalLostSteps: prev.totalLostSteps + (eventTriggered ? eventTriggered.stepsLost : 0)
        }));

        if (eventTriggered) {
            setActiveEvent(eventTriggered);
            setGameState('event');
        } else {
            setPlayerPos(newPos);
            if (newPos === BOARD_SIZE - 1) {
                setGameState('results');
            }
        }
    };

    const resolveEvent = () => {
        if (!activeEvent) return;
        const newPos = playerPos + (diceRoll - activeEvent.stepsLost);
        setPlayerPos(newPos);
        setActiveEvent(null);

        if (newPos >= BOARD_SIZE - 1) {
            setGameState('results');
        } else {
            setGameState('playing');
        }
    };

    const resetGame = () => {
        setPlayerPos(0);
        setDiceRoll(0);
        setStats({ turns: 0, totalPotenialSteps: 0, totalLostSteps: 0 });
        setGameState('playing');
    };

    if (gameState === 'intro') {
        return (
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '4rem auto' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎲</div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Process Board Game</h2>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-warning)', marginTop: 0 }}>The True Cost of Motion Waste</h3>

                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Welcome to the factory floor. Your goal is to move a product from <strong>START</strong> to <strong>FINISH</strong>.
                    You will roll an 8-sided die representing your productive capacity.
                </p>

                <div style={{ background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid var(--accent-primary)', textAlign: 'left', marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent-primary)', margin: '0 0 0.5rem 0' }}>The Catch</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        In a poorly engineered workspace, "capacity" does not equal "output." Random events caused by poor 5S and lack of point-of-use tooling will force you to walk away from your station, consuming the steps you rolled and slowing down your progress.
                    </p>
                </div>

                <button className="btn btn-primary" onClick={() => setGameState('playing')} style={{ padding: '1rem 3rem', fontSize: '1.5rem', fontWeight: 'bold' }}>START SHIFT</button>
            </div>
        );
    }

    if (gameState === 'results') {
        const netProductivity = Math.round(((stats.totalPotenialSteps - stats.totalLostSteps) / stats.totalPotenialSteps) * 100);

        return (
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '2rem auto' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-success)', marginBottom: '1rem' }}>Shift Complete!</h2>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏁</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{stats.turns}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Turns Taken</div>
                    </div>
                    <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>{stats.totalLostSteps}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Steps Lost to Waste</div>
                    </div>
                    <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-warning)' }}>{netProductivity}%</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Net Productivity</div>
                    </div>
                </div>

                {/* Final Lesson Wrapper */}
                <div style={{
                    marginTop: '2rem',
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))',
                    borderRadius: '1rem',
                    border: '2px solid var(--accent-warning)',
                    textAlign: 'left',
                    boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)'
                }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--accent-warning)', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🎓</span> Lesson Learned: Point of Use
                    </h3>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Notice how your dice rolls (capacity) were high, but your actual movement (throughput) was low. This is exactly what happens in a factory when tools are not <strong>balanced at the point of use</strong>.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.6, fontWeight: 'bold', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1rem', marginLeft: '1rem' }}>
                        An operator who has to take 8 steps to fetch a drill is an operator who is NOT building the product. Don't work harder, work smarter by eliminating the motion waste.
                    </p>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <button className="btn btn-primary" onClick={resetGame}>Play Again</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--bg-panel)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>🏭</div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>Production Track</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Turns: {stats.turns}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rolled</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{diceRoll || '-'}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lost</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent-danger)' }}>{stats.totalLostSteps}</div>
                    </div>
                </div>
            </div>

            {/* Game Board */}
            <div className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {board.map((space, index) => {
                        const isPlayerHere = playerPos === index;
                        let bg = 'var(--bg-dark)';
                        let border = '2px solid rgba(255,255,255,0.05)';
                        let color = 'var(--text-muted)';

                        if (space.type === 'start') {
                            bg = 'rgba(59, 130, 246, 0.2)';
                            border = '2px solid var(--accent-primary)';
                            color = 'var(--accent-primary)';
                        } else if (space.type === 'finish') {
                            bg = 'rgba(16, 185, 129, 0.2)';
                            border = '2px dashed var(--accent-success)';
                            color = 'var(--accent-success)';
                        }

                        if (isPlayerHere) {
                            border = '2px solid white';
                            color = 'white';
                        }

                        return (
                            <div key={index} style={{
                                width: '60px', height: '60px', borderRadius: '0.5rem',
                                background: bg, border, color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', transition: 'all 0.3s',
                                fontWeight: 'bold', fontSize: space.label ? '0.7rem' : '1.2rem',
                                boxShadow: isPlayerHere ? '0 0 20px rgba(59, 130, 246, 0.6)' : 'none',
                                transform: isPlayerHere ? 'scale(1.1)' : 'scale(1)',
                                zIndex: isPlayerHere ? 10 : 1
                            }}>
                                {isPlayerHere ? '👷' : (space.label || index)}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                {gameState === 'playing' && (
                    <button
                        className="btn btn-primary"
                        onClick={rollDice}
                        style={{ padding: '1.5rem 4rem', fontSize: '1.5rem', fontWeight: 'bold', width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                    >
                        <span>🎲</span> ROLL PRODUCTION
                    </button>
                )}
            </div>

            {/* Waste Event Modal Overlay */}
            {gameState === 'event' && activeEvent && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: 'var(--bg-panel)', border: '2px solid var(--accent-danger)', borderRadius: '1rem',
                        padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3 style={{ fontSize: '2rem', color: 'var(--accent-danger)', margin: '0 0 1rem 0' }}>{activeEvent.title}</h3>

                        <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                                {activeEvent.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Waste Type:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--accent-warning)', padding: '0.2rem 0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.25rem' }}>{activeEvent.wasteType}</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '2rem' }}>
                            You rolled a <span style={{ color: 'var(--accent-primary)' }}>{diceRoll}</span>, but lost <span style={{ color: 'var(--accent-danger)' }}>{activeEvent.stepsLost}</span> steps!
                            <br />
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Net Forward Progress: {diceRoll - activeEvent.stepsLost} space(s)</span>
                        </div>

                        <button className="btn btn-primary" onClick={resolveEvent} style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', background: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }}>
                            Accept Loss & Continue
                        </button>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}} />
        </div>
    );
}
