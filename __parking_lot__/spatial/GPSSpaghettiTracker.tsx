import { useState, useRef, useEffect, useCallback } from 'react';

// Haversine formula to calculate distance between two lat/lng coordinates in feet
function calculateDistanceFeet(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 20902231; // Radius of the Earth in feet
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

interface GPSPoint {
    lat: number;
    lng: number;
    x: number;
    y: number;
    timestamp: number;
}

import { useTranslation } from 'react-i18next';

export default function GPSSpaghettiTracker() {
    const { t } = useTranslation();
    const [isTracking, setIsTracking] = useState(false);
    const [points, setPoints] = useState<GPSPoint[]>([]);
    const [totalDistanceFeet, setTotalDistanceFeet] = useState(0);
    const [, setAnchorPoint] = useState<{ lat: number, lng: number } | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    // ROI Calculation State
    const [proposedDistance, setProposedDistance] = useState<number | ''>('');
    const [cyclesPerDay, setCyclesPerDay] = useState<number>(100);

    const watchIdRef = useRef<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Walking speed approximation (ft per minute)
    const WALKING_SPEED_FT_MIN = 275;

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
    }, []);

    const startTracking = () => {
        if (!navigator.geolocation) {
            setErrorMsg("Geolocation is not supported by your browser.");
            return;
        }

        setErrorMsg('');
        setPoints([]);
        setTotalDistanceFeet(0);
        setAnchorPoint(null);
        setIsTracking(true);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setAnchorPoint((prevAnchor) => {
                    const currentAnchor = prevAnchor || { lat: latitude, lng: longitude };

                    setPoints((prevPoints) => {
                        // Calculate relative X/Y. 
                        // 1 degree latitude ~ 364,000 feet
                        // 1 degree longitude ~ varies, but let approximated at cos(lat) * 364,000
                        const latDiff = latitude - currentAnchor.lat;
                        const lonDiff = longitude - currentAnchor.lng;

                        // Scale factor to map feet to canvas pixels (e.g., let's say 500x500 canvas, center is 250,250)
                        // Let 1 canvas unit = 1 foot.
                        const feetX = lonDiff * (Math.cos(currentAnchor.lat * Math.PI / 180) * 364000);
                        const feetY = -(latDiff * 364000); // Invert Y because canvas Y goes down

                        const newPoint: GPSPoint = {
                            lat: latitude,
                            lng: longitude,
                            x: 500 + feetX, // 500 is center of 1000x1000 canvas
                            y: 500 + feetY,
                            timestamp: position.timestamp
                        };

                        if (prevPoints.length > 0) {
                            const lastPt = prevPoints[prevPoints.length - 1];
                            const dist = calculateDistanceFeet(lastPt.lat, lastPt.lng, newPoint.lat, newPoint.lng);

                            // Only add if we've moved at least 2 feet to reduce GPS drift jitter
                            if (dist > 2) {
                                setTotalDistanceFeet(d => d + dist);
                                return [...prevPoints, newPoint];
                            }
                            return prevPoints;
                        }

                        return [newPoint];
                    });

                    return currentAnchor;
                });
            },
            (error) => {
                setErrorMsg(error.message);
                stopTracking();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    const dString = points.length > 0
        ? `M ${points[0].x},${points[0].y} ` + points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')
        : '';

    // Calculate ROI
    const timeCurrentCycleMin = totalDistanceFeet / WALKING_SPEED_FT_MIN;
    const distanceDiff = proposedDistance ? totalDistanceFeet - Number(proposedDistance) : 0;
    const timeSavedCycleMin = distanceDiff > 0 ? distanceDiff / WALKING_SPEED_FT_MIN : 0;
    const annualHoursSaved = (timeSavedCycleMin * cyclesPerDay * 250) / 60; // 250 working days

    const handleExport = () => {
        // Mock export logic for PDF/Image
        alert("Exporting GPS Tracker overlay and ROI metrics as PDF/Image...");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header controls */}
            <div style={{ padding: '1rem', background: 'var(--bg-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-headings)', fontWeight: '900' }}>
                        📡 {t('sim.gps.title')}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('sim.gps.subtitle')}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isTracking ? (
                        <button className="btn" style={{ background: 'var(--accent-danger)', color: 'white', border: 'none', fontWeight: '900', borderRadius: '0.5rem' }} onClick={stopTracking}>
                            {t('sim.gps.stop')}
                        </button>
                    ) : (
                        <button className="promo-pulse-btn" style={{ border: 'none', fontWeight: '900' }} onClick={startTracking}>
                            {t('sim.gps.start')}
                        </button>
                    )}
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', color: 'var(--accent-danger)', background: 'rgba(239, 68, 68, 0.1)', textAlign: 'center', fontWeight: 'bold' }}>
                    {errorMsg}
                </div>
            )}

            <div className="gps-tracker-container">
                {/* Left Panel: ROI Calculator */}
                <div className="gps-sidebar">
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '900' }}>{t('sim.gps.metrics')}</h4>

                    <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(249, 115, 22, 0.3)' }}>
                            {totalDistanceFeet.toFixed(1)}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>ft</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>{t('sim.gps.curDist')}</div>
                    </div>

                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '900' }}>{t('sim.gps.roiCalc')}</h4>

                    <div className="form-group">
                        <label>Proposed New Layout Distance (ft)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 50"
                            value={proposedDistance}
                            onChange={(e) => setProposedDistance(e.target.value ? Number(e.target.value) : '')}
                        />
                    </div>

                    <div className="form-group">
                        <label>Target Cycles Per Day</label>
                        <input
                            type="number"
                            className="input-field"
                            value={cyclesPerDay}
                            onChange={(e) => setCyclesPerDay(Number(e.target.value))}
                        />
                    </div>

                    <div style={{ marginTop: '1.5rem', marginBottom: '1rem', padding: '1rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Current Cycle Est. Time:</span>
                            <strong style={{ color: 'var(--text-main)' }}>{(timeCurrentCycleMin * 60).toFixed(0)} sec</strong>
                        </div>
                    </div>

                    {proposedDistance !== '' && Number(proposedDistance) < totalDistanceFeet && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.5rem' }}>
                            <div style={{ color: 'var(--accent-success)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Potential Savings</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Distance saved per cycle:</span>
                                <strong>{distanceDiff.toFixed(1)} ft</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Time saved per cycle:</span>
                                <strong>{(timeSavedCycleMin * 60).toFixed(0)} seconds</strong>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(16, 185, 129, 0.2)', margin: '0.5rem 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                <span>Annual Hours Saved:</span>
                                <strong style={{ color: 'var(--accent-success)' }}>{annualHoursSaved.toFixed(1)} hrs</strong>
                            </div>
                        </div>
                    )}

                    <button
                        className="promo-pulse-btn"
                        style={{ width: '100%', marginTop: '2rem', border: 'none' }}
                        onClick={handleExport}
                        disabled={points.length === 0}
                    >
                        📄 {t('sim.gps.export')}
                    </button>
                </div>

                {/* Right Panel: Canvas */}
                <div
                    style={{
                        flex: 1,
                        position: 'relative',
                        background: '#e5e7eb',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ background: '#0f172a' }}
                    >
                        {/* Grid Pattern Background */}
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <rect width="40" height="40" fill="none" />
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
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

                        {/* Live Current point */}
                        {points.length > 0 && isTracking && (
                            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="8" fill="var(--accent-danger)">
                                <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                        )}

                        {/* Static End point if stopped */}
                        {points.length > 1 && !isTracking && (
                            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="12" fill="var(--accent-danger)" />
                        )}
                    </svg>

                    {!isTracking && points.length === 0 && (
                        <div style={{ position: 'absolute', pointerEvents: 'none', color: '#9ca3af', padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.9)', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Ready for Tracking</h3>
                            <div>Stand at your starting location and press <strong>Start GPS Trace</strong>.</div>
                            <div style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Ensure location services are enabled.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
