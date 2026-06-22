/* ============================================================
   INFEMO — DATE UTILITY
   Time-aware greetings, streak logic, and date formatting.
   ============================================================ */

var DateUtils = {
  /* ── getGreeting() ──────────────────────────────────────
       Returns a time-aware greeting string.
       Morning:   5am  – 11:59am
       Afternoon: 12pm – 4:59pm
       Evening:   5pm  – 8:59pm
       Night:     9pm  – 4:59am
    ─────────────────────────────────────────────────────── */
  getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  },

  /* ── getFullGreeting(name) ──────────────────────────────
       Returns a complete greeting with the user's name.
       Example: "Good morning, Buddy — keep going!"
    ─────────────────────────────────────────────────────── */
  getFullGreeting(name) {
    const base = this.getGreeting();
    if (!name || name === "Guest") {
      return `${base} — keep going!`;
    }
    return `${base}, ${name} — keep going!`;
  },

  /* ── formatDate(date) ───────────────────────────────────
       Returns a clean readable date string.
       Example: "Monday, 22 June 2026"
    ─────────────────────────────────────────────────────── */
  formatDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  },

  /* ── formatDateShort(date) ──────────────────────────────
       Returns a short date string.
       Example: "22 Jun 2026"
    ─────────────────────────────────────────────────────── */
  formatDateShort(date = new Date()) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  },

  /* ── formatJournalDate(date) ────────────────────────────
       Returns a journal-style date header.
       Example: "Monday, 22 June"
    ─────────────────────────────────────────────────────── */
  formatJournalDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(date));
  },

  /* ── getTodayKey() ──────────────────────────────────────
       Returns today's date as a storage key string.
       Example: "2026-06-22"
       Used to track daily streaks and study minutes.
    ─────────────────────────────────────────────────────── */
  getTodayKey() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },

  /* ── getYesterdayKey() ──────────────────────────────────
       Returns yesterday's date as a storage key string.
       Example: "2026-06-21"
       Used to check if a streak should continue or reset.
    ─────────────────────────────────────────────────────── */
  getYesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },

  /* ── isToday(dateString) ────────────────────────────────
       Returns true if a date string matches today.
       Example: DateUtils.isToday('2026-06-22') → true
    ─────────────────────────────────────────────────────── */
  isToday(dateString) {
    return dateString === this.getTodayKey();
  },

  /* ── isYesterday(dateString) ────────────────────────────
       Returns true if a date string matches yesterday.
    ─────────────────────────────────────────────────────── */
  isYesterday(dateString) {
    return dateString === this.getYesterdayKey();
  },

  /* ── getDaysSince(dateString) ───────────────────────────
       Returns number of days between a date and today.
       Example: getDaysSince('2026-06-15') → 7
    ─────────────────────────────────────────────────────── */
  getDaysSince(dateString) {
    if (!dateString) return 0;
    const past = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    past.setHours(0, 0, 0, 0);
    const diffMs = today - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  },

  /* ── getDaysUntil(dateString) ───────────────────────────
       Returns number of days from today until a future date.
       Used for exam countdown.
       Example: getDaysUntil('2026-08-15') → 54
    ─────────────────────────────────────────────────────── */
  getDaysUntil(dateString) {
    if (!dateString) return null;
    const future = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    future.setHours(0, 0, 0, 0);
    const diffMs = future - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  },

  /* ── updateStreak() ─────────────────────────────────────
       Checks and updates the study streak.
       Call this once per day when the user studies.

       Logic:
       • If studied today already → streak stays the same
       • If studied yesterday → streak + 1
       • If last study was 2+ days ago → streak resets to 1
       • Returns the new streak count.
    ─────────────────────────────────────────────────────── */
  updateStreak() {
    const todayKey = this.getTodayKey();
    const yesterdayKey = this.getYesterdayKey();
    const lastStudied = Storage.get("last_studied_date");
    let streak = Storage.get("streak_count", 0);

    if (lastStudied === todayKey) {
      // Already studied today — no change
      return streak;
    }

    if (lastStudied === yesterdayKey) {
      // Studied yesterday — continue streak
      streak = streak + 1;
    } else {
      // Gap of 1+ days — reset streak
      streak = 1;
    }

    // Save updated values
    Storage.set("last_studied_date", todayKey);
    Storage.set("streak_count", streak);
    AppState.progress.streak = streak;

    return streak;
  },

  /* ── getStreak() ────────────────────────────────────────
       Returns the current streak count from storage.
    ─────────────────────────────────────────────────────── */
  getStreak() {
    return Storage.get("streak_count", 0);
  },

  /* ── formatStudyTime(minutes) ───────────────────────────
       Converts a minute count to a readable string.
       Example: 5   → "5m"
                65  → "1h 5m"
                120 → "2h"
    ─────────────────────────────────────────────────────── */
  formatStudyTime(minutes) {
    if (!minutes || minutes < 1) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  },

  /* ── getMonthGrid(monthsBack) ───────────────────────────
       Returns an array of date key strings for a calendar
       heatmap grid covering the last N months.
       Used by the My Progress activity calendar.
    ─────────────────────────────────────────────────────── */
  getMonthGrid(monthsBack = 3) {
    const days = [];
    const today = new Date();
    const start = new Date(today);
    start.setMonth(start.getMonth() - monthsBack);
    start.setDate(1);

    const current = new Date(start);
    while (current <= today) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, "0");
      const dd = String(current.getDate()).padStart(2, "0");
      days.push(`${yyyy}-${mm}-${dd}`);
      current.setDate(current.getDate() + 1);
    }

    return days;
  },
};
