import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2 } from '../../../types/motion_v2';
import { useMotionRealtime } from '../../../hooks/useMotionRealtime';
// import SpatialViewer from '../ar/SpatialViewer';

interface Props {
    sessionId: string;
    onBack: () => void;
}

export default function MotionHostActive({ sessionId, onBack }: Props) {
    const session = ImprovementEngine.getItem<MotionSessionV2>(sessionId);
    const { participants, broadcastPathUpdate } = useMotionRealtime(sessionId, 'HOST', null);

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Feature 3: Web Speech API Observer Pins
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Feature 4: HTML5 Canvas Heatmap & Spatial Viewer
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [is3DMode, setIs3DMode] = useState(false);
    const [isHostDrawing, setIsHostDrawing] = useState(false);
    const lastDrawTimeRef = useRef(0);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!showHeatmap || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const allPoints = participants.flatMap(p => p.pathCoordinates);
        if (allPoints.length === 0) return;

        // Custom blending for heatmap effect
        ctx.globalCompositeOperation = 'screen';

        allPoints.forEach(pt => {
            const x = (pt.x / 100) * canvas.width;
            const y = (pt.y / 100) * canvas.height;
            
            // Weight STOPs heavier and wider
            const radius = pt.eventType === 'STOP' ? 80 : 40;
            const intensity = pt.eventType === 'STOP' ? 0.3 : 0.05;

            const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grad.addColorStop(0, `rgba(255, 0, 0, ${intensity})`);
            grad.addColorStop(0.5, `rgba(255, 165, 0, ${intensity * 0.5})`);
            grad.addColorStop(1, 'rgba(255, 255, 0, 0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }, [showHeatmap, participants, session?.layoutImageUrl]);

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
    }, [participants]);

    const addVoicePin = (text: string) => {
        if (!session) return;
        const hostPid = `host_${session.hostUserId || 'guest'}`;
        let hostPart = participants.find(p => p.deviceId === hostPid);
        
        let lastX = 50, lastY = 50;
        if (hostPart && hostPart.pathCoordinates.length > 0) {
            const lastCoord = hostPart.pathCoordinates[hostPart.pathCoordinates.length - 1];
            lastX = lastCoord.x;
            lastY = lastCoord.y;
        } else if (!hostPart) {
            // Init host if they haven't drawn yet
            hostPart = {
                id: `path_${hostPid}_${Date.now()}`,
                type: 'MotionParticipantPathV2',
                sessionId: session.id,
                deviceId: hostPid,
                participantName: 'Host Configurator',
                color: '#71717a',
                pathCoordinates: [],
                totalDistance: 0,
                totalStops: 0,
                joinedAt: new Date().toISOString(),
                lastActiveAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }

        const newPath = [...hostPart.pathCoordinates, { x: lastX, y: lastY, timestamp: Date.now(), eventType: 'OBSERVATION' as const, notes: text }];
        const updated = { ...hostPart, pathCoordinates: newPath, lastActiveAt: new Date().toISOString() };
        
        ImprovementEngine.saveImportedItem(updated);
        ImprovementEngine.syncFromCloud();
        broadcastPathUpdate(hostPid, newPath, hostPart.totalDistance);
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

    const handleHostDraw = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => {
        if (!session) return;

        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        
        let clientX = 0; let clientY = 0;
        if ('touches' in e) {
            clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX; clientY = (e as React.MouseEvent).clientY;
        }

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        // Find or create host participant
        const hostPid = `host_${session.hostUserId || 'guest'}`;
        let hostPart = participants.find(p => p.deviceId === hostPid);

        if (!hostPart) {
            hostPart = {
                id: `path_${hostPid}_${Date.now()}`,
                type: 'MotionParticipantPathV2',
                sessionId: session.id,
                deviceId: hostPid,
                participantName: 'Host Configurator',
                color: '#71717a', // Brand Orange
                pathCoordinates: [],
                totalDistance: 0,
                totalStops: 0,
                joinedAt: new Date().toISOString(),
                lastActiveAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }

        const newPath = [...hostPart.pathCoordinates, { x, y, timestamp: Date.now(), eventType: 'MOVE' as const }];
        
        // Approximate distance if we have scale
        let newDist = hostPart.totalDistance;
        if (newPath.length > 1 && session.calibrationScale > 0) {
            const last = newPath[newPath.length - 2];
            const px1 = (last.x / 100) * rect.width;
            const py1 = (last.y / 100) * rect.height;
            const px2 = (x / 100) * rect.width;
            const py2 = (y / 100) * rect.height;
            const pxDist = Math.sqrt(Math.pow(px2 - px1, 2) + Math.pow(py2 - py1, 2));
            newDist += (pxDist / session.calibrationScale);
        }

        const updated = {
            ...hostPart,
            pathCoordinates: newPath,
            totalDistance: newDist,
            lastActiveAt: new Date().toISOString()
        };

        ImprovementEngine.saveImportedItem(updated);
        ImprovementEngine.syncFromCloud();
        
        // Broadcast to any connected participants (if they care)
        broadcastPathUpdate(hostPid, newPath, newDist);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setIsHostDrawing(true);
        handleHostDraw(e);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
        if (!isHostDrawing) return;
        const now = Date.now();
        if (now - lastDrawTimeRef.current > 200) { // Limit to 5 points per sec to prevent DB spam
            lastDrawTimeRef.current = now;
            handleHostDraw(e);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        setIsHostDrawing(false);
    };

    const handleDiagnose = () => {
        if (!session) return;
        
        // Mark session as completed so it doesn't stay 'Open' forever
        ImprovementEngine.updateItem<MotionSessionV2>(session.id, {
            status: 'CLOSED'
        });

        const processCheckId = `pc-${Date.now()}`;
        
        const totalDist = participants.reduce((sum, p) => sum + p.totalDistance, 0);

        ImprovementEngine.saveImportedItem({
            id: processCheckId,
            type: 'ProcessCheck',
            motionSessionId: session.id,
            processName: session.sessionName,
            operatorId: participants.map(p => p.participantName).join(', ') || 'Multiple',
            findings: `Observation Metrics:\n- Participants: ${participants.length}\n- Connected Distance: ${totalDist.toFixed(1)} ${session.calibrationUnit !== 'none' ? session.calibrationUnit : ''}`,
            wasteTypes: ['Motion'],
            targetCycleTime: 0,
            actualCycleTime: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as any);

        // Navigate directly to the Operating Room where the active thread renders
        window.location.hash = '/portal';
    };

    if (!session) return null;

    const joinUrl = `${window.location.origin}${window.location.pathname}#/motion-v2?session=${session.id}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-dark)', overflow: 'hidden' }}>
            {/* PRIORITY 7: HIGH VISIBILITY MULTI-USER STATUS */}
            <div style={{ 
                background: 'var(--bg-panel)', 
                borderBottom: '2px solid #71717a', 
                padding: '0.75rem 1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn" onClick={onBack} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: 'none' }}>← Exit</button>
                    <h3 style={{ margin: 0, color: 'white', fontFamily: '"Orbitron", sans-serif', fontSize: '1.1rem', letterSpacing: '1px' }}>{session.sessionName}</h3>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.15)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#71717a', boxShadow: '0 0 8px #71717a', animation: 'pulse 2s infinite' }}></div>
                        <span style={{ color: '#71717a', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px' }}>
                            {participants.length} LIVE
                        </span>
                    </div>
                </div>
                <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Sidebar with Connect info */}
                <div style={{ 
                    width: 'clamp(200px, 20vw, 260px)', 
                    background: 'var(--bg-panel)', 
                    borderRight: '1px solid var(--border-color)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    overflowY: 'auto' 
                }}>
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', alignSelf: 'center' }}>
                            <QRCodeSVG value={joinUrl} size={120} />
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Direct Join Code:</div>
                            <div style={{ fontSize: '2rem', fontFamily: '"Orbitron", monospace', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '6px', textShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>
                                {session.accessCode}
                            </div>
                        </div>

                        <button 
                            className="btn btn-primary" 
                            onClick={handleDiagnose}
                            style={{ width: '100%', padding: '1rem', fontWeight: 800, letterSpacing: '1px', fontSize: '0.9rem', background: '#71717a', color: 'white', border: 'none' }}
                        >
                            END SESSION & DIAGNOSE
                        </button>
                    </div>

                    {/* Active User List */}
                    <div style={{ flex: 1, borderTop: '1px solid var(--border-light)', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                        <h4 style={{ color: 'var(--text-muted)', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Connected Agents</h4>
                        {participants.length === 0 ? (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>Awaiting Operator Connections...</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {participants.map(p => {
                                    const isSending = (now - new Date(p.lastActiveAt).getTime()) < 10000;
                                    return (
                                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.7rem' }}>
                                                    {p.participantName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{p.participantName}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                                <div style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                                    {p.pathCoordinates?.length || 0} pts • {p.totalDistance.toFixed(1)} {session.calibrationUnit !== 'none' ? session.calibrationUnit : ''}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: isSending ? '#71717a' : 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {isSending ? '● Sending...' : 'Idle'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Canvas View */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 20px 0 20px -20px rgba(0,0,0,0.8)' }}>
                    {is3DMode ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            {/* <SpatialViewer session={session} participants={participants} /> */}
                            <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>3D Spatial Viewer (Parked)</div>
                        </div>
                    ) : (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            {session.layoutImageUrl ? (
                                <img 
                                    src={session.layoutImageUrl} 
                                    draggable={false}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8, cursor: 'crosshair', touchAction: 'none' }} 
                                    alt="Map Layout"
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerUp}
                                />
                            ) : (
                                <div 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        cursor: 'crosshair', 
                                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)', 
                                        backgroundSize: '40px 40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        touchAction: 'none'
                                    }}
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerUp}
                                >
                                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '2rem', fontFamily: 'var(--font-headings)', pointerEvents: 'none', userSelect: 'none' }}>BLANK CANVAS MODE</span>
                                </div>
                            )}

                            {/* Feature 4: Interactive Heatmap Layer */}
                            <canvas 
                                ref={canvasRef} 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, opacity: showHeatmap ? 0.85 : 0, transition: 'opacity 0.5s ease', mixBlendMode: 'hard-light' }} 
                            />
                            
                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, opacity: showHeatmap ? 0.3 : 1, transition: 'opacity 0.5s ease' }}>
                                {participants.map((p) => {
                                    if (p.pathCoordinates.length < 2) return null;
                                    return (
                                        <g key={`lines-${p.id}`} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}>
                                            {p.pathCoordinates.map((coord, i) => {
                                                if (i === 0) return null;
                                                const prev = p.pathCoordinates[i - 1];
                                                return (
                                                    <line 
                                                        key={`${p.id}-segment-${i}`}
                                                        x1={`${prev.x}%`} y1={`${prev.y}%`}
                                                        x2={`${coord.x}%`} y2={`${coord.y}%`}
                                                        stroke={p.color}
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                    />
                                                );
                                            })}
                                        </g>
                                    );
                                })}
                                
                                {/* Render Point Nodes */}
                                {participants.flatMap(p => p.pathCoordinates.map((coord, i) => {
                                    if (coord.eventType === 'OBSERVATION' && coord.notes) {
                                        return (
                                            <g key={`${p.id}-${i}`} style={{ transform: `translate(${coord.x}%, ${coord.y}%)`, filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.8))' }}>
                                                <circle r="8" fill="#facc15" stroke="#fff" strokeWidth="2" />
                                                <text y="4" fontSize="12" textAnchor="middle" fill="#000" fontWeight="bold">!</text>
                                                <rect x="-60" y="-30" width="120" height="20" rx="4" fill="rgba(0,0,0,0.8)" />
                                                <text y="-16" fill="#fff" fontSize="10" textAnchor="middle">{coord.notes.length > 15 ? coord.notes.substring(0,15) + '...' : coord.notes}</text>
                                            </g>
                                        );
                                    }
                                    return (
                                        <circle 
                                            key={`${p.id}-${i}`}
                                            cx={`${coord.x}%`} 
                                            cy={`${coord.y}%`} 
                                            r={coord.eventType === 'STOP' ? "6" : "4"} 
                                            fill={coord.eventType === 'STOP' ? '#ef4444' : p.color}
                                            stroke="#fff"
                                            strokeWidth={coord.eventType === 'STOP' ? "2" : "1.5"}
                                        />
                                    );
                                }))}
                            </svg>
                        </div>
                    )}
                    
                    {/* Floating Action Buttons overlaid on Canvas Container */}
                    <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 50 }}>
                        {/* Spatial 3D Viewer Toggle */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIs3DMode(!is3DMode); }}
                            style={{ 
                                width: '60px', height: '60px', borderRadius: '50%', border: 'none', 
                                background: is3DMode ? '#38bdf8' : 'var(--bg-panel)', 
                                color: is3DMode ? 'white' : 'var(--text-muted)', 
                                boxShadow: is3DMode ? '0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 15px rgba(0,0,0,0.5)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s'
                            }}
                            title="Toggle 3D Spatial Viewer"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </button>

                        {/* Heatmap Toggle Button (Hide in 3D Mode) */}
                        {!is3DMode && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowHeatmap(!showHeatmap); }}
                                style={{ 
                                    width: '60px', height: '60px', borderRadius: '50%', border: 'none', 
                                    background: showHeatmap ? '#ec4899' : 'var(--bg-panel)', 
                                    color: showHeatmap ? 'white' : 'var(--text-muted)', 
                                    boxShadow: showHeatmap ? '0 0 20px rgba(236, 72, 153, 0.8)' : '0 4px 15px rgba(0,0,0,0.5)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s'
                                }}
                                title="Toggle Density Heatmap"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </button>
                        )}

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
            </div>
        </div>
    );
}
