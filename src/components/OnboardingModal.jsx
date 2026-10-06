import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Brain, Layers, Compass, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const totalSlides = 5;

  const handleNext = () => {
    soundEngine.playClick();
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 }
      });
      onClose();
    }
  };

  const handlePrev = () => {
    soundEngine.playClick();
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    soundEngine.playClick();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel modal-enter" style={{
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#12151d',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: 'clamp(20px, 4vw, 36px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 'min(560px, 85vh)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        position: 'relative'
      }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/app-icon-squircle.png" alt="Studyo" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
            <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#2dd4bf' }}>st</span><span>udyo</span>
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
              100% FREE FOREVER
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleSkip}
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Skip
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  color: currentSlide === 0 ? 'rgba(255,255,255,0.15)' : 'var(--text-muted)',
                  cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-muted)',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Slide 0: Manifesto */}
        {currentSlide === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0' }}>
            <div style={{ fontSize: '13px', color: 'var(--accent-glow)', fontWeight: 600 }}>
              Welcome to Studyo
            </div>
            <h2 style={{
              fontSize: '38px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)'
            }}>
              One place to study better.
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Studyo brings your <strong style={{ color: 'var(--text-main)' }}>focus</strong>, <strong style={{ color: 'var(--text-main)' }}>study tools</strong>, <strong style={{ color: 'var(--text-main)' }}>progress</strong> and <strong style={{ color: 'var(--text-main)' }}>flight worlds</strong> into one simple sanctuary.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {[
                { num: '01', title: 'Focus', desc: 'Tactile stopwatch & Flowmodoro' },
                { num: '02', title: 'Learn', desc: 'Active recall flashcards & Blurting' },
                { num: '03', title: 'Track', desc: '3D voxel contribution heatmap' },
                { num: '04', title: 'Immerse', desc: 'Ambient soundboard & Flight worlds' }
              ].map(item => (
                <div
                  key={item.num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>{item.num}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 1: Focus */}
        {currentSlide === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-glow)', fontWeight: 700, letterSpacing: '0.05em' }}>
              01 / FOCUS
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Start the timer.<br />Studyo does the rest.
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Begin studying and keep a clear record of every focused minute without friction.
            </p>

            {/* Mock Preview Card */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Focus session</div>
              <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                00:33
              </div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--accent-ivory)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Play size={16} fill="#121212" style={{ marginLeft: '2px' }} />
              </div>
            </div>
          </div>
        )}

        {/* Slide 2: Learn */}
        {currentSlide === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-glow)', fontWeight: 700, letterSpacing: '0.05em' }}>
              02 / STUDY TOOLS
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Use methods that<br />help you remember.
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Everything you need for active study, without switching between 5 different apps.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Active recall</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Test what you know</div>
              </div>
              <div style={{
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Blurting Studio</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Brain dump & gap review</div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3: Track */}
        {currentSlide === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-glow)', fontWeight: 700, letterSpacing: '0.05em' }}>
              03 / PROGRESS
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              See the work you<br />have done.
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Your sessions become a clear study history, 3D voxel heatmap and useful insights.
            </p>

            {/* Mock Heatmap */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-subtle)' }}>
                <span>Study heatmap</span>
                <span>Last 12 weeks</span>
              </div>
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                {[1, 2, 0, 3, 4, 1, 3, 2, 4, 1, 2, 4].map((v, i) => (
                  <div
                    key={i}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      background: v === 0 ? 'rgba(255,255,255,0.04)' : `rgba(139, 92, 246, ${v * 0.25})`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide 4: More / Flight Modes */}
        {currentSlide === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-glow)', fontWeight: 700, letterSpacing: '0.05em' }}>
              04 / IMMERSION
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Your whole study<br />system, together.
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Organise your work and make Studyo fit the way you study best.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: 'Projects', desc: 'organise subjects' },
                { title: 'Goals', desc: 'stay consistent' },
                { title: 'Soundboard Mixer', desc: 'find your flow' },
                { title: 'Flight Worlds', desc: 'change your study world' },
              ].map(item => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)' }}>{item.title}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>· {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          {/* Progress Indicator Segments */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '2px',
                  background: idx <= currentSlide ? 'var(--text-main)' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={handleNext}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-ivory)',
              color: '#121212',
              fontSize: '14.5px',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(245, 239, 230, 0.25)',
              textAlign: 'center'
            }}
          >
            {currentSlide === 0 ? 'See how it works' : currentSlide === totalSlides - 1 ? 'Enter Sanctuary' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
