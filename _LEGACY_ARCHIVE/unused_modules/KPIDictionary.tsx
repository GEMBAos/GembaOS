/**
 * ARCHIVE NOTICE
 * Original Use: Used for defining KPIs.
 * Moved to: unused_modules
 */

import { useState } from 'react';

interface Metric {
    id: string;
    acronym: string;
    name: string;
    definition: string;
    formula: string;
    trackingMethod: string;
    jfiIdeas: string[];
}

const METRICS: Metric[] = [
    {
        id: 'upm',
        acronym: 'UPH (Units Per Hour)',
        name: 'Units Per Hour',
        definition: 'A fundamental measure of operational throughput. UPH tracks the total volume of finished, high-quality units produced within a rolling 60-minute window, serving as the primary pulse of line pacing.',
        formula: 'Σ (Finished Units) / Rolling Production Hour',
        trackingMethod: 'Automated via ERP (Scanned Parts) / Manual via Hourly Pitch Board',
        jfiIdeas: [
            'Minimize operator travel time by positioning sub-assemblies adjacent to the main line.',
            'Implement Point-of-Use tooling to eliminate searching and motion waste.',
            'Deploy standardized Poka-Yoke (error-proofing) fixtures to accelerate part loading.'
        ]
    },
    {
        id: 'labor_pct',
        acronym: 'Labor %',
        name: 'Labor Percentage',
        definition: 'A critical financial ratio comparing direct labor expenditures against total revenue generated. This metric validates whether staffing levels align securely with current production output and pricing strategy.',
        formula: '(Direct Labor Costs / Total Revenue Generated) * 100',
        trackingMethod: 'Automated Dashboard Integrating Payroll API and Daily Output Log',
        jfiIdeas: [
            'Develop a cross-training matrix to ensure seamless coverage during unexpected absences.',
            'Aggressively target and eliminate rework, which inherently doubles labor costs without increasing revenue.',
            'Implement Heijunka (Level Loading) to stabilize the schedule and drastically reduce overtime spikes.'
        ]
    },
    {
        id: 'hrs_rem',
        acronym: 'EoC (End of Cycle)',
        name: 'Estimated End of Cycle',
        definition: 'A predictive operational metric utilized mid-shift to forecast whether a workstation or line will meet its daily quota based on the current trailing production run rate.',
        formula: 'Remaining Quota / Trailing Average UPH',
        trackingMethod: 'Automated via Digital Andon System / Manual Shift-Leader Estimation',
        jfiIdeas: [
            'Deploy dynamic hourly scorecards to provide the team with immediate performance feedback.',
            'Rapidly identify the active bottleneck constraint and reassign auxiliary personnel to swarm it.',
            'Institute a water-spider (Mizusumashi) material replenishment system to prevent stockouts.'
        ]
    },
    {
        id: 'jha',
        acronym: 'JHA Coverage',
        name: 'Job Hazard Analysis %',
        definition: 'The percentage of standard work procedures that have undergone a formal, documented risk assessment and mitigation review. A leading indicator of proactive safety management.',
        formula: '(Approved JHAs / Total Standard Operations) * 100',
        trackingMethod: 'EHS Compliance Software / Monthly Safety Audit',
        jfiIdeas: [
            'Allocate 15 minutes of structured Gemba time weekly to observe and document a single, specific operation.',
            'Mandate operator involvement in drafting the JHA to capture invisible, ground-level risks.',
            'Embed visual standards (photos of correct vs. incorrect PPE) directly into the operator instruction sheet.'
        ]
    },
    {
        id: 'fss',
        acronym: 'FSS',
        name: 'Facility Safety Score',
        definition: 'A holistic, mathematically weighted safety index that aggregates 5S audit compliance, Total Recordable Incident Rate (TRIR), and Near-Miss reporting volume to gauge the overall cultural strength of the facility.',
        formula: 'Weights: 30% TRIR + 40% 5S Composite + 30% Near-Miss Reporting Velocity',
        trackingMethod: 'Live EHS Dashboard / Monthly Executive Safety Review',
        jfiIdeas: [
            'Institute a "Fix What Bugs You" protocol to empower operators to immediately rectify trivial hazards.',
            'Shift organizational culture to celebrate and reward near-miss reporting rather than penalizing it.',
            'Implement aggressive 5S visual floor demarcation to clearly isolate pedestrian pathways from forklift traffic.'
        ]
    }
];

interface KPIDictionaryProps {
    onClose: () => void;
}

export default function KPIDictionary({ onClose }: KPIDictionaryProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div style={{
            maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem'
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>📊</span> KPI & Metrics Dictionary
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                        Definitions, formulas, and actionable Kaizen ideas for core operational drivers.
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={onClose}>
                    ← Back
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {METRICS.map(metric => {
                    const isExpanded = expandedId === metric.id;
                    return (
                        <div key={metric.id} className="card" style={{
                            background: 'var(--bg-panel)',
                            border: `1px solid ${isExpanded ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            transition: 'all 0.2s'
                        }}>
                            {/* Header (Click to toggle) */}
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : metric.id)}
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    background: isExpanded ? 'rgba(56, 189, 248, 0.05)' : 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>{metric.acronym}</h3>
                                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{metric.name}</span>
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    color: isExpanded ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 0.3s'
                                }}>
                                    ▼
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="animate-slide-up" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>

                                        {/* Left Column: Def & Formula */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Definition</div>
                                                <p style={{ margin: 0, lineHeight: 1.5 }}>{metric.definition}</p>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Calculation Formula</div>
                                                <div style={{
                                                    background: 'rgba(0,0,0,0.3)',
                                                    padding: '1rem',
                                                    borderRadius: '0.5rem',
                                                    fontFamily: 'monospace',
                                                    color: 'var(--accent-success)',
                                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                                }}>
                                                    {metric.formula}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Tracking Method</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
                                                    <span>⏱️</span> {metric.trackingMethod}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: JFI Ideas */}
                                        <div style={{ background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <span>🚀</span>
                                                <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#ffffff', fontWeight: 'bold' }}>JFI Ideas to Improve This</div>
                                            </div>
                                            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {metric.jfiIdeas.map((idea, idx) => (
                                                    <li key={idx} style={{ color: 'var(--text-main)', lineHeight: 1.4, fontSize: '0.95rem' }}>
                                                        {idea}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
