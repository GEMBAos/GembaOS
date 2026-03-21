import React, { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import type { KaizenProject } from './types';
import OperatingRoom from './components/OperatingRoom';
import SplashScreen from './components/SplashScreen';
import FeedbackOverlay from './components/FeedbackOverlay';
import AuthOverlay from './components/auth/AuthOverlay';
import ResponsiveSimulator from './components/ResponsiveSimulator';
import PromoLanding from './components/PromoLanding';
import AppFooter from './components/AppFooter';
import { supabase } from './lib/supabase';
import iconLogo from './assets/branding/gembaos-icon.png';

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

import { userService } from './services/userService';
import { storageService } from './services/storageService';
import { ImprovementEngine } from './services/ImprovementEngine';
import type { UserProfile } from './services/userService';
import type { User } from '@supabase/supabase-js';
import StreakRankingBoard from './components/tools/StreakRankingBoard';
import RankBenefitsModal from './components/tools/RankBenefitsModal';
import UserProfileModal from './components/auth/UserProfileModal';

function App() {
  const { t, i18n } = useTranslation();
  const getInitialView = () => {
    const rawHash = window.location.hash.replace('#/', '');
    const hashPath = rawHash.split('?')[0];
    if (['portal', 'observe', 'diagnose', 'improve', 'motion-v2', 'time-study', 'process-check', 'improvement-card', 'value-scanner', 'line-balance', 'kaizen-hub'].includes(hashPath)) {
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

    return 'splash';
  };

  const [currentView, setCurrentView] = useState<'splash' | 'portal' | 'observe' | 'diagnose' | 'improve' | 'dashboard' | 'promo' | 'gemba' | 'goal-gap' | 'motion-mapping' | 'motion-v2' | 'time-study' | 'process-check' | 'improvement-card' | 'value-scanner' | 'line-balance' | 'kaizen-hub'>(
    getInitialView()
  );

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
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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

  const handleLogout = async () => {
    ImprovementEngine.flushActiveContext();
    await supabase.auth.signOut();
  };

  if (currentView === 'splash') {
    return <SplashScreen onComplete={() => handleNavigate('portal')} />;
  }

  return (
    <ResponsiveSimulator>
      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
      {showProfileModal && profile && user && (
        <UserProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onUpdate={() => fetchProfile(user.id)}
        />
      )}

      <div className="app-container gemba-floor" style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
        <header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            paddingTop: 'calc(1rem + env(safe-area-inset-top))',
            background: 'var(--gemba-black)',
            borderBottom: '2px solid #000',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => handleNavigate('portal')}>
                    <img src={iconLogo} alt="GembaOS" style={{ height: '32px' }} />
                    <span style={{ fontFamily: '"Orbitron", sans-serif', color: '#fff', fontWeight: 800, letterSpacing: '4px', fontSize: '1.4rem' }} className="hide-on-mobile">GEMBA OS</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                     {/* Hamburger Menu Area - Kept minimal for skeletal mapping */}
                     <div style={{ padding: '0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                         <div style={{ width: '24px', height: '2px', background: '#ccc' }}></div>
                         <div style={{ width: '24px', height: '2px', background: '#ccc' }}></div>
                         <div style={{ width: '24px', height: '2px', background: '#ccc' }}></div>
                     </div>
                </div>
            </div>
            
            {/* Utilities */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-dark)', padding: '0.25rem', borderRadius: '4px', border: '1px solid #000' }} className="hide-on-mobile-flex">
                    <button onClick={() => i18n.changeLanguage('en')} style={{ padding: '0.25rem 0.5rem', background: i18n.language.startsWith('en') ? 'var(--accent-primary)' : 'transparent', borderRadius: '4px', border: 'none', color: i18n.language.startsWith('en') ? '#000' : '#64748b', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', transition: 'all 0.2s' }}>EN</button>
                    <button onClick={() => i18n.changeLanguage('es')} style={{ padding: '0.25rem 0.5rem', background: i18n.language.startsWith('es') ? 'var(--accent-primary)' : 'transparent', borderRadius: '4px', border: 'none', color: i18n.language.startsWith('es') ? '#000' : '#64748b', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', transition: 'all 0.2s' }}>ES</button>
                </div>
                
                {/* LSW / Kamishibai Panel (Visual Only for now) */}
                <div className="hide-on-mobile-flex" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-dark)', padding: '0.25rem 0.5rem', border: '2px solid var(--border-color)', borderRadius: '4px', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)' }}>
                     <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--tape-yellow)', marginRight: '0.5rem', letterSpacing: '1px' }}>LSW CHECKS</div>
                     <div style={{ display: 'flex', gap: '0.25rem' }}>
                         <div title="Daily Checks Complete" style={{ width: '16px', height: '16px', borderRadius: '2px', background: 'var(--accent-success)', border: '1px solid #000' }} />
                         <div title="Weekly Checks Pending" style={{ width: '16px', height: '16px', borderRadius: '2px', background: 'var(--accent-danger)', border: '1px solid #000' }} />
                     </div>
                </div>

                {/* User Profile / Login */}
                {user ? (
                    <div onClick={() => setShowProfileModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <div style={{ textAlign: 'right' }} className="hide-on-mobile">
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#e2e8f0', fontFamily: 'var(--font-headings)' }}>{profile?.username || user.email?.split('@')[0]}</div>
                        </div>
                        <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || user.email}&background=random`} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
                    </div>
                ) : (
                    <button className="btn-primary" onClick={() => setShowAuth(true)} style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem' }}>Operator Login</button>
                )}
                {deferredPrompt && (
                    <button className="hide-on-mobile" onClick={() => { deferredPrompt.prompt(); setDeferredPrompt(null); }} style={{ background: 'var(--accent-success)', border: 'none', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s' }}>Install App</button>
                )}
                <button className="hide-on-desktop" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>☰</button>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .hide-on-mobile { display: none !important; }
                    .hide-on-mobile-flex { display: none !important; }
                }
                @media (min-width: 769px) {
                    .hide-on-desktop { display: none !important; }
                }
            `}</style>
        </header>

        {/* Main Workspace Area - STRICT OVERFLOW HIDDEN */}
        <main className="main-content" style={{ flex: 1, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
          {currentView === 'promo' && <PromoLanding onSignUp={() => { setShowAuth(true); handleNavigate('portal'); }} />}
          {currentView === 'portal' && <OperatingRoom onNavigate={handleNavigate} />}
          
          <Suspense fallback={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--zone-yellow)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-headings)', letterSpacing: '2px' }}>LOADING STATION...</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          }>
            {/* Core Modules Placeholders */}
            {currentView === 'observe' && (
                <div className="or-grid-wrapper" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    <div className="gemba-panel zone-marker zone-marker-tl" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                        <div className="panel-title">OBSERVE <span style={{ color: 'var(--zone-yellow)', marginLeft: '0.5rem' }}>STATION</span></div>
                        <div className="panel-subtitle">PROCESS STUDY AND MOTION MAPPING</div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <button className="shadow-btn" onClick={() => handleNavigate('motion-v2')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📍</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Motion Mapping V2</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Multi-device spaghetti tracking with calibrated floor plan layouts and live QR connectivity.
                                </p>
                            </button>

                            <button className="shadow-btn" onClick={() => handleNavigate('time-study')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏱️</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Time Study</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Capture accurate cycle times, compare against Takt, and build objective datasets.
                                </p>
                            </button>
                        </div>
                        <div className="caster-wheel caster-wheel-left"></div>
                        <div className="caster-wheel caster-wheel-right"></div>
                    </div>
                </div>
            )}
            {currentView === 'diagnose' && (
                <div className="or-grid-wrapper" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    <div className="gemba-panel zone-marker zone-marker-br" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                        <div className="panel-title">DIAGNOSE <span style={{ color: 'var(--zone-yellow)', marginLeft: '0.5rem' }}>STATION</span></div>
                        <div className="panel-subtitle">WASTE IDENTIFICATION AND ROOT CAUSE ANALYSIS</div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <button className="shadow-btn" onClick={() => handleNavigate('process-check')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                                <h3 style={{ color: 'var(--lean-white)', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontFamily: 'var(--font-headings)', textTransform: 'uppercase' }}>Process Check</h3>
                                <p style={{ color: 'var(--steel-gray)', margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'none' }}>
                                    Diagnose motion waste and field exits identified during observation.
                                </p>
                            </button>

                            <button className="shadow-btn" onClick={() => handleNavigate('line-balance')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚖️</div>
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
                <div className="or-grid-wrapper" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    <div className="gemba-panel zone-marker zone-marker-tl" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                        <div className="panel-title">IMPROVE <span style={{ color: 'var(--zone-yellow)', marginLeft: '0.5rem' }}>STATION</span></div>
                        <div className="panel-subtitle">ACTION-ORIENTED COUNTERMEASURE TRACKING</div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <button className="shadow-btn" onClick={() => handleNavigate('improvement-card')} style={{ flex: '1 1 250px', padding: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
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
            
            {/* Operating Room Tools */}
            {currentView === 'goal-gap' && <GoalGapMonitor onClose={() => handleNavigate('portal')} />}

            {currentView === 'motion-v2' && <MotionMappingV2 onClose={() => handleNavigate('portal')} />}
            {currentView === 'time-study' && <TimeStudy onClose={() => handleNavigate('portal')} />}
            {currentView === 'process-check' && <ProcessCheck onClose={() => handleNavigate('portal')} />}
            {currentView === 'improvement-card' && <ImprovementCard onClose={() => handleNavigate('portal')} />}
            {currentView === 'value-scanner' && <ValueScanner onClose={() => handleNavigate('portal')} />}
            {currentView === 'line-balance' && <LineBalanceBuilder onClose={() => handleNavigate('portal')} />}
            {currentView === 'kaizen-hub' && <KaizenSessionHub onNavigate={handleNavigate} />}
            
            {/* Provisional Tool */}
            {currentView === 'dashboard' && <Dashboard project={project} profile={profile} onStartNew={() => { setProject(null); }} onContinue={() => {}} />}
            
            {/* Mobile Bottom Tab Bar */}
            {(['portal', 'observe', 'diagnose', 'improve'].includes(currentView)) && (
                <nav className="mobile-bottom-nav" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    <button onClick={() => handleNavigate('portal')} style={{ background: 'transparent', border: 'none', color: currentView === 'portal' ? 'var(--accent-primary)' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.25rem', filter: currentView === 'portal' ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' : 'none' }}>🔘</div>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Portal</span>
                    </button>
                    <button onClick={() => handleNavigate('observe')} style={{ background: 'transparent', border: 'none', color: currentView === 'observe' ? 'var(--accent-primary)' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.25rem', filter: currentView === 'observe' ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' : 'none' }}>👁️</div>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Observe</span>
                    </button>
                    <button onClick={() => handleNavigate('diagnose')} style={{ background: 'transparent', border: 'none', color: currentView === 'diagnose' ? 'var(--accent-primary)' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.25rem', filter: currentView === 'diagnose' ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' : 'none' }}>⚕️</div>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Diagnose</span>
                    </button>
                    <button onClick={() => handleNavigate('improve')} style={{ background: 'transparent', border: 'none', color: currentView === 'improve' ? 'var(--accent-primary)' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.25rem', filter: currentView === 'improve' ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' : 'none' }}>⚡</div>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px' }}>Improve</span>
                    </button>
                </nav>
            )}
          </Suspense>
          
          {/* Global Footer */}
          {(currentView === 'portal' || currentView === 'promo') && (
            <AppFooter />
          )}
        </main>
      </div>

      <FeedbackOverlay />
      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
      {showRankModal && <RankBenefitsModal onClose={() => setShowRankModal(false)} currentScore={parseInt(localStorage.getItem('kaizen_user_score') || '0', 10)} />}
      {showStreakBoard && <StreakRankingBoard onClose={() => setShowStreakBoard(false)} />}

      {/* Simplified Mobile Menu */}
      <div className={`sidebar-overlay ${isMenuOpen ? 'visible' : ''}`} onClick={() => setIsMenuOpen(false)} />
      <aside className={`sidebar ${isMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
             <img src={iconLogo} alt="GembaOS" className="app-logo" style={{ height: '30px', marginBottom: '1rem'}} />
             <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Modules</div>
             <button className={`nav-link ${currentView === 'portal' ? 'active' : ''}`} onClick={() => { handleNavigate('portal'); setIsMenuOpen(false); }}>Operating Room</button>
             <button className={`nav-link ${currentView === 'observe' ? 'active' : ''}`} onClick={() => { handleNavigate('observe'); setIsMenuOpen(false); }}>Observe</button>
             <button className={`nav-link ${currentView === 'diagnose' ? 'active' : ''}`} onClick={() => { handleNavigate('diagnose'); setIsMenuOpen(false); }}>Diagnose</button>
             <button className={`nav-link ${currentView === 'improve' ? 'active' : ''}`} onClick={() => { handleNavigate('improve'); setIsMenuOpen(false); }}>Improve</button>
          </div>
          
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Preferences</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => { i18n.changeLanguage('en'); setIsMenuOpen(false); }} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', background: i18n.language.startsWith('en') ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: i18n.language.startsWith('en') ? '#000' : 'white', border: 'none', fontWeight: 'bold' }}>EN</button>
              <button onClick={() => { i18n.changeLanguage('es'); setIsMenuOpen(false); }} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', background: i18n.language.startsWith('es') ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: i18n.language.startsWith('es') ? '#000' : 'white', border: 'none', fontWeight: 'bold' }}>ES</button>
            </div>
            
            {user ? (
              <button className="btn" style={{ width: '100%', marginTop: '1rem', borderColor: 'var(--accent-danger)', color: 'var(--accent-danger)' }} onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                🚪 {t('auth.logout', 'Logout')}
              </button>
            ) : (
              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => { setShowAuth(true); setIsMenuOpen(false); }}>
                {t('auth.login', 'Log In or Sign Up')}
              </button>
            )}
            {deferredPrompt && (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--accent-success)', borderColor: 'var(--accent-success)' }} onClick={() => { deferredPrompt.prompt(); setDeferredPrompt(null); setIsMenuOpen(false); }}>
                📱 Install App
              </button>
            )}
          </div>
        </div>
      </aside>
      <style dangerouslySetInnerHTML={{__html: `
        .ticker-mask-area {
            mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
            -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
        }
        .ticker-scroll-content {
            display: inline-block;
            animation: tickerScroll 30s linear infinite;
        }
        .ticker-scroll-content:hover {
            animation-play-state: paused;
        }
        @keyframes tickerScroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
      `}} />
    </ResponsiveSimulator>
  );
}

export default App;
