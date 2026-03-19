import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ImprovementEngine } from '../services/ImprovementEngine';
import type { MotionParticipantPathV2, PathNodeV2 } from '../types/motion_v2';

export function useMotionRealtime(sessionId: string, role: 'HOST' | 'PARTICIPANT', localParticipant: MotionParticipantPathV2 | null) {
    const [participantsMap, setParticipantsMap] = useState<Record<string, MotionParticipantPathV2>>({});
    const channelRef = useRef<any>(null);
    const localRef = useRef(localParticipant);
    
    // Keep ref in sync without triggering effects
    localRef.current = localParticipant;

    useEffect(() => {
        if (!sessionId) return;
        
        let isMounted = true;

        // 1. Authoritative Database Recovery
        const loadInitialState = async () => {
            console.log(`[useMotionRealtime] Hydrating paths for session ID: ${sessionId}`);
            const { data, error } = await supabase
                .from('motion_paths_v2')
                .select('*')
                .eq('session_id', String(sessionId));
                
            if (error) {
                console.error(`[useMotionRealtime] Supabase Error fetching paths:`, error);
            }

            if (!error && data && isMounted) {
                console.log(`[useMotionRealtime] Hydrated ${data.length} paths from DB for session ${sessionId}`);
                if (data.length === 0) {
                    console.warn(`[useMotionRealtime] No existing paths found for session. Waiting for realtime broadcasts.`);
                }
                const loadedMap: Record<string, MotionParticipantPathV2> = {};
                data.forEach((row: any) => {
                    loadedMap[row.id] = {
                        id: row.id,
                        type: 'MotionParticipantPathV2',
                        sessionId: row.session_id,
                        deviceId: row.participant_id,
                        participantName: row.participant_name,
                        color: row.color,
                        pathCoordinates: row.path_points_json,
                        totalDistance: row.total_distance,
                        totalStops: row.total_stops,
                        joinedAt: row.joined_at,
                        lastActiveAt: row.last_active_at,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    };
                });
                
                // Merge cleanly to not overwrite any broadcasts that beat the DB query
                setParticipantsMap(prev => ({ ...loadedMap, ...prev }));
            }
        };

        if (sessionId) {
            loadInitialState();
        } else {
            console.error('[useMotionRealtime] Critical: hook initialized without a valid sessionId');
        }

        // 2. Realtime Broadcast Subscriptions
        const channel = supabase.channel(`motion_session_${sessionId}`);

        channel
            .on('broadcast', { event: 'FULL_STATE' }, (payload) => {
                if (payload.payload.participant) {
                    const p = payload.payload.participant;
                    setParticipantsMap(prev => ({
                        ...prev,
                        [p.id]: p
                    }));
                    if (role === 'HOST') {
                        ImprovementEngine.saveImportedItem(p);
                    }
                }
            })
            .on('broadcast', { event: 'PATH_UPDATE' }, (payload) => {
                // Both Host and other participants can see updates if needed, but primarily for Host
                const { participantId, pathCoordinates, totalDistance, lastActiveAt } = payload.payload;
                setParticipantsMap(prev => {
                    const existing = prev[participantId];
                    if (!existing) {
                        // If we receive an update for a participant we don't know, request full state
                        if (channelRef.current) {
                            channelRef.current.send({
                                type: 'broadcast',
                                event: 'REQUEST_FULL_STATE',
                                payload: {}
                            });
                        }
                        return prev;
                    }
                    const updated: MotionParticipantPathV2 = {
                        ...existing,
                        id: existing?.id || `path_${participantId}_${Date.now()}`,
                        type: 'MotionParticipantPathV2',
                        sessionId,
                        deviceId: participantId,
                        participantName: existing?.participantName || `Device ${participantId.substring(0, 4)}`,
                        color: existing?.color || '#8B5CF6',
                        joinedAt: existing?.joinedAt || new Date().toISOString(),
                        totalStops: existing?.totalStops || 0,
                        createdAt: existing?.createdAt || new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        pathCoordinates,
                        totalDistance,
                        lastActiveAt
                    };
                    if (role === 'HOST') {
                        ImprovementEngine.saveImportedItem(updated);
                    }
                    return {
                        ...prev,
                        [participantId]: updated
                    };
                });
            })
            .on('broadcast', { event: 'REQUEST_FULL_STATE' }, async () => {
                if (role === 'PARTICIPANT' && localRef.current && channelRef.current) {
                    await channelRef.current.send({
                        type: 'broadcast',
                        event: 'FULL_STATE',
                        payload: { participant: localRef.current }
                    });
                }
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Send initial handshakes
                    if (role === 'PARTICIPANT' && localRef.current) {
                        await channel.send({
                            type: 'broadcast',
                            event: 'FULL_STATE',
                            payload: { participant: localRef.current }
                        });
                    } else if (role === 'HOST') {
                        // Host asks everyone to announce themselves
                        await channel.send({
                            type: 'broadcast',
                            event: 'REQUEST_FULL_STATE',
                            payload: {}
                        });
                    }
                }
            });

        channelRef.current = channel;

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [sessionId, role]);

    const broadcastPathUpdate = async (participantId: string, pathCoordinates: PathNodeV2[], totalDistance: number) => {
        if (channelRef.current && role === 'PARTICIPANT') {
            await channelRef.current.send({
                type: 'broadcast',
                event: 'PATH_UPDATE',
                payload: {
                    participantId,
                    pathCoordinates,
                    totalDistance,
                    lastActiveAt: new Date().toISOString()
                }
            });
        }
    };

    return {
        participants: Object.values(participantsMap),
        broadcastPathUpdate
    };
}
