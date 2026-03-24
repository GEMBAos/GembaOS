import { useState, useEffect, useRef } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { supabase } from '../../lib/supabase';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { MotionPath, ProcessCheck as ProcessCheckType } from '../../types/improvement';

interface CapturedWaste {
    id: string;
    photoUrl: string;
    category: string;
    description: string;
}

const WASTE_CATEGORIES = [
    "Defects", "Overproduction", "Waiting", "Non-utilized Talent",
    "Transportation", "Inventory", "Motion", "Extra-processing"
];

function mockAnalyzeWaste(): { category: string, description: string } {
    const isMotion = Math.random() > 0.5; // High chance of physical waste to encourage flow
    const category = isMotion ? "Motion" : WASTE_CATEGORIES[Math.floor(Math.random() * WASTE_CATEGORIES.length)];
    
    let description = "Detected inefficiencies in the current process.";
    if (category === "Motion") description = "Excessive reaching or walking detected without adding value to the patient/product.";
    if (category === "Transportation") description = "Unnecessary movement of materials or equipment identified in the frame.";
    if (category === "Waiting") description = "Idle time detected. Operator or machine is paused waiting for upstream process.";
    
    return { category, description };
}

interface ProcessCheckProps {
    onClose: () => void;
    onNavigate?: (route: string) => void;
}

