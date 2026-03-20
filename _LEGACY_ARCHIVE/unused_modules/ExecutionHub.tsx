/**
 * ARCHIVE NOTICE
 * Original Use: Used for execution tracking and projects.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import type { KaizenProject, KaizenPhase } from '../types';
import ProjectDashboard from './execution/ProjectDashboard';
import ProjectCharter from './ProjectCharter';
import { storageService } from '../services/storageService';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

interface ExecutionHubProps {
    onNavigateBack: () => void;
    project: KaizenProject | null;
    setProject: (p: KaizenProject | null) => void;
    onViewSpatial: (modelUrl: string) => void;
}

export default function ExecutionHub({ onNavigateBack, project, setProject, onViewSpatial }: ExecutionHubProps) {
    const { t } = useTranslation();
    const [isCreating, setIsCreating] = useState(false);
    const [projects, setProjects] = useState<KaizenProject[]>([]);

    const loadProjects = () => {
        storageService.seedDemoDataIfNeeded();
        setProjects(storageService.getProjects());
    };

    useEffect(() => {
        loadProjects();
        const handleUpdate = () => loadProjects();
        window.addEventListener('kaizen_data_updated', handleUpdate);
        return () => window.removeEventListener('kaizen_data_updated', handleUpdate);
    }, []);

    const activeProjectCount = projects.length;
    const completedTasksCount = projects.reduce((acc, p) => acc + p.phases.filter(ph => ph.status === 'completed').length, 0);

    const handleCharterComplete = (newProject: KaizenProject) => {
        storageService.saveProject(newProject);
        setProject(newProject);
        setIsCreating(false);
    };

    const handleDeleteProject = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project?')) {
            storageService.deleteProject(id);
            if (project?.id === id) setProject(null);
        }
    };

    const handleUpdateProject = (updated: KaizenProject) => {
        storageService.saveProject(updated);
        setProject(updated);
    };

    const activeProjectId = project?.id;

    if (isCreating) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => setIsCreating(false)}>
                        {t('executionHub.backToRoadmaps')}
                    </button>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{t('executionHub.createNewRoadmap')}</h1>
                </div>
                <ProjectCharter
                    project={null}
                    setProject={handleCharterComplete}
                    onComplete={() => { }}
                />
            </div>
        );
    }

    if (project) {
        return (
            <ProjectDashboard
                project={project}
                onBack={() => setProject(null)}
                onUpdateProject={handleUpdateProject}
                onViewSpatial={onViewSpatial}
            />
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header with Stats */}
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 950, letterSpacing: '-1px' }}>
                        {t('executionHub.title')}
                    </h1>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>
                        {t('executionHub.desc')}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{activeProjectCount}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('executionHub.activeProjects')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>{completedTasksCount}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('executionHub.milestonesDone')}</div>
                    </div>
                </div>
            </header>

            {/* Quick Actions for Execution */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={async () => {
                        try {
                            const { data: { session } } = await supabase.auth.getSession();
                            if (session?.user) {
                                await supabase.from('profiles').update({ xp: 10 }).eq('id', session.user.id);
                                alert("Awesome job! Your streak has been updated! 🎉");
                            }
                        } catch (err) {
                            console.log("No active user for streak update");
                        }
                        window.open('https://form.jotform.com/233406028319149', '_blank');
                    }}
                    style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid #ffffff', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {t('executionHub.submitJfi')}
                </button>
                <button
                    onClick={() => window.open('https://padlet.com/leanballers/just-fix-it-npfyeasab7v06qb8', '_blank')}
                    style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-light)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {t('executionHub.gembaVideos')}
                </button>
                <button
                    onClick={() => window.open('https://app.gembadocs.com/', '_blank')}
                    style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {t('executionHub.gembaDocs')}
                </button>
            </div>

            {/* Project List / Grid */}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>{t('executionHub.yourRoadmaps')}</h2>
                    <button className="promo-pulse-btn" style={{ border: 'none', padding: '0.6rem 1.5rem' }} onClick={() => setIsCreating(true)}>
                        {t('executionHub.startNewProject')}
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--border-light)', background: 'transparent' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h3>{t('executionHub.noProjectsTitle')}</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 2rem' }}>
                            {t('executionHub.noProjectsDesc')}
                        </p>
                        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>{t('executionHub.createFirst')}</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {projects.map((p) => {
                            const isActive = activeProjectId === p.id;
                            const progress = p.phases.filter((ph: KaizenPhase) => ph.status === 'completed').length;
                            return (
                                <div
                                    key={p.id}
                                    className="card"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                                        transition: 'transform 0.2s ease',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onClick={() => setProject(p)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{p.name}</h3>
                                        <button
                                            onClick={(e) => handleDeleteProject(p.id, e)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.2rem' }}
                                        >
                                            &times;
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        {p.phases.map((ph: KaizenPhase) => (
                                            <div
                                                key={ph.id}
                                                style={{
                                                    flex: 1,
                                                    height: '4px',
                                                    borderRadius: '2px',
                                                    background: ph.status === 'completed' ? 'var(--accent-success)' : ph.status === 'in-progress' ? 'var(--accent-primary)' : 'var(--bg-dark)'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </span>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                            {progress} / {p.phases.length} Phases
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div style={{ position: 'absolute', top: '-1px', right: '2rem', padding: '2px 8px', background: 'var(--accent-primary)', color: 'white', fontSize: '0.6rem', fontWeight: '900', textTransform: 'uppercase', borderRadius: '0 0 4px 4px' }}>
                                            Active
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <footer style={{ marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={onNavigateBack}>
                    {t('executionHub.backToGateway')}
                </button>
            </footer>
        </div>
    );
}
