import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import type { ActionItem, ActionItemStatus, ActionItemDifficulty, KaizenProject } from '../../types';
import JFIIdeaGenerator from '../tools/JFIIdeaGenerator';
import BurndownChart from './BurndownChart';
import { useTranslation } from 'react-i18next';

interface ActionItemsProps {
    project: KaizenProject;
}

export default function ActionItems({ project }: ActionItemsProps) {
    const { t } = useTranslation();
    const [actions, setActions] = useState<ActionItem[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'chart'>('kanban');
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    // Quick Add State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDifficulty, setNewTaskDifficulty] = useState<ActionItemDifficulty>('Medium');
    const [newTaskOwner, setNewTaskOwner] = useState('Team');

    const loadActions = () => {
        setActions(storageService.getActionItems(project.id).sort((a, b) => b.createdAt - a.createdAt));
    };

    useEffect(() => {
        loadActions();
        const handleUpdate = () => loadActions();
        window.addEventListener('kaizen_data_updated', handleUpdate);
        return () => window.removeEventListener('kaizen_data_updated', handleUpdate);
    }, [project.id]);

    const handleCreateAction = () => {
        if (!newTaskTitle.trim()) return;

        storageService.saveActionItem({
            id: Math.random().toString(36).substr(2, 9),
            projectId: project.id,
            title: newTaskTitle,
            owner: newTaskOwner,
            status: 'To Do',
            difficulty: newTaskDifficulty,
            createdAt: Date.now()
        });

        setNewTaskTitle('');
    };

    const handleUpdateStatus = (action: ActionItem, newStatus: ActionItemStatus) => {
        storageService.saveActionItem({ ...action, status: newStatus });
    };

    const handleDelete = (id: string) => {
        if (confirm(t('actionItems.deletePrompt'))) {
            storageService.deleteActionItem(id);
        }
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        setDraggedItemId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedItemId(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Required to allow dropping
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: ActionItemStatus) => {
        e.preventDefault();
        if (!draggedItemId) return;

        const actionToUpdate = actions.find(a => a.id === draggedItemId);
        if (actionToUpdate && actionToUpdate.status !== targetStatus) {
            handleUpdateStatus(actionToUpdate, targetStatus);
        }
        setDraggedItemId(null);
    };

    // Derived Data for Views
    const todo = actions.filter(a => a.status === 'To Do');
    const doing = actions.filter(a => a.status === 'Doing');
    const done = actions.filter(a => a.status === 'Done');

    // Rendering Helper for Cards
    const renderActionCard = (action: ActionItem) => (
        <div
            key={action.id}
            draggable={viewMode === 'kanban'}
            onDragStart={(e) => handleDragStart(e, action.id)}
            onDragEnd={handleDragEnd}
            style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.5rem',
                padding: '1rem',
                position: 'relative',
                cursor: viewMode === 'kanban' ? 'grab' : 'default',
                opacity: draggedItemId === action.id ? 0.4 : 1,
                transform: draggedItemId === action.id ? 'scale(0.98)' : 'none',
                transition: 'opacity 0.2s, transform 0.2s',
                boxShadow: draggedItemId === action.id ? '0 10px 20px rgba(0,0,0,0.5)' : 'none'
            }}
        >
            <button onClick={() => handleDelete(action.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>&times;</button>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', paddingRight: '1rem' }}>{action.title}</h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
                <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.25rem',
                    background: action.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : action.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                    color: action.difficulty === 'Easy' ? '#10b981' : action.difficulty === 'Hard' ? '#ef4444' : '#fbbf24'
                }}>
                    {t(`actionItems.${action.difficulty.toLowerCase()}`).split(' ')[0]} {t('actionItems.impact')}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>📍 {action.owner}</span>
            </div>

            <select
                value={action.status}
                onChange={(e) => handleUpdateStatus(action, e.target.value as ActionItemStatus)}
                style={{ width: '100%', marginTop: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', color: 'white', padding: '0.4rem', borderRadius: '0.25rem' }}
            >
                <option value="To Do">{t('actionItems.todo')}</option>
                <option value="Doing">{t('actionItems.doing')}</option>
                <option value="Done">{t('actionItems.done')}</option>
            </select>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Add Form */}
            <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, transparent 100%)' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {t('actionItems.quickAdd')}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>{t('actionItems.taskDesc')}</label>
                        <input className="input-field" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder={t('actionItems.placeholder')} onKeyDown={e => e.key === 'Enter' && handleCreateAction()} />
                    </div>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>{t('actionItems.owner')}</label>
                        <input className="input-field" value={newTaskOwner} onChange={e => setNewTaskOwner(e.target.value)} placeholder={t('actionItems.ownerPlaceholder')} />
                    </div>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>{t('actionItems.difficulty')}</label>
                        <select className="input-field" value={newTaskDifficulty} onChange={e => setNewTaskDifficulty(e.target.value as ActionItemDifficulty)}>
                            <option value="Easy">{t('actionItems.easy')}</option>
                            <option value="Medium">{t('actionItems.medium')}</option>
                            <option value="Hard">{t('actionItems.hard')}</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreateAction} style={{ height: '42px', padding: '0 2rem' }}>{t('actionItems.addTask')}</button>
                </div>
            </div>

            {/* View Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{t('actionItems.title')} ({actions.length})</h3>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                    <button
                        onClick={() => setViewMode('kanban')}
                        style={{ padding: '0.4rem 1rem', borderRadius: '0.25rem', border: 'none', background: viewMode === 'kanban' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'kanban' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t('actionItems.kanbanBoard')}
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{ padding: '0.4rem 1rem', borderRadius: '0.25rem', border: 'none', background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t('actionItems.listView')}
                    </button>
                    <button
                        onClick={() => setViewMode('chart')}
                        style={{ padding: '0.4rem 1rem', borderRadius: '0.25rem', border: 'none', background: viewMode === 'chart' ? 'var(--accent-success)' : 'transparent', color: viewMode === 'chart' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t('actionItems.velocityChart')}
                    </button>
                </div>
            </div>

            {actions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'var(--bg-dark)', borderRadius: '1rem', border: '2px dashed var(--border-light)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                    <h3>{t('actionItems.emptyBacklog')}</h3>
                    <p>{t('actionItems.emptyDesc')}</p>
                </div>
            ) : viewMode === 'chart' ? (
                <BurndownChart actions={actions} />
            ) : viewMode === 'list' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {actions.map(renderActionCard)}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                    <div
                        className="card"
                        style={{ padding: '1rem', background: draggedItemId ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)', minHeight: '30vh', transition: 'background 0.2s', border: draggedItemId ? '1px dashed var(--border-color)' : '1px solid var(--border-light)' }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'To Do')}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                            {t('actionItems.todo')} <span style={{ background: 'var(--bg-panel)', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>{todo.length}</span>
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{todo.map(renderActionCard)}</div>
                    </div>
                    <div
                        className="card"
                        style={{ padding: '1rem', background: draggedItemId ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)', minHeight: '30vh', transition: 'background 0.2s', border: draggedItemId ? '1px dashed rgba(14, 165, 233, 0.5)' : '1px solid var(--border-light)' }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'Doing')}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--accent-primary)', display: 'flex', justifyContent: 'space-between' }}>
                            {t('actionItems.doing')} <span style={{ background: 'var(--bg-panel)', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>{doing.length}</span>
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{doing.map(renderActionCard)}</div>
                    </div>
                    <div
                        className="card"
                        style={{ padding: '1rem', background: draggedItemId ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', minHeight: '30vh', transition: 'background 0.2s', border: draggedItemId ? '1px dashed rgba(16, 185, 129, 0.5)' : '1px solid var(--border-light)' }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'Done')}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--accent-success)', display: 'flex', justifyContent: 'space-between' }}>
                            {t('actionItems.done')} <span style={{ background: 'var(--bg-panel)', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>{done.length}</span>
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{done.map(renderActionCard)}</div>
                    </div>
                </div>
            )}

            {/* JFI Generator Injection */}
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{t('actionItems.inspiration')}</h3>
                <JFIIdeaGenerator onIdeaGenerated={(idea) => {
                    setNewTaskTitle(idea.title);
                    setNewTaskDifficulty(idea.difficulty);
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }} />
            </div>
        </div>
    );
}
