import { useState } from 'react';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { Observation } from '../../types/improvement';

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
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, color: '#f8fafc', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px' }}>
                    <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))' }}>☑️</span> VALUE SCANNER
                </h2>
                <button 
                    onClick={onClose} 
                    style={{ 
                        background: 'rgba(15, 23, 42, 0.8)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)', 
                        color: '#e2e8f0', 
                        padding: '0.75rem 1.25rem', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>❮</span> COMMAND CENTER
                </button>
            </div>
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.6)' }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Operating Room Tool</h3>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto', marginBottom: '2rem' }}>
                    Help users determine whether work is value-added. Evaluate whether the work changes fit, form, or function.
                </p>
                
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>Record Work Observation</h4>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What is the operator currently doing? (e.g., 'Walking to fetch tools', 'Assembling part A to B')"
                        style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #475569', color: 'white', marginBottom: '1.5rem', resize: 'none', fontSize: '1rem' }}
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <button onClick={() => logObservation('Value Add')} style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', padding: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
                            Value Add
                        </button>
                        <button onClick={() => logObservation('Non-Value Add')} style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #ffffff', color: '#fbbf24', padding: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                            Non-Value Add (Required)
                        </button>
                        <button onClick={() => logObservation('Waste')} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🗑️</div>
                            Waste
                        </button>
                    </div>

                    {successMsg && (
                        <div style={{ marginTop: '1.5rem', color: '#34d399', fontWeight: 'bold', animation: 'fadeIn 0.3s ease-in' }}>
                            {successMsg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
