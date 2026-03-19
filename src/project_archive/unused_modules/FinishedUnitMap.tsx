/**
 * ARCHIVE NOTICE
 * Original Use: Used for tracking finished goods location mapping.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gembaos_finished_unit_data';

interface ComponentPart {
    id: string;
    name: string;
    inventory: number;
    requiredQty: number;
}

export default function FinishedUnitMap({ onClose }: { onClose: () => void }) {
    const getInitialState = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) { console.error("Could not load saved data", e); }
        return null;
    };

    const initial = getInitialState();

    const [unitName, setUnitName] = useState<string>(initial?.unitName || "Final Assembly");
    const [components, setComponents] = useState<ComponentPart[]>(initial?.components || [
        { id: '1', name: 'Main Chassis', inventory: 15, requiredQty: 1 },
        { id: '2', name: 'Sub-Assembly B', inventory: 24, requiredQty: 2 },
        { id: '3', name: 'Fastener Pack', inventory: 100, requiredQty: 4 }
    ]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ unitName, components }));
    }, [unitName, components]);

    const addComponent = () => {
        setComponents([...components, {
            id: Date.now().toString(),
            name: `Component ${components.length + 1}`,
            inventory: 0,
            requiredQty: 1
        }]);
    };

    const updateComponent = (id: string, field: keyof ComponentPart, value: any) => {
        setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeComponent = (id: string) => {
        setComponents(components.filter(c => c.id !== id));
    };

    // Calculations
    const possibleUnitsCalculations = components.map(c => ({
        ...c,
        possibleUnits: c.requiredQty > 0 ? Math.floor(c.inventory / c.requiredQty) : 0
    }));

    const maxUnitsPossible = possibleUnitsCalculations.length > 0 
        ? Math.min(...possibleUnitsCalculations.map(c => c.possibleUnits)) 
        : 0;

    const pacingComponents = possibleUnitsCalculations.filter(c => c.possibleUnits === maxUnitsPossible);
    const hasData = components.length > 0;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'white', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, color: '#f8fafc', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px' }}>
                    <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))' }}>📦</span> FINISHED UNIT MAP
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                
                {/* Result Dashboard */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '2rem', border: '1px solid rgba(148, 163, 184, 0.2)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Finished Units Possible</div>
                        <div style={{ fontSize: '4rem', fontWeight: '900', color: maxUnitsPossible > 0 ? '#4ade80' : '#f87171', textShadow: `0 0 20px ${maxUnitsPossible > 0 ? '#4ade80' : '#f87171'}80` }}>
                            {maxUnitsPossible}
                        </div>
                        <input 
                            value={unitName}
                            onChange={(e) => setUnitName(e.target.value)}
                            style={{ background: 'transparent', border: 'none', borderBottom: '1px dashed #475569', color: '#94a3b8', fontSize: '1.2rem', textAlign: 'center', width: '100%', marginTop: '1rem', padding: '0.5rem' }}
                            placeholder="Unit Name"
                        />
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))', padding: '1.5rem', borderLeft: `4px solid #ef4444`, borderTop: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '1px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⚠️</span> Constraint Analysis
                        </h3>
                        
                        {!hasData ? (
                            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                Add components and inventory levels to identify the assembly constraints.
                            </p>
                        ) : pacingComponents.length > 0 ? (
                            <div>
                                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    The pacing component(s) limiting production are:
                                </p>
                                <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0 0 0', color: '#fca5a5', fontSize: '0.95rem', fontWeight: 'bold' }}>
                                    {pacingComponents.map(c => <li key={c.id}>{c.name}</li>)}
                                </ul>
                                <p style={{ margin: '0.75rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                    <strong>Next Step:</strong> Focus expediting and problem-solving efforts exclusively on these components. Overproducing non-pacing components will only create inventory waste.
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Editor List */}
                <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '1px', margin: 0 }}>Bill of Materials (BOM)</h3>
                            <button onClick={addComponent} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>+ Add Component</button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) 1fr 1fr 1fr auto', gap: '1rem', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                            <div>Component Name</div>
                            <div>On-Hand Qty</div>
                            <div>Qty / Unit</div>
                            <div>Possible Units</div>
                            <div></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {components.map((comp) => {
                                const isPacing = pacingComponents.some(p => p.id === comp.id);
                                const possibleUnits = comp.requiredQty > 0 ? Math.floor(comp.inventory / comp.requiredQty) : 0;
                                
                                return (
                                    <div key={comp.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', background: isPacing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: isPacing ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                                        <input 
                                            value={comp.name} 
                                            onChange={(e) => updateComponent(comp.id, 'name', e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.95rem', width: '100%' }}
                                        />
                                        <input 
                                            type="number"
                                            value={comp.inventory} 
                                            onChange={(e) => updateComponent(comp.id, 'inventory', Number(e.target.value))}
                                            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #475569', color: '#38bdf8', padding: '0.5rem', borderRadius: '4px', fontSize: '0.95rem', width: '100%' }}
                                        />
                                        <input 
                                            type="number"
                                            value={comp.requiredQty} 
                                            onChange={(e) => updateComponent(comp.id, 'requiredQty', Number(e.target.value))}
                                            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #475569', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.95rem', width: '100%' }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', color: isPacing ? '#f87171' : 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            {possibleUnits}
                                            {isPacing && <span style={{fontSize:'0.8rem', marginLeft:'0.5rem', filter:'drop-shadow(0 0 5px rgba(239, 68, 68, 0.8))'}}>⚠️</span>}
                                        </div>
                                        <button 
                                            onClick={() => removeComponent(comp.id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
