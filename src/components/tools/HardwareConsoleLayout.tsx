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
            width: '100vw',
            height: '100dvh'
        }}>
            {/* Header Plate */}
            <div style={{
                background: 'var(--gemba-black)',
                color: 'var(--lean-white)',
                borderBottom: '2px solid #000',
                padding: 'clamp(0.5rem, 2vh, 1rem) clamp(1rem, 3vw, 2rem)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ height: '24px', width: '24px', borderTop: '4px solid var(--zone-yellow)', borderLeft: '4px solid var(--zone-yellow)' }}></div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--zone-yellow)', fontFamily: 'var(--font-headings)', letterSpacing: '2px', fontWeight: 800 }}>MODULE {toolId}</div>
                        <h2 style={{ margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontFamily: 'var(--font-headings)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {toolName}
                            {instruction && (
                                <button 
                                    onClick={() => setShowGuide(true)}
                                    title={`View Instructions for ${toolName}`}
                                    style={{
                                        background: 'rgba(255,194,14,0.1)',
                                        border: '1px solid rgba(255,194,14,0.3)',
                                        color: 'var(--zone-yellow)',
                                        width: '24px', height: '24px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        marginLeft: '0.5rem'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--zone-yellow)'; e.currentTarget.style.color = '#000'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,194,14,0.1)'; e.currentTarget.style.color = 'var(--zone-yellow)'; }}
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
                    style={{ padding: '0.5rem clamp(0.5rem, 2vw, 1rem)', borderColor: 'transparent', flexDirection: 'row', gap: '0.5rem', background: 'transparent' }}
                >
                    <span style={{ color: 'var(--zone-yellow)', fontSize: '1.2rem' }}>⏏</span> <span className="hide-on-mobile">EJECT</span> 
                </button>
            </div>

            {/* Scrollable interior */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 'clamp(1rem, 3vw, 2rem)',
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
