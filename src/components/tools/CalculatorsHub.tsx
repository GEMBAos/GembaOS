import { useState, useMemo, useEffect } from 'react';

export default function CalculatorsHub() {
    const [activeCalc, setActiveCalc] = useState<'menu' | 'takt' | 'oee' | 'labor' | 'uph' | 'safety' | 'rty' | 'kanban' | 'smed' | 'roi'>('menu');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.includes('calc=')) {
                const params = new URLSearchParams(hash.split('?')[1] || "");
                const calc = params.get('calc');
                if (calc && ['takt', 'oee', 'labor', 'uph', 'safety', 'rty', 'kanban', 'smed', 'roi'].includes(calc)) {
                    setActiveCalc(calc as any);
                } else {
                    setActiveCalc('menu');
                }
            } else {
                setActiveCalc('menu');
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
        <div className="module-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', flex: 1, background: '#ffffff' }}>
            {/* Low-Profile Header Banner */}
            <header style={{ 
                padding: '0.35rem 1rem', 
                background: 'var(--zone-yellow)', 
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                width: '100%',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', alignItems: 'center' }}>
                    <h1 style={{ margin: 0, color: '#ffffff', fontSize: '0.8rem', fontFamily: 'var(--font-headings)', letterSpacing: '4px', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.5)', fontWeight: 900 }}>
                        {activeCalc === 'menu' ? 'GEMBAOS SYSTEM HUB' : 'INDUSTRIAL CALCULATORS'}
                    </h1>
                    {activeCalc !== 'menu' && (
                        <button onClick={() => window.location.hash = `#/calculators`} style={{ position: 'absolute', right: '0', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-headings)', fontSize: '0.7rem', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                            ⬅ BACK
                        </button>
                    )}
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                {/* Calculator Stage */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: '#f8fafc', minHeight: 0, WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
                    
                    {activeCalc === 'menu' && (
                        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <h2 style={{ color: '#0f172a', fontFamily: 'var(--font-headings)', margin: '0 0 1rem 0', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Site Map & Workflows</h2>
                                <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Navigate directly to your core Lean Manufacturing tools to execute observations and build process models.</p>
                            </div>

                            {/* FLOW: OBSERVE */}
                            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'var(--zone-yellow)', color: 'var(--gemba-black)', padding: '0.5rem', borderRadius: '8px', fontSize: '1.5rem' }}>👀</div>
                                    <h3 style={{ margin: 0, color: '#0f172a', fontFamily: 'var(--font-headings)', fontSize: '1.25rem', letterSpacing: '1px' }}>1. OBSERVE THE CURRENT STATE</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                    <div onClick={() => window.location.hash = '#/observe'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='var(--zone-yellow)'; e.currentTarget.style.background='#fdfdfc'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🎥</span> VALUE STREAM SCANNER</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Log process steps and generate immediate Kaizen Action Items from field anomalies.</p>
                                    </div>
                                    <div onClick={() => window.location.hash = '#/motion-v2'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='var(--zone-yellow)'; e.currentTarget.style.background='#fdfdfc'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🗺️</span> MOTION MAPPER</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Use device pedometers to trace physical walking routes and detect transportation waste.</p>
                                    </div>
                                    <div onClick={() => window.location.hash = '#/time-study'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='var(--zone-yellow)'; e.currentTarget.style.background='#fdfdfc'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>⏱️</span> TIME STUDY ENGINE</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Capture exact process cycle times against Takt Time benchmarks and export to Line Balance.</p>
                                    </div>
                                </div>
                            </div>

                            {/* FLOW: ARCHITECT */}
                            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: '#0ea5e9', color: 'white', padding: '0.5rem', borderRadius: '8px', fontSize: '1.5rem' }}>🏗️</div>
                                    <h3 style={{ margin: 0, color: '#0f172a', fontFamily: 'var(--font-headings)', fontSize: '1.25rem', letterSpacing: '1px' }}>2. DESIGN THE FUTURE STATE</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                    <div onClick={() => window.location.hash = '#/line-balance'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='#0ea5e9'; e.currentTarget.style.background='#f0f9ff'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>⚖️</span> LINE BALANCE BUILDER</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Import Time Studies to construct Yamazumi stack charts and achieve perfect line flow.</p>
                                    </div>
                                    <div onClick={() => window.location.hash = '#/action-items'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='#0ea5e9'; e.currentTarget.style.background='#f0f9ff'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📋</span> KAIZEN ACTION LOG</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Track execution of countermeasures generated during your observation walks.</p>
                                    </div>
                                    <div onClick={() => window.location.hash = '#/goal-gap'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='#0ea5e9'; e.currentTarget.style.background='#f0f9ff'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>📉</span> GOAL GAP TRACKER</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Monitor KPI variance and set target metrics for your workflows.</p>
                                    </div>
                                    {/* Link to Calculators which drops down the top rail */}
                                    <div style={{ padding: '1.5rem', border: '1px solid #000', background: '#0f172a', borderRadius: '8px' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>💡</span> INDUSTRIAL CALCULATORS</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Access Takt, OEE, and Labor tools using the dark quick-access ribbon situated at the top of your screen.</p>
                                    </div>
                                </div>
                            </div>

                            {/* FLOW: SUSTAIN & LEARN */}
                            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '8px', fontSize: '1.5rem' }}>🌱</div>
                                    <h3 style={{ margin: 0, color: '#0f172a', fontFamily: 'var(--font-headings)', fontSize: '1.25rem', letterSpacing: '1px' }}>3. SUSTAIN & LEARN</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                    <div onClick={() => window.location.hash = '#/kaizen-hub'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.background='#ecfdf5'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>⚡</span> KAIZEN HUB</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Join or host a synchronized execution event with your team.</p>
                                    </div>
                                    <div onClick={() => window.location.hash = '#/lean-academy'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.background='#ecfdf5'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🎓</span> LEAN ACADEMY</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Interactive continuous improvement lessons and certifications.</p>
                                    </div>
                                    <div onClick={() => window.location.hash = '#/video-hub'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.background='#ecfdf5'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🎬</span> VIDEO HUB</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Browse operator video submissions for Gemba analysis.</p>
                                    </div>
                                    <div onClick={() => window.location.hash = '#/gemba-challenge'} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.background='#ecfdf5'}} onMouseOut={e => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='transparent'}}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span>🏆</span> GEMBA CHALLENGE</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Test your operational knowledge in the challenge arena to earn XP.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
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

                            <div style={{ marginTop: '3rem', background: 'var(--gemba-black)', border: '1px solid #333', borderRadius: '8px', padding: '1.5rem', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--zone-yellow)', fontFamily: 'var(--font-headings)', fontSize: '1.1rem', letterSpacing: '1px' }}>5S SCORING ROADMAP</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[
                                        { score: 1, level: 'Initial Phase', desc: 'No formal standards. Clutter is present.', action: 'Execute an initial red-tag event (Sort).' },
                                        { score: 2, level: 'Awareness', desc: 'Basic sorting done, but locations are inconsistent.', action: 'Label & shadow-board all storage locations (Set in Order).' },
                                        { score: 3, level: 'Developing', desc: 'Locations marked, basic daily cleaning exists.', action: 'Implement visual daily checklists to regulate habits (Standardize).' },
                                        { score: 4, level: 'Standardized', desc: 'Abnormalities are instantly obvious to outsiders.', action: 'Focus on root-cause dust/defect prevention.' },
                                        { score: 5, level: 'World-Class', desc: 'Self-sustaining discipline & continuous Kaizen.', action: 'Yokoten (Share practices across other work centers).' },
                                    ].map(tier => (
                                        <div key={tier.score} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <div style={{ background: '#111', border: '2px solid #555', minWidth: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'var(--font-headings)' }}>
                                                {tier.score}
                                            </div>
                                            <div style={{ paddingTop: '0.2rem' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{tier.level}</span>
                                                    <span style={{ color: '#555', fontSize: '0.8rem', paddingTop: '2px' }} className="hide-on-mobile">|</span>
                                                    <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{tier.desc}</span>
                                                </div>
                                                <div style={{ color: 'var(--zone-yellow)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', gap: '0.4rem', alignItems: 'center', letterSpacing: '0.5px' }}>
                                                    <span style={{ fontSize: '1rem' }}>➔</span> ACTION: {tier.action}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
