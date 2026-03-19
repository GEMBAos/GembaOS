/**
 * ARCHIVE NOTICE
 * Original Use: Used for spatial analytics.
 * Moved to: unused_modules
 */

import { useState, useEffect } from 'react';
import { jfiService, type JFISubmission } from '../../services/jfiService';
import { formatDistanceToNow } from 'date-fns';

export default function LocationAnalytics() {
    const [submissions, setSubmissions] = useState<JFISubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState<string | 'All'>('All');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await jfiService.getAnalytics();
        setSubmissions(data);
        setIsLoading(false);
    };

    // Derived Metrics
    const zones = Array.from(new Set(submissions.map(s => s.location_zone || 'Unassigned'))).sort();
    
    const filteredSubmissions = selectedZone === 'All' 
        ? submissions 
        : submissions.filter(s => (s.location_zone || 'Unassigned') === selectedZone);

    const totalSubmissions = filteredSubmissions.length;
    
    // Calculate Category Distribution
    const categoryCounts = filteredSubmissions.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

    // Calculate Zone Distribution (for All view)
    const zoneCounts = submissions.reduce((acc, curr) => {
        const zone = curr.location_zone || 'Unassigned';
        acc[zone] = (acc[zone] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const sortedZones = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1]);
    const maxZoneCount = Math.max(...Object.values(zoneCounts), 1);

    if (isLoading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                Loading Gemba Analytics...
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-panel)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>No Data Yet</h3>
                <p style={{ margin: 0 }}>Print some QR codes and get out to the Gemba! Submissions will appear here.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span>📍</span> Location Analytics
                    </h2>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track friction and JFI activity across the facility</p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Filter Zone:</span>
                    <select 
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        style={{
                            background: 'var(--bg-panel)',
                            color: 'white',
                            border: '1px solid var(--border-light)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All">All Areas ({submissions.length})</option>
                        {zones.map(z => (
                            <option key={z} value={z}>{z} ({submissions.filter(s => (s.location_zone || 'Unassigned') === z).length})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(45,127,249,0.1), transparent)', border: '1px solid rgba(45,127,249,0.3)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Submissions</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>{totalSubmissions}</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), transparent)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-success)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Top Category</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff' }}>
                        {Object.keys(categoryCounts).length > 0 ? Object.entries(categoryCounts).sort((a,b) => b[1] - a[1])[0][0] : 'None'}
                    </div>
                </div>
                {selectedZone === 'All' && (
                    <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), transparent)', border: '1px solid rgba(245,158,11,0.3)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-warning)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Most Active Zone</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff' }}>
                            {sortedZones.length > 0 ? sortedZones[0][0] : 'None'}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
                
                {/* Category Density Chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Problem Density by Category</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                            <div key={category}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                    <span>{category}</span>
                                    <span>{count}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '1rem', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: ((count / maxCategoryCount) * 100) + '%', 
                                        height: '100%', 
                                        background: 'var(--accent-primary)',
                                        borderRadius: '1rem',
                                        transition: 'width 0.5s ease-out'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zone Distribution (Only show in All view) */}
                {selectedZone === 'All' ? (
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Activity by Area</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sortedZones.slice(0, 5).map(([zone, count]) => (
                                <div key={zone}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                        <span>{zone}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '1rem', overflow: 'hidden' }}>
                                        <div style={{ 
                                            width: ((count / maxZoneCount) * 100) + '%', 
                                            height: '100%', 
                                            background: 'var(--accent-warning)',
                                            borderRadius: '1rem',
                                            transition: 'width 0.5s ease-out'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
                         <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Recent Ideas for {selectedZone}</h3>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                             {filteredSubmissions.slice(0, 5).map(sub => (
                                 <div key={sub.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', borderLeft: '3px solid var(--accent-primary)' }}>
                                     <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{sub.category} • {sub.impact_level}</div>
                                     <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' }}>{sub.title}</div>
                                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}</div>
                                 </div>
                             ))}
                         </div>
                    </div>
                )}
            </div>
            
            {/* Full Feed Table underneath */}
            <div className="card" style={{ padding: '1.5rem' }}>
                 <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Latest Submissions Log</h3>
                 <div style={{ overflowX: 'auto' }}>
                     <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                         <thead>
                             <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                 <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Time</th>
                                 <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Location</th>
                                 <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Category</th>
                                 <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Idea</th>
                                 <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Impact</th>
                                 <th style={{ padding: '0.75rem', fontWeight: 'bold' }}>Media</th>
                             </tr>
                         </thead>
                         <tbody>
                             {filteredSubmissions.slice(0, 10).map((sub, i) => (
                                 <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                     <td style={{ padding: '0.75rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                                     <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{sub.location_zone || 'Unassigned'}</td>
                                     <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{sub.category}</td>
                                     <td style={{ padding: '0.75rem', color: '#fff', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.title}</td>
                                     <td style={{ padding: '0.75rem' }}>
                                        <span style={{ 
                                            padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 'bold',
                                            background: sub.impact_level === 'Quick Win' ? 'rgba(16,185,129,0.2)' : sub.impact_level === 'Moderate' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                                            color: sub.impact_level === 'Quick Win' ? '#10b981' : sub.impact_level === 'Moderate' ? '#f59e0b' : '#ef4444'
                                        }}>{sub.impact_level}</span>
                                     </td>
                                     <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                         {sub.photo_url ? <a href={sub.photo_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>📷</a> : '-'}
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
}
