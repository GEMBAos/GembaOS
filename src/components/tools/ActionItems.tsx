/**
 * ARCHIVE NOTICE
 * Original Use: Used to track action tasks.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface ActionItem {
    id: string;
    description: string;
    owner: string;
    dueDate: string;
    status: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
    createdAt: string;
}

export default function ActionItems() {
    const { t } = useTranslation();
    const [items, setItems] = useState<ActionItem[]>([]);

    // Form state
    const [newDesc, setNewDesc] = useState('');
    const [newOwner, setNewOwner] = useState('');
    const [newDueDate, setNewDueDate] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('kaizen_action_items');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load Action Items", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('kaizen_action_items', JSON.stringify(items));
    }, [items]);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDesc.trim() || !newOwner.trim() || !newDueDate) return;

        const newItem: ActionItem = {
            id: crypto.randomUUID(),
            description: newDesc.trim(),
            owner: newOwner.trim(),
            dueDate: newDueDate,
            status: 'Not Started',
            createdAt: new Date().toISOString()
        };

        setItems([...items, newItem]);
        setNewDesc('');
        setNewOwner('');
        setNewDueDate('');
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this action item?')) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const updateStatus = (id: string, newStatus: ActionItem['status']) => {
        setItems(items.map(i => i.id === id ? { ...i, status: newStatus } : i));
    };

    // Calculate metrics
    const total = items.length;
    const completed = items.filter(i => i.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                            Action Item Tracker
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            Track and manage general tasks and to-dos for the project team.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', textAlign: 'center' }}>
                    <div style={{ background: 'var(--bg-panel)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{total}</div>
                    </div>
                    <div style={{ background: 'var(--bg-panel)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Done</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>{completionRate}%</div>
                    </div>
                </div>
            </header>

            {/* Add New Form */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="input-group" style={{ marginBottom: 0, flex: 2 }}>
                        <label className="input-label">Action Description</label>
                        <input
                            type="text"
                            className="input-field"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            placeholder={t('tools.actionItems.descPlaceholder', 'What needs to be done?')}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                        <label className="input-label">Owner</label>
                        <input
                            type="text"
                            className="input-field"
                            value={newOwner}
                            onChange={(e) => setNewOwner(e.target.value)}
                            placeholder={t('tools.actionItems.ownerPlaceholder', 'Who?')}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                        <label className="input-label">Due Date</label>
                        <input
                            type="date"
                            className="input-field"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 1.5rem', whiteSpace: 'nowrap' }}>
                        + Add Item
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem' }}>Description</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem' }}>Owner</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem' }}>Due Date</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No action items logged yet.
                                </td>
                            </tr>
                        ) : (
                            items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', background: item.status === 'Completed' ? 'rgba(16, 185, 129, 0.05)' : 'transparent', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={item.status}
                                            onChange={(e) => updateStatus(item.id, e.target.value as ActionItem['status'])}
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.875rem',
                                                border: '1px solid var(--border-color)',
                                                background: item.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)'
                                                    : item.status === 'Blocked' ? 'rgba(239, 68, 68, 0.1)'
                                                        : item.status === 'In Progress' ? 'rgba(249, 115, 22, 0.1)'
                                                            : 'var(--bg-dark)',
                                                color: item.status === 'Completed' ? 'var(--accent-success)'
                                                    : item.status === 'Blocked' ? 'var(--accent-danger)'
                                                        : item.status === 'In Progress' ? 'var(--accent-primary)'
                                                            : 'var(--text-main)',
                                                fontWeight: '600',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="Not Started" style={{ color: 'var(--text-main)' }}>Not Started</option>
                                            <option value="In Progress" style={{ color: 'var(--accent-primary)' }}>In Progress</option>
                                            <option value="Blocked" style={{ color: 'var(--accent-danger)' }}>Blocked</option>
                                            <option value="Completed" style={{ color: 'var(--accent-success)' }}>Completed</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '500', textDecoration: item.status === 'Completed' ? 'line-through' : 'none', color: item.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                        {item.description}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="pill" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-light)', color: 'var(--text-main)' }}>
                                            {item.owner}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {new Date(item.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                                            title="Delete Item"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
