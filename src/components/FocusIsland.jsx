import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Tv, 
  MoreHorizontal, 
  Clock, 
  Zap,
  CheckCircle2,
  Music2,
  Monitor,
  Shield
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { musicEngine } from '../services/musicEngine';
import confetti from 'canvas-confetti';

export default function FocusIsland({ 
  selectedSubject, 
  onSessionComplete,
  onOpenDeskMode,
  onOpenDopamineModal
}) {
  // Modes: 'flowmodoro' (count-up) or 'pomodoro' (count-down)
  const [timerMode, setTimerMode] = useState('flowmodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0); // For flowmodoro: counts up. For pomodoro: remaining.
  const [pomodoroTarget, setPomodoroTarget] = useState(25 * 60); // 25 min default
  const [isZenMode, setIsZenMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => musicEngine.isPlaying);

  useEffect(() => {
    return musicEngine.subscribe((state) => {
      setIsMusicPlaying(state.isPlaying);
    });
  }, []);

  const timerRef = useRef(null);
  const pipVideoRef = useRef(null);

  // Initialize pomodoro starting seconds
  useEffect(() => {
    if (timerMode === 'pomodoro' && !isRunning) {
      setSeconds(pomodoroTarget);
    } else if (timerMode === 'flowmodoro' && !isRunning) {
      setSeconds(0);
    }
  }, [timerMode, pomodoroTarget]);

  // Main Timer interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (timerMode === 'pomodoro') {
            if (prev <= 1) {
              // Pomodoro complete!
              handleSessionFinished(pomodoroTarget);
              return 0;
            }
            return prev - 1;
          } else {
            // Flowmodoro counts up
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, pomodoroTarget]);

  // Spacebar global shortcut to toggle timer play/pause (when not typing in an input/textarea)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, timerMode, seconds]);

  // Complete session handler
  const handleSessionFinished = (durationSeconds) => {
    setIsRunning(false);
    soundEngine.playChime();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.8 }
    });

    if (onSessionComplete && durationSeconds > 10) {
      onSessionComplete({
        subject: selectedSubject || 'General Focus',
        durationSeconds,
        mode: timerMode,
        completed: true,
      });
    }

    if (timerMode === 'pomodoro') {
      setSeconds(pomodoroTarget);
    } else {
      setSeconds(0);
    }
  };

  const handleTogglePlay = () => {
    soundEngine.playClick();
    if (isRunning && timerMode === 'flowmodoro' && seconds > 10) {
      // User paused/ended flowmodoro session
      setIsRunning(false);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleFinishEarly = () => {
    soundEngine.playClick();
    const duration = timerMode === 'flowmodoro' ? seconds : (pomodoroTarget - seconds);
    if (duration > 5) {
      handleSessionFinished(duration);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setIsRunning(false);
    setSeconds(timerMode === 'pomodoro' ? pomodoroTarget : 0);
  };

  // Format time display MM:SS or HH:MM:SS
  const formatTime = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (num) => String(num).padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Picture-in-Picture implementation using Canvas Video Stream
  const handlePictureInPicture = async () => {
    soundEngine.playClick();
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      // Create an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');

      const drawPip = () => {
        ctx.fillStyle = '#0f131a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subject text
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(selectedSubject || 'Studyo Focus', 200, 50);

        // Timer
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 58px "JetBrains Mono", monospace';
        ctx.fillText(formatTime(seconds), 200, 120);

        // Status
        ctx.fillStyle = isRunning ? '#10b981' : '#f59e0b';
        ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(isRunning ? '● Focused' : '⏸ Paused', 200, 160);
      };

      drawPip();
      const stream = canvas.captureStream(10);
      
      let video = pipVideoRef.current;
      if (!video) {
        video = document.createElement('video');
        video.muted = true;
        pipVideoRef.current = video;
      }
      video.srcObject = stream;
      await video.play();
      await video.requestPictureInPicture();

      const pipInterval = setInterval(drawPip, 500);
      video.addEventListener('leavepictureinpicture', () => {
        clearInterval(pipInterval);
      }, { once: true });
    } catch (err) {
      console.warn('PiP error', err);
    }
  };

  // Waveform bars count
  const bars = [14, 26, 18, 38, 22, 45, 32, 20, 42, 16, 28, 12];

  return (
    <>
      {/* Fullscreen Zen Overlay if active */}
      {isZenMode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-primary)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          animation: 'modalFadeIn 0.3s ease'
        }}>
          <button
            onClick={() => setIsZenMode(false)}
            style={{
              position: 'absolute',
              top: '28px',
              right: '28px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Minimize2 size={16} />
            <span>Exit Zen Mode (Esc)</span>
          </button>

          <div style={{
            fontSize: '16px',
            color: 'var(--accent-glow)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            {selectedSubject || 'Deep Focus'}
          </div>

          <div style={{
            fontSize: '120px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-main)',
            letterSpacing: '-0.03em',
            textShadow: '0 0 60px var(--border-glow)'
          }}>
            {formatTime(seconds)}
          </div>

          {/* Action buttons in Zen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <button
              onClick={handleTogglePlay}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-ivory)',
                color: '#121212',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(255,255,255,0.2)'
              }}
            >
              {isRunning ? <Pause size={24} fill="#121212" /> : <Play size={24} fill="#121212" style={{ marginLeft: '3px' }} />}
            </button>
            {seconds > 10 && (
              <button
                onClick={handleFinishEarly}
                style={{
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-focus)',
                  color: 'var(--text-main)',
                  fontWeight: 600
                }}
              >
                Save & End Session
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Island Focus Bar at Bottom Center */}
      <div className="focus-island-container">
        {/* Mode Switcher pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: 'var(--radius-full)',
          padding: '2px',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          <button
            onClick={() => {
              if (!isRunning) setTimerMode('flowmodoro');
            }}
            title="Flowmodoro (Count Up)"
            style={{
              padding: '4px clamp(6px, 1.5vw, 10px)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              color: timerMode === 'flowmodoro' ? 'var(--text-main)' : 'var(--text-subtle)',
              background: timerMode === 'flowmodoro' ? 'rgba(255,255,255,0.09)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Zap size={11} />
            <span>Flow</span>
          </button>

          <button
            onClick={() => {
              if (!isRunning) setTimerMode('pomodoro');
            }}
            title="Pomodoro (25 Min Countdown)"
            style={{
              padding: '4px clamp(6px, 1.5vw, 10px)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 700,
              color: timerMode === 'pomodoro' ? 'var(--text-main)' : 'var(--text-subtle)',
              background: timerMode === 'pomodoro' ? 'rgba(255,255,255,0.09)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Clock size={11} />
            <span>Pomo</span>
          </button>
        </div>

        {/* Reactive Audio Waveform Bars (Hidden on smaller screens to preserve space) */}
        <div className="hide-small" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          height: '24px',
          padding: '0 4px',
          flexShrink: 0
        }}>
          {bars.map((h, idx) => (
            <div
              key={idx}
              style={{
                width: '3px',
                height: isRunning ? `${h}px` : '4px',
                borderRadius: '2px',
                background: isRunning ? 'var(--accent-glow)' : 'rgba(255,255,255,0.1)',
                animation: isRunning ? `pulseWave 0.8s ease-in-out infinite ${idx * 0.08}s` : 'none',
                transition: 'height 0.25s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Big Monospace Timer Display */}
        <div style={{
          fontSize: 'clamp(20px, 4.5vw, 28px)',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-main)',
          letterSpacing: '-0.02em',
          minWidth: 'clamp(66px, 14vw, 90px)',
          textAlign: 'center',
          userSelect: 'none',
          flexShrink: 0
        }}>
          {formatTime(seconds)}
        </div>

        {/* Tactile Ivory Play / Pause Button with Concentric Circular Progress Ring */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {/* Animated SVG Progress Ring */}
          <svg
            width="54"
            height="54"
            style={{
              position: 'absolute',
              transform: 'rotate(-90deg)',
              pointerEvents: 'none'
            }}
          >
            <circle
              cx="27"
              cy="27"
              r="23"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2.5"
            />
            <circle
              cx="27"
              cy="27"
              r="23"
              fill="transparent"
              stroke={timerMode === 'pomodoro' ? 'var(--accent-primary)' : 'var(--accent-secondary)'}
              strokeWidth="2.5"
              strokeDasharray={2 * Math.PI * 23}
              strokeDashoffset={
                timerMode === 'pomodoro'
                  ? (2 * Math.PI * 23) * (1 - Math.max(0, Math.min(1, (pomodoroTarget - seconds) / pomodoroTarget)))
                  : isRunning ? 0 : 2 * Math.PI * 23
              }
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.6s ease',
                filter: isRunning ? 'drop-shadow(0 0 6px var(--border-glow))' : 'none'
              }}
            />
          </svg>

          <button
            onClick={handleTogglePlay}
            title={isRunning ? "Pause Focus Timer (Space)" : "Start Focus Timer (Space)"}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--accent-ivory)',
              color: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isRunning ? '0 0 20px rgba(245, 239, 230, 0.4)' : '0 4px 16px rgba(245, 239, 230, 0.25)',
              transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, box-shadow 0.3s ease',
              flexShrink: 0,
              zIndex: 1
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-ivory-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-ivory)'}
          >
            {isRunning ? (
              <Pause size={17} fill="#121212" strokeWidth={1} />
            ) : (
              <Play size={17} fill="#121212" strokeWidth={1} style={{ marginLeft: '2px' }} />
            )}
          </button>
        </div>

        {/* Finish / Save Button (appears when session has time) */}
        {seconds > 10 && (
          <button
            onClick={handleFinishEarly}
            title="Log Session to Heatmap"
            style={{
              padding: '6px clamp(8px, 2vw, 12px)',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={13} />
            <span>Save</span>
          </button>
        )}

        {/* Auxiliary Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
          {/* Reset */}
          <button
            onClick={handleReset}
            title="Reset Timer"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subtle)'}
          >
            <RotateCcw size={15} />
          </button>

          {/* Resist Urge Button (Urge Surfing) */}
          {onOpenDopamineModal && (
            <button
              onClick={onOpenDopamineModal}
              title="Resist Urge (Dopamine Reset)"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-full)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#f87171'}
            >
              <Shield size={15} />
            </button>
          )}

          {/* Quick Music Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              musicEngine.togglePlay();
            }}
            title={isMusicPlaying ? "Pause Focus Music" : "Play Focus Music"}
            className="hide-small"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              color: isMusicPlaying ? 'var(--accent-glow)' : 'var(--text-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: isMusicPlaying ? 'gentleFloat 2s infinite ease-in-out' : 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = isMusicPlaying ? 'var(--accent-glow)' : 'var(--text-subtle)'}
          >
            <Music2 size={15} />
          </button>

          {/* Picture in Picture */}
          <button
            onClick={handlePictureInPicture}
            title="Floating Picture-in-Picture Mini Widget"
            className="hide-small"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subtle)'}
          >
            <Tv size={15} />
          </button>

          {/* Desk Mode Button */}
          {onOpenDeskMode && (
            <button
              onClick={onOpenDeskMode}
              title="Aesthetic Desk Mode Clock (D)"
              className="hide-mobile"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subtle)'}
            >
              <Monitor size={15} />
            </button>
          )}

          {/* Fullscreen Zen Mode */}
          <button
            onClick={() => setIsZenMode(true)}
            title="Fullscreen Zen Mode"
            className="hide-small"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-subtle)'}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
