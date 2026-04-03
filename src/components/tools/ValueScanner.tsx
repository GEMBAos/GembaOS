import { useState, useEffect } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';

type VsmBlock = {
    id: string;
    type: 'process' | 'wait';
    name: string;
    time: number;
};

export default function ValueScanner({ onClose }: { onClose: () => void }) {
    const [blocks, setBlocks] = useState<VsmBlock[]>(() => {
        const saved = localStorage.getItem('gembaos_vsm_blocks');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return [
            { id: '1', type: 'wait', name: 'Raw Material Inventory', time: 14400 }, // 10 days
            { id: '2', type: 'process', name: 'Machining', time: 12 }, 
            { id: '3', type: 'wait', name: 'WIP Queue', time: 2880 }, // 2 days
            { id: '4', type: 'process', name: 'Final Assembly', time: 25 }, 
        ];
    });

    useEffect(() => {
        localStorage.setItem('gembaos_vsm_blocks', JSON.stringify(blocks));
    }, [blocks]);

    const formatTime = (mins: number) => {
        if (mins === 0) return '0 Mins';
        if (mins >= 1440) return `${+(mins / 1440).toFixed(1)} Days`;
        if (mins >= 60) return `${+(mins / 60).toFixed(1)} Hrs`;
        return `${mins} Mins`;
    };

    const addBlock = (type: 'process' | 'wait') => {
        setBlocks([...blocks, {
            id: crypto.randomUUID(),
            type,
            name: type === 'process' ? 'New Process' : 'Wait / Queue',
            time: type === 'process' ? 10 : 1440
        }]);
    };

    const updateBlock = (id: string, field: keyof VsmBlock, value: string | number) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const totalTime = blocks.reduce((sum, b) => sum + b.time, 0);
    const vaTime = blocks.filter(b => b.type === 'process').reduce((sum, b) => sum + b.time, 0);
    const pce = totalTime > 0 ? (vaTime / totalTime) * 100 : 0;

    return (
        <HardwareConsoleLayout toolId="VSM-01" toolName="VALUE STREAM MAPPER" onClose={onClose}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
                
                {/* Metrics Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-danger)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Lead Time (PLT)</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--lean-white)', fontFamily: 'var(--font-headings)' }}>{formatTime(totalTime)}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-success)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Value-Add Time (VA)</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-success)', fontFamily: 'var(--font-headings)' }}>{formatTime(vaTime)}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--zone-yellow)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Process Cycle Eff (PCE)</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--zone-yellow)', fontFamily: 'var(--font-headings)' }}>{pce.toFixed(2)}%</div>
                    </div>
                </div>

                {/* Map Builder Area */}
                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: '400px' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', background: 'var(--bg-dark)' }}>
                        <button className="shadow-btn-accent" onClick={() => addBlock('process')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 800, flex: 1 }}>+ ADD PROCESS (VA)</button>
                        <button className="shadow-btn-danger" onClick={() => addBlock('wait')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 800, flex: 1 }}>+ ADD WAIT (NVA)</button>
                    </div>
                    
                    {/* The Mapping Canvas - Vertical Flow */}
                    <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--gemba-black)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', width: '100%', maxWidth: '400px', paddingBottom: '2rem' }}>
                            {blocks.map((block, index) => (
                                <div key={block.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    
                                    {/* The Block */}
                                    <div style={{ 
                                        width: '100%', 
                                        background: 'var(--bg-panel)', 
                                        border: `2px solid ${block.type === 'process' ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
                                        borderRadius: block.type === 'process' ? '4px' : '50px',
                                        padding: '1.5rem',
                                        position: 'relative',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem'
                                    }}>
                                        <button 
                                            onClick={() => removeBlock(block.id)}
                                            style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent-danger)', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', zIndex: 10 }}
                                        >✕</button>
                                        
                                        <div style={{ background: 'var(--bg-dark)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center', color: block.type === 'process' ? 'var(--accent-success)' : 'var(--accent-danger)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>
                                            {block.type === 'process' ? 'PROCESS STEP' : 'INVENTORY / WAIT'}
                                        </div>

                                        <div>
                                            <input 
                                                type="text" 
                                                value={block.name}
                                                onChange={e => updateBlock(block.id, 'name', e.target.value)}
                                                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px dashed var(--steel-gray)', color: 'var(--lean-white)', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center', paddingBottom: '0.5rem', marginBottom: '1rem', outline: 'none' }}
                                                placeholder="Step Name"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                            <input 
                                                type="number" 
                                                value={block.time}
                                                onChange={e => updateBlock(block.id, 'time', Number(e.target.value))}
                                                style={{ width: '80px', background: 'var(--bg-dark)', border: '1px solid var(--border-light)', color: 'var(--zone-yellow)', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', padding: '0.5rem', borderRadius: '4px', outline: 'none' }}
                                            />
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Mins</span>
                                        </div>
                                    </div>

                                    {/* Arrow connection to next block (Downward) */}
                                    {index < blocks.length - 1 && (
                                        <div style={{ height: '40px', width: '4px', background: 'var(--steel-gray)', position: 'relative' }}>
                                            <div style={{ position: 'absolute', bottom: '-5px', left: '-6px', width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '12px solid var(--steel-gray)' }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {blocks.length === 0 && (
                                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>Map is empty. Add a process or wait block to begin mapping the value stream.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </HardwareConsoleLayout>
    );
}
