import React, { useState, useEffect, Suspense } from 'react';
import OperatingRoom from './components/OperatingRoom';
import SplashScreen from './components/SplashScreen';
import FeedbackOverlay from './components/FeedbackOverlay';
import LeanLifestyleTicker from './components/LeanLifestyleTicker';

import { supabase } from './lib/supabase';


// Lazy load modular hubs to drastically reduce initial bundle size
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const GembaWalkGuide = React.lazy(() => import('./components/tools/GembaWalkGuide'));
const LineBalanceBuilder = React.lazy(() => import('./components/tools/LineBalanceBuilder'));

// New Operating Room Tools
const GoalGapMonitor = React.lazy(() => import('./components/tools/GoalGapMonitor'));

const MotionMappingV2 = React.lazy(() => import('./components/tools/motion_v2/MotionMappingV2'));
const ProcessCheck = React.lazy(() => import('./components/tools/ProcessCheck'));
const ImprovementCard = React.lazy(() => import('./components/tools/ImprovementCard'));
const ValueScanner = React.lazy(() => import('./components/tools/ValueScanner'));
const TimeStudy = React.lazy(() => import('./components/tools/TimeStudy'));
const KaizenSessionHub = React.lazy(() => import('./components/tools/kaizen/KaizenSessionHub'));
const ActionItems = React.lazy(() => import('./components/tools/ActionItems'));
const LeanAcademy = React.lazy(() => import('./components/tools/LeanAcademy'));
const VideoHub = React.lazy(() => import('./components/tools/VideoHub'));
const GembaChallengeQuiz = React.lazy(() => import('./components/tools/GembaChallengeQuiz'));
import JFIIdeaGenerator from './components/tools/JFIIdeaGenerator';
const CalculatorsHub = React.lazy(() => import('./components/tools/CalculatorsHub'));

import { userService } from './services/userService';
import { storageService } from './services/storageService';
import { ImprovementEngine } from './services/ImprovementEngine';
import type { UserProfile } from './services/userService';
import type { User } from '@supabase/supabase-js';
import StreakRankingBoard from './components/tools/StreakRankingBoard';
import brandLogo from './assets/branding/brand-cart-transparent.png';

import RankBenefitsModal from './components/tools/RankBenefitsModal';
import UserProfileModal from './components/auth/UserProfileModal';
import DynamicBadge from './components/ui/DynamicBadge';

