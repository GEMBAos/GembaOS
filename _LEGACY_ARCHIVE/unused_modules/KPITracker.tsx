/**
 * ARCHIVE NOTICE
 * Original Use: Used for KPI tracking charts.
 * Moved to: unused_modules
 */

import React, { useState, useEffect } from 'react';
import gembaosIcon from '../../assets/branding/gembaos-icon.png';
import { useTranslation } from 'react-i18next';
import type { TrackerKPI, KPIType, KPIUnit, KPIFrequency } from '../../types';

export default function KPITracker() {
    const { t } = useTranslation();
    const [kpis, setKpis] = useState<TrackerKPI[]>([]);

    // New KPI Form State
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState<KPIType>('output');
    const [newUnit, setNewUnit] = useState<KPIUnit>('eaches');
    const [newFrequency, setNewFrequency] = useState<KPIFrequency>('daily');

    // Load on mount
    useEffect(() => {
        const saved = localStorage.getItem('kaizen_kpi_tracker');
        if (saved) {
            try {
                setKpis(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load KPIs", e);
            }
        }
    }, []);

    // Save on change
    useEffect(() => {
        localStorage.setItem('kaizen_kpi_tracker', JSON.stringify(kpis));
    }, [kpis]);

    const handleAddKPI = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        const newKPI: TrackerKPI = {
            id: crypto.randomUUID(),
            name: newName,
            type: newType,
            unit: newUnit,
            frequency: newFrequency,
            dailyValues: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
            weeklyTotal: 0
        };

        setKpis([...kpis, newKPI]);
        setNewName('');
        setNewType('output');
        setNewUnit('eaches');
        setNewFrequency('daily');
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this KPI tracker?')) {
            setKpis(kpis.filter(k => k.id !== id));
        }
    };

    const updateDailyValue = (id: string, day: keyof TrackerKPI['dailyValues'], value: string) => {
        const numValue = parseFloat(value) || 0;
        setKpis(kpis.map(kpi => {
            if (kpi.id !== id) return kpi;

            const newDaily = { ...kpi.dailyValues, [day]: numValue };
            // Auto total if daily
            const newTotal = Object.values(newDaily).reduce((sum, val) => sum + val, 0);

            return {
                ...kpi,
                dailyValues: newDaily,
                weeklyTotal: newTotal
            };
        }));
    };

    const updateWeeklyValue = (id: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setKpis(kpis.map(kpi => {
            if (kpi.id !== id) return kpi;
            return { ...kpi, weeklyTotal: numValue };
        }));
    };

    const formatValue = (kpi: TrackerKPI, value: number) => {
        if (kpi.unit === 'dollars') return `$${value.toFixed(2)}`;
        if (kpi.unit === 'percentage') return `${value}%`;
        return value.toString();
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <img src={gembaosIcon} alt="GembaOS Icon" style={{ width: '48px', height: '48px', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <div>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                        KPI Data Tracker
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Log and visualize key performance indicators over time.</p>
                </div>
            </div>

            {/* Add New KPI Form */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add New KPI</h3>
                <form onSubmit={handleAddKPI} className="grid grid-cols-2" style={{ gap: '1rem', alignItems: 'end' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Metric Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={t('tools.kpi.namePlaceholder', 'e.g., Line 1 Output, Overtime Cost...')}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Metric Category</label>
                        <select className="input-field" value={newType} onChange={(e) => setNewType(e.target.value as KPIType)}>
                            <option value="output">Production Output</option>
                            <option value="labor">Labor Hours</option>
                            <option value="overtime">Overtime</option>
                            <option value="quality">Quality / Defects</option>
                            <option value="other">Other / Cost</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Unit of Measure</label>
                        <select className="input-field" value={newUnit} onChange={(e) => setNewUnit(e.target.value as KPIUnit)}>
                            <option value="eaches">Count / Eaches</option>
                            <option value="percentage">Percentage (%)</option>
                            <option value="dollars">Currency ($)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                            <label className="input-label">Tracking Frequency</label>
                            <select className="input-field" value={newFrequency} onChange={(e) => setNewFrequency(e.target.value as KPIFrequency)}>
                                <option value="daily">Daily (Mon-Sun inputs)</option>
                                <option value="weekly">Weekly (Single Total)</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 1.5rem' }}>
                            + Add KPI
                        </button>
                    </div>
                </form>
            </div>

            {/* Active KPI Trackers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {kpis.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>
                        No KPIs configured yet. Add one above to start tracking data.
                    </div>
                ) : (
                    kpis.map(kpi => (
                        <div key={kpi.id} className="card" style={{ position: 'relative' }}>
                            <button
                                onClick={() => handleDelete(kpi.id)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.6 }}
                                title="Delete KPI"
                            >
                                ✕
                            </button>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0 }}>{kpi.name}</h3>
                                    <span className="pill" style={{ background: 'var(--border-light)', color: 'var(--text-main)', border: 'none' }}>
                                        {kpi.type.charAt(0).toUpperCase() + kpi.type.slice(1)}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Format: {kpi.unit} | Entry: {kpi.frequency}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {kpi.frequency === 'daily' && (
                                    <>
                                        {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map(day => (
                                            <div key={day} style={{ flex: 1, minWidth: '70px' }}>
                                                <label className="input-label" style={{ textAlign: 'center', textTransform: 'capitalize' }}>{day}</label>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    style={{ textAlign: 'center' }}
                                                    value={kpi.dailyValues[day]}
                                                    onChange={(e) => updateDailyValue(kpi.id, day, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}

                                <div style={{ flex: kpi.frequency === 'daily' ? '0 0 120px' : '1', borderLeft: kpi.frequency === 'daily' ? '1px solid var(--border-color)' : 'none', paddingLeft: kpi.frequency === 'daily' ? '1rem' : '0' }}>
                                    <label className="input-label" style={{ textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Weekly Total</label>
                                    {kpi.frequency === 'daily' ? (
                                        <div style={{ padding: '0.5rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                                            {formatValue(kpi, kpi.weeklyTotal)}
                                        </div>
                                    ) : (
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                                            value={kpi.weeklyTotal}
                                            onChange={(e) => updateWeeklyValue(kpi.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
