/* ============================================================
   INFEMO — LEVELS SCREEN
   Universal level renderer — works for any language system
   (CEFR, JLPT, HSK, TOPIK, etc.) without code changes.

   Two views:
   • AppState.currentLevel = null  → All levels overview grid
   • AppState.currentLevel = 'a1'  → That level's topic cards
   ============================================================ */

var LevelsScreen = {
  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-levels");
    if (!el) return;

    var lang = AppState.selectedLanguage || "de";
    var levelId = AppState.currentLevel;

    /* Decide which view to show */
    var mainContent = levelId
      ? this.buildLevelDetail(lang, levelId)
      : this.buildAllLevels(lang);

    var activeRoute = levelId ? "#level-" + levelId : "#levels";

    el.innerHTML = Sidebar.buildShell(activeRoute, mainContent);

    if (window.lucide) lucide.createIcons();
  },

  /* ════════════════════════════════════════════════════
       ALL LEVELS OVERVIEW
    ════════════════════════════════════════════════════ */

  buildAllLevels(lang) {
    var system = window.getLevelSystem ? getLevelSystem(lang) : null;
    var langObj = window.getLanguage ? getLanguage(lang) : null;

    if (!system) {
      return '<p class="text-muted" style="padding:2rem;">Level data loading...</p>';
    }

    var certText = langObj
      ? langObj.certName + " — " + langObj.certBody
      : system.certBody;

    return `
            <!-- Page Header -->
            <div class="page-header entrance-1">
                <div class="page-title">All Levels</div>
                <div class="page-subtitle">${certText}</div>
            </div>

            <!-- Levels Grid -->
            <div class="levels-overview-grid entrance-2">
                ${system.levels
                  .map((level, idx) => {
                    var unlocked = this.isLevelUnlocked(lang, level.id, idx);
                    var progress = AppState.getLevelProgress(lang, level.id);
                    return this.buildLevelOverviewCard(
                      lang,
                      level,
                      unlocked,
                      progress,
                    );
                  })
                  .join("")}
            </div>
        `;
  },

  buildLevelOverviewCard(lang, level, unlocked, progress) {
    var lockedClass = unlocked ? "" : "level-overview-locked";

    var progressHTML = unlocked
      ? `<div class="progress-wrap" style="margin-top:var(--space-2);">
                   <div class="progress-bar progress-bar-lg">
                       <div class="progress-fill"
                            style="width:${progress}%;background:${level.colorVar}"></div>
                   </div>
                   <div class="progress-label">
                       <span>${progress}%</span>
                   </div>
               </div>`
      : `<div style="display:flex;align-items:center;gap:var(--space-2);
                           margin-top:var(--space-2);color:var(--text-muted);
                           font-size:var(--text-xs);">
                   <i data-lucide="lock" style="width:12px;height:12px;"></i>
                   Complete previous level to unlock
               </div>`;

    var skillsHTML = level.skills
      ? level.skills
          .slice(0, 4)
          .map((s) => `<span class="level-overview-skill">${s}</span>`)
          .join("")
      : "";

    return `
            <div class="level-overview-card ${lockedClass}"
                 style="${unlocked ? "border-color:" + level.colorVar + "20;" : ""}"
                 onclick="${
                   unlocked ? `Router.navigate('#level-${level.id}')` : ""
                 }">

                <div class="level-overview-card-top">
                    <div class="level-badge level-badge-${level.id}"
                         style="${
                           !["a1", "a2", "b1", "b2", "c1", "c2"].includes(
                             level.id,
                           )
                             ? "background:" + level.colorVar + ";color:#fff;"
                             : ""
                         }">
                        ${level.code}
                    </div>
                    ${
                      unlocked && progress === 100
                        ? '<i data-lucide="check-circle" style="color:var(--success);width:20px;height:20px;"></i>'
                        : !unlocked
                          ? '<i data-lucide="lock" style="color:var(--text-muted);width:16px;height:16px;"></i>'
                          : ""
                    }
                </div>

                <div>
                    <div class="level-overview-name">${level.name}</div>
                    <div class="level-overview-cert">${level.certName}</div>
                </div>

                <div class="level-overview-desc">${level.description}</div>

                ${progressHTML}

                <div class="level-overview-skills">${skillsHTML}</div>
            </div>
        `;
  },

  /* ════════════════════════════════════════════════════
       LEVEL DETAIL — TOPIC CARDS
    ════════════════════════════════════════════════════ */

  buildLevelDetail(lang, levelId) {
    var levelDef = window.getLevel ? getLevel(lang, levelId) : null;
    var topics = window.getLevelTopics ? getLevelTopics(lang, levelId) : [];

    if (!levelDef) {
      return `<div class="page-header">
                        <div class="page-title">Level Not Found</div>
                    </div>`;
    }

    var progress = AppState.getLevelProgress(lang, levelId);
    var topicsDone = this.getCompletedTopicCount(lang, levelId, topics);

    /* Determine cert name for exam button */
    var langObj = window.getLanguage ? getLanguage(lang) : null;
    var certName =
      levelDef.certName || (langObj ? langObj.certName : "Certification");

    return `
            <!-- Back row -->
            <div class="level-back-row entrance-1">
                <button class="btn btn-ghost btn-sm"
                        onclick="AppState.currentLevel = null; Router.navigate('#levels');">
                    <i data-lucide="arrow-left"></i>
                    All Levels
                </button>
            </div>

            <!-- Level Header Banner -->
            <div class="level-detail-header level-banner-${levelId} entrance-2">
                <div class="level-detail-left">
                    <div class="level-badge level-badge-${levelId}"
                         style="width:56px;height:56px;font-size:var(--text-base);flex-shrink:0;
                                ${
                                  ![
                                    "a1",
                                    "a2",
                                    "b1",
                                    "b2",
                                    "c1",
                                    "c2",
                                  ].includes(levelId)
                                    ? "background:" +
                                      levelDef.colorVar +
                                      ";color:#fff;"
                                    : ""
                                }">
                        ${levelDef.code}
                    </div>
                    <div class="level-detail-info">
                        <div class="level-detail-name">${levelDef.name}</div>
                        <div class="level-detail-cert">${levelDef.certName}</div>
                        <div class="level-detail-desc">${levelDef.description}</div>
                        <div class="level-detail-progress-wrap">
                            <div class="progress-wrap">
                                <div class="progress-bar progress-bar-lg">
                                    <div class="progress-fill"
                                         style="width:${progress}%;
                                                background:${levelDef.colorVar}">
                                    </div>
                                </div>
                                <div class="progress-label">
                                    <span>${topicsDone} of ${topics.length || "—"} topics done</span>
                                    <span>${progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Topics Section -->
            <div class="section-header entrance-3">
                <div class="section-title">Topics</div>
            </div>

            ${
              topics.length > 0
                ? `<div class="topics-grid entrance-3">
                       ${topics
                         .map((topic, idx) => {
                           var topicState = this.getTopicState(
                             lang,
                             levelId,
                             topic.id,
                             idx,
                           );
                           return this.buildTopicCard(
                             lang,
                             levelId,
                             topic,
                             topicState,
                           );
                         })
                         .join("")}
                   </div>`
                : `<div class="card entrance-3">
                       <div class="empty-state" style="padding:var(--space-10);">
                           <i data-lucide="book-open" class="empty-state-icon"></i>
                           <div class="empty-state-title">Coming Soon</div>
                           <div class="empty-state-text">
                               Content for ${levelDef.name} is being prepared.
                               ${
                                 levelId === "a1"
                                   ? "Check back soon!"
                                   : "Complete A1 first to unlock this level."
                               }
                           </div>
                       </div>
                   </div>`
            }

            <!-- Practice Exam Button -->
            ${
              topics.length > 0
                ? `<div class="exam-btn-section entrance-4">
                       <div class="exam-btn-info">
                           <div class="exam-btn-title">
                               <i data-lucide="file-text"
                                  style="display:inline;width:16px;height:16px;
                                         vertical-align:-2px;margin-right:6px;">
                               </i>
                               Practice Exam — ${levelDef.code} ${certName}
                           </div>
                           <div class="exam-btn-desc">
                               Full mock exam in the official format with real time limits
                               and section scoring.
                           </div>
                       </div>
                       <button class="btn btn-primary"
                               onclick="AppState.activeExam.langCode='${lang}';
                                        AppState.activeExam.levelId='${levelId}';
                                        Router.navigate('#exam');">
                           <i data-lucide="play"></i>
                           Start Practice Exam
                       </button>
                   </div>`
                : ""
            }
        `;
  },

  /* ── buildTopicCard(lang, levelId, topic, state) ────── */
  buildTopicCard(lang, levelId, topic, state) {
    var isLocked = state === "locked";
    var isComplete = state === "complete";
    var isStarted = state === "started";

    var cardClass = isLocked
      ? "topic-card topic-card-locked topic-locked"
      : isComplete
        ? "topic-card topic-card-complete"
        : "topic-card";

    var statusBadge = isLocked
      ? '<span class="topic-status-badge topic-status-locked">Locked</span>'
      : isComplete
        ? '<span class="topic-status-badge topic-status-complete">Complete</span>'
        : isStarted
          ? '<span class="topic-status-badge topic-status-started">In Progress</span>'
          : '<span class="topic-status-badge topic-status-new">New</span>';

    var cornerIcon = isLocked
      ? `<div class="topic-card-lock"><i data-lucide="lock"></i></div>`
      : isComplete
        ? `<div class="topic-card-check"><i data-lucide="check-circle"></i></div>`
        : "";

    return `
            <div class="${cardClass}"
                 onclick="${
                   !isLocked
                     ? `LevelsScreen.openTopic('${lang}', '${levelId}', '${topic.id}')`
                     : ""
                 }">

                ${cornerIcon}

                <div class="topic-card-icon">
                    <i data-lucide="${topic.icon || "book-open"}"></i>
                </div>

                <div class="topic-card-name">${topic.name}</div>

                <div class="topic-card-desc">${topic.description}</div>

                <div class="topic-card-meta">
                    <div class="topic-card-lessons">
                        <i data-lucide="layers"></i>
                        ${topic.lessonCount || 4} lessons
                    </div>
                    ${statusBadge}
                </div>

            </div>
        `;
  },

  /* ── openTopic(lang, levelId, topicId) ──────────────── */
  openTopic(lang, levelId, topicId) {
    AppState.currentTopic = topicId;
    AppState.selectedLanguage = lang;

    /* Mark level as started in progress data */
    var langProgress = AppState.getLanguageProgress(lang);
    if (langProgress.levels[levelId]) {
      langProgress.levels[levelId].started = true;
    }

    /* Navigate to lesson screen */
    Router.navigate("#lesson");
  },

  /* ── getTopicState(lang, levelId, topicId, idx) ─────── */
  getTopicState(lang, levelId, topicId, idx) {
    var langProgress = AppState.getLanguageProgress(lang);
    var levelData = langProgress.levels[levelId];

    if (!levelData) return idx === 0 ? "new" : "locked";

    var topicData = levelData.topics && levelData.topics[topicId];

    /* First topic always unlocked */
    if (idx === 0) {
      if (!topicData) return "new";
      if (topicData.completed) return "complete";
      if (topicData.started) return "started";
      return "new";
    }

    /* Check if previous topic is complete */
    var topics = window.getLevelTopics ? getLevelTopics(lang, levelId) : [];
    var prevTopic = topics[idx - 1];

    if (!prevTopic) return "locked";

    var prevData = levelData.topics && levelData.topics[prevTopic.id];
    var prevDone = prevData && prevData.completed;

    if (!prevDone) return "locked";

    /* Previous is done — this topic is available */
    if (!topicData) return "new";
    if (topicData.completed) return "complete";
    if (topicData.started) return "started";
    return "new";
  },

  /* ── isLevelUnlocked(lang, levelId, idx) ────────────── */
  isLevelUnlocked(lang, levelId, idx) {
    /* First level always unlocked */
    if (idx === 0) return true;
    return AppState.isLevelUnlocked(lang, levelId);
  },

  /* ── getCompletedTopicCount(lang, levelId, topics) ───── */
  getCompletedTopicCount(lang, levelId, topics) {
    var langProgress = AppState.getLanguageProgress(lang);
    var levelData = langProgress.levels[levelId];

    if (!levelData || !levelData.topics || !topics.length) return 0;

    return topics.filter(function (t) {
      var td = levelData.topics[t.id];
      return td && td.completed;
    }).length;
  },
};
