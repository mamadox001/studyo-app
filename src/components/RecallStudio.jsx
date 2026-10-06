import React, { useState } from 'react';
import { 
  RotateCcw, 
  Plus, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  BookMarked,
  ArrowRight,
  Download
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

export default function RecallStudio({ decks, cards, onSaveCard }) {
  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?.id || null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const deckCards = cards.filter(c => c.deckId === selectedDeckId);
  const currentCard = deckCards[currentCardIndex];

  const handleFlip = () => {
    soundEngine.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleRateCard = (ratingDays) => {
    soundEngine.playClick();
    setIsFlipped(false);
    
    if (currentCardIndex + 1 < deckCards.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Completed all cards in deck!
      soundEngine.playChime();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      setCurrentCardIndex(0);
    }
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    soundEngine.playClick();
    
    onSaveCard({
      deckId: selectedDeckId,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    });

    setNewQuestion('');
    setNewAnswer('');
    setShowAddModal(false);
  };

  const handleExportAnki = () => {
    soundEngine.playClick();
    const currentDeck = decks.find(d => d.id === selectedDeckId);
    if (deckCards.length === 0) {
      alert('This deck has no cards to export.');
      return;
    }

    const content = deckCards.map(c => `${c.question.replace(/\t/g, ' ')}\t${c.answer.replace(/\t/g, ' ')}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentDeck?.name || 'Studyo_Deck').replace(/\s+/g, '_')}_anki.txt`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.3 } });
  };

  const currentDeck = decks.find(d => d.id === selectedDeckId);

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
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent-glow)'
          }}>
            Spaced Repetition System
          </div>
          <h2 style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            marginTop: '2px'
          }}>
            Active Recall Flashcards
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Strengthen long-term synaptic recall with active testing & interval spacing.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportAnki}
            title="Download in Anki / Quizlet .txt format"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Download size={13} />
            <span>Export Anki (.txt)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-ivory)',
              color: '#121212',
              fontSize: '12.5px',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(245, 239, 230, 0.2)'
            }}
          >
            <Plus size={15} />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Decks Carousel / Selector */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {decks.map(deck => {
          const isSelected = deck.id === selectedDeckId;
          const count = cards.filter(c => c.deckId === deck.id).length;
          return (
            <button
              key={deck.id}
              onClick={() => {
                setSelectedDeckId(deck.id);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              style={{
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '1.5px solid var(--accent-glow)' : '1px solid var(--border-subtle)',
                color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
                minWidth: '180px',
                textAlign: 'left',
                boxShadow: isSelected ? '0 4px 20px var(--border-glow)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{deck.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                {deck.subject} • {count} cards
              </span>
            </button>
          );
        })}
      </div>

      {/* 3D Flashcard Display Area */}
      {deckCards.length > 0 && currentCard ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Card counter */}
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            Card {currentCardIndex + 1} of {deckCards.length}
          </div>

          {/* Interactive Card with 3D Flip */}
          <div
            onClick={handleFlip}
            style={{
              width: '100%',
              maxWidth: '640px',
              minHeight: '300px',
              perspective: '1000px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div style={{
              width: '100%',
              minHeight: '260px',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              background: 'var(--bg-glass-elevated)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-glass)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(18px, 4vw, 32px)',
            }}>
              {/* Card Label */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: isFlipped ? 'var(--accent-success)' : 'var(--accent-glow)'
                }}>
                  {isFlipped ? 'Answer / Explanation' : 'Question / Prompt'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                  Click or Space to flip
                </span>
              </div>

              {/* Card Content Text */}
              <div style={{
                fontSize: 'clamp(15px, 3.2vw, 18px)',
                fontWeight: 600,
                lineHeight: 1.6,
                color: 'var(--text-main)',
                textAlign: 'center',
                margin: '22px 0',
                transform: isFlipped ? 'rotateY(180deg)' : 'none',
              }}>
                {isFlipped ? currentCard.answer : currentCard.question}
              </div>

              {/* Bottom tag */}
              <div style={{
                fontSize: '11px',
                color: 'var(--text-subtle)',
                textAlign: 'center',
                transform: isFlipped ? 'rotateY(180deg)' : 'none'
              }}>
                {currentDeck?.subject}
              </div>
            </div>
          </div>

          {/* Rating Spaced Repetition Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            maxWidth: '640px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handleRateCard(1)}
              style={{
                flex: 1,
                minWidth: 'clamp(70px, 20vw, 110px)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontWeight: 700,
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              Again (1d)
            </button>
            <button
              onClick={() => handleRateCard(3)}
              style={{
                flex: 1,
                minWidth: 'clamp(70px, 20vw, 110px)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontWeight: 700,
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              Hard (3d)
            </button>
            <button
              onClick={() => handleRateCard(5)}
              style={{
                flex: 1,
                minWidth: 'clamp(70px, 20vw, 110px)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontWeight: 700,
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              Good (5d)
            </button>
            <button
              onClick={() => handleRateCard(10)}
              style={{
                flex: 1,
                minWidth: 'clamp(70px, 20vw, 110px)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#22d3ee',
                fontWeight: 700,
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              Easy (10d)
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No cards in this deck yet. Click "Add Card" to create your first active recall card!</p>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <form
            onSubmit={handleCreateCard}
            className="glass-panel modal-enter"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
              Create Active Recall Card
            </h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Question / Prompt (Front)
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. What is the Big-O time complexity of QuickSort in the average case?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Answer / Explanation (Back)
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. O(N log N) on average, because the divide-and-conquer partition divides the array in half each time."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-ivory)',
                  color: '#121212',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                Save Card
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
