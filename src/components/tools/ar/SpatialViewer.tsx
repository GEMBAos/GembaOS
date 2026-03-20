import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, DeviceOrientationControls, Grid, Text, Box } from '@react-three/drei';
import type { MotionSessionV2, MotionParticipantPathV2 } from '../../../types/motion_v2';

interface Props {
    session: MotionSessionV2;
    participants: MotionParticipantPathV2[];
}

export default function SpatialViewer({ participants }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [gyroActive, setGyroActive] = useState(false);

    // Coordinate mapping (1 meter = 1 unit)
    const ROOM_SIZE = 20;
    const mapTo3D = (percentage: number) => {
        return (percentage / 100) * ROOM_SIZE - (ROOM_SIZE / 2);
    };

    // Initialize Camera Passthrough (Hardware Camera directly behind 3D Canvas)
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Target the iPhone 16 Pro Rear Array
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraActive(true);
                }
            } catch (err) {
                console.error("Camera access denied or unavailable (Expected if on Desktop PC without webcam).", err);
            }
        };
        startCamera();

        return () => {
             // Cleanly shut down camera hardware flag when unmounting
             if (videoRef.current && videoRef.current.srcObject) {
                 const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                 tracks.forEach(track => track.stop());
             }
        };
    }, []);

    // Request iOS Gyroscope/Accelerometer Hardware Permission
    const requestGyro = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setGyroActive(true);
                } else {
                    alert("Gyroscope tracking denied by iOS. Revert to manual drag panning.");
                }
            } catch (error) {
                console.error("Gyro Permission request failed:", error);
            }
        } else {
            // Unrestricted fallback (non-iOS)
            setGyroActive(true);
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative', overflow: 'hidden' }}>
            {/* Live Camera Feed Background (Real-World Canvas) */}
            <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    opacity: cameraActive ? 1 : 0,
                    transition: 'opacity 0.5s',
                    filter: 'brightness(0.7) contrast(1.2)' // Dim physical reality specifically so holographic UI pops
                }}
            />

            {/* 3D Holographic Layer (Perfectly transparent background over the video) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {/* Notice 'alpha: true' ensures the WebGL canvas doesn't render a black skybox */}
                <Canvas gl={{ alpha: true }} camera={{ position: [0, 1.5, 5], fov: 60 }}>
                    {/* Lighting */}
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

                    {/* Camera Controls: Listen to iPhone 16 sensors if active, else fallback to mouse-drag on PC */}
                    {gyroActive ? (
                        <DeviceOrientationControls />
                    ) : (
                        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 + 0.1} />
                    )}

                    {/* Floor Grid (To visibly ground the AR Holograms) */}
                    <Grid 
                        position={[0, 0, 0]} 
                        args={[30, 30]} 
                        cellSize={1} 
                        cellThickness={2} 
                        cellColor="#38bdf8" 
                        sectionSize={5} 
                        sectionThickness={3} 
                        sectionColor="#52525b" 
                        fadeDistance={25} 
                        infiniteGrid 
                    />

                    {/* Example Center Virtual Object (To prove volumetric collision with the real world) */}
                    <Box position={[0, 0.5, 0]} args={[2, 1, 3]}>
                        <meshStandardMaterial color="#52525b" wireframe opacity={0.6} transparent />
                    </Box>
                    <Text position={[0, 1.2, 0]} fontSize={0.2} color="#bae6fd" anchorX="center" anchorY="middle">
                        [SYNTHETIC ANCHOR ORIGIN]
                    </Text>

                    {/* Render The Motion Check Participants exactly where they walked in physical space! */}
                    {participants.map(p => {
                        return (
                            <group key={p.id}>
                                {p.pathCoordinates.map((coord, i) => {
                                    const xPos = mapTo3D(coord.x);
                                    const zPos = mapTo3D(coord.y);
                                    const isObservation = coord.eventType === 'OBSERVATION';
                                    const isStop = coord.eventType === 'STOP';
                                    
                                    return (
                                        <mesh key={`${p.id}-${i}`} position={[xPos, isObservation ? 1.5 : (isStop ? 0.2 : 0.05), zPos]}>
                                            {isObservation ? (
                                                <>
                                                    <sphereGeometry args={[0.25, 16, 16]} />
                                                    <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1} />
                                                    {coord.notes && (
                                                        <Text position={[0, 0.5, 0]} fontSize={0.25} color="white" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
                                                            {coord.notes}
                                                        </Text>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <cylinderGeometry args={[isStop ? 0.3 : 0.1, isStop ? 0.3 : 0.1, isStop ? 0.4 : 0.1, 16]} />
                                                    <meshStandardMaterial color={isStop ? '#ef4444' : p.color} emissive={isStop ? '#ef4444' : p.color} emissiveIntensity={isStop ? 0.5 : 0} />
                                                </>
                                            )}
                                        </mesh>
                                    );
                                })}
                            </group>
                        );
                    })}
                </Canvas>
            </div>
            
            {/* AR Sensor BootHUD */}
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: 'white', background: 'rgba(15, 23, 42, 0.85)', padding: '1.2rem', borderRadius: '12px', zIndex: 10, border: '1px solid #38bdf8', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)' }}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cameraActive ? '#22c55e' : '#facc15', animation: 'pulse 2s infinite' }}></div>
                    {cameraActive ? 'AR SENSORS LOCKED' : 'AWAITING AR OPTICS...'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'monospace' }}>Point-Cloud Subsystem: ACTIVE</div>
                
                {!gyroActive && (
                    <button 
                        onClick={requestGyro}
                        style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'monospace', width: '100%', transition: 'all 0.2s', textTransform: 'uppercase' }}
                    >
                        INITIATE SENSOR LOCK (GYROSCOPE)
                    </button>
                )}
            </div>
        </div>
    );
}
