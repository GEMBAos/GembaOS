/**
 * ARCHIVE NOTICE
 * Original Use: Used for Gantt schedule tracking.
 * Moved to: unused_modules
 */

import { useMemo } from 'react';
import gembaosIcon from '../../assets/branding/gembaos-icon.png';
import type { KaizenProject } from '../../types';

interface GanttChartProps {
    project: KaizenProject;
}

export default function GanttChart({ project }: GanttChartProps) {
    // Generate dates based on the project creation date and phases
    const scheduleItems = useMemo(() => {
        if (!project || project.phases.length === 0) return [];

        const startDate = new Date(project.createdAt);

        // Find the maximum day to determine total span
        const maxDay = Math.max(...project.phases.map(p => p.day));

        return project.phases.map(phase => {
            const phaseStart = new Date(startDate);
            phaseStart.setDate(startDate.getDate() + (phase.day - 1));

            const progress = phase.status === 'completed' ? 100
                : phase.status === 'in-progress' ? 50
                    : 0;

            return {
                ...phase,
                startDate: phaseStart,
                durationDays: 1, // Currently fixed at 1 day per phase in our model
                progress,
                offsetPercent: ((phase.day - 1) / Math.max(1, maxDay)) * 100,
                widthPercent: (1 / Math.max(1, maxDay)) * 100
            };
        });
    }, [project]);

    if (!project) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No active project to display schedule for.
            </div>
        );
    }

    const totalDays = Math.max(...project.phases.map(p => p.day), 5); // Minimum 5 days display
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
        <div className="card" style={{ overflowX: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={gembaosIcon} alt="GembaOS Icon" style={{ width: '32px', height: '32px', borderRadius: '0.25rem' }} />
                <h3 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    High-Level Project Schedule
                </h3>
                </div>
                <span className="pill" style={{ marginLeft: 'auto' }}>{project.duration}</span>
            </div>

            <div style={{ minWidth: '800px' }}>
                {/* Header Row (Days) */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: '250px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Project Phase</div>
                    <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                        {daysArray.map(day => (
                            <div key={day} style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', borderLeft: '1px dashed var(--border-light)' }}>
                                Day {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gantt Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {scheduleItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                            {/* Task Name Column */}
                            <div style={{ width: '250px', paddingRight: '1rem' }}>
                                <div style={{ fontWeight: '500', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.title}>
                                    {item.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {item.status.replace('-', ' ')}
                                </div>
                            </div>

                            {/* Timeline Column */}
                            <div style={{ flex: 1, position: 'relative', height: '40px', background: 'var(--bg-dark)', borderRadius: '0.25rem', display: 'flex' }}>
                                {/* Grid lines background */}
                                {daysArray.map(day => (
                                    <div key={day} style={{ flex: 1, borderLeft: '1px dashed var(--border-light)' }} />
                                ))}

                                {/* Actual Bar */}
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    bottom: '8px',
                                    left: `${item.offsetPercent}%`,
                                    width: `${item.widthPercent}%`,
                                    background: 'var(--bg-panel)',
                                    border: `1px solid ${item.status === 'completed' ? 'var(--accent-success)' : item.status === 'in-progress' ? 'var(--accent-warning)' : 'var(--border-color)'}`,
                                    borderRadius: '0.25rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {/* Progress Fill */}
                                    <div style={{
                                        height: '100%',
                                        width: `${item.progress}%`,
                                        background: item.status === 'completed' ? 'var(--accent-success)' : 'var(--accent-warning)',
                                        opacity: 0.2
                                    }} />

                                    {/* Label inside bar */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                        {item.progress}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
