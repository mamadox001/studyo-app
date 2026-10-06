import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  HelpCircle,
  Award
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

export default function BlurtingStudio({ subjects, onSaveBlurt, blurts }) {
  const [stage, setStage] = useState('setup'); // 'setup', 'blurting', 'review'
  const [topic, setTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'General');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [timeLeft, setTimeLeft] = useState(600);
  const [blurtText, setBlurtText] = useState('');
  const [referenceNotes, setReferenceNotes] = useState('');
  const [masteryScore, setMasteryScore] = useState(80);

  const timerRef = useRef(null);

  useEffect(() => {
    if (stage === 'blurting') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteBlurt();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  const handleStartBlurt = () => {
    if (!topic.trim()) return;
    soundEngine.playClick();
    setTimeLeft(durationMinutes * 60);
    setBlurtText('');
    setStage('blurting');
  };

  const handleCompleteBlurt = () => {
    soundEngine.playChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
    setStage('review');
  };

  const handleSaveSession = () => {
    soundEngine.playClick();
    const newBlurt = {
      id: `blurt_${Date.now()}`,
      topic,
      subject: selectedSubject,
      durationMinutes,
      content: blurtText,
      referenceNotes,
      masteryScore,
      createdAt: new Date().toISOString(),
    };

    if (onSaveBlurt) onSaveBlurt(newBlurt);
    setStage('setup');
    setTopic('');
    setBlurtText('');
    setReferenceNotes('');
  };

  const wordCount = blurtText.trim() ? blurtText.trim().split(/\s+/).length : 0;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent-glow)'
          }}>
            Active Retrieval Method
          </div>
          <h2 style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            marginTop: '2px'
          }}>
            The Blurting Studio
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Dump all retrieved knowledge from memory without notes, then uncover your blind spots.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <Brain size={15} color="var(--accent-glow)" />
          <span>Stage: {stage.toUpperCase()}</span>
        </div>
      </div>

      {/* STAGE 1: SETUP */}
      {stage === 'setup' && (
        <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              What topic or concept are you testing today?
            </label>
            <input
              type="text"
              placeholder="e.g. Distributed Consensus (Raft / Paxos), Krebs Cycle, French Subjunctive..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '14px',
                }}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Duration
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[5, 10, 15, 20].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      borderRadius: 'var(--radius-md)',
                      background: durationMinutes === mins ? 'var(--accent-primary)' : 'var(--bg-surface)',
                      color: durationMinutes === mins ? '#ffffff' : 'var(--text-muted)',
                      border: durationMinutes === mins ? '1px solid var(--accent-glow)' : '1px solid var(--border-subtle)',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action to Start */}
          <button
            onClick={handleStartBlurt}
            disabled={!topic.trim()}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: topic.trim() ? 'var(--accent-ivory)' : 'rgba(255,255,255,0.08)',
              color: topic.trim() ? '#121212' : 'var(--text-subtle)',
              fontSize: '15px',
              fontWeight: 700,
              cursor: topic.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              boxShadow: topic.trim() ? '0 4px 20px rgba(245, 239, 230, 0.2)' : 'none',
            }}
          >
            <span>Begin Memory Retrieval Dump</span>
            <ChevronRight size={18} />
          </button>

          {/* Past Blurts History */}
          {blurts && blurts.length > 0 && (
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>
                Past Blurting Sessions ({blurts.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {blurts.slice(0, 4).map(b => (
                  <div
                    key={b.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-main)' }}>
                        {b.topic}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                        {b.subject} • {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--accent-glow)',
                      background: 'rgba(139, 92, 246, 0.1)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {b.masteryScore}% Mastery
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 2: ACTIVE BLURTING */}
      {stage === 'blurting' && (
        <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--accent-glow)', fontWeight: 600 }}>Active Recall Dump</div>
              <h3 style={{ fontSize: 'clamp(17px, 3vw, 20px)', fontWeight: 800, color: 'var(--text-main)' }}>{topic}</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Live word counter */}
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>{wordCount}</strong> words
              </div>

              {/* Countdown badge */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                fontWeight: 800,
                color: timeLeft < 60 ? '#ef4444' : 'var(--text-main)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '5px 12px',
                borderRadius: 'var(--radius-md)'
              }}>
                {formatTimer(timeLeft)}
              </div>

              {/* Done button */}
              <button
                onClick={handleCompleteBlurt}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-ivory)',
                  color: '#121212',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                Finished Early
              </button>
            </div>
          </div>

          <textarea
            autoFocus
            placeholder="Type continuously! Don't worry about spelling or perfection. Write equations, bullet points, core mechanisms, definitions, relationships..."
            value={blurtText}
            onChange={(e) => setBlurtText(e.target.value)}
            style={{
              width: '100%',
              minHeight: 'clamp(240px, 45vh, 380px)',
              padding: 'clamp(14px, 2.5vw, 20px)',
              fontSize: '14.5px',
              lineHeight: 1.6,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              resize: 'vertical',
            }}
          />
        </div>
      )}

      {/* STAGE 3: REVIEW & GAP ANALYSIS */}
      {stage === 'review' && (
        <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--accent-success)', fontWeight: 700, letterSpacing: '0.05em' }}>
                PHASE 2: GAP ANALYSIS
              </div>
              <h3 style={{ fontSize: 'clamp(17px, 3vw, 20px)', fontWeight: 800, color: 'var(--text-main)' }}>
                Compare Retrieved Memory vs Source
              </h3>
            </div>

            <button
              onClick={handleSaveSession}
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-ivory)',
                color: '#121212',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(245, 239, 230, 0.25)'
              }}
            >
              <Award size={16} />
              <span>Save & Log Session</span>
            </button>
          </div>

          {/* Side by side comparison (Responsive columns that wrap gracefully on mobile) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
            {/* Left: What you blurted */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-glow)' }}>
                Your Brain Dump ({wordCount} words)
              </div>
              <div style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap',
                maxHeight: '320px',
                overflowY: 'auto'
              }}>
                {blurtText || '(Nothing written)'}
              </div>
            </div>

            {/* Right: Paste Reference Notes / Mark Blind Spots */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                Reference Notes / Syllabus Checklist
              </div>
              <textarea
                placeholder="Paste your original lecture notes, slides, or syllabus criteria here to compare what you remembered vs what you forgot..."
                value={referenceNotes}
                onChange={(e) => setReferenceNotes(e.target.value)}
                style={{
                  width: '100%',
                  height: '240px',
                  padding: '12px',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
              />
              {/* Mastery Slider */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Self-Assessed Recall Score:</span>
                  <strong style={{ color: 'var(--accent-glow)' }}>{masteryScore}%</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={masteryScore}
                  onChange={(e) => setMasteryScore(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
