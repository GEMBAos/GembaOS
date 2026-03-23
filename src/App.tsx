import React, { useState, useEffect, Suspense } from 'react';
import type { KaizenProject } from './types';
import OperatingRoom from './components/OperatingRoom';
import SplashScreen from './components/SplashScreen';
import FeedbackOverlay from './components/FeedbackOverlay';
import LeanLifestyleTicker from './components/LeanLifestyleTicker';

import ResponsiveSimulator from './components/ResponsiveSimulator';
import PromoLanding from './components/PromoLanding';
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

import { userService } from './services/userService';
import { storageService } from './services/storageService';
import { ImprovementEngine } from './services/ImprovementEngine';
import type { UserProfile } from './services/userService';
import type { User } from '@supabase/supabase-js';
import StreakRankingBoard from './components/tools/StreakRankingBoard';
import brandLogo from './assets/branding/brand-cart-transparent.png';

import RankBenefitsModal from './components/tools/RankBenefitsModal';
import UserProfileModal from './components/auth/UserProfileModal';

function App() {
  const getInitialView = () => {
    const rawHash = window.location.hash.replace('#/', '');
    const hashPath = rawHash.split('?')[0];
    if (['portal', 'observe', 'diagnose', 'improve', 'motion-v2', 'time-study', 'process-check', 'improvement-card', 'value-scanner', 'line-balance', 'kaizen-hub', 'action-items', 'lean-academy', 'video-hub', 'gemba-challenge'].includes(hashPath)) {
        return hashPath as any;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('promo') === 'true') return 'promo';
    
    const flow = params.get('flow');
    if (flow === 'guest_challenge' || flow === 'jfi' || flow === 'register') return 'portal';
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || "");
    const sessionUrlParam = params.get('session') || hashParams.get('session');
    
    // Do not override kaizen hub deep links
    if (sessionUrlParam && hashPath !== 'kaizen-hub') {
        return 'motion-v2';
    }

    return 'portal';
  };

  const [currentView, setCurrentView] = useState<'splash' | 'portal' | 'observe' | 'diagnose' | 'improve' | 'dashboard' | 'promo' | 'gemba' | 'goal-gap' | 'motion-mapping' | 'motion-v2' | 'time-study' | 'process-check' | 'improvement-card' | 'value-scanner' | 'line-balance' | 'kaizen-hub' | 'action-items' | 'lean-academy' | 'video-hub' | 'gemba-challenge'>(
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
        if (hashPath && hashPath !== currentView && ['portal', 'observe', 'diagnose', 'improve', 'motion-mapping', 'motion-v2', 'time-study', 'process-check', 'improvement-card', 'value-scanner', 'line-balance', 'kaizen-hub', 'gemba-challenge'].includes(hashPath)) {
            setCurrentView(hashPath as any);
        }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);
  
  const [project, setProject] = useState<KaizenProject | null>(null);

  // Auth & Profile State
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Global Modal States
  const [showStreakBoard, setShowStreakBoard] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

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
    <ResponsiveSimulator>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {showProfileModal && profile && user && (
        <UserProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onUpdate={() => fetchProfile(user.id)}
        />
      )}

      <div className={`os-shell ${true ? 'context-closed' : ''}`}>
        
        {/* 1. HEADER ZONE (Massive Fixed Global Logo) */}
        <header className="os-header" style={{ height: 'auto', padding: '1.5rem 2rem 1rem 2rem', justifyContent: 'space-between', borderBottom: '2px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: 1 }} onClick={() => handleNavigate('portal')}>
                {/* Optional minor navigation nodes can go here */}
            </div>
            
            <div 
                onClick={() => handleNavigate('portal')}
                style={{ 
                    cursor: 'pointer',
                    width: 'clamp(280px, 50vw, 600px)', 
                    height: 'clamp(60px, 12vh, 140px)',
                    backgroundImage: `url(${brandLogo})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15)) drop-shadow(0 0 4px rgba(255,255,255,0.5))'
                }} 
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
                {user ? (
                    <div onClick={() => setShowProfileModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#e2e8f0', fontFamily: 'var(--font-headings)' }}>{profile?.username || user.email?.split('@')[0]}</div>
                        </div>
                        <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || user.email}&background=random`} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--zone-yellow)' }} />
                    </div>
                ) : (
                    <button className="shadow-btn-accent" onClick={() => {}} style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', border: 'none', background: '#333', color: '#888' }}>LOCAL</button>
                )}
            </div>
        </header>

        {/* PERSISTENT LEAN LIFE HACKS TICKER */}
        <LeanLifestyleTicker />

        {/* 2. NAVIGATION SYSTEM (DESKTOP RAIL) */}
        <nav className="os-nav-rail hide-on-mobile" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0', gap: '0.2rem', overflowY: 'auto', background: 'var(--bg-dark)', borderRight: '1px solid #111'
        }}>
            <button onClick={() => handleNavigate('portal')} style={{ background: 'transparent', border: 'none', color: currentView === 'portal' ? 'var(--zone-yellow)' : 'var(--steel-gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} title="Portal">
                <div style={{ fontSize: '1.75rem' }}>🔘</div>
            </button>
            <div style={{ width: '50%', height: '1px', background: '#333', margin: '0.5rem 0' }} />
            
            {[
                { id: 'motion', name: 'MOTION', icon: '🏃‍♂️', action: 'motion-v2' },
                { id: 'time', name: 'TIME', icon: '⏱️', action: 'time-study' },
                { id: 'waste', name: 'WASTE', icon: '🗑️', action: 'process-check' },
                { id: '5s', name: '5S SCAN', icon: '🔳', action: 'value-scanner' },
                { id: 'improve', name: 'IMPROVE', icon: '⚡', action: 'improvement-card' },
                { id: 'lsubmit', name: 'SUBMIT', icon: '📋', action: 'action-items' },
                { id: 'hub', name: 'HUB', icon: '⚡', action: 'kaizen-hub' },
                { id: 'balance', name: 'BALANCE', icon: '⚖️', action: 'line-balance' },
                { id: 'goal', name: 'GOALS', icon: '📈', action: 'goal-gap' },
                { id: 'video-hub', name: 'VIDEOS', icon: '📺', action: 'video-hub' },
                { id: 'learning', name: 'LEARN', icon: '🎓', action: 'lean-academy' },
                { id: 'challenge', name: 'QUIZ', icon: '🎯', action: 'gemba-challenge' }
            ].map(tool => (
                <button 
                    key={tool.id} 
                    onClick={() => handleNavigate(tool.action as any)}
                    style={{ background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', cursor: 'pointer', padding: '0.5rem 0.25rem' }}
                    title={tool.name}
                >
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: currentView === tool.action ? 'linear-gradient(145deg, #3a3a3a, #1a1a1a)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem', border: currentView === tool.action ? '1px solid var(--zone-yellow)' : '1px solid transparent',
                        color: currentView === tool.action ? 'var(--zone-yellow)' : 'inherit',
                        filter: currentView === tool.action ? 'drop-shadow(0 0 8px rgba(255,194,14,0.3))' : 'none'
                    }}>
                        <span>{tool.icon}</span>
                    </div>
                    <span style={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 800, 
                        marginTop: '0.25rem',
                        textAlign: 'center',
                        letterSpacing: '0.5px',
                        color: currentView === tool.action ? 'var(--zone-yellow)' : 'var(--steel-gray)' 
                    }}>
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
            {currentView === 'promo' && <PromoLanding onSignUp={() => { handleNavigate('portal'); }} />}
            {currentView === 'portal' && <OperatingRoom onNavigate={handleNavigate} />}
            
            {/* Core Modules Framework */}

            {currentView === 'gemba' && <GembaWalkGuide onClose={() => handleNavigate('portal')} />}
            {currentView === 'goal-gap' && <GoalGapMonitor onClose={() => handleNavigate('portal')} />}
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
            {currentView === 'dashboard' && <Dashboard project={project} profile={profile} onStartNew={() => { setProject(null); }} onContinue={() => {}} />}
          </Suspense>
        </main>

        {/* 4. CONTEXT PANEL (Desktop Right / Mobile Bottom Sheet) */}
        {/* Intentionally left collapsed in this iteration to prioritize workspace max width */}

        {/* 5. NAVIGATION SYSTEM (MOBILE DOCK) */}
        <nav className="os-nav-dock hide-on-desktop app-bottom-dock" style={{ gridArea: 'os-nav-dock', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', overflowX: 'auto', gap: '0.5rem', padding: '0.5rem', background: '#0a0a0a', borderTop: '2px solid #222' }}>
            {[
                { id: 'portal', name: 'PORTAL', icon: '🔘' },
                { id: 'motion-v2', name: 'MOTION', icon: '🏃‍♂️' },
                { id: 'time-study', name: 'TIME', icon: '⏱️' },
                { id: 'process-check', name: 'WASTE', icon: '🗑️' }
            ].map(tool => (
                <button key={tool.id} onClick={() => handleNavigate(tool.id as any)} className={`dock-item ${currentView === tool.id ? 'active' : ''}`} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem', background: 'transparent', border: 'none', color: currentView === tool.id ? 'var(--zone-yellow)' : 'var(--steel-gray)' }}>
                    <div style={{ fontSize: '1.5rem' }}>{tool.icon}</div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>{tool.name}</span>
                </button>
            ))}
        </nav>

      </div>

      <FeedbackOverlay />
      {showRankModal && <RankBenefitsModal onClose={() => setShowRankModal(false)} currentScore={parseInt(localStorage.getItem('kaizen_user_score') || '0', 10)} />}
      {showStreakBoard && <StreakRankingBoard onClose={() => setShowStreakBoard(false)} />}

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
            .hide-on-mobile { display: none !important; }
        }
        @media (min-width: 1025px) {
            .hide-on-desktop { display: none !important; }
        }
      `}} />
    </ResponsiveSimulator>
  );
}

export default App;
