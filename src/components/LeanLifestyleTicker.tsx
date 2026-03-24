import { useState, useEffect } from 'react';
import { LEAN_QUOTES } from '../data/leanQuotes';

export default function LeanLifestyleTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Filter to only include the "Lifestyle" and "Personal" categories roughly if we had categories, 
    // but LEAN_QUOTES currently is a flat array. All of them are good!
    // We will shuffle once on mount to keep it fresh every session.
    const [quotes, setQuotes] = useState<typeof LEAN_QUOTES>([]);

    useEffect(() => {
        // Shuffle quotes on load
        const shuffled = [...LEAN_QUOTES].sort(() => 0.5 - Math.random());
        setQuotes(shuffled);
    }, []);

    useEffect(() => {
        if (quotes.length === 0) return;

        // Change quote every 12 seconds
        const intervalId = setInterval(() => {
            setIsVisible(false); // trigger fade out
            
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % quotes.length);
                setIsVisible(true); // trigger fade in
            }, 500); // 500ms fade duration
            
        }, 12000);

        return () => clearInterval(intervalId);
    }, [quotes]);

    if (quotes.length === 0) return null;

    const activeQuote = quotes[currentIndex];

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            pointerEvents: 'none', // Prevent it from blocking clicks beneath it
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.5rem'
        }}>
            <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02) inset',
                width: 'clamp(280px, 90vw, 400px)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                pointerEvents: 'auto' // Re-enable clicks inside the card if needed
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--zone-yellow)', fontSize: '1.2rem', animation: 'pulse 2s infinite' }}>💡</span>
                    <span style={{ fontWeight: 800, color: 'var(--steel-gray)', fontFamily: 'var(--font-headings)', letterSpacing: '1px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        Lean Life Hack
                    </span>
                </div>
                
                <span style={{ color: 'var(--gemba-black)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.5, fontWeight: 500 }}>
                    "{activeQuote.text}"
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                        ⏳ {activeQuote.savings}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse {
                    0% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); text-shadow: 0 0 10px rgba(255,194,14,0.5); }
                    100% { opacity: 0.7; transform: scale(1); }
                }
                @media (max-width: 768px) {
                    /* On mobile, float above the bottom dock */
                    .os-nav-dock ~ div {
                        bottom: 90px !important;
                        right: 1rem !important;
                    }
                }
            `}} />
        </div>
    );
}
