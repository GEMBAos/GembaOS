import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2 } from '../../../types/motion_v2';

interface Props {
    onCreated: (sessionId: string, needsCalibration: boolean) => void;
    onCancel: () => void;
}

export default function MotionSessionCreator({ onCreated, onCancel }: Props) {
    const [sessionName, setSessionName] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleCreate = async () => {
        if (!sessionName.trim()) return;

        setUploading(true);

        const { data: sData } = await supabase.auth.getSession();
        const hostId = sData.session?.user?.id || 'guest';
        
        const newSession = ImprovementEngine.createItem<MotionSessionV2>({
            type: 'MotionSessionV2',
            hostUserId: hostId,
            sessionName,
            layoutImageUrl: null,
            calibrationScale: 1, // Default
            calibrationUnit: 'none',
            status: 'DRAFT',
            accessCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        });

        setUploading(false);
        onCreated(newSession.id, false);
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', border: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--lean-white)', fontFamily: 'var(--font-headings)' }}>CREATE TRACKING SESSION</h3>
            
            <div className="input-group">
                <label className="input-label">Session / Area Name</label>
                <input 
                    type="text" 
                    className="input-field" 
                    value={sessionName} 
                    onChange={e => setSessionName(e.target.value)} 
                    placeholder="e.g. Assembly Line 4" 
                    autoFocus
                />
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>📡</div>
                    <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--zone-yellow)' }}>Proximity Dead-Reckoning</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            No floorplan needed. Participants will scan your session code, stand next to you, and their movements will be tracked relative to your position using their device sensors.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button className="btn" onClick={onCancel} style={{ flex: 1 }} disabled={uploading}>Cancel</button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleCreate} 
                    disabled={!sessionName.trim() || uploading}
                    style={{ flex: 2, background: 'var(--zone-yellow)', color: 'var(--gemba-black)', fontWeight: 800, border: 'none' }}
                >
                    {uploading ? 'CREATING...' : 'LAUNCH SESSION'}
                </button>
            </div>
        </div>
    );
}
