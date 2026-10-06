import React, { useEffect } from 'react';
import { Keyboard, X, Sparkles, Command } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playPop();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutSections = [
    {
      title: 'Global & Power Controls',
      items: [
        { key: '⌘K / Ctrl+K', desc: 'Open Raycast Spotlight Command Menu' },
        { key: 'Space', desc: 'Start / Pause Focus Timer (when not in text input)' },
        { key: 'D', desc: 'Toggle Aesthetic Desk Setup Tok Clock' },
        { key: 'M', desc: 'Mute / Unmute Ambient Audio Synthesizer' },
        { key: 'F', desc: 'Toggle Edge-to-Edge Fullscreen Focus' },
        { key: '?', desc: 'Show this Keyboard Shortcuts Cheatsheet' },
        { key: 'Esc', desc: 'Close any active modal or menu' },
      ]
    },
    {
      title: 'Studio Quick Jump',
      items: [
        { key: '1', desc: 'Focus Space (Heatmap & Daily Quest)' },
        { key: '2', desc: 'Timeblock Planner (Timeline schedule)' },
        { key: '3', desc: 'Blurting Studio (Active memory dumping)' },
        { key: '4', desc: 'Feynman Studio (5-Year-Old Explanation)' },
        { key: '5', desc: 'Active Recall (Flashcard Spaced Repetition)' },
        { key: '6', desc: 'Deep Analytics & Consistency' },
        { key: '7', desc: 'Study Logbook & History' },
      ]
    }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 210,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
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
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid var(--border-focus)',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 25px var(--border-glow)',
          animation: 'modalFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Keyboard size={17} />
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em'
              }}>
                Keyboard Shortcuts
              </h3>
              <p style={{
                fontSize: '11.5px',
                color: 'var(--text-subtle)'
              }}>
                Blazing fast keyboard power controls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--text-subtle)',
              display: 'flex'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content list */}
        <div style={{
          padding: '18px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {shortcutSections.map((sec, sIdx) => (
            <div key={sIdx}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--accent-glow)',
                marginBottom: '10px'
              }}>
                {sec.title}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {sec.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span style={{
                      fontSize: '13px',
                      color: 'var(--text-main)',
                      fontWeight: 500
                    }}>
                      {item.desc}
                    </span>

                    <kbd style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'var(--bg-surface-elevated)',
                      color: 'var(--accent-glow)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.35)',
                      flexShrink: 0
                    }}>
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: 'var(--text-subtle)'
        }}>
          <span>Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>Esc</kbd> anytime to dismiss</span>
          <span style={{ color: 'var(--text-muted)' }}>100% Free Forever</span>
        </div>
      </div>
    </div>
  );
}
