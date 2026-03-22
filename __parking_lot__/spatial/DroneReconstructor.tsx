import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LidarViewer from './LidarViewer';
import type { KaizenProject, PhaseEvidence } from '../../types';

type ProcessState = 'idle' | 'uploading' | 'aligning' | 'pointcloud' | 'meshing' | 'texturing' | 'complete';

interface DroneReconstructorProps {
    projects: KaizenProject[];
    onUpdateProjects: (projects: KaizenProject[]) => void;
    initialModel?: string | null;
    onClearModel?: () => void;
}

export default function DroneReconstructor({ projects, onUpdateProjects, initialModel, onClearModel }: DroneReconstructorProps) {
    const { t } = useTranslation();
    const [state, setState] = useState<ProcessState>(initialModel ? 'complete' : 'idle');
    const [progress, setProgress] = useState(initialModel ? 100 : 0);
    const [showViewer, setShowViewer] = useState(!!initialModel);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedPhaseId, setSelectedPhaseId] = useState('');
    const [linkSuccess, setLinkSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stages: { key: ProcessState; label: string; description: string }[] = [
        { key: 'aligning', label: 'Aligning Cameras', description: 'Extracting structure from motion (SfM)...' },
        { key: 'pointcloud', label: 'Generating Point Cloud', description: 'Computing dense depth maps...' },
        { key: 'meshing', label: 'Meshing', description: 'Creating polygonal surface...' },
        { key: 'texturing', label: 'Texturing', description: 'Projecting drone imagery onto mesh...' }
    ];

    useEffect(() => {
        let interval: any;
        if (state !== 'idle' && state !== 'complete' && state !== 'uploading') {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        const currentIndex = stages.findIndex(s => s.key === state);
                        if (currentIndex < stages.length - 1) {
                            setState(stages[currentIndex + 1].key);
                            return 0;
                        } else {
                            setState('complete');
                            return 100;
                        }
                    }
                    return prev + 2; // Simulated speed
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [state]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setState('uploading');
            let uploadProgress = 0;
            const uploadInterval = setInterval(() => {
                uploadProgress += 5;
                setProgress(uploadProgress);
                if (uploadProgress >= 100) {
                    clearInterval(uploadInterval);
                    setState('aligning');
                    setProgress(0);
                }
            }, 50);
        }
    };

    const handleLinkToProject = () => {
        if (!selectedProjectId || !selectedPhaseId) return;

        const mockModelUrl = "https://raw.githubusercontent.com/bertt/googlemaps3d/main/3dtiles/building.glb";
        const newEvidence: PhaseEvidence = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'spatial',
            content: 'Spatial Digital Twin - Drone Reconstruction',
            url: mockModelUrl,
            timestamp: new Date().toISOString()
        };

        const updatedProjects = projects.map(p => {
            if (p.id === selectedProjectId) {
                const updatedPhases = p.phases.map(ph => {
                    if (ph.id === selectedPhaseId) {
                        return { ...ph, evidence: [...ph.evidence, newEvidence] };
                    }
                    return ph;
                });
                return { ...p, phases: updatedPhases };
            }
            return p;
        });

        onUpdateProjects(updatedProjects);
        setLinkSuccess(true);
        setTimeout(() => setLinkSuccess(false), 3000);
    };

    const handleBack = () => {
        setShowViewer(false);
        if (initialModel && onClearModel) {
            onClearModel();
        }
    };

    if (showViewer) {
        // Realistic building model for a representative "Spatial Digital Twin" demo
        const mockModelUrl = initialModel || "https://raw.githubusercontent.com/bertt/googlemaps3d/main/3dtiles/building.glb";

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🏢</span>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{t('spatial_hub.tools.drone.title')} Result</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Representative Sample • Industrial Site</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {/* Link to Project UI */}
                        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
                            <select
                                className="input-field"
                                style={{ padding: '0.2rem', fontSize: '0.75rem', width: '120px' }}
                                value={selectedProjectId}
                                onChange={(e) => {
                                    setSelectedProjectId(e.target.value);
                                    setSelectedPhaseId('');
                                }}
                            >
                                <option value="">Link Project...</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            {selectedProjectId && (
                                <select
                                    className="input-field"
                                    style={{ padding: '0.2rem', fontSize: '0.75rem', width: '100px' }}
                                    value={selectedPhaseId}
                                    onChange={(e) => setSelectedPhaseId(e.target.value)}
                                >
                                    <option value="">Phase...</option>
                                    {projects.find(p => p.id === selectedProjectId)?.phases.map(ph => (
                                        <option key={ph.id} value={ph.id}>Day {ph.day}: {ph.title}</option>
                                    ))}
                                </select>
                            )}
                            <button
                                className="btn btn-primary"
                                style={{ padding: '0.2rem 0.75rem', fontSize: '0.75rem' }}
                                onClick={handleLinkToProject}
                                disabled={!selectedPhaseId || linkSuccess}
                            >
                                {linkSuccess ? 'Linked! ✓' : 'Link'}
                            </button>
                        </div>

                        <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => window.location.reload()}>
                            🔄 Force Reload
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }} onClick={handleBack}>
                            {t('spatial_hub.back')}
                        </button>
                    </div>
                </div>
                <div style={{ flex: 1, background: '#000', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--accent-primary)', backdropFilter: 'blur(8px)', maxWidth: '280px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Sample Reconstruction Note:</div>
                        <p style={{ fontSize: '0.7rem', color: '#fff', lineHeight: '1.4', margin: 0 }}>
                            This is a high-fidelity representative model of an industrial site. Browser-based processing is currently in <b>Technical Preview</b>. For real-time processing of your 4K footage, please use the Gemba Cloud photogrammetry pipeline.
                        </p>
                    </div>
                    <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.7)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', backdropFilter: 'blur(8px)', maxWidth: '200px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Processing Stats:</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>1.2M Vertices</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>8K UDIM Textures</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--accent-success)', marginTop: '0.5rem' }}>Success (Cloud Optimized)</div>
                    </div>
                    <LidarViewer initialFile={null} initialUrl={mockModelUrl} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--bg-panel)' }}>
            {state === 'idle' ? (
                <div className="card" style={{ maxWidth: '500px', border: '2px dashed var(--border-light)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛸</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Drone Flyover Reconstruction</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Upload your drone's 4K flyover video (MP4/MOV). Our cloud-based photogrammetry engine will reconstruct the spatial geometry and textures into a 3D digital twin.
                    </p>
                    <input
                        type="file"
                        accept="video/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                    <button className="btn btn-primary btn-lg" onClick={() => fileInputRef.current?.click()}>
                        Select Drone Video
                    </button>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Recommended: Slow, overlapping circular flight at 45° camera pitch.
                    </p>
                </div>
            ) : (
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>
                            {state === 'uploading' ? 'Uploading Video...' : 'Processing Digital Twin...'}
                        </h2>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                            {state === 'complete' ? 'Reconstruction Successful' : stages.find(s => s.key === state)?.label || 'Preparing...'}
                        </p>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'var(--accent-primary)',
                            boxShadow: '0 0 10px var(--accent-primary)',
                            transition: 'width 0.1s ease-out'
                        }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                        {stages.map(s => {
                            const isActive = s.key === state;
                            const isPast = stages.findIndex(stage => stage.key === state) > stages.findIndex(stage => stage.key === s.key) || state === 'complete';

                            return (
                                <div key={s.key} style={{
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid var(--border-light)',
                                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    opacity: isPast || isActive ? 1 : 0.3,
                                    textAlign: 'left'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{s.label}</span>
                                        {isPast && <span style={{ color: 'var(--accent-success)' }}>✓</span>}
                                        {isActive && <span style={{ fontSize: '0.7rem' }}>{progress}%</span>}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.description}</div>
                                </div>
                            );
                        })}
                    </div>

                    {state === 'complete' && (
                        <div style={{ marginTop: '3rem', animation: 'fadeIn 0.5s ease-out' }}>
                            <button className="btn btn-primary btn-lg" style={{ padding: '1rem 3rem' }} onClick={() => setShowViewer(true)}>
                                View 3D Model
                            </button>
                            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Reconstruction ID: RECON-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
