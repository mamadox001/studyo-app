import React from 'react';
import { Share2, Sparkles, X, Check, Copy, Flame, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShareModal({ isOpen, onClose, sessions, stats }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const totalMinutes = sessions.reduce((acc, s) => acc + Math.round((s.durationSeconds || 0) / 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const handleCopy = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel modal-enter" style={{
        width: '100%',
        maxWidth: '460px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(18px, 3.5vw, 28px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-glow)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
              Share Proof of Work
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* The Aesthetic Share Card Preview */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(145deg, #12151d, #1a202c)',
          border: '1.5px solid var(--border-subtle)',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background glow circle */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'var(--border-glow)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          {/* Top Brand */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/app-icon-squircle.png" alt="Studyo" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#2dd4bf' }}>st</span><span>udyo</span>
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
                100% FREE FOREVER
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Middle Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '8px 0' }}>
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Clock size={13} />
                <span>Total Focus</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--text-main)' }}>
                {totalHours}h
              </div>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Flame size={13} color="#f59e0b" />
                <span>Daily Streak</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--text-main)' }}>
                {stats?.streak || 7} Days
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '12px'
          }}>
            "Discipline is choosing between what you want now and what you want most."
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopy}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-ivory)',
            color: '#121212',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(245, 239, 230, 0.2)'
          }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Copied Card to Clipboard!' : 'Copy Share Card'}</span>
        </button>
      </div>
    </div>
  );
}
