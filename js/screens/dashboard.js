/* ============================================================
   INFEMO — SIDEBAR + DASHBOARD SCREEN

   This file contains two objects:

   1. Sidebar — a GLOBAL sidebar builder used by ALL
      dashboard-type screens (phonetics, levels, grammar etc.)
      Call: Sidebar.build('#phonetics')
      Call: Sidebar.buildShell('#phonetics', mainContentHTML)

   2. DashboardScreen — the dashboard main content
   ============================================================ */

/* ════════════════════════════════════════════════════════════
   SIDEBAR — Global, reusable by every screen that has a sidebar
════════════════════════════════════════════════════════════ */

var Sidebar = {
  /* ── build(activeRoute) ─────────────────────────────────
       Returns the full sidebar + hamburger HTML string.
       activeRoute: the current hash e.g. '#dashboard'
    ─────────────────────────────────────────────────────── */
  build(activeRoute) {
    const name = AppState.getUserName();
    const initials = AppState.getUserInitials();
    const isGuest = AppState.isGuest;
    const lang = AppState.selectedLanguage || "de";
    const langCode = lang.toUpperCase();
    const themeIcon = window.Theme && Theme.isDark() ? "sun" : "moon";

    // Is the user currently on a levels page?
    const isOnLevels =
      activeRoute === "#levels" ||
      (activeRoute && activeRoute.startsWith("#level-"));

    // Level sub-menu items
    const levelItems = [
      {
        id: "a1",
        label: "A1 — Beginner",
        color: "var(--level-a1)",
        unlocked: true,
      },
      {
        id: "a2",
        label: "A2 — Elementary",
        color: "var(--level-a2)",
        unlocked: false,
      },
      {
        id: "b1",
        label: "B1 — Intermediate",
        color: "var(--level-b1)",
        unlocked: false,
      },
      {
        id: "b2",
        label: "B2 — Upper-Inter.",
        color: "var(--level-b2)",
        unlocked: false,
      },
      {
        id: "c1",
        label: "C1 — Advanced",
        color: "var(--level-c1)",
        unlocked: false,
      },
      {
        id: "c2",
        label: "C2 — Mastery",
        color: "var(--level-c2)",
        unlocked: false,
      },
    ];

    const levelsSubHTML = levelItems
      .map((level) => {
        const isActive = activeRoute === `#level-${level.id}`;
        return `
                <div class="nav-sub-item ${isActive ? "active" : ""}"
                     data-route="#level-${level.id}"
                     ${
                       level.unlocked
                         ? `onclick="Router.navigate('#level-${level.id}'); App.closeMobileSidebar();"`
                         : 'style="cursor:not-allowed;"'
                     }>
                    ${
                      level.unlocked
                        ? `<div class="nav-sub-dot" style="background:${level.color}"></div>`
                        : `<i data-lucide="lock" class="nav-sub-lock"></i>`
                    }
                    <span>${level.label}</span>
                </div>
            `;
      })
      .join("");

    // Bottom section — differs for guest vs logged-in
    const bottomHTML = isGuest
      ? `<button class="btn btn-secondary btn-sm btn-full sidebar-login-btn"
                        onclick="FirebaseAuth.showUpgradeModal(); App.closeMobileSidebar();">
                   <i data-lucide="log-in"></i>
                   Login / Create Account
               </button>`
      : `<div class="sidebar-signout"
                    onclick="FirebaseAuth.showSignOutConfirm(); App.closeMobileSidebar();">
                   <i data-lucide="log-out"></i>
                   <span>Sign Out</span>
               </div>`;

    // Helper: build a nav item
    const navItem = (icon, label, route) => {
      const isActive = activeRoute === route;
      return `
                <div class="nav-item ${isActive ? "active" : ""}"
                     data-route="${route}"
                     onclick="Router.navigate('${route}'); App.closeMobileSidebar();">
                    <i data-lucide="${icon}"></i>
                    <span class="nav-item-label">${label}</span>
                </div>
            `;
    };

    return `
            <!-- ── Sidebar ─────────────────────────────────── -->
            <div class="sidebar" id="app-sidebar">

                <!-- Brand -->
                <div class="sidebar-brand"
                     onclick="Router.navigate('#dashboard'); App.closeMobileSidebar();">
                    <span class="sidebar-brand-name">Infemo</span>
                    <span class="sidebar-lang-badge">${langCode}</span>
                </div>

                <!-- User -->
                <div class="sidebar-user">
                    <div class="sidebar-avatar">${initials}</div>
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name">${name}</div>
                        <div class="sidebar-user-level">A1 — Beginner</div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="sidebar-nav">

                    ${navItem("home", "Dashboard", "#dashboard")}
                    ${navItem("mic", "Phonetics", "#phonetics")}

                    <!-- Levels with expandable submenu -->
                    <div class="nav-item ${isOnLevels ? "active" : ""}"
                         id="nav-levels-toggle"
                         onclick="Sidebar.toggleLevels()">
                        <i data-lucide="bar-chart-2"></i>
                        <span class="nav-item-label">Levels</span>
                        <i data-lucide="chevron-down"
                           class="nav-item-chevron ${isOnLevels ? "expanded" : ""}"
                           id="levels-chevron"></i>
                    </div>
                    <div class="nav-sub ${isOnLevels ? "expanded" : ""}"
                         id="nav-levels-sub">
                        ${levelsSubHTML}
                    </div>

                    ${navItem("credit-card", "Flashcards", "#flashcards")}
                    ${navItem("book-open", "Vocabulary", "#vocabulary")}
                    ${navItem("book-marked", "Grammar", "#grammar")}
                    ${navItem("book-text", "Stories & Poems", "#stories")}
                    ${navItem("pen-line", "Journal", "#journal")}
                    ${navItem("trending-up", "My Progress", "#progress")}

                </nav>

                <div class="sidebar-divider"></div>

                <!-- Bottom -->
                <div class="sidebar-bottom">
                    <div class="sidebar-bottom-row">
                        <div class="nav-item"
                             style="flex:1;"
                             onclick="Router.navigate('#settings'); App.closeMobileSidebar();">
                            <i data-lucide="settings"></i>
                            <span class="nav-item-label">Settings</span>
                        </div>
                        <button class="theme-toggle"
                                onclick="Theme.toggle(); Sidebar.updateThemeIcon();"
                                title="Toggle dark / light mode">
                            <i data-lucide="${themeIcon}"></i>
                        </button>
                    </div>
                    ${bottomHTML}
                </div>

            </div><!-- end .sidebar -->

            <!-- Mobile Hamburger -->
            <button class="hamburger" id="hamburger-btn"
                    onclick="App.openMobileSidebar()">
                <i data-lucide="menu"></i>
            </button>
        `;
  },

  /* ── buildShell(activeRoute, mainContentHTML) ───────────
       Wraps sidebar + mainContentHTML in the full .app-shell.
       Used by every screen that needs a sidebar layout.

       Example in phonetics.js:
         el.innerHTML = Sidebar.buildShell('#phonetics', `
             <div class="page-header">...</div>
             ...
         `);
    ─────────────────────────────────────────────────────── */
  buildShell(activeRoute, mainContentHTML) {
    return `
            <div class="app-shell">
                ${this.build(activeRoute)}
                <main class="main-content">
                    <div class="content-wrap">
                        ${mainContentHTML}
                    </div>
                </main>
            </div>
        `;
  },

  /* ── toggleLevels() ─────────────────────────────────────
       Expands / collapses the levels sub-menu in the sidebar.
    ─────────────────────────────────────────────────────── */
  toggleLevels() {
    const sub = document.getElementById("nav-levels-sub");
    const chevron = document.getElementById("levels-chevron");
    if (sub) sub.classList.toggle("expanded");
    if (chevron) chevron.classList.toggle("expanded");
  },

  /* ── updateThemeIcon() ──────────────────────────────────
       Called after theme toggles to update the sun/moon icon.
    ─────────────────────────────────────────────────────── */
  updateThemeIcon() {
    const icon = window.Theme && Theme.isDark() ? "sun" : "moon";
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.innerHTML = `<i data-lucide="${icon}"></i>`;
    });
    if (window.lucide) lucide.createIcons();
  },
};

