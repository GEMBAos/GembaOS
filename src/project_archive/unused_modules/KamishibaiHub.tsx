/**
 * ARCHIVE NOTICE
 * Original Use: Used for Kamishibai auditing.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { KamishibaiCard, AuditFrequency } from '../types';
import HardwareConsoleLayout from './tools/HardwareConsoleLayout';

interface KamishibaiHubProps {
    onNavigateBack: () => void;
}

export default function KamishibaiHub({ onNavigateBack }: KamishibaiHubProps) {
    const { t } = useTranslation();
    const [cards, setCards] = useState<KamishibaiCard[]>(() => {
        const saved = localStorage.getItem('kaizen_kamishibai_cards');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: '1',
                title: 'Machine 01 Daily Inspection',
                description: 'Check oil levels, pressure gauges, and emergency stops.',
                frequency: 'daily',
                status: 'red',
                steps: ['Check Oil', 'Verify Pressure', 'Test E-Stop']
            }
        ];
    });

    const [isAddMode, setIsAddMode] = useState(false);
    const [newCard, setNewCard] = useState<Partial<KamishibaiCard>>({
        title: '',
        description: '',
        frequency: 'daily',
        status: 'red'
    });

    useEffect(() => {
        localStorage.setItem('kaizen_kamishibai_cards', JSON.stringify(cards));
    }, [cards]);

    const addCard = () => {
        if (!newCard.title) return;
        const card: KamishibaiCard = {
            id: Math.random().toString(36).substr(2, 9),
            title: newCard.title!,
            description: newCard.description || '',
            frequency: (newCard.frequency as AuditFrequency) || 'daily',
            status: 'red'
        };
        setCards([...cards, card]);
        setNewCard({ title: '', description: '', frequency: 'daily', status: 'red' });
        setIsAddMode(false);
    };

    const deleteCard = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
    };

    const toggleStatus = (id: string) => {
        setCards(cards.map(c => {
            if (c.id === id) {
                return { ...c, status: c.status === 'red' ? 'green' : 'red', lastAudited: new Date().toISOString() };
            }
            return c;
        }));
    };

    return (
        <HardwareConsoleLayout 
            toolId="A-01 COMPLIANCE MATRIX" 
            toolName={t('kamishibai.title', 'AUDIT HUB')} 
            onClose={onNavigateBack}
        >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="audit-hub">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <p style={{ margin: 0, opacity: 0.6, color: '#94a3b8' }}>{t('kamishibai.subtitle', 'Create and flip printable TPM task cards.')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => setIsAddMode(true)}>➕ {t('kamishibai.addCard', 'Add Card')}</button>
                    </div>
                </header>            {/* Card Creator Overlay */}
            {isAddMode && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                    <div className="card" style={{ width: 'min(500px, 95vw)', padding: '2rem' }}>
                        <h2>Create New Task Card</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>TASK TITLE</label>
                                <input
                                    className="input-field"
                                    value={newCard.title}
                                    onChange={e => setNewCard({ ...newCard, title: e.target.value })}
                                    placeholder="e.g. End of Day Clean"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DESCRIPTION / STEPS</label>
                                <textarea
                                    style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'white', padding: '0.75rem', height: '100px', resize: 'none' }}
                                    value={newCard.description}
                                    onChange={e => setNewCard({ ...newCard, description: e.target.value })}
                                    placeholder="Describe the standard..."
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>FREQUENCY</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {(['daily', 'weekly', 'monthly'] as AuditFrequency[]).map(freq => (
                                        <button
                                            key={freq}
                                            onClick={() => setNewCard({ ...newCard, frequency: freq })}
                                            style={{
                                                flex: 1, padding: '0.5rem', borderRadius: '0.5rem', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 'bold',
                                                background: newCard.frequency === freq ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                                border: '1px solid', borderColor: newCard.frequency === freq ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                                color: 'white', cursor: 'pointer'
                                            }}
                                        >
                                            {freq}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddMode(false)}>Cancel</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={addCard}>Create Card</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid View */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '3rem',
                justifyItems: 'center'
            }} className="card-grid">
                {cards.map(card => (
                    <div key={card.id} className="card-container" style={{ perspective: '1000px', width: '200px', height: '300px', position: 'relative' }}>
                        <div
                            style={{
                                position: 'relative', width: '100%', height: '100%', textAlign: 'center', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                transformStyle: 'preserve-3d', transform: card.status === 'green' ? 'rotateY(180deg)' : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => toggleStatus(card.id)}
                        >
                            {/* RED SIDE (Front) */}
                            <div style={{
                                position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                                background: '#ef4444',
                                borderRadius: '0.8rem', padding: '1.25rem', display: 'flex', flexDirection: 'column',
                                justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)'
                            }}>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px', marginBottom: '0.25rem' }}>{card.frequency}</div>
                                    <h2 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>{card.title}</h2>
                                </div>

                                <div style={{
                                    background: 'white',
                                    padding: '0.4rem',
                                    borderRadius: '0.4rem',
                                    width: '100px',
                                    height: '100px',
                                    margin: '0 auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(card.title)}`}
                                        alt="QR Code"
                                        style={{ width: '100%', height: '100%', display: 'block' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>PENDING AUDIT</span>
                                    <span style={{ fontSize: '0.8rem' }}>🔴</span>
                                </div>
                            </div>

                            {/* GREEN SIDE (Back) */}
                            <div style={{
                                position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                                background: '#10b981',
                                borderRadius: '0.8rem', padding: '1.25rem', display: 'flex', flexDirection: 'column',
                                justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)',
                                transform: 'rotateY(180deg)', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)'
                            }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '3rem' }}>✅</div>
                                    <h2 style={{ margin: 0, color: 'white', fontSize: '1.25rem', fontWeight: 950 }}>STABILIZED</h2>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Audit Confirmed</p>
                                </div>
                                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {card.lastAudited ? `Verified: ${new Date(card.lastAudited).toLocaleDateString()}` : 'CONFIRMED'}
                                </div>
                            </div>
                        </div>
                        <button
                            className="delete-card-btn"
                            onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                            style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.6rem', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* PRINT STYLES */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .top-nav, .sidebar, .btn, .delete-card-btn, .audit-hub > div:first-child, .partner-banner {
                        display: none !important;
                    }
                    .audit-hub {
                        padding: 0 !important;
                        background: white !important;
                        max-width: none !important;
                    }
                    .card-grid {
                        display: block !important;
                        column-count: 1;
                    }
                    .card-container {
                        perspective: none !important;
                        height: auto !important;
                        page-break-inside: avoid;
                        margin-bottom: 2cm !important;
                    }
                    .card-container > div {
                        transition: none !important;
                        transform: none !important;
                        display: flex !important;
                        flex-direction: row !important;
                        gap: 1cm !important;
                        height: 10cm !important; /* Fixed print size for consistency */
                    }
                    /* Layout for folding: Red and Green Side-by-Side */
                    .card-container > div > div {
                        position: relative !important;
                        width: 50% !important;
                        height: 100% !important;
                        transform: none !important;
                        backface-visibility: visible !important;
                        border: 2px solid black !important;
                        box-shadow: none !important;
                        color: black !important;
                    }
                    /* Red Side Printing */
                    .card-container > div > div:first-child {
                        background: #fee2e2 !important; /* Light red for ink saving */
                        color: black !important;
                    }
                    /* Green Side Printing */
                    .card-container > div > div:last-child {
                        background: #d1fae5 !important; /* Light green for ink saving */
                        color: black !important;
                    }
                    /* Ensure text is black for clarity */
                    .card-container h2, .card-container p, .card-container div {
                        color: black !important;
                    }
                }
            `}} />
            </div>
        </HardwareConsoleLayout>
    );
}
