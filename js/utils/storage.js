/* ============================================================
   INFEMO — STORAGE UTILITY
   Clean wrapper around localStorage.
   Handles JSON automatically so you never need to
   manually call JSON.parse() or JSON.stringify().

   Usage:
     Storage.set('infemo_theme', 'dark')
     Storage.get('infemo_theme')          → 'dark'
     Storage.set('infemo_progress', { streak: 7 })
     Storage.get('infemo_progress')       → { streak: 7 }
     Storage.remove('infemo_theme')
     Storage.clear()
   ============================================================ */

const Storage = {
  /* ── KEY PREFIX ─────────────────────────────────────────
       All keys are prefixed with 'infemo_' automatically.
       This prevents conflicts with other apps on the same
       domain and makes it easy to find all Infemo data
       in DevTools → Application → localStorage.
    ─────────────────────────────────────────────────────── */
  PREFIX: "infemo_",

  /* ── _key(key) ──────────────────────────────────────────
       Internal helper. Adds the prefix to a key.
       Storage.get('theme') reads key 'infemo_theme'.
    ─────────────────────────────────────────────────────── */
  _key(key) {
    // If key already has prefix, don't double-prefix it
    if (key.startsWith(this.PREFIX)) return key;
    return this.PREFIX + key;
  },

  /* ── set(key, value) ────────────────────────────────────
       Save any value to localStorage.
       Strings, numbers, booleans, objects, arrays —
       all serialized to JSON automatically.

       Returns true on success, false on failure.
       (Can fail if localStorage is full or blocked)
    ─────────────────────────────────────────────────────── */
  set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Storage.set failed for key "${key}":`, error);
      return false;
    }
  },

  /* ── get(key, defaultValue) ─────────────────────────────
       Read a value from localStorage.
       Automatically parses JSON back to original type.

       If the key doesn't exist or the value is corrupt,
       returns defaultValue (defaults to null).
    ─────────────────────────────────────────────────────── */
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this._key(key));
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`Storage.get failed for key "${key}":`, error);
      return defaultValue;
    }
  },

  /* ── remove(key) ────────────────────────────────────────
       Delete a single key from localStorage.
    ─────────────────────────────────────────────────────── */
  remove(key) {
    try {
      localStorage.removeItem(this._key(key));
      return true;
    } catch (error) {
      console.warn(`Storage.remove failed for key "${key}":`, error);
      return false;
    }
  },

  /* ── has(key) ───────────────────────────────────────────
       Check if a key exists in localStorage.
       Returns true or false.
    ─────────────────────────────────────────────────────── */
  has(key) {
    return localStorage.getItem(this._key(key)) !== null;
  },

  /* ── clear() ────────────────────────────────────────────
       Delete ALL infemo_ keys from localStorage.
       Used on sign out and account deletion.
       Does NOT touch keys from other apps.
    ─────────────────────────────────────────────────────── */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.warn("Storage.clear failed:", error);
      return false;
    }
  },

  /* ── clearGuest() ───────────────────────────────────────
       Delete only guest progress data.
       Used when a guest chooses "Start Fresh" before
       creating an account.
    ─────────────────────────────────────────────────────── */
  clearGuest() {
    this.remove("guest_progress");
    this.remove("guest_vocab");
    this.remove("guest_journal");
    this.remove("guest_flashcards");
    this.remove("guest_streak");
  },

  /* ── getGuestProgress() ─────────────────────────────────
       Convenience method — reads all guest progress at once.
       Returns a structured object with all guest data.
    ─────────────────────────────────────────────────────── */
  getGuestProgress() {
    return {
      progress: this.get("guest_progress", {}),
      vocab: this.get("guest_vocab", []),
      journal: this.get("guest_journal", []),
      flashcards: this.get("guest_flashcards", []),
      streak: this.get("guest_streak", { count: 0, lastDate: null }),
    };
  },

  /* ── saveGuestProgress(data) ────────────────────────────
       Convenience method — saves all guest progress at once.
    ─────────────────────────────────────────────────────── */
  saveGuestProgress(data) {
    if (data.progress) this.set("guest_progress", data.progress);
    if (data.vocab) this.set("guest_vocab", data.vocab);
    if (data.journal) this.set("guest_journal", data.journal);
    if (data.flashcards) this.set("guest_flashcards", data.flashcards);
    if (data.streak) this.set("guest_streak", data.streak);
  },

  /* ── All Known Infemo Keys ──────────────────────────────
       Reference list of every key the app uses.
       Stored here so we have one place to look them up.
    ─────────────────────────────────────────────────────── */
  KEYS: {
    VISITED: "visited", // → 'infemo_visited'
    MODE: "mode", // → 'infemo_mode'
    THEME: "theme", // → 'infemo_theme'
    FONT_SIZE: "font_size", // → 'infemo_font_size'
    LANGUAGE: "language", // → 'infemo_language'
    SPEECH_RATE: "speech_rate", // → 'infemo_speech_rate'
    DAILY_GOAL: "daily_goal", // → 'infemo_daily_goal'
    EXAM_DATE: "exam_date", // → 'infemo_exam_date'
    GUEST_PROGRESS: "guest_progress", // → 'infemo_guest_progress'
    GUEST_VOCAB: "guest_vocab", // → 'infemo_guest_vocab'
    GUEST_JOURNAL: "guest_journal", // → 'infemo_guest_journal'
  },
};
