/**
 * ARCHIVE NOTICE
 * Original Use: Used to display project charter info.
 * Moved to: unused_modules
 */

import { useState } from 'react';
import type { KPI, KaizenProject, ProjectDuration, ScheduleIntensity, Stakeholder } from '../types';
import { generateRoadmap } from '../engine/roadmapGenerator';
import gembaosIcon from '../assets/branding/gembaos-icon.png';

interface ProjectCharterProps {
    project: KaizenProject | null;
    setProject: (p: KaizenProject) => void;
    onComplete: () => void;
}

export default function ProjectCharter({ project, setProject, onComplete }: ProjectCharterProps) {
    const [name, setName] = useState(project?.name || '');
    const [problem, setProblem] = useState(project?.problemStatement || '');
    const [outcome, setOutcome] = useState(project?.targetOutcome || '');
    const [duration, setDuration] = useState<ProjectDuration>(project?.duration || '5-day');
    const [intensity, setIntensity] = useState<ScheduleIntensity>(project?.intensity || 'full-day');

    const [kpis, setKpis] = useState<KPI[]>(project?.kpis || [{ id: '1', name: '', baseline: '', target: '' }]);
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>(project?.stakeholders || [{ id: '1', name: '', role: '' }]);

    const handleGenerate = () => {
        if (!name || !problem || !outcome) {
            alert('Please fill out Name, Problem Statement, and Target Outcome');
            return;
        }

        const newProject: KaizenProject = {
            id: project?.id || Date.now().toString(),
            name,
            problemStatement: problem,
            targetOutcome: outcome, // Keeping for backward compatibility
            goalStatement: outcome, // Add new explicit property mapping
            duration,
            intensity,
            kpis: kpis.filter(k => k.name.trim() !== ''),
            stakeholders: stakeholders.filter(s => s.name.trim() !== ''),
            team: stakeholders.filter(s => s.name.trim() !== '').map(s => s.name),
            phases: project?.phases || generateRoadmap(duration, intensity),
            status: project?.status || 'Planned',
            createdAt: project?.createdAt || Date.now(),
            updatedAt: Date.now()
        };

        setProject(newProject);
        // Note: The parent component (ExecutionHub/ProjectDashboard) is responsible for calling storageService.saveProject
        onComplete();
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <img src={gembaosIcon} alt="GembaOS Icon" style={{ width: '48px', height: '48px', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <div style={{ flex: '1 1 200px' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>Project Charter</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define the parameters of your Kaizen event.</p>
                </div>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Core Details</h3>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label">Project Name</label>
                        <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Assembly Line 3 Throughput Kaizen" />
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="input-group">
                            <label className="input-label">Duration</label>
                            <select className="input-field" value={duration} onChange={e => setDuration(e.target.value as ProjectDuration)}>
                                <option value="1-day">1-Day Event</option>
                                <option value="3-day">3-Day Kaizen Event</option>
                                <option value="5-day">5-Day Standard Kaizen</option>
                                <option value="1-month">1-Month Accelerated Project</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Schedule Intensity</label>
                            <select className="input-field" value={intensity} onChange={e => setIntensity(e.target.value as ScheduleIntensity)}>
                                <option value="full-day">Full Days (Dedicated)</option>
                                <option value="half-day">Half Days (Integrated)</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Problem Statement</label>
                        <textarea className="input-field" rows={3} value={problem} onChange={e => setProblem(e.target.value)} placeholder="What specific problem are you trying to solve?" />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Target Outcome</label>
                        <textarea className="input-field" rows={3} value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="What does success look like at the end of this event?" />
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Key Performance Indicators (KPIs)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>What metrics will indicate success?</p>

                {kpis.map((kpi, idx) => (
                    <div key={kpi.id} className="grid grid-cols-3" style={{ marginBottom: '1rem' }}>
                        <input className="input-field" placeholder="Metric Name" value={kpi.name} onChange={e => { const n = [...kpis]; n[idx].name = e.target.value; setKpis(n); }} />
                        <input className="input-field" placeholder="Baseline (e.g. 50 u/hr)" value={kpi.baseline} onChange={e => { const n = [...kpis]; n[idx].baseline = e.target.value; setKpis(n); }} />
                        <input className="input-field" placeholder="Target (e.g. 75 u/hr)" value={kpi.target} onChange={e => { const n = [...kpis]; n[idx].target = e.target.value; setKpis(n); }} />
                    </div>
                ))}
                <button className="btn" onClick={() => setKpis([...kpis, { id: Date.now().toString(), name: '', baseline: '', target: '' }])}>
                    + Add KPI
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Stakeholders & Team</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Who is involved and who needs to know?</p>

                {stakeholders.map((person, idx) => (
                    <div key={person.id} className="grid grid-cols-2" style={{ marginBottom: '1rem' }}>
                        <input className="input-field" placeholder="Name" value={person.name} onChange={e => { const n = [...stakeholders]; n[idx].name = e.target.value; setStakeholders(n); }} />
                        <input className="input-field" placeholder="Role (e.g. Sponsor, Leader, Operator)" value={person.role} onChange={e => { const n = [...stakeholders]; n[idx].role = e.target.value; setStakeholders(n); }} />
                    </div>
                ))}
                <button className="btn" onClick={() => setStakeholders([...stakeholders, { id: Date.now().toString(), name: '', role: '' }])}>
                    + Add Team Member
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={handleGenerate} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                    {project ? 'Save Charter & Continue' : 'Generate Charter & Roadmap'}
                </button>
            </div>
        </div>
    );
}
