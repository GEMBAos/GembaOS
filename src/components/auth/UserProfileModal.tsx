import { useState } from 'react';
import { userService, type UserProfile } from '../../services/userService';
import { useTranslation } from 'react-i18next';

// Built-in badge dictionary for UI
const BADGE_DEFS: Record<string, { icon: string, title: string, desc: string }> = {
    'sharp_eyes': { icon: '📸', title: 'Sharp Eyes', desc: 'Captured your first friction photo' },
    'daily_warrior': { icon: '⚔️', title: 'Daily Warrior', desc: 'Completed a daily Gemba challenge' }
};

interface UserProfileModalProps {
    profile: UserProfile;
    onClose: () => void;
    onUpdate: () => void; // Trigger an App.tsx refetch
    isGuest?: boolean;
    onOpenRanks?: () => void;
}

export default function UserProfileModal({ profile, onClose, onUpdate, isGuest, onOpenRanks }: UserProfileModalProps) {
    const { i18n } = useTranslation();
    const [fullName, setFullName] = useState(profile.full_name || '');
    const [username, setUsername] = useState(profile.username || '');
    const [linkedin, setLinkedin] = useState(profile.linkedin_url || '');
    const [contactInfo, setContactInfo] = useState(profile.contact_info || '');
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let finalAvatarUrl = profile.avatar_url;

            // Upload new avatar if selected
            if (avatarFile) {
                const url = await userService.uploadAvatar(profile.id, avatarFile);
                if (url) {
                    finalAvatarUrl = url;
                } else {
                    setMessage({ text: 'Failed to upload avatar. Continuing with profile update...', type: 'error' });
                }
            }

            // Update profile record
            const success = await userService.updateProfile(profile.id, {
                full_name: fullName,
                username: username,
                avatar_url: finalAvatarUrl,
                linkedin_url: linkedin,
                contact_info: contactInfo
            });

            if (success) {
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                onUpdate(); // Tell App.tsx to reload the profile data
                setTimeout(() => onClose(), 1500);
            } else {
                setMessage({ text: 'Failed to update profile details.', type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: err.message || 'An unexpected error occurred.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sidebar-overlay visible" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}
                >
                    &times;
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}>
                        <span>👤</span> Profile Settings
                    </h2>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                        Manage your public Kaizen profile
                    </p>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Avatar Upload Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                                src={avatarPreview || `https://ui-avatars.com/api/?name=${username || 'Gemba'}&background=random`}
                                alt="Profile Avatar"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                            />
                            <label
                                htmlFor="avatar-upload"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    background: 'var(--bg-panel)',
                                    border: '1px solid var(--border-light)',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                                    fontSize: '1.2rem'
                                }}
                                title="Change Avatar"
                            >
                                📷
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Username (Display Name)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="LeanMaster99"
                            required
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>This name appears on the Global Leaderboard.</div>
                    </div>

                    {/* Gemba Challenge Belt Gamification */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🥋 Gemba Challenge Belt
                            </h3>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                {parseInt(localStorage.getItem('kaizen_user_score') || '0', 10).toLocaleString()} XP
                            </div>
                        </div>

                        {(() => {
                            const score = parseInt(localStorage.getItem('kaizen_user_score') || '0', 10);
                            let beltClass = 'belt-white';
                            let beltName = 'White Belt';
                            let nextBelt = 'Yellow Belt';
                            let progress = 0;

                            if (score >= 5000) { beltClass = 'belt-master'; beltName = 'Sensei (Master)'; nextBelt = 'Max Rank'; progress = 100; }
                            else if (score >= 2500) { beltClass = 'belt-black'; beltName = 'Black Belt'; nextBelt = 'Sensei'; progress = ((score - 2500) / 2500) * 100; }
                            else if (score >= 1000) { beltClass = 'belt-brown'; beltName = 'Brown Belt'; nextBelt = 'Black Belt'; progress = ((score - 1000) / 1500) * 100; }
                            else if (score >= 500) { beltClass = 'belt-purple'; beltName = 'Purple Belt'; nextBelt = 'Brown Belt'; progress = ((score - 500) / 500) * 100; }
                            else if (score >= 250) { beltClass = 'belt-blue'; beltName = 'Blue Belt'; nextBelt = 'Purple Belt'; progress = ((score - 250) / 250) * 100; }
                            else if (score >= 100) { beltClass = 'belt-green'; beltName = 'Green Belt'; nextBelt = 'Blue Belt'; progress = ((score - 100) / 150) * 100; }
                            else if (score >= 50) { beltClass = 'belt-orange'; beltName = 'Orange Belt'; nextBelt = 'Green Belt'; progress = ((score - 50) / 50) * 100; }
                            else if (score >= 10) { beltClass = 'belt-yellow'; beltName = 'Yellow Belt'; nextBelt = 'Orange Belt'; progress = ((score - 10) / 40) * 100; }
                            else { progress = (score / 10) * 100; }

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className={`belt-badge ${beltClass}`}>
                                            {beltName}
                                        </div>
                                        <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {score >= 5000 ? 'You have mastered the Gemba Challenge.' : `Next rank: ${nextBelt}`}
                                        </div>
                                    </div>

                                    {score < 5000 && (
                                        <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${Math.min(100, Math.max(0, progress))}%`,
                                                height: '100%',
                                                background: 'var(--accent-primary)',
                                                borderRadius: '4px',
                                                transition: 'width 1s ease-out'
                                            }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                        {onOpenRanks && (
                            <button type="button" onClick={onOpenRanks} style={{ marginTop: '0.5rem', background: 'rgba(255,194,14,0.1)', color: 'var(--zone-yellow)', border: '1px solid var(--zone-yellow)', padding: '0.6rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,194,14,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,194,14,0.1)'}>
                                View Rank Benefits & Unlocks ➔
                            </button>
                        )}
                    </div>

                    {/* App Badges Section */}
                    {(profile.badges && profile.badges.length > 0) && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '1rem', padding: '1rem' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Unlocked Badges</h4>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {profile.badges.map(bId => {
                                    const bDef = BADGE_DEFS[bId];
                                    if (!bDef) return null;
                                    return (
                                        <div key={bId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', width: '80px', textAlign: 'center' }} title={bDef.desc}>
                                            <div style={{ fontSize: '1.5rem' }}>{bDef.icon}</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{bDef.title}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">LinkedIn Profile URL</label>
                        <input
                            type="url"
                            className="input-field"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/johndoe"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Contact Info / Title</label>
                        <input
                            type="text"
                            className="input-field"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            placeholder="Continuous Improvement Manager"
                        />
                    </div>

                    {/* App Settings / Idioma */}
                    <div className="input-group" style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', border: '1px solid var(--border-light)' }}>
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            🌐 App Settings / Idioma
                        </label>
                        <select
                            className="input-field"
                            value={i18n.language?.split('-')[0] || 'en'}
                            onChange={(e) => {
                                i18n.changeLanguage(e.target.value);
                            }}
                            style={{ background: 'var(--bg-panel)', fontWeight: 'bold' }}
                        >
                            <option value="en">🇺🇸 English</option>
                            <option value="es">🇪🇸 Español</option>
                            <option value="de">🇩🇪 Deutsch</option>
                        </select>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Changing this setting will instantly update the interface language.
                        </div>
                    </div>

                    {message && (
                        <div style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.type === 'success' ? '#34d399' : '#fca5a5',
                            border: `1px solid ${message.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading || isGuest}>
                            {loading ? 'Saving...' : isGuest ? 'Sign In to Save Profile' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
