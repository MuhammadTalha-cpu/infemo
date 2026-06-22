/* ============================================================
   INFEMO — ROUTER
   Hash-based navigation system.
   Reads the URL hash, shows the correct screen,
   hides all others, and calls the screen's render function.
   ============================================================ */

const Router = {
  /* ── Route Map ─────────────────────────────────────────
       Every hash maps to a screen div ID and the name of
       the JS object that has a render() function for it.
    ───────────────────────────────────────────────────────── */
  routes: {
    "#auth": { screenId: "screen-auth", renderer: "AuthScreen" },
    "#welcome": { screenId: "screen-welcome", renderer: "WelcomeScreen" },
    "#language-select": {
      screenId: "screen-language-select",
      renderer: "LanguageSelectScreen",
    },
    "#dashboard": { screenId: "screen-dashboard", renderer: "DashboardScreen" },
    "#phonetics": { screenId: "screen-phonetics", renderer: "PhoneticsScreen" },
    "#levels": { screenId: "screen-levels", renderer: "LevelsScreen" },
    "#lesson": { screenId: "screen-lesson", renderer: "LessonScreen" },
    "#exam": { screenId: "screen-exam", renderer: "ExamScreen" },
    "#flashcards": {
      screenId: "screen-flashcards",
      renderer: "FlashcardsScreen",
    },
    "#vocabulary": {
      screenId: "screen-vocabulary",
      renderer: "VocabularyScreen",
    },
    "#grammar": { screenId: "screen-grammar", renderer: "GrammarScreen" },
    "#stories": { screenId: "screen-stories", renderer: "StoriesScreen" },
    "#journal": { screenId: "screen-journal", renderer: "JournalScreen" },
    "#progress": { screenId: "screen-progress", renderer: "ProgressScreen" },
    "#settings": { screenId: "screen-settings", renderer: "SettingsScreen" },
  },

  /* ── init() ────────────────────────────────────────────
       Call this once on app start.
       Sets up the hashchange listener and handles the
       current URL hash immediately.
    ───────────────────────────────────────────────────────── */
  init() {
    window.addEventListener("hashchange", () => this.handle());
    this.handle();
  },

  /* ── navigate(hash) ────────────────────────────────────
       Call this from anywhere in the app to change screen.
       Example: Router.navigate('#dashboard')
       Example: Router.navigate('#level-a1')
    ───────────────────────────────────────────────────────── */
  navigate(hash) {
    if (window.location.hash === hash) {
      // Same hash won't fire hashchange — force a re-render
      this.handle();
    } else {
      window.location.hash = hash;
    }
  },

  /* ── handle() ──────────────────────────────────────────
       The core function. Runs every time the hash changes.
       1. Read the hash
       2. Handle special sub-routes (e.g. #level-a1)
       3. Find the matching route
       4. Hide all screens
       5. Show the matched screen
       6. Call its render function (if it exists yet)
       7. Re-init Lucide icons
       8. Update sidebar active state
       9. Scroll to top
    ───────────────────────────────────────────────────────── */
  handle() {
    // Read the current hash — default to #auth if none
    let hash = window.location.hash || "#auth";

    /* ── Handle Level Sub-routes ────────────────────────
           #level-a1, #level-a2, #level-b1 etc.
           These all use the same levels screen but pass
           the level ID to LevelsScreen.render()
        ─────────────────────────────────────────────────── */
    if (hash.startsWith("#level-")) {
      const levelId = hash.replace("#level-", "");
      // Store the level ID in AppState so LevelsScreen.render() can read it
      if (window.AppState) AppState.currentLevel = levelId;
      hash = "#levels";
    }

    // Find the matching route definition
    const route = this.routes[hash];

    // No matching route — go to auth as fallback
    if (!route) {
      this.navigate("#auth");
      return;
    }

    /* ── Hide All Screens ───────────────────────────────
           Remove 'active' from every screen div.
           CSS: .screen { display: none } by default
                .screen.active { display: block / flex }
        ─────────────────────────────────────────────────── */
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });

    /* ── Show Matched Screen ────────────────────────────
           Add 'active' to only the matched screen div.
        ─────────────────────────────────────────────────── */
    const screenEl = document.getElementById(route.screenId);
    if (screenEl) {
      screenEl.classList.add("active");
    }

    /* ── Call Screen Render Function ────────────────────
           Each screen JS file exports an object like:
               const AuthScreen = { render() { ... } }
           We call render() only if the function exists.
           This prevents errors while files are still empty.
        ─────────────────────────────────────────────────── */
    const rendererObj = window[route.renderer];
    if (rendererObj && typeof rendererObj.render === "function") {
      rendererObj.render();
    }

    /* ── Re-initialize Lucide Icons ─────────────────────
           After render() injects new HTML, Lucide needs
           to scan the DOM again for <i data-lucide="...">
        ─────────────────────────────────────────────────── */
    if (window.lucide) {
      lucide.createIcons();
    }

    /* ── Update Sidebar Active Nav Item ─────────────────
           Adds 'active' class to the correct nav-item.
        ─────────────────────────────────────────────────── */
    this.updateActiveNav(hash);

    // Scroll back to top of page on every navigation
    window.scrollTo(0, 0);
  },

  /* ── updateActiveNav(hash) ─────────────────────────────
       Finds the nav-item whose data-route matches the
       current hash and adds the 'active' class to it.
       All other nav-items lose the active class.
    ───────────────────────────────────────────────────────── */
  updateActiveNav(hash) {
    // Main nav items
    document.querySelectorAll(".nav-item[data-route]").forEach((item) => {
      item.classList.toggle("active", item.dataset.route === hash);
    });

    // Sub-nav items (level sub-menu)
    document.querySelectorAll(".nav-sub-item[data-route]").forEach((item) => {
      item.classList.toggle(
        "active",
        item.dataset.route === window.location.hash,
      );
    });
  },
};
