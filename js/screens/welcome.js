/* ============================================================
   INFEMO — WELCOME SCREEN
   Shown to all users on every visit before language select.
   Features a time-aware greeting and typewriter quotes.
   ============================================================ */

var WelcomeScreen = {
  /* ── render() ───────────────────────────────────────── */
  render() {
    const el = document.getElementById("screen-welcome");
    if (!el) return;

    // Get user's name for greeting
    const name = AppState.getUserName();
    const greeting = DateUtils.getFullGreeting(name);

    el.innerHTML = `
            <div class="welcome-card">

                <!-- Logo -->
                <div class="welcome-logo">Infemo</div>

                <!-- Greeting -->
                <div class="welcome-greeting">${greeting}</div>
                <div class="welcome-subtext">
                    Continue your journey. Every word opens a door.
                </div>

                <!-- Typewriter Quote Box -->
                <div class="welcome-quote-box">
                    <div class="welcome-quote-text" id="welcome-quote-text">
                        <span id="welcome-typewriter"></span><span
                            class="typewriter-cursor"
                            id="welcome-cursor"
                        ></span>
                    </div>
                    <div class="welcome-quote-author" id="welcome-quote-author">
                    </div>
                </div>

                <!-- Let's Go Button -->
                <button class="btn btn-primary welcome-btn" id="welcome-go-btn">
                    <i data-lucide="arrow-right"></i>
                    Let's Go
                </button>

            </div>
        `;

    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();

    // Start typewriter animation
    this.startTypewriter();

    // Attach button listener
    this.attachListeners();
  },

  /* ── startTypewriter() ──────────────────────────────── */
  startTypewriter() {
    const typewriterEl = document.getElementById("welcome-typewriter");
    const cursorEl = document.getElementById("welcome-cursor");
    const authorEl = document.getElementById("welcome-quote-author");

    if (!typewriterEl || !window.Quotes || Quotes.length === 0) return;

    // Enhanced typewriter that also shows the author
    // We wrap the base Typewriter utility with author display logic
    this._runWithAuthor(typewriterEl, cursorEl, authorEl, Quotes);
  },

  /* ── _runWithAuthor() ───────────────────────────────── */
  /* Extended version of Typewriter.run() that also
       fades in the author name after typing completes      */
  _runWithAuthor(textEl, cursorEl, authorEl, quotes) {
    if (!textEl || !quotes || quotes.length === 0) return;

    // Stop any previous instance
    Typewriter.stop();

    let currentIndex = Math.floor(Math.random() * quotes.length);
    let charIndex = 0;
    let timer = null;
    let running = true;

    // Store stop function so render() cleanup can call it
    this._stopFn = () => {
      running = false;
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
      }
    };

    const typeNext = () => {
      if (!running) return;

      const quote = quotes[currentIndex];
      const fullText = `"${quote.text}"`;
      charIndex = 0;

      // Reset visibility
      textEl.style.opacity = "1";
      textEl.style.transition = "none";
      textEl.textContent = "";

      // Hide author while typing
      if (authorEl) {
        authorEl.textContent = "";
        authorEl.classList.remove("visible");
      }

      // Show cursor
      if (cursorEl) cursorEl.style.display = "inline-block";

      // Type character by character
      timer = setInterval(() => {
        if (!running) {
          clearInterval(timer);
          return;
        }

        charIndex++;
        textEl.textContent = fullText.slice(0, charIndex);

        // Finished typing
        if (charIndex >= fullText.length) {
          clearInterval(timer);

          // Show author line
          if (authorEl) {
            authorEl.textContent = `— ${quote.author}`;
            // Small delay then fade in
            timer = setTimeout(() => {
              if (!running) return;
              authorEl.classList.add("visible");
            }, 200);
          }

          // Pause so reader can absorb the quote
          timer = setTimeout(() => {
            if (!running) return;

            // Fade out text and author together
            textEl.style.transition = "opacity 0.5s ease";
            textEl.style.opacity = "0";
            if (authorEl) {
              authorEl.style.transition = "opacity 0.5s ease";
              authorEl.style.opacity = "0";
            }

            // After fade, move to next quote
            timer = setTimeout(() => {
              if (!running) return;

              // Reset author opacity for next round
              if (authorEl) {
                authorEl.style.transition = "none";
                authorEl.style.opacity = "1";
                authorEl.classList.remove("visible");
              }

              // Advance to next quote
              currentIndex = (currentIndex + 1) % quotes.length;

              // Brief pause then start next quote
              timer = setTimeout(() => {
                if (!running) return;
                typeNext();
              }, 300);
            }, 550);
          }, 3200);
        }
      }, 42);
    };

    // Start immediately
    typeNext();
  },

  /* ── attachListeners() ──────────────────────────────── */
  attachListeners() {
    const goBtn = document.getElementById("welcome-go-btn");
    if (goBtn) {
      goBtn.addEventListener("click", () => {
        this.goToLanguageSelect();
      });
    }
  },

  /* ── goToLanguageSelect() ───────────────────────────── */
  goToLanguageSelect() {
    // Stop the typewriter animation cleanly
    if (typeof this._stopFn === "function") {
      this._stopFn();
    }

    // Navigate to language selection
    Router.navigate("#language-select");
  },
};
