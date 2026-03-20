/**
 * ARCHIVE NOTICE
 * Original Use: Used for developer/admin backdoors.
 * Moved to: unused_modules
 */

import { useState } from 'react';
import QRHub from './QRHub';

export default function AdminTools() {
    const [view, setView] = useState<'main' | 'qrhub'>('main');

    if (view === 'qrhub') {
        return <QRHub onClose={() => setView('main')} />;
    }

    return (
        <div className="process-map-bg" style={{ minHeight: '100%', padding: 'max(1.5rem, 3vw)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        <span style={{ fontSize: '2rem' }}>⚙️</span> Admin Dashboard
                    </h1>
                </header>

                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3>🖨️ QR Command Hub</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Generate printable QR codes for frictionless shop floor access to specific tools and challenges.</p>
                        <button className="btn btn-primary" onClick={() => setView('qrhub')} style={{ marginTop: 'auto' }}>
                            Open QR Hub
                        </button>
                    </div>

                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.5 }}>
                        <h3>👥 User Management</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Manage user roles, profiles, and permissions. (Requires super-admin backend access).</p>
                        <button className="btn" disabled style={{ marginTop: 'auto' }}>
                            Locked
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
