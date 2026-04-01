/**
 * ARCHIVE NOTICE
 * Original Use: Used as an embedded learning module.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { userService } from '../../services/userService';
import BumpingSimulation from './simulations/BumpingSimulation';

// Hardcoded Curriculum for MVP with intense, visual lessons
export interface LeanLesson {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
}

export interface LeanHomeworkTask {
    id: string;
    prompt: string;
    requiresPhoto: boolean;
    requiresDescription: boolean;
    minSubmissions: number;
}

export interface LeanModule {
    id: string;
    title: string;
    description: string;
    rewardPoints: number;
    lessons: LeanLesson[];
    homeworkDescription: string;
    homeworkTasks: LeanHomeworkTask[];
}

const LEAN_ACADEMY_MODULES: LeanModule[] = [
    {
        id: 'module-1',
        title: 'Lean 101: Value Add vs. Non-Value Add',
        description: 'Understand the fundamental principles of continuous improvement and identify waste in your own area.',
        rewardPoints: 1000,
        lessons: [
            {
                id: 'l1',
                title: 'What is Value Add (VA)?',
                content: 'In Lean, a process is only "Value Add" if it meets THREE strict criteria: 1) The customer is willing to pay for it. 2) The product or information physically transforms. 3) It is done right the first time. If it fails any of these, it is waste. Everything else is NVA (Non-Value Add).'
            },
            {
                id: 'l2',
                title: 'The 8 Wastes (DOWNTIME)',
                content: 'Waste is anything that consumes resources but adds no value to the customer. Memorize DOWNTIME: Defects, Overproduction, Waiting, Non-utilized Talent, Transportation, Inventory, Motion, Extra-Processing. Your job is to physically see these on the shop floor.'
            },
            {
                id: 'l3',
                title: 'Training the Eye to See',
                content: 'We often become "waste blind" because we are so used to our daily struggles. To see waste, you must stand in the Gemba (the real place) and observe relentlessly. Don\'t fix it immediately in your mind—just observe it.'
            }
        ],
        homeworkDescription: 'To prove you understand, you must photograph and describe both Value Add and Non-Value Add activities directly within your job role. Identify the NVA and immediately propose a Just-Fix-It (JFI) to eliminate it.',
        homeworkTasks: [
            {
                id: 't1',
                prompt: 'Identify and photograph 5 Value Add activities in your process.',
                requiresPhoto: true,
                requiresDescription: true,
                minSubmissions: 5
            },
            {
                id: 't2',
                prompt: 'Identify and photograph 5 Non-Value Add (Waste) activities in your process, and describe how you will eliminate them (JFI).',
                requiresPhoto: true,
                requiresDescription: true,
                minSubmissions: 5
            }
        ]
    },
    {
        id: 'module-2',
        title: 'Lean 102: Visual Management & 5S',
        description: 'Learn how to make abnormalities immediately obvious to anyone walking by in 3 seconds or less.',
        rewardPoints: 1500,
        lessons: [
            {
                id: 'l3',
                title: 'The 3-Second Rule',
                content: 'A process should be so comprehensively visual that anyone walking by can tell if you are winning or losing in 3 seconds or less. If they have to ask questions, your visual management has failed.'
            },
            {
                id: 'l4',
                title: '5S Principles',
                content: 'Sort: Eliminate what is not needed. Set in Order: A place for everything, and everything in its place. Shine: Clean to inspect. Standardize: Create rules to maintain the first 3S. Sustain: Build the discipline to follow the rules.'
            }
        ],
        homeworkDescription: 'Apply 5S to a small, messy workstation, drawer, or digital folder structure.',
        homeworkTasks: [
            {
                id: 't3',
                prompt: 'Take a "Before" photo of the messy area and describe the wastes present.',
                requiresPhoto: true,
                requiresDescription: true,
                minSubmissions: 1
            },
            {
                id: 't4',
                prompt: 'Take an "After 5S" photo of the area and describe the improvements made.',
                requiresPhoto: true,
                requiresDescription: true,
                minSubmissions: 1
            }
        ]
    },
    {
        id: 'module-3',
        title: 'Lean 103: Baton-Zone (Bumping) Flow',
        description: 'See why passing products smoothly between workers is faster than piling up huge batches of waste. En la producción por lotes (Batch), el material espera. En Bumping, el material fluye.',
        rewardPoints: 2000,
        lessons: [
            {
                id: 'l5',
                title: 'The Disease of Batching',
                content: 'Building 10 things at once feels efficient to the operator, but it creates huge delays for the customer. Piles of inventory hide defects and slow down cycle times.'
            },
            {
                id: 'l6',
                title: 'Baton-Zone (Bumping)',
                content: 'Instead of staying at one station, operators take a product and walk it down the line until they "bump" into the next available operator. They hand it off (like a baton) and walk back to get another piece. This enables One-Piece Flow.'
            }
        ],
        homeworkDescription: 'Run the interactive Bumping Simulation below in both English and Spanish.',
        homeworkTasks: [
            {
                id: 't5',
                prompt: 'What was the cycle time difference between Batching and Flow in the simulation? Provide a screenshot.',
                requiresPhoto: true,
                requiresDescription: true,
                minSubmissions: 1
            }
        ]
    }
];

export default function LeanAcademy() {
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);

    // Structure: submissions[moduleId][taskId] = Array of { photoUrl, description }
    const [submissions, setSubmissions] = useState<Record<string, Record<string, { photoUrl?: string, description: string }[]>>>({});
    const [awardNotification, setAwardNotification] = useState<{points: number, visible: boolean}>({ points: 0, visible: false });

    useEffect(() => {
        const savedProgress = localStorage.getItem('kaizen_academy_progress');
        if (savedProgress) {
            try { setCompletedModules(JSON.parse(savedProgress)); } catch (e) { console.error(e); }
        }

        const savedSubmissions = localStorage.getItem('kaizen_academy_submissions');
        if (savedSubmissions) {
            try { setSubmissions(JSON.parse(savedSubmissions)); } catch (e) { console.error(e); }
        }
    }, []);

    const completeModule = async (moduleId: string) => {
        const mod = LEAN_ACADEMY_MODULES.find(m => m.id === moduleId);
        if (!mod) return;

        const newCompleted = [...completedModules, moduleId];
        setCompletedModules(newCompleted);
        localStorage.setItem('kaizen_academy_progress', JSON.stringify(newCompleted));
        
        // Award XP
        try {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user?.id) {
                await userService.addXP(data.session.user.id, mod.rewardPoints);
            }
        } catch (e) {
            console.error('Error awarding XP:', e);
        }

        setAwardNotification({ points: mod.rewardPoints, visible: true });
        
        setTimeout(() => {
            setAwardNotification({ points: mod.rewardPoints, visible: false });
        }, 5000);
    };

    const handleSubmissionChange = (moduleId: string, taskId: string, index: number, field: 'photoUrl' | 'description', value: string) => {
        setSubmissions(prev => {
            const modSubs = prev[moduleId] || {};
            const taskSubs = modSubs[taskId] || [];

            // Ensure array has the item
            const newSubs = [...taskSubs];
            if (!newSubs[index]) newSubs[index] = { description: '' };

            newSubs[index] = { ...newSubs[index], [field]: value };

            const updated = {
                ...prev,
                [moduleId]: {
                    ...modSubs,
                    [taskId]: newSubs
                }
            };
            localStorage.setItem('kaizen_academy_submissions', JSON.stringify(updated));
            return updated;
        });
    };

    const handleProofUpload = (moduleId: string, taskId: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    handleSubmissionChange(moduleId, taskId, index, 'photoUrl', event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const addSubmissionItem = (moduleId: string, taskId: string) => {
        setSubmissions(prev => {
            const modSubs = prev[moduleId] || {};
            const taskSubs = modSubs[taskId] || [];
            const updated = {
                ...prev,
                [moduleId]: {
                    ...modSubs,
                    [taskId]: [...taskSubs, { description: '' }]
                }
            };
            localStorage.setItem('kaizen_academy_submissions', JSON.stringify(updated));
            return updated;
        });
    };

    const hasMetRequirements = (mod: LeanModule) => {
        return mod.homeworkTasks.every(task => {
            const taskSubs = submissions[mod.id]?.[task.id] || [];
            if (taskSubs.length < task.minSubmissions) return false;

            // Check that all required submissions meet criteria
            return taskSubs.slice(0, task.minSubmissions).every(sub => {
                if (task.requiresDescription && (!sub.description || sub.description.trim() === '')) return false;
                if (task.requiresPhoto && !sub.photoUrl) return false;
                return true;
            });
        });
    };

    const progressPercentage = Math.round((completedModules.length / LEAN_ACADEMY_MODULES.length) * 100);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-headings)' }}>
                        Lean Leader Academy
                    </h2>
                    <p style={{ color: 'var(--steel-gray)', fontSize: '1.3rem', margin: 0 }}>Intense, visual learning modules to forge true Lean Leaders.</p>
                </div>

                <div style={{ background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', minWidth: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Overall Progress</span>
                        <span style={{ color: 'var(--accent-primary)' }}>{progressPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'var(--bg-dark)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.4s ease' }}></div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
                {/* Module List Sidebar */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-headings)' }}>Curriculum Roadmap</h3>
                    {LEAN_ACADEMY_MODULES.map((mod, index) => {
                        const isCompleted = completedModules.includes(mod.id);
                        const isSelected = selectedModule === mod.id;

                        return (
                            <div
                                key={mod.id}
                                onClick={() => setSelectedModule(mod.id)}
                                style={{
                                    padding: '1.5rem',
                                    background: isSelected ? 'var(--bg-panel-hover)' : 'var(--bg-panel)',
                                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : isCompleted ? 'var(--accent-success)' : 'var(--border-color)'}`,
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    transition: 'all 0.2s',
                                    boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: isCompleted ? 'var(--accent-success)' : 'var(--bg-dark)',
                                        color: isCompleted ? 'white' : 'var(--text-muted)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--lean-white)', fontSize: '1.4rem', marginBottom: '0.4rem', lineHeight: '1.3' }}>{mod.title}</div>
                                        <div style={{ fontSize: '1.1rem', color: 'var(--zone-yellow)', fontWeight: 'bold' }}>⭐ {mod.rewardPoints} XP</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Module Content Viewer */}
                <div className="card" style={{ flex: '2 1 min(100%, 600px)', minHeight: '600px', display: 'flex', flexDirection: 'column', padding: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
                    {selectedModule ? (() => {
                        const mod = LEAN_ACADEMY_MODULES.find(m => m.id === selectedModule)!;
                        const isCompleted = completedModules.includes(mod.id);
                        const metReqs = hasMetRequirements(mod);

                        return (
                            <>
                                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'var(--accent-primary)', fontFamily: 'var(--font-headings)' }}>{mod.title}</h2>
                                    <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '1.25rem', lineHeight: '1.7' }}>{mod.description}</p>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
                                        {mod.lessons.map(lesson => (
                                            <div key={lesson.id} style={{
                                                background: 'var(--bg-dark)',
                                                padding: 'clamp(1.25rem, 3vw, 2rem)',
                                                borderRadius: '0.5rem',
                                                borderLeft: '6px solid var(--zone-yellow)'
                                            }}>
                                                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--lean-white)', fontSize: '1.6rem', fontFamily: 'var(--font-headings)' }}>{lesson.title}</h4>
                                                <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.8', fontSize: '1.2rem' }}>{lesson.content}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Custom Simulation Injector */}
                                    {mod.id === 'module-3' && (
                                        <div style={{ padding: '1rem', background: '#000', border: '1px solid #333', borderRadius: '12px', marginBottom: '3rem' }}>
                                            <BumpingSimulation />
                                        </div>
                                    )}

                                    {/* Advanced Homework Section */}
                                    <div style={{
                                        padding: '2rem',
                                        background: 'rgba(249, 115, 22, 0.05)',
                                        border: '1px solid var(--accent-primary)',
                                        borderRadius: '0.75rem',
                                        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.8rem', fontFamily: 'var(--font-headings)' }}>
                                            📋 Actionable Homework Requirements
                                        </h3>
                                        <p style={{ margin: '0 0 2rem 0', color: '#e2e8f0', fontSize: '1.2rem', lineHeight: '1.7' }}>{mod.homeworkDescription}</p>

                                        {mod.homeworkTasks.map(task => {
                                            const subs = submissions[mod.id]?.[task.id] || [];
                                            // Ensure we always render at least 'minSubmissions' input groups if not completed
                                            const renderCount = Math.max(task.minSubmissions, subs.length);

                                            // Generate array of indices to render
                                            const indices = Array.from({ length: renderCount }, (_, i) => i);

                                            return (
                                                <div key={task.id} style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--bg-panel)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                                                    <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--lean-white)', fontSize: '1.3rem' }}>{task.prompt}</h4>
                                                    <div style={{ fontSize: '1rem', color: 'var(--zone-yellow)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                                                        Requires: {task.minSubmissions} Submissions
                                                    </div>

                                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                                        {indices.map(idx => {
                                                            const sub = subs[idx] || { description: '' };
                                                            return (
                                                                <div key={idx} style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: 'clamp(1rem, 2vw, 1.5rem)',
                                                                    background: 'var(--bg-dark)',
                                                                    padding: 'clamp(1rem, 2vw, 1.5rem)',
                                                                    borderRadius: '0.5rem',
                                                                    border: '1px dashed var(--border-color)'
                                                                }}>
                                                                    {/* Inputs Wrapper for Desktop Splitting */}
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                                                                    {/* Photo Column */}
                                                                    {task.requiresPhoto && (
                                                                        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Photo Evidence {idx + 1}</label>
                                                                            {!isCompleted && (
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    onChange={(e) => handleProofUpload(mod.id, task.id, idx, e)}
                                                                                    style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                                                                                />
                                                                            )}
                                                                            {sub.photoUrl ? (
                                                                                <img src={sub.photoUrl} alt="Proof" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.25rem', marginTop: '0.5rem' }} />
                                                                            ) : (
                                                                                <div style={{ width: '100%', height: '120px', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                                                    No photo uploaded
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Description Column */}
                                                                    {task.requiresDescription && (
                                                                        <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Description / JFI Proposal {idx + 1}</label>
                                                                            <textarea
                                                                                value={sub.description}
                                                                                onChange={(e) => handleSubmissionChange(mod.id, task.id, idx, 'description', e.target.value)}
                                                                                placeholder="Describe your observation in detail..."
                                                                                disabled={isCompleted}
                                                                                style={{
                                                                                    flex: 1,
                                                                                    resize: 'vertical',
                                                                                    minHeight: '120px',
                                                                                    background: 'var(--bg-panel)',
                                                                                    color: 'var(--text-main)',
                                                                                    border: '1px solid var(--border-color)',
                                                                                    borderRadius: '0.25rem',
                                                                                    padding: '0.75rem',
                                                                                    fontFamily: 'inherit',
                                                                                    opacity: isCompleted ? 0.7 : 1
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {!isCompleted && (
                                                        <button
                                                            onClick={() => addSubmissionItem(mod.id, task.id)}
                                                            style={{
                                                                marginTop: '1rem',
                                                                background: 'none',
                                                                border: '1px dashed var(--accent-primary)',
                                                                color: 'var(--accent-primary)',
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '0.25rem',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            + Add Extra Submission beyond minimum
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {!isCompleted ? (
                                            <button
                                                onClick={() => completeModule(mod.id)}
                                                className="btn btn-primary"
                                                disabled={!metReqs}
                                                style={{
                                                    width: '100%',
                                                    padding: '1.25rem',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold',
                                                    background: metReqs ? 'var(--accent-primary)' : 'var(--bg-dark)',
                                                    color: metReqs ? '#000' : 'var(--text-main)',
                                                    border: metReqs ? 'none' : '2px dashed var(--border-light)',
                                                    cursor: metReqs ? 'pointer' : 'not-allowed',
                                                    opacity: metReqs ? 1 : 0.7,
                                                    boxShadow: metReqs ? '0 4px 14px 0 rgba(249, 115, 22, 0.39)' : 'none',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                {metReqs ? `Submit Portfolio & Claim ${mod.rewardPoints} XP` : 'Complete all mandatory photo and description fields to unlock'}
                                            </button>
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                padding: '1.25rem',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                background: 'var(--accent-success)',
                                                color: 'white',
                                                textAlign: 'center',
                                                borderRadius: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                ✓ Module Mastered  |  {mod.rewardPoints} XP Awarded
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        );
                    })() : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '6rem' }}>🎓</div>
                            <h3 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-headings)' }}>Select a Module</h3>
                            <p style={{ margin: 0, textAlign: 'center', maxWidth: '500px', fontSize: '1.2rem', lineHeight: '1.6' }}>Choose a module from the left to dive into intense visual learning and field assignments.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* XP Gamification Overlay */}
            {awardNotification.visible && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 5, 5, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ background: 'var(--bg-panel)', padding: 'clamp(2rem, 5vh, 4rem)', borderRadius: '1rem', border: '2px solid var(--zone-yellow)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 0 50px rgba(255, 194, 14, 0.4)', textAlign: 'center', minWidth: '300px' }}>
                        <div style={{ fontSize: '6rem', lineHeight: 1, textShadow: '0 0 20px rgba(255, 194, 14, 0.8)' }}>⭐</div>
                        <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--lean-white)', fontFamily: 'var(--font-headings)' }}>MODULE MASTERED</h2>
                        <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--zone-yellow)', fontWeight: 800 }}>+{awardNotification.points} XP</div>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Your Lean Leader profile has been updated!</p>
                        <button onClick={() => setAwardNotification({points: 0, visible: false})} className="shadow-btn" style={{ marginTop: '1rem', padding: '1rem 3rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--lean-white)', cursor: 'pointer', fontWeight: 800, letterSpacing: '1px', transition: 'all 0.2s' }}>
                            CONTINUE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
