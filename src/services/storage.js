// LocalStorage Service - Zero Latency, Local-First Persistence

const STORAGE_KEYS = {
  SESSIONS: 'studyo_sessions_v1',
  SUBJECTS: 'studyo_subjects_v1',
  BLURTS: 'studyo_blurts_v1',
  DECKS: 'studyo_decks_v1',
  CARDS: 'studyo_cards_v1',
  SETTINGS: 'studyo_settings_v1',
  ONBOARDED: 'studyo_onboarded_v1',
  QUEST: 'studyo_daily_quest_v1',
};

const DEFAULT_SUBJECTS = [
  { id: 'sub-1', name: 'Software Architecture', color: '#8b5cf6' },
  { id: 'sub-2', name: 'Deep Learning', color: '#06b6d4' },
  { id: 'sub-3', name: 'Mathematics & Algorithms', color: '#10b981' },
  { id: 'sub-4', name: 'UI / UX Aesthetics', color: '#f59e0b' },
];

const DEFAULT_DECKS = [
  { id: 'deck-1', name: 'System Design Patterns', subject: 'Software Architecture' },
  { id: 'deck-2', name: 'Calculus & Linear Algebra', subject: 'Mathematics & Algorithms' },
];

const DEFAULT_CARDS = [
  {
    id: 'c-1',
    deckId: 'deck-1',
    question: 'What is the difference between Latency and Throughput?',
    answer: 'Latency is the time taken to complete a single operation (e.g., round trip ms). Throughput is the number of operations processed in a given time unit (e.g., requests per second).',
    interval: 1,
    reps: 0,
    ease: 2.5,
    dueDate: new Date().toISOString(),
  },
  {
    id: 'c-2',
    deckId: 'deck-1',
    question: 'Explain the CAP Theorem and its real-world implication.',
    answer: 'A distributed data store can guarantee at most 2 out of 3: Consistency, Availability, and Partition Tolerance. Since network partitions are inevitable in real networks, systems must choose between CP and AP.',
    interval: 1,
    reps: 0,
    ease: 2.5,
    dueDate: new Date().toISOString(),
  },
  {
    id: 'c-3',
    deckId: 'deck-2',
    question: 'What does the Determinant of a square matrix geometrically represent?',
    answer: 'The scaling factor of the transformation on volume (or area in 2D). If the determinant is 0, the transformation squashes space into a lower dimension and the matrix is non-invertible.',
    interval: 1,
    reps: 0,
    ease: 2.5,
    dueDate: new Date().toISOString(),
  },
];

// Helper to seed sample study sessions for a rich initial heatmap
function generateSampleSessions() {
  const sessions = [];
  const now = new Date();
  
  // Seed past 35 days with varied sessions so the heatmap looks alive immediately
  for (let i = 35; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    
    // Random probability of studying on this day
    if (Math.random() > 0.28) {
      const sessionCount = Math.floor(Math.random() * 3) + 1;
      for (let s = 0; s < sessionCount; s++) {
        const durationMins = Math.floor(Math.random() * 45) + 20;
        sessions.push({
          id: `seed-${i}-${s}`,
          subject: DEFAULT_SUBJECTS[Math.floor(Math.random() * DEFAULT_SUBJECTS.length)].name,
          durationSeconds: durationMins * 60,
          timestamp: day.toISOString(),
          mode: 'flowmodoro',
          completed: true,
        });
      }
    }
  }
  return sessions;
}

export const Storage = {
  getSessions() {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      const seeded = generateSampleSessions();
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(seeded));
      return seeded;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveSession(session) {
    const sessions = this.getSessions();
    sessions.unshift({
      ...session,
      id: session.id || `sess_${Date.now()}`,
      timestamp: session.timestamp || new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    return sessions;
  },

  getSubjects() {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
      return DEFAULT_SUBJECTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SUBJECTS;
    }
  },

  getBlurts() {
    const raw = localStorage.getItem(STORAGE_KEYS.BLURTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveBlurt(blurt) {
    const blurts = this.getBlurts();
    const existingIdx = blurts.findIndex(b => b.id === blurt.id);
    if (existingIdx >= 0) {
      blurts[existingIdx] = blurt;
    } else {
      blurts.unshift({
        ...blurt,
        id: blurt.id || `blurt_${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.BLURTS, JSON.stringify(blurts));
    return blurts;
  },

  getDecks() {
    const raw = localStorage.getItem(STORAGE_KEYS.DECKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(DEFAULT_DECKS));
      return DEFAULT_DECKS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_DECKS;
    }
  },

  getCards() {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(DEFAULT_CARDS));
      return DEFAULT_CARDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CARDS;
    }
  },

  saveCard(card) {
    const cards = this.getCards();
    const idx = cards.findIndex(c => c.id === card.id);
    if (idx >= 0) {
      cards[idx] = card;
    } else {
      cards.push({
        ...card,
        id: card.id || `card_${Date.now()}`,
        interval: 1,
        reps: 0,
        ease: 2.5,
        dueDate: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    return cards;
  },

  getSettings() {
    const defaultSettings = {
      flightMode: 'aurora',
      pomodoroMinutes: 25,
      shortBreakMinutes: 5,
      soundVolumes: {
        rain: 0,
        brownNoise: 0.35,
        binaural: 0.2,
        crackle: 0,
        master: 0.7,
      },
    };
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  hasOnboarded() {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  },

  setOnboarded(val = true) {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, val ? 'true' : 'false');
  },

  getDailyQuest() {
    const raw = localStorage.getItem(STORAGE_KEYS.QUEST);
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultQuest = {
      date: todayStr,
      title: "Master Chapter 4 & Distributed Consensus",
      subtasks: [
        { id: 1, text: "Active recall flashcards (15 mins)", completed: false },
        { id: 2, text: "High-intensity focus sprint (50 mins)", completed: false },
        { id: 3, text: "Feynman technique explanation breakdown", completed: false },
      ],
    };

    if (!raw) return defaultQuest;
    try {
      const parsed = JSON.parse(raw);
      // Reset if from a previous date
      if (parsed.date !== todayStr) {
        return {
          ...parsed,
          date: todayStr,
          subtasks: parsed.subtasks.map(s => ({ ...s, completed: false }))
        };
      }
      return parsed;
    } catch {
      return defaultQuest;
    }
  },

  saveDailyQuest(quest) {
    localStorage.setItem(STORAGE_KEYS.QUEST, JSON.stringify(quest));
    return quest;
  },
};
