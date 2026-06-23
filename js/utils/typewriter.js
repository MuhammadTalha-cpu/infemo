/* ============================================================
   INFEMO — TYPEWRITER UTILITY
   Types quotes character by character on the Welcome screen.
   Each quote appears letter by letter, pauses, then fades
   out before the next one begins.

   Usage:
     Typewriter.run(textElement, cursorElement, quotesArray)
     Typewriter.stop()
   ============================================================ */

var Typewriter = {
  /* ── Internal State ─────────────────────────────────── */
  _timer: null, // holds the setInterval/setTimeout reference
  _isRunning: false, // prevents multiple instances running at once
  _currentIndex: 0, // which quote we're currently on
  _charIndex: 0, // how many characters have been typed so far

  /* ── Configuration ──────────────────────────────────── */
  TYPING_SPEED: 42, // milliseconds per character (lower = faster)
  PAUSE_DURATION: 3200, // milliseconds to show full quote before erasing
  FADE_DURATION: 500, // milliseconds for fade-out transition

  /* ── run(textEl, cursorEl, quotes) ─────────────────────
       Starts the typewriter animation loop.

       textEl    — the element where quote text appears
       cursorEl  — the blinking cursor element
       quotes    — array of { text, author, origin } objects
    ─────────────────────────────────────────────────────── */
  run(textEl, cursorEl, quotes) {
    // Don't start if already running or no elements
    if (!textEl || !quotes || quotes.length === 0) return;

    // Stop any previous instance cleanly
    this.stop();

    this._isRunning = true;
    this._currentIndex = Math.floor(Math.random() * quotes.length);
    this._charIndex = 0;

    // Start typing the first quote
    this._typeQuote(textEl, cursorEl, quotes);
  },

  /* ── stop() ─────────────────────────────────────────────
       Stops the animation completely and cleans up.
       Call this when navigating away from the Welcome screen.
    ─────────────────────────────────────────────────────── */
  stop() {
    this._isRunning = false;
    if (this._timer) {
      clearTimeout(this._timer);
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  /* ── _typeQuote() ───────────────────────────────────────
       Internal — types one quote character by character.
    ─────────────────────────────────────────────────────── */
  _typeQuote(textEl, cursorEl, quotes) {
    if (!this._isRunning) return;

    const quote = quotes[this._currentIndex];
    const fullText = `"${quote.text}"`;
    this._charIndex = 0;

    // Make sure text element is fully visible
    textEl.style.opacity = "1";
    textEl.style.transition = "none";

    // Show cursor while typing
    if (cursorEl) cursorEl.style.display = "inline-block";

    // Type one character at a time
    this._timer = setInterval(() => {
      if (!this._isRunning) {
        clearInterval(this._timer);
        return;
      }

      // Add next character
      this._charIndex++;
      textEl.textContent = fullText.slice(0, this._charIndex);

      // Finished typing the full quote
      if (this._charIndex >= fullText.length) {
        clearInterval(this._timer);

        // Pause so the user can read the full quote
        this._timer = setTimeout(() => {
          if (!this._isRunning) return;

          // Fade out
          textEl.style.transition = `opacity ${this.FADE_DURATION}ms ease`;
          textEl.style.opacity = "0";

          // After fade completes, move to next quote
          this._timer = setTimeout(() => {
            if (!this._isRunning) return;

            // Advance to next quote (loop back to start)
            this._currentIndex = (this._currentIndex + 1) % quotes.length;

            // Small pause between quotes
            this._timer = setTimeout(() => {
              if (!this._isRunning) return;
              this._typeQuote(textEl, cursorEl, quotes);
            }, 300);
          }, this.FADE_DURATION);
        }, this.PAUSE_DURATION);
      }
    }, this.TYPING_SPEED);
  },
};
