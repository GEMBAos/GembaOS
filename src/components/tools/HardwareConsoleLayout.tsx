/**
 * ARCHIVE NOTICE
 * Original Use: Previous responsive framework structure.
 * Moved to: legacy_ui
 */

import React, { useState } from 'react';
import ToolGuideOverlay from './ToolGuideOverlay';
import { TOOL_INSTRUCTIONS } from '../../data/toolInstructions';

interface HardwareConsoleLayoutProps {
    toolId: string;
    toolName: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function HardwareConsoleLayout({ toolId, toolName, onClose, children }: HardwareConsoleLayoutProps) {
    const instruction = TOOL_INSTRUCTIONS[toolName];
    
    // Auto-show the guide if this is the first time the user has opened this specific tool
    const [showGuide, setShowGuide] = useState(() => {
        if (!instruction) return false;
        const hasSeen = localStorage.getItem(`gemba_seen_guide_${toolId}`);
        return !hasSeen;
    });

    const handleAcknowledgeGuide = () => {
        localStorage.setItem(`gemba_seen_guide_${toolId}`, 'true');
        setShowGuide(false);
    };

    return (
        <div className="gemba-floor" style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: 1,
            width: '100%'
        }}>
            {/* Embedded Inline Header Plate */}
            <div style={{
                color: 'var(--gemba-black)',
                padding: '0 0 clamp(1rem, 2vw, 1.5rem) 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ height: '24px', width: '24px', borderTop: '4px solid var(--gemba-black)', borderLeft: '4px solid var(--gemba-black)' }}></div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-headings)', letterSpacing: '2px', fontWeight: 800 }}>MODULE {toolId}</div>
                        <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', color: 'var(--gemba-black)', fontFamily: 'var(--font-headings)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {toolName}
                            {instruction && (
                                <button 
                                    onClick={() => setShowGuide(true)}
                                    title={`View Instructions for ${toolName}`}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--text-muted)',
                                        color: 'var(--text-muted)',
                                        width: '24px', height: '24px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        marginLeft: '0.5rem'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--text-muted)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                >
                                    ℹ
                                </button>
                            )}
                        </h2>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="shadow-btn"
                    style={{ padding: '0.5rem clamp(0.5rem, 2vw, 1rem)', borderColor: 'var(--border-color)', borderRadius: '4px', flexDirection: 'row', gap: '0.5rem', background: 'transparent' }}
                >
                    <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>✕</span> <span className="hide-on-mobile" style={{ color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 'bold' }}>CLOSE</span> 
                </button>
            </div>

            {/* Scrollable interior */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '0', // Removed duplicate padding since parent workspace handles it
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
                    {children}
                </div>
            </div>

            {showGuide && instruction && (
                <ToolGuideOverlay instruction={instruction} onClose={handleAcknowledgeGuide} />
            )}
        </div>
    );
}
