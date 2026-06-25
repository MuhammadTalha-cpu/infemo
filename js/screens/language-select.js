/* ============================================================
   INFEMO — LANGUAGE SELECTION SCREEN
   Shows a grid of available languages.
   Active ones are clickable, coming-soon are greyed out.
   Clicking an active language saves the choice and
   navigates to the dashboard.
   ============================================================ */

var LanguageSelectScreen = {
  /* ── render() ───────────────────────────────────────── */
  render() {
    const el = document.getElementById("screen-language-select");
    if (!el) return;

    // Get the previously selected language (for returning users)
    const savedLang = Storage.get(Storage.KEYS.LANGUAGE);

    el.innerHTML = `
            <div class="lang-select-card">

                <!-- Logo -->
                <div class="lang-select-logo">Infemo</div>

                <!-- Heading -->
                <div class="lang-select-heading">
                    Which language do you want to learn?
                </div>

                <!-- Language Grid -->
                <div class="lang-grid" id="lang-grid">
                    ${this.buildLanguageCards(savedLang)}
                </div>

                <!-- Footer -->
                <div class="lang-select-footer">
                    <i data-lucide="plus-circle"></i>
                    More languages added regularly
                </div>

            </div>
        `;

    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();

    // Attach click listeners
    this.attachListeners();
  },

  /* ── buildLanguageCards(savedLang) ─────────────────────
       Loops over the Languages array and builds one card
       HTML string per language.
    ─────────────────────────────────────────────────────── */
  buildLanguageCards(savedLang) {
    if (!window.Languages || Languages.length === 0) {
      return '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;">Loading languages...</p>';
    }

    return Languages.map((lang) => {
      const isActive = lang.status === "active";
      const isSelected = savedLang === lang.code;

      // Build progress badge for returning users
      // who already studied this language
      const langProgress = AppState.getLanguageProgress(lang.code);
      const hasProgress =
        langProgress &&
        langProgress.levels &&
        langProgress.levels.a1 &&
        langProgress.levels.a1.started;

      let progressBadge = "";
      if (isActive && hasProgress && isSelected) {
        const pct = AppState.getLevelProgress(lang.code, "a1");
        progressBadge = `<span class="lang-card-progress">A1 — ${pct}%</span>`;
      }

      // Coming soon badge
      const soonBadge = !isActive
        ? `<span class="lang-card-soon-badge">Soon</span>`
        : "";

      // Selected highlight class
      const selectedClass = isSelected && isActive ? "lang-card-selected" : "";

      // Card state class
      const stateClass = isActive
        ? `lang-card-active ${selectedClass}`
        : "lang-card-soon";

      return `
                <div
                    class="lang-card ${stateClass}"
                    data-code="${lang.code}"
                    data-active="${isActive}"
                    title="${isActive ? lang.name : lang.name + " — Coming Soon"}"
                >
                    ${soonBadge}
                    <div class="lang-card-flag">${lang.flag}</div>
                    <div class="lang-card-code">${lang.code.toUpperCase()}</div>
                    <div class="lang-card-name">${lang.name}</div>
                    <div class="lang-card-range">${lang.levelRange}</div>
                    ${progressBadge}
                </div>
            `;
    }).join("");
  },

  /* ── attachListeners() ──────────────────────────────── */
  attachListeners() {
    const grid = document.getElementById("lang-grid");
    if (!grid) return;

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".lang-card");
      if (!card) return;

      // Only active cards are clickable
      const isActive = card.dataset.active === "true";
      if (!isActive) return;

      const langCode = card.dataset.code;
      this.selectLanguage(langCode);
    });
  },

  /* ── selectLanguage(code) ───────────────────────────── */
  selectLanguage(code) {
    /* Save selection to storage and state */
    Storage.set(Storage.KEYS.LANGUAGE, code);
    AppState.selectedLanguage = code;

    /* Initialize audio for this language */
    if (window.AudioEngine) AudioEngine.setLanguage(code);

    /* Set up language progress if this is first time */
    AppState.getLanguageProgress(code);

    /* Navigate to dashboard */
    Router.navigate("#dashboard");
  },
};
