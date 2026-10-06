import React from 'react';
import { Shield, Flame, Award, Sparkles, X, CheckCircle2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';

export default function BadgesAndStreakModal({ isOpen, onClose, stats, onSelectTheme }) {
  if (!isOpen) return null;

  const streak = stats?.streak || 7;
  const freezeShields = Math.max(1, Math.floor(streak / 5)); // Earn 1 freeze shield for every 5 days studied!

  const badges = [
    {
      id: 'voyager',
      name: '7-Day Voyager',
      desc: 'Maintained a 7-day daily study streak without breaking consistency.',
      icon: '🔥',
      unlocked: streak >= 7,
      reward: '+1 Streak Freeze Shield'
    },
    {
      id: 'titan',
      name: 'Deep Flow Titan',
      desc: 'Completed an unbroken deep work session longer than 45 minutes.',
      icon: '⚡',
      unlocked: true,
      reward: 'Flow Master Title'
    },
    {
      id: 'owl',
      name: 'Night Owl Explorer',
      desc: 'Completed a late-night focus session during peaceful quiet hours.',
      icon: '🦉',
      unlocked: true,
      reward: 'Midnight Star'
    },
    {
      id: 'memory',
      name: 'Memory Architect',
      desc: 'Reviewed 25+ Active Recall cards with Spaced Repetition.',
      icon: '🧠',
      unlocked: true,
      reward: 'Synapse Shield'
    },
    {
      id: 'blurt',
      name: 'Blurt Master',
      desc: 'Successfully finished 3 active blurting memory retrieval sessions.',
      icon: '📝',
      unlocked: true,
      reward: 'Active Retrieval Crest'
    },
    {
      id: 'sakura',
      name: 'Sakura Enlightenment',
      desc: 'Achieved mastery and unlocked the secret Japanese Cherry Blossom world!',
      icon: '🌸',
      unlocked: true,
      reward: 'Unlocked: Sakura Night Flight World',
      isSecretTheme: true,
    }
  ];

  const handleEquipSakura = () => {
    soundEngine.playChime();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    if (onSelectTheme) onSelectTheme('sakura');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel modal-enter" style={{
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(18px, 3.5vw, 30px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Flame size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                Consistency & Milestones
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                100% Free Forever • Unlocked by Your Dedication
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Streak & Freeze Shield Status Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '30px' }}>🔥</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                {streak} Days
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Streak</div>
            </div>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '30px' }}>🛡️</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#22d3ee' }}>
                {freezeShields} Shields
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Streak Protected</div>
            </div>
          </div>
        </div>

        {/* Free Forever Philosophy Callout */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          fontSize: '12.5px',
          color: '#4ade80',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={18} />
          <span><strong>Motto:</strong> Free for everyone, forever. No paywalls, no subscriptions.</span>
        </div>

        {/* Milestone Badges List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Earned Consistency Badges ({badges.length})
          </div>

          {badges.map(b => (
            <div
              key={b.id}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: b.unlocked ? 'var(--bg-surface)' : 'rgba(255, 255, 255, 0.02)',
                border: b.unlocked ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>{b.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {b.name}
                    </span>
                    {b.unlocked ? (
                      <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700 }}>UNLOCKED</span>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '2px' }}><Lock size={10} /> LOCKED</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {b.desc}
                  </div>
                </div>
              </div>

              {b.isSecretTheme && b.unlocked ? (
                <button
                  onClick={handleEquipSakura}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: '#ec4899',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 10px rgba(236, 72, 153, 0.3)'
                  }}
                >
                  Equip Sakura Theme
                </button>
              ) : (
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-glow)',
                  whiteSpace: 'nowrap'
                }}>
                  {b.reward}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
