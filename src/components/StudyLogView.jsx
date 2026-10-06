import React from 'react';
import { BookOpen, Clock, Calendar, CheckCircle2, Trash2 } from 'lucide-react';

export default function StudyLogView({ sessions }) {
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
          Study Diary
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 24px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-main)',
          marginTop: '2px'
        }}>
          Session Log
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Chronological journal of every focused minute logged.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(14px, 3vw, 24px)', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No sessions recorded yet. Start a focus timer session to log your work!
          </div>
        ) : (
          sessions.map((sess) => {
            const mins = Math.round((sess.durationSeconds || 0) / 60);
            const dateStr = sess.timestamp ? new Date(sess.timestamp).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Recent';

            return (
              <div
                key={sess.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'background 0.15s ease',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-glow)'
                  }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                      {sess.subject || 'General Focus'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                      {dateStr} • Mode: {sess.mode || 'Flowmodoro'}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-main)',
                  background: 'var(--bg-surface)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {mins} mins
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
