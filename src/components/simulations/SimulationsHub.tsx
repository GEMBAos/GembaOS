import { useState } from 'react';
import MouseTravelGame from './MouseTravelGame';
import DiceFlowGame from './DiceFlowGame';
import FiveSNumbersGame from './FiveSNumbersGame';
import SpotTheDifference from './SpotTheDifference';
import SpotTheBottleneck from './SpotTheBottleneck';
import ProcessBoardGame from './ProcessBoardGame';
import ScavengerHunt from './ScavengerHunt';

interface SimulationsHubProps {
    onNavigate?: (view: string) => void;
}

export default function SimulationsHub(_props: SimulationsHubProps) {
    // onNavigate is available if we want a global "Back to UI Hub" button in the future
    const [activeGame, setActiveGame] = useState<'hub' | 'spaghetti' | 'dice' | '5s' | 'spot_difference' | 'spot_bottleneck' | 'board_game' | 'scavenger_hunt'>('hub');

    if (activeGame === 'spaghetti') {
        return (
            <div style={{ paddingBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveGame('hub')} style={{ marginBottom: '1rem' }}>← Back to Simulations</button>
                <MouseTravelGame />
            </div>
        );
    }

    if (activeGame === 'dice') {
        return (
            <div style={{ paddingBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveGame('hub')} style={{ marginBottom: '1rem' }}>← Back to Simulations</button>
                <DiceFlowGame />
            </div>
        );
    }

    if (activeGame === '5s') {
        return (
            <div style={{ paddingBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveGame('hub')} style={{ marginBottom: '1rem' }}>← Back to Simulations</button>
                <FiveSNumbersGame />
            </div>
        );
    }

    if (activeGame === 'spot_difference') {
        return (
            <div style={{ paddingBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveGame('hub')} style={{ marginBottom: '1rem' }}>← Back to Simulations</button>
                <SpotTheDifference />
            </div>
        );
    }

    if (activeGame === 'spot_bottleneck') {
        return (
            <div style={{ paddingBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveGame('hub')} style={{ marginBottom: '1rem' }}>← Back to Simulations</button>
                <SpotTheBottleneck />
            </div>
        );
    }

    if (activeGame === 'board_game') {
        return (
            <div style={{ paddingBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveGame('hub')} style={{ marginBottom: '1rem' }}>← Back to Simulations</button>
                <ProcessBoardGame />
            </div>
        );
    }

    if (activeGame === 'scavenger_hunt') {
        return (
            <div style={{ paddingBottom: '2rem' }}>
                <button className="btn" onClick={() => setActiveGame('hub')} style={{ marginBottom: '1rem' }}>← Back to Simulations</button>
                <ScavengerHunt />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                    Interactive Simulations
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                    Experience Lean principles firsthand. Play through these real-time gamified scenarios to understand the impact of Kaizen.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* Mouse Travel / Spaghetti Diagram Game */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>🖱️</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        Spaghetti Diagram Simulator
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, textAlign: 'center' }}>
                        Test how much distance your mouse travels in a poorly designed layout vs an optimized cellular layout. See the immediate impact of motion waste reduction.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => setActiveGame('spaghetti')}
                    >
                        Launch Simulation
                    </button>
                </div>

                {/* Dice Game / One-Piece Flow */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>🎲</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        Batch vs. One-Piece Flow
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, textAlign: 'center' }}>
                        The classic Lean dice game digitized. Compare the total Lead Time of assembling products in large batches versus a continuous one-piece flow.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => setActiveGame('dice')}
                    >
                        Launch Simulation
                    </button>
                </div>

                {/* 5S Numbers Game */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>🔢</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        The 5S Numbers Game
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, textAlign: 'center' }}>
                        A fast-paced 15-second challenge. Click numbers 1-49 in sequence amidst massive clutter, then see how performance skyrockets when you apply 5S organization.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => setActiveGame('5s')}
                    >
                        Launch Simulation
                    </button>
                </div>

                {/* Scavenger Hunt */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>🕵️</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        Lean Scavenger Hunt
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, textAlign: 'center' }}>
                        Explore a virtual environment and identify hidden sources of waste. Score points for every defect, wait time, or inventory pile you spot.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => setActiveGame('scavenger_hunt')}
                    >
                        Launch Game
                    </button>
                </div>

                {/* Spot the Difference */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>🔎</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        Spot the Waste (DOWNTIME)
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, textAlign: 'center' }}>
                        Can you spot the 8 wastes of Lean hidden in a messy workspace? Interact with a visual scene to uncover hidden defects, motion, and inventory waste.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => setActiveGame('spot_difference')}
                    >
                        Launch Simulation
                    </button>
                </div>

                {/* Spot the Bottleneck */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>⏳</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        Spot the Bottleneck
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, textAlign: 'center' }}>
                        Apply the Theory of Constraints. Analyze cycle times in various scenarios to correctly identify the bottleneck operation that limits throughput.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => setActiveGame('spot_bottleneck')}
                    >
                        Launch Simulation
                    </button>
                </div>

                {/* Process Board Game */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>🎲</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        Process Board Game
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, textAlign: 'center' }}>
                        Roll the die to move your product down the line. Watch out for Motion Wastes that steal your productive steps! Learn the true cost of poor 5S.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => setActiveGame('board_game')}
                    >
                        Launch Simulation
                    </button>
                </div>

            </div>
        </div>
    );
}
