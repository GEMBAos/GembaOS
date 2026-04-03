import { useState, useEffect, useRef } from 'react';

/**
 * A dead-reckoning engine that translates device accelerometer and compass data
 * into a continuous X, Y sequence, bypassing the need for GPS.
 */
export function useDeadReckoning() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [heading, setHeading] = useState(0); // 0 is North/Host Forward
    const [isMoving, setIsMoving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const posRef = useRef({ x: 0, y: 0 });
    const headingRef = useRef(0);
    const lastStepTimeRef = useRef(0);
    
    // Parameters for pedometer
    const STRIDE_LENGTH = 0.762; // roughly 2.5 feet / 0.76 meters
    const ACCEL_THRESHOLD = 1.2; // Acceleration variance to count as a step

    useEffect(() => {
        // Request Permissions (vital for iOS 13+)
        const requestPermissions = async () => {
            if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
                try {
                    const permissionState = await (DeviceMotionEvent as any).requestPermission();
                    if (permissionState !== 'granted') {
                        setError('Permission to access motion sensors was denied.');
                    }
                } catch (e) {
                    setError('Unable to request motion permission.');
                }
            }
        };

        requestPermissions();

        // Step Detection (Pedometer logic)
        const handleMotion = (event: DeviceMotionEvent) => {
            if (!event.accelerationIncludingGravity) return;
            const { x, y, z } = event.accelerationIncludingGravity;
            
            if (x === null || y === null || z === null) return;

            // Magnitude of 3D acceleration
            const magnitude = Math.sqrt(x*x + y*y + z*z);
            // Earth gravity is ~9.8. Anything over ~11 is dynamic acceleration (a step/bump)
            const dynamicAccel = Math.abs(magnitude - 9.8);

            if (dynamicAccel > ACCEL_THRESHOLD) {
                const now = Date.now();
                // Debounce steps to max 1 per 300ms
                if (now - lastStepTimeRef.current > 300) {
                    lastStepTimeRef.current = now;
                    setIsMoving(true);

                    // Calculate X/Y displacement given current heading
                    // Convert degrees to radians.
                    const rad = headingRef.current * (Math.PI / 180);
                    
                    // Simple trig for Top-Down 2D cartesian grid where 0 degrees is "Up/Y"
                    const dx = STRIDE_LENGTH * Math.sin(rad);
                    const dy = STRIDE_LENGTH * Math.cos(rad);

                    posRef.current = {
                        x: posRef.current.x + dx,
                        y: posRef.current.y + dy
                    };

                    setPosition({...posRef.current});
                    
                    setTimeout(() => setIsMoving(false), 200); // Visual toggle off
                }
            }
        };

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) {
                // alpha is the compass bearing (0-360)
                // Need to handle iOS (webkitCompassHeading) vs Android (alpha is relative vs absolute depending on standard)
                let compHeading = event.alpha;
                
                // Fallback for iOS true north
                if ((event as any).webkitCompassHeading !== undefined) {
                    compHeading = (event as any).webkitCompassHeading;
                } else {
                    // Alpha is typically counter-clockwise rotation, we invert it for bearing
                    compHeading = 360 - event.alpha;
                }
                
                headingRef.current = compHeading;
                setHeading(Math.round(compHeading));
            }
        };

        window.addEventListener('devicemotion', handleMotion);
        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('devicemotion', handleMotion);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const resetPosition = () => {
        posRef.current = { x: 0, y: 0 };
        setPosition({ x: 0, y: 0 });
    };

    return {
        position,
        heading,
        isMoving,
        error,
        resetPosition
    };
}
