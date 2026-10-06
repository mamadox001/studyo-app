import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Share2, 
  HelpCircle,
  Sparkles,
  Music2,
  Play,
  Pause,
  Monitor,
  Layout,
  Award,
  Download,
  Menu,
  Search,
  Keyboard,
  User,
  LogOut,
  Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { musicEngine } from '../services/musicEngine';
import { soundEngine } from '../services/soundEngine';

export default function Header({ 
  flightMode, 
  onOpenFlightModes, 
  onOpenSoundMixer, 
  onOpenDeskMode,
  onOpenNotionModal,
  onOpenBadgesModal,
  onOpenCommandMenu,
  onOpenShortcutsModal,
  isAudioMuted, 
  onToggleMute, 
  onOpenOnboarding,
  onOpenShareModal,
  onOpenMobileSidebar,
  deferredPrompt,
  onInstallPwa,
  user,
  onOpenAuthModal,
  onLogout
}) {
  const [musicState, setMusicState] = useState(() => musicEngine.getState());

  useEffect(() => {
    const unsubscribeMusic = musicEngine.subscribe((state) => {
      setMusicState({ ...state });
    });
    return unsubscribeMusic;
  }, []);

  const flightModeLabels = {
    aurora: { label: 'Aurora Slate', icon: '🌌' },
    cyberpunk: { label: 'Cyberpunk', icon: '⚡' },
    kyoto: { label: 'Kyoto Zen', icon: '🍵' },
    solar: { label: 'Solar Amber', icon: '🌅' },
    sakura: { label: 'Sakura Night', icon: '🌸' },
  };

  const handleShareClick = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.15 }
    });
    if (onOpenShareModal) onOpenShareModal();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };

  const handleMusicToggle = (e) => {
    e.stopPropagation();
    soundEngine.playClick();
    musicEngine.togglePlay();
  };

  const currentMode = flightModeLabels[flightMode] || flightModeLabels.aurora;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px clamp(10px, 2vw, 18px)',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'transparent',
      zIndex: 5,
      gap: '8px'
    }}>
      {/* Left: Hamburger (mobile only) + Flight Mode + Music Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="hide-desktop"
          style={{
            padding: '7px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        {/* Mobile Brand Logo Icon */}
        <div className="hide-desktop" style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(45, 212, 191, 0.3)',
          border: '1px solid rgba(45, 212, 191, 0.25)',
          background: '#092016',
          flexShrink: 0
        }}>
          <img src="/app-icon-squircle.png" alt="Studyo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Flight Mode quick button */}
        <button
          onClick={onOpenFlightModes}
          className="glass-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-glow)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>{currentMode.icon}</span>
          <span className="hide-small">{currentMode.label}</span>
          <span style={{ fontSize: '9px', color: 'var(--text-subtle)', marginLeft: '2px' }}>▼</span>
        </button>

        {/* Spotlight Command Palette Trigger */}
        <button
          onClick={onOpenCommandMenu}
          className="glass-pill hide-small"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.25)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-focus)';
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          title="Open Command Menu (⌘K or Ctrl+K)"
        >
          <Search size={13} color="var(--accent-glow)" />
          <span className="hide-medium" style={{ fontSize: '11.5px', fontWeight: 500 }}>Commands</span>
          <kbd style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--text-subtle)',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '1px 5px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)'
          }}>
            ⌘K
          </kbd>
        </button>

        {/* Live Music Player Pill */}
        <div
          onClick={onOpenSoundMixer}
          className="glass-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 11px',
            border: musicState.isPlaying ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: musicState.isPlaying ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-glass)',
            flexShrink: 0,
            userSelect: 'none'
          }}
          title="Click to open Music & Ambience Hub"
        >
          <span style={{ fontSize: '13px', flexShrink: 0 }}>{musicState.currentStation.icon}</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              fontSize: '11.5px', 
              fontWeight: 600, 
              color: 'var(--text-main)', 
              maxWidth: '120px', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {musicState.currentStation.name}
            </span>

            {/* Mini Equalizer Waves if playing */}
            {musicState.isPlaying && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '10px' }} className="hide-small">
                <span style={{ width: '2px', height: '8px', background: 'var(--accent-glow)', borderRadius: '1px', animation: 'pulseWave 0.6s infinite ease-in-out' }} />
                <span style={{ width: '2px', height: '12px', background: 'var(--accent-glow)', borderRadius: '1px', animation: 'pulseWave 0.8s infinite ease-in-out 0.2s' }} />
                <span style={{ width: '2px', height: '6px', background: 'var(--accent-glow)', borderRadius: '1px', animation: 'pulseWave 0.5s infinite ease-in-out 0.4s' }} />
              </div>
            )}
          </div>

          {/* Quick Play/Pause Mini Button */}
          <button
            onClick={handleMusicToggle}
            title={musicState.isPlaying ? "Pause Stream" : "Play Stream"}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'var(--accent-ivory)',
              color: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '2px',
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {musicState.isPlaying ? (
              <Pause size={10} fill="#121212" />
            ) : (
              <Play size={10} fill="#121212" style={{ marginLeft: '1px' }} />
            )}
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* PWA Install Button (if installable) */}
        {deferredPrompt && (
          <button
            onClick={onInstallPwa}
            title="Install Studyo as Native App"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 9px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              fontSize: '11.5px',
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            <Download size={13} />
            <span className="hide-medium">Install</span>
          </button>
        )}

        {/* Ambience Mute / Audio button */}
        <button
          onClick={onToggleMute}
          title={isAudioMuted ? "Unmute Ambient Mixer" : "Mute Ambience"}
          style={{
            padding: '7px',
            borderRadius: 'var(--radius-md)',
            background: isAudioMuted ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
            color: isAudioMuted ? '#ef4444' : 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = isAudioMuted ? '#ef4444' : 'var(--text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = isAudioMuted ? '#ef4444' : 'var(--text-muted)'}
        >
          {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          title="Share Study Progress"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11.5px',
            fontWeight: 600,
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.borderColor = 'var(--border-focus)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <Share2 size={14} />
          <span className="hide-tablet">Share</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen Focus"
          className="hide-small"
          style={{
            padding: '7px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Maximize size={15} />
        </button>

        {/* User Account / Cloud Sync Pill */}
        {user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px 4px 6px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(45, 212, 191, 0.08)',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            boxShadow: '0 0 12px rgba(45, 212, 191, 0.1)',
            flexShrink: 0
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488, #2dd4bf)',
              color: '#042f2e',
              fontWeight: 800,
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(45, 212, 191, 0.35)',
              flexShrink: 0
            }}>
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-main)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || user.email.split('@')[0]}
              </span>
              <span style={{ fontSize: '9px', color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Cloud size={9} />
                Cloud Synced
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Sign out of account"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '4px',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            title="Sign in or Create Free Account (Cloud Sync)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(45, 212, 191, 0.1)',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              color: '#2dd4bf',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45, 212, 191, 0.2)';
              e.currentTarget.style.borderColor = '#2dd4bf';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(45, 212, 191, 0.25)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(45, 212, 191, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.35)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <User size={13} />
            <span>Sign In</span>
          </button>
        )}

        {/* Tour / Guide Button */}
        <button
          onClick={onOpenOnboarding}
          title="How Studyo Works"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))',
            color: 'var(--accent-glow)',
            border: '1px solid var(--border-glow)',
            fontSize: '11.5px',
            fontWeight: 700,
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px var(--border-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <HelpCircle size={14} />
          <span className="hide-tablet">Tour</span>
        </button>
      </div>
    </header>
  );
}