/* ════════════════════════════════════════════════════════════
   DASHBOARD SCREEN
════════════════════════════════════════════════════════════ */

var DashboardScreen = {
  /* ── render() ───────────────────────────────────────── */
  render() {
    const el = document.getElementById("screen-dashboard");
    if (!el) return;

    el.innerHTML = Sidebar.buildShell("#dashboard", this.buildMainContent());

    if (window.lucide) lucide.createIcons();
  },

  /* ── buildMainContent() ─────────────────────────────── */
  buildMainContent() {
    const name = AppState.getUserName();
    const greeting = DateUtils.getFullGreeting(name);
    const lang = AppState.selectedLanguage || "de";
    const streak = DateUtils.getStreak();
    const studyTime = DateUtils.formatStudyTime(AppState.todayStudyMinutes);
    const a1Progress = AppState.getLevelProgress(lang, "a1");

    const levels = [
      { id: "a1", name: "Beginner", unlocked: true, progress: a1Progress },
      { id: "a2", name: "Elementary", unlocked: false, progress: 0 },
      { id: "b1", name: "Intermediate", unlocked: false, progress: 0 },
      { id: "b2", name: "Upper-Inter.", unlocked: false, progress: 0 },
      { id: "c1", name: "Advanced", unlocked: false, progress: 0 },
      { id: "c2", name: "Mastery", unlocked: false, progress: 0 },
    ];

    return `

            <!-- ── Page Header ──────────────────────────── -->
            <div class="page-header entrance-1">
                <div class="page-title">Dashboard</div>
                <div class="dashboard-greeting">${greeting}</div>
            </div>

            <!-- ── Stats Bar ────────────────────────────── -->
            <div class="content-grid-4 entrance-2"
                 style="margin-bottom:var(--space-8);">

                <div class="stats-card">
                    <div class="stats-card-icon">
                        <i data-lucide="flame"></i>
                    </div>
                    <div class="stats-card-value">${streak}</div>
                    <div class="stats-card-label">Day Streak</div>
                </div>

                <div class="stats-card">
                    <div class="stats-card-icon">
                        <i data-lucide="book-open"></i>
                    </div>
                    <div class="stats-card-value">0</div>
                    <div class="stats-card-label">Words Learned</div>
                </div>

                <div class="stats-card">
                    <div class="stats-card-icon">
                        <i data-lucide="check-circle"></i>
                    </div>
                    <div class="stats-card-value">0</div>
                    <div class="stats-card-label">Lessons Done</div>
                </div>

                <div class="stats-card">
                    <div class="stats-card-icon">
                        <i data-lucide="clock"></i>
                    </div>
                    <div class="stats-card-value">${studyTime || "0m"}</div>
                    <div class="stats-card-label">Study Time Today</div>
                </div>

            </div>

            <!-- ── Current Level Banner ─────────────────── -->
            <div class="level-banner level-banner-a1 entrance-3">
                <div class="level-banner-left">
                    <div class="level-badge level-badge-a1"
                         style="width:52px;height:52px;font-size:var(--text-base);">
                        A1
                    </div>
                    <div class="level-banner-info">
                        <div class="level-banner-title">Beginner</div>
                        <div class="level-banner-desc">
                            Your German journey starts here
                        </div>
                        <div class="progress-bar progress-bar-lg"
                             style="max-width:180px;">
                            <div class="progress-fill progress-fill-a1"
                                 style="width:${a1Progress}%"></div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-neutral"
                        onclick="Router.navigate('#level-a1')">
                    Continue Learning
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>

            <!-- ── All Levels ────────────────────────────── -->
            <div class="dashboard-section entrance-4">
                <div class="section-header">
                    <div class="section-title">All Levels</div>
                </div>
                <div class="content-grid-3">
                    ${levels
                      .map(
                        (lvl) => `
                        <div class="level-card level-card-${lvl.id}
                                    ${!lvl.unlocked ? "level-card-locked" : ""}"
                             onclick="${
                               lvl.unlocked
                                 ? `Router.navigate('#level-${lvl.id}')`
                                 : ""
                             }">
                            <div class="level-badge level-badge-${lvl.id}">
                                ${lvl.id.toUpperCase()}
                            </div>
                            <div class="level-card-name">${lvl.name}</div>
                            ${
                              lvl.unlocked
                                ? `<div class="progress-wrap" style="width:100%;">
                                       <div class="progress-bar">
                                           <div class="progress-fill progress-fill-${lvl.id}"
                                                style="width:${lvl.progress}%"></div>
                                       </div>
                                       <div class="progress-label">
                                           <span>${lvl.progress}%</span>
                                       </div>
                                   </div>`
                                : `<div class="level-card-lock">
                                       <i data-lucide="lock"></i>
                                   </div>`
                            }
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            <!-- ── Quick Access ──────────────────────────── -->
            <div class="dashboard-section entrance-5">
                <div class="section-header">
                    <div class="section-title">Quick Access</div>
                </div>
                <div class="quick-access-bar">
                    <button class="quick-chip"
                            onclick="Router.navigate('#phonetics')">
                        <i data-lucide="mic"></i> Phonetics
                    </button>
                    <button class="quick-chip"
                            onclick="Router.navigate('#flashcards')">
                        <i data-lucide="credit-card"></i> Flashcards
                    </button>
                    <button class="quick-chip"
                            onclick="Router.navigate('#vocabulary')">
                        <i data-lucide="book-open"></i> Vocabulary
                    </button>
                    <button class="quick-chip"
                            onclick="Router.navigate('#grammar')">
                        <i data-lucide="book-marked"></i> Grammar
                    </button>
                    <button class="quick-chip"
                            onclick="Router.navigate('#stories')">
                        <i data-lucide="book-text"></i> Stories
                    </button>
                </div>
            </div>

            <!-- ── Today's Flashcards Preview ───────────── -->
            <div class="dashboard-section entrance-6">
                <div class="section-header">
                    <div class="section-title">Today's Flashcards</div>
                    <span class="section-link"
                          onclick="Router.navigate('#flashcards')">
                        View All
                    </span>
                </div>
                <div class="card">
                    <div class="empty-state" style="padding:var(--space-8);">
                        <i data-lucide="credit-card" class="empty-state-icon"></i>
                        <div class="empty-state-title">No cards due yet</div>
                        <div class="empty-state-text">
                            Complete your first lesson to unlock flashcard reviews.
                        </div>
                        <button class="btn btn-primary btn-sm"
                                style="margin-top:var(--space-4);"
                                onclick="Router.navigate('#level-a1')">
                            <i data-lucide="play"></i>
                            Start First Lesson
                        </button>
                    </div>
                </div>
            </div>

            <!-- ── Featured Story ────────────────────────── -->
            <div class="dashboard-section">
                <div class="section-header">
                    <div class="section-title">Stories & Poems</div>
                    <span class="section-link"
                          onclick="Router.navigate('#stories')">
                        Browse All
                    </span>
                </div>
                <div class="card card-interactive story-preview-card"
                     onclick="Router.navigate('#stories')">
                    <div class="level-badge level-badge-a1"
                         style="flex-shrink:0;">A1</div>
                    <div class="story-preview-info">
                        <div class="story-preview-title">Im Café</div>
                        <div class="story-preview-desc">
                            A short story about ordering coffee in Germany.
                        </div>
                        <div class="story-preview-meta">
                            Story &nbsp;·&nbsp; 3 min read
                        </div>
                    </div>
                    <div class="story-preview-arrow">
                        <i data-lucide="chevron-right"></i>
                    </div>
                </div>
            </div>

        `;
  },
};
