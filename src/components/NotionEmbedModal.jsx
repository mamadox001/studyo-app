import React, { useState } from 'react';
import { Copy, Check, X, Layout, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NotionEmbedModal({ isOpen, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://studyo.app';
  const embedUrl = `${currentOrigin}/?mode=widget`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="280" frameborder="0" allow="autoplay; microphone" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(embedUrl);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(iframeCode);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
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
        maxWidth: '560px',
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
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee'
            }}>
              <Layout size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Notion & Obsidian Widget
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontWeight: 700 }}>
                  FREE FOREVER
                </span>
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Embed Studyo's minimalist timer into your personal workspace
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Live Widget Mini Preview */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-glow)', fontWeight: 700, letterSpacing: '0.05em' }}>
            WIDGET PREVIEW IN NOTION
          </div>
          <div style={{
            fontSize: '34px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-main)'
          }}>
            25:00
          </div>
          <div style={{
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-ivory)',
            color: '#121212',
            fontSize: '12px',
            fontWeight: 700
          }}>
            Start Focus
          </div>
        </div>

        {/* How to Embed Step by Step */}
        <div style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: 1.5
        }}>
          <strong>How to use in Notion:</strong>
          <ol style={{ paddingLeft: '18px', marginTop: '6px' }}>
            <li>Inside your Notion page, type <code style={{ color: 'var(--accent-glow)' }}>/embed</code> and hit Enter.</li>
            <li>Paste your unique widget link below and click <strong>Embed link</strong>.</li>
            <li>Resize the block to fit your desk dashboard!</li>
          </ol>
        </div>

        {/* Copy Link Button */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-ivory)',
              color: '#121212',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(245, 239, 230, 0.2)'
            }}
          >
            {copiedLink ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedLink ? 'Copied Embed Link!' : 'Copy Notion Embed Link'}</span>
          </button>

          <button
            onClick={handleCopyIframe}
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {copiedIframe ? <Check size={16} /> : <Copy size={16} />}
            <span>Copy iframe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
