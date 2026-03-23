import type { ToolInstruction } from '../../data/toolInstructions';

interface ToolGuideOverlayProps {
    instruction: ToolInstruction;
    onClose: () => void;
}

export default function ToolGuideOverlay({ instruction, onClose }: ToolGuideOverlayProps) {
    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 6, 8, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: '#0a0b0e',
                border: '2px solid var(--zone-yellow)',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,194,14,0.3)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideUpFade 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ 
                            fontSize: '2.5rem', 
                            background: 'rgba(255,194,14,0.1)', 
                            width: '64px', height: '64px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            borderRadius: '12px',
                            border: '1px solid rgba(255,194,14,0.3)'
                        }}>
                            {instruction.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--zone-yellow)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                WORK INSTRUCTION
                            </div>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                                {instruction.title}
                            </h2>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: '#94a3b8',
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '2rem' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
                        {instruction.description}
                    </p>

                    <h3 style={{ color: 'white', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        Operating Protocol
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {instruction.steps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ 
                                    background: 'var(--bg-panel)', 
                                    color: 'var(--zone-yellow)', 
                                    minWidth: '28px', height: '28px', 
                                    borderRadius: '50%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '0.85rem',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {idx + 1}
                                </div>
                                <div style={{ paddingTop: '4px' }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'white', fontSize: '1rem', fontWeight: 600 }}>{step.title}</h4>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                        {step.detail}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Footer */}
                <div style={{ padding: '1.5rem 2rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        onClick={onClose}
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 2rem', fontWeight: 800, letterSpacing: '1px' }}
                    >
                        ACKNOWLEDGE
                    </button>
                </div>
            </div>
        </div>
    );
}
