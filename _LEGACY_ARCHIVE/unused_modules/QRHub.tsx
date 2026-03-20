/**
 * ARCHIVE NOTICE
 * Original Use: Used for QR code routing and location interactions.
 * Moved to: unused_modules
 */

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRHubProps {
    onClose: () => void;
}

export default function QRHub({ onClose }: QRHubProps) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gembaos.com';
    const [locationZone, setLocationZone] = useState('');
    const zoneParam = locationZone.trim() ? `&zone=${encodeURIComponent(locationZone.trim())}` : '';
    
    const qrCodes = [
        {
            title: "Guest Entry / Today's Challenge",
            description: "Scan to bypass login and immediately land on the Daily Gemba Challenge. Perfect for shop floor operators.",
            url: `${origin}/?flow=guest_challenge${zoneParam}`,
            icon: "🎯"
        },
        {
            title: "Feature: 5S Audit",
            description: "Direct link to start a new 5S Audit.",
            url: `${origin}/?flow=audit${zoneParam}`,
            icon: "🎴"
        },
        {
            title: "Feature: JFI Idea Generator",
            description: "Direct link to submit a Just Fix It idea.",
            url: `${origin}/?flow=jfi${zoneParam}`,
            icon: "💡"
        },
        {
            title: "Full Portal Registration",
            description: "Direct link to create a new user profile.",
            url: `${origin}/?flow=register${zoneParam}`,
            icon: "👤"
        }
    ];

    return (
        <div className="process-map-bg" style={{ minHeight: '100%', padding: 'max(1.5rem, 3vw)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '2rem' }}>🖨️</span> QR Command Hub
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            Print this page and place these access codes on the Gemba floor for frictionless engagement.
                        </p>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        ← Back to Admin
                    </button>
                </header>

                <div className="qr-print-action" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'rgba(14, 165, 233, 0.1)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--accent-primary)', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Location Zone (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Assembly Line 1, Paint Shop..."
                            value={locationZone}
                            onChange={(e) => setLocationZone(e.target.value)}
                            className="input-field"
                            style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--accent-primary)' }}
                        />
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Typing a zone automatically updates the QR codes. When scanned, tools like JFI will pre-fill this location.
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1px solid rgba(14, 165, 233, 0.3)', paddingLeft: '1rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
                        <div>
                            <strong style={{ color: 'var(--accent-primary)', display: 'block' }}>Print Mode Optimized</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hit Ctrl+P to print. Background styling will be stripped.</span>
                        </div>
                        <button 
                            onClick={() => window.print()}
                            className="btn btn-primary"
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            🖨️ Print Hub
                        </button>
                    </div>
                </div>

                <div className="qr-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '2rem',
                    marginTop: '1rem'
                }}>
                    {qrCodes.map((code, idx) => (
                        <div key={idx} className="qr-card" style={{
                            background: 'var(--bg-panel)',
                            padding: '2rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border-light)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '1rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ 
                                background: '#ffffff', 
                                padding: '1rem', 
                                borderRadius: '1rem',
                                boxShadow: '0 0 20px rgba(14, 165, 233, 0.2)'
                            }}>
                                <QRCodeSVG
                                    value={code.url}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                                    <span>{code.icon}</span> {code.title}
                                </h3>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                                    {code.description}
                                </p>
                            </div>
                            
                            <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '0.5rem', width: '100%', fontSize: '0.75rem', color: 'var(--accent-secondary)', wordBreak: 'break-all' }}>
                                {code.url}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .qr-grid, .qr-grid * {
                        visibility: visible;
                    }
                    .qr-grid {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }
                    .qr-card {
                        background: none !important;
                        border: 2px solid #000 !important;
                        box-shadow: none !important;
                        color: #000 !important;
                        page-break-inside: avoid;
                    }
                    .qr-card h3 {
                        color: #000 !important;
                    }
                    .qr-card p {
                        color: #333 !important;
                    }
                    .qr-print-action, header {
                        display: none !important;
                    }
                }
            `}} />
        </div>
    );
}
