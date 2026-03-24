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
import JFIIdeaGenerator from './components/tools/JFIIdeaGenerator';

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

import notionIcon from './assets/icons/notion.png';
import timeIcon from './assets/icons/time.png';
import wasteIcon from './assets/icons/waste.png';
import scanIcon from './assets/icons/scan.png';
import improvIcon from './assets/icons/improv.png';
import goalsIcon from './assets/icons/goals.png';
import learnIcon from './assets/icons/learn.png';
import videosIcon from './assets/icons/videos.png';

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
        <header className="os-header" style={{ height: 'auto', padding: '1rem 2rem', justifyContent: 'space-between', background: '#111', borderBottom: '2px solid rgba(255,194,14,0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: 1 }} onClick={() => handleNavigate('portal')}>
                {/* Optional minor navigation nodes can go here */}
            </div>
            
            <div 
                onClick={() => handleNavigate('portal')}
                style={{ 
                    cursor: 'pointer',
                    width: 'clamp(280px, 50vw, 400px)', 
                    height: 'clamp(60px, 12vh, 80px)',
                    backgroundImage: `url(${brandLogo})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'
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

        {/* PERSISTENT LEAN LIFE HACKS TICKER */}
        <div style={{ gridArea: 'os-ticker' }}>
            <LeanLifestyleTicker />
        </div>

        {/* PERSISTENT FLAT IDEA ENGINE LOGGING BAR */}
        <div style={{ gridArea: 'os-idea', position: 'relative', zIndex: 45, background: 'transparent', padding: '2rem 1rem 0 1rem' }}>
            <JFIIdeaGenerator 
                onIdeaGenerated={() => {}} 
                profile={profile} 
                onNavigate={(r) => handleNavigate(r as any)}
            />
        </div>

        {/* 2. NAVIGATION SYSTEM (PERSISTENT LEFT RAIL) */}
        <nav className="os-nav-rail">
            <button onClick={() => handleNavigate('portal')} style={{ background: 'transparent', border: 'none', color: currentView === 'portal' ? 'var(--zone-yellow)' : 'var(--steel-gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1rem' }} title="Portal">
                <div style={{ fontSize: '1.75rem', filter: currentView === 'portal' ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none' }}>🔘</div>
            </button>
            <div style={{ width: '60%', height: '2px', background: '#333', margin: '0.5rem 0', boxShadow: '0 1px 0 rgba(255,255,255,0.1)' }} />
            
            {[
                { id: 'forms', name: 'FORMS', icon: '📝', action: 'action-items', imgSrc: notionIcon },
                { id: 'time', name: 'TIME', icon: '⏱️', action: 'time-study', imgSrc: timeIcon },
                { id: 'waste', name: 'WASTE', icon: '🗑️', action: 'process-check', imgSrc: wasteIcon },
                { id: 'scan', name: 'SCAN', icon: '🔳', action: 'value-scanner', imgSrc: scanIcon },
                { id: 'improv', name: 'IMPROVE', icon: '⚡', action: 'improvement-card', imgSrc: improvIcon },
                { id: 'goals', name: 'GOALS', icon: '🎯', action: 'goal-gap', imgSrc: goalsIcon },
                { id: 'videos', name: 'VIDEOS', icon: '📺', action: 'video-hub', imgSrc: videosIcon },
                { id: 'learn', name: 'LEARN', icon: '🧠', action: 'lean-academy', imgSrc: learnIcon }
            ].map(tool => (
                <button 
                    key={tool.id} 
                    onClick={() => handleNavigate(tool.action as any)}
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '0.4rem', 
                        cursor: 'pointer', 
                        padding: '0.75rem 0.25rem',
                        position: 'relative',
                        width: '100%',
                        borderLeft: currentView === tool.action ? '4px solid var(--zone-yellow)' : '4px solid transparent',
                        backgroundColor: currentView === tool.action ? 'rgba(255,194,14,0.05)' : 'transparent',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    title={tool.name}
                >
                    <div style={{
                        width: '54px', height: '54px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative'
                    }}>
                        {tool.imgSrc ? (
                            <img 
                                src={tool.imgSrc} 
                                alt={tool.name} 
                                style={{
                                    width: '75%', height: '75%', objectFit: 'contain', 
                                    filter: currentView === tool.action ? 'drop-shadow(0 8px 15px rgba(0,0,0,0.15)) brightness(1.05)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
                                    opacity: currentView === tool.action ? 1 : 0.65,
                                    transform: currentView === tool.action ? 'scale(1.15) translateY(-3px)' : 'scale(1)',
                                    transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }} 
                            />
                        ) : (
                            <span style={{ 
                                transform: currentView === tool.action ? 'scale(1.15)' : 'scale(1)', 
                                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}>{tool.icon}</span>
                        )}
                    </div>
                    <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 900, 
                        marginTop: '0.25rem',
                        textAlign: 'center',
                        letterSpacing: '1px',
                        color: currentView === tool.action ? 'var(--gemba-black)' : 'var(--steel-gray)',
                        fontFamily: 'var(--font-headings)'
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

        {/* DELETED BOTTOM DOCK - User rule strictly enforces persistent left rail */}

      </div>

      <FeedbackOverlay />
      {showRankModal && <RankBenefitsModal onClose={() => setShowRankModal(false)} currentScore={parseInt(localStorage.getItem('kaizen_user_score') || '0', 10)} />}
      {showStreakBoard && <StreakRankingBoard onClose={() => setShowStreakBoard(false)} />}

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
            /* We NO LONGER hide the left rail. We scale it safely down instead of flattening it to the bottom. */
            .os-nav-rail {
                width: 70px !important;
                padding-top: 0.5rem !important;
            }
            .os-nav-rail span { font-size: 0.5rem !important; }
            .os-nav-rail div { width: 44px !important; height: 44px !important; }
        }
        @media (min-width: 1025px) {
            
        }
      `}} />
    </ResponsiveSimulator>
  );
}

export default App;
