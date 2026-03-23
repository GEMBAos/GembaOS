import { useState, useRef } from 'react';
import HardwareConsoleLayout from './HardwareConsoleLayout';
import { supabase } from '../../lib/supabase';
import { ImprovementEngine } from '../../services/ImprovementEngine';
import type { ProcessCheck as ProcessCheckType } from '../../types/improvement';

type WalkPhase = 'intro' | 'observe' | 'summary';

interface CapturedWaste {
    id: string;
    photoUrl: string;
    category: string;
    description: string;
}

interface ProcessCheckProps {
    onClose: () => void;
    onNavigate?: (tool: string) => void;
}

const WASTE_CATEGORIES = [
    "Defects", "Overproduction", "Waiting", "Non-utilized Talent",
    "Transportation", "Inventory", "Motion", "Extra-processing"
];

function mockAnalyzeWaste(): { category: string, description: string } {
    const isMotion = Math.random() > 0.5; // High chance of physical waste to encourage flow
    const category = isMotion ? "Motion" : WASTE_CATEGORIES[Math.floor(Math.random() * WASTE_CATEGORIES.length)];
    
    let description = "Detected inefficiencies in the current process.";
    if (category === "Motion") description = "Excessive reaching or walking detected without adding value to the patient/product.";
    if (category === "Transportation") description = "Unnecessary movement of materials or equipment identified in the frame.";
    if (category === "Waiting") description = "Idle time detected. Operator or machine is paused waiting for upstream process.";
    
    return { category, description };
}

