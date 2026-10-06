import React from 'react';
import { Compass, Sparkles, Check, X } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function FlightModesModal({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onSelectTheme,
  cinemagraphMode,
  onSelectCinemagraph 
}) {
  if (!isOpen) return null;

  const themes = [
    {
      id: 'aurora',
      name: 'Aurora Slate',
      tagline: 'Default Celestial Sanctuary',
      desc: 'Deep cosmic midnight slate with northern lights starlight glow & frosted glass.',
      palette: ['#0a0c10', '#181d27', '#8b5cf6', '#06b6d4'],
      icon: '🌌'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Amethyst',
      tagline: 'High-Contrast Neon Focus',
      desc: 'Pure pitch black with electric magenta, amethysts, and luminous edge highlights.',
      palette: ['#050508', '#141420', '#d946ef', '#06b6d4'],
      icon: '⚡'
    },
    {
      id: 'kyoto',
      name: 'Kyoto Zen',
      tagline: 'Tranquil Bamboo Moss',
      desc: 'Deep dark moss charcoal with soothing organic tea green accents.',
      palette: ['#0d120f', '#1b2620', '#22c55e', '#14b8a6'],
      icon: '🍵'
    },
    {
      id: 'solar',
      name: 'Solar Amber',
      tagline: 'Warm Retro Terminal',
      desc: 'Rich dark espresso tones with glowing warm amber and sunset accents.',
      palette: ['#120e0a', '#261d15', '#f59e0b', '#f97316'],
      icon: '🌅'
    },
    {
      id: 'sakura',
      name: 'Sakura Night',
      tagline: 'Midnight Blossom Special',
      desc: 'Deep purple velvet with luminous cherry blossom pink and rose starlight.',
      palette: ['#0f0b12', '#221828', '#ec4899', '#c084fc'],
      icon: '🌸'
    },
  ];

  const handleSelect = (id) => {
    soundEngine.playClick();
    onSelectTheme(id);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel modal-enter" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(18px, 3.5vw, 28px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-glow)'
            }}>
              <Compass size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                Flight Worlds
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Shift your sensory environment and focus state
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Theme cards list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {themes.map(t => {
            const isSelected = (currentTheme || 'aurora') === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelect(t.id)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1.5px solid var(--accent-glow)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected ? '0 4px 20px var(--border-glow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontSize: '24px' }}>{t.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {t.name}
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                        {t.tagline}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '3px' }}>
                      {t.desc}
                    </div>
                  </div>
                </div>

                {/* Color swatches preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t.palette.map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: color,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                  ))}
                  {isSelected && (
                    <Check size={16} color="var(--accent-glow)" style={{ marginLeft: '6px' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cinemagraph Atmosphere Backdrops (LifeAt style) */}
        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Cinemagraph Backdrop (Atmosphere)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { id: 'none', label: 'Clean', icon: '⬛' },
              { id: 'rain', label: 'Rain Drops', icon: '🌧️' },
              { id: 'stars', label: 'Starlight', icon: '🌌' },
              { id: 'embers', label: 'Fire Embers', icon: '☕' },
            ].map(item => {
              const isSelected = (cinemagraphMode || 'none') === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playClick();
                    if (onSelectCinemagraph) onSelectCinemagraph(item.id);
                  }}
                  style={{
                    padding: '10px 6px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255,255,255,0.02)',
                    border: isSelected ? '1.5px solid var(--accent-glow)' : '1px solid var(--border-subtle)',
                    color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
