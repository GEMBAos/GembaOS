import React from 'react';

interface GembaIconProps extends React.SVGProps<SVGSVGElement> {
    iconId: string;
    isActive?: boolean;
    size?: number | string;
}

export function GembaIcon({ iconId, isActive = false, size = 26, className = '', ...rest }: GembaIconProps) {
    const svgProps = {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: `gemba-industrial-icon ${className}`,
        ...rest
    };

    switch (iconId) {
        case 'forms':
            return (
                <svg {...svgProps}>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="m9 14 2 2 4-4" />
                </svg>
            );
        case 'motion':
            return (
                <svg {...svgProps} viewBox="0 0 24 24">
                    <path d="m12 22-7-7c-4-4-4-10.4 0-14.4s10.4-4 14.4 0 4 10.4 0 14.4z" />
                    <circle cx="12" cy="7.6" r="3" />
                </svg>
            );
        case 'time':
            return (
                <svg {...svgProps}>
                    <circle cx="12" cy="13" r="8" />
                    <path d="M12 9v4l2 2" />
                    <path d="M5 3 2 6" />
                    <path d="m22 6-3-3" />
                    <path d="M6.38 18.7 4 21" />
                    <path d="M17.64 18.67 20 21" />
                </svg>
            );
        case 'waste':
            return (
                <svg {...svgProps}>
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
            );
        case 'scan':
            return (
                <svg {...svgProps}>
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <rect width="7" height="5" x="7" y="7" rx="1" />
                    <rect width="7" height="5" x="10" y="12" rx="1" />
                </svg>
            );
        case 'improv': // Sprouting Idea
            return (
                <svg {...svgProps}>
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M12 2v1" />
                    <path d="M12 7v1" />
                    <path d="M12 12c-2.8 0-5 2.2-5 5v1h10v-1c0-2.8-2.2-5-5-5Z" />
                    <path d="M18 6l-1 1" />
                    <path d="M6 6l1 1" />
                </svg>
            );
        case 'goals':
            return (
                <svg {...svgProps}>
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="m22 2-7.5 7.5" />
                    <path d="M18 2h4v4" />
                </svg>
            );
        case 'videos':
            return (
                <svg {...svgProps}>
                    <rect width="18" height="12" x="3" y="6" rx="2" ry="2" />
                    <path d="m10 16 6-4-6-4v8Z" />
                    <path d="M15 2H9M12 2v4" />
                </svg>
            );
        case 'calcs':
            return (
                <svg {...svgProps}>
                    <rect width="16" height="20" x="4" y="2" rx="2" />
                    <line x1="8" x2="16" y1="6" y2="6" />
                    <line x1="16" x2="16.01" y1="10" y2="10" />
                    <line x1="16" x2="16.01" y1="14" y2="14" />
                    <line x1="16" x2="16.01" y1="18" y2="18" />
                    <path d="M8 10h.01" />
                    <path d="M12 10h.01" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                </svg>
            );
        case 'camera':
            return (
                <svg {...svgProps}>
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                </svg>
            );
        case 'learn': // Book
            return (
                <svg {...svgProps}>
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    <path d="M12 6h4" />
                    <path d="M12 10h4" />
                </svg>
            );
        default:
            return (
                <svg {...svgProps}>
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                </svg>
            );
    }
}
