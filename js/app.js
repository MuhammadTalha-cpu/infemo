/* ============================================================
   INFEMO — APP ENTRY POINT
   This is the last file to load and the first to run.
   It initializes everything in the correct order and
   decides which screen to show when the app opens.
   ============================================================ */

const App = {
  /* ── init() ─────────────────────────────────────────────
       Called once when the DOM is ready.
       Order matters — theme first, then router, then screen.
    ─────────────────────────────────────────────────────── */
  init() {
    /* 1. Apply saved theme FIRST
              Must happen before anything renders to prevent
              a flash of the wrong theme on page load. */
    if (window.Theme) Theme.init();

    /* 2. Apply saved font size preference */
    const savedFontSize = Storage.get(Storage.KEYS.FONT_SIZE, "normal");
    if (savedFontSize === "large") {
      document.documentElement.setAttribute("data-font-size", "large");
    }

    /* 3. Load saved preferences into AppState */
    AppState.setState({
      theme: Storage.get(Storage.KEYS.THEME, "light"),
      fontSize: Storage.get(Storage.KEYS.FONT_SIZE, "normal"),
      speechRate: Storage.get(Storage.KEYS.SPEECH_RATE, "normal"),
      selectedLanguage: Storage.get(Storage.KEYS.LANGUAGE, null),
    });

    /* 4. Initialize the Router
              Sets up the hashchange listener so all future
              navigation works automatically. */
    if (window.Router) Router.init();

    /* 5. Decide which screen to show first */
    this.decideFirstScreen();

    /* 6. Set up global event listeners */
    this.setupGlobalListeners();

    /* 7. Initialize Lucide icons for any static HTML */
    if (window.lucide) lucide.createIcons();

    /* 8. Start tracking study time for this session */
    AppState.startSessionTimer();

    /* 9. Register Service Worker (PWA — Phase 24) */
    this.registerServiceWorker();

    console.log("Infemo initialized ✓");
  },

  /* ── decideFirstScreen() ────────────────────────────────
       Reads localStorage to figure out which screen
       to show when the app first loads.

       Logic:
       • Never visited before   → Auth screen
       • Returning guest        → Language Select (or Dashboard
                                  if a language was already picked)
       • Returning logged-in    → Welcome screen
       • Fallback               → Auth screen
    ─────────────────────────────────────────────────────── */
  decideFirstScreen() {
    const visited = Storage.get(Storage.KEYS.VISITED);
    const mode = Storage.get(Storage.KEYS.MODE);
    const lang = Storage.get(Storage.KEYS.LANGUAGE);

    /* ── First ever visit ───────────────────────────── */
    if (!visited) {
      Router.navigate("#auth");
      return;
    }

    /* ── Returning guest ────────────────────────────── */
    if (mode === "guest") {
      AppState.setGuest();

      // Load guest progress into AppState
      const guestData = Storage.getGuestProgress();
      if (guestData.progress) {
        AppState.progress = { ...AppState.progress, ...guestData.progress };
      }

      // If they already picked a language, go straight to dashboard
      if (lang) {
        AppState.selectedLanguage = lang;
        Router.navigate("#dashboard");
      } else {
        Router.navigate("#language-select");
      }
      return;
    }

    /* ── Returning logged-in user ───────────────────── */
    if (mode === "user") {
      // Show welcome screen while Firebase verifies auth state.
      // FirebaseAuth.onAuthStateChanged (Phase 9) will handle
      // redirecting to auth if the session has expired.
      Router.navigate("#welcome");
      return;
    }

    /* ── Fallback ───────────────────────────────────── */
    Router.navigate("#auth");
  },

  /* ── setupGlobalListeners() ─────────────────────────────
       Sets up event listeners that work across ALL screens.
       These are set up once here and never need repeating.
    ─────────────────────────────────────────────────────── */
  setupGlobalListeners() {
    /* ── Audio Button Delegation ─────────────────────
           Instead of attaching click listeners in every
           screen, we use ONE listener on document.body.
           Any click on any .audio-btn anywhere in the app
           is caught here automatically.
        ─────────────────────────────────────────────────── */
    document.body.addEventListener("click", (e) => {
      const audioBtn = e.target.closest(".audio-btn");
      if (audioBtn) {
        const text = audioBtn.dataset.text;
        const context = audioBtn.dataset.context || "word";
        const lang = audioBtn.dataset.lang || AppState.selectedLanguage || "de";

        if (text && window.AudioEngine) {
          AudioEngine.speak(text, context, lang);
        }
      }
    });

    /* ── Sidebar Backdrop (Mobile) ───────────────────
           Clicking the dark overlay behind the sidebar
           on mobile closes the sidebar.
        ─────────────────────────────────────────────────── */
    const backdrop = document.getElementById("sidebar-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        App.closeMobileSidebar();
      });
    }

    /* ── Escape Key ──────────────────────────────────
           Pressing Escape closes any open modal overlay.
        ─────────────────────────────────────────────────── */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Close any open modal
        const overlay = document.querySelector(".modal-overlay");
        if (overlay) overlay.remove();

        // Close mobile sidebar
        App.closeMobileSidebar();
      }
    });

    /* ── Study Time Tracking ─────────────────────────
           Every time the hash changes (new screen),
           stop timing the old screen and start timing
           the new one.
        ─────────────────────────────────────────────────── */
    window.addEventListener("hashchange", () => {
      AppState.stopSessionTimer();
      AppState.startSessionTimer();
      // Update today's study time in storage
      Storage.set("today_study_minutes", AppState.todayStudyMinutes);
    });

    /* ── Page Visibility ─────────────────────────────
           Pause study timer when user switches tabs.
           Resume when they come back.
        ─────────────────────────────────────────────────── */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        AppState.stopSessionTimer();
      } else {
        AppState.startSessionTimer();
      }
    });

    /* ── Before Page Unload ──────────────────────────
           Save study time when user closes/refreshes tab.
        ─────────────────────────────────────────────────── */
    window.addEventListener("beforeunload", () => {
      AppState.stopSessionTimer();
      Storage.set("today_study_minutes", AppState.todayStudyMinutes);
    });
  },

  /* ── openMobileSidebar() ────────────────────────────────
       Shows the sidebar and backdrop on mobile.
       Called by the hamburger button in each screen.
    ─────────────────────────────────────────────────────── */
  openMobileSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.add("mobile-open");
    if (backdrop) backdrop.classList.add("visible");
  },

  /* ── closeMobileSidebar() ───────────────────────────────
       Hides the sidebar and backdrop on mobile.
    ─────────────────────────────────────────────────────── */
  closeMobileSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (backdrop) backdrop.classList.remove("visible");
  },

  /* ── showToast(message, type, duration) ─────────────────
       Shows a toast notification.
       type: 'success' | 'error' | 'warning' | 'info'
       duration: milliseconds before auto-dismiss (default 3500)

       Example: App.showToast('Progress saved!', 'success')
                App.showToast('Something went wrong.', 'error')
    ─────────────────────────────────────────────────────── */
  showToast(message, type = "info", duration = 3500) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const icons = {
      success: "check-circle",
      error: "x-circle",
      warning: "alert-triangle",
      info: "info",
    };

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
            <i data-lucide="${icons[type] || "info"}"></i>
            <span>${message}</span>
        `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Auto-dismiss after duration
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(24px)";
      toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, duration);
  },

  /* ── showModal(config) ──────────────────────────────────
       Creates and shows a modal overlay.
       config = {
           title:    string,
           subtitle: string (optional),
           body:     HTML string,
           footer:   HTML string (optional),
           onClose:  function (optional)
       }
       Returns the modal element so caller can interact with it.
    ─────────────────────────────────────────────────────── */
  showModal(config) {
    // Remove any existing modal
    const existing = document.querySelector(".modal-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <div class="modal-header">
                    <div>
                        <div class="modal-title">${config.title || ""}</div>
                        ${
                          config.subtitle
                            ? `<div class="modal-subtitle">${config.subtitle}</div>`
                            : ""
                        }
                    </div>
                    <button class="btn btn-icon btn-ghost modal-close" id="modal-close-btn">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${config.body || ""}
                </div>
                ${
                  config.footer
                    ? `<div class="modal-footer">${config.footer}</div>`
                    : ""
                }
            </div>
        `;

    document.body.appendChild(overlay);
    if (window.lucide) lucide.createIcons();

    // Close button
    const closeBtn = document.getElementById("modal-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        overlay.remove();
        if (typeof config.onClose === "function") config.onClose();
      });
    }

    // Click outside to close
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        if (typeof config.onClose === "function") config.onClose();
      }
    });

    return overlay;
  },

  /* ── registerServiceWorker() ────────────────────────────
       Registers the PWA service worker.
       Only activates in Phase 24 when service-worker.js
       has content. Safe to call now — does nothing if
       the file is empty.
    ─────────────────────────────────────────────────────── */
  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker registered ✓"))
        .catch(() => {
          // Silent fail — SW not set up yet (Phase 24)
        });
    }
  },
};

/* ════════════════════════════════════════════════════════════
   START THE APP
   Wait for the DOM to be fully parsed before running init().
   DOMContentLoaded fires before images/fonts load — perfect
   for us since we don't need to wait for those.
════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