export default function ProcessCheck({ onClose, onNavigate }: ProcessCheckProps) {
    const [sessions, setSessions] = useState<MotionPath[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');
    const [step, setStep] = useState<number>(0);

    // Diagnostic State
    const [interruptionCause, setInterruptionCause] = useState<string>('');
    const [isValueWork, setIsValueWork] = useState<boolean | null>(null);
    const [rootCauseNotes, setRootCauseNotes] = useState<string>('');

    // Re-integrated Photo & Operator State
    const [capturedWastes, setCapturedWastes] = useState<CapturedWaste[]>([]);
    const [operatorFeedback, setOperatorFeedback] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        let photoUrl = URL.createObjectURL(file);

        try {
            // Upload to Supabase 
            const fileName = `kaizen/${Date.now()}_waste.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('jfi_uploads').upload(fileName, file);
            if (!error) {
                const { data } = supabase.storage.from('jfi_uploads').getPublicUrl(fileName);
                photoUrl = data.publicUrl;
            }
        } catch (err) {
            console.error(err);
        }

        setTimeout(() => {
            const analysis = mockAnalyzeWaste();
            const newWaste: CapturedWaste = {
                id: Math.random().toString(36).substr(2, 9),
                photoUrl,
                category: analysis.category,
                description: analysis.description
            };
            setCapturedWastes(prev => [newWaste, ...prev]);
            setIsAnalyzing(false);
        }, 1500);
    };

    const CAUSE_CATEGORIES = [
        "Material not at point of use",
        "Tool not available",
        "Searching",
        "Waiting",
        "Setup / preparation",
        "Quality issue",
        "Information missing",
        "Layout / reach problem",
        "Other"
    ];

    const refreshData = () => {
        setSessions(ImprovementEngine.getItemsByType<MotionPath>('MotionPath'));
    };

    useEffect(() => {
        refreshData();
        const listener = () => refreshData();
        window.addEventListener('improvement_data_updated', listener);
        return () => window.removeEventListener('improvement_data_updated', listener);
    }, []);

    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    const handleSaveDiagnosis = () => {
        if (!selectedSession) return;

        const cycleTime = selectedSession.pathCoordinates && selectedSession.pathCoordinates.length > 1 
            ? (selectedSession.pathCoordinates[selectedSession.pathCoordinates.length - 1].timestamp - selectedSession.pathCoordinates[0].timestamp) / 1000 
            : 0;

        const wasteTypesFound = capturedWastes.map(w => w.category);
        const uniqueWastes = Array.from(new Set([interruptionCause, ...wasteTypesFound]));

        ImprovementEngine.createItem<ProcessCheckType>({
            type: 'ProcessCheck',
            motionSessionId: selectedSession.id,
            processName: selectedSession.sessionName,
            operatorId: selectedSession.operatorId,
            findings: `Interruption: ${interruptionCause}\nValue Classification: ${isValueWork ? 'Value Work' : 'Preparation/Waste'}\nNotes: ${rootCauseNotes}\nObserved Field Exits: ${selectedSession.longestSegment}\nOperator Feedback: ${operatorFeedback || 'None'}\nVisual Captures: ${capturedWastes.length}`,
            wasteTypes: uniqueWastes,
            targetCycleTime: 0,
            actualCycleTime: Math.round(cycleTime)
        });

        // Reset
        setStep(0);
        setSelectedSessionId('');
        setInterruptionCause('');
        setIsValueWork(null);
        setRootCauseNotes('');
        setCapturedWastes([]);
        setOperatorFeedback('');
        onClose(); // Auto-close module instead of alert pop-up
    };

    return (
        <HardwareConsoleLayout 
            toolId="DIAG-01 ROOT CAUSE" 
            toolName="PROCESS CHECK (ROOT CAUSE)" 
            onClose={onClose}
        >
            <div style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
                
                {/* Step 0: Observation Intake */}
                {step === 0 && (
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--zone-yellow)', animation: 'fadeIn 0.3s ease-out', overflowY: 'auto' }}>
                         <h2 style={{ color: 'var(--zone-yellow)', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span>🚶</span> OBSERVATION INTAKE
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            Select a recorded Motion Mapping session below to diagnose field exits and operational waste.
                        </p>
                        
                        {sessions.length === 0 ? (
                            <div style={{ padding: '3rem 2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center', color: '#64748b', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📱</div>
                                No Motion Mapping sessions found.<br/>Go to the Motion mapping module first.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {sessions.map(s => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => setSelectedSessionId(s.id)}
                                        style={{ 
                                            padding: 'clamp(1rem, 2vw, 1.25rem)', 
                                            background: selectedSessionId === s.id ? 'rgba(255,194,14, 0.15)' : 'rgba(0,0,0,0.4)', 
                                            border: `1px solid ${selectedSessionId === s.id ? 'var(--zone-yellow)' : 'rgba(255,255,255,0.1)'}`, 
                                            borderRadius: '8px', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.2s',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div>
                                            <div style={{ color: 'var(--lean-white)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{s.sessionName}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Surgeon: {s.operatorId}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Field Exits</div>
                                                <div style={{ color: s.longestSegment > 0 ? 'var(--accent-warning)' : 'var(--accent-success)', fontWeight: 'bold' }}>{s.longestSegment}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Distance</div>
                                                <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{s.totalDistance} ft</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                    <button 
                                        onClick={() => setStep(1)}
                                        disabled={!selectedSessionId}
                                        style={{ 
                                            padding: '1rem 2rem', 
                                            background: 'var(--zone-yellow)', 
                                            color: '#000', 
                                            border: 'none', 
                                            borderRadius: '8px', 
                                            fontWeight: 'bold', 
                                            fontSize: '1.1rem', 
                                            cursor: !selectedSessionId ? 'not-allowed' : 'pointer',
                                            opacity: !selectedSessionId ? 0.5 : 1,
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        BEGIN DIAGNOSIS →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 1: Cause Classification */}
                {step === 1 && selectedSession && (
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--zone-yellow)', animation: 'fadeIn 0.3s ease-out', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h2 style={{ color: 'var(--lean-white)', margin: 0, fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>FIELD EXIT ANALYSIS</h2>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing: <strong style={{ color: 'var(--lean-white)' }}>{selectedSession.sessionName}</strong></span>
                        </div>
                        
                        <p style={{ color: 'var(--lean-white)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>What was the primary reason the surgeon left the operating field or stopped working?</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                            {CAUSE_CATEGORIES.map(cause => (
                                <button
                                    key={cause}
                                    onClick={() => setInterruptionCause(cause)}
                                    style={{
                                        padding: '1.25rem 1rem',
                                        background: interruptionCause === cause ? 'rgba(255,194,14, 0.2)' : 'rgba(0,0,0,0.4)',
                                        border: `1px solid ${interruptionCause === cause ? 'var(--zone-yellow)' : 'rgba(255,255,255,0.1)'}`,
                                        color: interruptionCause === cause ? 'var(--zone-yellow)' : 'var(--text-main)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s',
                                        fontWeight: interruptionCause === cause ? 'bold' : 'normal',
                                        boxShadow: interruptionCause === cause ? '0 0 10px rgba(255,194,14,0.3)' : 'none'
                                    }}
                                >
                                    {cause}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(0)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
                            <button 
                                onClick={() => setStep(2)}
                                disabled={!interruptionCause}
                                style={{ flex: 1, padding: '0.75rem', background: 'var(--lean-white)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: !interruptionCause ? 'not-allowed' : 'pointer', opacity: !interruptionCause ? 0.5 : 1 }}
                            >
                                NEXT: VALUE CLASSIFICATION →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Value vs Preparation */}
                {step === 2 && selectedSession && (
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--accent-primary)', animation: 'fadeIn 0.3s ease-out', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h2 style={{ color: 'var(--accent-primary)', margin: 0, fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>VALUE CLASSIFICATION</h2>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cause: <strong style={{ color: 'var(--lean-white)' }}>{interruptionCause}</strong></span>
                        </div>
                        
                        <p style={{ color: 'var(--lean-white)', fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center' }}>Did this interrupted step actually change the product (patient) in a way the customer values?</p>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                            <div 
                                onClick={() => setIsValueWork(true)}
                                style={{ 
                                    flex: 1, 
                                    padding: '2.5rem 2rem', 
                                    background: isValueWork === true ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.4)', 
                                    border: `2px solid ${isValueWork === true ? 'var(--accent-success)' : 'rgba(255,255,255,0.1)'}`, 
                                    borderRadius: '12px', 
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: isValueWork === true ? '0 0 15px rgba(16,185,129,0.2)' : 'none'
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                <div style={{ color: isValueWork === true ? 'var(--accent-success)' : 'var(--lean-white)', fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '0.5rem' }}>YES</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This was Value Work.</div>
                            </div>
                            
                            <div 
                                onClick={() => setIsValueWork(false)}
                                style={{ 
                                    flex: 1, 
                                    padding: '2.5rem 2rem', 
                                    background: isValueWork === false ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.4)', 
                                    border: `2px solid ${isValueWork === false ? 'var(--accent-danger)' : 'rgba(255,255,255,0.1)'}`, 
                                    borderRadius: '12px', 
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: isValueWork === false ? '0 0 15px rgba(239,68,68,0.2)' : 'none'
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛑</div>
                                <div style={{ color: isValueWork === false ? 'var(--accent-danger)' : 'var(--lean-white)', fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '0.5rem' }}>NO</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This was Preparation or Support Work.</div>
                            </div>
                        </div>

                        {isValueWork === false && (
                            <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-danger)', color: '#fca5a5', marginBottom: '2rem', borderRadius: '4px' }}>
                                <strong>Operating Room Principle:</strong> Preparation should happen <em style={{textDecoration: 'underline'}}>before</em> the operation begins. If the surgeon is preparing during the procedure, the system is failing the surgeon.
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(1)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
                            <button 
                                onClick={() => setStep(3)}
                                disabled={isValueWork === null}
                                style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isValueWork === null ? 'not-allowed' : 'pointer', opacity: isValueWork === null ? 0.5 : 1 }}
                            >
                                NEXT: ROOT CAUSE NOTES →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Summary and Handoff */}
                {step === 3 && selectedSession && (
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--accent-success)', animation: 'fadeIn 0.3s ease-out', overflowY: 'auto' }}>
                        <h2 style={{ color: 'var(--accent-success)', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>DIAGNOSIS SUMMARY</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Observed Action</div>
                                <div style={{ color: 'var(--lean-white)', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedSession.sessionName}</div>
                                <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{selectedSession.longestSegment} Field Exits observed.</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Diagnostic Conclusion</div>
                                <div style={{ color: 'var(--lean-white)', fontWeight: 'bold', fontSize: '1.1rem' }}>{interruptionCause}</div>
                                <div style={{ color: isValueWork ? 'var(--accent-success)' : 'var(--accent-danger)', fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: 'bold' }}>
                                    {isValueWork ? 'Value Work' : 'Preparation / Waste'}
                                </div>
                            </div>
                        </div>

                        {/* Re-integrated Visual Waste Capture */}
                        <div className="card" style={{ background: 'rgba(0,0,0,0.4)', padding: 'clamp(1rem, 2vw, 1.5rem)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h3 style={{ margin: 0, color: 'var(--lean-white)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📸</span> VISUAL EVIDENCE CAPTURE
                                </h3>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isAnalyzing}
                                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-dark)', color: 'var(--lean-white)', border: '1px solid var(--accent-primary)', borderRadius: '8px', fontWeight: 'bold', cursor: isAnalyzing ? 'wait' : 'pointer', opacity: isAnalyzing ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    {isAnalyzing ? '🔄 ANALYZING...' : '📷 ADD PHOTO'}
                                </button>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    capture="environment" 
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handlePhotoCapture}
                                />
                            </div>

                            {capturedWastes.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                    {capturedWastes.map(waste => (
                                        <div key={waste.id} style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                                            <div style={{ width: '80px', minHeight: '80px', backgroundImage: `url(${waste.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                            <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <div style={{ color: 'var(--zone-yellow)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                    {waste.category}
                                                </div>
                                                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.3 }}>
                                                    {waste.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Re-integrated Operator Feedback */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                                <span>🗣️</span> Operator Engagement
                            </label>
                            <textarea
                                value={operatorFeedback}
                                onChange={(e) => setOperatorFeedback(e.target.value)}
                                placeholder="Did you ask the operator what their biggest boulder/friction point is?"
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>Root Cause Notes & Context</label>
                            <textarea
                                value={rootCauseNotes}
                                onChange={(e) => setRootCauseNotes(e.target.value)}
                                placeholder="e.g., Surgeon had to walk 40ft to retrieve the drill because the shadow board was empty..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(16, 185, 129, 0.4)', textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ color: 'var(--accent-success)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Ready for Improvement</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This diagnosis will be handed off to the Improve module to generate experiments and solutions.</div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setStep(2)} style={{ flex: '1 1 100px', padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
                            <button 
                                onClick={handleSaveDiagnosis}
                                style={{ flex: '2 1 200px', padding: '1rem', background: 'var(--accent-success)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', transition: 'background 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.background = '#0e9f6e'}
                                onMouseOut={e => e.currentTarget.style.background = 'var(--accent-success)'}
                            >
                                SAVE & CREATE IMPROVEMENT CARD ⚡
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </HardwareConsoleLayout>
    );
}
