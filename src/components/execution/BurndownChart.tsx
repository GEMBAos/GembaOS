import type { ActionItem } from '../../types';
import { useTranslation } from 'react-i18next';

interface BurndownChartProps {
    actions: ActionItem[];
}

export default function BurndownChart({ actions }: BurndownChartProps) {
    const { t } = useTranslation();

    if (!actions || actions.length === 0) {
        return (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                {t('burndown.empty')}
            </div>
        );
    }

    // Sort actions by creation date to find the earliest point
    const sortedActions = [...actions].sort((a, b) => a.createdAt - b.createdAt);
    const earliestTime = sortedActions[0].createdAt;

    // For a realistic burndown, we'll map the next 14 days from project start
    const DAY_MS = 24 * 60 * 60 * 1000;
    const projectDurationDays = 14;
    const timeline = Array.from({ length: projectDurationDays + 1 }, (_, i) => earliestTime + (i * DAY_MS));

    // Total tasks ever created
    const totalTasks = actions.length;

    // Calculate "Ideal Tasks Remaining" (Linear burndown from total to 0 over 14 days)
    const idealData = timeline.map((_, i) => ({
        day: i,
        remaining: Math.max(0, totalTasks - (totalTasks / projectDurationDays) * i)
    }));

    // Calculate "Actual Tasks Remaining" over the timeline
    // Note: Since our MVP system doesn't rigidly track "completedAt" timestamps, 
    // we'll approximate the actual curve. If it's done *now*, it drops. 
    // Real-world, you'd store `completedAt` on the ActionItem.
    // For this visual, we'll show Current tasks remaining in the present moment.

    const remainingTasksNow = actions.filter(a => a.status !== 'Done').length;

    // Chart Dimensions
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Scaling Functions
    const xScale = (dayIndex: number) => padding + (dayIndex * (chartWidth / projectDurationDays));
    const yScale = (val: number) => height - padding - (val * (chartHeight / Math.max(1, totalTasks)));

    // Generate Path Data
    const idealPathData = idealData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.day)} ${yScale(d.remaining)}`).join(' ');

    return (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', background: 'var(--bg-dark)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--border-light)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {t('burndown.title')}
                <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>{t('burndown.tasksRemaining', { current: remainingTasksNow, total: totalTasks })}</span>
            </h4>

            <svg width="100%" height="auto" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
                {/* Background Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                    const y = height - padding - (chartHeight * ratio);
                    const val = Math.round(totalTasks * ratio);
                    return (
                        <g key={`grid-y-${ratio}`}>
                            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={padding - 10} y={y + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end">{val}</text>
                        </g>
                    );
                })}

                {/* X Axis Labels (Days) */}
                {[0, 7, 14].map(day => (
                    <text key={`x-label-${day}`} x={xScale(day)} y={height - padding + 20} fill="var(--text-muted)" fontSize="10" textAnchor="middle">{t('burndown.day')} {day}</text>
                ))}

                {/* X and Y Axes */}
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="2" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="2" />

                {/* Ideal Burndown Line (Dotted Gray) */}
                <path d={idealPathData} fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6 6" opacity="0.5" />

                {/* Actual Snapshot (Current Status Point) */}
                {/* Because we don't have historical timestamps, we visually drop from Total to Current */}
                <path
                    d={`M ${xScale(0)} ${yScale(totalTasks)} C ${xScale(3)} ${yScale(totalTasks)}, ${xScale(7)} ${yScale(remainingTasksNow)}, ${xScale(14)} ${yScale(remainingTasksNow)}`}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="3"
                />

                {/* Current Datapoint Dot */}
                <circle cx={xScale(14)} cy={yScale(remainingTasksNow)} r="6" fill="var(--accent-primary)" stroke="var(--bg-dark)" strokeWidth="2" />
                <circle cx={xScale(0)} cy={yScale(totalTasks)} r="4" fill="var(--text-muted)" />

                {/* Legend */}
                <g transform={`translate(${width - padding - 120}, ${padding - 20})`}>
                    <line x1="0" y1="0" x2="20" y2="0" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="28" y="4" fill="var(--text-muted)" fontSize="10">{t('burndown.ideal')}</text>

                    <line x1="0" y1="16" x2="20" y2="16" stroke="var(--accent-primary)" strokeWidth="2" />
                    <text x="28" y="20" fill="var(--text-muted)" fontSize="10">{t('burndown.actual')}</text>
                </g>
            </svg>
        </div>
    );
}
