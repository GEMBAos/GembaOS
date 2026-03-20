import { useState, useEffect } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { CycleTime } from '../../types/improvement';

const SETTINGS_KEY = 'gembaos_line_balance_settings';

export default function LineBalanceBuilder({ onClose }: { onClose: () => void }) {
    const getInitialSettings = () => {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) { console.error("Could not load saved data", e); }
        return { targetUPH: 60, laborRate: 25 };
    };

    const initialSettings = getInitialSettings();
    const [targetUPH, setTargetUPH] = useState<number>(initialSettings.targetUPH);
    const [laborRate, setLaborRate] = useState<number>(initialSettings.laborRate);
    
    // Stations map to CycleTime entities
    const [stations, setStations] = useState<CycleTime[]>([]);

    // Database Import State
    const [importingStationId, setImportingStationId] = useState<string | null>(null);
    const [availableTimeStudies, setAvailableTimeStudies] = useState<any[]>([]);

    // Eyes-Up Haptic Pacer State
    const [activePacerId, setActivePacerId] = useState<string | null>(null);
    const [pacerElapsed, setPacerElapsed] = useState(0);
    const [pacerRunning, setPacerRunning] = useState(false);

    const refreshData = () => {
        const existingData = ImprovementEngine.getItemsByType<CycleTime>('CycleTime');
        // If empty, generate default ones for demonstration
        if (existingData.length === 0) {
            ImprovementEngine.createItem<CycleTime>({ type: 'CycleTime', stationName: 'Assembly 1', operatorsCount: 1, workContent: [15, 20, 10], recordedTimes: [48, 50, 47] });
            ImprovementEngine.createItem<CycleTime>({ type: 'CycleTime', stationName: 'Assembly 2', operatorsCount: 1, workContent: [30, 20], recordedTimes: [55, 52, 58] });
            ImprovementEngine.createItem<CycleTime>({ type: 'CycleTime', stationName: 'Quality Check', operatorsCount: 1, workContent: [30], recordedTimes: [30, 32] });
            setStations(ImprovementEngine.getItemsByType<CycleTime>('CycleTime'));
        } else {
            setStations(existingData);
        }
    };

    console.log("Stations state in LineBalanceBuilder:", stations);

    useEffect(() => {
        refreshData();
        const listener = () => refreshData();
        window.addEventListener('improvement_data_updated', listener);
        return () => window.removeEventListener('improvement_data_updated', listener);
    }, []);

    // Save settings to local storage whenever critical state changes
    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ targetUPH, laborRate }));
    }, [targetUPH, laborRate]);

    const taktTime = targetUPH > 0 ? 3600 / targetUPH : 0;
    
    // NEW MATH FUNCTIONS
    const getWorkContent = (station: CycleTime) => station.workContent.reduce((sum, val) => sum + val, 0);
    
    // Cycle time is the measured actual. If no samples, fallback to work content sum.
    const getCycleTime = (station: CycleTime) => station.recordedTimes.length > 0 
        ? station.recordedTimes.reduce((a, b) => a + b, 0) / station.recordedTimes.length 
        : getWorkContent(station);

    const totalLaborContent = stations.reduce((sum, s) => sum + getWorkContent(s), 0);
    const minTheoreticalOperators = taktTime > 0 ? totalLaborContent / taktTime : 0;

    const cycleTimesList = stations.map(getCycleTime);
    const bottleneckTime = cycleTimesList.length > 0 ? Math.max(...cycleTimesList) : 0;
    const bottleneckStation = stations.find((_, i) => cycleTimesList[i] === bottleneckTime)?.stationName || 'None';
    
    // Line Capacity (units per hour based on slowest station ACTUAL cycle)
    const lineCapacityUPH = bottleneckTime > 0 ? 3600 / bottleneckTime : 0;
    const totalOperators = stations.reduce((sum, s) => sum + s.operatorsCount, 0);
    
    // UPM (Units Per Man Hour)
    const upm = totalOperators > 0 ? lineCapacityUPH / totalOperators : 0;
    
    // Labor Cost Per Unit
    const laborCostPerUnit = totalOperators > 0 && lineCapacityUPH > 0 ? (totalOperators * laborRate) / lineCapacityUPH : 0;

    // Balance Efficiency (Total Work Content / (Operators * Bottleneck))
    const balanceEfficiency = (totalOperators > 0 && bottleneckTime > 0) 
        ? (totalLaborContent / (totalOperators * bottleneckTime)) * 100 
        : 0;

    const addStation = () => {
        ImprovementEngine.createItem<CycleTime>({
            type: 'CycleTime',
            stationName: `Station ${stations.length + 1}`,
            operatorsCount: 1,
            workContent: [],
            recordedTimes: []
        });
    };

    const addCycleTimeSample = (stationId: string, time: number) => {
        const station = stations.find(s => s.id === stationId);
        if (station) {
            ImprovementEngine.updateItem<CycleTime>(stationId, {
                recordedTimes: [...station.recordedTimes, time]
            });
        }
    };

    const addWorkContentElement = (stationId: string, time: number) => {
        const station = stations.find(s => s.id === stationId);
        if (station) {
            ImprovementEngine.updateItem<CycleTime>(stationId, {
                workContent: [...station.workContent, time]
            });
        }
    };

    const updateStationName = (id: string, name: string) => {
        ImprovementEngine.updateItem<CycleTime>(id, { stationName: name });
    };

    const importFromTimeStudy = (stationId: string) => {
        const studies = ImprovementEngine.getItemsByType<any>('TimeStudySession');
        setAvailableTimeStudies(studies);
        if (studies.length === 0) {
            alert("No exported Time Studies found in the Global Engine. Go to the Observe tool, run a Time Study, and click Export first.");
            return;
        }
        setImportingStationId(stationId);
    };

    const handleSelectTimeStudy = (studyId: string) => {
        if (!importingStationId) return;
        const study = availableTimeStudies.find(s => s.id === studyId);
        if (study) {
            const station = stations.find(s => s.id === importingStationId);
            if (station && study.laps && study.laps.length > 0) {
                const newTimes = study.laps.map((l: any) => parseFloat((l.timeMs / 1000).toFixed(1)));
                ImprovementEngine.updateItem<CycleTime>(importingStationId, {
                    recordedTimes: [...station.recordedTimes, ...newTimes]
                });
            }
        }
        setImportingStationId(null);
    };

    // Pacer / Haptic Logic
    const playBeep = (freq: number, duration: number, vol = 0.1) => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            gain.gain.value = vol;
            osc.start();
            setTimeout(() => { osc.stop(); ctx.close(); }, duration);
        } catch (e) { /* ignore */ }
    };

    const vibrate = (pattern: number | number[]) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        } else {
            playBeep(400, 100);
        }
    };

    useEffect(() => {
        let interval: any;
        if (pacerRunning && taktTime > 0) {
            interval = setInterval(() => {
                setPacerElapsed(prev => {
                    const next = prev + 1;
                    
                    const isQuarter = Math.abs(next - Math.round(taktTime * 0.25)) < 0.1;
                    const isHalf = Math.abs(next - Math.round(taktTime * 0.5)) < 0.1;
                    const isThreeQ = Math.abs(next - Math.round(taktTime * 0.75)) < 0.1;
                    const isFull = Math.abs(next - Math.round(taktTime)) < 0.1;

                    if (isQuarter || isThreeQ) {
                        vibrate(50);
                    } else if (isHalf) {
                        vibrate([50, 50, 50]);
                    } else if (isFull) {
                        vibrate([100, 100, 200, 100]); // heavy warning
                        playBeep(200, 400, 0.2);
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [pacerRunning, taktTime]);

    const handleRecordPacer = () => {
        if (activePacerId && pacerElapsed > 0) {
            addCycleTimeSample(activePacerId, pacerElapsed);
            vibrate(100);
            setPacerElapsed(0); // reset lap
        }
    };

    // Chart scaling
    const maxChartValue = Math.max(taktTime * 1.2, bottleneckTime * 1.2, 60);

    return (
        <HardwareConsoleLayout 
            toolId="L-01 CYCLE TIME ANALYSIS" 
            toolName="LINE BALANCE BUILDER" 
            onClose={onClose}
        >
            {/* Database Import Modal Overaly */}
            {importingStationId && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: '12px', border: '1px solid #38bdf8' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: '#38bdf8', fontFamily: "'Orbitron', sans-serif" }}>IMPORT FROM DATABASE</h2>
                            <button onClick={() => setImportingStationId(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>Select an exported Time Study from the Global Engine to populate this station's cycle times.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                            {availableTimeStudies.map(study => (
                                <div 
                                    key={study.id} 
                                    onClick={() => handleSelectTimeStudy(study.id)}
                                    style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 'bold' }}>{study.sessionName}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{study.laps?.length || 0} cycles recorded</div>
                                    </div>
                                    <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}>
                                        {study.averageCycleTimeSeconds?.toFixed(1)}s Avg
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Haptic Pacer Overlay */}
            {activePacerId && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: `1px solid ${pacerElapsed > taktTime ? 'var(--accent-danger)' : 'var(--accent-primary)'}` }}>
                        
                        {/* Progress Background */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${Math.min(100, (pacerElapsed / (taktTime || 60)) * 100)}%`, background: pacerElapsed > taktTime ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.1)', transition: 'height 1s linear', zIndex: 0 }}></div>

                        <button onClick={() => { setActivePacerId(null); setPacerRunning(false); setPacerElapsed(0); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer', zIndex: 10 }}>×</button>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{ color: 'var(--text-muted)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Eyes-Up Time Study</h2>
                            <div style={{ fontSize: '5rem', fontWeight: 'bold', color: pacerElapsed > taktTime ? 'var(--accent-danger)' : 'white', fontVariantNumeric: 'tabular-nums', lineHeight: '1' }}>
                                {pacerElapsed}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>s</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '3rem' }}>
                                Target Takt: {taktTime.toFixed(1)}s
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button 
                                    onClick={() => setPacerRunning(!pacerRunning)}
                                    style={{ background: pacerRunning ? 'rgba(255,255,255,0.1)' : 'var(--accent-primary)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}
                                >
                                    {pacerRunning ? 'PAUSE' : 'START'}
                                </button>
                                <button 
                                    onClick={handleRecordPacer}
                                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', flex: 1, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                                >
                                    LAP ↩
                                </button>
                            </div>
                            
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2rem', opacity: 0.7 }}>
                                📱 Phone will vibrate to pace you against Takt Time. Keep your eyes on the physical process.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2%', width: '100%' }}>
                {/* Control Panel / Metrics */}
                <div style={{ flex: '1 1 min(100%, 300px)', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Global Settings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: '#cbd5e1', marginBottom: '0.25rem' }}>Target Output (Units/Hr)</label>
                                <input 
                                    type="number" 
                                    value={targetUPH} 
                                    onChange={(e) => setTargetUPH(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #475569', color: 'white', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', color: '#cbd5e1', marginBottom: '0.25rem' }}>Labor Rate ($/Hr)</label>
                                <input 
                                    type="number" 
                                    value={laborRate} 
                                    onChange={(e) => setLaborRate(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #475569', color: 'white', borderRadius: '4px', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Measured Production Metrics (Against Takt) */}
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Production vs Takt</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Takt Time:</span>
                                <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)' }}>{taktTime.toFixed(1)}s</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Bottleneck Station:</span>
                                <span style={{ fontWeight: 'bold', color: '#f87171', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)' }}>{bottleneckStation}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Max Cycle Time:</span>
                                <span style={{ fontWeight: 'bold', color: '#f87171', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)' }}>{bottleneckTime.toFixed(1)}s</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Line Capacity:</span>
                                <span style={{ fontWeight: 'bold', color: '#4ade80', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)' }}>{Math.floor(lineCapacityUPH)} UPH</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Labor & Work Content Metrics */}
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Line Design & Labor</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Total Labor Content:</span>
                                <span style={{ fontWeight: 'bold' }}>{totalLaborContent.toFixed(1)}s</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Total Operators:</span>
                                <span style={{ fontWeight: 'bold' }}>{totalOperators}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Min Operators:</span>
                                <span style={{ fontWeight: 'bold', color: '#fcd34d' }}>{minTheoreticalOperators.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Balance Eff:</span>
                                <span style={{ fontWeight: 'bold', color: balanceEfficiency >= 85 ? '#4ade80' : '#ffffff' }}>{balanceEfficiency.toFixed(1)}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>UPM:</span>
                                <span style={{ fontWeight: 'bold' }}>{upm.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#cbd5e1', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>Labor / Unit:</span>
                                <span style={{ fontWeight: 'bold', color: '#cbd5e1' }}>${laborCostPerUnit.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Analysis & Next Steps</h3>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', lineHeight: '1.5', color: '#cbd5e1' }}>
                            {bottleneckTime > taktTime ? (
                                <div>
                                    <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.5rem' }}>🚨 Demand Not Met</strong>
                                    The bottleneck is <strong>{bottleneckStation}</strong> ({bottleneckTime.toFixed(1)}s). 
                                    It needs to be reduced by at least <strong>{(bottleneckTime - taktTime).toFixed(1)}s</strong> to meet Takt ({taktTime.toFixed(1)}s).
                                    <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem', color: '#94a3b8' }}>
                                        <li>Observe {bottleneckStation} for motion waste.</li>
                                        <li>Can tasks be shifted to a faster station?</li>
                                    </ul>
                                </div>
                            ) : bottleneckTime > 0 ? (
                                <div>
                                    <strong style={{ color: '#22c55e', display: 'block', marginBottom: '0.5rem' }}>✅ Demand Met</strong>
                                    Line capacity ({Math.floor(lineCapacityUPH)} UPH) exceeds target ({targetUPH} UPH).
                                    <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem', color: '#94a3b8' }}>
                                        <li>Focus on standardizing the work to reduce cycle time variation.</li>
                                        <li>Look for 2-second improvements to make the work easier.</li>
                                    </ul>
                                </div>
                            ) : (
                                <span>Add station data to see analysis.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Yamazumi Chart & Station Data */}
                <div style={{ flex: '3 1 min(100%, 600px)', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    
                    {/* Yamazumi Chart */}
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: 'clamp(1rem, 2vw, 2rem)', border: '1px solid rgba(148, 163, 184, 0.2)', position: 'relative', height: 'clamp(300px, 40vh, 450px)', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', gap: '1rem', overflowX: 'auto', overflowY: 'hidden' }}>
                        
                        {/* Takt Time Line */}
                        <div style={{ position: 'absolute', bottom: `calc(${(taktTime / maxChartValue) * 100}% + 2rem)`, left: '2rem', right: '2rem', height: '2px', background: '#38bdf8', zIndex: 10 }}>
                            <span style={{ position: 'absolute', right: 0, top: '-20px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 'bold' }}>Takt: {taktTime.toFixed(1)}s</span>
                        </div>

                        {stations.map((station) => {
                            const cycleTime = getCycleTime(station);
                            const workContent = getWorkContent(station);
                            
                            const heightPct = (cycleTime / maxChartValue) * 100;
                            
                            const isOverTakt = cycleTime > taktTime;
                            
                            return (
                                <div key={station.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 5 }}>
                                    
                                    {/* Measured Cycle Time Bar */}
                                    <div style={{ position: 'relative', width: '80%', height: `${heightPct}%`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <div style={{ position: 'absolute', top: '-25px', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 'bold' }}>{cycleTime.toFixed(1)}s</div>
                                        <div style={{ 
                                            position: 'absolute',
                                            bottom: 0,
                                            width: '100%', 
                                            height: '100%', 
                                            background: isOverTakt ? 'linear-gradient(180deg, #f87171 0%, #b91c1c 100%)' : 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                                            borderRadius: '4px 4px 0 0',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                                            transition: 'height 0.3s ease',
                                            zIndex: 2
                                        }}></div>

                                        {/* Work Content Ghost Bar (Underneath/Dashed outline) */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: '80%',
                                            height: `${cycleTime > 0 ? (workContent / cycleTime) * 100 : 0}%`,
                                            background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)',
                                            border: '1px dashed rgba(255,255,255,0.5)',
                                            borderBottom: 'none',
                                            zIndex: 3,
                                            pointerEvents: 'none'
                                        }}></div>
                                    </div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', wordBreak: 'break-word', height: '2rem' }}>
                                        {station.stationName}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Editor List */}
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', letterSpacing: '1px', margin: 0 }}>Station Data</h3>
                            <button onClick={addStation} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>+ Add Station</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stations.map((station, idx) => {
                                const cycleTime = getCycleTime(station);
                                const workContent = getWorkContent(station);
                                const variance = cycleTime - taktTime;
                                const statusColor = variance > 0 ? '#ef4444' : Math.abs(variance) < 2 ? '#ffffff' : '#10b981';

                                return (
                                <div key={station.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: `1px solid ${statusColor}40`, flexWrap: 'wrap' }}>
                                    <div style={{ fontWeight: 'bold', color: '#64748b', width: '20px', marginTop: '0.5rem' }}>{idx + 1}.</div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1 1 200px' }}>
                                        <input 
                                            value={station.stationName} 
                                            onChange={(e) => updateStationName(station.id, e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem', width: '100%', borderRadius: '4px', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', fontWeight: 'bold' }}
                                        />
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)' }}>
                                            <div style={{ color: '#cbd5e1' }}>Cycle <strong style={{color: 'white', display: 'block', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)'}}>{cycleTime.toFixed(1)}s</strong></div>
                                            <div style={{ color: '#94a3b8' }}>Work <strong style={{color: '#cbd5e1', display: 'block', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)'}}>{workContent.toFixed(1)}s</strong></div>
                                            <div style={{ color: '#94a3b8' }}>Var <strong style={{color: statusColor, display: 'block', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)'}}>{variance > 0 ? '+' : ''}{variance.toFixed(1)}s</strong></div>
                                        </div>
                                        <div style={{ color: statusColor, fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.25rem', letterSpacing: '1px' }}>
                                            {variance > 0 ? 'OVER TAKT' : Math.abs(variance) < 2 ? 'NEAR TAKT' : 'UNDER TAKT'}
                                        </div>
                                    </div>
                                    
                                    <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        
                                        {/* Work Elements Area */}
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px' }}>
                                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Design Work Elements</div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                {station.workContent.map((t, i) => (
                                                    <span key={`wc-${i}`} style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#fca5a5', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid rgba(248, 113, 113, 0.3)' }}>{t}s</span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input 
                                                    type="number" 
                                                    placeholder="Step Time"
                                                    id={`wc-input-${station.id}`}
                                                    style={{ width: '100px', background: 'rgba(0,0,0,0.5)', border: '1px solid #475569', color: 'white', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = Number(e.currentTarget.value);
                                                            if (val > 0) { addWorkContentElement(station.id, val); e.currentTarget.value = ''; }
                                                        }
                                                    }}
                                                />
                                                <button onClick={() => {
                                                    const input = document.getElementById(`wc-input-${station.id}`) as HTMLInputElement;
                                                    if (input && Number(input.value) > 0) { addWorkContentElement(station.id, Number(input.value)); input.value = ''; }
                                                }} style={{ background: 'transparent', color: '#fca5a5', border: '1px solid #fca5a5', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Element</button>
                                            </div>
                                        </div>

                                        {/* Observed Cycle Times Area */}
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8' }}>Observed Cycle Times</div>
                                                <button onClick={() => importFromTimeStudy(station.id)} style={{ background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                                    Import Time Study
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                {station.recordedTimes.map((t, i) => (
                                                    <span key={`rt-${i}`} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>{t}s</span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <input 
                                                    type="number" 
                                                    placeholder="Sample Time"
                                                    id={`time-input-${station.id}`}
                                                    style={{ width: '120px', background: 'rgba(0,0,0,0.5)', border: '1px solid #475569', color: 'white', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = Number(e.currentTarget.value);
                                                            if (val > 0) { addCycleTimeSample(station.id, val); e.currentTarget.value = ''; }
                                                        }
                                                    }}
                                                />
                                                <button onClick={() => {
                                                    const input = document.getElementById(`time-input-${station.id}`) as HTMLInputElement;
                                                    if (input && Number(input.value) > 0) { addCycleTimeSample(station.id, Number(input.value)); input.value = ''; }
                                                }} style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid #38bdf8', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Sample</button>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                                <button onClick={() => { setActivePacerId(station.id); setPacerElapsed(0); setPacerRunning(false); }} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                                                    ⏱️ START HAPTIC TIME STUDY
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>
            </div>
        </HardwareConsoleLayout>
    );
}
