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

    // Video Stack-Up Intake State
    const [videoScanMode, setVideoScanMode] = useState(false);
    const [finishedGoodPhoto, setFinishedGoodPhoto] = useState<string | null>(null);
    const [videoSteps, setVideoSteps] = useState<{id: number, name: string, cycleSecs: number, videoBlob?: string}[]>([]);

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
            {/* Video Stack-Up Intake Modal */}
            {videoScanMode && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-main)', zIndex: 10000, display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                            <div>
                                <h2 style={{ margin: 0, color: 'var(--zone-yellow)', fontFamily: 'var(--font-headings)' }}>CURRENT STATE STACK-UP</h2>
                                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>Capture footage of your exact process flow to instantly build a baseline balance chart.</p>
                            </div>
                            <button onClick={() => setVideoScanMode(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {/* Top: Finished Good Photo */}
                        <div style={{ background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--lean-white)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📷</span> Step 1: Finished Product Condition</h3>
                            {!finishedGoodPhoto ? (
                                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px', border: '2px dashed #444', borderRadius: '8px', cursor: 'pointer', color: '#888' }}>
                                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>+</span>
                                    <span>Capture / Upload Finished Good</span>
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => { if (ev.target?.result) setFinishedGoodPhoto(ev.target.result as string); };
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }} />
                                </label>
                            ) : (
                                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                                    <img src={finishedGoodPhoto} alt="Finished Good" style={{ width: '100%', borderRadius: '8px' }} />
                                    <button onClick={() => setFinishedGoodPhoto(null)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>×</button>
                                </div>
                            )}
                        </div>

                        {/* Bottom: Process Sequence Array */}
                        <div style={{ background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--lean-white)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🎥</span> Step 2: Sequential Process Captures</h3>
                            
                            {videoSteps.map((step, idx) => (
                                <div key={step.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#111', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #222' }}>
                                    <div style={{ padding: '0.5rem', background: '#333', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{idx + 1}</div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input 
                                            value={step.name} 
                                            onChange={(e) => setVideoSteps(prev => prev.map(p => p.id === step.id ? {...p, name: e.target.value} : p))} 
                                            placeholder="Process Segment Name (e.g. Sub-Assembly)" 
                                            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #444', color: 'white', padding: '0.5rem 0', fontSize: '1rem' }} 
                                        />
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--zone-yellow)', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                Upload Segment Video
                                                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={() => {
                                                    // Simulated upload parsing mapping string "file" to fake blob URL
                                                    setVideoSteps(prev => prev.map(p => p.id === step.id ? {...p, videoBlob: 'loaded'} : p));
                                                }} />
                                            </label>
                                            <div style={{ color: step.videoBlob ? '#4ade80' : '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                {step.videoBlob ? '✓ Video Loaded' : 'Missing Video'}
                                            </div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                                                <label style={{ color: '#888', fontSize: '0.8rem' }}>Extracted Base Time (s):</label>
                                                <input 
                                                    type="number" 
                                                    value={step.cycleSecs || ''} 
                                                    onChange={(e) => setVideoSteps(prev => prev.map(p => p.id === step.id ? {...p, cycleSecs: Number(e.target.value)} : p))} 
                                                    style={{ width: '80px', background: '#222', border: '1px solid #444', color: 'white', padding: '0.5rem', borderRadius: '4px' }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setVideoSteps(prev => prev.filter(p => p.id !== step.id))} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                                </div>
                            ))}

                            <button onClick={() => setVideoSteps([...videoSteps, { id: Date.now(), name: '', cycleSecs: 0 }])} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed #444', color: '#aaa', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                + Add Next Process Segment
                            </button>
                        </div>

                        {/* Execute */}
                        <button 
                            onClick={() => {
                                // Overwrite existing stations with the new video stack up
                                const existing = ImprovementEngine.getItemsByType<CycleTime>('CycleTime');
                                existing.forEach(item => ImprovementEngine.deleteItem(item.id));
                                videoSteps.forEach(step => {
                                    if (step.name && step.cycleSecs > 0) {
                                        ImprovementEngine.createItem<CycleTime>({
                                            type: 'CycleTime',
                                            stationName: step.name,
                                            operatorsCount: 1,
                                            workContent: [step.cycleSecs],
                                            recordedTimes: [step.cycleSecs]
                                        });
                                    }
                                });
                                refreshData();
                                setVideoScanMode(false);
                            }}
                            style={{ width: '100%', padding: '1.5rem', background: 'var(--accent-primary)', border: 'none', color: '#000', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', opacity: videoSteps.length > 0 ? 1 : 0.5 }}
                        >
                            GENERATE CURRENT STATE YAMAZUMI
                        </button>
                    </div>
                </div>
            )}
            {/* Database Import Modal Overaly */}
            {importingStationId && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 10, 10, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: '12px', border: '1px solid var(--zone-yellow)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--zone-yellow)', fontFamily: "'Orbitron', sans-serif" }}>IMPORT FROM DATABASE</h2>
                            <button onClick={() => setImportingStationId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>Select an exported Time Study from the Global Engine to populate this station's cycle times.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                            {availableTimeStudies.map(study => (
                                <div 
                                    key={study.id} 
                                    onClick={() => handleSelectTimeStudy(study.id)}
                                    style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 'bold' }}>{study.sessionName}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{study.laps?.length || 0} cycles recorded</div>
                                    </div>
                                    <div style={{ background: 'rgba(255, 194, 14, 0.15)', color: 'var(--zone-yellow)', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}>
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
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${Math.min(100, (pacerElapsed / (taktTime || 60)) * 100)}%`, background: pacerElapsed > taktTime ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 194, 14, 0.1)', transition: 'height 1s linear', zIndex: 0 }}></div>

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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', width: '100%', fontFamily: "'Inter', sans-serif" }}>
                {/* Control Panel / Metrics */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Global Settings</h3>
                        
                        {/* New Camera Intake Button */}
                        <button 
                            onClick={() => setVideoScanMode(true)}
                            style={{ width: '100%', padding: '1rem', background: '#0a0a0c', border: '1px dashed var(--zone-yellow)', color: 'var(--zone-yellow)', borderRadius: '8px', marginBottom: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                            START NEW VIDEO STACK-UP
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--lean-white)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Target Output (Units/Hr)</label>
                                <input 
                                    type="number" 
                                    value={targetUPH} 
                                    onChange={(e) => setTargetUPH(Number(e.target.value))}
                                    style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--lean-white)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Labor Rate ($/Hr)</label>
                                <input 
                                    type="number" 
                                    value={laborRate} 
                                    onChange={(e) => setLaborRate(Number(e.target.value))}
                                    style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Measured Production Metrics (Against Takt) */}
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid var(--border-color)', borderRadius: '12px', minWidth: 0, overflow: 'hidden' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Production vs Takt</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Takt Time:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--zone-yellow)', fontSize: '1.2rem' }}>{taktTime.toFixed(1)}s</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Bottleneck Station:</span>
                                <span style={{ fontWeight: 'bold', color: '#f87171', fontSize: '1rem', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50%' }}>{bottleneckStation}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Max Cycle Time:</span>
                                <span style={{ fontWeight: 'bold', color: '#f87171', fontSize: '1.2rem' }}>{bottleneckTime.toFixed(1)}s</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Line Capacity:</span>
                                <span style={{ fontWeight: 'bold', color: '#4ade80', fontSize: '1.2rem' }}>{Math.floor(lineCapacityUPH)} UPH</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Labor & Work Content Metrics */}
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid var(--border-color)', borderRadius: '12px', minWidth: 0, overflow: 'hidden' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Line Design & Labor</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Total Labor Content:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--lean-white)', fontSize: '1.1rem' }}>{totalLaborContent.toFixed(1)}s</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Total Operators:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--lean-white)', fontSize: '1.1rem' }}>{totalOperators}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Min Operators:</span>
                                <span style={{ fontWeight: 'bold', color: '#fcd34d', fontSize: '1.1rem' }}>{minTheoreticalOperators.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Balance Eff:</span>
                                <span style={{ fontWeight: 'bold', color: balanceEfficiency >= 85 ? '#4ade80' : 'var(--lean-white)', fontSize: '1.1rem' }}>{balanceEfficiency.toFixed(1)}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>UPM:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--lean-white)', fontSize: '1.1rem' }}>{upm.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                                <span style={{ color: 'var(--lean-white)', fontSize: '0.9rem', opacity: 0.8 }}>Labor / Unit:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--lean-white)', fontSize: '1.1rem' }}>${laborCostPerUnit.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>Analysis & Next Steps</h3>
                        <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', lineHeight: '1.5', color: 'var(--text-main)' }}>
                            {bottleneckTime > taktTime ? (
                                <div>
                                    <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.5rem' }}>🚨 Demand Not Met</strong>
                                    The bottleneck is <strong>{bottleneckStation}</strong> ({bottleneckTime.toFixed(1)}s). 
                                    It needs to be reduced by at least <strong>{(bottleneckTime - taktTime).toFixed(1)}s</strong> to meet Takt ({taktTime.toFixed(1)}s).
                                    <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                                        <li>Observe {bottleneckStation} for motion waste.</li>
                                        <li>Can tasks be shifted to a faster station?</li>
                                    </ul>
                                </div>
                            ) : bottleneckTime > 0 ? (
                                <div>
                                    <strong style={{ color: '#22c55e', display: 'block', marginBottom: '0.5rem' }}>✅ Demand Met</strong>
                                    Line capacity ({Math.floor(lineCapacityUPH)} UPH) exceeds target ({targetUPH} UPH).
                                    <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
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
                <div style={{ flex: '3 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, fontFamily: "'Inter', sans-serif" }}>
                    
                    {/* Yamazumi Chart */}
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 2rem)', border: '1px solid var(--border-color)', position: 'relative', height: 'clamp(300px, 40vh, 450px)', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', gap: '1rem', overflowX: 'auto', overflowY: 'hidden' }}>
                        
                        {/* Takt Time Line */}
                        <div style={{ position: 'absolute', bottom: `calc(${(taktTime / maxChartValue) * 100}% + 2rem)`, left: '2rem', right: '2rem', height: '2px', background: 'var(--zone-yellow)', zIndex: 10 }}>
                            <span style={{ position: 'absolute', right: 0, top: '-20px', color: 'var(--zone-yellow)', fontSize: '0.8rem', fontWeight: 'bold' }}>Takt: {taktTime.toFixed(1)}s</span>
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
                                        <div style={{ position: 'absolute', top: '-25px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 'bold' }}>{cycleTime.toFixed(1)}s</div>
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
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', wordBreak: 'break-word', height: '2rem' }}>
                                        {station.stationName}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Editor List */}
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ textTransform: 'uppercase', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: 'var(--text-muted)', letterSpacing: '1px', margin: 0 }}>Station Data</h3>
                            <button onClick={addStation} style={{ background: 'var(--zone-yellow)', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>+ Add Station</button>
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
                                            <div style={{ color: 'var(--text-main)' }}>Cycle <strong style={{color: 'white', display: 'block', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)'}}>{cycleTime.toFixed(1)}s</strong></div>
                                            <div style={{ color: 'var(--text-muted)' }}>Work <strong style={{color: 'var(--text-main)', display: 'block', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)'}}>{workContent.toFixed(1)}s</strong></div>
                                            <div style={{ color: 'var(--text-muted)' }}>Var <strong style={{color: statusColor, display: 'block', fontSize: 'clamp(1rem, 1.5vw, 1.1rem)'}}>{variance > 0 ? '+' : ''}{variance.toFixed(1)}s</strong></div>
                                        </div>
                                        <div style={{ color: statusColor, fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.25rem', letterSpacing: '1px' }}>
                                            {variance > 0 ? 'OVER TAKT' : Math.abs(variance) < 2 ? 'NEAR TAKT' : 'UNDER TAKT'}
                                        </div>
                                    </div>
                                    
                                    <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        
                                        {/* Work Elements Area */}
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px' }}>
                                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Design Work Elements</div>
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
                                                    style={{ width: '100px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' }}
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
                                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Observed Cycle Times</div>
                                                <button onClick={() => importFromTimeStudy(station.id)} style={{ background: 'transparent', border: '1px solid var(--zone-yellow)', color: 'var(--zone-yellow)', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                                    Import Time Study
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                {station.recordedTimes.map((t, i) => (
                                                    <span key={`rt-${i}`} style={{ background: 'rgba(255, 194, 14, 0.1)', color: 'var(--zone-yellow)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid rgba(255, 194, 14, 0.3)' }}>{t}s</span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <input 
                                                    type="number" 
                                                    placeholder="Sample Time"
                                                    id={`time-input-${station.id}`}
                                                    style={{ width: '120px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.4rem', fontSize: '0.9rem' }}
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
                                                }} style={{ background: 'rgba(255, 194, 14, 0.2)', color: 'var(--zone-yellow)', border: '1px solid var(--zone-yellow)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Sample</button>
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
