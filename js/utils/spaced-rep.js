/* ============================================================
   INFEMO — SPACED REPETITION SYSTEM (SRS)
   Simplified SM-2 algorithm.

   Rating scale (shown to user as buttons):
   0 = Don't Know   → show again in this session
   1 = Almost       → review in 1 day
   2 = Know It      → review in 3 days
   3 = Mastered     → review in 7 days
   ============================================================ */

var SpacedRep = {
  /* Days until next review for each rating */
  INTERVALS: [0, 1, 3, 7],

  /* Label for each mastery stage */
  MASTERY_LABELS: ["New", "Learning", "Review", "Mastered"],

  /* Color variable for each mastery stage */
  MASTERY_COLORS: [
    "var(--text-muted)",
    "var(--warning)",
    "var(--primary)",
    "var(--success)",
  ],

  /* ── getNextReviewDate(rating) ──────────────────────────
       Returns a date string (YYYY-MM-DD) for when to
       show the card next.
       Returns null for rating 0 (show again in session).
    ─────────────────────────────────────────────────────── */
  getNextReviewDate(rating) {
    var days = this.INTERVALS[rating] || 0;
    if (days === 0) return null;

    var date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split("T")[0];
  },

  /* ── updateCard(card, rating) ───────────────────────────
       Returns updated card object with new SRS values.
       Does not mutate the original.
    ─────────────────────────────────────────────────────── */
  updateCard(card, rating) {
    return {
      mastery: Math.min(3, Math.max(0, rating)),
      timesReviewed: (card.timesReviewed || 0) + 1,
      lastReviewed: window.DateUtils ? DateUtils.getTodayKey() : null,
      nextReview: this.getNextReviewDate(rating),
    };
  },

  /* ── isDue(srsData) ─────────────────────────────────────
       Returns true if a card should be shown today.
       srsData is the stored SRS object for one word.
    ─────────────────────────────────────────────────────── */
  isDue(srsData) {
    if (!srsData) return true; // New card
    if (!srsData.nextReview) return true; // Don't Know (show again)
    var today = window.DateUtils ? DateUtils.getTodayKey() : "";
    return srsData.nextReview <= today;
  },

  /* ── getDueCards(words, srsStore) ───────────────────────
       Filters a word list to only due cards.
       words:    array of vocabulary objects
       srsStore: object keyed by word id → { mastery, nextReview, ... }
    ─────────────────────────────────────────────────────── */
  getDueCards(words, srsStore) {
    var self = this;
    return words.filter(function (w) {
      return self.isDue(srsStore[w.id]);
    });
  },

  /* ── getStats(words, srsStore) ──────────────────────────
       Returns a summary of mastery across a word list.
    ─────────────────────────────────────────────────────── */
  getStats(words, srsStore) {
    var counts = { new: 0, learning: 0, review: 0, mastered: 0, due: 0 };
    var self = this;

    words.forEach(function (w) {
      var srs = srsStore[w.id];
      if (!srs) {
        counts.new++;
      } else {
        var stage = srs.mastery || 0;
        if (stage === 0) counts.new++;
        else if (stage === 1) counts.learning++;
        else if (stage === 2) counts.review++;
        else if (stage === 3) counts.mastered++;
      }
      if (self.isDue(srs)) counts.due++;
    });

    return counts;
  },

  /* ── getMasteryLabel(mastery) ───────────────────────────
       Returns the display label for a mastery level.
    ─────────────────────────────────────────────────────── */
  getMasteryLabel(mastery) {
    return this.MASTERY_LABELS[mastery] || "New";
  },

  /* ── getMasteryColor(mastery) ───────────────────────────
       Returns the CSS variable for the mastery color.
    ─────────────────────────────────────────────────────── */
  getMasteryColor(mastery) {
    return this.MASTERY_COLORS[mastery] || this.MASTERY_COLORS[0];
  },
};
