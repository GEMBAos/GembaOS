import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FeedbackOverlay: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Handle locally to prevent SPA 404 routing errors on Netlify without backend
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setIsOpen(false);
        }, 2000);
    };

    return (
        <>
            <button
                className="feedback-trigger-btn"
                onClick={() => setIsOpen(true)}
                title="Feedback"
            >
                <span>💬</span> {t('feedback.button')}
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    backdropFilter: 'blur(4px)',
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-panel)',
                        padding: '2rem',
                        borderRadius: '1.25rem',
                        width: 'min(500px, 90vw)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        position: 'relative',
                    }}>
                        {!submitted ? (
                            <>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ✕
                                </button>
                                <h2 style={{ marginBottom: '0.5rem' }}>{t('feedback.title')}</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    {t('feedback.desc')}
                                </p>

                                <form
                                    name="beta-feedback"
                                    method="POST"
                                    data-netlify="true"
                                    onSubmit={handleSubmit}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                >
                                    <input type="hidden" name="form-name" value="beta-feedback" />

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                            {t('feedback.type')}
                                        </label>
                                        <select
                                            name="type"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: 'var(--bg-dark)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                            }}
                                        >
                                            <option value="bug">{t('feedback.types.bug')}</option>
                                            <option value="idea">{t('feedback.types.idea')}</option>
                                            <option value="question">{t('feedback.types.question')}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                            {t('feedback.message')}
                                        </label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={4}
                                            placeholder={t('feedback.placeholder')}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: 'var(--bg-dark)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                resize: 'none',
                                            }}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ padding: '0.75rem', fontWeight: 'bold', marginTop: '0.5rem' }}
                                    >
                                        {t('feedback.submit')}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <span style={{ fontSize: '4rem' }}>🚀</span>
                                <h2 style={{ marginTop: '1rem' }}>{t('feedback.successTitle')}</h2>
                                <p style={{ color: 'var(--text-muted)' }}>{t('feedback.successDesc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackOverlay;
