/**
 * ARCHIVE NOTICE
 * Original Use: Currently holding for VSM piece adaptation.
 * Moved to: hold_for_adaptation
 */

import React, { useState, useEffect } from 'react';
import gembaosIcon from '../../assets/branding/gembaos-icon.png';
import { useTranslation } from 'react-i18next';
import type { KaizenProject, VSMStep } from '../../types';

interface ValueStreamMapProps {
    project?: KaizenProject;
    onUpdateProject?: (p: KaizenProject) => void;
}

export default function ValueStreamMap({ project, onUpdateProject }: ValueStreamMapProps) {
    const { t } = useTranslation();
    const [steps, setSteps] = useState<VSMStep[]>([]);

    // Form state
    const [newName, setNewName] = useState('');
    const [newCT, setNewCT] = useState<number | ''>('');
    const [newVAT, setNewVAT] = useState<number | ''>('');
    const [newCO, setNewCO] = useState<number | ''>('');
    const [newUptime, setNewUptime] = useState<number | ''>(100);
    const [newDefect, setNewDefect] = useState<number | ''>(0);
    const [newWip, setNewWip] = useState<number | ''>('');

    useEffect(() => {
        if (project) {
            if (project.vsmData) {
                setSteps(project.vsmData);
            }
        } else {
            const saved = localStorage.getItem('kaizen_vsm_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.steps) {
                        const loaded = parsed.steps.map((s: any) => ({
                            ...s,
                            changeoverTime: s.changeoverTime || 0,
                            uptime: s.uptime ?? 100,
                            defectRate: s.defectRate || 0,
                            wip: s.wip || 0
                        }));
                        setSteps(loaded);
                    }
                } catch (e) {
                    console.error("Failed to load VSM data", e);
                }
            }
        }
    }, [project?.id]);

    const saveSteps = (newSteps: VSMStep[]) => {
        setSteps(newSteps);
        if (project && onUpdateProject) {
            onUpdateProject({ ...project, vsmData: newSteps });
        } else if (!project) {
            localStorage.setItem('kaizen_vsm_data', JSON.stringify({ steps: newSteps }));
        }
    };

    const handleAddStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || newCT === '' || newVAT === '' || newWip === '' || newCO === '' || newUptime === '' || newDefect === '') return;

        const newStep: VSMStep = {
            id: crypto.randomUUID(),
            name: newName.trim(),
            cycleTime: Number(newCT),
            valueAddTime: Number(newVAT),
            changeoverTime: Number(newCO),
            uptime: Number(newUptime),
            defectRate: Number(newDefect),
            wip: Number(newWip)
        };

        const newSteps = [...steps, newStep];
        saveSteps(newSteps);
        setNewName(''); setNewCT(''); setNewVAT(''); setNewWip(''); setNewCO(''); setNewUptime(100); setNewDefect(0);
    };

    const handleDelete = (id: string) => {
        const newSteps = steps.filter(s => s.id !== id);
        saveSteps(newSteps);
    };

    // Calculations
    const totalVAT = steps.reduce((sum, step) => sum + step.valueAddTime, 0);

    // Lead time approximation: WIP * Cycle Time
    // A traditional VSM divides WIP by Daily Demand, but this gives a relative approximation of time tied up in inventory based on the operation speed.
    const totalPLT = steps.reduce((sum, step) => sum + (step.wip * step.cycleTime), 0);

    // Overall Lead Time = total Process Time (Queue Time) + total Value Add Time
    const overallLeadTime = totalPLT + totalVAT;

    const bottleneck = steps.length > 0 ? steps.reduce((prev, current) => (prev.cycleTime > current.cycleTime) ? prev : current) : null;

    // Formatting helpers
    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${Number(seconds).toFixed(1)}s`;
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    const formatLongTimeDays = (seconds: number) => {
        // Assume an 8 hour working day = 28800 seconds
        const workingDaySecs = 28800;
        if (seconds < workingDaySecs) {
            if (seconds < 3600) return formatTime(seconds);
            return `${(seconds / 3600).toFixed(1)} hrs`;
        }
        const days = (seconds / workingDaySecs).toFixed(1);
        return `${days} Days`;
    };

    const handleExportCSV = () => {
        if (steps.length === 0) return;

        const headers = ['Process Name', 'Cycle Time (s)', 'Value Add Time (s)', 'Changeover Time (min)', 'Uptime (%)', 'Defect Rate (%)', 'WIP After'];
        const rows = steps.map(step => [
            `"${step.name.replace(/"/g, '""')}"`,
            step.cycleTime,
            step.valueAddTime,
            step.changeoverTime,
            step.uptime,
            step.defectRate,
            step.wip
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Value_Stream_Map_Data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <img src={gembaosIcon} alt="GembaOS Icon" style={{ width: '48px', height: '48px', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                            Value Stream Mapping (VSM)
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Map complete process flows, track WIP between operations, and build your Castle Wall.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'var(--bg-panel)', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Value Add</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>{formatTime(totalVAT)}</div>
                    </div>
                    <div style={{ background: 'var(--bg-panel)', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Overall Lead Time</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>{formatLongTimeDays(overallLeadTime)}</div>
                    </div>
                    <div style={{ background: 'var(--bg-panel)', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Process Eff. Ratio</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                            {overallLeadTime > 0 ? ((totalVAT / overallLeadTime) * 100).toFixed(1) : '0.0'}%
                        </div>
                    </div>
                    {steps.length > 0 && (
                        <button
                            onClick={handleExportCSV}
                            style={{
                                background: 'none',
                                border: '1px solid var(--border-color)',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                height: 'fit-content',
                                alignSelf: 'center'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>📥</span> Export CSV
                        </button>
                    )}
                </div>
            </header>

            {/* Input Form */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleAddStep} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="input-group" style={{ marginBottom: 0, flex: '2 1 200px' }}>
                        <label className="input-label">Process Name *</label>
                        <input type="text" className="input-field" value={newName} onChange={e => setNewName(e.target.value)} required placeholder={t('tools.vsm.namePlaceholder', 'e.g. Stamping')} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                        <label className="input-label" title="Time taken to complete one unit">C/T (sec) *</label>
                        <input type="number" step="0.1" className="input-field" value={newCT} onChange={e => setNewCT(e.target.value ? Number(e.target.value) : '')} required min="0" />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                        <label className="input-label" title="Time spent actually transforming the product">V/A (sec) *</label>
                        <input type="number" step="0.1" className="input-field" value={newVAT} onChange={e => setNewVAT(e.target.value ? Number(e.target.value) : '')} required min="0" />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                        <label className="input-label" title="Changeover Time">C/O (min) *</label>
                        <input type="number" step="0.1" className="input-field" value={newCO} onChange={e => setNewCO(e.target.value ? Number(e.target.value) : '')} required min="0" />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                        <label className="input-label" title="Percentage Uptime">Uptime (%) *</label>
                        <input type="number" step="0.1" className="input-field" value={newUptime} onChange={e => setNewUptime(e.target.value ? Number(e.target.value) : '')} required min="0" max="100" />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                        <label className="input-label" title="Defect Rate Percentage">Defect (%) *</label>
                        <input type="number" step="0.1" className="input-field" value={newDefect} onChange={e => setNewDefect(e.target.value ? Number(e.target.value) : '')} required min="0" max="100" />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0, flex: '1 1 100px' }}>
                        <label className="input-label" title="Work in process inventory AFTER this step">WIP After *</label>
                        <input type="number" className="input-field" value={newWip} onChange={e => setNewWip(e.target.value ? Number(e.target.value) : '')} required min="0" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', height: '38px', whiteSpace: 'nowrap' }}>+ Add Process</button>
                </form>
            </div>

            {/* VSM Visualization */}
            {steps.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem', overflowX: 'auto', paddingBottom: '3rem', paddingTop: '2rem' }}>

                    {/* Row 1: Process Boxes and WIP */}
                    <div style={{ display: 'flex', minWidth: 'max-content', alignItems: 'flex-start', paddingLeft: '1rem', paddingRight: '1rem' }}>
                        {steps.map((step) => {
                            const isBottleneck = bottleneck?.id === step.id;

                            return (
                                <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>

                                    {/* Process Data Box */}
                                    <div style={{
                                        width: '220px',
                                        border: `2px solid ${isBottleneck ? 'var(--accent-danger)' : 'var(--text-main)'}`,
                                        background: isBottleneck ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-panel)',
                                        position: 'relative'
                                    }}>
                                        {/* Header */}
                                        <div style={{
                                            background: isBottleneck ? 'var(--accent-danger)' : 'var(--text-main)',
                                            color: isBottleneck ? 'var(--text-main)' : 'var(--bg-dark)',
                                            padding: '0.5rem',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            borderBottom: '2px solid var(--text-main)'
                                        }}>
                                            {step.name}
                                            {isBottleneck && <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bottleneck</div>}
                                        </div>

                                        {/* Metrics Grid */}
                                        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>C/T:</span>
                                                <span style={{ fontWeight: '500' }}>{formatTime(step.cycleTime)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>V/A:</span>
                                                <span style={{ fontWeight: '500' }}>{formatTime(step.valueAddTime)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>C/O:</span>
                                                <span style={{ fontWeight: '500' }}>{step.changeoverTime} min</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Uptime:</span>
                                                <span style={{ fontWeight: '500' }}>{step.uptime}%</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>Defect:</span>
                                                <span style={{ fontWeight: '500' }}>{step.defectRate}%</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(step.id)}
                                            style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--bg-panel)', border: '2px solid var(--text-main)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* WIP Inventory & Flow Arrow (between steps and at the end) */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '150px', position: 'relative' }}>
                                        {/* Push Arrow */}
                                        <div style={{ position: 'absolute', top: '50%', width: '100%', height: '2px', background: 'var(--text-muted)', zIndex: 0 }}></div>
                                        <div style={{ position: 'absolute', top: 'calc(50% - 7px)', right: '10px', transform: 'rotate(45deg)', width: '14px', height: '14px', borderTop: '2px solid var(--text-muted)', borderRight: '2px solid var(--text-muted)', zIndex: 0 }}></div>

                                        {/* Inventory Triangle */}
                                        {step.wip > 0 && (
                                            <div style={{ position: 'relative', zIndex: 1, paddingBottom: '1rem' }}>
                                                <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                                        <polygon points="50,10 10,90 90,90" fill="var(--bg-panel)" stroke="var(--text-main)" strokeWidth="4" />
                                                    </svg>
                                                    <span style={{ position: 'relative', top: '10px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                                        {step.wip}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {step.wip === 0 && (
                                            <div style={{ height: '50px', paddingBottom: '1rem' }}></div> // Spacer to keep alignment
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {/* Row 2: Castle Wall Timeline */}
                    <div style={{ display: 'flex', minWidth: 'max-content', marginTop: '20px', paddingLeft: '1rem', paddingRight: '1rem' }}>
                        {steps.map((step, index) => {
                            const pltForStep = step.wip * step.cycleTime;

                            return (
                                <div key={`wall-${step.id}`} style={{ display: 'flex' }}>

                                    {/* Low Block for Process (Value Add Time) */}
                                    <div style={{
                                        width: '220px', // Matches process box width
                                        height: '40px',
                                        borderBottom: '3px solid var(--text-main)',
                                        borderRight: '3px solid var(--text-main)',
                                        borderLeft: index === 0 ? '3px solid var(--text-main)' : 'none',
                                        position: 'relative',
                                        marginTop: '40px' // Shift down to create the low block
                                    }}>
                                        <div style={{ position: 'absolute', bottom: '-28px', width: '100%', textAlign: 'center', color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            {formatTime(step.valueAddTime)}
                                        </div>
                                    </div>

                                    {/* High Block for WIP (Lead Time) */}
                                    <div style={{
                                        width: '150px', // Matches WIP spacing width
                                        height: '40px',
                                        borderTop: '3px solid var(--text-main)',
                                        borderRight: '3px solid var(--text-main)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ position: 'absolute', top: '-28px', width: '100%', textAlign: 'center', color: 'var(--accent-danger)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            {formatLongTimeDays(pltForStep)}
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </div>
            )}

            {steps.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'var(--bg-panel)', borderRadius: '0.5rem', border: '1px dashed var(--border-color)' }}>
                    <h3 style={{ marginTop: 0 }}>No Value Stream Data</h3>
                    <p>Enter your process steps, times, and WIP above to generate the VSM and Castle Wall.</p>
                </div>
            )}
        </div>
    );
}
