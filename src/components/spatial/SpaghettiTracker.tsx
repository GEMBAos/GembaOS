import { useState, useRef } from 'react';
import type { MouseEvent, TouchEvent } from 'react';

// Euclidean distance
function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

interface Point {
    x: number;
    y: number;
}

export default function SpaghettiTracker() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [totalPixelDistance, setTotalPixelDistance] = useState(0);
    const svgRef = useRef<SVGSVGElement>(null);

    // Assuming 1 inch = 1 pixel for basic scale approximation on a default 1000x1000 view
    const scaleToFeet = 1 / 12;

    const startDrawing = (e: MouseEvent<SVGSVGElement> | TouchEvent<SVGSVGElement>) => {
        setIsDrawing(true);
        addPoint(e);
    };

    const draw = (e: MouseEvent<SVGSVGElement> | TouchEvent<SVGSVGElement>) => {
        if (!isDrawing) return;
        addPoint(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const addPoint = (e: MouseEvent<SVGSVGElement> | TouchEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;

        const svgBounds = svgRef.current.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

        // Convert DOM coordinates to SVG viewBox coordinates (assuming 1000x1000 mapped to container bounds)
        const scaleX = 1000 / svgBounds.width;
        const scaleY = 1000 / svgBounds.height;

        const pt = {
            x: (clientX - svgBounds.left) * scaleX,
            y: (clientY - svgBounds.top) * scaleY
        };

        setPoints((prev) => {
            if (prev.length > 0) {
                const last = prev[prev.length - 1];
                const dist = calculateDistance(last.x, last.y, pt.x, pt.y);
                // Only add point if moved enough to avoid event spam
                if (dist > 5) {
                    setTotalPixelDistance(d => d + dist);
                    return [...prev, pt];
                }
                return prev;
            }
            return [pt];
        });
    };

    const resetTracker = () => {
        setPoints([]);
        setTotalPixelDistance(0);
    };

    const dString = points.length > 0
        ? `M ${points[0].x},${points[0].y} ` + points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')
        : '';

    // Calculate metrics based on standard scale
    const distanceFeet = (totalPixelDistance * scaleToFeet).toFixed(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header controls */}
            <div style={{ padding: '1rem', background: 'var(--bg-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Spaghetti Tracker (2D)</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Draw motion paths over the layout</p>
                </div>
                <div>
                    {points.length > 0 && (
                        <button className="btn" style={{ background: 'var(--bg-panel)', color: 'var(--accent-danger)', border: '1px solid var(--border-color)' }} onClick={resetTracker}>Clear Path</button>
                    )}
                </div>
            </div>

            {/* Metrics */}
            <div style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-panel)', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{distanceFeet}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Total Feet</div>
                </div>
            </div>

            {/* Interactive Drawing Canvas */}
            <div
                style={{
                    flex: 1,
                    position: 'relative',
                    background: '#e5e7eb', // Future: Overlay this on the Floor Plan Builder image/state
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none' // Prevent scrolling while drawing on mobile
                }}
            >
                <svg
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid meet"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ cursor: 'crosshair', background: 'white' }}
                >
                    {/* Grid Pattern Background */}
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="none" />
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {points.length > 1 && (
                        <path d={dString} fill="none" stroke="var(--accent-primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    )}

                    {/* Start point */}
                    {points.length > 0 && (
                        <circle cx={points[0].x} cy={points[0].y} r="12" fill="var(--accent-success)" />
                    )}

                    {/* End point */}
                    {points.length > 1 && (
                        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="12" fill="var(--accent-danger)" />
                    )}
                </svg>

                {points.length === 0 && (
                    <div style={{ position: 'absolute', pointerEvents: 'none', color: '#9ca3af', padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.8)', borderRadius: '0.5rem' }}>
                        <div>Touch and drag to draw a Spaghetti Diagram.</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Approximated at 1 pixel = 1 inch</div>
                    </div>
                )}
            </div>
        </div>
    );
}
