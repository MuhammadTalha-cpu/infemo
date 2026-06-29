/* ============================================================
   INFEMO — MY PROGRESS SCREEN
   Shows a complete picture of the user's learning journey:
   • Overview stats (streak, lessons, words, study time)
   • 30-day streak calendar
   • Level completion progress bars
   • Vocabulary mastery breakdown
   • Achievements / badges
   • Exam history
   ============================================================ */

var ProgressScreen = {
  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-progress");
    if (!el) return;

    el.innerHTML = Sidebar.buildShell("#progress", this._buildMainContent());
    if (window.lucide) lucide.createIcons();
  },

  /* ── _buildMainContent() ────────────────────────────── */
  _buildMainContent() {
    return `
            <!-- Page Header -->
            <div class="page-header entrance-1">
                <div class="page-title">My Progress</div>
                <div class="page-subtitle">
                    Your complete language learning journey
                </div>
            </div>

            <!-- Overview Stats -->
            ${this._buildOverviewStats()}

            <!-- Streak Calendar -->
            <div class="dashboard-section entrance-3">
                <div class="section-header">
                    <div class="section-title">Study Streak</div>
                </div>
                <div class="card">
                    ${this._buildStreakCalendar()}
                </div>
            </div>

            <!-- Level Progress -->
            <div class="dashboard-section entrance-4">
                <div class="section-header">
                    <div class="section-title">Level Progress</div>
                    <span class="section-link"
                          onclick="Router.navigate('#levels')">
                        View Levels
                    </span>
                </div>
                ${this._buildLevelProgress()}
            </div>

            <!-- Two columns: Vocab Mastery + Exam History -->
            <div class="content-grid-2 entrance-5"
                 style="margin-bottom:var(--space-8);">

                <!-- Vocabulary Mastery -->
                <div>
                    <div class="section-header">
                        <div class="section-title">Vocabulary Mastery</div>
                        <span class="section-link"
                              onclick="Router.navigate('#flashcards')">
                            Practice
                        </span>
                    </div>
                    <div class="card">
                        ${this._buildVocabMastery()}
                    </div>
                </div>

                <!-- Exam History -->
                <div>
                    <div class="section-header">
                        <div class="section-title">Exam History</div>
                        <span class="section-link"
                              onclick="Router.navigate('#level-a1')">
                            Take Exam
                        </span>
                    </div>
                    ${this._buildExamHistory()}
                </div>

            </div>

            <!-- Achievements -->
            <div class="dashboard-section entrance-6">
                <div class="section-header">
                    <div class="section-title">Achievements</div>
                </div>
                ${this._buildAchievements()}
            </div>
        `;
  },

  /* ════════════════════════════════════════════════════
       OVERVIEW STATS
    ════════════════════════════════════════════════════ */

  _buildOverviewStats() {
    var lang = AppState.selectedLanguage || "de";
    var streak = DateUtils.getStreak();
    var srsData = Storage.get("srs_" + lang) || {};

    /* Count mastered words */
    var allWords = window.DEA1Vocabulary ? DEA1Vocabulary : [];
    var masteredCnt = allWords.filter(function (w) {
      var d = srsData[w.id];
      return d && d.mastery >= 2;
    }).length;

    /* Count completed lessons from progress */
    var langProgress = AppState.getLanguageProgress(lang);
    var a1Data = langProgress.levels.a1;
    var lessonsCount = 0;
    if (a1Data && a1Data.topics) {
      Object.values(a1Data.topics).forEach(function (t) {
        if (t.completed) lessonsCount++;
      });
    }

    /* Stories read */
    var readStories = Storage.get("read_stories_" + lang) || {};
    var storiesRead = Object.keys(readStories).length;

    /* Journal entries */
    var journalEntries = Storage.get("journal_" + lang) || [];
    var journalCount = journalEntries.length;

    var stats = [
      {
        icon: "flame",
        iconBg: "rgba(239,68,68,0.1)",
        iconColor: "var(--error)",
        value: streak,
        label: "Day Streak",
        sub: streak === 1 ? "1 day active" : streak + " days active",
      },
      {
        icon: "check-circle",
        iconBg: "rgba(34,197,94,0.1)",
        iconColor: "var(--success)",
        value: lessonsCount,
        label: "Topics Complete",
        sub: "out of 12 A1 topics",
      },
      {
        icon: "book-open",
        iconBg: "rgba(59,91,219,0.1)",
        iconColor: "var(--primary)",
        value: masteredCnt,
        label: "Words Mastered",
        sub: allWords.length + " total words",
      },
      {
        icon: "pen-line",
        iconBg: "rgba(124,58,237,0.1)",
        iconColor: "#7c3aed",
        value: journalCount,
        label: "Journal Entries",
        sub: storiesRead + " stories read",
      },
    ];

    var cardsHTML = stats
      .map(function (s) {
        return `
                <div class="progress-stat-card entrance-2">
                    <div class="progress-stat-icon"
                         style="background:${s.iconBg};color:${s.iconColor};">
                        <i data-lucide="${s.icon}"></i>
                    </div>
                    <div>
                        <div class="progress-stat-value"
                             style="color:${s.iconColor};">
                            ${s.value}
                        </div>
                        <div class="progress-stat-label">${s.label}</div>
                        <div class="progress-stat-sub">${s.sub}</div>
                    </div>
                </div>
            `;
      })
      .join("");

    return `<div class="progress-stats-grid">${cardsHTML}</div>`;
  },

  /* ════════════════════════════════════════════════════
       STREAK CALENDAR
    ════════════════════════════════════════════════════ */

  _buildStreakCalendar() {
    /* Build a 30-day calendar grid */
    var studiedDays = Storage.get("studied_days") || {};
    var today = new Date();
    var days = [];

    for (var i = 29; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(today.getDate() - i);
      var key = d.toISOString().split("T")[0];
      var isToday = key === today.toISOString().split("T")[0];
      var studied = !!studiedDays[key];
      days.push({
        key: key,
        day: d.getDate(),
        isToday: isToday,
        studied: studied,
      });
    }

    /* Group into weeks of 7 */
    var weeks = [];
    for (var j = 0; j < days.length; j += 7) {
      weeks.push(days.slice(j, j + 7));
    }

    var weeksHTML = weeks
      .map(function (week) {
        var daysHTML = week
          .map(function (day) {
            var cls = "streak-day";
            if (day.studied) cls += " studied";
            if (day.isToday) cls += " today";
            return `<div class="${cls}" title="${day.key}">${day.day}</div>`;
          })
          .join("");

        return `<div class="streak-days-row">${daysHTML}</div>`;
      })
      .join("");

    /* Count active days */
    var activeDays = days.filter(function (d) {
      return d.studied;
    }).length;

    return `
            <div class="streak-calendar">
                <div style="display:flex;align-items:center;
                            justify-content:space-between;
                            margin-bottom:var(--space-4);
                            flex-wrap:wrap;gap:var(--space-3);">
                    <div style="font-size:var(--text-sm);color:var(--text-secondary);">
                        Last 30 days — <strong
                            style="color:var(--primary);">
                            ${activeDays} days
                        </strong> studied
                    </div>
                </div>
                ${weeksHTML}
                <div class="streak-legend">
                    <div class="streak-legend-item">
                        <div class="streak-legend-dot"
                             style="background:var(--surface-2);
                                    border:1px solid var(--border);"></div>
                        Not studied
                    </div>
                    <div class="streak-legend-item">
                        <div class="streak-legend-dot"
                             style="background:var(--primary);"></div>
                        Studied
                    </div>
                    <div class="streak-legend-item">
                        <div class="streak-legend-dot"
                             style="background:var(--success);"></div>
                        Today
                    </div>
                </div>
            </div>
        `;
  },

  /* ════════════════════════════════════════════════════
       LEVEL PROGRESS
    ════════════════════════════════════════════════════ */

  _buildLevelProgress() {
    var lang = AppState.selectedLanguage || "de";
    var system = window.getLevelSystem ? getLevelSystem(lang) : null;

    if (!system) return '<p class="text-muted">Level data loading...</p>';

    var rowsHTML = system.levels
      .map(function (level, idx) {
        var isUnlocked = idx === 0 || AppState.isLevelUnlocked(lang, level.id);
        var progress = AppState.getLevelProgress(lang, level.id);
        var isLocked = !isUnlocked;
        var colorVar = level.colorVar || "var(--primary)";

        return `
                <div class="level-progress-row ${isLocked ? "locked-level" : ""}"
                     onclick="${
                       isLocked
                         ? ""
                         : `AppState.currentLevel='${level.id}';
                          Router.navigate('#level-${level.id}')`
                     }">

                    <div class="level-badge level-badge-${level.id}"
                         style="${
                           !["a1", "a2", "b1", "b2", "c1", "c2"].includes(
                             level.id,
                           )
                             ? "background:" + colorVar + ";color:#fff;"
                             : ""
                         }">
                        ${level.code}
                    </div>

                    <div class="level-progress-info">
                        <div class="level-progress-name">
                            ${level.name}
                            ${
                              isLocked
                                ? `
                                <i data-lucide="lock"
                                   style="width:12px;height:12px;
                                          color:var(--text-muted);
                                          vertical-align:middle;
                                          margin-left:4px;">
                                </i>
                            `
                                : ""
                            }
                        </div>
                        <div class="level-progress-bar-wrap">
                            <div class="progress-bar progress-bar-lg" style="flex:1;">
                                <div class="progress-fill"
                                     style="width:${progress}%;
                                            background:${colorVar};">
                                </div>
                            </div>
                            <span class="level-progress-pct">${progress}%</span>
                        </div>
                    </div>

                    ${
                      progress === 100
                        ? `
                        <i data-lucide="check-circle"
                           style="color:var(--success);
                                  width:20px;height:20px;
                                  flex-shrink:0;">
                        </i>
                    `
                        : isLocked
                          ? ""
                          : `
                        <i data-lucide="chevron-right"
                           style="color:var(--text-muted);
                                  width:18px;height:18px;
                                  flex-shrink:0;">
                        </i>
                    `
                    }

                </div>
            `;
      })
      .join("");

    return `<div class="level-progress-list">${rowsHTML}</div>`;
  },

  /* ════════════════════════════════════════════════════
       VOCABULARY MASTERY
    ════════════════════════════════════════════════════ */

  _buildVocabMastery() {
    var lang = AppState.selectedLanguage || "de";
    var srsData = Storage.get("srs_" + lang) || {};
    var words = window.DEA1Vocabulary ? DEA1Vocabulary : [];
    var total = words.length;

    if (total === 0) {
      return '<p class="text-muted" style="padding:var(--space-4);">No vocabulary data yet.</p>';
    }

    var counts = { new: 0, learning: 0, review: 0, mastered: 0 };
    words.forEach(function (w) {
      var d = srsData[w.id];
      if (!d || d.mastery === 0) counts.new++;
      else if (d.mastery === 1) counts.learning++;
      else if (d.mastery === 2) counts.review++;
      else if (d.mastery === 3) counts.mastered++;
    });

    var knownPct = Math.round(
      ((counts.mastered + counts.review) / total) * 100,
    );

    return `
            <div class="vocab-mastery-display">

                <div class="vocab-mastery-number">
                    <div class="vocab-mastery-big">${counts.mastered + counts.review}</div>
                    <div class="vocab-mastery-total">of ${total} words known</div>
                    <div style="margin-top:var(--space-3);">
                        <div class="progress-bar progress-bar-lg"
                             style="max-width:200px;margin:0 auto;">
                            <div class="progress-fill"
                                 style="width:${knownPct}%;
                                        background:var(--success);">
                            </div>
                        </div>
                        <div style="font-size:var(--text-sm);
                                    color:var(--text-muted);
                                    margin-top:var(--space-2);">
                            ${knownPct}% complete
                        </div>
                    </div>
                </div>

                <div class="vocab-mastery-breakdown">
                    <div class="vocab-mastery-cell">
                        <div class="vocab-mastery-cell-value"
                             style="color:var(--border-strong);">
                            ${counts.new}
                        </div>
                        <div class="vocab-mastery-cell-label">New</div>
                    </div>
                    <div class="vocab-mastery-cell">
                        <div class="vocab-mastery-cell-value"
                             style="color:var(--warning);">
                            ${counts.learning}
                        </div>
                        <div class="vocab-mastery-cell-label">Learning</div>
                    </div>
                    <div class="vocab-mastery-cell">
                        <div class="vocab-mastery-cell-value"
                             style="color:var(--primary);">
                            ${counts.review}
                        </div>
                        <div class="vocab-mastery-cell-label">Review</div>
                    </div>
                    <div class="vocab-mastery-cell">
                        <div class="vocab-mastery-cell-value"
                             style="color:var(--success);">
                            ${counts.mastered}
                        </div>
                        <div class="vocab-mastery-cell-label">Mastered</div>
                    </div>
                </div>

            </div>
        `;
  },

  /* ════════════════════════════════════════════════════
       EXAM HISTORY
    ════════════════════════════════════════════════════ */

  _buildExamHistory() {
    var lang = AppState.selectedLanguage || "de";
    var langProgress = AppState.getLanguageProgress(lang);
    var history = langProgress.examHistory || [];

    if (history.length === 0) {
      return `
                <div class="card">
                    <div class="empty-state" style="padding:var(--space-8);">
                        <i data-lucide="file-text" class="empty-state-icon"></i>
                        <div class="empty-state-title">No exams yet</div>
                        <div class="empty-state-text">
                            Complete a practice exam to see your results here.
                        </div>
                        <button class="btn btn-primary btn-sm"
                                style="margin-top:var(--space-4);"
                                onclick="AppState.activeExam.langCode='de';
                                         AppState.activeExam.levelId='a1';
                                         Router.navigate('#exam');">
                            <i data-lucide="play"></i>
                            Take Practice Exam
                        </button>
                    </div>
                </div>
            `;
    }

    /* Show last 5 exams */
    var recentHistory = history.slice(-5).reverse();

    var rowsHTML = recentHistory
      .map(function (h) {
        var date = new Date(h.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        var emoji = h.passed ? "🏆" : "📚";
        var scoreColor = h.passed ? "var(--success)" : "var(--primary)";

        return `
                <div class="exam-history-row">
                    <div class="exam-history-icon">${emoji}</div>
                    <div class="exam-history-info">
                        <div class="exam-history-name">
                            ${h.examName || "Practice Exam"}
                        </div>
                        <div class="exam-history-date">${date}</div>
                    </div>
                    <div class="exam-history-score"
                         style="color:${scoreColor};">
                        ${h.score}%
                    </div>
                    <span class="exam-history-badge ${h.passed ? "pass" : "fail"}">
                        ${h.passed ? "Pass" : "Retry"}
                    </span>
                </div>
            `;
      })
      .join("");

    return `
            <div class="exam-history-list card" style="padding:0;overflow:hidden;">
                ${rowsHTML}
            </div>
        `;
  },

  /* ════════════════════════════════════════════════════
       ACHIEVEMENTS
    ════════════════════════════════════════════════════ */

  _buildAchievements() {
    var lang = AppState.selectedLanguage || "de";
    var srsData = Storage.get("srs_" + lang) || {};
    var readStories = Storage.get("read_stories_" + lang) || {};
    var journalEntries = Storage.get("journal_" + lang) || [];
    var langProgress = AppState.getLanguageProgress(lang);
    var a1Data = langProgress.levels.a1;
    var streak = DateUtils.getStreak();

    /* Count completed topics */
    var completedTopics = 0;
    if (a1Data && a1Data.topics) {
      Object.values(a1Data.topics).forEach(function (t) {
        if (t.completed) completedTopics++;
      });
    }

    /* Count mastered words */
    var allWords = window.DEA1Vocabulary ? DEA1Vocabulary : [];
    var masteredCnt = allWords.filter(function (w) {
      var d = srsData[w.id];
      return d && d.mastery >= 3;
    }).length;

    /* Count reviewed flashcards */
    var reviewedCnt = Object.keys(srsData).length;

    /* Exam history */
    var examHistory = langProgress.examHistory || [];
    var examsPassed = examHistory.filter(function (e) {
      return e.passed;
    }).length;

    /* Define all achievements */
    var achievements = [
      {
        id: "first-step",
        emoji: "👣",
        name: "First Step",
        desc: "Complete your first lesson",
        earned: completedTopics >= 1,
      },
      {
        id: "word-collector",
        emoji: "📚",
        name: "Word Collector",
        desc: "Review 10 flashcards",
        earned: reviewedCnt >= 10,
      },
      {
        id: "streak-3",
        emoji: "🔥",
        name: "On Fire",
        desc: "Study 3 days in a row",
        earned: streak >= 3,
      },
      {
        id: "story-reader",
        emoji: "📖",
        name: "Story Reader",
        desc: "Read your first story",
        earned: Object.keys(readStories).length >= 1,
      },
      {
        id: "journal-writer",
        emoji: "✍️",
        name: "Journal Writer",
        desc: "Write your first journal entry",
        earned: journalEntries.length >= 1,
      },
      {
        id: "exam-taker",
        emoji: "📝",
        name: "Exam Taker",
        desc: "Complete a practice exam",
        earned: examHistory.length >= 1,
      },
      {
        id: "exam-passer",
        emoji: "🏆",
        name: "Exam Champion",
        desc: "Pass a practice exam",
        earned: examsPassed >= 1,
      },
      {
        id: "vocab-10",
        emoji: "⭐",
        name: "Vocabulary Builder",
        desc: "Master 10 words",
        earned: masteredCnt >= 10,
      },
      {
        id: "topic-master",
        emoji: "🎓",
        name: "Topic Master",
        desc: "Complete all 12 A1 topics",
        earned: completedTopics >= 12,
      },
      {
        id: "streak-7",
        emoji: "💪",
        name: "Week Warrior",
        desc: "Study 7 days in a row",
        earned: streak >= 7,
      },
      {
        id: "vocab-50",
        emoji: "🧠",
        name: "Word Master",
        desc: "Master 50 words",
        earned: masteredCnt >= 50,
      },
      {
        id: "polyglot",
        emoji: "🌍",
        name: "Polyglot Path",
        desc: "Complete A1 and start A2",
        earned: false,
      },
    ];

    /* Sort: earned first */
    achievements.sort(function (a, b) {
      return (b.earned ? 1 : 0) - (a.earned ? 1 : 0);
    });

    var earnedCount = achievements.filter(function (a) {
      return a.earned;
    }).length;

    var cardsHTML = achievements
      .map(function (a) {
        return `
                <div class="achievement-card ${a.earned ? "earned" : "locked"}">
                    <div class="achievement-emoji">${a.emoji}</div>
                    <div class="achievement-name">${a.name}</div>
                    <div class="achievement-desc">${a.desc}</div>
                    ${
                      a.earned
                        ? `
                        <div class="achievement-earned-label">
                            ★ Earned
                        </div>
                    `
                        : ""
                    }
                </div>
            `;
      })
      .join("");

    return `
            <div style="font-size:var(--text-sm);color:var(--text-secondary);
                        margin-bottom:var(--space-4);">
                ${earnedCount} of ${achievements.length} achievements earned
            </div>
            <div class="achievements-grid">
                ${cardsHTML}
            </div>
        `;
  },
};
