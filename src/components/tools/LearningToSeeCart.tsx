import React from 'react';

interface LearningToSeeCartProps {
    onJfiClick: () => void;
}

export default function LearningToSeeCart({ onJfiClick }: LearningToSeeCartProps) {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px', // Keep it reasonably contained
            margin: '0 auto',
            paddingBottom: '20px' // Space for the casters
        }}>
            {/* Main Cart Body */}
            <div style={{
                background: 'linear-gradient(180deg, #1e1e1e 0%, #111111 100%)',
                borderRadius: '8px',
                padding: '24px 24px 32px 24px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.6), 0 12px 24px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 2,
                borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ 
                        fontFamily: '"Orbitron", sans-serif', 
                        fontWeight: 900, 
                        fontSize: '2rem', 
                        color: '#ffffff', 
                        margin: '0 0 4px 0',
                        letterSpacing: '1px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>LEARNING TO SEE</h2>
                    <h3 style={{ 
                        fontFamily: '"Inter", sans-serif', 
                        fontWeight: 800, 
                        fontSize: '0.85rem', 
                        color: '#ffc20e', 
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>TRAINING AND BEST PRACTICES</h3>
                </div>

                {/* 2 Square Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    marginBottom: '16px',
                    flexWrap: 'nowrap'
                }}>
                    <button style={squareButtonStyle}>
                        <span style={emojiStyle}>👷</span>
                        <span style={buttonLabelStyle}>SAFETY</span>
                    </button>
                    <button style={squareButtonStyle}>
                        <span style={emojiStyle}>🔧</span>
                        <span style={buttonLabelStyle}>LEAN TOOLS</span>
                    </button>
                </div>

                {/* Tiny JFI Submissions & Padlet Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button 
                        onClick={onJfiClick}
                        style={{
                            flex: 1,
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '4px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            textDecoration: 'none'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#ffc20e'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
                    >
                        <span style={{ fontSize: '1rem' }}>📝</span>
                        <span style={{ 
                            fontFamily: '"Orbitron", sans-serif', 
                            fontWeight: 800, 
                            fontSize: '0.65rem', 
                            color: '#ffffff',
                            letterSpacing: '1px'
                        }}>JFI SUBMISSIONS</span>
                    </button>
                    
                    <a 
                        href="https://padlet.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{
                            flex: 1,
                            background: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '4px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            textDecoration: 'none'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#ffc20e'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
                    >
                        <span style={{ fontSize: '1rem' }}>▶️</span>
                        <span style={{ 
                            fontFamily: '"Orbitron", sans-serif', 
                            fontWeight: 800, 
                            fontSize: '0.65rem', 
                            color: '#ffffff',
                            letterSpacing: '1px'
                        }}>PADLET</span>
                    </a>
                </div>

                {/* Horizontal Rule */}
                <div style={{
                    height: '2px',
                    background: '#ffc20e',
                    width: '100%',
                    marginBottom: '20px'
                }}></div>

                {/* Footer Text */}
                <div style={{ 
                    textAlign: 'center', 
                    fontFamily: '"Orbitron", sans-serif', 
                    fontWeight: 900, 
                    fontSize: '0.85rem', 
                    color: '#6b7280', 
                    letterSpacing: '5px' 
                }}>
                    DESIGNED TO MOVE BETTER.
                </div>

                {/* Bottom Right Yellow Bracket */}
                <div style={{
                    position: 'absolute',
                    bottom: '-12px',
                    right: '-12px',
                    width: '24px',
                    height: '24px',
                    borderBottom: '4px solid #ffc20e',
                    borderRight: '4px solid #ffc20e',
                    zIndex: 1
                }}></div>
            </div>

            {/* Caster Wheels */}
            <div style={{...casterStyle, left: '40px'}}></div>
            <div style={{...casterStyle, right: '40px'}}></div>
        </div>
    );
}

// Reusable Styles
const squareButtonStyle: React.CSSProperties = {
    flex: 1,
    aspectRatio: '1',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.3)',
    transition: 'background 0.2s',
};

const emojiStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))'
};

const buttonLabelStyle: React.CSSProperties = {
    fontFamily: '"Orbitron", sans-serif', 
    fontWeight: 800, 
    fontSize: '0.8rem', 
    color: '#ffffff',
    letterSpacing: '1px',
    textTransform: 'uppercase'
};

const casterStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '0', // Hangs off the bottom by exactly the 20px padding left in the parent
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #555, #000)',
    boxShadow: '0 8px 12px rgba(0,0,0,0.6)',
    zIndex: 1
};
