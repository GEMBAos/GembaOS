import { useState, useRef, useEffect } from 'react';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2 } from '../../../types/motion_v2';

interface Props {
    sessionId: string;
    onComplete: () => void;
}

export default function MotionCalibration({ sessionId, onComplete }: Props) {
    const session = ImprovementEngine.getItem<MotionSessionV2>(sessionId);
    const [p1, setP1] = useState<{x: number, y: number} | null>(null);
    const [p2, setP2] = useState<{x: number, y: number} | null>(null);
    const [distanceInput, setDistanceInput] = useState('');
    const [unit, setUnit] = useState<'meter'|'foot'>('foot');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // If no layout image, skip calibration
    useEffect(() => {
        if (session && !session.layoutImageUrl) {
            onComplete();
        }
    }, [session, onComplete]);

    if (!session || !session.layoutImageUrl) return null;

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        
        // Store percentage-based coordinates to handle responsive resizing
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (!p1) {
            setP1({ x, y });
        } else if (!p2) {
            setP2({ x, y });
        } else {
            // Reset and start over
            setP1({ x, y });
            setP2(null);
        }
    };

    const handleSave = () => {
        if (!p1 || !p2 || !imgRef.current) return;
        const dist = parseFloat(distanceInput);
        if (isNaN(dist) || dist <= 0) return;

        // Calculate Pixel Distance on the current rendered image
        const rect = imgRef.current.getBoundingClientRect();
        const px1 = (p1.x / 100) * rect.width;
        const py1 = (p1.y / 100) * rect.height;
        const px2 = (p2.x / 100) * rect.width;
        const py2 = (p2.y / 100) * rect.height;

        const pxDistance = Math.sqrt(Math.pow(px2 - px1, 2) + Math.pow(py2 - py1, 2));

        // Pixels per unit
        const scale = pxDistance / dist;

        ImprovementEngine.updateItem<MotionSessionV2>(sessionId, {
            calibrationScale: scale,
            calibrationUnit: unit
        });

        onComplete();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--accent-primary)' }}>Scale Calibration</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Click two points on the layout below to define a known distance. This ensures accurate spaghetti tracking metrics.
                </p>
            </div>

            <div 
                ref={containerRef}
                style={{ 
                    flex: 1, 
                    position: 'relative', 
                    background: '#000', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <img 
                    ref={imgRef}
                    src={session.layoutImageUrl} 
                    alt="Layout" 
                    onClick={handleImageClick}
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        cursor: 'crosshair'
                    }} 
                />

                {/* Draw markers */}
                {p1 && (
                    <div style={{
                        position: 'absolute',
                        left: `${p1.x}%`,
                        top: `${p1.y}%`,
                        width: '12px', height: '12px',
                        background: 'var(--accent-success)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid white',
                        pointerEvents: 'none'
                    }} />
                )}
                {p2 && (
                    <div style={{
                        position: 'absolute',
                        left: `${p2.x}%`,
                        top: `${p2.y}%`,
                        width: '12px', height: '12px',
                        background: 'var(--accent-danger)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid white',
                        pointerEvents: 'none'
                    }} />
                )}

                {/* Draw Line */}
                {p1 && p2 && imgRef.current && (
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <line 
                            x1={`${p1.x}%`} y1={`${p1.y}%`} 
                            x2={`${p2.x}%`} y2={`${p2.y}%`} 
                            stroke="rgba(255,255,255,0.8)" 
                            strokeWidth="2" 
                            strokeDasharray="4 4"
                        />
                    </svg>
                )}
            </div>

            {p1 && p2 && (
                <div className="card" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label className="input-label">Distance</label>
                        <input 
                            type="number" 
                            className="input-field" 
                            value={distanceInput} 
                            onChange={e => setDistanceInput(e.target.value)} 
                            placeholder="e.g. 10" 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="input-label">Unit</label>
                        <select className="input-field" value={unit} onChange={e => setUnit(e.target.value as any)}>
                            <option value="foot">Feet</option>
                            <option value="meter">Meters</option>
                        </select>
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSave}
                        disabled={!distanceInput || parseFloat(distanceInput) <= 0}
                    >
                        Save Scale
                    </button>
                    <button className="btn" onClick={() => { setP1(null); setP2(null); }}>Reset</button>
                </div>
            )}
        </div>
    );
}
