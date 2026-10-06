import React from 'react';
import { 
  Flame, 
  Brain, 
  RotateCcw, 
  BarChart3, 
  Headphones, 
  BookOpen, 
  Compass, 
  Users, 
  Sparkles, 
  Monitor, 
  Layout, 
  Award, 
  Lightbulb, 
  Calendar, 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Search,
  Keyboard,
  User,
  LogOut,
  Cloud
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  onCloseMobile, 
  onOpenFlightModes, 
  onOpenSoundMixer, 
  onOpenDeskMode, 
  onOpenNotionModal, 
  onOpenBadgesModal, 
  onOpenDopamineModal, 
  onOpenCommandMenu,
  onOpenShortcutsModal,
  stats,
  user,
  onOpenAuthModal,
  onLogout
}) {
  const primaryNav = [
    { id: 'focus', label: 'Focus Space', icon: Flame, badge: null },
    { id: 'planner', label: 'Time Planner', icon: Calendar, badge: 'YPT' },
    { id: 'blurting', label: 'Blurting Studio', icon: Brain, badge: null },
    { id: 'feynman', label: 'Feynman Studio', icon: Lightbulb, badge: 'NEW' },
    { id: 'recall', label: 'Active Recall', icon: RotateCcw, badge: null },
  ];

  const metricsNav = [
    { id: 'stats', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'log', label: 'Study Log', icon: BookOpen, badge: null },
  ];

  const handleTabClick = (tabId) => {
    soundEngine.playClick();
    setActiveTab(tabId);
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleToggleCollapse = () => {
    soundEngine.playClick();
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-sidebar-overlay hide-desktop" 
          onClick={onCloseMobile} 
        />
      )}

      <aside 
        className={isMobileOpen ? 'mobile-sidebar-drawer' : 'hide-mobile'}
        style={{
          width: isMobileOpen ? '280px' : sidebarWidth,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isCollapsed && !isMobileOpen ? '18px 8px' : '18px 12px',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 100,
          position: 'relative',
          overflowX: 'hidden',
          flexShrink: 0
        }}
      >
        {/* Header: Logo, Branding & Collapse Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'space-between',
          padding: '0 4px 14px 4px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '12px',
          flexShrink: 0
        }}>
          <div 
            onClick={() => handleTabClick('focus')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              cursor: 'pointer' 
            }}
            title="Studyo — Deep Work Sanctuary"
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(45, 212, 191, 0.35)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
              background: '#092016',
              flexShrink: 0
            }}>
              <img 
                src="/app-icon-squircle.png" 
                alt="Studyo Icon" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div>
                <h1 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span><span style={{ color: '#2dd4bf' }}>st</span><span style={{ color: 'var(--text-main)' }}>udyo</span></span>
                  <span style={{
                    fontSize: '9px',
                    padding: '2px 5px',
                    borderRadius: '5px',
                    background: 'rgba(45, 212, 191, 0.15)',
                    color: '#2dd4bf',
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}>FREE</span>
                </h1>
                <p style={{ 
                  fontSize: '8.5px', 
                  fontWeight: 700, 
                  letterSpacing: '0.12em', 
                  color: 'var(--text-subtle)', 
                  textTransform: 'uppercase', 
                  marginTop: '2px' 
                }}>
                  Deep Work Sanctuary
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button OR Mobile Close Button */}
          {isMobileOpen ? (
            <button 
              onClick={onCloseMobile} 
              style={{ padding: '6px', color: 'var(--text-muted)' }}
              className="hide-desktop"
              title="Close Menu"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={handleToggleCollapse}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="hide-mobile"
              style={{
                padding: '6px',
                borderRadius: '6px',
                color: 'var(--text-subtle)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: isCollapsed ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-subtle)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Uncollapse button when in collapsed icon rail mode */}
        {isCollapsed && !isMobileOpen && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', flexShrink: 0 }}>
            <button
              onClick={handleToggleCollapse}
              title="Expand Sidebar"
              style={{
                padding: '7px',
                borderRadius: '8px',
                color: 'var(--text-subtle)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-subtle)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Scrollable Navigation Body (Adapts smoothly to any viewport height) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '2px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Group 1: Study Suite */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--text-subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 8px',
                marginBottom: '5px'
              }}>
                Study Suite
              </div>
            )}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                    className="sidebar-nav-button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'space-between',
                      padding: isCollapsed && !isMobileOpen ? '10px 0' : '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0.03) 100%)' : 'transparent',
                      color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                      border: isActive ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '13px',
                      textAlign: 'left',
                      position: 'relative',
                      boxShadow: isActive ? '0 2px 10px rgba(139, 92, 246, 0.12)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.color = 'var(--text-main)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }
                    }}
                  >
                    {/* Glowing active edge indicator */}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        top: '6px',
                        bottom: '6px',
                        width: '3px',
                        borderRadius: '0 2px 2px 0',
                        background: 'var(--accent-glow)',
                        boxShadow: '0 0 10px var(--accent-glow)'
                      }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                      <Icon size={17} color={isActive ? 'var(--accent-glow)' : 'currentColor'} />
                      {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                    </div>

                    {(!isCollapsed || isMobileOpen) && item.badge && (
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: item.badge === 'YPT' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                        color: item.badge === 'YPT' ? '#22d3ee' : '#4ade80',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Group 2: Tracking & Metrics */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--text-subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 8px',
                marginBottom: '5px'
              }}>
                Tracking
              </div>
            )}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {metricsNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                    className="sidebar-nav-button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                      padding: isCollapsed && !isMobileOpen ? '10px 0' : '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0.03) 100%)' : 'transparent',
                      color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                      border: isActive ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '13px',
                      textAlign: 'left',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.color = 'var(--text-main)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }
                    }}
                  >
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        top: '6px',
                        bottom: '6px',
                        width: '3px',
                        borderRadius: '0 2px 2px 0',
                        background: 'var(--accent-glow)',
                        boxShadow: '0 0 10px var(--accent-glow)'
                      }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                      <Icon size={17} color={isActive ? 'var(--accent-glow)' : 'currentColor'} />
                      {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Group 3: Atmosphere & Quick Utilities */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {(!isCollapsed || isMobileOpen) && (
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--text-subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 8px',
                marginBottom: '4px'
              }}>
                Atmosphere & Tools
              </div>
            )}

            {/* Command Menu (⌘K) */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                if (onOpenCommandMenu) onOpenCommandMenu();
              }}
              title="Command Palette (⌘K or Ctrl+K)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'space-between',
                gap: '11px',
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-glow)',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                fontSize: '12.5px',
                fontWeight: 600,
                width: '100%',
                marginBottom: '4px',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.16)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <Search size={16} />
                {(!isCollapsed || isMobileOpen) && <span>Commands</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <span style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-subtle)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}>
                  ⌘K
                </span>
              )}
            </button>

            {/* Resist Urge Dopamine Reset */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                onOpenDopamineModal();
              }}
              title="Resist Social Media Urge (Box Breathing)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                gap: '11px',
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-md)',
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.22)',
                fontSize: '12.5px',
                fontWeight: 600,
                width: '100%',
                marginBottom: '3px',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Shield size={16} color="#f87171" />
              {(!isCollapsed || isMobileOpen) && <span>Resist Urge</span>}
            </button>

            {/* Music & Lo-Fi Hub */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                onOpenSoundMixer();
              }}
              title="Music & Ambience Mixer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                gap: '11px',
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                fontWeight: 500,
                width: '100%',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Headphones size={16} />
              {(!isCollapsed || isMobileOpen) && <span>Focus Music</span>}
            </button>

            {/* Flight Worlds */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                onOpenFlightModes();
              }}
              title="Flight Worlds & Themes"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                gap: '11px',
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                fontWeight: 500,
                width: '100%',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Compass size={16} />
              {(!isCollapsed || isMobileOpen) && <span>Flight Worlds</span>}
            </button>

            {/* Desk Mode */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                onOpenDeskMode();
              }}
              title="Desk Setup Clock (D)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                gap: '11px',
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                fontWeight: 500,
                width: '100%',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Monitor size={16} />
              {(!isCollapsed || isMobileOpen) && <span>Desk Mode (D)</span>}
            </button>

            {/* Notion Widget */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                onOpenNotionModal();
              }}
              title="Notion & Obsidian Widget"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                gap: '11px',
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                fontWeight: 500,
                width: '100%',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Layout size={16} />
              {(!isCollapsed || isMobileOpen) && <span>Notion Widget</span>}
            </button>

            {/* Keyboard Shortcuts (?) */}
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                if (onOpenShortcutsModal) onOpenShortcutsModal();
              }}
              title="Keyboard Shortcuts (?)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                gap: '11px',
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                fontWeight: 500,
                width: '100%',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Keyboard size={16} />
              {(!isCollapsed || isMobileOpen) && <span>Shortcuts (?)</span>}
            </button>
          </div>
        </div>

        {/* User Account / Cloud Sync Card */}
        <div style={{ marginTop: '10px', flexShrink: 0 }}>
          {user ? (
            <div
              style={{
                padding: isCollapsed && !isMobileOpen ? '8px 0' : '8px 10px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(45, 212, 191, 0.06)',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'space-between',
                width: '100%',
                transition: 'all 0.18s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
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
                  flexShrink: 0
                }}>
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user.displayName || user.email.split('@')[0]}
                    </div>
                    <div style={{ fontSize: '9px', color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Cloud size={9} />
                      Cloud Synced
                    </div>
                  </div>
                )}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onLogout();
                  }}
                  title="Sign out"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subtle)'}
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                soundEngine.playClick();
                if (isMobileOpen && onCloseMobile) onCloseMobile();
                onOpenAuthModal();
              }}
              title="Sign in for Free Cloud Sync"
              style={{
                padding: isCollapsed && !isMobileOpen ? '9px 0' : '8px 10px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(45, 212, 191, 0.08)',
                border: '1px solid rgba(45, 212, 191, 0.28)',
                color: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'flex-start',
                gap: '8px',
                width: '100%',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 700,
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(45, 212, 191, 0.16)';
                e.currentTarget.style.borderColor = '#2dd4bf';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(45, 212, 191, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.28)';
              }}
            >
              <User size={15} />
              {(!isCollapsed || isMobileOpen) && <span>Cloud Sync · Sign In</span>}
            </button>
          )}
        </div>

        {/* Bottom Consistency & Streak Card */}
        <button
          onClick={() => {
            soundEngine.playClick();
            if (isMobileOpen && onCloseMobile) onCloseMobile();
            onOpenBadgesModal();
          }}
          title="Consistency & Badges"
          style={{
            padding: isCollapsed && !isMobileOpen ? '10px 0' : '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed && !isMobileOpen ? 'center' : 'space-between',
            width: '100%',
            cursor: 'pointer',
            marginTop: '12px',
            flexShrink: 0,
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-focus)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Users size={16} color="var(--text-muted)" />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-3px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e'
              }} />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                  42 Live
                </div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-subtle)' }}>
                  100% Free Forever
                </div>
              </div>
            )}
          </div>

          {(!isCollapsed || isMobileOpen) && (
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#fbbf24',
              fontFamily: 'var(--font-mono)'
            }}>
              {stats?.streak || 7}d 🔥
            </div>
          )}
        </button>
      </aside>
    </>
  );
}
