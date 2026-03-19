/**
 * Data architecture for Motion Mapping V2
 * Supports multi-device, host-led, layout-calibrated spaghetti mapping.
 */

import type { BaseEntity } from './improvement';

export type MotionSessionStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

export interface MotionSessionV2 extends BaseEntity {
    type: 'MotionSessionV2';
    hostUserId: string;         // The user who created the session
    sessionName: string;
    layoutImageUrl: string | null;  // URL to the background floor plan / canvas
    calibrationScale: number;   // Pixels per meter/foot. Default 1 for uncalibrated
    calibrationUnit: 'meter' | 'foot' | 'none';
    status: MotionSessionStatus;
    accessCode: string;         // Short code for QR/mobile join
}

export type PathNodeEvent = 'MOVE' | 'STOP' | 'FIELD_EXIT' | 'VALUE_ADD' | 'OBSERVATION';

export interface PathNodeV2 {
    x: number;                  // X coordinate relative to the layout image
    y: number;                  // Y coordinate relative to the layout image
    timestamp: number;          // Epoch MS
    eventType: PathNodeEvent;
    notes?: string;             // Optional observation note at this point
}

export interface MotionParticipantPathV2 extends BaseEntity {
    type: 'MotionParticipantPathV2';
    sessionId: string;          // Foreign key to MotionSessionV2
    participantName: string;    // E.g., "Operator 1" or "Material Handler"
    deviceId: string;           // Anonymous identifier for the tracking device
    pathCoordinates: PathNodeV2[];
    totalDistance: number;      // Calculated distance using session calibrationScale
    totalStops: number;
    color: string;              // HEX color assigned for combined map overlay
    joinedAt: string;
    lastActiveAt: string;
}

// A full snapshot used by the dashboard
export interface CombinedMotionMapOverlay {
    session: MotionSessionV2;
    participants: MotionParticipantPathV2[];
}
