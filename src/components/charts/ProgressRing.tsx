import { useEffect, useState } from 'react';

interface ProgressRingProps {
    radius: number;
    stroke: number;
    progress: number; // 0 to 100
    color: string;
}

export default function ProgressRing({ radius, stroke, progress, color }: ProgressRingProps) {
    const [offset, setOffset] = useState(0);
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    useEffect(() => {
        const progressOffset = circumference - (progress / 100) * circumference;
        setOffset(progressOffset);
    }, [setOffset, circumference, progress, offset]);

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            style={{ transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        >
            <circle
                stroke="var(--border-color)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fill="var(--text-main)"
                fontSize="1.5rem"
                fontWeight="bold"
                style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
            >
                {progress}%
            </text>
        </svg>
    );
}
