import { useState, useEffect } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { Metric, Countermeasure } from '../../types/improvement';

export default function GoalGapMonitor({ onClose }: { onClose: () => void }) {
    // Engine State
    const [history, setHistory] = useState<Metric[]>([]);
    const [countermeasures, setCountermeasures] = useState<Countermeasure[]>([]);

    const refreshData = () => {
        const metrics = ImprovementEngine.getItemsByType<Metric>('Metric').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setHistory(metrics);
        setCountermeasures(ImprovementEngine.getItemsByType<Countermeasure>('Countermeasure'));
    };

    useEffect(() => {
        refreshData();
        const listener = () => refreshData();
        window.addEventListener('improvement_data_updated', listener);
        return () => window.removeEventListener('improvement_data_updated', listener);
    }, []);

    // Initial Defaults
    const latest = history[0];
    const [goal, setGoal] = useState<number>(latest?.target || 100);
    const [actual, setActual] = useState<number>(latest?.actual || 0);
    const [metricType, setMetricType] = useState<string>(latest?.metricName || 'Units/Hour');
    const [areaName, setAreaName] = useState<string>(latest?.areaId || 'Assembly Line 1');
    const [owner, setOwner] = useState<string>(latest?.owner || 'Shift Supervisor');
    const [date, setDate] = useState<string>(latest?.date || new Date().toISOString().split('T')[0]);

    // New Countermeasure State
    const [newCMDescription, setNewCMDescription] = useState('');
    const [newCMOwner, setNewCMOwner] = useState('');
    const [newCMImpact, setNewCMImpact] = useState('');
    // Gap = Actual - Goal (Positive means over-performing against target, negative means missing target) 
    // IMPORTANT: In true manufacturing context, if the metric is "Defects" or "Downtime", a negative gap is GOOD.
    // For simplicity, we assume metrics where higher is better (Units/Hr, Yield, etc.).
    const isHigherBetter = metricType !== 'Defects' && metricType !== 'Downtime Minutes';
    const rawGap = actual - goal;
    
    // Adjust gap polarity based on metric type for display rendering
    const performanceGap = isHigherBetter ? rawGap : -rawGap; 
    
    // Determine Color Code
    let gapColor = '#64748b'; // default neutral
    if (goal > 0 || actual > 0) {
        if (performanceGap >= 0) {
            gapColor = '#10b981'; // Green (Met or Exceeded)
        } else if (Math.abs(performanceGap) <= (goal * 0.10)) {
            gapColor = '#eab308'; // Yellow (Small gap, within 10%)
        } else {
            gapColor = '#ef4444'; // Red (Large gap)
        }
    }

    // Calculate percent for Gauge
    const percentToGoal = goal !== 0 ? Math.round((actual / goal) * 100) : (actual === 0 ? 100 : 0);
    const boundedPercent = Math.min(Math.max(percentToGoal, 0), 100);


    const handleSaveEntry = () => {
        ImprovementEngine.createItem<Metric>({
            type: 'Metric',
            metricName: metricType,
            target: goal,
            actual,
            gap: rawGap,
            date: new Date().toLocaleDateString(),
            areaId: areaName,
            owner
        });
    };

    const handleAddCountermeasure = () => {
        if (!newCMDescription.trim() || !newCMOwner.trim()) return;
        
        ImprovementEngine.createItem<Countermeasure>({
            type: 'Countermeasure',
            description: newCMDescription,
            owner: newCMOwner,
            status: 'Not Started',
            impactEstimate: newCMImpact || 'TBD'
        });

        setNewCMDescription('');
        setNewCMOwner('');
        setNewCMImpact('');
    };

    const toggleCMStatus = (id: string) => {
        const cm = countermeasures.find(c => c.id === id);
        if (cm) {
            const nextStatus = cm.status === 'Not Started' ? 'In Progress' : cm.status === 'In Progress' ? 'Completed' : 'Not Started';
            ImprovementEngine.updateItem<Countermeasure>(id, { status: nextStatus });
        }
    };

    const deleteCM = (id: string) => {
        ImprovementEngine.deleteItem(id);
    };

    const formatGapText = () => {
        if (rawGap > 0) return `+${rawGap}`;
        return `${rawGap}`;
    };

    return (
        <HardwareConsoleLayout 
            toolId="M-01 PRECISION PERFORMANCE" 
            toolName="GOAL GAP MONITOR" 
            onClose={onClose}
        >
            {/* SCROLLABLE INTERIOR CONTENT (The Control Panel internals) */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0', // Removed padding as HardwareConsoleLayout handles it
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    
                    {/* LEFT COLUMN: Data Entry & Dashboard */}
                    <div style={{ flex: '1 1 min(100%, 350px)', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
                        
                        {/* PRIMARY DASHBOARD CARD */}
                        <div className="card" style={{ 
                            background: 'radial-gradient(circle at 50% 0%, #0a0b0e 0%, #050608 100%)', 
                            padding: 'clamp(1rem, 3vw, 2rem)', 
                            border: '2px solid rgba(255,255,255,0.02)', 
                            borderTop: '2px solid rgba(0,0,0,0.8)',
                            borderLeft: '2px solid rgba(0,0,0,0.5)',
                            borderRight: '2px solid rgba(255,255,255,0.05)',
                            borderBottom: '2px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px', 
                            textAlign: 'center', 
                            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.6)' 
                        }}>
                            <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)', color: '#64748b', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '2rem', fontFamily: "'Orbitron', sans-serif", fontWeight: 800 }}>
                                Performance Telemetry
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 clamp(0.5rem, 2vw, 2rem)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: 'clamp(0.5rem, 1.5vw, 1rem) clamp(1rem, 3vw, 2rem)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Target</span>
                                    <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', fontFamily: "'Orbitron', sans-serif", color: '#94a3b8', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>{goal}</span>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: 'clamp(0.5rem, 1.5vw, 1rem) clamp(1rem, 3vw, 2rem)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Actual</span>
                                    <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', fontFamily: "'Orbitron', sans-serif", color: '#f8fafc', textShadow: '0 0 20px rgba(255,255,255,0.4)' }}>{actual}</span>
                                </div>
                            </div>

                            {/* DIGITAL PERFORMANCE GAUGE */}
                            <div style={{ marginBottom: 'clamp(1rem, 3vw, 2rem)', padding: '0 clamp(0.5rem, 1.5vw, 1rem)', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', paddingBottom: 'clamp(1rem, 2vw, 1.5rem)', paddingTop: 'clamp(0.75rem, 1.5vw, 1rem)', border: '1px solid rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontFamily: "'Orbitron', sans-serif", textTransform: 'uppercase', fontWeight: 800 }}>
                                    <span>0%</span>
                                    <span style={{ color: gapColor, fontWeight: '900', letterSpacing: '2px', textShadow: `0 0 10px ${gapColor}80` }}>{percentToGoal}% to Target</span>
                                    <span>100%</span>
                                </div>
                                <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.8)', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.9)' }}>
                                    <div style={{ 
                                        position: 'absolute', 
                                        left: 0, 
                                        top: 0, 
                                        bottom: 0, 
                                        width: `${boundedPercent}%`, 
                                        background: `linear-gradient(90deg, ${gapColor}40 0%, ${gapColor} 100%)`,
                                        transition: 'width 0.4s ease, background 0.4s ease',
                                        boxShadow: `0 0 20px ${gapColor}`,
                                        borderRadius: '6px'
                                    }} />
                                    {/* Repeating Digital Tick Marks */}
                                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.5) 4px, rgba(0,0,0,0.5) 6px)', zIndex: 2 }} />
                                    {/* Target Marker Line at 100% */}
                                    <div style={{ position: 'absolute', right: '0', top: 0, bottom: 0, width: '4px', background: '#fff', zIndex: 5, boxShadow: '0 0 10px #fff' }} />
                                </div>
                            </div>

                            {/* DIGITAL VFD VARIANCE OUTPUT */}
                            <div style={{ 
                                background: '#050608', 
                                border: `2px solid ${gapColor}40`, 
                                borderTopColor: `${gapColor}20`,
                                borderLeftColor: `${gapColor}20`,
                                borderRadius: '8px', 
                                padding: 'clamp(1.5rem, 3vw, 2rem)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: `inset 0 5px 20px rgba(0,0,0,0.9), inset 0 0 40px ${gapColor}20`
                            }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '900', marginBottom: '0.5rem' }}>Calculated Variance</span>
                                <span style={{ fontSize: 'clamp(3.5rem, 8vw, 5rem)', fontWeight: '900', color: gapColor, fontFamily: "'Orbitron', sans-serif", lineHeight: 1, filter: `drop-shadow(0 0 25px ${gapColor}90)`, letterSpacing: '-2px' }}>
                                    {formatGapText()}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: gapColor, opacity: 0.7, marginTop: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{metricType}</span>
                            </div>
                        </div>

                        {/* CORE INPUTS PANEL */}
                        <div className="card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)', fontWeight: 'bold' }}>Process Context</div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(0.5rem, 1.5vw, 1rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Area / Process</label>
                                    <input type="text" value={areaName} onChange={(e) => setAreaName(e.target.value)} className="input-field-light" style={{ background: 'rgba(0,0,0,0.3)!important', color:'white!important', border: '1px solid rgba(255,255,255,0.1)!important' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Owner</label>
                                    <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} className="input-field-light" style={{ background: 'rgba(0,0,0,0.3)!important', color:'white!important', border: '1px solid rgba(255,255,255,0.1)!important' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Metric Type</label>
                                    <select value={metricType} onChange={(e) => setMetricType(e.target.value)} className="input-field-light" style={{ background: 'rgba(0,0,0,0.3)!important', color:'white!important', border: '1px solid rgba(255,255,255,0.1)!important' }}>
                                        <option value="Units/Hour">Units/Hour</option>
                                        <option value="Total Output">Total Output</option>
                                        <option value="Defects">Defects</option>
                                        <option value="Downtime Minutes">Downtime Minutes</option>
                                        <option value="Cycle Time (s)">Cycle Time (s)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Date</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field-light" style={{ background: 'rgba(0,0,0,0.3)!important', color:'white!important', border: '1px solid rgba(255,255,255,0.1)!important' }} />
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: 'clamp(1rem, 2.5vw, 1.5rem) 0' }} />

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)', color: '#e2e8f0', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Goal</label>
                                    <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="input-field-light" style={{ background: 'rgba(0,0,0,0.5)!important', color:'white!important', border: '1px solid #475569!important', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', padding: 'clamp(0.5rem, 1.2vw, 0.75rem)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: 'bold' }}>Actual</label>
                                    <input type="number" value={actual} onChange={(e) => setActual(Number(e.target.value))} className="input-field-light" style={{ background: 'rgba(0,0,0,0.5)!important', color:'#38bdf8!important', border: '1px solid #0284c7!important', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', padding: 'clamp(0.5rem, 1.2vw, 0.75rem)' }} />
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveEntry}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 'clamp(1rem, 2.5vw, 1.5rem)', padding: 'clamp(0.75rem, 1.5vw, 1rem)', borderRadius: '4px' }}
                            >
                                LOG PERFORMANCE SNAPSHOT
                            </button>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Trends & Countermeasures */}
                    <div style={{ flex: '2 1 min(100%, 400px)', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
                        
                        {/* TREND TRACKING */}
                        <div className="card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Historical Trend</span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Last 10 Entries</span>
                            </div>
                            
                            {history.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                    No historical snapshots available. Log current performance to build trend.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '0.5rem', padding: '1rem 0', overflowX: 'auto' }}>
                                    {history.map((entry) => {
                                        // Calculate relative height based on highest actual in history
                                        const maxActual = Math.max(...history.map(h => h.actual), ...history.map(h => h.target), 1);
                                        const actualHeightPct = (entry.actual / maxActual) * 100;
                                        const goalHeightPct = (entry.target / maxActual) * 100;
                                        
                                        const isGood = isHigherBetter ? entry.actual >= entry.target : entry.actual <= entry.target;
                                        const barColor = isGood ? '#10b981' : '#ef4444';

                                        return (
                                            <div key={entry.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', minWidth: '40px' }}>
                                                <div style={{ fontSize: '0.65rem', color: barColor, marginBottom: '0.25rem', fontWeight: 'bold' }}>{entry.gap > 0 ? `+${entry.gap}` : entry.gap}</div>
                                                <div style={{ height: '100px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                    {/* Target Line marker */}
                                                    <div style={{ position: 'absolute', bottom: `${goalHeightPct}%`, left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.3)', zIndex: 10 }} title={`Goal: ${entry.target}`} />
                                                    {/* Actual Bar */}
                                                    <div style={{ height: `${actualHeightPct}%`, width: '60%', background: barColor, opacity: 0.8, borderRadius: '2px 2px 0 0', overflow: 'hidden', position: 'relative' }}>
                                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '0.25rem' }}>{entry.date.split('/')[0]}/{entry.date.split('/')[1]}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* COUNTERMEASURES SECTION */}
                        <div className="card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 'clamp(1rem, 2vw, 1.5rem)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', flex: 1 }}>
                            <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Active Countermeasures</span>
                                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>{countermeasures.filter(c => c.status !== 'Completed').length} Open</span>
                            </div>

                            {/* Add New CM Form */}
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 'clamp(0.75rem, 1.5vw, 1rem)', borderRadius: '8px', marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Problem description / Countermeasure action..." 
                                        className="input-field-light" 
                                        style={{ background: 'rgba(255,255,255,0.05)!important', color:'white!important', border: 'none!important' }}
                                        value={newCMDescription}
                                        onChange={(e) => setNewCMDescription(e.target.value)}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Owner" 
                                        className="input-field-light" 
                                        style={{ background: 'rgba(255,255,255,0.05)!important', color:'white!important', border: 'none!important' }}
                                        value={newCMOwner}
                                        onChange={(e) => setNewCMOwner(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Estimated Impact (e.g., +10 units/hr, -5 mins downtime)" 
                                        className="input-field-light" 
                                        style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.05)!important', color:'white!important', border: 'none!important' }}
                                        value={newCMImpact}
                                        onChange={(e) => setNewCMImpact(e.target.value)}
                                    />
                                    <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={handleAddCountermeasure}>
                                        ADD ACTION
                                    </button>
                                </div>
                            </div>

                            {/* CM List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {countermeasures.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem', padding: '1rem 0' }}>
                                        No active countermeasures logged for this gap.
                                    </div>
                                ) : (
                                    countermeasures.map((cm) => (
                                        <div key={cm.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', opacity: cm.status === 'Completed' ? 0.6 : 1 }}>
                                            <button 
                                                onClick={() => toggleCMStatus(cm.id)}
                                                style={{ 
                                                    width: '24px', height: '24px', borderRadius: '4px', 
                                                    background: cm.status === 'Completed' ? '#10b981' : cm.status === 'In Progress' ? '#eab308' : 'transparent',
                                                    border: `2px solid ${cm.status === 'Completed' ? '#10b981' : cm.status === 'In Progress' ? '#eab308' : '#94a3b8'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontSize: '12px', cursor: 'pointer', flexShrink: 0, marginTop: '2px'
                                                }}
                                                title={cm.status}
                                            >
                                                {cm.status === 'Completed' ? '✓' : cm.status === 'In Progress' ? '⋯' : ''}
                                            </button>
                                            
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: '500', marginBottom: '0.4rem', textDecoration: cm.status === 'Completed' ? 'line-through' : 'none' }}>
                                                    {cm.description}
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <span style={{color: '#64748b'}}>👤</span> {cm.owner}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <span style={{color: '#64748b'}}>⚡</span> {cm.impactEstimate || 'TBD'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => deleteCM(cm.id)}
                                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', padding: '0.2rem' }}
                                                title="Delete Countermeasure"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </HardwareConsoleLayout>
    );
}
