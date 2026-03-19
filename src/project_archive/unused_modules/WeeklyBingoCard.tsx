/**
 * ARCHIVE NOTICE
 * Original Use: Used as a gamified bingo card.
 * Moved to: unused_modules
 */

import { useState } from 'react';

// A mix of behavioral and physical 5S/Lean tasks that are achievable in ~5-15 mins each.
const BINGO_TASKS = [
    "Label one unmarked tool/bin",
    "Submit 1 Just-Fix-It (JFI) idea",
    "Empty a trash bin before it overflows",
    "Decline a meeting with no agenda",
    "Write a concise email (under 5 sentences)",
    "Clean your keyboard and monitor",
    "Standardize one desk drawer",
    "Praise a coworker's Lean effort",
    "Throw away an expired item in the fridge",
    "Remove one duplicate file from your PC",
    "Ask 'Why?' 5 times to a problem today",
    "Conduct a 15-min Gemba walk",
    "Update one outdated SOP or instruction",
    "Turn off power to an idle machine",
    "Reduce the time of a daily meeting by 15m",
    "Create a shadow board for your desk tools",
    "Walk the floor and greet 3 operators",
    "Fix a tripping hazard or safety issue",
    "Clear your email inbox to under 10 unread",
    "Donate or discard a tool you haven't used in 6mo",
    "Identify a bottleneck and propose a fix",
    "Remove 'we have always done it this way' from vocabulary",
    "Document one 'Quick Win' with a photo",
    "Review standard work with an operator",
    "Replace a worn-out floor tape or label",
    "Eliminate a redundant data entry step",
    "Check all fire extinguisher paths (Clear?)",
    "Create a Kanban card for a low supply item",
    "Organize a shared digital folder",
    "Digitize one paper form/checklist"
];

function shuffleArray(array: string[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

interface WeeklyBingoProps {
    onClose: () => void;
}

export default function WeeklyBingoCard({ onClose }: WeeklyBingoProps) {
    const [board] = useState<string[]>(() => {
        const gembaTask = "Conduct a 15-min Gemba walk";
        const otherTasks = BINGO_TASKS.filter(task => task !== gembaTask);
        const shuffledOther = shuffleArray(otherTasks).slice(0, 23);
        const finalBoard = [gembaTask, ...shuffledOther];
        finalBoard.splice(12, 0, "FREE SPACE (Gemba Magic)"); // Insert at index 12 (center of 5x5)
        return finalBoard;
    });

    const printCard = () => {
        window.print();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
            padding: '2rem'
        }}>
            <div className="card bingo-card-print" style={{
                maxWidth: '850px', width: '100%', maxHeight: '95vh', overflowY: 'auto',
                background: 'white', color: 'black', padding: '2rem',
                borderRadius: '1rem',
                border: '4px solid var(--accent-primary)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#0f172a', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Weekly Kaizen Bingo
                        </h2>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '1rem' }}>
                            Mark off squares as you complete them. Get 5 in a row (or blackout) and turn this into your manager by Friday!
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }} className="no-print">
                        <button className="btn btn-primary" onClick={printCard} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🖨️ Print Card
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '4px',
                    background: '#0f172a', /* dark borders */
                    border: '4px solid #0f172a',
                    borderRadius: '0.5rem'
                }}>
                    {board.map((task, idx) => {
                        const isFreeSpace = idx === 12;
                        return (
                            <div key={idx} style={{
                                background: isFreeSpace ? '#f8fafc' : 'white',
                                aspectRatio: '1', /* Square */
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '0.5rem',
                                fontSize: isFreeSpace ? '1.1rem' : '0.9rem',
                                fontWeight: isFreeSpace ? 900 : 500,
                                color: isFreeSpace ? 'var(--accent-primary)' : '#1e293b',
                                border: '1px solid #e2e8f0'
                            }}>
                                {isFreeSpace && <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>⭐</span>}
                                <span>{task}</span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #cbd5e1', paddingTop: '1rem' }}>
                    <div style={{ color: '#475569', fontWeight: 'bold' }}>Name: ________________________</div>
                    <div style={{ color: '#475569', fontWeight: 'bold' }}>Date: ________________________</div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .bingo-card-print, .bingo-card-print * {
                        visibility: visible;
                    }
                    .bingo-card-print {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        margin: 0 !important;
                        border: none !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}} />
        </div>
    );
}