export default function ProcessCheck({ onClose, onNavigate }: ProcessCheckProps) {
    const [phase, setPhase] = useState<WalkPhase>('intro');
    
    // Core State
    const [capturedWastes, setCapturedWastes] = useState<CapturedWaste[]>([]);
    const [operatorFeedback, setOperatorFeedback] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        let photoUrl = URL.createObjectURL(file);

        try {
            // Upload to Supabase 
            const fileName = `kaizen/${Date.now()}_waste.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('jfi_uploads').upload(fileName, file);
            if (!error) {
                const { data } = supabase.storage.from('jfi_uploads').getPublicUrl(fileName);
                photoUrl = data.publicUrl;
            }
        } catch (err) {
            console.error(err);
        }

        // Mock AI Analysis (1.5s delay for effect)
        setTimeout(() => {
            const analysis = mockAnalyzeWaste();
            const newWaste: CapturedWaste = {
                id: Math.random().toString(36).substr(2, 9),
                photoUrl,
                category: analysis.category,
                description: analysis.description
            };
            setCapturedWastes(prev => [newWaste, ...prev]);
            setIsAnalyzing(false);
        }, 1500);
    };

    const handleSaveAndConclude = () => {
        // Save the summary into the central ImprovementEngine history
        const wasteTypesFound = capturedWastes.map(w => w.category);
        const uniqueWastes = Array.from(new Set(wasteTypesFound));
        
        ImprovementEngine.createItem<ProcessCheckType>({
            type: 'ProcessCheck',
            motionSessionId: 'manual-gemba-walk', // Dummy bypass
            processName: 'Gemba Context Walk',
            operatorId: 'Various',
            findings: `Operator Feedback: ${operatorFeedback || 'None'}\nIdentified Wastes: ${uniqueWastes.join(', ')}`,
            wasteTypes: uniqueWastes,
            targetCycleTime: 0,
            actualCycleTime: 0
        });

        setPhase('summary');
    };

    const handleHandoff = (route: string) => {
        onClose();
        if (onNavigate) {
            setTimeout(() => onNavigate(route), 100);
        }
    };

    const hasMotionWaste = capturedWastes.some(w => w.category === 'Motion' || w.category === 'Transportation' || w.category === 'Waiting');

    return (
        <HardwareConsoleLayout 
            toolId="GEM-01 OBSERVE" 
            toolName="GEMBA & WASTE WALK" 
            onClose={onClose}
        >
            <div style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
                
                {/* Phase 1: Intro */}
                {phase === 'intro' && (
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--zone-yellow)', animation: 'fadeIn 0.3s ease-out' }}>
                        <h2 style={{ color: 'var(--zone-yellow)', marginBottom: '1.5rem', fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.25rem)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span>🚶</span> THE GUIDED GEMBA WALK
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            "Gemba" implies "the real place" where value is created. Standardize your floor walks to ensure you're looking for the right things and engaging the frontline effectively.
                        </p>
                        
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid var(--zone-yellow)' }}>
                            <h4 style={{ color: 'var(--lean-white)', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>The Rules of Observation</h4>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem', lineHeight: 1.5 }}>
                                <li>Go see, ask why, show respect.</li>
                                <li>Focus your observation on the <strong>process</strong>, not the people.</li>
                                <li>Do not try to fix problems immediately; document the friction first.</li>
                                <li>Listen more than you speak. Ask: "What is your biggest boulder today?"</li>
                            </ul>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setPhase('observe')}
                                style={{ padding: '1rem 2rem', background: 'var(--zone-yellow)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
                            >
                                START OBSERVATION →
                            </button>
                        </div>
                    </div>
                )}

                {/* Phase 2: Waste Walk / Capture */}
                {phase === 'observe' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        
                        <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', borderTop: '4px solid var(--lean-white)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h3 style={{ margin: 0, color: 'var(--lean-white)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📸</span> VISUAL WASTE CAPTURE
                                </h3>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isAnalyzing}
                                    style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isAnalyzing ? 'wait' : 'pointer', opacity: isAnalyzing ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    {isAnalyzing ? '🔄 ANALYZING...' : '📷 SCAN FRICTION'}
                                </button>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    capture="environment" 
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handlePhotoCapture}
                                />
                            </div>

                            {/* Captured Wastes List */}
                            {capturedWastes.length === 0 ? (
                                <div style={{ padding: '3rem 2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center', color: '#64748b', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📱</div>
                                    No friction points documented yet.<br/>Walk the process and snap photos of anything that disrupts flow.
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                    {capturedWastes.map(waste => (
                                        <div key={waste.id} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                                            <div style={{ width: '120px', minHeight: '120px', backgroundImage: `url(${waste.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <div style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: 'rgba(255,194,14,0.15)', color: 'var(--zone-yellow)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                                                    {waste.category} Waste
                                                </div>
                                                <div style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4 }}>
                                                    {waste.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px' }}>
                            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--lean-white)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>🗣️</span> OPERATOR ENGAGEMENT
                            </h3>
                            <textarea
                                value={operatorFeedback}
                                onChange={(e) => setOperatorFeedback(e.target.value)}
                                placeholder="What did the operator say is their biggest boulder today?"
                                style={{ width: '100%', minHeight: '100px', padding: '1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1.5rem' }}
                            />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                <button onClick={() => setPhase('intro')} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
                                <button 
                                    onClick={handleSaveAndConclude}
                                    disabled={capturedWastes.length === 0 && operatorFeedback.trim() === ''}
                                    style={{ padding: '0.75rem 2rem', background: 'var(--zone-yellow)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (capturedWastes.length === 0 && operatorFeedback.trim() === '') ? 'not-allowed' : 'pointer', opacity: (capturedWastes.length === 0 && operatorFeedback.trim() === '') ? 0.5 : 1 }}
                                >
                                    CONCLUDE WALK & SUMMARIZE →
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* Phase 3: Summary / Handoff */}
                {phase === 'summary' && (
                    <div className="card" style={{ background: 'var(--bg-panel)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--zone-yellow)', animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h2 style={{ color: 'var(--zone-yellow)', margin: 0, fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', letterSpacing: '1px' }}>OBSERVATION LOGGED</h2>
                            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Captured {capturedWastes.length} visual friction points.</p>
                        </div>
                        
                        {/* Dynamic Handoff Recommendation */}
                        {hasMotionWaste && (
                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏃‍♂️</div>
                                <h3 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Inefficient Physical Layout Detected</h3>
                                <p style={{ color: '#e2e8f0', margin: '0 0 1.5rem 0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    The AI identified Motion or Transportation waste in your captured photos. To fix this, you need to track the operator's actual physical pathing around the workspace.
                                </p>
                                <button 
                                    onClick={() => handleHandoff('motion-v2')}
                                    style={{ padding: '1rem 2rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
                                >
                                    START MOTION MAPPING FLOW
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <button onClick={() => handleHandoff('time-study')} className="shadow-btn" style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.1)', padding: '1.5rem', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏱️</div>
                                <div style={{ fontWeight: 'bold', color: 'var(--lean-white)' }}>Record Cycle Time</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Measure against Takt</div>
                            </button>
                            <button onClick={() => handleHandoff('improvement-card')} className="shadow-btn" style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.1)', padding: '1.5rem', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
                                <div style={{ fontWeight: 'bold', color: 'var(--lean-white)' }}>Create Countermeasure</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Jump to Improvement Card</div>
                            </button>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}>
                                Return to Tool Menu
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </HardwareConsoleLayout>
    );
}
