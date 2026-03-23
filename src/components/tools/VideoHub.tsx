import HardwareConsoleLayout from './HardwareConsoleLayout';

const MOCK_VIDEOS = [
    { title: 'Lippert: Yokoten & Report Out', duration: '4:15', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80', description: 'See how Lippert Components uses a Report Out process to celebrate and drive employee engagement.', url: 'https://www.youtube.com/watch?v=1-NtbHh_ZJ4' },
    { title: 'Gemba Walks 101: Go and See', duration: '5:42', thumbnail: 'https://images.unsplash.com/photo-1542382103-2470659a224a?w=500&q=80', description: 'Learn the proper technique for executing a daily Gemba Walk.', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { title: 'Standardized Work Basics', duration: '8:30', thumbnail: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&q=80', description: 'How to write effective, visual standard operating procedures.', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { title: '5S Organization Tour', duration: '15:20', thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80', description: 'A walk-through of a world-class 5S-certified production line.', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
];

export default function VideoHub({ onClose }: { onClose: () => void }) {
    return (
        <HardwareConsoleLayout toolId="VID-01 LIBRARY" toolName="TRAINING VIDEOS" onClose={onClose}>
            <div style={{ padding: '0', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-headings)', color: 'var(--lean-white)' }}>
                        OPERATIONAL TRAINING HUB
                    </h2>
                    <p style={{ color: 'var(--steel-gray)', margin: 0 }}>
                        Select a video below to launch the integrated training player.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', overflowY: 'auto', paddingBottom: '2rem' }}>
                    {MOCK_VIDEOS.map((vid, idx) => (
                        <a key={idx} className="card" href={vid.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid var(--border-light)', display: 'block' }} 
                             onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'var(--zone-yellow)'; }}
                             onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                        >
                            <div style={{ 
                                height: '220px', 
                                backgroundImage: `url(${vid.thumbnail})`, 
                                backgroundSize: 'cover', 
                                backgroundPosition: 'center',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                                    {vid.duration}
                                </div>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', opacity: 0.9, pointerEvents: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                                    ▶
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--lean-white)' }}>{vid.title}</h3>
                                <p style={{ margin: 0, color: 'var(--steel-gray)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {vid.description}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </HardwareConsoleLayout>
    );
}
