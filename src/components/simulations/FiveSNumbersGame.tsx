import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface NumberTile {
    id: number;
    value: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    color: string;
    font?: string;
    weight?: number;
}

export default function FiveSNumbersGame() {
    const { t } = useTranslation();
    const [phase, setPhase] = useState<'intro' | 'round1' | 'round2' | 'round3' | 'round4' | 'round5' | 'round6' | 'results'>('intro');
    const [currentNumber, setCurrentNumber] = useState(1);

    // Game State
    const [timeLeft, setTimeLeft] = useState(15);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Results
    const [scoreR1, setScoreR1] = useState(0);
    const [scoreR2, setScoreR2] = useState(0);
    const [scoreR3, setScoreR3] = useState(0);
    const [scoreR4, setScoreR4] = useState(0);

    // Missing Numbers Logic (Defect Detection)
    const [missingNumbers, setMissingNumbers] = useState<number[]>([]);
    const [foundMissing, setFoundMissing] = useState<number[]>([]);
    const [timeR5, setTimeR5] = useState<number>(0);
    const [timeR6, setTimeR6] = useState<number>(0);

    const timerRef = useRef<number | null>(null);

    // Generate the chaotic board (1-100)
    const chaoticBoard100 = useMemo(() => {
        const tiles: NumberTile[] = [];
        const fonts = ['"Times New Roman", serif', 'Georgia, serif', 'Arial, sans-serif', '"Courier New", monospace'];
        for (let i = 1; i <= 100; i++) {
            const x = 5 + Math.random() * 90;
            const y = 5 + Math.random() * 90;
            const rotation = (Math.random() - 0.5) * 90;
            const scale = 0.6 + Math.random() * 1.4;
            const font = fonts[Math.floor(Math.random() * fonts.length)];
            const weight = [400, 700, 900][Math.floor(Math.random() * 3)];
            tiles.push({ id: i, value: i, x, y, rotation, scale, color: '#f8fafc', font, weight });
        }
        return tiles;
    }, []);

    // Standardized Grid (1-49)
    const stdBoard = useMemo(() => {
        const tiles: NumberTile[] = [];
        let val = 1;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 10; col++) {
                if (val > 49) break;
                tiles.push({
                    id: val, value: val,
                    x: 5 + col * 10,
                    y: 20 + row * 15,
                    rotation: 0, scale: 1, color: '#f8fafc',
                    font: 'var(--font-main)', weight: 400
                });
                val++;
            }
        }
        return tiles;
    }, []);

    // Timer Logic
    useEffect(() => {
        if (isRunning) {
            timerRef.current = window.setInterval(() => {
                if (phase === 'round5' || phase === 'round6') {
                    setElapsedTime(prev => prev + 1);
                } else if (timeLeft > 0) {
                    setTimeLeft(prev => prev - 1);
                }
            }, 1000);
        }
        if (timeLeft === 0 && isRunning && phase !== 'round5' && phase !== 'round6') {
            endRound();
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRunning, timeLeft, phase]);

    const startRound = (newPhase: any) => {
        setPhase(newPhase);
        setCurrentNumber(1);
        setTimeLeft(15);
        setElapsedTime(0);

        if (newPhase === 'round5' || newPhase === 'round6') {
            const m1 = Math.floor(Math.random() * 49) + 1;
            let m2 = Math.floor(Math.random() * 49) + 1;
            while (m1 === m2) m2 = Math.floor(Math.random() * 49) + 1;
            setMissingNumbers([m1, m2]);
            setFoundMissing([]);
        }
        setIsRunning(true);
    };

    const endRound = () => {
        setIsRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
        const score = currentNumber - 1;

        if (phase === 'round1') setScoreR1(score);
        else if (phase === 'round2') setScoreR2(score);
        else if (phase === 'round3') setScoreR3(score);
        else if (phase === 'round4') setScoreR4(score);
        else if (phase === 'round5') setTimeR5(elapsedTime);
        else if (phase === 'round6') setTimeR6(elapsedTime);

        setPhase('intro');
        if (phase === 'round6') setPhase('results');
    };

    const handleTileClick = (val: number) => {
        if (!isRunning || phase === 'round5' || phase === 'round6') return;
        if (val === currentNumber) {
            if (currentNumber === 49) endRound();
            else setCurrentNumber(prev => prev + 1);
        }
    };

    const handleMissingGuess = (val: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const num = parseInt(val);
            if (missingNumbers.includes(num) && !foundMissing.includes(num)) {
                const newFound = [...foundMissing, num];
                setFoundMissing(newFound);
                e.currentTarget.value = '';
                e.currentTarget.style.backgroundColor = 'var(--accent-success)';
                if (newFound.length === 2) endRound();
            } else {
                e.currentTarget.style.backgroundColor = 'var(--accent-danger)';
                setTimeout(() => { if (e.currentTarget) e.currentTarget.style.backgroundColor = 'white'; }, 300);
            }
        }
    };

    const renderBoard = () => {
        const board = (phase === 'round4' || phase === 'round6') ? stdBoard : chaoticBoard100;

        return (
            <div style={{ position: 'relative', width: '100%', height: 'min(600px, 75vh)', background: 'var(--bg-dark)', border: '2px solid var(--border-light)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {/* 3x3 Grid Overlay for Round 3 & Round 5 (Visual Management) */}
                {(phase === 'round3' || phase === 'round5') && (
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', zIndex: 0 }}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} style={{ border: '1px solid rgba(255,255,255,0.1)' }}></div>
                        ))}
                    </div>
                )}

                {/* Grid for Standardized view (matching user image) */}
                {(phase === 'round4' || phase === 'round6') && (
                    <div style={{ position: 'absolute', top: '100px', left: '2.5%', right: '2.5%', bottom: '2.5%', display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', zIndex: 0 }}>
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div key={i} style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
                        ))}
                    </div>
                )}

                {(phase === 'round4' || phase === 'round6') && (
                    <div style={{ position: 'absolute', top: '20px', left: 0, right: 0, textAlign: 'center', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-headings)' }}>
                        Numbers 1 to 49
                    </div>
                )}

                {board.map((tile: NumberTile) => {
                    const isNext = tile.value === currentNumber;
                    // Only show the highlight (border) in Round 4 (Standardize) and beyond (Phase 5/6)
                    const showHighlight = isNext && (phase === 'round4' || phase === 'round5' || phase === 'round6');
                    const isDone = tile.value < currentNumber && phase.startsWith('round') && phase !== 'round5' && phase !== 'round6';
                    const isMissing = missingNumbers.includes(tile.value) && (phase === 'round5' || phase === 'round6');

                    // Filter logic: R2, R3, R4, R5, R6 only show 1-49
                    if (phase !== 'round1' && tile.value > 49) return null;
                    if (isMissing) return null;

                    return (
                        <div
                            key={tile.id}
                            onClick={() => handleTileClick(tile.value)}
                            style={{
                                position: 'absolute',
                                left: `${tile.x}%`,
                                top: `${tile.y}%`,
                                transform: `translate(-50%, -50%) rotate(${tile.rotation}deg) scale(${tile.scale})`,
                                color: isDone ? '#e2e8f0' : tile.color,
                                fontFamily: tile.font,
                                fontWeight: tile.weight,
                                fontSize: '1.8rem',
                                cursor: 'pointer',
                                userSelect: 'none',
                                zIndex: showHighlight ? 10 : 1,
                                border: showHighlight ? '3px solid var(--accent-primary)' : 'none',
                                padding: '5px',
                                borderRadius: '4px'
                            }}
                        >
                            {tile.value}
                        </div>
                    );
                })}

                {(phase === 'round5' || phase === 'round6') ? (
                    <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.9)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 100, backdropFilter: 'blur(8px)' }}>
                        <div style={{ fontWeight: '900', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{t('sim.5s.identify')}</div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input autoFocus type="number" onKeyDown={(e) => handleMissingGuess(e.currentTarget.value, e)} style={{ width: '80px', height: '50px', textAlign: 'center', fontSize: '1.5rem', color: '#000' }} />
                            <input type="number" onKeyDown={(e) => handleMissingGuess(e.currentTarget.value, e)} style={{ width: '80px', height: '50px', textAlign: 'center', fontSize: '1.5rem', color: '#000' }} />
                        </div>
                    </div>
                ) : (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.8)', padding: '0.75rem 1.5rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: '900', zIndex: 200, backdropFilter: 'blur(8px)' }}>
                        {t('sim.5s.find')}: {currentNumber} | {timeLeft}s
                    </div>
                )}
            </div>
        );
    };

    const renderIntro = () => {
        const rounds = [
            { id: 'round1', title: t('sim.5s.r1.title'), desc: t('sim.5s.r1.desc'), score: scoreR1 },
            { id: 'round2', title: t('sim.5s.r2.title'), desc: t('sim.5s.r2.desc'), score: scoreR2 },
            { id: 'round3', title: t('sim.5s.r3.title'), desc: t('sim.5s.r3.desc'), score: scoreR3 },
            { id: 'round4', title: t('sim.5s.r4.title'), desc: t('sim.5s.r4.desc'), score: scoreR4 },
            { id: 'round5', title: t('sim.5s.r5.title'), desc: t('sim.5s.r5.desc'), time: timeR5 },
            { id: 'round6', title: t('sim.5s.r6.title'), desc: t('sim.5s.r6.desc'), time: timeR6 }
        ];

        const nextRoundIndex = [scoreR1, scoreR2, scoreR3, scoreR4, timeR5, timeR6].findIndex(v => v === 0);
        const current = rounds[nextRoundIndex > -1 ? nextRoundIndex : 0];

        return (
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '2rem auto' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-headings)' }}>{current.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '2rem' }}>{current.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {rounds.map(r => (
                        <div key={r.id} style={{ position: 'relative', padding: '1rem', background: 'var(--bg-panel)', borderRadius: '1rem', opacity: r.id === current.id ? 1 : 0.4, border: r.id === current.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)', boxShadow: r.id === current.id ? '0 0 20px rgba(249, 115, 22, 0.2)' : 'none' }}>
                            {r.id === current.id && <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.65rem', fontWeight: '900', boxShadow: '0 4px 10px rgba(249, 115, 22, 0.4)' }}>{t('macro.badge')}</span>}
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: r.id === current.id ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{r.title.split(':')[0]}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{r.time ? `${r.time}s` : r.score || '-'}</div>
                        </div>
                    ))}
                </div>
                <button className="promo-pulse-btn" style={{ padding: '1rem 3rem', fontSize: '1.5rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '2rem', color: 'white', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => startRound(current.id)}>{t('sim.5s.start')} {current.title.toUpperCase()}</button>
            </div>
        );
    };

    const renderResults = () => (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '2rem auto' }}>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent-success)', fontFamily: 'var(--font-headings)', fontWeight: '900' }}>{t('sim.5s.complete')}</h2>
            <div style={{ background: 'var(--bg-panel)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', margin: '2rem 0', textAlign: 'left' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>{t('sim.5s.lessons')}:</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', listStyle: 'none', padding: 0 }}>
                    <li style={{ color: 'var(--text-main)' }}>✅ <strong>{t('sim.5s.lesson1.title')}:</strong> {t('sim.5s.lesson1.desc')}</li>
                    <li style={{ color: 'var(--text-main)' }}>✅ <strong>{t('sim.5s.lesson2.title')}:</strong> {t('sim.5s.lesson2.desc')}</li>
                    <li style={{ color: 'var(--text-main)' }}>✅ <strong>{t('sim.5s.lesson3.title')}:</strong> {t('sim.5s.lesson3.desc', { timeStandard: timeR6, timeChaos: timeR5 })}</li>
                </ul>
            </div>
            <button className="promo-pulse-btn" style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '2rem', color: 'white', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { setScoreR1(0); setScoreR2(0); setScoreR3(0); setScoreR4(0); setTimeR5(0); setTimeR6(0); setPhase('intro'); }}>{t('sim.5s.restart')}</button>
        </div>
    );

    return (
        <div style={{ padding: '2rem' }}>
            {phase === 'intro' ? renderIntro() : phase === 'results' ? renderResults() : renderBoard()}
        </div>
    );
}
