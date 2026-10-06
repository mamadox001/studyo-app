import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box, 
  Layers, 
  Share2, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Flame, 
  Trophy, 
  RotateCcw,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Storage } from '../services/storage';
import { soundEngine } from '../services/soundEngine';

export default function FocusDashboard({ 
  sessions, 
  subjects, 
  selectedSubject, 
  setSelectedSubject, 
  onOpenShareModal 
}) {
  const [is3D, setIs3D] = useState(false);
  const [viewWeeks, setViewWeeks] = useState(24); // 24 weeks or 52 weeks
  const [hoveredCell, setHoveredCell] = useState(null);
  const canvasRef = useRef(null);

  // Daily Intention Quest State
  const [dailyQuest, setDailyQuest] = useState(() => Storage.getDailyQuest());
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Group sessions by date string YYYY-MM-DD
  const dailyStudyMap = React.useMemo(() => {
    const map = {};
    sessions.forEach(sess => {
      if (!sess.timestamp) return;
      const dateKey = new Date(sess.timestamp).toISOString().split('T')[0];
      const durationMins = Math.round((sess.durationSeconds || 0) / 60);
      map[dateKey] = (map[dateKey] || 0) + durationMins;
    });
    return map;
  }, [sessions]);

  // Generate grid matrix for the past `viewWeeks` weeks (7 rows: Sun..Sat, columns: weeks)
  const gridData = React.useMemo(() => {
    const totalDays = viewWeeks * 7;
    const days = [];
    const today = new Date();
    
    // Align to ending on today's day of week
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const minutes = dailyStudyMap[dateKey] || 0;
      days.push({
        date: d,
        dateKey,
        minutes,
        intensity: minutes === 0 ? 0 : minutes < 30 ? 1 : minutes < 60 ? 2 : minutes < 120 ? 3 : 4,
      });
    }

    // Split into columns (weeks)
    const weeks = [];
    for (let w = 0; w < viewWeeks; w++) {
      weeks.push(days.slice(w * 7, (w + 1) * 7));
    }
    return { days, weeks };
  }, [viewWeeks, dailyStudyMap]);

  // Total summary calculations
  const totalMinutes = Object.values(dailyStudyMap).reduce((acc, curr) => acc + curr, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalSessionsCount = sessions.length;

  // Today stats & Quest calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMinutes = dailyStudyMap[todayStr] || 0;
  
  const completedSubtasks = dailyQuest.subtasks.filter(s => s.completed).length;
  const totalSubtasks = dailyQuest.subtasks.length;
  const questProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  const isQuestFullyCompleted = totalSubtasks > 0 && completedSubtasks === totalSubtasks;

  const handleToggleSubtask = (id) => {
    soundEngine.playPop();
    const updatedSubtasks = dailyQuest.subtasks.map(s => {
      if (s.id === id) return { ...s, completed: !s.completed };
      return s;
    });

    const newlyCompletedCount = updatedSubtasks.filter(s => s.completed).length;
    const nowComplete = totalSubtasks > 0 && newlyCompletedCount === totalSubtasks;

    const updatedQuest = { ...dailyQuest, subtasks: updatedSubtasks };
    setDailyQuest(updatedQuest);
    Storage.saveDailyQuest(updatedQuest);

    if (nowComplete && !isQuestFullyCompleted) {
      soundEngine.playSuccess();
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.45 }
      });
    }
  };

  const handleUpdateTitle = (newTitle) => {
    const updatedQuest = { ...dailyQuest, title: newTitle };
    setDailyQuest(updatedQuest);
    Storage.saveDailyQuest(updatedQuest);
    setIsEditingTitle(false);
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    soundEngine.playClick();
    const newSubtask = {
      id: Date.now(),
      text: newSubtaskText.trim(),
      completed: false,
    };
    const updatedQuest = {
      ...dailyQuest,
      subtasks: [...dailyQuest.subtasks, newSubtask]
    };
    setDailyQuest(updatedQuest);
    Storage.saveDailyQuest(updatedQuest);
    setNewSubtaskText('');
    setIsAddingSubtask(false);
  };

  const handleDeleteSubtask = (id) => {
    soundEngine.playClick();
    const updatedQuest = {
      ...dailyQuest,
      subtasks: dailyQuest.subtasks.filter(s => s.id !== id)
    };
    setDailyQuest(updatedQuest);
    Storage.saveDailyQuest(updatedQuest);
  };

  const handleResetQuest = () => {
    soundEngine.playClick();
    const updatedQuest = {
      ...dailyQuest,
      subtasks: dailyQuest.subtasks.map(s => ({ ...s, completed: false }))
    };
    setDailyQuest(updatedQuest);
    Storage.saveDailyQuest(updatedQuest);
  };

  // 3D Isometric Canvas Renderer
  useEffect(() => {
    if (!is3D || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cols = gridData.weeks.length;
    const rows = 7;
    const tileW = 22;
    const tileH = 11;

    // Origin centered
    const originX = width / 2 - (cols - rows) * (tileW / 2) + 20;
    const originY = height / 2 - 40;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const day = gridData.weeks[c]?.[r];
          if (!day) continue;

          const mins = day.minutes;
          // Column height based on minutes studied
          const maxHeight = 70;
          const colHeight = mins === 0 ? 4 : Math.min(maxHeight, 6 + (mins / 180) * maxHeight);

          // Isometric coordinates
          const isoX = originX + (c - r) * (tileW / 2);
          const isoY = originY + (c + r) * (tileH / 2);

          // Pick color based on intensity
          let topColor = 'rgba(255, 255, 255, 0.06)';
          let leftColor = 'rgba(255, 255, 255, 0.04)';
          let rightColor = 'rgba(255, 255, 255, 0.02)';

          if (day.intensity === 1) {
            topColor = 'rgba(139, 92, 246, 0.4)';
            leftColor = 'rgba(109, 40, 217, 0.5)';
            rightColor = 'rgba(76, 29, 149, 0.6)';
          } else if (day.intensity === 2) {
            topColor = 'rgba(147, 51, 234, 0.65)';
            leftColor = 'rgba(126, 34, 206, 0.75)';
            rightColor = 'rgba(88, 28, 135, 0.85)';
          } else if (day.intensity === 3) {
            topColor = '#a855f7';
            leftColor = '#9333ea';
            rightColor = '#7e22ce';
          } else if (day.intensity >= 4) {
            topColor = '#c084fc';
            leftColor = '#a855f7';
            rightColor = '#9333ea';
          }

          // Draw Right Face
          ctx.fillStyle = rightColor;
          ctx.beginPath();
          ctx.moveTo(isoX, isoY + tileH / 2 - colHeight);
          ctx.lineTo(isoX + tileW / 2, isoY - colHeight);
          ctx.lineTo(isoX + tileW / 2, isoY);
          ctx.lineTo(isoX, isoY + tileH / 2);
          ctx.closePath();
          ctx.fill();

          // Draw Left Face
          ctx.fillStyle = leftColor;
          ctx.beginPath();
          ctx.moveTo(isoX - tileW / 2, isoY - colHeight);
          ctx.lineTo(isoX, isoY + tileH / 2 - colHeight);
          ctx.lineTo(isoX, isoY + tileH / 2);
          ctx.lineTo(isoX - tileW / 2, isoY);
          ctx.closePath();
          ctx.fill();

          // Draw Top Face
          ctx.fillStyle = topColor;
          ctx.beginPath();
          ctx.moveTo(isoX, isoY - tileH / 2 - colHeight);
          ctx.lineTo(isoX + tileW / 2, isoY - colHeight);
          ctx.lineTo(isoX, isoY + tileH / 2 - colHeight);
          ctx.lineTo(isoX - tileW / 2, isoY - colHeight);
          ctx.closePath();
          ctx.fill();

          // Subtle border line on top
          ctx.strokeStyle = mins > 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [is3D, gridData]);

  const handleShare = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.25 }
    });
    if (onOpenShareModal) onOpenShareModal();
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      padding: 'clamp(14px, 2.8vw, 24px) clamp(12px, 2.5vw, 20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(16px, 2.5vw, 24px)',
      width: '100%',
      overflowX: 'hidden'
    }}>
      {/* Top Banner: Subject Tags & Goal Quote */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Subject Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-subtle)' }}>Subject:</span>
          {subjects.map(sub => {
            const isSelected = selectedSubject === sub.name;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? `1.5px solid ${sub.color}` : '1px solid var(--border-subtle)',
                  color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: sub.color,
                  boxShadow: isSelected ? `0 0 8px ${sub.color}` : 'none'
                }} />
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>

        {/* View toggle (16w vs 24w) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setViewWeeks(16)}
            style={{
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              background: viewWeeks === 16 ? 'var(--bg-surface-elevated)' : 'transparent',
              color: viewWeeks === 16 ? 'var(--text-main)' : 'var(--text-subtle)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            16w
          </button>
          <button
            onClick={() => setViewWeeks(24)}
            style={{
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              background: viewWeeks === 24 ? 'var(--bg-surface-elevated)' : 'transparent',
              color: viewWeeks === 24 ? 'var(--text-main)' : 'var(--text-subtle)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            24w
          </button>
        </div>
      </div>

      {/* 4 Key Metric Quick Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px',
        width: '100%'
      }}>
        {/* Metric 1: Streak */}
        <div className="glass-panel glow-card" style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            flexShrink: 0
          }}>
            <Flame size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Consistency Streak
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '1px' }}>
              7 Days Active
            </div>
          </div>
        </div>

        {/* Metric 2: Today's Focus */}
        <div className="glass-panel glow-card" style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-glow)',
            flexShrink: 0
          }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today's Focus
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '1px' }}>
              {todayMinutes}m studied
            </div>
          </div>
        </div>

        {/* Metric 3: Total Logged */}
        <div className="glass-panel glow-card" style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22d3ee',
            flexShrink: 0
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Proof of Work
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '1px' }}>
              {totalHours}h <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>({totalSessionsCount} sess)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Daily Quest Progress */}
        <div className="glass-panel glow-card" style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isQuestFullyCompleted ? 'rgba(34, 197, 94, 0.18)' : 'rgba(255, 255, 255, 0.05)',
            border: isQuestFullyCompleted ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isQuestFullyCompleted ? '#4ade80' : 'var(--text-muted)',
            flexShrink: 0
          }}>
            <Target size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quest Mastery
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: isQuestFullyCompleted ? '#4ade80' : 'var(--text-main)', letterSpacing: '-0.02em', marginTop: '1px' }}>
              {questProgress}% <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>({completedSubtasks}/{totalSubtasks})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Core Focus Quest HUD Card */}
      <div className="glass-panel glow-card" style={{
        padding: 'clamp(18px, 3.5vw, 24px)',
        borderRadius: 'var(--radius-lg)',
        border: isQuestFullyCompleted ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-subtle)',
        background: isQuestFullyCompleted ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.06), var(--bg-glass))' : 'var(--bg-glass)',
        boxShadow: isQuestFullyCompleted ? '0 0 25px rgba(34, 197, 94, 0.12)' : 'var(--shadow-glass)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Quest Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: isQuestFullyCompleted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isQuestFullyCompleted ? '#4ade80' : 'var(--accent-glow)'
            }}>
              <Target size={16} />
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: isQuestFullyCompleted ? '#4ade80' : 'var(--accent-glow)'
              }}>
                Today's Core Intention
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                Focus Quest • Reset daily at midnight
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Progress Bar & Text */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,0,0,0.3)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '60px',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${questProgress}%`,
                  height: '100%',
                  background: isQuestFullyCompleted ? '#22c55e' : 'var(--accent-primary)',
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: isQuestFullyCompleted ? '#4ade80' : 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                {questProgress}%
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetQuest}
              title="Reset today's tasks"
              style={{
                padding: '6px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-subtle)',
                display: 'flex'
              }}
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Quest Objective Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          {isEditingTitle ? (
            <input
              type="text"
              defaultValue={dailyQuest.title}
              autoFocus
              onBlur={(e) => handleUpdateTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTitle(e.target.value);
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              style={{
                width: '100%',
                fontSize: '17px',
                fontWeight: 700,
                padding: '6px 10px',
                borderRadius: '8px'
              }}
            />
          ) : (
            <h3 
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit quest title"
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{dailyQuest.title}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 400 }}>✏️</span>
            </h3>
          )}
        </div>

        {/* Quest Subtasks Checklist */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {dailyQuest.subtasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleSubtask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                background: task.completed ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: task.completed ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {task.completed ? (
                  <CheckCircle2 size={18} color="#4ade80" />
                ) : (
                  <Circle size={18} color="var(--text-subtle)" />
                )}
                <span style={{
                  fontSize: '13.5px',
                  fontWeight: 500,
                  color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  transition: 'color 0.2s ease'
                }}>
                  {task.text}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSubtask(task.id);
                }}
                title="Remove milestone"
                style={{
                  color: 'var(--text-subtle)',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  opacity: 0.6
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Milestone Form or Trigger */}
        {isAddingSubtask ? (
          <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              autoFocus
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              placeholder="e.g. Solve 5 LeetCode problems..."
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--accent-primary)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingSubtask(false)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-muted)',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setIsAddingSubtask(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--accent-glow)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            >
              <Plus size={14} />
              <span>Add Quest Milestone</span>
            </button>

            {isQuestFullyCompleted && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#4ade80'
              }}>
                <Trophy size={14} />
                <span>Quest Conquered Today!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Focus Heatmap Container */}
      <div className="glass-panel" style={{
        padding: 'clamp(16px, 3.5vw, 28px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* Card Header */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent-glow)'
            }}>
              Proof Of Work
            </div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              marginTop: '2px'
            }}>
              Activity Heatmap
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 3D Toggle Button */}
            <button
              onClick={() => setIs3D(!is3D)}
              className="glass-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: is3D ? '#ffffff' : 'var(--text-muted)',
                background: is3D ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                border: is3D ? '1px solid var(--accent-glow)' : '1px solid var(--border-subtle)',
                boxShadow: is3D ? '0 0 16px var(--border-glow)' : 'none',
              }}
            >
              {is3D ? <Layers size={14} /> : <Box size={14} />}
              <span>{is3D ? '3D Active' : '3D Mode'}</span>
            </button>

            {/* Share progress button */}
            <button
              onClick={handleShare}
              style={{
                padding: '7px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Share Card"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* 2D Heatmap Grid OR 3D Isometric View */}
        {is3D ? (
          <div style={{
            width: '100%',
            height: '240px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <canvas 
              ref={canvasRef} 
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '12px',
              fontSize: '11px',
              color: 'var(--text-subtle)',
              background: 'rgba(0,0,0,0.5)',
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              Isometric Voxel Skyline • Heights represent study hours
            </div>
          </div>
        ) : (
          <div style={{
            width: '100%',
            overflowX: 'auto',
            paddingBottom: '12px'
          }}>
            {/* Days & Weeks Matrix */}
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
              {/* Day rows: Mon, Wed, Fri label on side */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {gridData.weeks.map((week, wIdx) => (
                  <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {week.map((day, dIdx) => {
                      const isHovered = hoveredCell?.dateKey === day.dateKey;
                      const getCellColor = (intensity) => {
                        switch (intensity) {
                          case 1: return 'var(--heatmap-1)';
                          case 2: return 'var(--heatmap-2)';
                          case 3: return 'var(--heatmap-3)';
                          case 4: return 'var(--heatmap-4)';
                          default: return 'var(--heatmap-0)';
                        }
                      };

                      return (
                        <div
                          key={day.dateKey}
                          onMouseEnter={() => setHoveredCell(day)}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '3px',
                            backgroundColor: getCellColor(day.intensity),
                            border: isHovered 
                              ? '1.5px solid #ffffff' 
                              : day.intensity > 0 
                                ? '1px solid rgba(255, 255, 255, 0.15)' 
                                : '1px solid var(--border-subtle)',
                            transform: isHovered ? 'scale(1.35)' : 'scale(1)',
                            transition: 'transform 0.12s ease, background-color 0.2s ease',
                            cursor: 'pointer',
                            zIndex: isHovered ? 10 : 1,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tooltip on cell hover */}
        {hoveredCell && !is3D && (
          <div style={{
            position: 'absolute',
            bottom: '60px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-focus)',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--text-main)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
            zIndex: 20
          }}>
            <strong>{hoveredCell.dateKey}:</strong> {hoveredCell.minutes > 0 ? `${Math.floor(hoveredCell.minutes / 60)}h ${hoveredCell.minutes % 60}m studied` : 'No study logged'}
          </div>
        )}

        {/* Footer info: stats summary & color scale */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
              {totalHours}h total
            </span>
            <span>•</span>
            <span>{totalSessionsCount} sessions</span>
          </div>

          {/* Color scale legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Less</span>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--heatmap-0)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--heatmap-1)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--heatmap-2)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--heatmap-3)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--heatmap-4)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
