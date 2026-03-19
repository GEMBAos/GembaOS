
interface DataPoint {
    day: number;
    value: number;
}

interface KPITrendsProps {
    data: DataPoint[];
    target: number;
    baseline: number;
    width?: number;
    height?: number;
    yAxisLabel?: string;
}

export default function KPITrends({ data, target, baseline, width = 400, height = 200, yAxisLabel }: KPITrendsProps) {
    // Basic scaling logic
    const padding = 40;
    const contentWidth = width - padding * 2;
    const contentHeight = height - padding * 2;

    const allValues = data.map(d => d.value).concat([target, baseline]);
    const minY = Math.min(...allValues) * 0.9;
    const maxY = Math.max(...allValues) * 1.1;

    const scaleX = (x: number) => padding + ((x - 1) / (Math.max(data.length - 1, 1))) * contentWidth;
    const scaleY = (y: number) => padding + contentHeight - ((y - minY) / (maxY - minY)) * contentHeight;

    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.day)} ${scaleY(d.value)}`).join(' ');

    return (
        <svg width={width} height={height} style={{ overflow: 'visible', fontSize: '0.75rem', fill: 'var(--text-muted)' }}>
            {/* Grid Lines */}
            <line x1={padding} y1={scaleY(target)} x2={width - padding} y2={scaleY(target)} stroke="var(--accent-success)" strokeWidth="2" strokeDasharray="4" opacity={0.5} />
            <text x={padding - 35} y={scaleY(target) + 4} fill="var(--accent-success)">{target}</text>

            <line x1={padding} y1={scaleY(baseline)} x2={width - padding} y2={scaleY(baseline)} stroke="var(--accent-warning)" strokeWidth="2" strokeDasharray="4" opacity={0.5} />
            <text x={padding - 35} y={scaleY(baseline) + 4} fill="var(--accent-warning)">{baseline}</text>

            {/* Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="1" />

            {/* Data Line */}
            <path d={pathData} fill="none" stroke="var(--accent-primary)" strokeWidth="3" />

            {/* Data Points */}
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={scaleX(d.day)} cy={scaleY(d.value)} r="4" fill="var(--accent-primary)" />
                    <text x={scaleX(d.day)} y={height - padding + 15} textAnchor="middle">Day {d.day}</text>
                </g>
            ))}

            {yAxisLabel && (
                <text x="10" y="20" fill="var(--text-muted)">{yAxisLabel}</text>
            )}
        </svg>
    );
}
