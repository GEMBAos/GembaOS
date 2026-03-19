import { useState, useRef } from 'react';

// Define the waste target types
type WasteType = 'defect' | 'motion' | 'inventory' | 'waiting' | 'transportation';

interface WasteTarget {
    id: string;
    type: WasteType;
    x: number; // Percentage X
    y: number; // Percentage Y
    description: string;
    points: number;
    found: boolean;
}

const INITIAL_TARGETS: WasteTarget[] = [
    { id: '1', type: 'defect', x: 25, y: 40, description: 'Scrap material left on the floor', points: 10, found: false },
    { id: '2', type: 'inventory', x: 70, y: 65, description: 'Excess boxes stacked far beyond daily need', points: 15, found: false },
    { id: '3', type: 'motion', x: 45, y: 80, description: 'Tools left far away from the assembly point', points: 10, found: false },
    { id: '4', type: 'waiting', x: 15, y: 60, description: 'Operator waiting for materials to arrive', points: 20, found: false },
    { id: '5', type: 'transportation', x: 85, y: 30, description: 'Forklift moving empty pallets an unnecessary distance', points: 15, found: false }
];

export default function ScavengerHunt() {
    const [targets, setTargets] = useState<WasteTarget[]>(INITIAL_TARGETS);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Find the 5 Lean Wastes hidden in the production area!');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTargetClick = (targetId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent container click event

        setTargets(prev => prev.map(t => {
            if (t.id === targetId && !t.found) {
                setScore(s => s + t.points);
                setMessage(`+${t.points} points! Found: ${t.description}`);
                return { ...t, found: true };
            }
            return t;
        }));
    };

    const handleMissClick = () => {
        setMessage('Keep looking! Click on the areas that represent waste (DOWNTIME).');
    };

    const totalFound = targets.filter(t => t.found).length;
    const isComplete = totalFound === targets.length;

    const resetGame = () => {
        setTargets(INITIAL_TARGETS);
        setScore(0);
        setMessage('Find the 5 Lean Wastes hidden in the production area!');
    };

    return (
        <div style={{ padding: 'max(1.5rem, 3vw)', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            <header style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
                    Lean Scavenger Hunt 🕵️
                </h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ background: 'var(--bg-panel)', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--border-light)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Score: </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-success)' }}>{score}</span>
                    </div>
                    <div style={{ background: 'var(--bg-panel)', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--border-light)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Found: </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>{totalFound} / {targets.length}</span>
                    </div>
                </div>
            </header>

            <div style={{ textAlign: 'center', fontSize: '1.1rem', color: isComplete ? 'var(--accent-success)' : 'var(--text-main)', minHeight: '30px' }}>
                {isComplete ? '🎉 Incredible! You found all the hidden wastes. Gemba Walk complete!' : message}
            </div>

            {/* Hidden Object Area */}
            <div
                ref={containerRef}
                onClick={handleMissClick}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '900px',
                    height: '500px',
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '1rem',
                    border: '2px solid var(--border-light)',
                    overflow: 'hidden',
                    cursor: 'crosshair',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
            >
                {/* Simulated Environment Elements (Background details) */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '150px', height: '100px', border: '2px dashed #334155' }} />
                <div style={{ position: 'absolute', top: '50%', left: '40%', width: '200px', height: '80px', border: '2px dashed #334155' }} />
                <div style={{ position: 'absolute', top: '70%', right: '10%', width: '120px', height: '120px', border: '2px dashed #334155' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: '300px', height: '40px', border: '2px dashed #334155', background: 'rgba(51, 65, 85, 0.2)' }} />

                <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                    *Click areas that represent processing waste*
                </div>

                {/* Clickable Targets */}
                {targets.map(target => (
                    <button
                        key={target.id}
                        onClick={(e) => handleTargetClick(target.id, e)}
                        style={{
                            position: 'absolute',
                            left: `${target.x}%`,
                            top: `${target.y}%`,
                            width: '40px',
                            height: '40px',
                            transform: 'translate(-50%, -50%)',
                            background: target.found ? 'var(--accent-success)' : 'rgba(255, 255, 255, 0.05)',
                            border: target.found ? '2px solid white' : '2px dashed rgba(255, 255, 255, 0.3)',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'all 0.3s ease',
                            opacity: target.found ? 1 : (isComplete ? 0.3 : 1) // Dim unfound targets if game over (not applicable here since all must be found, but good practice)
                        }}
                    >
                        {target.found && '✓'}
                    </button>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={resetGame}>
                    🔄 Restart Hunt
                </button>
            </div>
        </div >
    );
}
