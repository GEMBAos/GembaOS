import { useState, useRef, useEffect } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { MotionPath } from '../../types/improvement';

type ViewMode = 'DASHBOARD' | 'CAPTURE' | 'COMPARE';

export default function MotionMapping({ onClose }: { onClose: () => void }) {
    const [mode, setMode] = useState<ViewMode>('DASHBOARD');
    const [sessions, setSessions] = useState<MotionPath[]>([]);
    
  const [points, setPoints] = useState<{id: string, label: string, x: number, y: number, timestamp: number, isExit: boolean}[]>([]);
  const [sessionName, setSessionName] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [sessionState, setSessionState] = useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [sessionTimeMs, setSessionTimeMs] = useState(0);
  const [isExitMode, setIsExitMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Compare Mode State
    const [compareLeftId, setCompareLeftId] = useState<string>('');
    const [compareRightId, setCompareRightId] = useState<string>('');

    const refreshData = () => {
        setSessions(ImprovementEngine.getItemsByType<MotionPath>('MotionPath'));
    };

    useEffect(() => {
        refreshData();
        const listener = () => refreshData();
        window.addEventListener('improvement_data_updated', listener);
        return () => window.removeEventListener('improvement_data_updated', listener);
    }, []);

    const calculateDistance = (pts: typeof points) => {
        let dist = 0;
        for (let i = 1; i < pts.length; i++) {
            const dx = pts[i].x - pts[i-1].x;
            const dy = pts[i].y - pts[i-1].y;
            dist += Math.sqrt(dx * dx + dy * dy);
        }
        // Scale factor: assume canvas width represents approx 40 ft workspace
        return Number((dist * 0.4).toFixed(1)); 
    };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current || sessionState !== 'RUNNING') return;
      const rect = canvasRef.current.getBoundingClientRect();
      
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      const newPoint = {
          id: Date.now().toString() + Math.random(),
          label: `P${points.length + 1}`,
          x: xPct,
          y: yPct,
          timestamp: Date.now(),
          isExit: isExitMode
      };

      setPoints([...points, newPoint]);
  };

  const toggleTimer = () => {
    if (sessionState === 'IDLE' || sessionState === 'PAUSED') {
      setSessionState('RUNNING');
      timerRef.current = setInterval(() => {
        setSessionTimeMs(prev => prev + 1000);
      }, 1000);
    } else {
      setSessionState('PAUSED');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopSession = () => {
    setSessionState('IDLE');
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  const resetSession = () => {
    stopSession();
    setPoints([]);
    setSessionTimeMs(0);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExitCount = () => points.filter(p => p.isExit).length;

    const handleSaveSession = () => {
        if (!sessionName.trim() || points.length === 0) {
            alert("Please provide a session name and plot at least one point.");
            return;
        }

      ImprovementEngine.createItem<MotionPath>({
          type: 'MotionPath',
          sessionName: sessionName,
          operatorId: operatorName || 'Unknown',
          pathCoordinates: points,
          totalDistance: calculateDistance(points),
          totalStops: points.length,
          longestSegment: getExitCount() // reusing longestSegment to store exit count for now for v1 compat
      });

      resetSession();
      setSessionName('');
      setOperatorName('');
      setMode('DASHBOARD');
  };

    const renderCanvas = (pathPoints: typeof points, interactive: boolean = false) => {
        return (
            <div 
                ref={interactive ? canvasRef : null}
                onClick={interactive ? handleCanvasClick : undefined}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: interactive ? 'crosshair' : 'default',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                }}
            >
                {/* Grid Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

                {/* SVG Lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {pathPoints.map((pt, i) => {
                        if (i === 0) return null;
                        const prev = pathPoints[i-1];
                        return (
                            <line 
                                key={`line-${pt.id}`}
                                x1={`${prev.x}%`} y1={`${prev.y}%`}
                                x2={`${pt.x}%`} y2={`${pt.y}%`}
                                stroke="rgba(167, 139, 250, 0.8)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            />
                        );
                    })}
                </svg>

                {/* Plot Points */}
                {pathPoints.map((pt, i) => (
                    <div 
                        key={pt.id}
                        style={{
                          width: pt.isExit ? '32px' : '24px',
                          height: pt.isExit ? '32px' : '24px',
                          background: pt.isExit ? 'rgba(239, 68, 68, 0.9)' : (i === 0 ? '#10b981' : i === pathPoints.length - 1 && !interactive ? '#ef4444' : '#8b5cf6'),
                          borderRadius: pt.isExit ? '4px' : '50%',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          boxShadow: pt.isExit ? '0 0 15px rgba(239, 68, 68, 0.8)' : '0 0 10px rgba(139, 92, 246, 0.6)',
                          border: pt.isExit ? '2px solid #fca5a5' : '2px solid rgba(255,255,255,0.8)',
                          zIndex: 10
                      }}
                  >
                      {pt.isExit ? 'EXIT' : i + 1}
                  </div>
                ))}
            </div>
        );
    };

    return (
      <HardwareConsoleLayout 
          toolId="OBS-01 SPATIAL TRACKING" 
          toolName="MOTION MAPPING (SURGEON PATH)" 
          onClose={onClose}
      >
            <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Header Navigation */}
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={() => setMode('DASHBOARD')}
                        style={{ flex: 1, padding: '0.75rem', background: mode === 'DASHBOARD' ? '#8b5cf6' : 'transparent', color: mode === 'DASHBOARD' ? 'white' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        SESSION DASHBOARD
                    </button>
                    <button 
                        onClick={() => setMode('CAPTURE')}
                        style={{ flex: 1, padding: '0.75rem', background: mode === 'CAPTURE' ? '#8b5cf6' : 'transparent', color: mode === 'CAPTURE' ? 'white' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + NEW CAPTURE
                    </button>
                    <button 
                        onClick={() => setMode('COMPARE')}
                        disabled={sessions.length < 2}
                        style={{ flex: 1, padding: '0.75rem', background: mode === 'COMPARE' ? '#8b5cf6' : 'transparent', color: mode === 'COMPARE' ? 'white' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: sessions.length < 2 ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: sessions.length < 2 ? 0.4 : 1 }}>
                        BEFORE / AFTER COMPARE
                    </button>
                </div>

                {/* Dashboard Mode */}
                {mode === 'DASHBOARD' && (
                    <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 100%, 350px), 1fr))', gap: '1rem' }}>
                        {sessions.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                                No motion mapping sessions recorded. Click "+ NEW CAPTURE" to start mapping.
                            </div>
                        ) : (
                            sessions.map(s => (
                                <div key={s.id} className="card" style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{s.sessionName}</h3>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Operator: {s.operatorId}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Distance</div>
                                            <div style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '1.2rem' }}>{s.totalDistance} ft</div>
                                        </div>
                                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Path Nodes</div>
                                            <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem' }}>{s.totalStops}</div>
                                        </div>
                                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Field Exits</div>
                                            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{s.longestSegment}</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '150px' }}>
                                        {renderCanvas((s.pathCoordinates as any[]).map(p => ({...p, isExit: p.isExit || false})))}
                                    </div>
                                    <div style={{ color: '#475569', fontSize: '0.75rem', marginTop: '1rem', textAlign: 'right' }}>
                                        {new Date(s.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

              {/* Capture Mode */}
              {mode === 'CAPTURE' && (
                  <div style={{ flex: 1, display: 'flex', gap: '1rem', overflow: 'hidden', flexWrap: 'wrap', overflowY: 'auto' }}>
                      <div style={{ flex: '1 1 clamp(300px, 100%, 400px)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div className="card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                              <h3 style={{ color: 'white', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Operating Field Setup</h3>
                              <div style={{ marginBottom: '1rem' }}>
                                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Session Title</label>
                                  <input 
                                      type="text" 
                                      value={sessionName}
                                      onChange={e => setSessionName(e.target.value)}
                                      disabled={sessionState !== 'IDLE'}
                                      placeholder="e.g. Line 1 Assembly"
                                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', opacity: sessionState !== 'IDLE' ? 0.5 : 1 }}
                                  />
                              </div>
                              <div style={{ marginBottom: '1.5rem' }}>
                                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Surgeon / Participant Name</label>
                                  <input 
                                      type="text" 
                                      value={operatorName}
                                      onChange={e => setOperatorName(e.target.value)}
                                      disabled={sessionState !== 'IDLE'}
                                      placeholder="Operator Name"
                                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', opacity: sessionState !== 'IDLE' ? 0.5 : 1 }}
                                  />
                              </div>

                              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                      <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Session Time:</span>
                                      <span style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}>{formatTime(sessionTimeMs)}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                      <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Distance Traveled:</span>
                                      <span style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '1.1rem' }}>{calculateDistance(points)} ft</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                      <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Trips:</span>
                                      <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.1rem' }}>{points.length} nodes</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Field Exits:</span>
                                      <span style={{ color: getExitCount() > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>{getExitCount()} exits</span>
                                  </div>
                              </div>

                              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                  <button 
                                      onClick={toggleTimer}
                                      disabled={!sessionName}
                                      style={{ flex: 1, padding: '0.75rem', background: sessionState === 'RUNNING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: sessionState === 'RUNNING' ? '#fbbf24' : '#34d399', border: `1px solid ${sessionState === 'RUNNING' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`, borderRadius: '4px', cursor: !sessionName ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: !sessionName ? 0.5 : 1 }}>
                                      {sessionState === 'RUNNING' ? '⏸ PAUSE' : '▶ START'}
                                  </button>
                                  <button 
                                      onClick={stopSession}
                                      disabled={sessionState === 'IDLE'}
                                      style={{ flex: 1, padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '4px', cursor: sessionState === 'IDLE' ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: sessionState === 'IDLE' ? 0.5 : 1 }}>
                                      ⏹ STOP
                                  </button>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button 
                                      onClick={resetSession}
                                      disabled={sessionState === 'RUNNING'}
                                      style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', cursor: sessionState === 'RUNNING' ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: sessionState === 'RUNNING' ? 0.5 : 1 }}>
                                      Reset
                                  </button>
                                  <button 
                                      onClick={handleSaveSession}
                                      disabled={points.length === 0 || sessionState === 'RUNNING'}
                                      style={{ flex: 2, padding: '0.75rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', cursor: (points.length === 0 || sessionState === 'RUNNING') ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: (points.length === 0 || sessionState === 'RUNNING') ? 0.5 : 1 }}>
                                      Save Session
                                  </button>
                              </div>
                          </div>
                          
                          {/* Point Mode Toggle */}
                          <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Plot Mode</div>
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <button 
                                onClick={() => setIsExitMode(false)}
                                style={{ flex: 1, padding: '0.75rem', background: !isExitMode ? 'rgba(139, 92, 246, 0.3)' : 'transparent', color: !isExitMode ? '#fff' : '#64748b', border: 'none', cursor: 'pointer', fontWeight: !isExitMode ? 'bold' : 'normal', transition: 'all 0.2s' }}>
                                Standard Movement
                              </button>
                              <button 
                                onClick={() => setIsExitMode(true)}
                                style={{ flex: 1, padding: '0.75rem', background: isExitMode ? 'rgba(239, 68, 68, 0.3)' : 'transparent', color: isExitMode ? '#fff' : '#64748b', border: 'none', cursor: 'pointer', fontWeight: isExitMode ? 'bold' : 'normal', transition: 'all 0.2s' }}>
                                Field Exit ⚠️
                              </button>
                            </div>
                            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                              {isExitMode ? 'Next click marks the surgeon leaving the operating field (waste).' : 'Next click marks standard movement within the field.'}
                            </p>
                          </div>
                      </div>
                      
                      {/* Interactive Canvas */}
                      <div style={{ flex: '2 1 clamp(300px, 100%, 800px)', minHeight: 'clamp(300px, 50vh, 600px)', position: 'relative' }}>
                          {renderCanvas(points, true)}
                          {sessionState !== 'RUNNING' && (
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none', borderRadius: '8px' }}>
                                  <div style={{ background: 'rgba(0,0,0,0.8)', padding: '1rem 2rem', borderRadius: '30px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
                                      {sessionState === 'IDLE' ? (points.length > 0 ? 'SESSION STOPPED' : 'PRESS START TO BEGIN TRACKING') : 'SESSION PAUSED'}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              )}

                {/* Compare Mode */}
                {mode === 'COMPARE' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            
                            {/* Left Side (Before) */}
                            <div style={{ flex: '1 1 clamp(280px, 100%, 400px)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <select 
                                    value={compareLeftId}
                                    onChange={e => setCompareLeftId(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.9)', color: 'white', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem' }}
                                >
                                    <option value="">-- Select Session A (Before) --</option>
                                    {sessions.map(s => <option key={`left-${s.id}`} value={s.id}>{s.sessionName} ({s.totalDistance}ft)</option>)}
                                </select>
                                
                                {compareLeftId && (
                                    <div className="card" style={{ flex: 1, padding: '1rem', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                        {(() => {
                                            const s = sessions.find(x => x.id === compareLeftId);
                                            if(!s) return null;
                                            return (
                                                <div style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{s.totalDistance} ft</span>
                                                        <span style={{ color: '#94a3b8' }}>{s.longestSegment} exits</span>
                                                        <span style={{ color: '#94a3b8' }}>{s.totalStops} nodes</span>
                                                    </div>
                                                    <div style={{ flex: 1 }}>{renderCanvas((s.pathCoordinates as any[]).map(p => ({...p, isExit: p.isExit || false})))}</div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Right Side (After) */}
                            <div style={{ flex: '1 1 clamp(280px, 100%, 400px)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <select 
                                    value={compareRightId}
                                    onChange={e => setCompareRightId(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(15, 23, 42, 0.9)', color: 'white', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem' }}
                                >
                                    <option value="">-- Select Session B (After) --</option>
                                    {sessions.map(s => <option key={`right-${s.id}`} value={s.id}>{s.sessionName} ({s.totalDistance}ft)</option>)}
                                </select>
                                
                                {compareRightId && (
                                    <div className="card" style={{ flex: 1, padding: '1rem', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                        {(() => {
                                            const s = sessions.find(x => x.id === compareRightId);
                                            if(!s) return null;
                                            return (
                                                <div style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>{s.totalDistance} ft</span>
                                                        <span style={{ color: '#94a3b8' }}>{s.longestSegment} exits</span>
                                                        <span style={{ color: '#94a3b8' }}>{s.totalStops} nodes</span>
                                                    </div>
                                                    <div style={{ flex: 1 }}>{renderCanvas((s.pathCoordinates as any[]).map(p => ({...p, isExit: p.isExit || false})))}</div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Differential Analysis */}
                        {compareLeftId && compareRightId && (
                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                {(() => {
                                    const s1 = sessions.find(x => x.id === compareLeftId);
                                    const s2 = sessions.find(x => x.id === compareRightId);
                                    if(!s1 || !s2) return null;
                                    const distDiff = s1.totalDistance - s2.totalDistance;
                                    
                                    return (
                                        <div>
                                            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Waste Reduction Analysis</h3>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase' }}>Distance Saved</span>
                                                    <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 'bold', color: distDiff > 0 ? '#10b981' : (distDiff < 0 ? '#ef4444' : '#fcd34d') }}>
                                                        {distDiff > 0 ? '+' : ''}{distDiff.toFixed(1)} ft
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase' }}>Steps Eliminated</span>
                                                    <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 'bold', color: (s1.totalStops - s2.totalStops) > 0 ? '#10b981' : '#cbd5e1' }}>
                                                        {s1.totalStops - s2.totalStops}
                                                    </span>
                                                </div>
                                            </div>
                                            {distDiff > 0 && <div style={{ color: '#34d399', marginTop: '1rem', fontWeight: 'bold', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>✅ Successful Kaizen Improvement Verified</div>}
                                        </div>
                                    )
                                })()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </HardwareConsoleLayout>
    );
}
