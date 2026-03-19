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
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleCreate = async () => {
        if (!sessionName.trim()) return;

        setUploading(true);
        let imageUrl = null;

        if (file) {
            // Upload to Supabase if logged in, otherwise local blob
            const { data: sessionData } = await supabase.auth.getSession();
            const hostUserId = sessionData.session?.user?.id;

            if (hostUserId) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${hostUserId}/${Date.now()}_layout.${fileExt}`;
                
                const { error } = await supabase.storage
                    .from('jfi_uploads') // Reusing for simplicity, or we could create 'layouts'
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (!error) {
                    const { data } = supabase.storage.from('jfi_uploads').getPublicUrl(fileName);
                    imageUrl = data.publicUrl;
                } else {
                    console.warn("Layout upload failed, falling back to local object URL", error);
                    imageUrl = URL.createObjectURL(file);
                }
            } else {
                imageUrl = URL.createObjectURL(file);
            }
        }

        const { data: sData } = await supabase.auth.getSession();
        const hostId = sData.session?.user?.id || 'guest';
        
        const newSession = ImprovementEngine.createItem<MotionSessionV2>({
            type: 'MotionSessionV2',
            hostUserId: hostId,
            sessionName,
            layoutImageUrl: imageUrl,
            calibrationScale: 1, // Default, will calibrate next
            calibrationUnit: 'none',
            status: 'DRAFT',
            accessCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        });

        setUploading(false);
        onCreated(newSession.id, !!imageUrl);
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Create Tracking Session</h3>
            
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

            <div className="input-group" style={{ marginTop: '1.5rem' }}>
                <label className="input-label">Layout Image (Optional)</label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Upload a floor plan or top-down photo to serve as the tracking map.
                </p>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                    style={{ color: 'var(--text-main)' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button className="btn" onClick={onCancel} style={{ flex: 1 }} disabled={uploading}>Cancel</button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleCreate} 
                    disabled={!sessionName.trim() || uploading}
                    style={{ flex: 2 }}
                >
                    {uploading ? 'Creating...' : 'Continue'}
                </button>
            </div>
        </div>
    );
}
