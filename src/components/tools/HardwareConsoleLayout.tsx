/**
 * ARCHIVE NOTICE
 * Original Use: Previous responsive framework structure.
 * Moved to: legacy_ui
 */

import React from 'react';

interface HardwareConsoleLayoutProps {
    toolId: string;
    toolName: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function HardwareConsoleLayout({ toolId, toolName, onClose, children }: HardwareConsoleLayoutProps) {
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
                padding: '1rem 2rem',
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
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase', letterSpacing: '1px' }}>{toolName}</h2>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="shadow-btn"
                    style={{ padding: '0.5rem 1rem', borderColor: 'transparent', flexDirection: 'row', gap: '0.5rem', background: 'transparent' }}
                >
                    <span style={{ color: 'var(--zone-yellow)', fontSize: '1.2rem' }}>⏏</span> EJECT 
                </button>
            </div>

            {/* Scrollable interior */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                padding: 'clamp(1rem, 3vw, 2rem)',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '4rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
