/* ============================================================
   INFEMO — THEME ENGINE
   Handles dark/light theme toggle and persistence.
   Applies the saved theme before anything renders to
   prevent a flash of the wrong theme on page load.
   ============================================================ */

const Theme = {
  /* ── init() ─────────────────────────────────────────────
       Called first thing in App.init() — before any
       rendering happens. Reads saved preference and applies
       it immediately so there's no visual flash.
    ─────────────────────────────────────────────────────── */
  init() {
    const saved = Storage.get(Storage.KEYS.THEME, "light");
    this.apply(saved);
  },

  /* ── apply(theme) ───────────────────────────────────────
       Applies a theme by setting data-theme on <html>.
       CSS variables switch automatically based on this.
       theme: 'light' | 'dark'
    ─────────────────────────────────────────────────────── */
  apply(theme) {
    const html = document.documentElement;

    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
    }

    // Keep AppState in sync
    AppState.theme = theme;

    // Update any theme toggle icons already in the DOM
    this.updateToggleIcons(theme);
  },

  /* ── toggle() ───────────────────────────────────────────
       Switches between light and dark and saves the choice.
       Called by the Sun/Moon button in the sidebar.
    ─────────────────────────────────────────────────────── */
  toggle() {
    const current = AppState.theme || "light";
    const next = current === "light" ? "dark" : "light";

    this.apply(next);
    Storage.set(Storage.KEYS.THEME, next);

    return next; // Returns new theme so callers can react
  },

  /* ── getCurrent() ───────────────────────────────────────
       Returns the current theme string: 'light' or 'dark'.
    ─────────────────────────────────────────────────────── */
  getCurrent() {
    return document.documentElement.getAttribute("data-theme") || "light";
  },

  /* ── isDark() ───────────────────────────────────────────
       Returns true if dark mode is currently active.
    ─────────────────────────────────────────────────────── */
  isDark() {
    return this.getCurrent() === "dark";
  },

  /* ── updateToggleIcons(theme) ───────────────────────────
       Updates all theme toggle buttons in the DOM.
       In dark mode:  shows Sun icon  (click to go light)
       In light mode: shows Moon icon (click to go dark)
    ─────────────────────────────────────────────────────── */
  updateToggleIcons(theme) {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      // Replace icon based on current theme
      btn.innerHTML =
        theme === "dark"
          ? '<i data-lucide="sun"></i>'
          : '<i data-lucide="moon"></i>';
    });

    // Re-initialize Lucide so the new icons render
    if (window.lucide) lucide.createIcons();
  },

  /* ── setFontSize(size) ──────────────────────────────────
       Applies a font size preference.
       size: 'normal' | 'large'
       Works by setting data-font-size on <html> which
       our CSS in base.css picks up and scales all text.
    ─────────────────────────────────────────────────────── */
  setFontSize(size) {
    const html = document.documentElement;

    if (size === "large") {
      html.setAttribute("data-font-size", "large");
    } else {
      html.removeAttribute("data-font-size");
    }

    AppState.fontSize = size;
    Storage.set(Storage.KEYS.FONT_SIZE, size);
  },
};
