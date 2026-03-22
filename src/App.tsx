import React, { useState, useEffect, Suspense } from 'react';
import type { KaizenProject } from './types';
import OperatingRoom from './components/OperatingRoom';
import SplashScreen from './components/SplashScreen';
import FeedbackOverlay from './components/FeedbackOverlay';
import AuthOverlay from './components/auth/AuthOverlay';
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
    if (['portal', 'observe', 'diagnose', 'improve', 'motion-v2', 'time-study', 'process-check', 'improvement-card', 'value-scanner', 'line-balance', 'kaizen-hub', 'action-items', 'lean-academy', 'video-hub'].includes(hashPath)) {
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

  const [currentView, setCurrentView] = useState<'splash' | 'portal' | 'observe' | 'diagnose' | 'improve' | 'dashboard' | 'promo' | 'gemba' | 'goal-gap' | 'motion-mapping' | 'motion-v2' | 'time-study' | 'process-check' | 'improvement-card' | 'value-scanner' | 'line-balance' | 'kaizen-hub' | 'action-items' | 'lean-academy' | 'video-hub'>(
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
        if (hashPath && hashPath !== currentView && ['portal', 'observe', 'diagnose', 'improve', 'motion-mapping', 'motion-v2', 'time-study', 'process-check', 'improvement-card', 'value-scanner', 'line-balance', 'kaizen-hub'].includes(hashPath)) {
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
  const [showAuth, setShowAuth] = useState(false);

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
    
    const flow = searchParams.get('flow');
    const sessionUrlParam = searchParams.get('session') || hashParams.get('session');
    const rawHash = window.location.hash.replace('#/', '');
    const hashPath = rawHash.split('?')[0];
    
    if (sessionUrlParam && hashPath !== 'kaizen-hub') {
      setCurrentView('motion-v2');
      window.location.hash = `/motion-v2?session=${sessionUrlParam}`;
    } else if (flow === 'register') {
      setShowAuth(true);
    }
  }, []);

  return (
    <ResponsiveSimulator>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
      {showProfileModal && profile && user && (
        <UserProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onUpdate={() => fetchProfile(user.id)}
        />
      )}

      <div className={`os-shell ${true ? 'context-closed' : ''}`}>
        
        {/* 1. HEADER ZONE (Massive Fixed Global Logo) */}
        <header className="os-header" style={{ height: 'auto', padding: '1rem 2rem', justifyContent: 'space-between', borderBottom: '2px solid #222' }}>
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
                    <button className="shadow-btn-accent" onClick={() => setShowAuth(true)} style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', border: 'none' }}>LOGIN</button>
                )}
            </div>
        </header>

        {/* 2. NAVIGATION SYSTEM (DESKTOP RAIL) */}
        <nav className="os-nav-rail hide-on-mobile">
            <button onClick={() => handleNavigate('portal')} style={{ background: 'transparent', border: 'none', color: currentView === 'portal' ? 'var(--zone-yellow)' : 'var(--steel-gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} title="Portal">
                <div style={{ fontSize: '1.75rem' }}>🔘</div>
            </button>
            <button onClick={() => handleNavigate('observe')} style={{ background: 'transparent', border: 'none', color: currentView === 'observe' ? 'var(--zone-yellow)' : 'var(--steel-gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} title="Observe">
                <div style={{ fontSize: '1.75rem' }}>👁️</div>
            </button>
            <button onClick={() => handleNavigate('diagnose')} style={{ background: 'transparent', border: 'none', color: currentView === 'diagnose' ? 'var(--zone-yellow)' : 'var(--steel-gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} title="Diagnose">
                <div style={{ fontSize: '1.75rem' }}>⚕️</div>
            </button>
            <button onClick={() => handleNavigate('improve')} style={{ background: 'transparent', border: 'none', color: currentView === 'improve' ? 'var(--zone-yellow)' : 'var(--steel-gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} title="Improve">
                <div style={{ fontSize: '1.75rem' }}>⚡</div>
            </button>
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
            {currentView === 'promo' && <PromoLanding onSignUp={() => { setShowAuth(true); handleNavigate('portal'); }} />}
            {currentView === 'portal' && <OperatingRoom onNavigate={handleNavigate} />}
            
            {/* Core Modules Framework */}
            {currentView === 'observe' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="gemba-panel zone-marker zone-marker-tl" style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div className="panel-title">OBSERVE <span style={{ color: 'var(--zone-yellow)', marginLeft: '0.5rem' }}>STATION</span></div>
                            <div className="panel-subtitle">PROCESS STUDY AND MOTION MAPPING</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <button className="shadow-btn" onClick={() => handleNavigate('motion-v2')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Motion Mapping V2</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Multi-device spaghetti tracking with calibrated floor plan layouts and live QR connectivity.
                                </p>
                            </button>
                            <button className="shadow-btn" onClick={() => handleNavigate('time-study')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏱️</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Time Study</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Capture cycle times, compare against Takt, and build objective datasets.
                                </p>
                            </button>
                        </div>
                        <div className="caster-wheel caster-wheel-left"></div>
                        <div className="caster-wheel caster-wheel-right"></div>
                    </div>
                </div>
            )}
            
            {currentView === 'diagnose' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="gemba-panel zone-marker zone-marker-br" style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div className="panel-title">DIAGNOSE <span style={{ color: 'var(--zone-yellow)', marginLeft: '0.5rem' }}>STATION</span></div>
                            <div className="panel-subtitle">WASTE IDENTIFICATION AND ROOT CAUSE ANALYSIS</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <button className="shadow-btn" onClick={() => handleNavigate('process-check')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Process Check</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Diagnose motion waste and field exits identified during observation.
                                </p>
                            </button>
                            <button className="shadow-btn" onClick={() => handleNavigate('line-balance')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚖️</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Line Balance</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Map cycle times against Takt Time. Identify constraints and balance work blocks.
                                </p>
                            </button>
                        </div>
                        <div className="caster-wheel caster-wheel-left"></div>
                        <div className="caster-wheel caster-wheel-right"></div>
                    </div>
                </div>
            )}
            
            {currentView === 'improve' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="gemba-panel zone-marker zone-marker-tl" style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div className="panel-title">IMPROVE <span style={{ color: 'var(--zone-yellow)', marginLeft: '0.5rem' }}>STATION</span></div>
                            <div className="panel-subtitle">ACTION-ORIENTED COUNTERMEASURE Tracking</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <button className="shadow-btn" onClick={() => handleNavigate('improvement-card')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Improvement Card</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Track countermeasures, measure expected vs actual results, and close the loop.
                                </p>
                            </button>
                        </div>
                        <div className="caster-wheel caster-wheel-left"></div>
                        <div className="caster-wheel caster-wheel-right"></div>
                    </div>
                </div>
            )}

            {currentView === 'gemba' && <GembaWalkGuide onClose={() => handleNavigate('portal')} />}
            {currentView === 'goal-gap' && <GoalGapMonitor onClose={() => handleNavigate('portal')} />}
            {currentView === 'action-items' && <ActionItems />}
            {currentView === 'lean-academy' && <LeanAcademy />}
            {currentView === 'video-hub' && <VideoHub onClose={() => handleNavigate('portal')} />}
            {currentView === 'motion-v2' && <MotionMappingV2 onClose={() => handleNavigate('portal')} />}
            {currentView === 'time-study' && <TimeStudy onClose={() => handleNavigate('portal')} />}
            {currentView === 'process-check' && <ProcessCheck onClose={() => handleNavigate('portal')} />}
            {currentView === 'improvement-card' && <ImprovementCard onClose={() => handleNavigate('portal')} />}
            {currentView === 'value-scanner' && <ValueScanner onClose={() => handleNavigate('portal')} />}
            {currentView === 'line-balance' && <LineBalanceBuilder onClose={() => handleNavigate('portal')} />}
            {currentView === 'kaizen-hub' && <KaizenSessionHub onNavigate={handleNavigate} />}
            {currentView === 'dashboard' && <Dashboard project={project} profile={profile} onStartNew={() => { setProject(null); }} onContinue={() => {}} />}
          </Suspense>
        </main>

        {/* 4. CONTEXT PANEL (Desktop Right / Mobile Bottom Sheet) */}
        {/* Intentionally left collapsed in this iteration to prioritize workspace max width */}

        {/* 5. NAVIGATION SYSTEM (MOBILE DOCK) */}
        <nav className="os-nav-dock hide-on-desktop app-bottom-dock" style={{ gridArea: 'os-nav-dock', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <button onClick={() => handleNavigate('portal')} className={`dock-item ${currentView === 'portal' ? 'active' : ''}`}>
                <div className="dock-item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
                <span>PORTAL</span>
            </button>
            <button onClick={() => handleNavigate('observe')} className={`dock-item ${currentView === 'observe' ? 'active' : ''}`}>
                <div className="dock-item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
                <span>OBSERVE</span>
            </button>
            <button onClick={() => handleNavigate('diagnose')} className={`dock-item ${currentView === 'diagnose' ? 'active' : ''}`}>
                <div className="dock-item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Custom Medical Cross / Wrench Hybrid */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                </div>
                <span>DIAGNOSE</span>
            </button>
            <button onClick={() => handleNavigate('improve')} className={`dock-item ${currentView === 'improve' ? 'active' : ''}`}>
                <div className="dock-item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <span>IMPROVE</span>
            </button>
        </nav>

      </div>

      <FeedbackOverlay />
      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
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
