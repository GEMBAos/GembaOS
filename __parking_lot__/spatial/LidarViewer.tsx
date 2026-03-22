import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import ErrorBoundary from '../ErrorBoundary';

interface Pin {
    id: string;
    position: [number, number, number];
    text: string;
}

function ModelViewer({ file, onClick }: { file: File; onClick?: (e: ThreeEvent<MouseEvent>) => void }) {
    // Generate object URL from dropped file
    const url = URL.createObjectURL(file);
    const { scene } = useGLTF(url);
    useEffect(() => {
        return () => URL.revokeObjectURL(url);
    }, [url]);

    return <primitive object={scene} onClick={onClick} />;
}

function ModelViewerFromUrl({ url, onClick }: { url: string; onClick?: (e: ThreeEvent<MouseEvent>) => void }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} onClick={onClick} />;
}

function LoadingSpinner() {
    return (
        <group>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="var(--accent-primary)" wireframe />
            </mesh>
            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshStandardMaterial color="var(--accent-primary)" wireframe opacity={0.3} transparent />
            </mesh>
        </group>
    );
}

interface LidarViewerProps {
    initialFile?: File | null;
    initialUrl?: string | null;
}

export default function LidarViewer({ initialFile, initialUrl }: LidarViewerProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(initialFile || null);
    const [modelUrl, setModelUrl] = useState<string | null>(initialUrl || null);
    const [glError, setGlError] = useState<string | null>(null);
    const [isContextLost, setIsContextLost] = useState(false);
    const [pins, setPins] = useState<Pin[]>([]);
    const [isPinMode, setIsPinMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialFile) {
            setUploadedFile(initialFile);
            setModelUrl(null);
            setGlError(null);
        }
    }, [initialFile]);

    useEffect(() => {
        if (initialUrl) {
            setModelUrl(initialUrl);
            setUploadedFile(null);
            setGlError(null);
        }
    }, [initialUrl]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0]);
            setModelUrl(null);
            setGlError(null);
            setPins([]);
        }
    };

    const handleModelClick = (e: ThreeEvent<MouseEvent>) => {
        if (!isPinMode) return;
        e.stopPropagation();
        const newPin: Pin = {
            id: Math.random().toString(36).substr(2, 9),
            position: [e.point.x, e.point.y, e.point.z],
            text: `Note #${pins.length + 1}`
        };
        setPins([...pins, newPin]);
        setIsPinMode(false); // Auto-exit pin mode after dropping one
    };

    return (
        <div
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)', position: 'relative' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            {/* Diagnostic Overlay */}
            {(glError || isContextLost) && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100, background: 'rgba(239, 68, 68, 0.9)', padding: '1rem', borderRadius: '0.5rem', color: 'white', fontSize: '0.8rem', maxWidth: '300px', border: '1px solid white' }}>
                    <strong>3D Diagnostic Alert:</strong>
                    <div style={{ marginTop: '0.5rem' }}>{isContextLost ? 'WebGL Context Lost. Your GPU might have crashed or hung.' : glError}</div>
                    <button className="btn btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.7rem', background: '#fff', color: '#000' }} onClick={() => window.location.reload()}>
                        Reload App
                    </button>
                </div>
            )}

            {(!uploadedFile && !modelUrl) ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧊</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Upload Spatial Data</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                        Since mobile browsers cannot directly access native LiDAR sensors, upload a <b>.glb</b> or <b>.gltf</b> scan to review measurements.
                    </p>
                    <input
                        type="file"
                        accept=".glb,.gltf"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])}
                    />
                    <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
                        Upload .GLB File
                    </button>
                </div>
            ) : (
                <div style={{ flex: 1, position: 'relative', background: '#000' }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button className="btn" style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => { setUploadedFile(null); setModelUrl(null); setGlError(null); setPins([]); }}>
                            Reset
                        </button>
                        <button
                            className={`btn ${isPinMode ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}
                            onClick={() => setIsPinMode(!isPinMode)}
                        >
                            {isPinMode ? '📍 Click Model to Drop Pin' : '📍 Add Spatial Note'}
                        </button>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', alignSelf: 'center', marginLeft: '0.5rem' }}>
                            {modelUrl ? 'Remote Model' : 'Local File'}
                        </div>
                    </div>
                    <ErrorBoundary fallback={
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '3rem' }}>⚠️</div>
                            <h3>WebGL Rendering Error</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>The 3D engine failed to start on this hardware.</p>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.reload()}>Reload</button>
                        </div>
                    }>
                        <Canvas
                            camera={{ position: [5, 5, 5], fov: 45 }}
                            gl={{ antialias: true, alpha: false, stencil: false, depth: true, powerPreference: 'high-performance' }}
                            onCreated={({ gl }) => {
                                gl.domElement.addEventListener('webglcontextlost', () => setIsContextLost(true), false);
                            }}
                        >
                            <color attach="background" args={['#050505']} />
                            <ambientLight intensity={0.8} />
                            <directionalLight position={[10, 10, 5]} intensity={1.5} />
                            <Suspense fallback={<LoadingSpinner />}>
                                {uploadedFile && <ModelViewer file={uploadedFile} onClick={handleModelClick} />}
                                {modelUrl && <ModelViewerFromUrl url={modelUrl} onClick={handleModelClick} />}

                                {pins.map(pin => (
                                    <Html key={pin.id} position={pin.position} center zIndexRange={[100, 0]}>
                                        <div style={{
                                            background: 'var(--bg-dark)',
                                            color: 'var(--text-main)',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.75rem',
                                            whiteSpace: 'nowrap',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            border: '1px solid var(--accent-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <span style={{ fontSize: '1rem' }}>📍</span>
                                            <input
                                                autoFocus
                                                type="text"
                                                defaultValue={pin.text}
                                                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '120px' }}
                                                onBlur={(e) => {
                                                    const newText = e.target.value;
                                                    setPins(pins.map(p => p.id === pin.id ? { ...p, text: newText } : p));
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') e.currentTarget.blur();
                                                }}
                                            />
                                            <button
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                                                onClick={() => setPins(pins.filter(p => p.id !== pin.id))}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </Html>
                                ))}

                                <Environment preset="warehouse" />
                            </Suspense>
                            <OrbitControls makeDefault enabled={!isPinMode} />
                        </Canvas>
                    </ErrorBoundary>
                </div>
            )}
        </div>
    );
}
