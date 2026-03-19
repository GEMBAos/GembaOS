/**
 * ARCHIVE NOTICE
 * Original Use: Currently holding for future process mapping tool pieces.
 * Moved to: hold_for_adaptation
 */

import React, { useState, useEffect } from 'react';
import gembaosIcon from '../../assets/branding/gembaos-icon.png';

export interface ProcessStep {
    id: string;
    type: 'start' | 'process' | 'decision' | 'end';
    text: string;
}

export default function ProcessMap() {
    const [nodes, setNodes] = useState<ProcessStep[]>([]);
    const [newNodeText, setNewNodeText] = useState('');
    const [newNodeType, setNewNodeType] = useState<'start' | 'process' | 'decision' | 'end'>('process');

    useEffect(() => {
        const saved = localStorage.getItem('kaizen_processmap_data');
        if (saved) {
            try {
                setNodes(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load process map data", e);
            }
        } else {
            // Default seed
            setNodes([{ id: crypto.randomUUID(), type: 'start', text: 'Start Process' }]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('kaizen_processmap_data', JSON.stringify(nodes));
    }, [nodes]);

    const handleAddNode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNodeText.trim()) return;

        setNodes([...nodes, {
            id: crypto.randomUUID(),
            type: newNodeType,
            text: newNodeText.trim()
        }]);
        setNewNodeText('');
    };

    const handleDeleteNode = (id: string) => {
        setNodes(nodes.filter(n => n.id !== id));
    };

    const moveNodeUp = (index: number) => {
        if (index > 0) {
            const newNodes = [...nodes];
            [newNodes[index - 1], newNodes[index]] = [newNodes[index], newNodes[index - 1]];
            setNodes(newNodes);
        }
    };

    const moveNodeDown = (index: number) => {
        if (index < nodes.length - 1) {
            const newNodes = [...nodes];
            [newNodes[index + 1], newNodes[index]] = [newNodes[index], newNodes[index + 1]];
            setNodes(newNodes);
        }
    };

    const getNodeStyle = (type: string) => {
        switch (type) {
            case 'start':
            case 'end':
                return { borderRadius: '50px', background: 'var(--bg-panel)', border: '2px solid var(--text-main)', padding: '1rem 2rem' };
            case 'decision':
                return {
                    background: 'var(--bg-panel)',
                    border: '2px solid var(--accent-primary)',
                    padding: '1.5rem',
                    transform: 'rotate(45deg)', // Make visual diamond
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative' as const
                };
            case 'process':
            default:
                return { background: 'var(--bg-panel)', border: '2px solid var(--border-color)', padding: '1rem', borderRadius: '0.25rem', width: '200px' };
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <img src={gembaosIcon} alt="GembaOS Icon" style={{ width: '48px', height: '48px', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                            Process Mapper
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Build sequential flowcharts to standardize operating procedures.</p>
                    </div>
                </div>
            </header>

            {/* Input Form */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleAddNode} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="input-group" style={{ marginBottom: 0, flex: 2 }}>
                        <label className="input-label">Step Description</label>
                        <input
                            type="text"
                            className="input-field"
                            value={newNodeText}
                            onChange={e => setNewNodeText(e.target.value)}
                            required
                            placeholder="e.g. Inspect part for defects"
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                        <label className="input-label">Node Type</label>
                        <select className="input-field" value={newNodeType} onChange={e => setNewNodeType(e.target.value as any)}>
                            <option value="process">Standard Process (Box)</option>
                            <option value="decision">Decision Point (Diamond)</option>
                            <option value="start">Start Point (Oval)</option>
                            <option value="end">End Point (Oval)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', height: '38px', whiteSpace: 'nowrap' }}>+ Add Step</button>
                </form>
            </div>

            {/* Visual Map rendering */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', background: 'var(--bg-panel-hover)' }}>
                {nodes.length > 0 ? nodes.map((node, index) => {
                    const isDecision = node.type === 'decision';

                    return (
                        <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            {/* Down Arrow from Previous */}
                            {index > 0 && (
                                <div style={{ height: '40px', width: '2px', background: 'var(--text-main)', margin: '0.5rem 0', position: 'relative' }}>
                                    <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '10px', height: '10px', borderRight: '2px solid var(--text-main)', borderBottom: '2px solid var(--text-main)', transform: 'rotate(45deg)' }}></div>
                                </div>
                            )}

                            {/* Node Container containing visual styling and controls */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                {/* Structural visual node */}
                                <div style={{
                                    ...getNodeStyle(node.type),
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    zIndex: 2
                                }}>
                                    {/* Undo rotation for text inside diamond */}
                                    <div style={isDecision ? { transform: 'rotate(-45deg)', width: '100px', fontWeight: 'bold' } : { fontWeight: node.type !== 'process' ? 'bold' : 'normal' }}>
                                        {node.text}
                                    </div>
                                </div>

                                {/* Controls Toolbar (Hover/Side) */}
                                <div style={{ position: 'absolute', right: isDecision ? '-70px' : '-50px', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 3 }}>
                                    <button onClick={() => moveNodeUp(index)} disabled={index === 0} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '0.25rem', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                                    <button onClick={() => moveNodeDown(index)} disabled={index === nodes.length - 1} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '0.25rem', cursor: index === nodes.length - 1 ? 'not-allowed' : 'pointer', opacity: index === nodes.length - 1 ? 0.3 : 1 }}>▼</button>
                                    <button onClick={() => handleDeleteNode(node.id)} style={{ background: 'var(--accent-danger)', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', marginTop: '0.5rem' }}>×</button>
                                </div>

                                {/* Decision Branch Labels (Hardcoded for single line sequential flow visual) */}
                                {isDecision && (
                                    <>
                                        <div style={{ position: 'absolute', bottom: '-35px', left: '60%', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>Yes</div>
                                        {/* Fake side branch to show it's a decision, even though our tool is 1D sequential */}
                                        <div style={{ position: 'absolute', left: '-50px', top: '50%', width: '50px', height: '2px', background: 'var(--text-main)', zIndex: 1 }}></div>
                                        <div style={{ position: 'absolute', left: '-50px', top: 'calc(50% - 20px)', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>No</div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div style={{ color: 'var(--text-muted)' }}>Map is empty. Add a starting node.</div>
                )}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-panel)', borderLeft: '4px solid var(--text-muted)', borderRadius: '0.25rem', fontSize: '0.85rem' }}>
                This is a sequential process map builder designed for straightforward standard work procedures. Use the up and down arrows to easily reorder steps.
            </div>
        </div>
    );
}
