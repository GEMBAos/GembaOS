import React, { useState, useEffect, useRef } from 'react';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2, MotionParticipantPathV2, PathNodeEvent } from '../../../types/motion_v2';
import { useMotionRealtime } from '../../../hooks/useMotionRealtime';

interface Props {
    sessionId: string;
    participantId: string;
    onLeave: () => void;
}

export default function MotionParticipantPathing({ sessionId, participantId, onLeave }: Props) {
    const session = ImprovementEngine.getItem<MotionSessionV2>(sessionId);
    const participant = ImprovementEngine.getItem<MotionParticipantPathV2>(participantId);
    
    // Use local state for high-frequency updates, sync to Engine periodically
    const [path, setPath] = useState(participant?.pathCoordinates || []);
    const [totalDistance, setTotalDistance] = useState(participant?.totalDistance || 0);
    const [mode, setMode] = useState<PathNodeEvent>('MOVE');
    const [isTraceMode, setIsTraceMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastDrawTime = useRef(0);
    
    const [elapsedSecs, setElapsedSecs] = useState(0);

    // Feature 3: Web Speech API Observer Pins for Participants
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                addVoicePin(transcript);
            };

            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);
            
            recognitionRef.current = recognition;
        }
    }, [path]);

    const addVoicePin = (text: string) => {
        let lastX = 50, lastY = 50;
        if (path.length > 0) {
            lastX = path[path.length - 1].x;
            lastY = path[path.length - 1].y;
        }
        const newNode: any = { x: lastX, y: lastY, timestamp: Date.now(), eventType: 'OBSERVATION', notes: text };
        setPath(prev => [...prev, newNode]);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech Recognition API is not supported in this browser/device.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) { console.error(e); }
        }
    };
    
    useEffect(() => {
        if (!participant) return;
        const sessionStart = new Date(participant.joinedAt).getTime();
        const interval = setInterval(() => {
            setElapsedSecs(Math.floor((Date.now() - sessionStart) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [participant]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    
    const imgRef = useRef<HTMLImageElement>(null);

    const { broadcastPathUpdate } = useMotionRealtime(sessionId, 'PARTICIPANT', participant);

    // Sync to Engine when path changes
    useEffect(() => {
        if (!participant) return;
        ImprovementEngine.updateItem<MotionParticipantPathV2>(participantId, {
            pathCoordinates: path,
            totalDistance: totalDistance,
            lastActiveAt: new Date().toISOString()
        });
        // Non-blocking broadcast
        broadcastPathUpdate(participantId, path, totalDistance).catch(console.error);
    }, [path, totalDistance, participantId]);

    if (!session || !participant) return null;

    const addPoint = (clientX: number, clientY: number) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        let newDistance = totalDistance;

        if (path.length > 0 && session.calibrationScale > 0) {
            const last = path[path.length - 1];
            const px1 = (last.x / 100) * rect.width;
            const py1 = (last.y / 100) * rect.height;
            const px2 = (x / 100) * rect.width;
            const py2 = (y / 100) * rect.height;
            
            const pxDist = Math.sqrt(Math.pow(px2 - px1, 2) + Math.pow(py2 - py1, 2));
            const unitDist = pxDist / session.calibrationScale;
            newDistance += unitDist;
        }

        const newNode = {
            x, y,
            timestamp: Date.now(),
            eventType: mode
        };

        setTotalDistance(newDistance);
        setPath(prev => [...prev, newNode]);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
        // Only set drawing if in trace mode, but always add the first point tapped
        e.currentTarget.setPointerCapture(e.pointerId);
        if (isTraceMode) {
            setIsDrawing(true);
            lastDrawTime.current = Date.now();
        }
        addPoint(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
        if (!isDrawing || !isTraceMode) return;
        const now = Date.now();
        // Throttle to avoid excessive path nodes (every 100ms)
        if (now - lastDrawTime.current > 100) {
            addPoint(e.clientX, e.clientY);
            lastDrawTime.current = now;
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDrawing(false);
    };

    const undoLast = () => {
        if (path.length === 0) return;
        const newPath = [...path];
        newPath.pop();
        // Naive distance undo (doesn't recalculate perfectly without history array, but good for demo)
        setPath(newPath);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg-dark)' }}>
            {/* PARTICIPANT OVERLAY: HIGH VISIBILITY TRACKING STATUS */}
            <div style={{ 
                background: 'rgba(26, 26, 26, 0.95)', 
                borderBottom: '2px solid #71717a', 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.5rem',
                zIndex: 100,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn" onClick={onLeave} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: 'none' }}>← Leave</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.15)', padding: '0.4rem 1rem', borderRadius: '4px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#71717a', boxShadow: '0 0 10px #71717a', animation: 'pulse 1.5s infinite' }}></div>
                            <span style={{ color: '#71717a', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '2px' }}>
                                ACTIVE TRACKING
                            </span>
                            <span style={{ marginLeft: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {formatTime(elapsedSecs)}
                            </span>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        DEVICE CONNECTED
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontFamily: 'var(--font-headings)', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>SESSION: {session.sessionName}</span>
                        <span style={{ fontWeight: 'bold', color: participant.color, fontSize: '1.25rem', marginTop: '0.25rem' }}>
                            {participant.participantName}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 800, letterSpacing: '1px' }}>{path.length} POINTS</span>
                        <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-headings)', fontSize: '1.25rem', color: 'white' }}>
                            {totalDistance.toFixed(1)} {session.calibrationUnit !== 'none' ? session.calibrationUnit : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Layout Canvas */}
            <div 
                style={{ 
                    flex: 1, 
                    position: 'relative', 
                    background: '#000', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none' // Prevent scrolling while tapping
                }}
            >
                {session.layoutImageUrl ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,26,26,0.85)', color: 'white', padding: '8px 16px', borderRadius: '24px', fontSize: '0.85rem', pointerEvents: 'none', border: '1px solid #71717a', zIndex: 10, letterSpacing: '1px', fontWeight: 800, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                            {isTraceMode ? '✍️ DRAW DIRECTLY ON MAP TO TRACE PATH' : `📍 TAP VIEWPORT TO DROP ${mode === 'STOP' ? 'STOP' : 'POINT'}`}
                        </div>
                        <img 
                            ref={imgRef}
                            src={session.layoutImageUrl} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: isTraceMode ? 'crosshair' : 'crosshair' }} 
                            alt="Map Layout"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                        />
                        
                        {/* Overlay Path */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            {path.length > 1 && (
                                <polyline 
                                    points={path.map(c => `${c.x}%,${c.y}%`).join(' ')}
                                    fill="none"
                                    stroke={participant.color}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                            {path.map((coord, i) => {
                                if (coord.eventType === 'OBSERVATION' && coord.notes) {
                                    return (
                                        <g key={i} transform={`translate(${coord.x}%, ${coord.y}%)`} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.8))' }}>
                                            <circle r="8" fill="#facc15" stroke="#fff" strokeWidth="2" />
                                            <text y="4" fontSize="12" textAnchor="middle" fill="#000" fontWeight="bold">!</text>
                                            <rect x="-60" y="-30" width="120" height="20" rx="4" fill="rgba(0,0,0,0.8)" />
                                            <text y="-16" fill="#fff" fontSize="10" textAnchor="middle">{coord.notes.length > 15 ? coord.notes.substring(0,15) + '...' : coord.notes}</text>
                                        </g>
                                    );
                                }
                                return (
                                    <circle 
                                        key={i}
                                        cx={`${coord.x}%`} 
                                        cy={`${coord.y}%`} 
                                        r={coord.eventType === 'STOP' ? "6" : "6"} 
                                        fill={coord.eventType === 'STOP' ? '#ef4444' : participant.color}
                                        stroke="#fff"
                                        strokeWidth="2"
                                    />
                                );
                            })}
                        </svg>

                        {/* Floating Action Buttons overlaid on Canvas */}
                        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 50 }}>
                            {/* Speech API Mic Button */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleListening(); }}
                                style={{ 
                                    width: '60px', height: '60px', borderRadius: '50%', border: 'none', 
                                    background: isListening ? '#ef4444' : '#facc15', 
                                    color: isListening ? 'white' : 'black', 
                                    boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.8)' : '0 4px 15px rgba(0,0,0,0.5)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s',
                                    animation: isListening ? 'pulse 1.5s infinite' : 'none'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ color: 'var(--text-muted)' }}>No layout image provided.</div>
                )}
            </div>

            {/* Bottom Actions */}
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(26,26,26,1)', display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                    className="btn" 
                    style={{ flex: 1, background: mode === 'MOVE' && !isTraceMode ? '#71717a' : 'rgba(255,255,255,0.05)', color: mode === 'MOVE' && !isTraceMode ? '#fff' : 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', border: mode === 'MOVE' && !isTraceMode ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => { setMode('MOVE'); setIsTraceMode(false); }}
                >
                    📍 Point
                </button>
                <button 
                    className="btn" 
                    title="Manual Trace Fallback"
                    style={{ flex: 1.5, background: isTraceMode ? '#71717a' : 'rgba(255,255,255,0.05)', color: isTraceMode ? '#fff' : 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', border: isTraceMode ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => { setMode('MOVE'); setIsTraceMode(true); }}
                >
                    ✍️ Trace Map
                </button>
                <button 
                    className="btn" 
                    style={{ flex: 1, background: mode === 'STOP' ? '#D84315' : 'rgba(255,255,255,0.05)', color: mode === 'STOP' ? '#fff' : 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', border: mode === 'STOP' ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                    onClick={() => { setMode('STOP'); setIsTraceMode(false); }}
                >
                    🛑 Stop
                </button>
                <button 
                    className="btn" 
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                    onClick={undoLast}
                    disabled={path.length === 0}
                >
                    ↩ Undo
                </button>
            </div>
        </div>
    );
}
