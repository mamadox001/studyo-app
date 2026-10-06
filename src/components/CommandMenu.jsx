import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Flame, 
  Calendar, 
  Brain, 
  Lightbulb, 
  RotateCcw, 
  BarChart3, 
  BookOpen, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Layout, 
  Award, 
  Shield, 
  Sparkles, 
  Moon, 
  CloudRain, 
  HelpCircle, 
  Maximize, 
  X,
  Compass,
  ArrowRight,
  User,
  LogOut,
  Cloud
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function CommandMenu({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  flightMode,
  setFlightMode,
  cinemagraphMode,
  setCinemagraphMode,
  onOpenDeskMode,
  onOpenSoundMixer,
  onOpenNotionModal,
  onOpenBadgesModal,
  onOpenDopamineModal,
  onOpenShortcutsModal,
  isAudioMuted,
  onToggleMute,
  user,
  onOpenAuthModal,
  onLogout
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      soundEngine.playPop();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // All actionable commands
  const allCommands = useMemo(() => [
    // Studios
    {
      id: 'tab-focus',
      category: 'Studios & Workspaces',
      name: 'Focus Space',
      desc: 'Heatmap, intention HUD, and deep work tracking',
      icon: Flame,
      shortcut: '1',
      action: () => setActiveTab('focus')
    },
    {
      id: 'tab-planner',
      category: 'Studios & Workspaces',
      name: 'Timeblock Planner',
      desc: 'Visual timeline, study subjects, and day schedule',
      icon: Calendar,
      shortcut: '2',
      action: () => setActiveTab('planner')
    },
    {
      id: 'tab-blurting',
      category: 'Studios & Workspaces',
      name: 'Blurting Studio',
      desc: 'Rapid recall memory dumping and self-grading',
      icon: Brain,
      shortcut: '3',
      action: () => setActiveTab('blurting')
    },
    {
      id: 'tab-feynman',
      category: 'Studios & Workspaces',
      name: 'Feynman Technique Studio',
      desc: 'Simplify complex concepts like explaining to a 5-year-old',
      icon: Lightbulb,
      shortcut: '4',
      action: () => setActiveTab('feynman')
    },
    {
      id: 'tab-recall',
      category: 'Studios & Workspaces',
      name: 'Active Recall Flashcards',
      desc: 'SuperMemo-2 spaced repetition decks',
      icon: RotateCcw,
      shortcut: '5',
      action: () => setActiveTab('recall')
    },
    {
      id: 'tab-stats',
      category: 'Studios & Workspaces',
      name: 'Deep Analytics',
      desc: 'Subject distributions, weekly trends, and velocity',
      icon: BarChart3,
      shortcut: '6',
      action: () => setActiveTab('stats')
    },
    {
      id: 'tab-log',
      category: 'Studios & Workspaces',
      name: 'Study Logbook',
      desc: 'Chronological timeline of completed study sessions',
      icon: BookOpen,
      shortcut: '7',
      action: () => setActiveTab('log')
    },

    // Themes
    {
      id: 'theme-aurora',
      category: 'Flight Themes',
      name: 'Theme: Aurora Slate',
      desc: 'Deep celestial obsidian with violet aura',
      icon: Sparkles,
      action: () => setFlightMode('aurora')
    },
    {
      id: 'theme-cyberpunk',
      category: 'Flight Themes',
      name: 'Theme: Cyberpunk Amethyst',
      desc: 'High-contrast midnight with vivid magenta neon',
      icon: Sparkles,
      action: () => setFlightMode('cyberpunk')
    },
    {
      id: 'theme-kyoto',
      category: 'Flight Themes',
      name: 'Theme: Kyoto Zen',
      desc: 'Tranquil emerald moss and Japanese forest matcha',
      icon: Sparkles,
      action: () => setFlightMode('kyoto')
    },
    {
      id: 'theme-solar',
      category: 'Flight Themes',
      name: 'Theme: Solar Amber',
      desc: 'Warm sunset glow and vintage amber embers',
      icon: Sparkles,
      action: () => setFlightMode('solar')
    },
    {
      id: 'theme-sakura',
      category: 'Flight Themes',
      name: 'Theme: Sakura Night',
      desc: 'Cherry blossom velvet nightfall palette',
      icon: Sparkles,
      action: () => setFlightMode('sakura')
    },

    // Cinemagraph Atmosphere
    {
      id: 'cinema-stars',
      category: 'Atmosphere Backdrop',
      name: 'Atmosphere: Starfield Cosmos',
      desc: 'Floating stellar dust particles in deep space',
      icon: Moon,
      action: () => setCinemagraphMode('stars')
    },
    {
      id: 'cinema-rain',
      category: 'Atmosphere Backdrop',
      name: 'Atmosphere: Rainy Window',
      desc: 'Calming falling raindrops trickling on glass',
      icon: CloudRain,
      action: () => setCinemagraphMode('rain')
    },
    {
      id: 'cinema-embers',
      category: 'Atmosphere Backdrop',
      name: 'Atmosphere: Warm Embers',
      desc: 'Floating cozy fireplace particles',
      icon: Flame,
      action: () => setCinemagraphMode('embers')
    },
    {
      id: 'cinema-none',
      category: 'Atmosphere Backdrop',
      name: 'Atmosphere: Pure Dark (Minimalist)',
      desc: 'Disable background motion for pure battery efficiency',
      icon: Moon,
      action: () => setCinemagraphMode('none')
    },

    // Power Tools & Utilities
    {
      id: 'tool-desk',
      category: 'Power Tools & Zen',
      name: 'Aesthetic Desk Clock',
      desc: 'StudyTok fullscreen minimalist desk setup display',
      icon: Monitor,
      shortcut: 'D',
      action: () => onOpenDeskMode && onOpenDeskMode()
    },
    {
      id: 'tool-music',
      category: 'Power Tools & Zen',
      name: 'Focus Music & Ambience Mixer',
      desc: 'Free 24/7 Lo-Fi stations and offline audio synthesizer',
      icon: Volume2,
      action: () => onOpenSoundMixer && onOpenSoundMixer()
    },
    {
      id: 'tool-dopamine',
      category: 'Power Tools & Zen',
      name: 'Dopamine Reset / Urge Surfing',
      desc: 'Guided 4-7-8 breathing when distracted or craving social media',
      icon: Shield,
      action: () => onOpenDopamineModal && onOpenDopamineModal()
    },
    {
      id: 'tool-notion',
      category: 'Power Tools & Zen',
      name: 'Notion & Obsidian Embed Widget',
      desc: 'Export live study timer and badges directly into your notes',
      icon: Layout,
      action: () => onOpenNotionModal && onOpenNotionModal()
    },
    {
      id: 'tool-badges',
      category: 'Power Tools & Zen',
      name: 'Consistency Badges & Streak',
      desc: 'Track streak multiplier and unlocked themes',
      icon: Award,
      action: () => onOpenBadgesModal && onOpenBadgesModal()
    },
    {
      id: 'tool-mute',
      category: 'Power Tools & Zen',
      name: isAudioMuted ? 'Unmute Ambient Audio' : 'Mute Ambient Audio',
      desc: 'Quickly toggle white noise / rain / synthesizer audio',
      icon: isAudioMuted ? Volume2 : VolumeX,
      shortcut: 'M',
      action: () => onToggleMute && onToggleMute()
    },
    {
      id: 'tool-fullscreen',
      category: 'Power Tools & Zen',
      name: 'Toggle Fullscreen Mode',
      desc: 'Expand browser to complete edge-to-edge immersion',
      icon: Maximize,
      shortcut: 'F',
      action: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    },
    {
      id: 'tool-shortcuts',
      category: 'Power Tools & Zen',
      name: 'Keyboard Shortcuts Cheatsheet',
      desc: 'View all quick keys and power shortcuts',
      icon: HelpCircle,
      shortcut: '?',
      action: () => onOpenShortcutsModal && onOpenShortcutsModal()
    },

    // Account & Cloud Sync
    {
      id: 'account-auth',
      category: 'Account & Cloud Sync',
      name: user ? `Account: ${user.displayName || user.email}` : 'Sign In / Create Account',
      desc: user ? 'Cloud sync active with Cloudflare D1 database' : 'Sync study sessions, cards & streaks across devices 100% free',
      icon: user ? Cloud : User,
      action: () => {
        if (!user && onOpenAuthModal) onOpenAuthModal();
      }
    },
    ...(user ? [{
      id: 'account-logout',
      category: 'Account & Cloud Sync',
      name: 'Sign Out of Account',
      desc: 'Log out on this device (your study progress is preserved in the cloud)',
      icon: LogOut,
      action: () => {
        if (onLogout) onLogout();
      }
    }] : []),
  ], [
    activeTab, 
    flightMode, 
    cinemagraphMode, 
    isAudioMuted, 
    user,
    onOpenAuthModal,
    onLogout,
    setActiveTab, 
    setFlightMode, 
    setCinemagraphMode, 
    onOpenDeskMode, 
    onOpenSoundMixer, 
    onOpenNotionModal, 
    onOpenBadgesModal, 
    onOpenDopamineModal, 
    onOpenShortcutsModal, 
    onToggleMute
  ]);

  // Filter commands by user search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const executeCommand = (cmd) => {
    soundEngine.playClick();
    cmd.action();
    onClose();
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 'clamp(40px, 12vh, 100px)',
        paddingLeft: '16px',
        paddingRight: '16px',
        animation: 'fadeIn 0.15s ease forwards'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: 'min(580px, 80vh)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1px solid var(--border-focus)',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 30px var(--border-glow)',
          animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.25)'
        }}>
          <Search size={18} color="var(--accent-glow)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a studio, theme, or quick action... (e.g. Kyoto, Desk, 2)"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              color: 'var(--text-main)',
              fontSize: '15px',
              fontWeight: 500
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              style={{
                padding: '4px',
                color: 'var(--text-subtle)',
                borderRadius: '50%',
                display: 'flex'
              }}
            >
              <X size={14} />
            </button>
          )}
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-subtle)',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)'
          }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 8px'
          }}
        >
          {filteredCommands.length === 0 ? (
            <div style={{
              padding: '36px 20px',
              textAlign: 'center',
              color: 'var(--text-subtle)',
              fontSize: '13px'
            }}>
              No matching commands found for "{query}". Try "Focus", "Zen", or "Desk".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = cmd.icon;

              return (
                <div
                  key={cmd.id}
                  data-index={idx}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-focus)' : '1px solid transparent',
                    transition: 'all 0.12s ease',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}>
                      <IconComp size={16} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>{cmd.name}</span>
                        <span style={{
                          fontSize: '10.5px',
                          color: 'var(--text-subtle)',
                          fontWeight: 500
                        }}>
                          • {cmd.category}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '11.5px',
                        color: 'var(--text-subtle)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {cmd.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {cmd.shortcut && (
                      <span style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: isSelected ? 'var(--accent-glow)' : 'var(--text-subtle)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <ArrowRight size={14} color="var(--accent-glow)" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.3)',
          fontSize: '11.5px',
          color: 'var(--text-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span><strong style={{ color: 'var(--text-muted)' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: 'var(--text-muted)' }}>↵</strong> Select</span>
            <span><strong style={{ color: 'var(--text-muted)' }}>esc</strong> Close</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img src="/app-icon-squircle.png" alt="Studyo" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
            <span style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              <span style={{ color: '#2dd4bf' }}>st</span><span style={{ color: 'var(--text-main)' }}>udyo</span>
            </span>
            <span style={{ color: 'var(--text-subtle)', fontSize: '10.5px' }}>Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
