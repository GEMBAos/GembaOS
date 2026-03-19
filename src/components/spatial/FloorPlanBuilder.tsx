import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';

interface Item {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    label: string;
    rotation?: number;
    isOperator?: boolean;
}

interface DrawnLine {
    points: number[];
    color: string;
}

// Lean Color Palette
const COLORS = {
    RAW: '#3b82f6',      // Blue
    STATION: '#06b6d4',  // Cyan
    AISLE: '#ef4444',    // Red
    EMPTY: '#ffffff',    // White
    WIP: '#111827',      // Black
    FINISHED: '#10b981', // Green
    QUALITY: '#f97316'   // Orange
};

export default function FloorPlanBuilder() {
    const [items, setItems] = useState<Item[]>([]);
    const [lines, setLines] = useState<DrawnLine[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mode, setMode] = useState<'move' | 'draw'>('move');
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const isDrawingRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 1 pixel = 1 inch
    const GRID_SIZE = 12; // Draw visible grid lines every 12 inches (1 ft)

    useEffect(() => {
        const resize = () => {
            if (containerRef.current) {
                setStageSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
        if (mode !== 'move') return;
        const id = e.target.id();
        setSelectedId(id);
        const itemArray = items.slice();
        const item = itemArray.find(i => i.id === id);
        if (item) {
            const index = itemArray.indexOf(item);
            itemArray.splice(index, 1);
            itemArray.push(item);
            setItems(itemArray);
        }
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
        if (mode !== 'move') return;
        const id = e.target.id();

        // Basic snap to grid (snap to nearest inch/pixel, maybe nearest 6 inches for better alignment)
        const snap = 6;
        const snappedX = Math.round(e.target.x() / snap) * snap;
        const snappedY = Math.round(e.target.y() / snap) * snap;

        setItems(
            items.map(item => {
                return item.id === id
                    ? { ...item, x: snappedX, y: snappedY }
                    : item;
            })
        );
        e.target.position({ x: snappedX, y: snappedY }); // Force snap visually immediately
    };

    const addItem = (type: string, width: number, height: number, fill: string, label: string, isOperator = false) => {
        const newItem: Item = {
            id: `item-${Date.now()}`,
            type,
            x: 50 + Math.random() * 50,
            y: 50 + Math.random() * 50,
            width,
            height,
            fill,
            label,
            rotation: 0,
            isOperator
        };
        setItems([...items, newItem]);
        setSelectedId(newItem.id);
        setMode('move');
    };

    const handleStageMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (mode === 'draw') {
            isDrawingRef.current = true;
            const pos = e.target.getStage()?.getPointerPosition();
            if (pos) {
                setLines([...lines, { points: [pos.x, pos.y], color: COLORS.AISLE }]);
            }
        } else {
            // Deselect
            if (e.target === e.target.getStage()) {
                setSelectedId(null);
            }
        }
    };

    const handleStageMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (mode === 'draw' && isDrawingRef.current) {
            const stage = e.target.getStage();
            const point = stage?.getPointerPosition();
            if (!point) return;

            const lastLine = lines[lines.length - 1];
            // Straight line snapping logic for architectural drawing
            const startX = lastLine.points[0];
            const startY = lastLine.points[1];

            // Snap to perfectly horizontal or vertical if close
            const dx = point.x - startX;
            const dy = point.y - startY;

            if (Math.abs(dx) > Math.abs(dy) * 2) {
                // Mostly horizontal
                point.y = startY;
            } else if (Math.abs(dy) > Math.abs(dx) * 2) {
                // Mostly vertical
                point.x = startX;
            }

            lastLine.points = [startX, startY, point.x, point.y];

            setLines(lines.slice(0, lines.length - 1).concat([lastLine]));
        }
    };

    const handleStageMouseUp = () => {
        if (mode === 'draw') {
            isDrawingRef.current = false;
        }
    };

    const handleDeleteSelected = () => {
        if (selectedId) {
            setItems(items.filter(i => i.id !== selectedId));
            setSelectedId(null);
        }
    };

    const rotateSelected = () => {
        if (selectedId) {
            setItems(items.map(i => i.id === selectedId ? { ...i, rotation: (i.rotation || 0) + 90 } : i));
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>

            {/* Top Toolbar */}
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginRight: '0.5rem', color: 'var(--text-muted)' }}>TOOLS:</span>

                <button
                    className="btn"
                    onClick={() => setMode(mode === 'move' ? 'draw' : 'move')}
                    style={{ background: mode === 'draw' ? 'var(--accent-primary)' : 'var(--bg-panel)', color: mode === 'draw' ? 'white' : 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                >
                    {mode === 'move' ? '🖐 Interact Mode' : '✏️ Draw Aisles (Red)'}
                </button>

                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="btn" onClick={() => addItem('station', 96, 48, COLORS.STATION, 'Workstation')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderLeft: `4px solid ${COLORS.STATION}` }}>
                        4x8 Station
                    </button>
                    <button className="btn" onClick={() => addItem('skid', 48, 48, COLORS.WIP, 'WIP Skid')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderLeft: `4px solid ${COLORS.WIP}`, color: 'white', background: '#374151' }}>
                        WIP (48x48)
                    </button>
                    <button className="btn" onClick={() => addItem('skid', 48, 40, COLORS.RAW, 'Raw Mats')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderLeft: `4px solid ${COLORS.RAW}` }}>
                        Raw (40x48)
                    </button>
                    <button className="btn" onClick={() => addItem('skid', 48, 48, COLORS.FINISHED, 'Finished')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderLeft: `4px solid ${COLORS.FINISHED}` }}>
                        FG (48x48)
                    </button>
                    <button className="btn" onClick={() => addItem('cart', 36, 24, COLORS.EMPTY, 'Cart')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderLeft: `4px solid #d1d5db` }}>
                        Cart/Trash
                    </button>
                    <button className="btn" onClick={() => addItem('quality', 48, 48, COLORS.QUALITY, 'Hold')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderLeft: `4px solid ${COLORS.QUALITY}` }}>
                        Hold Area
                    </button>
                    <button className="btn" onClick={() => addItem('operator', 18, 18, 'transparent', 'Op', true)} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid var(--border-color)' }}>
                        👤 Operator
                    </button>
                </div>
            </div>

            {/* Sub Toolbar for actions */}
            <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center', height: '40px' }}>
                {selectedId ? (
                    <>
                        <button onClick={rotateSelected} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ↻ Rotate 90°
                        </button>
                        <button onClick={handleDeleteSelected} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ✕ Delete
                        </button>
                    </>
                ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select an item to edit, or use two fingers to pan/zoom (coming soon).</span>
                )}

                <button onClick={() => { setItems([]); setLines([]); setSelectedId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    Clear All
                </button>
            </div>

            {/* Canvas Area */}
            <div ref={containerRef} style={{ flex: 1, position: 'relative', background: '#f9fafb', overflow: 'hidden', touchAction: 'none' }}>
                <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                    onMouseDown={handleStageMouseDown}
                    onMouseMove={handleStageMouseMove}
                    onMouseUp={handleStageMouseUp}
                    onTouchStart={handleStageMouseDown}
                    onTouchMove={handleStageMouseMove}
                    onTouchEnd={handleStageMouseUp}
                    style={{ position: 'absolute', top: 0, left: 0, cursor: mode === 'draw' ? 'crosshair' : 'default' }}
                >
                    <Layer>
                        {/* 1ft (12px) Background Grid */}
                        {[...Array(Math.ceil(stageSize.width / GRID_SIZE))].map((_, i) => (
                            <Line key={`grid-v-${i}`} points={[i * GRID_SIZE, 0, i * GRID_SIZE, stageSize.height]} stroke="rgba(0,0,0,0.03)" strokeWidth={1} />
                        ))}
                        {[...Array(Math.ceil(stageSize.height / GRID_SIZE))].map((_, i) => (
                            <Line key={`grid-h-${i}`} points={[0, i * GRID_SIZE, stageSize.width, i * GRID_SIZE]} stroke="rgba(0,0,0,0.03)" strokeWidth={1} />
                        ))}

                        {/* 5ft (60px) Major Grid Lines */}
                        {[...Array(Math.ceil(stageSize.width / (GRID_SIZE * 5)))].map((_, i) => (
                            <Line key={`grid-major-v-${i}`} points={[i * GRID_SIZE * 5, 0, i * GRID_SIZE * 5, stageSize.height]} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
                        ))}
                        {[...Array(Math.ceil(stageSize.height / (GRID_SIZE * 5)))].map((_, i) => (
                            <Line key={`grid-major-h-${i}`} points={[0, i * GRID_SIZE * 5, stageSize.width, i * GRID_SIZE * 5]} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
                        ))}

                        {/* Drawn Lines */}
                        {lines.map((line, i) => (
                            <Line
                                key={`line-${i}`}
                                points={line.points}
                                stroke={line.color}
                                strokeWidth={4}
                                lineCap="round"
                                lineJoin="round"
                            />
                        ))}

                        {/* Items */}
                        {items.map(item => (
                            <Group
                                key={item.id}
                                id={item.id}
                                x={item.x}
                                y={item.y}
                                width={item.width}
                                height={item.height}
                                rotation={item.rotation || 0}
                                offsetX={item.width / 2} // Rotate from center
                                offsetY={item.height / 2}
                                draggable={mode === 'move'}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onClick={() => setSelectedId(item.id)}
                                onTap={() => setSelectedId(item.id)}
                            >
                                {item.isOperator ? (
                                    <>
                                        <Circle radius={18} fill="#fbbf24" stroke={selectedId === item.id ? '#3b82f6' : '#d97706'} strokeWidth={selectedId === item.id ? 3 : 2} shadowColor="black" shadowBlur={4} shadowOpacity={0.2} shadowOffset={{ x: 1, y: 1 }} x={item.width / 2} y={item.height / 2} />
                                        <Text text="Op" x={item.width / 2 - 7} y={item.height / 2 - 5} fontSize={10} fill="#78350f" fontStyle="bold" />
                                    </>
                                ) : (
                                    <>
                                        <Rect
                                            width={item.width}
                                            height={item.height}
                                            fill={item.fill}
                                            shadowColor="black"
                                            shadowBlur={selectedId === item.id ? 8 : 2}
                                            shadowOpacity={selectedId === item.id ? 0.4 : 0.2}
                                            shadowOffset={{ x: 2, y: 2 }}
                                            cornerRadius={2}
                                            stroke={selectedId === item.id ? '#3b82f6' : 'rgba(0,0,0,0.2)'}
                                            strokeWidth={selectedId === item.id ? 3 : 1}
                                        />
                                        {/* Label Background for visibility on dark colors */}
                                        <Rect
                                            x={2}
                                            y={2}
                                            width={item.width - 4}
                                            height={14}
                                            fill="rgba(255,255,255,0.8)"
                                            cornerRadius={2}
                                        />
                                        <Text
                                            text={item.label}
                                            x={2}
                                            y={5}
                                            width={item.width - 4}
                                            align="center"
                                            fill="#111827"
                                            fontSize={10}
                                            fontStyle="bold"
                                        />
                                        {/* Dimension Label */}
                                        <Text
                                            text={`${item.width}"x${item.height}"`}
                                            x={0}
                                            y={item.height - 14}
                                            width={item.width}
                                            align="center"
                                            fill={['#ffffff', '#111827', 'transparent'].includes(item.fill) ? '#6b7280' : 'white'}
                                            fontSize={9}
                                        />
                                    </>
                                )}
                            </Group>
                        ))}
                    </Layer>
                </Stage>
            </div>

            <div style={{ padding: '0.5rem', background: 'var(--bg-dark)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                Scale: 1 Pixel = 1 Inch. Minor Grid = 1ft (12"). Major Grid = 5ft (60").
            </div>
        </div>
    );
}
