import { useState, useEffect, useRef } from 'react';
import type { KaizenProject } from '../../types';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { TimeStudySession } from '../../types/improvement';

interface TimeStudyProps {
    project?: KaizenProject;
    onUpdateProject?: (p: KaizenProject) => void;
    onClose?: () => void;
    onNavigate?: (tool: string) => void;
}

interface LapData {
    id: string;
    description: string;
    timeMs: number;
}

export default function TimeStudy({ project, onUpdateProject, onClose, onNavigate }: TimeStudyProps) {
    // Stopwatch State
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [laps, setLaps] = useState<LapData[]>(project?.timeStudyData?.laps || []);
    const [currentLapDesc, setCurrentLapDesc] = useState('');

    // Takt Time State
    const [availableHours, setAvailableHours] = useState<number>(project?.timeStudyData?.availableHours || 8);
    const [demand, setDemand] = useState<number>(project?.timeStudyData?.demand || 100);

    const saveTimeStudyData = (newLaps: LapData[], newHours: number, newDemand: number) => {
        if (project && onUpdateProject) {
            onUpdateProject({
                ...project,
                timeStudyData: {
                    availableHours: newHours,
                    demand: newDemand,
                    laps: newLaps
                }
            });
        }
    };

    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    // Timer Logic
    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - elapsedTime;
            timerRef.current = window.setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, elapsedTime]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleExportSession = () => {
        if (laps.length === 0) return;
        const averageCycleTimeSeconds = laps.reduce((acc, lap) => acc + lap.timeMs, 0) / laps.length / 1000;
        
        ImprovementEngine.createItem<TimeStudySession>({
            type: 'TimeStudySession',
            sessionName: `Observed Time Study - ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
            laps: laps.map(l => ({ ...l })),
            averageCycleTimeSeconds
        });
        
        if (onClose) {
            onClose();
        }
        if (onNavigate) {
            setTimeout(() => onNavigate('line-balance'), 100);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        setLaps([]);
        setCurrentLapDesc('');
        saveTimeStudyData([], availableHours, demand);
    };

    const handleLap = () => {
        if (!isRunning && elapsedTime === 0) return;

        // Calculate the time for this specific lap
        const previousLapsTime = laps.reduce((acc, lap) => acc + lap.timeMs, 0);
        const currentLapTime = elapsedTime - previousLapsTime;

        if (currentLapTime <= 0) return;

        const newLap = {
            id: Math.random().toString(36).substr(2, 9),
            description: currentLapDesc.trim() || `Step ${laps.length + 1}`,
            timeMs: currentLapTime
        };
        
        const newLaps = [...laps, newLap];
        setLaps(newLaps);
        setCurrentLapDesc('');
        saveTimeStudyData(newLaps, availableHours, demand);
    };

    // Format Time (MM:SS.ms)
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    // Calculations
    const taktTimeSeconds = demand > 0 ? (availableHours * 3600) / demand : 0;

    // The sum of all step averages (here we just use total elapsed time if we consider 1 full cycle, 
    // but the user might record one full cycle per lap. Let's assume each lap is a separate attempt to measure the full cycle, 
    // OR they are steps in a sequence. Let's treat them as individual cycle time observations of the same process).
    const averageCycleTimeSeconds = laps.length > 0
        ? (laps.reduce((acc, lap) => acc + lap.timeMs, 0) / laps.length) / 1000
        : 0;

    const isBottleneck = averageCycleTimeSeconds > taktTimeSeconds;

    return (
        <HardwareConsoleLayout
            toolId="TS-003"
            toolName={`Time Study ${project ? `[${project.name}]` : ''}`}
            onClose={onClose || (() => {})}
        >
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 2rem)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 30vw, 300px), 1fr))', gap: 'clamp(1rem, 2vw, 2rem)' }}>

                    {/* Takt Time Calculator */}
                    <div className="card" style={{ padding: 'clamp(1rem, 3vw, 2rem)', border: '1px solid var(--border-color)', background: 'var(--bg-panel)', borderRadius: '12px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <span style={{ color: 'var(--zone-yellow)' }}>📊</span> Target Settings
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label className="input-label" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: 'var(--text-main)' }}>Available Production Time (Hours)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={availableHours}
                                    onChange={e => {
                                        const h = Number(e.target.value);
                                        setAvailableHours(h);
                                    }}
                                    onBlur={() => saveTimeStudyData(laps, availableHours, demand)}
                                    min="0.1"
                                    step="0.5"
                                    style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label className="input-label" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: 'var(--text-main)' }}>Customer Demand (Units per shift)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={demand}
                                    onChange={e => {
                                        const d = Number(e.target.value);
                                        setDemand(d);
                                    }}
                                    onBlur={() => saveTimeStudyData(laps, availableHours, demand)}
                                    min="1"
                                    style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                                />
                            </div>
                        </div>

                        <div style={{
                            background: 'var(--bg-dark)',
                            padding: 'clamp(1rem, 2vw, 1.5rem)',
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            border: '1px dashed var(--zone-yellow)'
                        }}>
                            <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Calculated Takt Time</div>
                            <div style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem' }}>
                                {taktTimeSeconds.toFixed(1)} <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', color: 'var(--text-muted)', fontWeight: 'normal' }}>sec / unit</span>
                            </div>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)', color: 'var(--text-muted)' }}>Produce one unit every {taktTimeSeconds.toFixed(1)} seconds to meet demand.</p>
                        </div>
                    </div>

                    {/* Digital Stopwatch */}
                    <div className="card" style={{ padding: 'clamp(1rem, 3vw, 2rem)', border: '1px solid var(--border-color)', background: 'var(--bg-panel)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Observation</h3>

                        <div style={{
                            background: 'var(--bg-dark)',
                            borderRadius: '1rem',
                            padding: 'clamp(1rem, 3vw, 2rem)',
                            textAlign: 'center',
                            marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                            border: `2px solid ${isRunning ? '#ef4444' : 'var(--border-color)'}`,
                            boxShadow: isRunning ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
                            transition: 'all 0.3s'
                        }}>
                            <div style={{ fontFamily: '"Orbitron", monospace', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 'bold', color: 'var(--zone-yellow)', letterSpacing: '2px', textShadow: isRunning ? '0 0 10px rgba(239,68,68,0.5)' : 'none' }}>
                                {formatTime(elapsedTime)}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
                            <button
                                className="btn"
                                style={{
                                    background: isRunning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                    color: isRunning ? '#fca5a5' : '#6ee7b7',
                                    border: `1px solid ${isRunning ? '#ef4444' : '#10b981'}`,
                                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    borderRadius: '8px'
                                }}
                                onClick={handleStartStop}
                            >
                                {isRunning ? '⏸ Pause' : '▶️ Start'}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleLap}
                                disabled={elapsedTime === 0}
                                style={{ padding: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 'bold', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                ⏱️ Record Cycle
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Note for next cycle (e.g., 'Operator A')"
                                value={currentLapDesc}
                                onChange={e => setCurrentLapDesc(e.target.value)}
                                style={{ flex: 1, minWidth: '150px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.5rem' }}
                            />
                            <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', minWidth: '100px', fontSize: '0.85rem' }} onClick={handleReset}>Reset All</button>
                        </div>
                    </div>
                </div>

                {/* Analysis Results */}
                {laps.length > 0 && (
                    <div className="card" style={{ padding: 'clamp(1rem, 3vw, 2rem)', border: isBottleneck ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(16, 185, 129, 0.5)', background: 'var(--bg-panel)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', textTransform: 'uppercase', letterSpacing: '1px' }}>Observation Log ({laps.length} cycles)</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Cycle Time</div>
                                    <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 'bold', color: 'var(--text-main)' }}>{averageCycleTimeSeconds.toFixed(1)}s</div>
                                </div>
                                <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
                                    <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 'bold', color: isBottleneck ? '#ef4444' : '#10b981' }}>
                                        {isBottleneck ? '⚠️ Bottleneck Detected' : '✅ Meeting Takt Time'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isBottleneck && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 'clamp(0.75rem, 2vw, 1rem)', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444', marginBottom: '1.5rem', fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)', color: '#fca5a5' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong>Warning:</strong> The current process takes {(averageCycleTimeSeconds - taktTimeSeconds).toFixed(1)} seconds longer than the required Takt Time. You will not meet customer demand unless this cycle time is reduced.
                                </div>
                                <div style={{ background: 'var(--bg-dark)', border: '1px dashed var(--zone-yellow)', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏃‍♂️</div>
                                    <h4 style={{ color: 'var(--zone-yellow)', margin: '0 0 0.5rem 0' }}>Detect Motion Waste</h4>
                                    <p style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '0.85rem' }}>Excessive cycle time is often caused by physical layout inefficiencies. Trace the operator's path to identify transportation and motion waste.</p>
                                    <button
                                        onClick={() => {
                                            if (onClose) onClose();
                                            if (onNavigate) setTimeout(() => onNavigate('motion-v2'), 100);
                                        }}
                                        style={{ padding: '0.75rem 1.5rem', background: 'var(--zone-yellow)', color: '#0f172a', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', width: '100%', maxWidth: '300px' }}
                                    >
                                        START MOTION MAPPING FLOW
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '0.75rem 0' }}>#</th>
                                        <th style={{ padding: '0.75rem 0' }}>Description</th>
                                        <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Cycle Time</th>
                                        <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Vs Takt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laps.map((lap, index) => {
                                        const lapSec = lap.timeMs / 1000;
                                        const diff = lapSec - taktTimeSeconds;
                                        return (
                                            <tr key={lap.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}>{index + 1}</td>
                                                <td style={{ padding: '1rem 0', fontWeight: 'bold', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', color: 'var(--text-main)' }}>{lap.description}</td>
                                                <td style={{ padding: '1rem 0', textAlign: 'right', fontFamily: '"Orbitron", monospace', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'var(--zone-yellow)' }}>{formatTime(lap.timeMs)}</td>
                                                <td style={{ padding: '1rem 0', textAlign: 'right', color: diff > 0 ? '#fca5a5' : '#4ade80', fontWeight: 'bold', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}>
                                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}s
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={handleExportSession}
                                style={{ 
                                    background: 'var(--zone-yellow)', 
                                    color: '#0f172a', 
                                    border: 'none', 
                                    padding: '1rem 2rem', 
                                    borderRadius: '8px', 
                                    fontWeight: 'bold', 
                                    fontSize: '1rem', 
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(255, 194, 14, 0.2)'
                                }}
                            >
                                💾 EXPORT TO YAMAZUMI BUILDER
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </HardwareConsoleLayout>
    );
}
