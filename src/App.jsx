import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FocusDashboard from './components/FocusDashboard';
import FocusIsland from './components/FocusIsland';
import BlurtingStudio from './components/BlurtingStudio';
import RecallStudio from './components/RecallStudio';
import StatsView from './components/StatsView';
import StudyLogView from './components/StudyLogView';
import TimeblockPlanner from './components/TimeblockPlanner';
import FeynmanStudio from './components/FeynmanStudio';
import SoundMixerModal from './components/SoundMixerModal';
import FlightModesModal from './components/FlightModesModal';
import ShareModal from './components/ShareModal';
import OnboardingModal from './components/OnboardingModal';
import DeskMode from './components/DeskMode';
import NotionEmbedModal from './components/NotionEmbedModal';
import BadgesAndStreakModal from './components/BadgesAndStreakModal';
import DopamineResetModal from './components/DopamineResetModal';
import CinemagraphBackdrop from './components/CinemagraphBackdrop';
import CommandMenu from './components/CommandMenu';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import AuthModal from './components/AuthModal';
import { Storage } from './services/storage';
import { soundEngine } from './services/soundEngine';
import { authService } from './services/authService';

export default function App() {
  const [activeTab, setActiveTab] = useState('focus');
  const [sessions, setSessions] = useState(() => Storage.getSessions());
  const [subjects, setSubjects] = useState(() => Storage.getSubjects());
  const [selectedSubject, setSelectedSubject] = useState(() => subjects[0]?.name || 'Software Architecture');
  const [blurts, setBlurts] = useState(() => Storage.getBlurts());
  const [decks, setDecks] = useState(() => Storage.getDecks());
  const [cards, setCards] = useState(() => Storage.getCards());

  // User & Cloud Authentication State
  const [user, setUser] = useState(() => authService.getUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Preferences & Modals
  const [settings, setSettings] = useState(() => Storage.getSettings());
  const [flightMode, setFlightMode] = useState(() => settings.flightMode || 'aurora');
  const [cinemagraphMode, setCinemagraphMode] = useState('stars'); // 'none', 'rain', 'stars', 'embers'
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Modern Sidebar States (collapsible rail on desktop & drawer on mobile)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal Visibility
  const [isSoundMixerOpen, setIsSoundMixerOpen] = useState(false);
  const [isFlightModesOpen, setIsFlightModesOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !Storage.hasOnboarded());
  const [isDeskModeOpen, setIsDeskModeOpen] = useState(false);
  const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isDopamineModalOpen, setIsDopamineModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // PWA beforeinstallprompt event listener & Global Power Shortcuts
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Global Key Shortcuts
    const handleGlobalKeyDown = (e) => {
      // ⌘K or Ctrl+K for Command Menu (works anywhere, even in inputs)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandMenuOpen(prev => !prev);
        return;
      }

      // Check if typing in an input/textarea
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      // Question mark for shortcuts cheat sheet
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen(prev => !prev);
        return;
      }

      // 'D' for aesthetic Desk Clock
      if (e.key === 'd' || e.key === 'D') {
        setIsDeskModeOpen(prev => !prev);
        return;
      }

      // 'M' for toggle Mute
      if (e.key === 'm' || e.key === 'M') {
        const muted = soundEngine.toggleMute();
        setIsAudioMuted(muted);
        return;
      }

      // 'F' for toggle Fullscreen
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        return;
      }

      // 1-7 studio quick switch
      const tabKeyMap = {
        '1': 'focus',
        '2': 'planner',
        '3': 'blurting',
        '4': 'feynman',
        '5': 'recall',
        '6': 'stats',
        '7': 'log'
      };
      if (tabKeyMap[e.key]) {
        soundEngine.playClick();
        setActiveTab(tabKeyMap[e.key]);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Subscribe to auth state updates and verify session token
  useEffect(() => {
    const unsubscribe = authService.subscribe((updatedUser) => {
      setUser(updatedUser);
    });
    authService.checkMe();
    return unsubscribe;
  }, []);

  // Apply theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', flightMode);
    Storage.saveSettings({ ...settings, flightMode });
  }, [flightMode]);

  // Session completed from timer
  const handleSessionComplete = (newSession) => {
    const updated = Storage.saveSession(newSession);
    setSessions([...updated]);

    // Free Cloud Sync: If signed in, sync immediately to Cloudflare D1
    if (authService.isAuthenticated()) {
      authService.syncToCloud({
        streak: 7,
        totalMinutes: updated.reduce((acc, s) => acc + (s.duration || 0), 0),
        sessions: updated
      }).catch(err => console.log('Cloud sync error:', err));
    }
  };

  const handleSaveBlurt = (newBlurt) => {
    const updated = Storage.saveBlurt(newBlurt);
    setBlurts([...updated]);
  };

  const handleSaveCard = (newCard) => {
    const updated = Storage.saveCard(newCard);
    setCards([...updated]);
  };

  const handleSelectTheme = (themeId) => {
    setFlightMode(themeId);
    setIsFlightModesOpen(false);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleCloseOnboarding = () => {
    Storage.setOnboarded(true);
    setIsOnboardingOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
      position: 'relative'
    }}>
      {/* Cinemagraph Atmosphere Particles (LifeAt style) */}
      <CinemagraphBackdrop mode={cinemagraphMode} />

      {/* Ambient background glow */}
      <div className="ambient-bg-glow" />

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenFlightModes={() => setIsFlightModesOpen(true)}
        onOpenSoundMixer={() => setIsSoundMixerOpen(true)}
        onOpenDeskMode={() => setIsDeskModeOpen(true)}
        onOpenNotionModal={() => setIsNotionModalOpen(true)}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
        onOpenDopamineModal={() => setIsDopamineModalOpen(true)}
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        stats={{ streak: 7 }}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => authService.logout()}
      />

      {/* Main Workspace Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        minWidth: 0
      }}>
        {/* Top Header */}
        <Header
          flightMode={flightMode}
          onOpenFlightModes={() => setIsFlightModesOpen(true)}
          onOpenSoundMixer={() => setIsSoundMixerOpen(true)}
          onOpenDeskMode={() => setIsDeskModeOpen(true)}
          onOpenNotionModal={() => setIsNotionModalOpen(true)}
          onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
          isAudioMuted={isAudioMuted}
          onToggleMute={handleToggleMute}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          deferredPrompt={deferredPrompt}
          onInstallPwa={handleInstallPwa}
          user={user}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={() => authService.logout()}
        />

        {/* Dynamic Tab Content with Silky View Entrance */}
        <main 
          key={activeTab}
          className="view-enter"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingBottom: '110px', // Clearance for floating timer island
            position: 'relative',
            width: '100%'
          }}
        >
          {activeTab === 'focus' && (
            <FocusDashboard
              sessions={sessions}
              subjects={subjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          )}

          {activeTab === 'planner' && (
            <TimeblockPlanner
              sessions={sessions}
              subjects={subjects}
            />
          )}

          {activeTab === 'blurting' && (
            <BlurtingStudio
              subjects={subjects}
              blurts={blurts}
              onSaveBlurt={handleSaveBlurt}
            />
          )}

          {activeTab === 'feynman' && (
            <FeynmanStudio
              subjects={subjects}
              onSaveCard={handleSaveCard}
            />
          )}

          {activeTab === 'recall' && (
            <RecallStudio
              decks={decks}
              cards={cards}
              onSaveCard={handleSaveCard}
            />
          )}

          {activeTab === 'stats' && (
            <StatsView
              sessions={sessions}
              subjects={subjects}
            />
          )}

          {activeTab === 'log' && (
            <StudyLogView
              sessions={sessions}
            />
          )}
        </main>

        {/* Central Floating Focus Timer Island */}
        <FocusIsland
          selectedSubject={selectedSubject}
          onSessionComplete={handleSessionComplete}
          onOpenDeskMode={() => setIsDeskModeOpen(true)}
          onOpenDopamineModal={() => setIsDopamineModalOpen(true)}
        />
      </div>

      {/* Aesthetic Fullscreen Desk Mode (StudyTok Clock) */}
      <DeskMode
        isOpen={isDeskModeOpen}
        onClose={() => setIsDeskModeOpen(false)}
        selectedSubject={selectedSubject}
        stats={{ streak: 7 }}
      />

      {/* Notion & Obsidian Widget Modal */}
      <NotionEmbedModal
        isOpen={isNotionModalOpen}
        onClose={() => setIsNotionModalOpen(false)}
      />

      {/* Gamified Streak & Consistency Badges Modal */}
      <BadgesAndStreakModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        stats={{ streak: 7 }}
        onSelectTheme={handleSelectTheme}
      />

      {/* Dopamine Reset / Urge Surfing Modal */}
      <DopamineResetModal
        isOpen={isDopamineModalOpen}
        onClose={() => setIsDopamineModalOpen(false)}
      />

      {/* Sensory & Utility Modals */}
      <SoundMixerModal
        isOpen={isSoundMixerOpen}
        onClose={() => setIsSoundMixerOpen(false)}
      />

      <FlightModesModal
        isOpen={isFlightModesOpen}
        onClose={() => setIsFlightModesOpen(false)}
        currentTheme={flightMode}
        onSelectTheme={handleSelectTheme}
        cinemagraphMode={cinemagraphMode}
        onSelectCinemagraph={setCinemagraphMode}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        sessions={sessions}
        stats={{ streak: 7 }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />

      {/* Raycast Spotlight Command Menu */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        flightMode={flightMode}
        setFlightMode={handleSelectTheme}
        cinemagraphMode={cinemagraphMode}
        setCinemagraphMode={setCinemagraphMode}
        onOpenDeskMode={() => setIsDeskModeOpen(true)}
        onOpenSoundMixer={() => setIsSoundMixerOpen(true)}
        onOpenNotionModal={() => setIsNotionModalOpen(true)}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
        onOpenDopamineModal={() => setIsDopamineModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => authService.logout()}
      />

      {/* Keyboard Shortcuts Cheat Sheet */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Cloud Authentication & Sync Modal (100% Free Cloudflare D1) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
