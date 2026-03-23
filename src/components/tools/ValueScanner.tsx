import { useState } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';

type VsmBlock = {
    id: string;
    type: 'process' | 'wait';
    name: string;
    time: number;
};

export default function ValueScanner({ onClose }: { onClose: () => void }) {
    const [blocks, setBlocks] = useState<VsmBlock[]>([
        { id: '1', type: 'wait', name: 'Raw Material Inventory', time: 14400 }, // 10 days
        { id: '2', type: 'process', name: 'Machining', time: 12 }, 
        { id: '3', type: 'wait', name: 'WIP Queue', time: 2880 }, // 2 days
        { id: '4', type: 'process', name: 'Final Assembly', time: 25 }, 
    ]);

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
                        <button className="shadow-btn-accent" onClick={() => addBlock('process')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}>+ ADD PROCESS (VA)</button>
                        <button className="shadow-btn-danger" onClick={() => addBlock('wait')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}>+ ADD WAIT (NVA)</button>
                    </div>
                    
                    {/* The Mapping Canvas */}
                    <div style={{ flex: 1, padding: '2rem', overflowX: 'auto', overflowY: 'hidden', display: 'flex', alignItems: 'center', background: 'var(--gemba-black)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0', minWidth: 'min-content', paddingBottom: '2rem' }}>
                            {blocks.map((block, index) => (
                                <div key={block.id} style={{ display: 'flex', alignItems: 'center' }}>
                                    
                                    {/* The Block */}
                                    <div style={{ 
                                        width: '220px', 
                                        background: 'var(--bg-panel)', 
                                        border: `2px solid ${block.type === 'process' ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
                                        borderRadius: block.type === 'process' ? '0' : '100px',
                                        padding: '1.5rem',
                                        position: 'relative',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        flexShrink: 0
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

                                    {/* Arrow connection to next block */}
                                    {index < blocks.length - 1 && (
                                        <div style={{ width: '60px', height: '4px', background: 'var(--steel-gray)', position: 'relative', flexShrink: 0 }}>
                                            <div style={{ position: 'absolute', right: '-5px', top: '-6px', width: '0', height: '0', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid var(--steel-gray)' }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {blocks.length === 0 && (
                                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Map is empty. Add a process or wait block to begin mapping the value stream.</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Time Line (Classic VSM Castle Wall shape) */}
                    <div style={{ height: '120px', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-end', padding: '0 2rem 2rem 2rem', overflowX: 'auto', overflowY: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', minWidth: 'min-content' }}>
                            {blocks.map((block, index) => (
                                <div key={`tl-${block.id}`} style={{ display: 'flex', alignItems: 'flex-end', width: index === blocks.length - 1 ? '220px' : '280px', flexShrink: 0 }}>
                                    {/* Bottom segment for Process, Top segment for Wait */}
                                    <div style={{ 
                                        width: '100%', 
                                        height: block.type === 'process' ? '20px' : '60px', 
                                        border: `2px solid ${block.type === 'process' ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
                                        borderBottom: 'none',
                                        borderRight: 'none',
                                        position: 'relative'
                                    }}>
                                        <div style={{ position: 'absolute', bottom: block.type === 'process' ? '-25px' : '5px', left: '10px', color: 'var(--lean-white)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            {formatTime(block.time)}
                                        </div>
                                        {block.type === 'wait' && (
                                            <div style={{ position: 'absolute', top: '-25px', left: '10px', color: 'var(--accent-danger)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                NON-VAL
                                            </div>
                                        )}
                                        {block.type === 'process' && (
                                            <div style={{ position: 'absolute', top: '5px', left: '10px', color: 'var(--accent-success)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                VALUE ADD
                                            </div>
                                        )}
                                    </div>
                                    {/* Right vertical drop to connect */}
                                    <div style={{ width: '2px', height: block.type === 'process' ? '20px' : '60px', background: block.type === 'process' ? 'var(--accent-success)' : 'var(--accent-danger)' }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </HardwareConsoleLayout>
    );
}
