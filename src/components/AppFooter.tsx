// GembaOS Global Footer
import './AppFooter.css'; // We'll create this next
import gembaosIcon from '../assets/branding/gembaos-icon.png';

export default function AppFooter() {
    const handleComingSoon = (e: React.MouseEvent) => {
        e.preventDefault();
        alert('This resource is currently in development. Coming soon to GembaOS!');
    };

    return (
        <footer className="gemba-footer">
            <div className="footer-content">
                <div className="footer-columns">
                    {/* Platform Information */}
                    <div className="footer-column">
                        <div className="footer-heading">Platform Info</div>
                        <a href="https://gembaos.com" target="_blank" rel="noopener noreferrer">About GembaOS</a>
                        <a href="#" onClick={handleComingSoon}>Security & Privacy</a>
                        <a href="#" onClick={handleComingSoon}>System Architecture</a>
                    </div>

                    {/* Resources */}
                    <div className="footer-column">
                        <div className="footer-heading">Partner Resources</div>
                        <a href="https://gembaacademy.com" target="_blank" rel="noopener noreferrer">Gemba Academy</a>
                        <a href="https://app.gembadocs.com/" target="_blank" rel="noopener noreferrer">GembaDocs</a>
                        <a href="https://paulakers.net/books/2-second-lean" target="_blank" rel="noopener noreferrer">2-Second Lean Library</a>
                    </div>

                    {/* Popular Tools */}
                    <div className="footer-column">
                        <div className="footer-heading">Core Modules</div>
                        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'execution' })); }}>Leader Standard Work</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'gemba' })); }}>Digital Gemba Walks</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'portal' })); }}>JFI Idea Generator</a>
                    </div>
                </div>

                {/* Newsletter / Notifications Row */}
                <div className="footer-newsletter-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>✉️</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Sign Up for Gemba Updates</span>
                        <button className="btn btn-primary" onClick={handleComingSoon} style={{ padding: '0.5rem 1.5rem', marginLeft: '1rem', borderRadius: '4px' }}>Subscribe</button>
                    </div>
                    
                    <div className="social-links">
                        <span style={{ color: 'var(--text-muted)' }}>Follow GembaOS</span>
                        <a href="#" onClick={handleComingSoon}>f</a>
                        <a href="#" onClick={handleComingSoon}>in</a>
                        <a href="#" onClick={handleComingSoon}>X</a>
                        <a href="#" onClick={handleComingSoon}>▶</a>
                    </div>
                </div>
            </div>

            {/* Bottom Legal Row */}
            <div className="footer-legal">
                <div className="footer-inner-legal">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={gembaosIcon} alt="GembaOS Logo" style={{ height: '24px' }} />
                        <span style={{ fontWeight: '900', letterSpacing: '1px' }}>GEMBA<span style={{ color: 'var(--accent-primary)' }}>OS</span></span>
                    </div>
                    <div className="legal-links">
                        <a href="#" onClick={handleComingSoon}>Privacy Policy</a> | 
                        <a href="#" onClick={handleComingSoon}>Your Privacy Choices</a> | 
                        <a href="#" onClick={handleComingSoon}>Terms of Service</a> | 
                        <a href="#" onClick={handleComingSoon}>Accessibility</a> | 
                        <a href="#" onClick={handleComingSoon}>Corporate Policies</a> | 
                        <a href="#" onClick={handleComingSoon}>Product Security</a> | 
                        <a href="#" onClick={handleComingSoon}>Contact</a>
                    </div>
                    <div className="copyright">
                        Copyright © 2026 GembaOS Manufacturing Systems
                    </div>
                </div>
            </div>
        </footer>
    );
}
