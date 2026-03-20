/**
 * ARCHIVE NOTICE
 * Original Use: Used for building PC macros/automation scripts mentally.
 * Moved to: unused_modules
 */

import { useState } from 'react';

interface MacroAction {
    id: string;
    type: 'Website' | 'Hotkey' | 'AppLaunch' | 'Text';
    value: string;
    delayMs: number;
}

export default function PCMacroBuilder() {
    const [actions, setActions] = useState<MacroAction[]>([]);
    const [streamDeckExport, setStreamDeckExport] = useState<string | null>(null);

    const handleAddAction = (type: MacroAction['type']) => {
        const newAction: MacroAction = {
            id: crypto.randomUUID(),
            type,
            value: '',
            delayMs: 500
        };
        setActions([...actions, newAction]);
    };

    const handleUpdateAction = (id: string, updates: Partial<MacroAction>) => {
        setActions(actions.map(action => action.id === id ? { ...action, ...updates } : action));
    };

    const handleRemoveAction = (id: string) => {
        setActions(actions.filter(action => action.id !== id));
    };

    const generateMultiActionScript = () => {
        // Mock generation of a script/JSON layout for Stream Deck or AutoHotkey
        const scriptOutput = actions.map((a, index) => {
            return `Step ${index + 1}: [${a.type}] ${a.value} (Wait ${a.delayMs}ms)`;
        }).join('\n');

        const exportStr = `--- GEMBAOS PC MACRO STREAM DECK EXPORT ---\n\n` +
            scriptOutput +
            `\n\nEstimated Time Saved Per Execution: ${actions.length * 2} seconds.`;

        setStreamDeckExport(exportStr);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                    <span style={{ fontSize: '2rem' }}>💻</span> PC Macro Builder
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
                    Reduce digital motion waste by combining redundant PC tasks into a single-click script.
                </p>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Process Observation Sequence</h2>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" onClick={() => handleAddAction('Website')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>+ Website URL</button>
                        <button className="btn" onClick={() => handleAddAction('Hotkey')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>+ Hotkey Command</button>
                        <button className="btn" onClick={() => handleAddAction('AppLaunch')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>+ App Launch</button>
                        <button className="btn" onClick={() => handleAddAction('Text')} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>+ Paste Text</button>
                    </div>
                </div>

                {actions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
                        No actions observed yet. Start adding steps to define the digital standard work.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {actions.map((action, index) => (
                            <div key={action.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
                                <div style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{index + 1}.</div>

                                <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '120px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{action.type}</div>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder={action.type === 'Hotkey' ? 'e.g. CTRL+C' : action.type === 'AppLaunch' ? 'e.g. C:\\Program.exe' : action.type === 'Website' ? 'e.g. https://gembaos.com' : 'Text to auto-type'}
                                        style={{ flex: 1, margin: 0 }}
                                        value={action.value}
                                        onChange={(e) => handleUpdateAction(action.id, { value: e.target.value })}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delay:</span>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ width: '80px', margin: 0, padding: '0.25rem' }}
                                            value={action.delayMs}
                                            onChange={(e) => handleUpdateAction(action.id, { delayMs: Number(e.target.value) })}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ms</span>
                                    </div>
                                </div>

                                <button onClick={() => handleRemoveAction(action.id)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--accent-danger)' }}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={generateMultiActionScript}
                    disabled={actions.length === 0}
                    style={{ fontSize: '1.1rem', padding: '0.75rem 2rem', gap: '0.5rem' }}
                >
                    <span>⚡</span> Stream Deck: Generate Action Script
                </button>
            </div>

            {streamDeckExport && (
                <div className="card animate-slide-up" style={{ marginTop: '2rem', border: '1px solid var(--accent-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>✅</span> Ready for Export
                    </h3>
                    <pre style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '0.5rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                        {streamDeckExport}
                    </pre>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        *In a real production environment, this would export a <code>.streamDeckProfile</code> or run an API command to auto-load the macro to the connected hardware interface.*
                    </p>
                </div>
            )}
        </div>
    );
}
