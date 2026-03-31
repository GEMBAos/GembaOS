import { useState, useEffect, useRef } from 'react';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2, MotionParticipantPathV2 } from '../../../types/motion_v2';
import { supabase } from '../../../lib/supabase';

interface Props {
    sessionId: string;
    onJoined: (participantId: string, trueSessionId: string) => void;
}

export default function MotionParticipantJoin({ sessionId, onJoined }: Props) {
    const [session, setSession] = useState<MotionSessionV2 | null>(ImprovementEngine.getItem<MotionSessionV2>(sessionId));
    const [name] = useState('');
    const [fetchError, setFetchError] = useState(false);
    const joinAttemptedRef = useRef(false);

    useEffect(() => {
        if (!session && !fetchError) {
            const fetchSession = async () => {
                const { data, error } = await supabase.from('motion_sessions_v2')
                    .select('*')
                    .or(`id.eq.${sessionId},access_code.eq.${sessionId}`)
                    .single();
                if (error || !data) {
                    console.error("Failed to load session:", error);
                    setFetchError(true);
                    return;
                }
                const loadedSession: MotionSessionV2 = {
                    id: data.id,
                    type: 'MotionSessionV2',
                    hostUserId: data.host_user_id,
                    sessionName: data.session_name,
                    layoutImageUrl: data.layout_image_url,
                    calibrationScale: data.calibration_scale,
                    calibrationUnit: data.calibration_unit,
                    status: data.status,
                    accessCode: data.access_code,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at
                };
                ImprovementEngine.saveImportedItem(loadedSession);
                localStorage.setItem('motion_session_v2_guest_session_id', loadedSession.id);
                setSession(loadedSession);
            };
            fetchSession();
        }
    }, [sessionId, session, fetchError]);

    useEffect(() => {
        if (!session) return;
        
        // PRIORITY 8: QR ENTRY (NO FRICTION)
        // Auto-join the session if a name is provided, or auto-generate one
        const attemptAutoJoin = async () => {
            if (joinAttemptedRef.current) return;
            joinAttemptedRef.current = true;

            const { data } = await supabase.auth.getSession();
            const deviceId = data.session?.user?.id || `anon_${Math.random().toString(36).substring(2, 9)}`;
            
            // PRIORITY 6: FAILURE HARDENING - Prevent duplicate user creation on refresh
            const savedParticipantId = localStorage.getItem(`motion_v2_participant_${session.id}`);
            if (savedParticipantId) {
                let existing = ImprovementEngine.getItem<MotionParticipantPathV2>(savedParticipantId);
                
                if (!existing) {
                    const { data: pData } = await supabase.from('motion_paths_v2').select('*').eq('id', savedParticipantId).single();
                    if (pData) {
                        existing = {
                            id: pData.id,
                            type: 'MotionParticipantPathV2',
                            sessionId: pData.session_id,
                            deviceId: pData.participant_id,
                            participantName: pData.participant_name,
                            color: pData.color,
                            pathCoordinates: pData.path_points_json,
                            totalDistance: pData.total_distance,
                            totalStops: pData.total_stops,
                            joinedAt: pData.joined_at,
                            lastActiveAt: pData.last_active_at,
                            createdAt: pData.created_at,
                            updatedAt: pData.updated_at
                        };
                        ImprovementEngine.saveImportedItem(existing);
                    }
                }

                if (existing) {
                    onJoined(existing.id, session.id);
                    return;
                }
            }
            
            // Fetch profile to see if they have a real name
            let defaultName = 'Operator';
            if (data.session?.user?.id) {
                const { data: profile } = await supabase.from('profiles').select('username').eq('id', data.session.user.id).single();
                if (profile?.username) defaultName = profile.username;
            } else {
                defaultName = `Guest_${deviceId.substring(5,9)}`;
            }

            const finalName = name.trim() || defaultName;

            const colors = ['#71717a', '#E65100', '#FF8F00', '#D84315', '#FF5722', '#FFB300'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const participantId = `path_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
            
            const participant: MotionParticipantPathV2 = {
                id: participantId,
                type: 'MotionParticipantPathV2',
                sessionId: session.id,
                participantName: finalName,
                deviceId,
                pathCoordinates: [],
                totalDistance: 0,
                totalStops: 0,
                color,
                joinedAt: new Date().toISOString(),
                lastActiveAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            ImprovementEngine.saveImportedItem(participant);
            ImprovementEngine.syncFromCloud();
            
            localStorage.setItem(`motion_v2_participant_${session.id}`, participant.id);

            onJoined(participant.id, session.id);
        };

        // Fire auto-join immediately on mount or when session loads
        attemptAutoJoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    if (fetchError) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)' }}>
                Session not found or has been closed.
            </div>
        );
    }

    if (!session) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ margin: '0 auto 1.5rem auto', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--zone-yellow)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
                Loading session...
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-dark)' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid var(--zone-yellow)', boxShadow: '0 0 20px rgba(255, 194, 14, 0.1)', background: 'var(--bg-panel)' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 1.5rem auto', border: '4px solid rgba(255,194,14,0.1)', borderTop: '4px solid var(--zone-yellow)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
                    <h2 style={{ margin: 0, color: 'var(--text-main)', fontFamily: 'var(--font-headings)', textTransform: 'uppercase', letterSpacing: '2px' }}>Connecting</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Joining {session.sessionName}...</p>
                </div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}
