import { useState } from 'react';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import { supabase } from '../../../lib/supabase';

interface KaizenSessionCreatorProps {
    onBack: () => void;
    onSessionCreated: (sessionId: string) => void;
}

export default function KaizenSessionCreator({ onBack, onSessionCreated }: KaizenSessionCreatorProps) {
    const [sessionName, setSessionName] = useState('');
    const [area, setArea] = useState('');
    const [targetTakt, setTargetTakt] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        if (!sessionName.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            let imageUrl = null;
            if (file) {
                const { data: sessionData } = await supabase.auth.getSession();
                const hostUserId = sessionData.session?.user?.id;
    
                if (hostUserId) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${hostUserId}/${Date.now()}_layout.${fileExt}`;
                    
                    const { error } = await supabase.storage
                        .from('jfi_uploads')
                        .upload(fileName, file, { cacheControl: '3600', upsert: false });
    
                    if (!error) {
                        const { data } = supabase.storage.from('jfi_uploads').getPublicUrl(fileName);
                        imageUrl = data.publicUrl;
                    } else {
                        console.warn("Upload failed, falling back to local object URL", error);
                        imageUrl = URL.createObjectURL(file);
                    }
                } else {
                    imageUrl = URL.createObjectURL(file);
                }
            }

            // Reusing MotionSessionV2 as the underlying Kaizen Session container for now
            // to maintain DB sync compliance while rapidly framing the UX.
            const session = ImprovementEngine.createItem<any>({
                type: 'MotionSessionV2',
                hostUserId: '', // will be populated by ImprovementEngine sync
                sessionName: sessionName.trim(),
                layoutImageUrl: imageUrl,
                calibrationScale: 1,
                calibrationUnit: 'none',
                status: 'ACTIVE',
                accessCode: Math.random().toString(36).substring(2, 8).toUpperCase()
            });

            if (session?.id) {
                // If the user provided a target takt, we could save it to the session notes or a generic metric.
                // For now, we just pass the session ID to the hub.
                onSessionCreated(session.id);
            }
        } catch (err) {
            console.error('Failed to create Kaizen Session:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-dark)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}>
                <button onClick={onBack} className="global-action-btn" style={{ background: 'transparent', border: 'none' }}>
                    ← Cancel
                </button>
                <h2 style={{ flex: 1, textAlign: 'center', margin: 0, fontFamily: 'var(--font-headings)', fontSize: '1.25rem', color: 'white' }}>
                    NEW KAIZEN SESSION
                </h2>
                <div style={{ width: '80px' }} /> {/* Spacer to balance header */}
            </div>

            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ background: 'var(--bg-panel)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                        <div className="input-group">
                            <label className="input-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>SESSION NAME *</label>
                            <input 
                                type="text" 
                                className="input-field-light" 
                                placeholder="e.g. Assembly Line 1 Balancing"
                                value={sessionName}
                                onChange={e => setSessionName(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="input-group" style={{ marginTop: '1.5rem' }}>
                            <label className="input-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>VALUE STREAM / AREA  (Optional)</label>
                            <input 
                                type="text" 
                                className="input-field-light" 
                                placeholder="e.g. Sub-Assembly Cell 4"
                                value={area}
                                onChange={e => setArea(e.target.value)}
                            />
                        </div>

                        <div className="input-group" style={{ marginTop: '1.5rem' }}>
                            <label className="input-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>TARGET TAKT TIME (Optional)</label>
                            <input 
                                type="number" 
                                className="input-field-light" 
                                placeholder="e.g. 60 seconds"
                                value={targetTakt}
                                onChange={e => setTargetTakt(e.target.value)}
                            />
                        </div>

                        <div className="input-group" style={{ marginTop: '1.5rem' }}>
                            <label className="input-label" style={{ color: 'var(--text-main)', fontWeight: 600 }}>TRACKING MAP / LAYOUT (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="input-field-light" 
                                style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)' }}
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleCreate}
                        disabled={!sessionName.trim() || isSubmitting}
                        style={{ 
                            padding: '1.25rem', 
                            fontSize: '1.15rem', 
                            borderRadius: '8px', 
                            background: sessionName.trim() ? '#F15A29' : 'rgba(255,255,255,0.1)',
                            color: sessionName.trim() ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                            border: 'none',
                            cursor: sessionName.trim() ? 'pointer' : 'not-allowed',
                            fontWeight: 800,
                            fontFamily: 'var(--font-headings)',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            transition: 'all 0.2s ease',
                            boxShadow: sessionName.trim() ? '0 4px 12px rgba(241, 90, 41, 0.3)' : 'none'
                        }}
                    >
                        {isSubmitting ? 'INITIALIZING...' : 'START SESSION'}
                    </button>
                    
                </div>
            </div>
        </div>
    );
}
