import React from 'react';

interface DynamicBadgeProps {
    xp: number;
    avatarUrl?: string;
    username?: string;
    size?: number; // Base size
}

const DynamicBadge: React.FC<DynamicBadgeProps> = ({ xp, avatarUrl, username, size = 40 }) => {
    // Formula for infinite scaling level
    const level = Math.floor(Math.sqrt(xp / 20)) + 1;

    // Define tier visuals based on level
    let borderColor = '#555';
    let boxShadow = '0 2px 4px rgba(0,0,0,0.5)';
    let scale = 1;
    let rankTitle = 'Spark';
    let extraFlair = null;
    let glowAnimation = '';

    if (level >= 10 && level < 25) {
        borderColor = '#c0c0c0'; // Silver
        boxShadow = '0 0 10px rgba(192,192,192,0.5), inset 0 0 5px rgba(255,255,255,0.2)';
        scale = 1.05;
        rankTitle = 'Hunter';
    } else if (level >= 25 && level < 50) {
        borderColor = '#ffd700'; // Gold
        boxShadow = '0 0 15px rgba(255,215,0,0.6), inset 0 0 8px rgba(255,215,0,0.3)';
        scale = 1.15;
        rankTitle = 'Builder';
        glowAnimation = 'pulseGold 2s infinite alternate';
    } else if (level >= 50 && level < 100) {
        borderColor = '#00ffff'; // Platinum / Cyan
        boxShadow = '0 0 20px rgba(0,255,255,0.8), inset 0 0 10px rgba(0,255,255,0.5)';
        scale = 1.25;
        rankTitle = 'Breaker';
        glowAnimation = 'pulseCyan 1.5s infinite alternate';
        extraFlair = (
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', fontSize: `${size * 0.4}px`, zIndex: 10 }}>👑</div>
        );
    } else if (level >= 100) {
        borderColor = '#ff00ff'; // Diamond / Ethereal
        boxShadow = '0 0 30px rgba(255,0,255,0.9), 0 0 10px rgba(0,255,255,0.8), inset 0 0 15px rgba(255,0,255,0.6)';
        scale = Math.min(1.5, 1.25 + ((level - 100) * 0.005)); // Continues to grow slowly up to 1.5x max
        rankTitle = 'Legend';
        glowAnimation = 'pulseDiamond 1s infinite alternate';
        extraFlair = (
            <div style={{ position: 'absolute', inset: '-5px', borderRadius: '50%', background: 'conic-gradient(from 0deg, #ff00ff, #00ffff, #ff00ff)', zIndex: 0, animation: 'spin 3s linear infinite', opacity: 0.6 }} />
        );
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${username || 'User'}&background=random&color=fff&bold=true`;

    return (
        <div 
            className="dynamic-badge-container" 
            title={`Level ${level} ${rankTitle} | ${xp} XP`}
            style={{ 
                position: 'relative', 
                width: `${size}px`, 
                height: `${size}px`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transform: `scale(${scale})`,
                transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
        >
            {extraFlair}
            <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                padding: '3px',
                background: borderColor, // acts as border
                zIndex: 1,
                boxShadow: boxShadow,
                animation: glowAnimation
            }}>
                <img 
                    src={avatarUrl || defaultAvatar} 
                    alt="User Avatar" 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        background: '#111'
                    }} 
                />
            </div>
            
            {/* Level indicator pill */}
            <div style={{
                position: 'absolute',
                bottom: '-4px',
                background: '#0a0a0a',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                padding: '0 6px',
                fontSize: `${size * 0.25}px`,
                fontWeight: 900,
                color: '#fff',
                zIndex: 5,
                boxShadow: '0 2px 4px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap'
            }}>
                LVL {level}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulseGold { from { box-shadow: 0 0 10px rgba(255,215,0,0.4); } to { box-shadow: 0 0 25px rgba(255,215,0,0.8); } }
                @keyframes pulseCyan { from { box-shadow: 0 0 15px rgba(0,255,255,0.5); } to { box-shadow: 0 0 35px rgba(0,255,255,1); } }
                @keyframes pulseDiamond { from { box-shadow: 0 0 20px rgba(255,0,255,0.6), 0 0 10px rgba(0,255,255,0.5); } to { box-shadow: 0 0 45px rgba(255,0,255,1), 0 0 25px rgba(0,255,255,0.9); } }
            `}} />
        </div>
    );
};

export default DynamicBadge;
