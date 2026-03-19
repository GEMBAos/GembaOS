import { useTranslation } from 'react-i18next';

interface RankBenefitsModalProps {
    onClose: () => void;
    currentScore: number;
}

const RANKS = [
    { threshold: 0, title: 'Novice Observer', icon: '🌱', benefits: ['Access to basic Gemba concepts', 'Ability to submit Just-Fix-Its (JFIs)', 'Earn XP daily'] },
    { threshold: 1260, title: 'Waste Spotter', icon: '🔍', benefits: ['Unlocks the 5 Whys Investigator tool', 'Custom avatar borders', 'Access to Kaizen Bingo'] },
    { threshold: 1300, title: 'Lean Practitioner', icon: '🛠️', benefits: ['Unlocks intermediate Simulations', 'Can save Favorite Lean Hacks', 'Eligible for "Optimizer of the Month"'] },
    { threshold: 1500, title: 'Gemba Guide', icon: '🧭', benefits: ['Access to PC Macro Builder', 'Can review peer JFIs', 'Listed on the Global Leaderboard'] },
    { threshold: 2000, title: 'Kaizen Master', icon: '👑', benefits: ['Unrestricted access to all tools', 'Exclusive premium UI themes', 'Direct line to submit app features'] }
];

export default function RankBenefitsModal({ onClose, currentScore }: RankBenefitsModalProps) {
    useTranslation();

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            padding: '2rem'
        }}>
            <div className="animate-slide-up" style={{
                position: 'relative',
                maxWidth: '650px',
                width: '100%',
                background: 'var(--bg-panel)',
                borderRadius: '1.5rem',
                border: '1px solid var(--border-light)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh'
            }}>
                {/* Header */}
                <div style={{
                    padding: '2rem 2rem 1.5rem 2rem',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, transparent 100%)',
                    borderBottom: '1px solid var(--border-light)'
                }}>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                        background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)',
                        width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                        transition: 'all 0.2s'
                    }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                        ✕
                    </button>

                    <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>🏅</span> Ranks & Benefits
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        Level up your Kaizen Rank by engaging with the app. Earn XP by completing daily quizzes, submitting Just-Fix-Its, and running simulations.
                    </p>
                </div>

                {/* Content */}
                <div style={{ padding: '0 2rem 2rem 2rem', overflowY: 'auto', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        {RANKS.map((rank, idx) => {
                            const isAchieved = currentScore >= rank.threshold;
                            const isNext = !isAchieved && (idx === 0 || currentScore >= RANKS[idx - 1].threshold);

                            return (
                                <div key={idx} style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    padding: '1.25rem',
                                    background: isAchieved ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${isAchieved ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                                    borderRadius: '1rem',
                                    opacity: isAchieved || isNext ? 1 : 0.6,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {isAchieved && (
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-primary)' }} />
                                    )}

                                    {/* Icon */}
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '50%',
                                        background: isAchieved ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem', flexShrink: 0,
                                        boxShadow: isAchieved ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
                                        border: isAchieved ? '2px solid white' : '1px dashed rgba(255,255,255,0.2)'
                                    }}>
                                        {rank.icon}
                                    </div>

                                    {/* Details */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div>
                                                <h3 style={{ margin: 0, color: isAchieved ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1.2rem' }}>
                                                    {rank.title}
                                                </h3>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                                                    {rank.threshold > 0 ? `${rank.threshold} XP Required` : 'Starting Rank'}
                                                </div>
                                            </div>
                                            {isAchieved && (
                                                <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 'bold' }}>
                                                    UNLOCKED ✓
                                                </span>
                                            )}
                                        </div>

                                        {/* Perks */}
                                        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                            {rank.benefits.map((benefit, i) => (
                                                <li key={i} style={{ color: isAchieved ? 'var(--text-main)' : 'var(--text-muted)' }}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
