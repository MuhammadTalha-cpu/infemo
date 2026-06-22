/* ============================================================
   INFEMO — APP STATE
   The single source of truth for all runtime data.
   Every screen reads from and writes to this object.

   IMPORTANT: This is in-memory only — it resets on refresh.
   Persistent data (user settings, progress) is saved via
   Storage (localStorage) and Firebase (Firestore).
   AppState just holds the CURRENT SESSION's working data.
   ============================================================ */

const AppState = {
  /* ── Authentication ─────────────────────────────────── */
  currentUser: null, // Firebase user object (or null if guest)
  isGuest: false, // true when using without an account
  isAuthenticated: false, // true when logged in via Firebase

  /* ── Language & Level ───────────────────────────────── */
  selectedLanguage: null, // 'de', 'fr', 'es' etc.
  currentLevel: "a1", // current level ID being viewed
  currentTopic: null, // current topic ID being studied
  currentLesson: null, // current lesson object being rendered

  /* ── Theme ──────────────────────────────────────────── */
  theme: "light", // 'light' or 'dark'
  fontSize: "normal", // 'normal' or 'large'

  /* ── Audio ──────────────────────────────────────────── */
  speechRate: "normal", // 'slow', 'normal', 'fast'

  /* ── Progress (loaded from Storage/Firestore on init) ── */
  progress: {
    streak: 0,
    lastStudied: null,
    totalStudyTime: 0, // in minutes
    wordsLearned: 0,
    lessonsCompleted: 0,
    achievements: [],

    // Per-language progress — keyed by language code
    // e.g. progress.languages.de.levels.a1.completed = true
    languages: {},
  },

  /* ── Session Tracking ───────────────────────────────── */
  sessionStartTime: null, // when the user arrived at current screen
  todayStudyMinutes: 0, // accumulated study time today

  /* ── Exam State ─────────────────────────────────────── */
  activeExam: {
    langCode: null,
    levelId: null,
    currentSection: 0,
    scores: [],
    startTime: null,
  },

  /* ── Flashcard Session ──────────────────────────────── */
  flashcardSession: {
    deck: [],
    currentIndex: 0,
    correct: 0,
    total: 0,
  },

  /* ════════════════════════════════════════════════════
       METHODS
       ════════════════════════════════════════════════════ */

  /* ── setState(updates) ──────────────────────────────────
       Merge an object of updates into AppState.
       Example: AppState.setState({ selectedLanguage: 'de' })
    ─────────────────────────────────────────────────────── */
  setState(updates) {
    Object.assign(this, updates);
  },

  /* ── setUser(firebaseUser) ──────────────────────────────
       Called after Firebase login.
       Populates currentUser and clears guest mode.
    ─────────────────────────────────────────────────────── */
  setUser(firebaseUser) {
    this.currentUser = firebaseUser;
    this.isGuest = false;
    this.isAuthenticated = true;
  },

  /* ── setGuest() ─────────────────────────────────────────
       Called when user chooses "Continue without Account".
    ─────────────────────────────────────────────────────── */
  setGuest() {
    this.currentUser = null;
    this.isGuest = true;
    this.isAuthenticated = false;
  },

  /* ── clearUser() ────────────────────────────────────────
       Called on sign out or account deletion.
    ─────────────────────────────────────────────────────── */
  clearUser() {
    this.currentUser = null;
    this.isGuest = false;
    this.isAuthenticated = false;
    this.selectedLanguage = null;
    this.progress = {
      streak: 0,
      lastStudied: null,
      totalStudyTime: 0,
      wordsLearned: 0,
      lessonsCompleted: 0,
      achievements: [],
      languages: {},
    };
  },

  /* ── getUserName() ──────────────────────────────────────
       Returns the display name to show in the UI.
       Priority: Firebase displayName → email prefix → 'Guest'
    ─────────────────────────────────────────────────────── */
  getUserName() {
    if (this.isGuest) return "Guest";
    if (!this.currentUser) return "Guest";
    if (this.currentUser.displayName) return this.currentUser.displayName;
    if (this.currentUser.email) {
      return this.currentUser.email.split("@")[0];
    }
    return "Learner";
  },

  /* ── getUserInitials() ──────────────────────────────────
       Returns 1-2 letter initials for the avatar circle.
       Example: "Muhammad Talha" → "MT"
                "buddy@gmail.com" → "B"
                Guest → "G"
    ─────────────────────────────────────────────────────── */
  getUserInitials() {
    const name = this.getUserName();
    if (name === "Guest") return "G";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  },

  /* ── getLanguageProgress(langCode) ─────────────────────
       Returns the progress object for a specific language.
       Creates a default object if none exists yet.
    ─────────────────────────────────────────────────────── */
  getLanguageProgress(langCode) {
    if (!this.progress.languages[langCode]) {
      this.progress.languages[langCode] = {
        currentLevel: "a1",
        levels: {
          a1: { unlocked: true, started: false, completed: false, topics: {} },
          a2: { unlocked: false, started: false, completed: false, topics: {} },
          b1: { unlocked: false, started: false, completed: false, topics: {} },
          b2: { unlocked: false, started: false, completed: false, topics: {} },
          c1: { unlocked: false, started: false, completed: false, topics: {} },
          c2: { unlocked: false, started: false, completed: false, topics: {} },
        },
        vocabulary: [],
        flashcards: [],
        journal: [],
        storiesRead: [],
      };
    }
    return this.progress.languages[langCode];
  },

  /* ── getLevelProgress(langCode, levelId) ────────────────
       Returns progress % (0-100) for a specific level.
    ─────────────────────────────────────────────────────── */
  getLevelProgress(langCode, levelId) {
    const lang = this.getLanguageProgress(langCode);
    const level = lang.levels[levelId];
    if (!level || !level.topics) return 0;
    const topicIds = Object.keys(level.topics);
    if (topicIds.length === 0) return 0;
    const completed = topicIds.filter(
      (id) => level.topics[id].completed,
    ).length;
    return Math.round((completed / topicIds.length) * 100);
  },

  /* ── isLevelUnlocked(langCode, levelId) ─────────────────
       Returns true if the level is available to study.
    ─────────────────────────────────────────────────────── */
  isLevelUnlocked(langCode, levelId) {
    const lang = this.getLanguageProgress(langCode);
    return lang.levels[levelId]?.unlocked === true;
  },

  /* ── startSessionTimer() ────────────────────────────────
       Called when user arrives at a screen.
       Records the start time so we can measure time spent.
    ─────────────────────────────────────────────────────── */
  startSessionTimer() {
    this.sessionStartTime = Date.now();
  },

  /* ── stopSessionTimer() ─────────────────────────────────
       Called when user leaves a screen.
       Adds elapsed minutes to todayStudyMinutes.
    ─────────────────────────────────────────────────────── */
  stopSessionTimer() {
    if (!this.sessionStartTime) return;
    const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 60000);
    if (elapsed > 0) {
      this.todayStudyMinutes += elapsed;
    }
    this.sessionStartTime = null;
  },
};
