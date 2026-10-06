import React, { useState } from 'react';
import { Clock, Calendar, Share2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TimeblockPlanner({ sessions, subjects }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const dateStr = selectedDate.toISOString().split('T')[0];

  // Filter sessions that took place on selectedDate
  const daySessions = sessions.filter(s => {
    if (!s.timestamp) return false;
    const sessDate = new Date(s.timestamp).toISOString().split('T')[0];
    return sessDate === dateStr;
  });

  // Build a 24-hour array (each hour has 6 blocks of 10-mins: 0..5)
  // Mapping each block (hour * 6 + blockIdx) to subject color if studied
  const timeBlocks = Array.from({ length: 24 }, (_, hour) => {
    return Array.from({ length: 6 }, (_, minIdx) => {
      const blockStartMinute = hour * 60 + minIdx * 10;
      const blockEndMinute = blockStartMinute + 10;

      // Check if any session covers this 10-minute block
      let matchedSubject = null;
      for (const sess of daySessions) {
        const start = new Date(sess.timestamp);
        const startMins = start.getHours() * 60 + start.getMinutes();
        const durationMins = Math.max(10, Math.round((sess.durationSeconds || 0) / 60));
        const endMins = startMins + durationMins;

        if (blockStartMinute >= startMins && blockStartMinute < endMins) {
          matchedSubject = sess.subject;
          break;
        }
      }

      const subjectObj = subjects.find(s => s.name === matchedSubject);
      return {
        hour,
        min: minIdx * 10,
        studied: !!matchedSubject,
        subject: matchedSubject,
        color: subjectObj?.color || 'var(--accent-primary)',
      };
    });
  });

  // Calculate total day study time
  const totalMinsToday = daySessions.reduce((acc, s) => acc + Math.round((s.durationSeconds || 0) / 60), 0);
  const totalHours = (totalMinsToday / 60).toFixed(1);

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleSharePlanner = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.4 } });
    navigator.clipboard?.writeText(`I logged ${totalHours} hours on Studyo today! 🚀`);
    alert(`Copied today's ${totalHours}h study summary to clipboard!`);
  };

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      padding: 'clamp(14px, 2.8vw, 24px) clamp(12px, 2.5vw, 20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(16px, 2.5vw, 24px)',
      width: '100%',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent-glow)'
          }}>
            Korean 10-Minute Visual Timetable
          </div>
          <h2 style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            marginTop: '2px'
          }}>
            Timeblock Ribbon Planner
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Every hour broken into 10-minute intervals. Watch your day fill with color.
          </p>
        </div>

        {/* Date Controls & Share */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '3px'
          }}>
            <button
              onClick={handlePrevDay}
              style={{ padding: '6px', borderRadius: '4px', color: 'var(--text-muted)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '0 8px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <button
              onClick={handleNextDay}
              style={{ padding: '6px', borderRadius: '4px', color: 'var(--text-muted)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={handleSharePlanner}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-ivory)',
              color: '#121212',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Ribbon Container */}
      <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', overflowX: 'auto' }}>
        {/* Top Summary Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-main)'
            }}>
              {totalHours} hrs
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Logged across {daySessions.length} sessions
            </div>
          </div>

          {/* Subjects color chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {subjects.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour 10-Minute Ribbon Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {timeBlocks.map((blocks, hour) => {
            const hourLabel = `${String(hour).padStart(2, '0')}:00`;
            const isNight = hour >= 23 || hour <= 5;

            return (
              <div
                key={hour}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: isNight ? 0.65 : 1
                }}
              >
                {/* Hour Label */}
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-subtle)',
                  width: '42px',
                  textAlign: 'right'
                }}>
                  {hourLabel}
                </span>

                {/* 6 Blocks of 10 minutes */}
                <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                  {blocks.map((block, bIdx) => (
                    <div
                      key={bIdx}
                      title={block.studied ? `${hourLabel.slice(0, 3)}${block.min}: ${block.subject}` : `${hourLabel.slice(0, 3)}${block.min}: Rest`}
                      style={{
                        flex: 1,
                        height: '20px',
                        borderRadius: '3px',
                        background: block.studied ? block.color : 'rgba(255, 255, 255, 0.03)',
                        border: block.studied ? `1px solid rgba(255, 255, 255, 0.2)` : '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.15s ease',
                        cursor: block.studied ? 'pointer' : 'default',
                        boxShadow: block.studied ? `0 0 10px ${block.color}40` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (block.studied) e.currentTarget.style.transform = 'scaleY(1.3)';
                      }}
                      onMouseLeave={(e) => {
                        if (block.studied) e.currentTarget.style.transform = 'scaleY(1)';
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
