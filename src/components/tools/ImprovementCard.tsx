import { useState, useEffect } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import { supabase } from '../../lib/supabase';
import type { ProcessCheck, ImprovementCard as ImprovementCardType } from '../../types/improvement';

export default function ImprovementCard({ onClose }: { onClose: () => void }) {
    const [diagnoses, setDiagnoses] = useState<ProcessCheck[]>([]);
    const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string>('');
    const [step, setStep] = useState<number>(0);

    // Improvement State
    const [title, setTitle] = useState('');
    const [owner, setOwner] = useState('');
    const [status, setStatus] = useState<'Planned' | 'In Test' | 'Implemented' | 'Needs Follow-Up'>('Planned');
    const [countermeasure, setCountermeasure] = useState('');
    
    // Before/After State
    const [beforeCondition, setBeforeCondition] = useState('');
    const [beforeImageUrl, setBeforeImageUrl] = useState('');
    const [afterCondition, setAfterCondition] = useState('');
    const [afterImageUrl, setAfterImageUrl] = useState('');
    
    // Results
    const [expectedFieldExits, setExpectedFieldExits] = useState<number>(0);
    const [measuredFieldExits, setMeasuredFieldExits] = useState<string>('');
    const [expectedDistance, setExpectedDistance] = useState<number>(0);
    const [measuredDistance, setMeasuredDistance] = useState<string>('');
    
    // Action
    const [nextAction, setNextAction] = useState<'Standardize Change' | 'Test Again' | 'Escalate' | 'Reopen Diagnosis' | ''>('');

    const refreshData = () => {
        const data = ImprovementEngine.getItemsByType<ProcessCheck>('ProcessCheck');
        // Sort newest first
        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setDiagnoses(sortedData);
        return sortedData;
    };

    useEffect(() => {
        const initialData = refreshData();
        // Auto-select the most recent diagnosis to save UX clicks if they just arrived from the Diagnosis tool
        if (initialData.length > 0) {
            setSelectedDiagnosisId(initialData[0].id);
            setStep(1);
        }

        const listener = () => refreshData();
        window.addEventListener('improvement_data_updated', listener);
        return () => window.removeEventListener('improvement_data_updated', listener);
    }, []);

    const selectedDiagnosis = diagnoses.find(d => d.id === selectedDiagnosisId);

    const handleSaveImprovement = () => {
        if (!selectedDiagnosis || !title || !owner || !countermeasure || !nextAction) {
            alert("Please complete all required fields (Title, Owner, Countermeasure, Next Action).");
            return;
        }

        ImprovementEngine.createItem<ImprovementCardType>({
            type: 'ImprovementCard',
            title,
            owner,
            status,
            linkedProcessCheckId: selectedDiagnosis.id,
            countermeasure,
            beforeCondition,
            beforeImageUrl: beforeImageUrl || undefined,
            afterCondition,
            afterImageUrl: afterImageUrl || undefined,
            expectedFieldExits,
            measuredFieldExits: measuredFieldExits ? parseInt(measuredFieldExits) : undefined,
            expectedDistance,
            measuredDistance: measuredDistance ? parseFloat(measuredDistance) : undefined,
            nextAction
        });

        // Reset
        setStep(0);
        setSelectedDiagnosisId('');
        setTitle('');
        setOwner('');
        setStatus('Planned');
        setCountermeasure('');
        setBeforeCondition('');
        setBeforeImageUrl('');
        setAfterCondition('');
        setAfterImageUrl('');
        setExpectedFieldExits(0);
        setMeasuredFieldExits('');
        setExpectedDistance(0);
        setMeasuredDistance('');
        setNextAction('');
        onClose(); // Seamlessly return to HUD
    };

    return (
        <HardwareConsoleLayout 
            toolId="IMP-01 COUNTERMEASURE" 
            toolName="IMPROVEMENT CARD" 
            onClose={onClose}
        >
            <div style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
                
                {/* Step 0: Intake / Handoff */}
                {step === 0 && (
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--zone-yellow)' }}>
                        <h2 style={{ color: 'var(--zone-yellow)', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px' }}>DIAGNOSIS HANDOFF</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Select a completed Process Check to attach an improvement countermeasure.</p>
                        
                        {diagnoses.length === 0 ? (
                            <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center', color: '#64748b', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                No Process Checks found. Go to the Diagnose module to perform root cause analysis on an observation first.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {diagnoses.map(d => (
                                    <div 
                                        key={d.id} 
                                        onClick={() => setSelectedDiagnosisId(d.id)}
                                        style={{ 
                                            padding: '1.25rem', 
                                            background: selectedDiagnosisId === d.id ? 'rgba(255,194,14,0.15)' : 'rgba(0,0,0,0.4)', 
                                            border: `1px solid ${selectedDiagnosisId === d.id ? 'var(--zone-yellow)' : 'rgba(255,255,255,0.1)'}`, 
                                            borderRadius: '8px', 
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            <div>
                                                <div style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '1.1rem' }}>{d.processName}</div>
                                                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Operator: {d.operatorId}</div>
                                            </div>
                                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '20px', color: '#ffffff', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid var(--zone-yellow)' }}>
                                                {d.wasteTypes[0] || 'Unknown Cause'}
                                            </div>
                                        </div>
                                        
                                        <div style={{ color: '#94a3b8', fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', borderLeft: '2px solid #475569' }}>
                                            {d.findings.includes('Notes: ') ? d.findings.split('Notes: ')[1] : 'No additional notes provided.'}
                                        </div>
                                    </div>
                                ))}
                                
                                <button 
                                    onClick={() => setStep(1)}
                                    disabled={!selectedDiagnosisId}
                                    style={{ 
                                        marginTop: '1.5rem', 
                                        padding: '1rem', 
                                        background: 'var(--zone-yellow)', 
                                        color: '#000', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        fontWeight: 'bold', 
                                        fontSize: '1rem', 
                                        cursor: !selectedDiagnosisId ? 'not-allowed' : 'pointer',
                                        opacity: !selectedDiagnosisId ? 0.5 : 1
                                    }}
                                >
                                    BEGIN IMPROVEMENT CARD →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 1: Definition & Before/After */}
                {step === 1 && selectedDiagnosis && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Summary Panel */}
                        <div style={{ background: 'var(--bg-panel)', padding: '1rem 1.5rem', borderRadius: '8px', borderLeft: '4px solid #ffffff', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div>
                                <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Diagnosed Root Cause</div>
                                <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedDiagnosis.wasteTypes[0] || 'Unknown'} for {selectedDiagnosis.processName}</div>
                            </div>
                            <button onClick={() => setStep(0)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Change Handoff</button>
                        </div>

                        {/* Definition Form */}
                        <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--zone-yellow)' }}>
                            <h2 style={{ color: 'var(--zone-yellow)', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.1rem)', letterSpacing: '1px' }}>IMPROVEMENT COUNTERMEASURE</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Improvement Title</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Relocate Setup" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Owner</label>
                                    <input type="text" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Lead/Operator" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Status</label>
                                    <select value={status} onChange={e => setStatus(e.target.value as any)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}>
                                        <option value="Planned">Planned</option>
                                        <option value="In Test">In Test</option>
                                        <option value="Implemented">Implemented</option>
                                        <option value="Needs Follow-Up">Needs Follow-Up</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Countermeasure (What will change?)</label>
                                <textarea value={countermeasure} onChange={e => setCountermeasure(e.target.value)} placeholder="Describe the specific fix..." style={{ width: '100%', minHeight: '80px', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit' }} />
                            </div>
                        </div>

                        {/* Before / After */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 1.5rem)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ color: '#ef4444', margin: 0, fontSize: '1rem', textTransform: 'uppercase' }}>Before Operation</h3>
                                    <label style={{ cursor: 'pointer', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        📷 SNAP PHOTO
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            capture="environment" 
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                if(e.target.files && e.target.files[0]) {
                                                    const f = e.target.files[0];
                                                    const fileName = `kaizen/${Date.now()}_before.${f.name.split('.').pop()}`;
                                                    const { error } = await supabase.storage.from('jfi_uploads').upload(fileName, f);
                                                    if (!error) {
                                                        const { data } = supabase.storage.from('jfi_uploads').getPublicUrl(fileName);
                                                        setBeforeImageUrl(data.publicUrl);
                                                    } else {
                                                        setBeforeImageUrl(URL.createObjectURL(f)); // local fallback
                                                    }
                                                }
                                            }} 
                                        />
                                    </label>
                                </div>
                                {beforeImageUrl && (
                                    <div style={{ width: '100%', height: '150px', backgroundImage: `url(${beforeImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.5)' }}></div>
                                )}
                                <textarea value={beforeCondition} onChange={e => setBeforeCondition(e.target.value)} placeholder="Describe the current problematic state (Optional if photo provided)..." style={{ width: '100%', minHeight: '80px', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit' }} />
                            </div>

                            <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 2vw, 1.5rem)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ color: '#10b981', margin: 0, fontSize: '1rem', textTransform: 'uppercase' }}>After Operation</h3>
                                    <label style={{ cursor: 'pointer', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        📷 SNAP PHOTO
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            capture="environment" 
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                if(e.target.files && e.target.files[0]) {
                                                    const f = e.target.files[0];
                                                    const fileName = `kaizen/${Date.now()}_after.${f.name.split('.').pop()}`;
                                                    const { error } = await supabase.storage.from('jfi_uploads').upload(fileName, f);
                                                    if (!error) {
                                                        const { data } = supabase.storage.from('jfi_uploads').getPublicUrl(fileName);
                                                        setAfterImageUrl(data.publicUrl);
                                                    } else {
                                                        setAfterImageUrl(URL.createObjectURL(f)); // local fallback
                                                    }
                                                }
                                            }} 
                                        />
                                    </label>
                                </div>
                                {afterImageUrl && (
                                    <div style={{ width: '100%', height: '150px', backgroundImage: `url(${afterImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.5)' }}></div>
                                )}
                                <textarea value={afterCondition} onChange={e => setAfterCondition(e.target.value)} placeholder="Describe the intended target state (Optional if photo provided)..." style={{ width: '100%', minHeight: '80px', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setStep(2)}
                                disabled={!title || !owner || !countermeasure || (!beforeCondition && !beforeImageUrl) || (!afterCondition && !afterImageUrl)}
                                style={{ padding: '0.75rem 2rem', background: 'var(--lean-white)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (!title || !owner || !countermeasure || (!beforeCondition && !beforeImageUrl) || (!afterCondition && !afterImageUrl)) ? 'not-allowed' : 'pointer', opacity: (!title || !owner || !countermeasure || (!beforeCondition && !beforeImageUrl) || (!afterCondition && !afterImageUrl)) ? 0.5 : 1 }}
                            >
                                CONTINUE TO METRICS →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Results & Next Action */}
                {step === 2 && selectedDiagnosis && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--zone-yellow)' }}>
                            <h2 style={{ color: 'var(--zone-yellow)', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.1rem)', letterSpacing: '1px' }}>MEASURED RESULTS</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                                {/* Field Exits Panel */}
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ color: '#e2e8f0', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>Operator Field Exits</h3>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Expected Target</label>
                                            <input type="number" value={expectedFieldExits} onChange={e => setExpectedFieldExits(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px dashed #64748b', color: 'white', borderRadius: '4px', fontSize: '1.25rem', textAlign: 'center' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: 'var(--zone-yellow)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Actual Measured</label>
                                            <input type="number" placeholder="-" value={measuredFieldExits} onChange={e => setMeasuredFieldExits(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,194,14,0.1)', border: '1px solid var(--zone-yellow)', color: 'var(--zone-yellow)', borderRadius: '4px', fontSize: '1.25rem', textAlign: 'center', fontWeight: 'bold' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Distance Panel */}
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ color: '#e2e8f0', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>Travel Distance (ft)</h3>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Expected Target</label>
                                            <input type="number" value={expectedDistance} onChange={e => setExpectedDistance(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px dashed #64748b', color: 'white', borderRadius: '4px', fontSize: '1.25rem', textAlign: 'center' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', color: 'var(--zone-yellow)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Actual Measured</label>
                                            <input type="number" placeholder="-" value={measuredDistance} onChange={e => setMeasuredDistance(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,194,14,0.1)', border: '1px solid var(--zone-yellow)', color: 'var(--zone-yellow)', borderRadius: '4px', fontSize: '1.25rem', textAlign: 'center', fontWeight: 'bold' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Action */}
                        <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--accent-warning)' }}>
                            <h2 style={{ color: 'var(--accent-warning)', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.1rem)', letterSpacing: '1px' }}>NEXT OPERATION</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                                {['Standardize Change', 'Test Again', 'Escalate', 'Reopen Diagnosis'].map(action => (
                                    <button
                                        key={action}
                                        onClick={() => setNextAction(action as any)}
                                        style={{
                                            padding: '1rem',
                                            background: nextAction === action ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${nextAction === action ? 'var(--accent-warning)' : 'rgba(255,255,255,0.1)'}`,
                                            color: nextAction === action ? 'var(--accent-warning)' : '#cbd5e1',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s',
                                            fontWeight: nextAction === action ? 'bold' : 'normal',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button onClick={() => setStep(1)} style={{ flex: '1 1 100px', padding: '0.75rem 1.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                                <button 
                                    onClick={handleSaveImprovement}
                                    disabled={!nextAction}
                                    style={{ flex: '2 1 200px', padding: '1rem', background: 'var(--accent-warning)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: !nextAction ? 'not-allowed' : 'pointer', letterSpacing: '1px', opacity: !nextAction ? 0.5 : 1 }}
                                >
                                    SAVE & COMPLETE LOOP
                                </button>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </HardwareConsoleLayout>
    );
}
