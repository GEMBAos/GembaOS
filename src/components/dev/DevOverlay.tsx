import { useState, useEffect } from 'react';

const ROUTES = [
  'portal',
  'observe',
  'diagnose',
  'improve',
  'motion-v2',
  'time-study',
  'process-check',
  'improvement-card',
  'value-scanner',
  'line-balance',
  'kaizen-hub',
  'action-items',
  'lean-academy',
  'video-hub',
  'gemba-challenge',
  'idea-engine',
  'dashboard'
];

export default function DevOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash.replace('#/', '').split('?')[0] || 'portal');

  useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash.replace('#/', '').split('?')[0]);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (import.meta.env?.MODE === 'production') {
    // Optionally hide in true production, but if user strictly wants it, we can leave it.
    // For now we will render it but make it very discreet if closed.
  }

  const navigate = (route: string) => {
    window.location.hash = `/${route}`;
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999999, // Extremely high, outside app simulator
        fontFamily: 'monospace',
      }}
    >
      {isOpen ? (
        <div style={{
          background: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '16px',
          width: '280px',
          maxHeight: '60vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          color: '#00ff00',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '8px' }}>
            <strong style={{ letterSpacing: '1px' }}>🛠️ DEV/DEBUG ROUTER</strong>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}
            >
              [X]
            </button>
          </div>
          
          <div style={{ color: '#888', marginBottom: '4px' }}>Force Direct Navigation:</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {ROUTES.map(route => {
              const isActive = currentHash === route;
              return (
                <button
                  key={route}
                  onClick={() => navigate(route)}
                  style={{
                    background: isActive ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
                    border: isActive ? '1px solid #00ff00' : '1px solid #333',
                    color: isActive ? '#fff' : '#00ff00',
                    padding: '6px 8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    transition: 'all 0.1s'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  /{route} {isActive && '←'}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid #333',
            color: '#00ff00',
            padding: '8px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)'
          }}
          title="Open Dev Router"
        >
          ⚙️ DEV
        </button>
      )}
    </div>
  );
}
