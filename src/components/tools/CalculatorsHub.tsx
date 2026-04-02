import { useState, useMemo, useEffect } from 'react';

interface CalculatorsHubProps {
    onClose?: () => void;
}

export default function CalculatorsHub({ onClose }: CalculatorsHubProps) {
    const [activeCalc, setActiveCalc] = useState<'takt' | 'oee' | 'labor' | 'uph' | 'safety' | 'rty' | 'kanban' | 'smed' | 'roi'>('takt');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.includes('calc=')) {
                const params = new URLSearchParams(hash.split('?')[1] || "");
                const calc = params.get('calc');
                if (calc && ['takt', 'oee', 'labor', 'uph', 'safety', 'rty', 'kanban', 'smed', 'roi'].includes(calc)) {
                    setActiveCalc(calc as any);
                }
            }
        };
        handleHashChange(); // check on mount
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Takt State
    const [taktShiftHours, setTaktShiftHours] = useState(8);
    const [taktBreakMins, setTaktBreakMins] = useState(30);
    const [taktDemand, setTaktDemand] = useState(400);

    const taktResult = useMemo(() => {
        if (!taktDemand || taktDemand <= 0) return 0;
        const availableMins = (taktShiftHours * 60) - taktBreakMins;
        const availableSecs = availableMins * 60;
        return availableSecs / taktDemand;
    }, [taktShiftHours, taktBreakMins, taktDemand]);

    // OEE State
    const [oeeAvail, setOeeAvail] = useState(90);
    const [oeePerf, setOeePerf] = useState(85);
    const [oeeQual, setOeeQual] = useState(98);

    const oeeResult = useMemo(() => {
        return ((oeeAvail / 100) * (oeePerf / 100) * (oeeQual / 100)) * 100;
    }, [oeeAvail, oeePerf, oeeQual]);

    // Labor State
    const [laborHeadcount, setLaborHeadcount] = useState(5);
    const [laborRate, setLaborRate] = useState(25);
    const [laborUPH, setLaborUPH] = useState(60);

    const laborResult = useMemo(() => {
        if (!laborUPH || laborUPH <= 0) return 0;
        const totalCostPerHour = laborHeadcount * laborRate;
        return totalCostPerHour / laborUPH;
    }, [laborHeadcount, laborRate, laborUPH]);

    // UPH State
    const [uphCycleSecs, setUphCycleSecs] = useState(60);
    
    const uphResult = useMemo(() => {
        if (!uphCycleSecs || uphCycleSecs <= 0) return 0;
        return 3600 / uphCycleSecs;
    }, [uphCycleSecs]);

    // Safety State
    const [safetySort, setSafetySort] = useState(5);
    const [safetySet, setSafetySet] = useState(4);
    const [safetyShine, setSafetyShine] = useState(5);
    const [safetyStand, setSafetyStand] = useState(3);
    const [safetySustain, setSafetySustain] = useState(4);

    const safetyResult = useMemo(() => {
        const total = safetySort + safetySet + safetyShine + safetyStand + safetySustain;
        return (total / 25) * 100;
    }, [safetySort, safetySet, safetyShine, safetyStand, safetySustain]);

    // RTY State
    const [rtyYield1, setRtyYield1] = useState(98);
    const [rtyYield2, setRtyYield2] = useState(97);
    const [rtyYield3, setRtyYield3] = useState(95);
    const [rtyYield4, setRtyYield4] = useState(99);

    const rtyResult = useMemo(() => {
        return ((rtyYield1/100) * (rtyYield2/100) * (rtyYield3/100) * (rtyYield4/100)) * 100;
    }, [rtyYield1, rtyYield2, rtyYield3, rtyYield4]);

    // Kanban State
    const [kanbanDemand, setKanbanDemand] = useState(500);
    const [kanbanLeadTime, setKanbanLeadTime] = useState(2);
    const [kanbanSafetyFactor, setKanbanSafetyFactor] = useState(20);
    const [kanbanBinQty, setKanbanBinQty] = useState(50);

    const kanbanResult = useMemo(() => {
        if (!kanbanBinQty || kanbanBinQty <= 0) return 0;
        const totalStockNeeded = kanbanDemand * kanbanLeadTime * (1 + (kanbanSafetyFactor / 100));
        return Math.ceil(totalStockNeeded / kanbanBinQty);
    }, [kanbanDemand, kanbanLeadTime, kanbanSafetyFactor, kanbanBinQty]);

    // SMED State
    const [smedTimeMins, setSmedTimeMins] = useState(45);
    const [smedUPH, setSmedUPH] = useState(120);
    const [smedMargin, setSmedMargin] = useState(15);

    const smedResult = useMemo(() => {
        const unitsPerMin = smedUPH / 60;
        const lostUnits = smedTimeMins * unitsPerMin;
        const cost = lostUnits * smedMargin;
        return cost;
    }, [smedTimeMins, smedUPH, smedMargin]);

    // ROI State
    const [roiInvestment, setRoiInvestment] = useState(5000);
    const [roiDailySavings, setRoiDailySavings] = useState(150);

    const roiPayback = useMemo(() => {
        if (!roiDailySavings || roiDailySavings <= 0) return 0;
        return roiInvestment / roiDailySavings;
    }, [roiInvestment, roiDailySavings]);

    const roiAnnual = useMemo(() => {
        return roiDailySavings * 250; // standard 250 operating days
    }, [roiDailySavings]);

    const renderInput = (label: string, value: number, setter: (v: number) => void, unit?: string, step: number = 1, min: number = 0) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            <label style={{ color: 'var(--steel-gray)', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-headings)' }}>{label.toUpperCase()}</label>
            <div style={{ position: 'relative' }}>
                <input 
                    type="number"
                    value={value || ''}
                    onChange={(e) => setter(parseFloat(e.target.value) || 0)}
                    step={step}
                    min={min}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        paddingRight: unit ? '3rem' : '1rem',
                        background: '#1a1a1c',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'var(--lean-white)',
                        fontSize: '1.25rem',
                        fontFamily: 'var(--font-mono)'
                    }}
                />
                {unit && <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666', fontFamily: 'var(--font-mono)' }}>{unit}</span>}
            </div>
        </div>
    );

    const renderMetrics = (value: number | string, unit: string, subtitle: string) => (
        <div style={{ 
            background: 'linear-gradient(180deg, #111 0%, #0a0a0c 100%)', 
            border: '1px solid #333', 
            borderRadius: '12px', 
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,194,14,0.3)',
            marginTop: '2rem'
        }}>
            <h4 style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-headings)' }}>{subtitle}</h4>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--zone-yellow)', lineHeight: 1, fontFamily: 'var(--font-mono)', textShadow: '0 0 20px rgba(255,194,14,0.4)' }}>
                    {typeof value === 'number' ? value.toFixed(2) : value}
                </span>
                <span style={{ color: '#888', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="module-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <header style={{ 
                padding: '1.5rem', 
                background: 'linear-gradient(180deg, #1a1a1c 0%, #111 100%)', 
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,194,14,0.1)', border: '1px solid rgba(255,194,14,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zone-yellow)'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16.01" y1="10" y2="10"/><line x1="16" x2="16.01" y1="14" y2="14"/><line x1="16" x2="16.01" y1="18" y2="18"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0, color: 'var(--lean-white)', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', letterSpacing: '1px' }}>INDUSTRIAL CALCULATORS</h1>
                    <p style={{ margin: 0, color: 'var(--steel-gray)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Core Lean Math Engines</p>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '0.5rem' }}>
                        ✕
                    </button>
                )}
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Horizontal / Left Nav for specific calcs */}
                <div style={{
                    width: '120px',
                    borderRight: '1px solid #333',
                    background: '#111',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1rem 0'
                }}>
                    {(['takt', 'oee', 'kanban', 'rty', 'smed', 'labor', 'uph', 'safety', 'roi'] as const).map(c => (
                        <button 
                            key={c}
                            onClick={() => setActiveCalc(c)}
                            style={{
                                padding: '1rem',
                                background: activeCalc === c ? 'rgba(255,194,14,0.1)' : 'transparent',
                                border: 'none',
                                borderRight: activeCalc === c ? '3px solid var(--zone-yellow)' : '3px solid transparent',
                                color: activeCalc === c ? 'var(--zone-yellow)' : 'var(--steel-gray)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-headings)',
                                fontWeight: activeCalc === c ? 800 : 500,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                transition: 'all 0.2s'
                            }}
                        >
                            {c === 'takt' && 'Takt Time'}
                            {c === 'oee' && 'OEE'}
                            {c === 'kanban' && 'Kanban Size'}
                            {c === 'rty' && 'True Yield'}
                            {c === 'smed' && 'Setup Cost'}
                            {c === 'labor' && 'Labor Cost'}
                            {c === 'uph' && 'UPH Target'}
                            {c === 'safety' && 'Facility 5S'}
                            {c === 'roi' && 'Kaizen ROI'}
                        </button>
                    ))}
                </div>

                {/* Calculator Stage */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--bg-panel)' }}>
                    
                    {activeCalc === 'takt' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Takt Time Engine</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Calculates the exact pace at which a product must be completed to meet customer demand.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderInput('Shift Length', taktShiftHours, setTaktShiftHours, 'hrs')}
                                {renderInput('Breaks / Meetings', taktBreakMins, setTaktBreakMins, 'mins')}
                            </div>
                            {renderInput('Customer Demand per Shift', taktDemand, setTaktDemand, 'units')}
                            
                            {renderMetrics(taktResult, 'sec/unit', 'Target Takt Time')}
                        </div>
                    )}

                    {activeCalc === 'oee' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>OEE Matrix</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Overall Equipment Effectiveness: measures how much manufacturing time is truly productive.</p>
                            
                            {renderInput('Availability', oeeAvail, setOeeAvail, '%')}
                            {renderInput('Performance', oeePerf, setOeePerf, '%')}
                            {renderInput('Quality Rate', oeeQual, setOeeQual, '%')}
                            
                            {renderMetrics(oeeResult, '%', 'OEE Score')}
                        </div>
                    )}

                    {activeCalc === 'labor' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Labor Cost per Part</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Determines the raw labor dollar amount embedded into every single unit produced.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderInput('Headcount', laborHeadcount, setLaborHeadcount, 'ppl')}
                                {renderInput('Avg Hourly Rate', laborRate, setLaborRate, '$/hr')}
                            </div>
                            {renderInput('Units Per Hour (UPH)', laborUPH, setLaborUPH, 'units')}
                            
                            {renderMetrics(laborResult, '$', 'Cost Per Unit')}
                        </div>
                    )}

                    {activeCalc === 'uph' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Units Per Hour (UPH)</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Calculates the theoretical maximum throughput based on your bottleneck cycle time.</p>
                            
                            {renderInput('Bottleneck Cycle Time', uphCycleSecs, setUphCycleSecs, 'sec')}
                            
                            {renderMetrics(uphResult, 'uph', 'Throughput Ceiling')}
                        </div>
                    )}

                    {activeCalc === 'safety' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>5S Facility Safety Score</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Rate your area from 1 to 5 across the 5S pillars to generate an automated audit score.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderInput('Sort (Distinguish)', safetySort, setSafetySort, '/ 5', 1, 1)}
                                {renderInput('Set In Order (Location)', safetySet, setSafetySet, '/ 5', 1, 1)}
                                {renderInput('Shine (Cleanliness)', safetyShine, setSafetyShine, '/ 5', 1, 1)}
                                {renderInput('Standardize (Rules)', safetyStand, setSafetyStand, '/ 5', 1, 1)}
                            </div>
                            {renderInput('Sustain (Discipline)', safetySustain, setSafetySustain, '/ 5', 1, 1)}
                            
                            {renderMetrics(safetyResult, '%', 'Diagnostic Score')}
                        </div>
                    )}

                    {activeCalc === 'rty' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Rolled Throughput Yield (RTY)</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Calculates the true probability that a single unit will pass completely through 4 continuous stations completely defect-free (First Pass Yield multiplying).</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderInput('Station 1 First Pass Yield', rtyYield1, setRtyYield1, '%')}
                                {renderInput('Station 2 First Pass Yield', rtyYield2, setRtyYield2, '%')}
                                {renderInput('Station 3 First Pass Yield', rtyYield3, setRtyYield3, '%')}
                                {renderInput('Station 4 First Pass Yield', rtyYield4, setRtyYield4, '%')}
                            </div>
                            
                            {renderMetrics(rtyResult, '%', 'Total Rolled Yield')}
                        </div>
                    )}

                    {activeCalc === 'kanban' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Kanban Card Sizer</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Uses daily demand and replenishment intervals to calculate the exact number of Kanban loops or bins required to never stock out.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderInput('Avg Daily Demand', kanbanDemand, setKanbanDemand, 'units')}
                                {renderInput('Replenishment Lead Time', kanbanLeadTime, setKanbanLeadTime, 'days')}
                                {renderInput('Safety Stock Buffer', kanbanSafetyFactor, setKanbanSafetyFactor, '%')}
                                {renderInput('Units Per Kanban/Bin', kanbanBinQty, setKanbanBinQty, 'qty')}
                            </div>
                            
                            {renderMetrics(kanbanResult, 'Cards/Bins', 'Total Kanban Loops Needed')}
                        </div>
                    )}

                    {activeCalc === 'smed' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Changeover Opportunity Cost</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Calculates the raw financial bleeding associated with equipment downtime during a product changeover or setup.</p>
                            
                            {renderInput('Duration of Changeover', smedTimeMins, setSmedTimeMins, 'mins')}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderInput('Baseline Target UPH', smedUPH, setSmedUPH, 'units')}
                                {renderInput('Profit Margin per Unit', smedMargin, setSmedMargin, '$')}
                            </div>
                            
                            {renderMetrics(smedResult, '$ Lost', 'Total Opportunity Cost')}
                        </div>
                    )}

                    {activeCalc === 'roi' && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontFamily: 'var(--font-headings)', color: 'var(--lean-white)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Kaizen Hard ROI Engine</h2>
                            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Translates shop floor improvements into financial reality for leadership. Calculates the exact break-even point and annualized operational savings.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderInput('Total Kaizen Investment', roiInvestment, setRoiInvestment, '$')}
                                {renderInput('Daily Financial Savings', roiDailySavings, setRoiDailySavings, '$/day')}
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {renderMetrics(roiPayback, 'Days', 'Payback Period')}
                                {renderMetrics(roiAnnual, '$$$', 'Annualized Value')}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
