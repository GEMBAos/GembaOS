/**
 * ARCHIVE NOTICE
 * Original Use: Used for training curriculum delivery.
 * Moved to: unused_modules
 */



import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeanAcademy from './tools/LeanAcademy';
import FiveWhys from './tools/FiveWhys';
import PCMacroBuilder from './tools/PCMacroBuilder';
import SimulationsHub from './simulations/SimulationsHub';
import CommunicationBestPractices from './tools/CommunicationBestPractices';
import WeeklyBingoCard from './tools/WeeklyBingoCard';
import KPIDictionary from './tools/KPIDictionary';
import AcronymDictionary from './tools/AcronymDictionary';

type TrainingView = 'main' | 'academy' | 'simulations' | 'fivewhys' | 'macro' | 'communication' | 'kpi_dictionary' | 'acronym_dictionary';

export default function TrainingHub({ onNavigateBack }: { onNavigateBack: () => void }) {
    useTranslation();
    const [subView, setSubView] = useState<TrainingView>('main');
    const [showBingo, setShowBingo] = useState(false);

    const renderSubView = () => {
        switch (subView) {
            case 'academy':
                return <LeanAcademy />;
            case 'fivewhys':
                return <FiveWhys />;
            case 'macro':
                return <PCMacroBuilder />;
            case 'communication':
                return <CommunicationBestPractices />;
            case 'kpi_dictionary':
                return <KPIDictionary onClose={() => setSubView('main')} />;
            case 'acronym_dictionary':
                return <AcronymDictionary />;
            case 'simulations':
                return <SimulationsHub />;
            default:
                return (
                    <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <header style={{ textAlign: 'left', marginBottom: '1rem' }}>
                            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px' }}>
                                Training & Academy
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                                Master Lean principles through interactive courses and simulations.
                            </p>
                        </header>

                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                            🧠 Educating (Learning & Concepts)
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {/* Lean Academy */}
                            <button className="training-card" onClick={() => setSubView('academy')} style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                                <div className="card-icon" style={{ color: 'var(--accent-primary)' }}>🎓</div>
                                <div className="card-body">
                                    <h3>Lean Academy</h3>
                                    <p>Comprehensive curriculum with visual lessons and real-world homework.</p>
                                    <div className="card-meta">5 Modules • Earn XP</div>
                                </div>
                            </button>

                            {/* Communication Best Practices */}
                            <button className="training-card" onClick={() => setSubView('communication')} style={{ borderLeft: '4px solid #ffffff', background: 'rgba(245, 158, 11, 0.05)' }}>
                                <div className="card-icon" style={{ color: '#ffffff' }}>🗣️</div>
                                <div className="card-body">
                                    <h3>Lean Communication</h3>
                                    <p>Eliminate waste in emails, trim down meetings, and master the art of brevity.</p>
                                    <div className="card-meta">Soft Skills • Efficiency</div>
                                </div>
                            </button>

                            {/* KPI Dictionary */}
                            <button className="training-card" onClick={() => setSubView('kpi_dictionary')} style={{ borderLeft: '4px solid #71717a', background: 'rgba(139, 92, 246, 0.05)' }}>
                                <div className="card-icon" style={{ color: '#71717a' }}>📊</div>
                                <div className="card-body">
                                    <h3>KPI & Metrics Dictionary</h3>
                                    <p>Glossary of operational metrics, formulas, and how to improve them.</p>
                                    <div className="card-meta">Leadership • Data</div>
                                </div>
                            </button>

                            {/* Acronym Dictionary */}
                            <button className="training-card" onClick={() => setSubView('acronym_dictionary')} style={{ borderLeft: '4px solid #ec4899', background: 'rgba(236, 72, 153, 0.05)' }}>
                                <div className="card-icon" style={{ color: '#ec4899' }}>📖</div>
                                <div className="card-body">
                                    <h3>Acronym Dictionary</h3>
                                    <p>Decode plant terminology and submit new acronyms.</p>
                                    <div className="card-meta">Glossary • Community</div>
                                </div>
                            </button>
                        </div>

                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '3rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                            🛠️ Doing (Simulations & Application)
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {/* 5 Whys */}
                            <button className="training-card" onClick={() => setSubView('fivewhys')} style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                                <div className="card-icon" style={{ color: 'var(--accent-secondary)' }}>🔍</div>
                                <div className="card-body">
                                    <h3>5 Whys Investigator</h3>
                                    <p>A guided tool to drill down to the true root cause of any problem.</p>
                                    <div className="card-meta">RCA Tool • Guided</div>
                                </div>
                            </button>

                            {/* Simulations */}
                            <button className="training-card" onClick={() => setSubView('simulations')} style={{ borderLeft: '4px solid var(--accent-success)' }}>
                                <div className="card-icon" style={{ color: 'var(--accent-success)' }}>🕹️</div>
                                <div className="card-body">
                                    <h3>Simulations Hub</h3>
                                    <p>Play interactive games like 5S Numbers, Dice Flow, and Spot the Waste.</p>
                                    <div className="card-meta">7 Games • Interactive</div>
                                </div>
                            </button>

                            {/* PC Macro Builder */}
                            <button className="training-card" onClick={() => setSubView('macro')} style={{ borderLeft: '4px solid var(--accent-primary)', background: 'rgba(14, 165, 233, 0.05)' }}>
                                <div className="card-icon" style={{ color: 'var(--accent-primary)' }}>💻</div>
                                <div className="card-body">
                                    <h3>PC Macro Builder</h3>
                                    <p>Automate repetitive digital tasks with Stream Deck compatible actions.</p>
                                    <div className="card-meta">Digital Lean • Automation</div>
                                </div>
                            </button>

                            {/* Weekly Bingo */}
                            <button className="training-card" onClick={() => setShowBingo(true)} style={{ borderLeft: '4px solid var(--accent-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                                <div className="card-icon" style={{ color: 'var(--accent-success)' }}>🎲</div>
                                <div className="card-body">
                                    <h3>Weekly Kaizen Bingo</h3>
                                    <p>Gamify your continuous improvement journey with weekly challenges.</p>
                                    <div className="card-meta">Gamification • Activities</div>
                                </div>
                            </button>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button className="btn btn-secondary" onClick={onNavigateBack}>
                                ← Back to Portal
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ padding: 'max(1.5rem, 3vw)', height: '100%', overflowY: 'auto' }}>
            {subView !== 'main' && (
                <div style={{ maxWidth: '100%', margin: '0 auto 1.5rem auto' }}>
                    <button className="btn btn-secondary" onClick={() => setSubView('main')}>
                        ← Back to Academy
                    </button>
                </div>
            )}

            {renderSubView()}

            {showBingo && <WeeklyBingoCard onClose={() => setShowBingo(false)} />}

            <style dangerouslySetInnerHTML={{
                __html: `
                .training-card {
                    display: flex;
                    gap: 1.5rem;
                    padding: 1.5rem;
                    background: var(--bg-panel);
                    border: 1px solid var(--border-light);
                    border-radius: 1rem;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .training-card:hover {
                    transform: translateY(-5px);
                    background: var(--bg-dark);
                    border-color: rgba(255,255,255,0.2);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
                }
                .card-icon {
                    font-size: 2.5rem;
                    width: 70px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.03);
                    border-radius: 0.75rem;
                    flex-shrink: 0;
                }
                .card-body h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--text-main);
                    font-size: 1.25rem;
                    font-weight: 800;
                }
                .card-body p {
                    margin: 0 0 1rem 0;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                .card-meta {
                    font-size: 0.75rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    opacity: 0.6;
                }
            `}} />
        </div>
    );
}
