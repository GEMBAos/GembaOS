/**
 * ARCHIVE NOTICE
 * Original Use: Currently holding for defect capture capability.
 * Moved to: hold_for_adaptation
 */

import { useState } from 'react';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { Defect } from '../../types/improvement';

export default function DefectGuard({ onClose }: { onClose: () => void }) {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Scrap');
    const [severity, setSeverity] = useState<'Minor'|'Major'|'Critical'>('Major');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = () => {
        if (!description.trim()) {
            alert('Please describe the defect risk.');
            return;
        }

        ImprovementEngine.createItem<Defect>({
            type: 'Defect',
            description,
            category,
            severity,
            status: 'Open'
        });

        setSuccessMsg(`Defect Logged Successfully.`);
        setDescription('');
        setTimeout(() => setSuccessMsg(''), 3000);
    };
    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, color: '#f8fafc', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px' }}>
                    <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))' }}>🛡️</span> DEFECT GUARD
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
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'left', background: 'rgba(15, 23, 42, 0.6)' }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '1rem', textAlign: 'center' }}>Operating Room Tool</h3>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto', textAlign: 'center', marginBottom: '2rem' }}>
                    Identify risks where defects could escape downstream. Help teams prevent defects rather than detect them later.
                </p>
                
                <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Defect Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What defect occurs or could occur here?"
                            style={{ width: '100%', height: '80px', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #475569', color: 'white', resize: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #475569', color: 'white' }}>
                                <option value="Scrap">Scrap</option>
                                <option value="Rework">Rework</option>
                                <option value="Missing Part">Missing Part</option>
                                <option value="Damage">Damage</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Severity</label>
                            <select value={severity} onChange={e => setSeverity(e.target.value as any)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #475569', color: 'white' }}>
                                <option value="Minor">Minor</option>
                                <option value="Major">Major</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleSubmit} style={{ width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Log Defect Risk
                    </button>

                    {successMsg && (
                        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#34d399', fontWeight: 'bold', animation: 'fadeIn 0.3s ease-in' }}>
                            {successMsg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
