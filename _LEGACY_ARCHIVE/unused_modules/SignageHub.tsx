/**
 * ARCHIVE NOTICE
 * Original Use: Used for digital signage displays.
 * Moved to: unused_modules
 */

import { useTranslation } from 'react-i18next';

interface SignageHubProps {
    onNavigateBack: () => void;
}

interface SignageStandard {
    id: string;
    category: string;
    title: string;
    description: string;
    icon: string;
    status: 'available' | 'coming-soon';
}

const SignageHub: React.FC<SignageHubProps> = ({ onNavigateBack }) => {
    const { t } = useTranslation();

    const standards: SignageStandard[] = [
        { id: '1', category: 'Plant Signs', title: 'Overhead Door ID', description: 'High-visibility identification for main dock doors.', icon: '🚪', status: 'available' },
        { id: '2', category: 'Plant Signs', title: 'Mandoor Standards', description: 'Internal safety and room identification.', icon: '🚶', status: 'available' },
        { id: '3', category: 'Plant Signs', title: 'Racking Signage', description: 'Aisle and location identifiers for warehouse rack ends.', icon: '📦', status: 'available' },
        { id: '5', category: 'Departmental Signs', title: 'KPI Board (Tier 1)', description: 'Daily team accountability board standard.', icon: '📊', status: 'available' },
        { id: '7', category: 'Departmental Signs', title: '2026 CaLEANdar', description: 'Standardized 2026 Lean scheduling calendar (PDF download).', icon: '/images/caleandar-logo.png', status: 'available' },
        { id: '8', category: 'Site Signs', title: 'First Aid / AED', description: 'Universal safety equipment marking.', icon: '🏥', status: 'available' }
    ];

    const categories = Array.from(new Set(standards.map(s => s.category)));

    return (
        <div className="hub-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onNavigateBack} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                        ← {t('common.back', 'Back')}
                    </button>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 950 }}>🖼️ Signage Hub</h1>
                        <p style={{ margin: 0, opacity: 0.6 }}>Plant-wide visual standards and vector assets.</p>
                    </div>
                </div>
            </header>

            {categories.map(category => (
                <section key={category} style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        {t(`signage.categories.${category.toLowerCase().replace(' ', '')}`, category)}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {standards.filter(s => s.category === category).map(standard => (
                            <div key={standard.id} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                transition: 'all 0.3s ease',
                                cursor: standard.status === 'available' ? 'pointer' : 'default',
                                position: 'relative',
                                overflow: 'hidden'
                            }} className="standard-card">
                                <div style={{ marginBottom: '1rem', height: '50px', display: 'flex', alignItems: 'center' }}>
                                    {standard.icon.startsWith('/') ? (
                                        <img src={standard.icon} alt={standard.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ fontSize: '2.5rem' }}>{standard.icon}</div>
                                    )}
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{standard.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.5 }}>{standard.description}</p>

                                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button
                                        onClick={() => alert(`Downloading vector instructions for ${standard.title}...`)}
                                        style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        Pull Vector ↓
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            <style>{`
                .standard-card:hover {
                    background: rgba(255,255,255,0.05) !important;
                    border-color: var(--accent-primary) !important;
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    );
};

export default SignageHub;
