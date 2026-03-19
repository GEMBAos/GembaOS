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
        <div className="hardware-module-overlay" style={{
            fontFamily: '"Inter", sans-serif',
            background: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #09090b 100%)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100vw',
            height: '100dvh'
        }}>
            {/* HARDWARE BEZEL SHELL */}
            <div style={{
                position: 'absolute',
                inset: 'clamp(0.2rem, 1vw, 0.5rem)', // Responsive physical lip
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.5) 100%)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
                zIndex: 10
            }}>
                {/* Mechanical Screws */}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: '12px', height: '12px', borderRadius: '50%', background: 'radial-gradient(circle, #333 30%, #111 100%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '12px', height: '12px', borderRadius: '50%', background: 'radial-gradient(circle, #333 30%, #111 100%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', width: '12px', height: '12px', borderRadius: '50%', background: 'radial-gradient(circle, #333 30%, #111 100%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '12px', height: '12px', borderRadius: '50%', background: 'radial-gradient(circle, #333 30%, #111 100%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)' }} />
                
                {/* Etched Component ID (Vertical on large screens, hidden on very small) */}
                <div className="etched-component-id">
                    {toolId}
                </div>
            </div>

            {/* SCROLLABLE INTERIOR CONTENT (The Control Panel internals) */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                padding: 'clamp(2rem, 5vh, 4rem) clamp(1rem, 3vw, 2rem)', // Scalable padding to clear bezels safely
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ 
                    maxWidth: '1400px', 
                    width: '100%', 
                    margin: '0 auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'clamp(1rem, 3vh, 2rem)', // Scalable gaps between console blocks
                    paddingBottom: 'clamp(5rem, 10vh, 8rem)' // Bottom clearance for scrolling past mobile action bars
                }}>
                    
                    {/* TOP ENGRAVED PLATE HEADER */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(10, 11, 14, 0.6)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderBottom: '2px solid rgba(255,255,255,0.1)',
                        padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem)', 
                        borderRadius: '8px',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                        flexWrap: 'wrap', 
                        gap: '1rem' 
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <div style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)', color: '#64748b', fontFamily: "'Orbitron', sans-serif", letterSpacing: '3px', textTransform: 'uppercase' }}>
                                GembaOS Control Module
                            </div>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, color: '#f8fafc', fontSize: 'clamp(1rem, 3vw, 1.8rem)', fontFamily: "'Orbitron', sans-serif", fontWeight: '700', letterSpacing: '2px' }}>
                                <span style={{ filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))' }}>⭕</span> 
                                {toolName}
                            </h2>
                        </div>

                        <button 
                            onClick={onClose} 
                            style={{ 
                                background: 'linear-gradient(180deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.05) 100%)', 
                                border: '1px solid rgba(239,68,68,0.3)', 
                                color: '#fca5a5', 
                                padding: 'clamp(0.4rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1.25rem)', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: '700',
                                fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
                                fontFamily: "'Orbitron', sans-serif",
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(180deg, rgba(239,68,68,0.2) 0%, rgba(220,38,38,0.1) 100%)';
                                e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(239,68,68,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(180deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.05) 100%)';
                                e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.05)';
                            }}
                        >
                            <span style={{ fontSize: '1rem', lineHeight: 1 }}>⏏</span> EJECT
                        </button>
                    </div>

                    {/* DYNAMIC TOOL CONTENT INJECTION */}
                    {children}

                </div>
            </div>
        </div>
    );
}
