import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  Flame, 
  Clock, 
  Download, 
  Share2, 
  Smartphone, 
  Layers, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShareModal({ isOpen, onClose, sessions, stats, user }) {
  const [copied, setCopied] = useState(false);
  const [cardFormat, setCardFormat] = useState('story'); // 'story' (9:16) or 'square' (1:1)
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  if (!isOpen) return null;

  const totalMinutes = sessions.reduce((acc, s) => acc + Math.round((s.durationSeconds || 0) / 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const streakDays = stats?.streak || 7;
  const sessionsCount = sessions.length || 47;
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Focus Champion';
  const shareUrl = window.location.origin || 'https://studyo-app.ramizakaria-official.workers.dev';
  const shareText = `🔥 My deep work streak is at ${streakDays} days with ${totalHours} hours of focus on Studyo! Discipline over motivation.`;

  // Draw high-resolution canvas for Instagram Stories (1080x1920) or Square Post (1080x1080)
  const renderCanvas = (format) => {
    return new Promise((resolve) => {
      const isStory = format === 'story';
      const width = 1080;
      const height = isStory ? 1920 : 1080;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Deep Space Obsidian Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(0.5, '#0f1422');
      bgGrad.addColorStop(1, '#07090e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Neon Glow Orbs
      const orb1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 450);
      orb1.addColorStop(0, 'rgba(45, 212, 191, 0.28)');
      orb1.addColorStop(1, 'rgba(45, 212, 191, 0)');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, width, height);

      const orb2 = ctx.createRadialGradient(width * 0.2, height * 0.75, 40, width * 0.2, height * 0.75, 500);
      orb2.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
      orb2.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, width, height);

      // 3. Central Card Container
      const cardX = isStory ? 80 : 70;
      const cardY = isStory ? 280 : 90;
      const cardW = width - (cardX * 2);
      const cardH = isStory ? 1360 : 900;
      const cardR = 40;

      // Card shadow & frosted surface
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 24;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.fillStyle = 'rgba(16, 21, 32, 0.85)';
      ctx.fill();
      ctx.restore();

      // Card border
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
      ctx.stroke();

      // 4. Header: Logo & Date inside card
      const contentTop = cardY + 90;

      // Logo squircle badge
      ctx.beginPath();
      ctx.roundRect(cardX + 70, contentTop, 64, 64, 18);
      ctx.fillStyle = '#092016';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2dd4bf';
      ctx.stroke();

      // Logo letter 'S'
      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('S', cardX + 102, contentTop + 45);

      // Brand Text "studyo"
      ctx.textAlign = 'left';
      ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#2dd4bf';
      ctx.fillText('st', cardX + 155, contentTop + 47);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('udyo', cardX + 198, contentTop + 47);

      // Free pill
      ctx.beginPath();
      ctx.roundRect(cardX + 325, contentTop + 14, 140, 36, 10);
      ctx.fillStyle = 'rgba(45, 212, 191, 0.15)';
      ctx.fill();
      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100% FREE', cardX + 395, contentTop + 38);

      // Date
      ctx.textAlign = 'right';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      ctx.fillText(dateStr, cardX + cardW - 70, contentTop + 42);

      // 5. User Journey Badge
      const userY = contentTop + 140;
      ctx.textAlign = 'left';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`${userName}'s Focus Sanctuary`, cardX + 70, userY);

      ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Proof of Unbroken Consistency', cardX + 70, userY + 38);

      // 6. Two Large Glowing Metric Boxes
      const boxY = userY + 90;
      const boxW = (cardW - 170) / 2;
      const boxH = isStory ? 320 : 260;

      // Box 1: Focus Hours
      ctx.beginPath();
      ctx.roundRect(cardX + 70, boxY, boxW, boxH, 24);
      ctx.fillStyle = 'rgba(10, 14, 22, 0.7)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('⏱ Total Focus', cardX + 105, boxY + 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 76px "JetBrains Mono", monospace';
      ctx.fillText(`${totalHours}h`, cardX + 105, boxY + 165);

      ctx.fillStyle = '#64748b';
      ctx.font = '500 19px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${sessionsCount} logged sessions`, cardX + 105, boxY + 225);

      // Box 2: Daily Streak
      const box2X = cardX + 70 + boxW + 30;
      ctx.beginPath();
      ctx.roundRect(box2X, boxY, boxW, boxH, 24);
      ctx.fillStyle = 'rgba(10, 14, 22, 0.7)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('🔥 Daily Streak', box2X + 35, boxY + 60);

      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 76px "JetBrains Mono", monospace';
      ctx.fillText(`${streakDays}d`, box2X + 35, boxY + 165);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Top 5% Consistency', box2X + 35, boxY + 225);

      // 7. Quote Card
      const quoteY = boxY + boxH + 50;
      ctx.beginPath();
      ctx.roundRect(cardX + 70, quoteY, cardW - 140, isStory ? 190 : 150, 20);
      ctx.fillStyle = 'rgba(45, 212, 191, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.15)';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'italic 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('"Discipline is choosing between what you want now', width / 2, quoteY + 65);
      ctx.fillText('and what you want most."', width / 2, quoteY + 105);

      // 8. Story Footer (CTA)
      const footerY = isStory ? (cardY + cardH + 110) : (cardY + cardH - 60);
      ctx.textAlign = 'center';
      ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#2dd4bf';
      ctx.fillText('studyo.app', width / 2, footerY);

      ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Free Deep Work Sanctuary • Zero Distractions', width / 2, footerY + 32);

      resolve(canvas);
    });
  };

  // Main Action: Share to Instagram Stories (or download image)
  const handleInstagramShare = async () => {
    setIsGenerating(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      const canvas = await renderCanvas(cardFormat);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }

        const fileName = `studyo-proof-of-work-${cardFormat}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        // If mobile browser supports sharing files (direct to Instagram Stories / Camera Roll)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Studyo Proof of Work',
              text: shareText
            });
            setIsGenerating(false);
            return;
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.log('Share API fallback to download', err);
            } else {
              setIsGenerating(false);
              return;
            }
          }
        }

        // Direct Download Fallback
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setIsGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  // Quick Social Share Links
  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-panel modal-enter" style={{
        width: '100%',
        maxWidth: '480px',
        maxHeight: '94vh',
        overflowY: 'auto',
        padding: 'clamp(18px, 3.5vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-glow)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Share Proof of Work
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Format Selector: Instagram Story (9:16) vs Square Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: 'rgba(0,0,0,0.3)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setCardFormat('story')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              background: cardFormat === 'story' ? 'linear-gradient(135deg, rgba(225, 48, 108, 0.25), rgba(245, 96, 64, 0.25))' : 'transparent',
              color: cardFormat === 'story' ? '#f43f5e' : 'var(--text-muted)',
              border: cardFormat === 'story' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid transparent'
            }}
          >
            <Smartphone size={14} />
            <span>Instagram Story (9:16)</span>
          </button>

          <button
            onClick={() => setCardFormat('square')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              background: cardFormat === 'square' ? 'rgba(45, 212, 191, 0.18)' : 'transparent',
              color: cardFormat === 'square' ? '#2dd4bf' : 'var(--text-muted)',
              border: cardFormat === 'square' ? '1px solid rgba(45, 212, 191, 0.35)' : '1px solid transparent'
            }}
          >
            <Layers size={14} />
            <span>Feed Card (Square)</span>
          </button>
        </div>

        {/* The Aesthetic Share Card Preview */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(145deg, #0e121a, #161c28)',
          border: '1.5px solid rgba(45, 212, 191, 0.3)',
          padding: cardFormat === 'story' ? '28px 22px' : '22px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.65)',
          display: 'flex',
          flexDirection: 'column',
          gap: cardFormat === 'story' ? '18px' : '14px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.28s ease'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/app-icon-squircle.png" alt="Studyo" style={{ width: '26px', height: '26px', borderRadius: '7px' }} />
              <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#2dd4bf' }}>st</span><span>udyo</span>
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
                100% FREE
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>
              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* User Headline */}
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
              {userName}'s Deep Work Proof
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
              Proof of Unbroken Discipline
            </div>
          </div>

          {/* Middle Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Clock size={13} />
                <span>Total Focus</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--text-main)' }}>
                {totalHours}h
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                {sessionsCount} sessions
              </div>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(251, 191, 36, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#fbbf24' }}>
                <Flame size={13} color="#f59e0b" />
                <span>Daily Streak</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px', color: '#fef3c7' }}>
                {streakDays} Days
              </div>
              <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '2px' }}>
                🔥 Consistency
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div style={{
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '10px',
            lineHeight: 1.4
          }}>
            "Discipline is choosing between what you want now and what you want most."
          </div>

          {/* Card footer watermark */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
            <span style={{ fontSize: '10px', color: '#2dd4bf', fontWeight: 700 }}>studyo.app</span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-subtle)' }}>Deep Work Sanctuary</span>
          </div>
        </div>

        {/* Primary Action Button: Instagram Story / Download Image */}
        <button
          onClick={handleInstagramShare}
          disabled={isGenerating}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #e1306c 0%, #fd1d1d 50%, #f56040 100%)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(225, 48, 108, 0.35)',
            border: 'none',
            cursor: isGenerating ? 'wait' : 'pointer',
            transition: 'transform 0.18s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {/* Instagram SVG icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>
            {isGenerating 
              ? 'Generating HD Story...' 
              : (cardFormat === 'story' ? 'Share / Save for Instagram Story' : 'Download HD Card')}
          </span>
        </button>

        {/* Quick Social Share Bar */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Or share directly to
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {/* X / Twitter */}
            <button
              onClick={handleShareTwitter}
              title="Share on X (Twitter)"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 6px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '11px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'var(--text-muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X Post</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 6px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(34, 197, 94, 0.06)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                color: '#4ade80',
                fontSize: '11px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.12)';
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.25)';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleShareTelegram}
              title="Share on Telegram"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 6px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
              }}
            >
              <Send size={15} />
              <span>Telegram</span>
            </button>

            {/* Copy Link / Text */}
            <button
              onClick={handleCopyText}
              title="Copy Summary Text to Clipboard"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 6px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: copied ? '#4ade80' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = copied ? '#4ade80' : 'var(--text-muted)';
              }}
            >
              {copied ? <Check size={15} color="#4ade80" /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
