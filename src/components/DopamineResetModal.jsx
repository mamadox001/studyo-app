import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, X, Check, Heart, Wind } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

export default function DopamineResetModal({ isOpen, onClose, onUrgeResisted }) {
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold1', 'exhale', 'hold2'
  const [timerSeconds, setTimerSeconds] = useState(60); // 60-second reset
  const [isActive, setIsActive] = useState(false);
  const [resistedCount, setResistedCount] = useState(() => {
    return parseInt(localStorage.getItem('studyo_urges_resisted') || '0', 10);
  });

  // Box Breathing cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setTimerSeconds(60);
      return;
    }

    setIsActive(true);
    let cycleTimer;
    let countdownTimer;

    const phases = ['inhale', 'hold1', 'exhale', 'hold2'];
    let currentIdx = 0;

    cycleTimer = setInterval(() => {
      currentIdx = (currentIdx + 1) % phases.length;
      setPhase(phases[currentIdx]);
    }, 4000);

    countdownTimer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          handleCompleteReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(cycleTimer);
      clearInterval(countdownTimer);
    };
  }, [isOpen]);

  const handleCompleteReset = () => {
    soundEngine.playChime();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    const newCount = resistedCount + 1;
    setResistedCount(newCount);
    localStorage.setItem('studyo_urges_resisted', newCount.toString());
    if (onUrgeResisted) onUrgeResisted(newCount);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  const phaseInstructions = {
    inhale: { title: 'Breathe In Slowly', subtitle: 'Fill your lungs with calm focus', scale: 1.35 },
    hold1: { title: 'Hold Breath', subtitle: 'Notice the sensation of stillness', scale: 1.35 },
    exhale: { title: 'Exhale Fully', subtitle: 'Release the craving and distraction', scale: 0.8 },
    hold2: { title: 'Rest in Silence', subtitle: 'Urge fading... neuro-resetting', scale: 0.8 },
  };

  const currentInstruction = phaseInstructions[phase];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '20px'
    }}>
      <div className="glass-panel modal-enter" style={{
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(20px, 4vw, 36px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <Shield size={13} />
            <span>Urge Surfing & Dopamine Reset</span>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>
            Resist the Urge to Distract
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', margin: '4px auto 0' }}>
            Neuroscience shows dopamine cravings peak within 60-90 seconds. Ride out this wave.
          </p>
        </div>

        {/* Breathing Circle Visualizer */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '12px 0'
        }}>
          {/* Outer glowing pulsing orb */}
          <div style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
            transform: `scale(${currentInstruction.scale})`,
            opacity: 0.6,
            transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1), opacity 4s ease',
            filter: 'blur(10px)'
          }} />

          {/* Inner solid breathing circle */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--bg-surface-elevated), var(--bg-surface))',
            border: '2px solid var(--border-focus)',
            transform: `scale(${currentInstruction.scale})`,
            transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px var(--border-glow)'
          }}>
            <Wind size={26} color="var(--accent-glow)" />
            <div style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginTop: '4px'
            }}>
              {timerSeconds}s
            </div>
          </div>
        </div>

        {/* Active Stage Title */}
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            {currentInstruction.title}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {currentInstruction.subtitle}
          </div>
        </div>

        {/* Counter of Urges Resisted */}
        <div style={{
          width: '100%',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Cravings Resisted Lifetime:</span>
          <strong style={{ color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
            🛡️ {resistedCount} Distractions Conquered
          </strong>
        </div>

        {/* Done early button */}
        <button
          onClick={handleCompleteReset}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-ivory)',
            color: '#121212',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Check size={16} />
          <span>I'm Ready to Focus Again</span>
        </button>
      </div>
    </div>
  );
}
