/**
 * ARCHIVE NOTICE
 * Original Use: Used for communication guidelines.
 * Moved to: unused_modules
 */

export default function CommunicationBestPractices() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🗣️</div>
                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 900, color: 'var(--text-main)' }}>Lean Communication</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem', lineHeight: 1.6 }}>
                    Communication is often the biggest source of hidden waste. Learn how to simplify emails, shorten meetings, and eliminate administrative fluff.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Emails section */}
                <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--accent-primary)' }}>
                    <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        <span style={{ fontSize: '1.5rem' }}>📧</span> No-Nonsense Emails
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>BLUF (Bottom Line Up Front)</strong>
                            State the purpose or the required action in the very first sentence. Don't hide the "ask" at the bottom of three paragraphs.
                        </li>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>The "Five Sentences" Rule</strong>
                            Treat emails like text messages. If it takes more than five sentences to explain, pick up the phone or walk over to their desk.
                        </li>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>Action-Oriented Subject Lines</strong>
                            Label subjects clearly: [ACTION REQUIRED by Friday], [FYI Only], or [DECISION NEEDED]. It saves the reader from guessing.
                        </li>
                    </ul>
                </div>

                {/* Meetings section */}
                <div className="card" style={{ padding: '2rem', borderTop: '4px solid #f59e0b' }}>
                    <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        <span style={{ fontSize: '1.5rem' }}>📅</span> Lean Meetings
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>No Agenda = No Meeting</strong>
                            If an invite does not have a clear agenda and a stated outcome, decline it. Every meeting must have a purpose.
                        </li>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>Halve the Default Time</strong>
                            Most calendar apps default to 60 minutes. Change your default to 30 or 15 minutes. Work expands to fill the time allotted.
                        </li>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>Identify the "DRI"</strong>
                            Every agenda item must have a Directly Responsible Individual (DRI). If an item doesn't have an owner, it gets cut.
                        </li>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>Stand-Up Strategy</strong>
                            Hold daily status updates standing up. People get to the point much faster when they aren't sitting in comfortable chairs.
                        </li>
                    </ul>
                </div>

                {/* General Comms section */}
                <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--accent-success)' }}>
                    <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                        <span style={{ fontSize: '1.5rem' }}>💬</span> General Execution
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: 'var(--accent-success)', display: 'block', marginBottom: '0.25rem' }}>Stop "Reply All" Abuse</strong>
                            Only include people who absolutely need to be in the loop. Every unnecessary CC is a micro-waste of company time.
                        </li>
                        <li style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <strong style={{ color: 'var(--accent-success)', display: 'block', marginBottom: '0.25rem' }}>Define Jargon</strong>
                            Avoid confusing acronyms unless globally understood by the plant. Clarity is always more important than sounding smart.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
