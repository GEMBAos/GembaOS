import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FloorPlanBuilder from './FloorPlanBuilder';
import SpaghettiTracker from './SpaghettiTracker';
import GPSSpaghettiTracker from './GPSSpaghettiTracker';
import LidarViewer from './LidarViewer';
import DroneReconstructor from './DroneReconstructor';
import type { KaizenProject } from '../../types';

interface SpatialHubProps {
    projects: KaizenProject[];
    onUpdateProjects: (projects: KaizenProject[]) => void;
    activeModel: string | null;
    onClearActiveModel: () => void;
}

export default function SpatialHub({ projects, onUpdateProjects, activeModel, onClearActiveModel }: SpatialHubProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'3d' | '2d' | 'spaghetti' | 'spaghetti-gps' | 'drone' | null>(activeModel ? 'drone' : null);

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 max(1.5rem, 3vw) 4rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <img src="/gemba-animated-1.gif" alt="Gemba Logo" style={{ height: '50px', objectFit: 'contain' }} />
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, fontFamily: 'var(--font-headings)', borderLeft: '2px solid var(--border-light)', paddingLeft: '1rem' }}>
                            {t('spatial_hub.title')}
                        </h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>{t('spatial_hub.subtitle')}</p>
                </div>
            </header>

            {!activeTab ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', flex: 1 }}>
                    {/* Category 1: Design & Layout */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-secondary)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-secondary)' }}>{t('spatial_hub.categories.design')}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('spatial_hub.tools.lidar.desc')}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                            <button className="module-btn" onClick={() => setActiveTab('2d')}>
                                <div>📐 {t('spatial_hub.tools.floorplan.title')}</div>
                                <div>{t('spatial_hub.tools.floorplan.desc')}</div>
                            </button>
                            <button className="module-btn" onClick={() => setActiveTab('3d')}>
                                <div>🧊 {t('spatial_hub.tools.lidar.title')}</div>
                                <div>{t('spatial_hub.tools.lidar.desc')}</div>
                            </button>
                        </div>
                    </div>

                    {/* Category 2: Analysis & Motion */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-success)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--accent-success)' }}>{t('spatial_hub.categories.motion')}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('spatial_hub.tools.gps.desc')}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                            <button className="module-btn" onClick={() => setActiveTab('spaghetti-gps')}>
                                <div>🛰️ {t('spatial_hub.tools.gps.title')}</div>
                                <div>{t('spatial_hub.tools.gps.desc')}</div>
                            </button>
                            <button className="module-btn" onClick={() => setActiveTab('spaghetti')}>
                                <div>🖋️ {t('spatial_hub.tools.manual.title')}</div>
                                <div>{t('spatial_hub.tools.manual.desc')}</div>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <button className="btn" onClick={() => setActiveTab(null)} style={{ padding: '0.5rem 1rem' }}>{t('spatial_hub.back')}</button>
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                            {activeTab === '2d' && t('spatial_hub.tools.floorplan.title')}
                            {activeTab === '3d' && t('spatial_hub.tools.lidar.title')}
                            {activeTab === 'drone' && t('spatial_hub.tools.drone.title')}
                            {activeTab === 'spaghetti' && t('spatial_hub.tools.manual.title')}
                            {activeTab === 'spaghetti-gps' && t('spatial_hub.tools.gps.title')}
                        </h3>

                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setActiveTab('2d')} style={{ background: 'none', border: 'none', color: activeTab === '2d' ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>2D</button>
                            <button onClick={() => setActiveTab('3d')} style={{ background: 'none', border: 'none', color: activeTab === '3d' ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>3D</button>
                            <button onClick={() => setActiveTab('spaghetti-gps')} style={{ background: 'none', border: 'none', color: activeTab === 'spaghetti-gps' ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>GPS</button>
                        </div>
                    </div>

                    <div style={{ flex: 1, background: 'var(--bg-panel)', borderRadius: '1rem', border: '1px solid var(--border-light)', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {activeTab === '2d' && <FloorPlanBuilder />}
                        {activeTab === '3d' && <LidarViewer />}
                        {activeTab === 'drone' && (
                            <DroneReconstructor
                                projects={projects}
                                onUpdateProjects={onUpdateProjects}
                                initialModel={activeModel}
                                onClearModel={onClearActiveModel}
                            />
                        )}
                        {activeTab === 'spaghetti' && <SpaghettiTracker />}
                        {activeTab === 'spaghetti-gps' && <GPSSpaghettiTracker />}
                    </div>
                </div>
            )}
        </div>
    );
}