import { GembaIcon } from './components/ui/IndustrialIcons';
import './NavRailIndustrial.css';
function App() {
  const getInitialView = () => {
    const rawHash = window.location.hash.replace('#/', '');
    const hashPath = rawHash.split('?')[0];
    if (['portal', 'observe', 'diagnose', 'improve', 'motion-v2', 'time-study', 'process-check', 'improvement-card', 'value-scanner', 'line-balance', 'kaizen-hub', 'action-items', 'lean-academy', 'video-hub', 'gemba-challenge', 'idea-engine', 'calculators'].includes(hashPath)) {
        return hashPath as any;
    }

    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      const isFirstVisit = !localStorage.getItem('has_visited_gemba');
      if (isFirstVisit) {
          localStorage.setItem('has_visited_gemba', 'true');
      }
    }

    const params = new URLSearchParams(window.location.search);
    
    const flow = params.get('flow');
    if (flow === 'guest_challenge' || flow === 'jfi' || flow === 'register') return 'calculators';
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || "");
    const sessionUrlParam = params.get('session') || hashParams.get('session');
    
    // Do not override kaizen hub deep links
    if (sessionUrlParam && hashPath !== 'kaizen-hub') {
        return 'motion-v2';
    }

    return 'calculators';
  };

  const [currentView, setCurrentView] = useState<'splash' | 'portal' | 'observe' | 'diagnose' | 'improve' | 'dashboard' | 'promo' | 'gemba' | 'goal-gap' | 'motion-mapping' | 'motion-v2' | 'time-study' | 'process-check' | 'improvement-card' | 'value-scanner' | 'line-balance' | 'kaizen-hub' | 'action-items' | 'lean-academy' | 'video-hub' | 'gemba-challenge' | 'idea-engine' | 'calculators'>(
    getInitialView()
  );
  
  // Track if splash screen should be shown
  const [showSplash, setShowSplash] = useState(!window.location.hash.includes('session') && !window.location.search.includes('flow'));

  // Sync state to hash to allow deep linking
  const handleNavigate = (view: typeof currentView) => {
    setCurrentView(view);
    window.location.hash = `/${view}`;
  };

  useEffect(() => {
    const handleHashChange = () => {
        const rawHash = window.location.hash.replace('#/', '');
        const hashPath = rawHash.split('?')[0];
        if (hashPath && hashPath !== currentView && ['portal', 'observe', 'diagnose', 'improve', 'motion-mapping', 'motion-v2', 'time-study', 'process-check', 'improvement-card', 'value-scanner', 'line-balance', 'kaizen-hub', 'gemba-challenge', 'idea-engine', 'calculators'].includes(hashPath)) {
            setCurrentView(hashPath as any);
        }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // Auth & Profile State
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Global Modal States
  const [showStreakBoard, setShowStreakBoard] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [guestXp, setGuestXp] = useState(parseInt(localStorage.getItem('gembaos_guest_tokens') || '0', 10));

  // PWA Install Prompt

  async function fetchProfile(userId: string) {
    const data = await userService.getProfile(userId);
    if (data) {
      setProfile(data);
    }
  }

  useEffect(() => {
    // Log a site visit on mount
    const logVisit = async () => {
      try {
        await supabase.from('site_visits').insert([{
          user_agent: navigator.userAgent
        }]);
      } catch (err) {
        // Silently fail if tracker is blocked by adblock
      }
    };
    logVisit();

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        storageService.setUserId(session.user.id);
        ImprovementEngine.setUserId(session.user.id);
        fetchProfile(session.user.id);
        storageService.syncFromCloud();
      } else {
        storageService.setUserId('guest');
        ImprovementEngine.setUserId('guest');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        storageService.setUserId(session.user.id);
        ImprovementEngine.setUserId(session.user.id);
        fetchProfile(session.user.id);
        storageService.syncFromCloud();
      } else {
        storageService.setUserId('guest');
        ImprovementEngine.setUserId('guest');
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
        if (user) {
            fetchProfile(user.id);
        } else {
            setGuestXp(parseInt(localStorage.getItem('gembaos_guest_tokens') || '0', 10));
        }
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [user]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    
    const sessionUrlParam = searchParams.get('session') || hashParams.get('session');
    const rawHash = window.location.hash.replace('#/', '');
    const hashPath = rawHash.split('?')[0];
    
    if (sessionUrlParam && hashPath !== 'kaizen-hub') {
      setCurrentView('motion-v2');
      window.location.hash = `/motion-v2?session=${sessionUrlParam}`;
    }
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {showProfileModal && profile && user && (
        <UserProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onUpdate={() => fetchProfile(user.id)}
        />
      )}

      <div className={`os-shell ${true ? 'context-closed' : ''}`}>
        
        {/* 1. HEADER ZONE */}
        <header className="os-header" style={{ padding: '0 1rem', justifyContent: 'space-between', borderBottom: '2px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: 1, minWidth: 0 }} onClick={() => handleNavigate('calculators' as any)}>
                {/* Optional minor navigation nodes can go here */}
            </div>
            
            <div 
                onClick={() => handleNavigate('calculators' as any)}
                style={{ 
                    cursor: 'pointer',
                    width: '100%', 
                    maxWidth: 'clamp(150px, 30vw, 300px)',
                    height: '70px',
                    backgroundImage: `url(${brandLogo})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    filter: 'drop-shadow(0 0 10px rgba(255,194,14,0.15)) drop-shadow(0 0 2px rgba(255,255,255,0.4))'
                }} 
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
                {user ? (
                    <div onClick={() => setShowProfileModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <div style={{ textAlign: 'right', paddingRight: '0.5rem' }} className="hide-on-mobile">
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#e2e8f0', fontFamily: 'var(--font-headings)' }}>{profile?.username || user.email?.split('@')[0]}</div>
                        </div>
                        <DynamicBadge 
                            xp={profile?.xp || 0} 
                            avatarUrl={profile?.avatar_url || undefined} 
                            username={profile?.username || user.email || 'User'} 
                            size={36} 
                        />
                    </div>
                ) : (
                    <div onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <div style={{ textAlign: 'right', paddingRight: '0.5rem' }} className="hide-on-mobile">
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#888', fontFamily: 'var(--font-headings)' }}>LOCAL GUEST</div>
                        </div>
                        <DynamicBadge 
                            xp={guestXp} 
                            username="Guest" 
                            size={36} 
                        />
                    </div>
                )}
            </div>
        </header>

        {/* PERSISTENT LEAN LIFE HACKS TICKER (Moved to corner widget) */}
        <div style={{ gridArea: 'os-ticker', display: 'none' }}>
            <LeanLifestyleTicker />
        </div>

        {/* PERSISTENT FLAT IDEA ENGINE LOGGING BAR (FUSED WITH BLACK HEADER) */}
        <div style={{ gridArea: 'os-idea', position: 'sticky', top: 'var(--os-header-height)', zIndex: 45, background: '#111', borderBottom: '1px solid #222', minWidth: 0 }}>
            <div style={{ padding: '0.25rem 1rem 0.25rem 1rem' }}>
                <JFIIdeaGenerator 
                    onIdeaGenerated={() => {}} 
                    profile={profile} 
                    onNavigate={(r) => handleNavigate(r as any)}
                />
            </div>
            
            {/* Quick Calcs Ribbon */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                overflowX: 'auto', 
                padding: '0.5rem 1rem', 
                background: '#0a0a0c', 
                borderTop: '1px solid #222',
                scrollbarWidth: 'none'
            }}>
                {(['takt', 'oee', 'kanban', 'rty', 'smed', 'labor', 'uph', 'safety', 'roi'] as const).map(c => (
                    <button 
                        key={c}
                        onClick={() => {
                            window.location.hash = `#/calculators?calc=${c}`;
                            setCurrentView('calculators');
                        }}
                        style={{
                            whiteSpace: 'nowrap',
                            padding: '0.4rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            color: 'var(--steel-gray)',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-headings)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--zone-yellow)'; e.currentTarget.style.borderColor = 'rgba(255,194,14,0.3)'; e.currentTarget.style.background = 'rgba(255,194,14,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--steel-gray)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    >
                        {c === 'takt' && 'Takt Time'}
                        {c === 'oee' && 'OEE'}
                        {c === 'kanban' && 'Kanban Size'}
                        {c === 'rty' && 'True Yield'}
                        {c === 'smed' && 'Setup Cost'}
                        {c === 'labor' && 'Labor Cost'}
                        {c === 'uph' && 'UPH Target'}
                        {c === 'safety' && 'Facility 5S'}
                        {c === 'roi' && 'Kaizen ROI'}
                    </button>
                ))}
            </div>
        </div>

        {/* 2. NAVIGATION SYSTEM (PERSISTENT LEFT RAIL - HEAVY INDUSTRIAL AESTHETIC) */}
        <nav className="os-nav-rail">
            <button onClick={() => handleNavigate('calculators' as any)} style={{ background: 'transparent', border: 'none', color: currentView === 'calculators' ? 'var(--zone-yellow)' : 'var(--steel-gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1rem' }} title="Home">
                <div style={{ fontSize: '1.75rem', filter: currentView === 'calculators' ? 'drop-shadow(0 2px 4px rgba(255,194,14,0.5))' : 'none' }}>🔘</div>
            </button>
            <div style={{ width: '60%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
            
            {[
                { id: 'forms', name: 'FORMS', action: 'action-items' },
                { id: 'motion', name: 'MOTION', action: 'motion-v2' },
                { id: 'time', name: 'TIME', action: 'time-study' },
                { id: 'waste', name: 'WASTE', action: 'process-check' },
                { id: 'scan', name: 'SCAN', action: 'value-scanner' },
                { id: 'improv', name: 'IMPROVE', action: 'improvement-card' },
                { id: 'goals', name: 'GOALS', action: 'goal-gap' },
                { id: 'videos', name: 'VIDEOS', action: 'video-hub' },
                { id: 'learn', name: 'LEARN', action: 'lean-academy' },
                { id: 'calcs', name: 'CALCS', action: 'calculators' }
            ].map(tool => (
                <button 
                    key={tool.id} 
                    onClick={() => handleNavigate(tool.action as any)}
                    className={`nav-industrial-btn ${currentView === tool.action ? 'active' : ''}`}
                    title={tool.name}
                >
                    <div className="nav-icon-glow">
                        <GembaIcon 
                            iconId={tool.id} 
                            isActive={currentView === tool.action} 
                            size={26}
                        />
                    </div>
                    <span className="nav-industrial-label">
                        {tool.name}
                    </span>
                </button>
            ))}
        </nav>

        {/* 3. PRIMARY WORKSPACE */}
        <main className="os-workspace">
          <Suspense fallback={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--steel-gray)' }}>
              <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--zone-yellow)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-headings)', letterSpacing: '2px' }}>SYSTEM LOADING...</p>
              <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} />
            </div>
          }>
            {currentView === 'portal' && <OperatingRoom onNavigate={handleNavigate} />}
            
            {/* Core Modules Framework */}
            {currentView === 'gemba' && <GembaWalkGuide onClose={() => handleNavigate('portal')} />}
            {currentView === 'goal-gap' && <GoalGapMonitor onClose={() => handleNavigate('portal')} />}
            {currentView === 'calculators' && (
                <Suspense fallback={<div className="loading-state">Loading Calculators...</div>}>
                    <CalculatorsHub onClose={() => handleNavigate('portal')} />
                </Suspense>
            )}
            {currentView === 'action-items' && <ActionItems />}
            {currentView === 'video-hub' && <VideoHub onClose={() => handleNavigate('portal')} />}
            {currentView === 'motion-v2' && <MotionMappingV2 onClose={() => handleNavigate('portal')} />}
            {currentView === 'time-study' && <TimeStudy onClose={() => handleNavigate('portal')} onNavigate={(t: string) => handleNavigate(t as any)} />}
            {currentView === 'process-check' && <ProcessCheck onClose={() => handleNavigate('portal')} onNavigate={(t) => handleNavigate(t as any)} />}
            {currentView === 'improvement-card' && <ImprovementCard onClose={() => handleNavigate('portal')} />}
            {currentView === 'value-scanner' && <ValueScanner onClose={() => handleNavigate('portal')} />}
            {currentView === 'line-balance' && <LineBalanceBuilder onClose={() => handleNavigate('portal')} />}
            {currentView === 'kaizen-hub' && <KaizenSessionHub onNavigate={handleNavigate} />}
            {currentView === 'lean-academy' && (
                <Suspense fallback={<div className="loading-state">Loading Academy...</div>}>
                    <LeanAcademy />
                </Suspense>
            )}
            {currentView === 'gemba-challenge' && (
                <Suspense fallback={<div className="loading-state">Loading Challenge...</div>}>
                    <GembaChallengeQuiz onClose={() => handleNavigate('portal')} />
                </Suspense>
            )}
            {currentView === 'dashboard' && <Dashboard profile={profile} onNavigate={(view) => handleNavigate(view as any)} />}
          </Suspense>
        </main>

      </div>

      <FeedbackOverlay />
      {showRankModal && <RankBenefitsModal onClose={() => setShowRankModal(false)} currentScore={parseInt(localStorage.getItem('kaizen_user_score') || '0', 10)} />}
      {showStreakBoard && <StreakRankingBoard onClose={() => setShowStreakBoard(false)} />}

    </>
  );
}

export default App;
