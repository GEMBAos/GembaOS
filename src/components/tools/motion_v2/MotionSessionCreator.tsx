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
    const [mapType, setMapType] = useState<'upload' | 'blank'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleCreate = async () => {
        if (!sessionName.trim()) return;

        setUploading(true);
        let imageUrl = null;

        if (mapType === 'upload' && file) {
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

            <div className="input-group" style={{ marginTop: '2rem' }}>
                <label className="input-label">Map Source</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <div 
                        onClick={() => setMapType('upload')}
                        style={{ 
                            flex: 1, 
                            border: mapType === 'upload' ? '2px solid var(--zone-yellow)' : '2px solid var(--border-color)', 
                            background: mapType === 'upload' ? 'rgba(255,194,14,0.1)' : 'var(--bg-dark)', 
                            padding: '1.5rem', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            textAlign: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
                        <div style={{ fontWeight: 800, color: mapType === 'upload' ? 'var(--zone-yellow)' : 'var(--text-muted)' }}>UPLOAD LAYOUT</div>
                    </div>
                    <div 
                        onClick={() => { setMapType('blank'); setFile(null); }}
                        style={{ 
                            flex: 1, 
                            border: mapType === 'blank' ? '2px solid var(--zone-yellow)' : '2px solid var(--border-color)', 
                            background: mapType === 'blank' ? 'rgba(255,194,14,0.1)' : 'var(--bg-dark)', 
                            padding: '1.5rem', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            textAlign: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📏</div>
                        <div style={{ fontWeight: 800, color: mapType === 'blank' ? 'var(--zone-yellow)' : 'var(--text-muted)' }}>BLANK CANVAS</div>
                    </div>
                </div>
            </div>

            {mapType === 'upload' && (
                <div className="input-group" style={{ marginTop: '1.5rem', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Upload a floor plan, top-down photo, or blueprint to serve as the tracking map.
                    </p>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                        style={{ color: 'var(--text-main)', width: '100%', padding: '0.5rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                    />
                </div>
            )}
            
            {mapType === 'blank' && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        A standard grid will be generated. You can draw crude lines or map features directly on the canvas once the session starts.
                    </p>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button className="btn" onClick={onCancel} style={{ flex: 1 }} disabled={uploading}>Cancel</button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleCreate} 
                    disabled={!sessionName.trim() || uploading || (mapType === 'upload' && !file)}
                    style={{ flex: 2, background: 'var(--zone-yellow)', color: 'var(--gemba-black)', fontWeight: 800, border: 'none' }}
                >
                    {uploading ? 'CREATING...' : 'LAUNCH SESSION'}
                </button>
            </div>
        </div>
    );
}
