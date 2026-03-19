import { useState, useEffect } from 'react';
import HardwareConsoleLayout from '../HardwareConsoleLayout';
import { useTranslation } from 'react-i18next';
import MotionHostDashboardV2 from './MotionHostDashboardV2';
import MotionParticipantJoin from './MotionParticipantJoin';
import MotionSessionCreator from './MotionSessionCreator';
import MotionHostActive from './MotionHostActive';
import MotionParticipantPathing from './MotionParticipantPathing';
import MotionCalibration from './MotionCalibration';
import { ImprovementEngine } from '../../../services/ImprovementEngine';
import type { MotionSessionV2 } from '../../../types/motion_v2';

interface Props {
    onClose: () => void;
}

export default function MotionMappingV2({ onClose }: Props) {
    const { t } = useTranslation();
    const [view, setView] = useState<'DASHBOARD' | 'CREATE' | 'CALIBRATE' | 'HOST_ACTIVE' | 'PARTICIPANT_JOIN' | 'PARTICIPANT_PATHING'>('DASHBOARD');
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [participantId, setParticipantId] = useState<string | null>(null);

    // Initial load: Check if we are joining via a deep link (e.g. ?session=123)
    useEffect(() => {
        const checkHashForSession = () => {
            const searchParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || "");
            const joinSessionId = searchParams.get('session') || hashParams.get('session');
            const role = searchParams.get('role') || hashParams.get('role');
            
            if (joinSessionId && view !== 'PARTICIPANT_JOIN' && view !== 'PARTICIPANT_PATHING' && view !== 'HOST_ACTIVE') {
                setActiveSessionId(joinSessionId);
                if (role === 'host') {
                    setView('HOST_ACTIVE');
                } else {
                    setView('PARTICIPANT_JOIN');
                }
            }
        };

        checkHashForSession();
        window.addEventListener('hashchange', checkHashForSession);
        return () => window.removeEventListener('hashchange', checkHashForSession);
    }, [view]);

    const handleCreateSession = () => {
        setView('CREATE');
    };

    const handleSessionCreated = (sessionId: string, needsCalibration: boolean) => {
        setActiveSessionId(sessionId);
        if (needsCalibration) {
            setView('CALIBRATE');
        } else {
            setView('HOST_ACTIVE');
        }
    };

    const handleCalibrationComplete = () => {
        setView('HOST_ACTIVE');
    };

    const handleOpenHostSession = (sessionId: string) => {
        const session = ImprovementEngine.getItem<MotionSessionV2>(sessionId);
        if (session) {
            setActiveSessionId(sessionId);
            if (session.calibrationScale === 1 && session.calibrationUnit === 'none' && session.layoutImageUrl) {
                // Not strictly required to calibrate if they don't want to, but good to jump there if it's new
                // For now, just go to HOST_ACTIVE
            }
            setView('HOST_ACTIVE');
        }
    };

    const handleParticipantJoined = (pid: string, trueSessionId?: string) => {
        if (trueSessionId) {
            setActiveSessionId(trueSessionId);
            window.history.replaceState(null, '', `#/motion-v2?session=${trueSessionId}`);
        }
        setParticipantId(pid);
        setView('PARTICIPANT_PATHING');
    };

    return (
        <HardwareConsoleLayout toolId="MM-V2" toolName={t('tools.motionMappingV2', 'Motion Mapping V2 (Beta)')} onClose={onClose}>
            {view === 'DASHBOARD' && (
                <MotionHostDashboardV2 
                    onCreateNew={handleCreateSession} 
                    onOpenSession={handleOpenHostSession} 
                />
            )}
            
            {view === 'CREATE' && (
                <MotionSessionCreator 
                    onCreated={handleSessionCreated} 
                    onCancel={() => setView('DASHBOARD')} 
                />
            )}

            {view === 'CALIBRATE' && activeSessionId && (
                <MotionCalibration 
                    sessionId={activeSessionId}
                    onComplete={handleCalibrationComplete}
                />
            )}

            {view === 'HOST_ACTIVE' && activeSessionId && (
                <MotionHostActive 
                    sessionId={activeSessionId}
                    onBack={() => {
                        setActiveSessionId(null);
                        setView('DASHBOARD');
                    }}
                />
            )}

            {view === 'PARTICIPANT_JOIN' && activeSessionId && (
                <MotionParticipantJoin
                    sessionId={activeSessionId}
                    onJoined={handleParticipantJoined}
                />
            )}

            {view === 'PARTICIPANT_PATHING' && activeSessionId && participantId && (
                <MotionParticipantPathing 
                    sessionId={activeSessionId}
                    participantId={participantId}
                    onLeave={() => {
                        window.location.search = '';
                        setParticipantId(null);
                        setActiveSessionId(null);
                        setView('DASHBOARD');
                    }}
                />
            )}
        </HardwareConsoleLayout>
    );
}
