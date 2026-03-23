import { useState } from 'react';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { Observation } from '../../types/improvement';
import HardwareConsoleLayout from './HardwareConsoleLayout';

export default function ValueScanner({ onClose }: { onClose: () => void }) {
    const [notes, setNotes] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const logObservation = (classification: 'Value Add' | 'Non-Value Add' | 'Waste') => {
        if (!notes.trim()) {
            alert('Please add some observation notes first.');
            return;
        }

        ImprovementEngine.createItem<Observation>({
            type: 'Observation',
            notes,
            valueClassification: classification,
            severity: classification === 'Waste' ? 'High' : classification === 'Non-Value Add' ? 'Medium' : 'Low'
        });

        setSuccessMsg(`Logged: ${classification}`);
        setNotes('');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    return (
        <HardwareConsoleLayout toolId="OBS-02" toolName="VALUE SCANNER" onClose={onClose}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    padding: 'clamp(1rem, 2vw, 2rem)', 
                    textAlign: 'center', 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflowY: 'auto'
                }}>
                    <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Help users determine whether work is value-added. Evaluate whether the work changes fit, form, or function.
                    </p>
                    
                    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', background: 'rgba(0,0,0,0.4)', padding: 'clamp(1rem, 2vw, 1.5rem)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Record Work Observation</h4>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What is the operator currently doing? (e.g., 'Walking to fetch tools', 'Assembling part A to B')"
                            style={{ width: '100%', height: '80px', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #475569', color: 'white', marginBottom: '1.5rem', resize: 'none', fontSize: '1rem' }}
                        />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                            <button onClick={() => logObservation('Value Add')} style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✅</div>
                                <div style={{ fontSize: '0.8rem' }}>Value Add</div>
                            </button>
                            <button onClick={() => logObservation('Non-Value Add')} style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #ffffff', color: '#fbbf24', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⚠️</div>
                                <div style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>Non-Value Add<br/>(Required)</div>
                            </button>
                            <button onClick={() => logObservation('Waste')} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🗑️</div>
                                <div style={{ fontSize: '0.8rem' }}>Waste</div>
                            </button>
                        </div>

                        {successMsg && (
                            <div style={{ marginTop: '1rem', color: '#34d399', fontWeight: 'bold', animation: 'fadeIn 0.3s ease-in', fontSize: '0.9rem' }}>
                                {successMsg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HardwareConsoleLayout>
    );
}
