import { useEffect } from 'react';
import gembaosIcon from '../assets/branding/gembaos-icon.png';

interface PromoLandingProps {
    onSignUp: () => void;
}

export default function PromoLanding({ onSignUp }: PromoLandingProps) {
    useEffect(() => {
        // Scroll to top when hitting the landing page
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ padding: '0', margin: '0', background: 'var(--bg-panel)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Hero Section */}
            <header style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                borderBottom: '1px solid var(--border-light)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={gembaosIcon} alt="Gemba Logo" style={{ width: '64px', height: '64px', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }} />
                            <img src="/signature.png" alt="" style={{ position: 'absolute', bottom: '8%', right: '8%', height: '10px', opacity: 0.15, pointerEvents: 'none', zIndex: 2, filter: 'invert(1)', mixBlendMode: 'plus-lighter' }} />
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 950,
                        letterSpacing: '-2px',
                        lineHeight: 1.1,
                        marginBottom: '1rem',
                        background: 'linear-gradient(90deg, #fff, #a5b4fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Transform Your Floor. <br /> Not Just Your Paperwork.
                    </h1>
                    <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        The #1 Lean Operating System designed for high-performance manufacturing. Digitize continuous improvement and build a world-class culture in 30 days.
                    </p>
                    <button
                        onClick={onSignUp}
                        className="btn btn-primary"
                        style={{ padding: '1.25rem 3rem', fontSize: '1.25rem', fontWeight: 900, borderRadius: '2rem', boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.5)' }}
                    >
                        Start Your Free Gemba Today 🚀
                    </button>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>No credit card required. Setup in 2 minutes.</p>
                </div>
            </header>

            {/* Top 5 Reasons Section */}
            <section style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Top 5 Reasons You Need GembaOS</h2>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Why World-Class Facilities Use Us</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Reason 1 */}
                    <div className="card promo-card">
                        <div className="promo-icon">🛑</div>
                        <div>
                            <h3>Identify Bottlenecks Instantly</h3>
                            <p>Stop guessing why throughput is down. Our interactive process maps let you instantly calculate cycle times vs. takt time, revealing exactly where constraints live.</p>
                        </div>
                    </div>

                    {/* Reason 2 */}
                    <div className="card promo-card">
                        <div className="promo-icon">🤖</div>
                        <div>
                            <h3>Instant "Just Fix It" (JFI) Idea Generator</h3>
                            <p>Stuck? Click a button to get proven, industry-specific Kaizen ideas inspired by 2-Second Lean and Toyota. Turn ideas into tracked action items with one click.</p>
                        </div>
                    </div>

                    {/* Reason 3 */}
                    <div className="card promo-card">
                        <div className="promo-icon">📈</div>
                        <div>
                            <h3>Kill Paper Action Logs</h3>
                            <p>Track your Lean projects and daily action items through our centralized Execution Hub. Kanban boards ensure accountability and visibility for the whole team.</p>
                        </div>
                    </div>

                    {/* Reason 4 */}
                    <div className="card promo-card">
                        <div className="promo-icon">🎓</div>
                        <div>
                            <h3>Onboard New Operators with Lean Academy</h3>
                            <p>Don't just train them on the machine, train them on the culture. Built-in interactive simulations, 5S games, and root-cause analysis tutorials.</p>
                        </div>
                    </div>

                    {/* Reason 5 */}
                    <div className="card promo-card">
                        <div className="promo-icon">🏆</div>
                        <div>
                            <h3>Gamify Continuous Improvement</h3>
                            <p>Build an unstoppable culture. Operators earn XP points for completing audits, logging JFIs, and passing quizzes, all displayed on a dynamic facility Leaderboard.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-light)' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Ready to eliminate the constraints?</h2>
                <button
                    onClick={onSignUp}
                    className="btn btn-primary"
                    style={{ padding: '1rem 2.5rem', fontSize: '1.25rem', fontWeight: 900 }}
                >
                    Create Your Account
                </button>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
                .promo-card {
                    display: flex;
                    gap: 1.5rem;
                    padding: 2rem;
                    background: rgba(0,0,0,0.2) !important;
                    border: 1px solid var(--border-light);
                    transition: all 0.3s ease;
                    align-items: center;
                }
                .promo-card:hover {
                    background: rgba(14, 165, 233, 0.05) !important;
                    border-color: rgba(14, 165, 233, 0.3);
                    transform: translateX(10px);
                }
                .promo-icon {
                    font-size: 3rem;
                    background: var(--bg-panel);
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 1rem;
                    flex-shrink: 0;
                    box-shadow: inset 0 2px 5px rgba(255,255,255,0.05);
                }
                .promo-card h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.5rem;
                    color: var(--text-main);
                }
                .promo-card p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 1.05rem;
                    line-height: 1.5;
                }
                @media (max-width: 600px) {
                    .promo-card {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `}} />
        </div>
    );
}
