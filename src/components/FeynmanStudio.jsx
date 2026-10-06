import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, Plus, Sparkles, BookOpen } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

const COMMON_JARGON_TERMS = [
  'deterministic', 'paradigm', 'eigenvector', 'asymptotic', 'concurrency',
  'polymorphism', 'phosphorylation', 'equilibrium', 'heuristics', 'hypertrophy',
  'inductance', 'homeostasis', 'refactoring', 'orthogonal', 'epistemology',
  'stochastic', 'isomorphism', 'dichotomy', 'phenomenology', 'microservices'
];

export default function FeynmanStudio({ subjects, onSaveCard }) {
  const [concept, setConcept] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'General');
  const [simpleExplanation, setSimpleExplanation] = useState('');
  const [analogy, setAnalogy] = useState('');
  const [detectedJargon, setDetectedJargon] = useState([]);

  const handleExplanationChange = (text) => {
    setSimpleExplanation(text);
    // Scan for jargon terms
    const words = text.toLowerCase().split(/[\s,.;:!?]+/);
    const found = COMMON_JARGON_TERMS.filter(term => words.includes(term));
    setDetectedJargon(found);
  };

  const handleCreateFlashcard = () => {
    if (!concept.trim() || !simpleExplanation.trim()) return;
    soundEngine.playChime();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });

    const question = `Explain "${concept}" in simple terms with an analogy.`;
    const answer = `${simpleExplanation}\n\nAnalogy: ${analogy || '(None provided)'}`;

    if (onSaveCard) {
      onSaveCard({
        question,
        answer,
        deckId: 'deck-1', // Default or first deck
      });
    }

    alert('Successfully saved to your Active Recall Flashcard deck! 📇');
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
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--accent-glow)'
        }}>
          Nobel Prize Learning Framework
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 24px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-main)',
          marginTop: '2px'
        }}>
          The Feynman Technique Studio
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
          "If you can't explain it simply, you don't understand it well enough." — Richard Feynman
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Step 1: Target Concept */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            1. Target Concept or Mechanism
          </label>
          <input
            type="text"
            placeholder="e.g. Neural Network Backpropagation, CAP Theorem, Photosynthesis..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', fontSize: '15px', borderRadius: 'var(--radius-md)' }}
          />
        </div>

        {/* Step 2: Plain Language Explanation */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              2. Explain it to a 12-Year-Old (Zero Jargon Allowed)
            </label>
            <span style={{ fontSize: '11px', color: 'var(--accent-glow)' }}>
              Use simple words & short sentences
            </span>
          </div>

          <textarea
            rows={5}
            placeholder="Imagine you are explaining this to a middle school student who has never studied your subject. Break it down into fundamental steps..."
            value={simpleExplanation}
            onChange={(e) => handleExplanationChange(e.target.value)}
            style={{ width: '100%', padding: '14px', fontSize: '14px', lineHeight: 1.6, borderRadius: 'var(--radius-md)' }}
          />

          {/* Jargon Detector Banner */}
          {detectedJargon.length > 0 && (
            <div style={{
              marginTop: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '12px',
              color: '#fbbf24'
            }}>
              <AlertTriangle size={16} />
              <span>
                <strong>Jargon Detected:</strong> [{detectedJargon.join(', ')}] — Can you replace this with a simpler physical description?
              </span>
            </div>
          )}
        </div>

        {/* Step 3: Real-World Analogy */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            3. The Analogy Forge (Connect to Daily Life)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Backpropagation is like shooting an arrow, seeing where it landed, and slightly adjusting your elbow and angle for the next shot."
            value={analogy}
            onChange={(e) => setAnalogy(e.target.value)}
            style={{ width: '100%', padding: '14px', fontSize: '14px', borderRadius: 'var(--radius-md)' }}
          />
        </div>

        {/* Action: Save to Flashcard */}
        <button
          onClick={handleCreateFlashcard}
          disabled={!concept.trim() || !simpleExplanation.trim()}
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: concept.trim() && simpleExplanation.trim() ? 'var(--accent-ivory)' : 'rgba(255,255,255,0.06)',
            color: concept.trim() && simpleExplanation.trim() ? '#121212' : 'var(--text-subtle)',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: concept.trim() && simpleExplanation.trim() ? '0 4px 18px rgba(245, 239, 230, 0.25)' : 'none',
            cursor: concept.trim() && simpleExplanation.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          <Plus size={16} />
          <span>Convert this Feynman Breakdown into an Active Recall Flashcard</span>
        </button>
      </div>
    </div>
  );
}
