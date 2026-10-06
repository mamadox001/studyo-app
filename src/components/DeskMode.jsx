import React, { useState, useEffect } from 'react';
import { Minimize2, Music2, Sparkles, Flame, Play, Pause } from 'lucide-react';
import { musicEngine } from '../services/musicEngine';
import { soundEngine } from '../services/soundEngine';

export default function DeskMode({ isOpen, onClose, selectedSubject, stats }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [musicState, setMusicState] = useState(() => musicEngine.getState());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const unsubscribe = musicEngine.subscribe((state) => {
      setMusicState({ ...state });
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'd' || e.key === 'D') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(clockInterval);
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');

  const dateFormatted = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const handleToggleMusic = () => {
    soundEngine.playClick();
    musicEngine.togglePlay();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-primary)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 60px)',
      animation: 'modalFadeIn 0.4s ease',
      cursor: 'default',
      userSelect: 'none',
      overflowY: 'auto'
    }}>
      {/* Top Bar: Subject, Streak, and Exit Button */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <img src="/app-icon-squircle.png" alt="Studyo" style={{ width: '24px', height: '24px', borderRadius: '7px' }} />
          <span style={{
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ color: '#2dd4bf' }}>st</span><span>udyo</span>
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>•</span>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)'
          }}>
            {selectedSubject || 'Deep Focus'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#f59e0b',
            fontFamily: 'var(--font-mono)'
          }}>
            <Flame size={16} />
            <span>{stats?.streak || 7} Days Consistent</span>
          </div>

          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 600
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Minimize2 size={14} />
            <span>Exit Desk Mode (Esc / D)</span>
          </button>
        </div>
      </div>

      {/* Center: Monumental Glowing Desk Clock */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        margin: 'auto 0'
      }}>
        <div style={{
          fontSize: 'clamp(80px, 18vw, 170px)',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          lineHeight: 0.95,
          color: 'var(--text-main)',
          letterSpacing: '-0.04em',
          textShadow: '0 0 80px var(--border-glow), 0 0 30px var(--border-glow)',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
          <span>{hours}:{minutes}</span>
          <span style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: 'var(--accent-glow)',
            fontWeight: 600
          }}>
            :{seconds}
          </span>
        </div>

        <div style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.02em',
          marginTop: '8px'
        }}>
          {dateFormatted}
        </div>
      </div>

      {/* Bottom Bar: Ambient Lo-Fi Player Status & Visualizer */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: 'clamp(10px, 2.5vw, 16px) clamp(14px, 3vw, 24px)',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-glass-elevated)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {musicState.currentStation.icon}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
              {musicState.currentStation.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              {musicState.isPlaying ? 'Now Playing 24/7' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Central dancing waveform */}
        {musicState.isPlaying && (
          <div className="hide-small" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '20px' }}>
            {[16, 28, 12, 34, 20, 38, 22, 14, 30, 18].map((h, i) => (
              <span
                key={i}
                style={{
                  width: '3px',
                  height: `${h}px`,
                  background: 'var(--accent-glow)',
                  borderRadius: '2px',
                  animation: `pulseWave 0.7s infinite ease-in-out ${i * 0.07}s`
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleToggleMusic}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-ivory)',
            color: '#121212',
            fontSize: '12.5px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {musicState.isPlaying ? <Pause size={14} fill="#121212" /> : <Play size={14} fill="#121212" style={{ marginLeft: '2px' }} />}
          <span>{musicState.isPlaying ? 'Pause' : 'Play Music'}</span>
        </button>
      </div>
    </div>
  );
}
