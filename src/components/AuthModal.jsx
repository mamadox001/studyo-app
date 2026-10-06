import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Cloud, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      soundEngine.playPop();
      setTimeout(() => emailInputRef.current?.focus(), 80);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    soundEngine.playClick();

    try {
      if (mode === 'register') {
        const res = await authService.register(email, password, displayName);
        soundEngine.playSuccess();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.4 } });
        setSuccessMsg(res.cloudMode 
          ? 'Account created on Cloudflare D1! Cloud sync active.' 
          : 'Account created! Synced to local profile.'
        );
        setTimeout(() => onClose(), 1200);
      } else {
        const res = await authService.login(email, password);
        soundEngine.playSuccess();
        setSuccessMsg('Welcome back! Cloud sync connected.');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        zIndex: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.18s ease forwards'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--border-focus)',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 35px var(--border-glow)',
          animation: 'modalFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          background: 'var(--bg-glass-elevated)'
        }}
      >
        {/* Top Header with App Icon */}
        <div style={{
          padding: '24px 28px 16px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.25)'
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--text-subtle)',
              display: 'flex'
            }}
          >
            <X size={16} />
          </button>

          {/* Glowing Brand Icon */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(45, 212, 191, 0.4)',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            background: '#092016',
            marginBottom: '12px'
          }}>
            <img 
              src="/app-icon-squircle.png" 
              alt="Studyo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <h2 style={{
            fontSize: '20px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            marginBottom: '4px'
          }}>
            {mode === 'login' ? 'Sign In to Studyo' : 'Create Free Account'}
          </h2>

          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            {mode === 'login' 
              ? 'Sync streaks, focus heatmaps & decks across all devices' 
              : '100% Free forever • Cloudflare edge database'
            }
          </p>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            width: '100%',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            marginTop: '16px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 700,
                color: mode === 'login' ? 'var(--text-main)' : 'var(--text-subtle)',
                background: mode === 'login' ? 'var(--bg-surface-elevated)' : 'transparent',
                border: mode === 'login' ? '1px solid var(--border-focus)' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 700,
                color: mode === 'register' ? 'var(--text-main)' : 'var(--text-subtle)',
                background: mode === 'register' ? 'var(--bg-surface-elevated)' : 'transparent',
                border: mode === 'register' ? '1px solid var(--border-focus)' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '12px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              fontSize: '12px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Optional Display Name (Register Mode) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '6px'
              }}>
                Display Name (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)'
                }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: '10px',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>
          )}

          {/* Email / Username Field */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                ref={emailInputRef}
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: '10px',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}>
              Password (Min 6 Characters)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 36px',
                  borderRadius: '10px',
                  fontSize: '13px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)',
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
              color: '#0a0c10',
              fontSize: '13.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(45, 212, 191, 0.3)',
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? (
              <span>Connecting to Cloudflare...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Sync' : 'Create Free Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Guest fallback option */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '16px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontSize: '11.5px',
                color: 'var(--text-subtle)',
                textDecoration: 'underline'
              }}
            >
              Continue as Guest (Offline Local Mode)
            </button>
          </div>
        </form>

        {/* Footer Guarantee */}
        <div style={{
          padding: '12px 28px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Cloud size={13} color="#2dd4bf" />
            <span>Cloudflare D1 SQL Edge</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} color="#4ade80" />
            <span style={{ color: 'var(--text-muted)' }}>100% Free Forever</span>
          </div>
        </div>
      </div>
    </div>
  );
}
