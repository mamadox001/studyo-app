import React from 'react';
import { BarChart3, Clock, Flame, Calendar, Award, BookOpen } from 'lucide-react';

export default function StatsView({ sessions, subjects }) {
  // Aggregate stats
  const totalMinutes = sessions.reduce((acc, s) => acc + Math.round((s.durationSeconds || 0) / 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const averageSessionMins = sessions.length ? Math.round(totalMinutes / sessions.length) : 0;

  // Breakdown by subject
  const subjectDistribution = {};
  sessions.forEach(s => {
    const sub = s.subject || 'General';
    const mins = Math.round((s.durationSeconds || 0) / 60);
    subjectDistribution[sub] = (subjectDistribution[sub] || 0) + mins;
  });

  return (
    <div style={{
      maxWidth: '920px',
      margin: '0 auto',
      padding: 'clamp(14px, 2.8vw, 24px) clamp(12px, 2.5vw, 20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(16px, 2.5vw, 24px)',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--accent-glow)'
        }}>
          Deep Analytics
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 24px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-main)',
          marginTop: '2px'
        }}>
          Study Analytics & Metrics
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Comprehensive view of your focus discipline and subject allocations.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: 'clamp(14px, 2.5vw, 20px)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-glow)'
          }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Focus Time</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {totalHours} hrs
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4ade80'
          }}>
            <Flame size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Streak</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              7 Days 🔥
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22d3ee'
          }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Average Session</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {averageSessionMins} mins
            </div>
          </div>
        </div>
      </div>

      {/* Subject Distribution Bars */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
          Time Spent by Subject
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(subjectDistribution).map(([subName, mins]) => {
            const pct = totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0;
            const subObj = subjects.find(s => s.name === subName);
            const color = subObj?.color || 'var(--accent-primary)';

            return (
              <div key={subName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{subName}</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {Math.floor(mins / 60)}h {mins % 60}m ({pct}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    borderRadius: 'var(--radius-full)',
                    background: color,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
