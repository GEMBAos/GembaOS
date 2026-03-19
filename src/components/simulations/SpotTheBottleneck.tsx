import { useState } from 'react';

type Level = {
    id: number;
    title: string;
    description: string;
    stations: { name: string; cycleTime: number }[]; // Cycle time in seconds
    taktTime: number; // Customer demand rate
    explanation: string;
};

export default function SpotTheBottleneck() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedStationIndex, setSelectedStationIndex] = useState<number | null>(null);

    const levels: Level[] = [
        {
            id: 1,
            title: 'Level 1: The Simple Assembly Line',
            description: 'This line produces widgets. Based on the cycle times below, which station is the bottleneck?',
            stations: [
                { name: 'Cut', cycleTime: 12 },
                { name: 'Drill', cycleTime: 25 }, // Bottleneck
                { name: 'Sand', cycleTime: 18 },
                { name: 'Inspect', cycleTime: 10 },
            ],
            taktTime: 20,
            explanation: 'The Drill station takes the longest (25 seconds). According to the Theory of Constraints, the station with the longest cycle time limits the throughput of the entire system. Because it is slower than the Takt Time (20s), this line cannot meet customer demand.'
        },
        {
            id: 2,
            title: 'Level 2: The Hidden Trap',
            description: 'We sped up the Drill station! Now where is the bottleneck?',
            stations: [
                { name: 'Cut', cycleTime: 12 },
                { name: 'Drill', cycleTime: 15 },
                { name: 'Sand', cycleTime: 18 }, // Bottleneck
                { name: 'Inspect', cycleTime: 10 },
            ],
            taktTime: 20,
            explanation: 'When you improve the primary bottleneck, the constraint simply shifts to the next slowest process. In this case, Sanding (18s) became the new bottleneck. Continuous Improvement is an ongoing cycle!'
        },
        {
            id: 3,
            title: 'Level 3: The Order Processing Department',
            description: 'Bottlenecks happen in the office too. Which admin step is slowing down order entry?',
            stations: [
                { name: 'Receive Email', cycleTime: 45 },
                { name: 'Data Entry (ERP)', cycleTime: 120 }, // Bottleneck
                { name: 'Credit Check', cycleTime: 30 },
                { name: 'Send Confirmation', cycleTime: 15 },
            ],
            taktTime: 60,
            explanation: 'Data Entry takes 120 seconds per order. Notice how work (emails) will pile up as "inventory" in their inbox because the preceding step (45s) feeds work faster than Data Entry can process it.'
        }
    ];

    const currentLevel = levels[currentLevelIndex];

    const handleStationSelect = (index: number) => {
        if (showFeedback) return;
        setSelectedStationIndex(index);
        setShowFeedback(true);

        const bottleneckIndex = currentLevel.stations.reduce((maxIdx, station, idx, arr) =>
            station.cycleTime > arr[maxIdx].cycleTime ? idx : maxIdx
            , 0);

        if (index === bottleneckIndex) {
            setScore(prev => prev + 1);
        }
    };

    const nextLevel = () => {
        setShowFeedback(false);
        setSelectedStationIndex(null);
        if (currentLevelIndex < levels.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
        } else {
            setGameState('results');
        }
    };

    if (gameState === 'intro') {
        return (
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '4rem auto' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏱️</div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Spot the Bottleneck</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    The "Theory of Constraints" states that every system has at least one bottleneck that limits overall throughput.
                    Your job is to analyze the process flow and identify the constraining operation in each scenario.
                </p>

                <div style={{ background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid var(--accent-primary)', textAlign: 'left', marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent-primary)', margin: '0 0 0.5rem 0' }}>Key Terms</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <li><strong>Cycle Time:</strong> How long it takes to complete one piece at a specific station.</li>
                        <li><strong>Takt Time:</strong> The rhythmic rate at which customers demand the product.</li>
                        <li><strong>Bottleneck:</strong> The operation with the longest Cycle Time. Submarines can only go as fast as their slowest ship!</li>
                    </ul>
                </div>

                <button className="btn btn-primary" onClick={() => setGameState('playing')} style={{ padding: '1rem 3rem', fontSize: '1.5rem', fontWeight: 'bold' }}>START ANALYSIS</button>
            </div>
        );
    }

    if (gameState === 'results') {
        return (
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '4rem auto' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-success)', marginBottom: '1rem' }}>Analysis Complete!</h2>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '2rem 0', color: 'var(--text-main)' }}>
                    {score} / {levels.length}
                </div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    {score === levels.length ? 'Perfect execution! You are a master at identifying system constraints.' : 'Good effort! Keep practicing to train your eyes to see the flow.'}
                </p>

                {/* Final Lesson Wrapper */}
                <div style={{
                    marginTop: '2rem',
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                    borderRadius: '1rem',
                    border: '2px solid var(--accent-primary)',
                    textAlign: 'left',
                    boxShadow: '0 8px 30px rgba(59, 130, 246, 0.15)'
                }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--accent-primary)', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🎓</span> Lesson Learned: The Theory of Constraints
                    </h3>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        If you try to improve a non-bottleneck station (e.g., spending $10k to make the 10-second inspection step 5 seconds faster), <strong>your overall output will not increase by a single unit.</strong>
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.6, fontWeight: 'bold', borderLeft: '4px solid var(--accent-warning)', paddingLeft: '1rem', marginLeft: '1rem' }}>
                        An hour saved at a non-bottleneck is a mirage. An hour lost at a bottleneck is an hour lost for the entire system.
                    </p>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <button className="btn btn-primary" onClick={() => { setGameState('intro'); setCurrentLevelIndex(0); setScore(0); setShowFeedback(false); setSelectedStationIndex(null); }}>Play Again</button>
                </div>
            </div>
        );
    }

    const maxCycleTime = Math.max(...currentLevel.stations.map(s => s.cycleTime), currentLevel.taktTime);

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Header / Scoreboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-panel)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>Level {currentLevel.id} of {levels.length}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Score:</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{score}</span>
                </div>
            </div>

            {/* Main Play Area */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{currentLevel.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{currentLevel.description}</p>

                {/* Takt Time Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent-danger)' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', width: '100px' }}>Takt Time:</div>
                    <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: `${(currentLevel.taktTime / maxCycleTime) * 100}%`, transform: 'translateX(-50%)', background: 'var(--accent-danger)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 2 }}>
                            {currentLevel.taktTime}s
                        </div>
                        <div style={{ position: 'absolute', top: '-20px', bottom: '-280px', left: `${(currentLevel.taktTime / maxCycleTime) * 100}%`, width: '2px', background: 'var(--accent-danger)', opacity: 0.3, zIndex: 0, borderRight: '1px dashed rgba(255,0,0,0.5)' }}></div>
                    </div>
                </div>

                {/* Stations Bar Chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                    {currentLevel.stations.map((station, index) => {
                        const isSelected = selectedStationIndex === index;
                        const isActualBottleneck = station.cycleTime === Math.max(...currentLevel.stations.map(s => s.cycleTime));

                        let barColor = 'var(--bg-panel-hover)';
                        let borderColor = 'var(--border-color)';

                        if (showFeedback) {
                            if (isActualBottleneck) {
                                barColor = 'rgba(16, 185, 129, 0.3)'; // Green
                                borderColor = 'var(--accent-success)';
                            } else if (isSelected) {
                                barColor = 'rgba(239, 68, 68, 0.3)'; // Red
                                borderColor = 'var(--accent-danger)';
                            }
                        } else if (isSelected) {
                            borderColor = 'var(--accent-primary)';
                        }

                        return (
                            <div key={index}
                                onClick={() => handleStationSelect(index)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    cursor: showFeedback ? 'default' : 'pointer',
                                    padding: '0.5rem', borderRadius: '0.5rem',
                                    background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ width: '150px', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'right' }}>{station.name}</div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: `${(station.cycleTime / maxCycleTime) * 100}%`,
                                        height: '40px',
                                        background: barColor,
                                        border: `2px solid ${borderColor}`,
                                        borderRadius: '0.25rem',
                                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, border-color 0.3s',
                                        boxShadow: isSelected && !showFeedback ? '0 0 15px rgba(59, 130, 246, 0.5)' : 'none',
                                    }}></div>
                                    <div style={{ marginLeft: '1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{station.cycleTime}s</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Feedback Panel */}
                {showFeedback && (
                    <div style={{
                        marginTop: '1rem', padding: '1.5rem', borderRadius: '0.5rem',
                        background: 'var(--bg-dark)',
                        borderLeft: `4px solid ${currentLevel.stations[selectedStationIndex!].cycleTime === Math.max(...currentLevel.stations.map(s => s.cycleTime)) ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
                        animation: 'slideDown 0.3s forwards'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentLevel.stations[selectedStationIndex!].cycleTime === Math.max(...currentLevel.stations.map(s => s.cycleTime)) ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                            {currentLevel.stations[selectedStationIndex!].cycleTime === Math.max(...currentLevel.stations.map(s => s.cycleTime)) ? '✅ Correct! Bottleneck Identified.' : '❌ Incorrect Selection.'}
                        </h4>
                        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', lineHeight: 1.6 }}>{currentLevel.explanation}</p>
                        <button className="btn btn-primary" onClick={nextLevel}>Next Level →</button>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
