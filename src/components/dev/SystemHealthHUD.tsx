import { useEffect, useState, useRef } from 'react';
import { SystemHealthEngine, type HealthEvent } from '../../services/SystemHealthEngine';
import { supabase } from '../../lib/supabase';
import { userService } from '../../services/userService';

export default function SystemHealthHUD() {
    const [isVisible, setIsVisible] = useState(false);
    const [logs, setLogs] = useState<HealthEvent[]>([]);
    const [autocorrects, setAutocorrects] = useState(0);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Global Shortcut Listener: Ctrl + Shift + H
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Engine Event Subscription
    useEffect(() => {
        const unsubscribe = SystemHealthEngine.subscribe((newLogs) => {
            setLogs(newLogs);
            setAutocorrects(SystemHealthEngine.getAutocorrectCount());
        });
        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, []);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await userService.getProfile(session.user.id);
                setIsAdmin(profile?.role === 'admin');
            }
        };
        checkAdmin();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const profile = await userService.getProfile(session.user.id);
                setIsAdmin(profile?.role === 'admin');
            } else {
                setIsAdmin(false);
            }
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    if (!isAdmin) return null;
    if (!isVisible) return null;

    const failuresCount = logs.filter(l => l.status === 'FAILURE').length;
    const warningsCount = logs.filter(l => l.status === 'WARNING').length;
    const mostRecentIssue = logs.find(l => l.status === 'FAILURE' || l.status === 'WARNING');

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS': return '✅';
            case 'WARNING': return '⚠️';
            case 'FAILURE': return '❌';
            default: return 'ℹ️';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS': return '#22c55e';
            case 'WARNING': return '#fce83a';
            case 'FAILURE': return '#ef4444';
            default: return '#9ca3af';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '450px',
            maxHeight: '90vh',
            background: 'rgba(10, 10, 10, 0.95)',
            border: `2px solid ${failuresCount > 0 ? '#ef4444' : warningsCount > 0 ? '#fce83a' : '#22c55e'}`,
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 999999, // Absolute top priority
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            color: '#e2e8f0',
            overflow: 'hidden'
        }}>
            {/* HUD Header */}
            <div style={{ 
                padding: '1rem', 
                background: 'rgba(0,0,0,0.4)', 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: failuresCount > 0 ? '#ef4444' : warningsCount > 0 ? '#fce83a' : '#22c55e',
                        boxShadow: `0 0 10px ${failuresCount > 0 ? '#ef4444' : warningsCount > 0 ? '#fce83a' : '#22c55e'}`
                    }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>System Health Engine</h3>
                </div>
                <button 
                    onClick={() => setIsVisible(false)}
                    style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem'}}
                >
                    ✕
                </button>
            </div>

            {/* Metrics Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ padding: '1rem', background: 'rgba(10,10,10,0.8)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{logs.filter(l => l.status === 'SUCCESS').length}</div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginTop: '4px' }}>Working</div>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(10,10,10,0.8)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fce83a' }}>{warningsCount}</div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginTop: '4px' }}>Warnings</div>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(10,10,10,0.8)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: failuresCount > 0 ? '#ef4444' : '#e2e8f0' }}>{failuresCount}</div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginTop: '4px' }}>Failures</div>
                </div>
            </div>

            {/* Hot Diagnostics */}
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Auto-Corrections Executed:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#38bdf8' }}>{autocorrects}</span>
                </div>
                
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Most Recent Issue:</div>
                {mostRecentIssue ? (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: `1px solid ${getStatusColor(mostRecentIssue.status)}40`, padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: '#f8fafc' }}>
                        {getStatusIcon(mostRecentIssue.status)} <strong>{mostRecentIssue.type}:</strong> {mostRecentIssue.message}
                    </div>
                ) : (
                    <div style={{ color: '#22c55e', fontSize: '0.8rem' }}>✓ System operating nominally.</div>
                )}
            </div>

            {/* Live Log Stream */}
            <div style={{ padding: '0.5rem 1rem', background: 'var(--zone-yellow)', color: '#000', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Live Interaction Log
            </div>
            <div 
                ref={logContainerRef}
                style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '0.5rem',
                    background: '#0a0a0a',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}
            >
                {logs.length === 0 && <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>Waiting for system events...</div>}
                {logs.map((log) => (
                    <div key={log.id} style={{ 
                        padding: '0.5rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderLeft: `2px solid ${getStatusColor(log.status)}`,
                        borderRadius: '0 4px 4px 0',
                        fontSize: '0.75rem',
                        lineHeight: 1.4
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', opacity: 0.7, fontSize: '0.65rem' }}>
                            <span>{new Date(log.timestamp).toLocaleTimeString()} · {log.type}</span>
                        </div>
                        <div style={{ color: log.status === 'SUCCESS' ? '#e2e8f0' : getStatusColor(log.status) }}>
                            {getStatusIcon(log.status)} {log.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
