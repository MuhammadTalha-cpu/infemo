/* ============================================================
   INFEMO — STORIES & POEMS SCREEN
   Shows a grid of stories and poems. Clicking one opens
   a full reader with line-by-line audio, vocabulary notes,
   and a culture corner.
   ============================================================ */

var StoriesScreen = {
  _currentStoryId: null,
  _readStories: {},

  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-stories");
    if (!el) return;

    var lang = AppState.selectedLanguage || "de";
    this._readStories = Storage.get("read_stories_" + lang) || {};

    el.innerHTML = Sidebar.buildShell("#stories", this._buildMainContent());
    if (window.lucide) lucide.createIcons();
  },

  /* ── _buildMainContent() ────────────────────────────── */
  _buildMainContent() {
    if (this._currentStoryId) {
      return this._buildReaderView(this._currentStoryId);
    }
    return this._buildGridView();
  },

  /* ════════════════════════════════════════════════════
       GRID VIEW
    ════════════════════════════════════════════════════ */

  _buildGridView() {
    var stories = this._getStories();
    var self = this;

    if (!stories || stories.length === 0) {
      return `
                <div class="page-header entrance-1">
                    <div class="page-title">Stories & Poems</div>
                </div>
                <div class="card">
                    <div class="empty-state" style="padding:var(--space-10);">
                        <i data-lucide="book-text" class="empty-state-icon"></i>
                        <div class="empty-state-title">Coming Soon</div>
                        <div class="empty-state-text">
                            Stories and poems are being prepared for this level.
                        </div>
                    </div>
                </div>
            `;
    }

    var storyCount = stories.filter(function (s) {
      return s.type === "story";
    }).length;
    var poemCount = stories.filter(function (s) {
      return s.type === "poem";
    }).length;
    var readCount = Object.keys(this._readStories).length;

    var cardsHTML = stories
      .map(function (story) {
        return self._buildStoryCard(story);
      })
      .join("");

    return `
            <!-- Page Header -->
            <div class="page-header entrance-1">
                <div class="page-title">Stories & Poems</div>
                <div class="page-subtitle">
                    ${storyCount} stories · ${poemCount} poems ·
                    ${readCount} of ${stories.length} read
                </div>
            </div>

            <!-- Grid -->
            <div class="stories-grid entrance-2">
                ${cardsHTML}
            </div>
        `;
  },

  /* ── _buildStoryCard(story) ─────────────────────────── */
  _buildStoryCard(story) {
    var isRead = !!this._readStories[story.id];
    var typeClass =
      story.type === "poem" ? "story-type-poem" : "story-type-story";
    var typeLabel = story.type === "poem" ? "🎵 Poem" : "📖 Story";
    var typeIcon = story.type === "poem" ? "feather" : "book-text";

    var readBadge = isRead
      ? `<span class="story-card-read-badge">
                   <i data-lucide="check"></i> Read
               </span>`
      : "";

    return `
            <div class="story-card"
                 onclick="StoriesScreen._openStory('${story.id}')">

                <div class="story-card-top">
                    <span class="story-type-badge ${typeClass}">
                        ${typeLabel}
                    </span>
                    ${readBadge}
                </div>

                <div>
                    <div class="story-card-title">${story.title}</div>
                    <div class="story-card-subtitle">${story.subtitle}</div>
                </div>

                <div class="story-card-desc">${story.description}</div>

                <div class="story-card-meta">
                    <span class="story-card-meta-item">
                        <i data-lucide="clock"></i>
                        ${story.readTime} min read
                    </span>
                    <span class="story-card-meta-item">
                        <i data-lucide="type"></i>
                        ~${story.wordCount} words
                    </span>
                    <span class="story-card-meta-item">
                        <i data-lucide="bar-chart-2"></i>
                        ${story.level}
                    </span>
                </div>

            </div>
        `;
  },

  /* ════════════════════════════════════════════════════
       READER VIEW
    ════════════════════════════════════════════════════ */

  _buildReaderView(storyId) {
    var story = this._findStory(storyId);
    if (!story) return this._buildGridView();

    var lang = AppState.selectedLanguage || "de";
    var isRead = !!this._readStories[story.id];
    var typeClass =
      story.type === "poem" ? "story-type-poem" : "story-type-story";
    var typeLabel = story.type === "poem" ? "🎵 Poem" : "📖 Story";

    /* Build content HTML */
    var contentHTML = story.paragraphs
      ? story.paragraphs
          .map(function (para) {
            return StoriesScreen._buildParagraph(para, story.type, lang);
          })
          .join("")
      : "";

    /* Vocabulary section */
    var vocabHTML = "";
    if (story.vocabulary && story.vocabulary.length > 0) {
      var vocabItems = story.vocabulary
        .map(function (v) {
          return `
                    <div class="story-vocab-item">
                        <button class="audio-btn"
                                onclick="if(window.AudioEngine) AudioEngine.speak(
                                    '${v.word}', 'word', '${lang}');"
                                title="Hear ${v.word}"
                                style="flex-shrink:0;">
                            <i data-lucide="volume-2"></i>
                        </button>
                        <span class="story-vocab-word">${v.word}</span>
                        <span class="story-vocab-translation">${v.translation}</span>
                    </div>
                `;
        })
        .join("");

      vocabHTML = `
                <div class="story-vocab-section">
                    <div class="story-vocab-header">
                        <i data-lucide="book-open"></i>
                        New Vocabulary (${story.vocabulary.length} words)
                    </div>
                    <div class="story-vocab-grid">
                        ${vocabItems}
                    </div>
                </div>
            `;
    }

    /* Culture note */
    var cultureHTML = "";
    if (story.cultureNote) {
      cultureHTML = `
                <div class="story-culture-note">
                    <div class="story-culture-flag">🇩🇪</div>
                    <div class="story-culture-content">
                        <div class="story-culture-title">Culture Note</div>
                        <div class="story-culture-text">${story.cultureNote}</div>
                    </div>
                </div>
            `;
    }

    /* Find prev/next stories */
    var stories = this._getStories();
    var idx = stories.findIndex(function (s) {
      return s.id === storyId;
    });
    var prev = idx > 0 ? stories[idx - 1] : null;
    var next = idx < stories.length - 1 ? stories[idx + 1] : null;

    return `
            <!-- Back button -->
            <div style="margin-bottom:var(--space-5);">
                <button class="btn btn-ghost btn-sm"
                        onclick="StoriesScreen._closeStory()">
                    <i data-lucide="arrow-left"></i>
                    All Stories
                </button>
            </div>

            <div class="story-reader entrance-1">

                <!-- Header -->
                <div class="story-reader-header">
                    <div class="story-reader-type-row">
                        <span class="story-type-badge ${typeClass}">${typeLabel}</span>
                        <span class="tag">${story.level}</span>
                    </div>
                    <div class="story-reader-title">${story.title}</div>
                    <div class="story-reader-subtitle">${story.subtitle}</div>
                    <div class="story-reader-meta">
                        <span style="display:flex;align-items:center;gap:4px;">
                            <i data-lucide="clock"></i>
                            ${story.readTime} min read
                        </span>
                        <span style="display:flex;align-items:center;gap:4px;">
                            <i data-lucide="type"></i>
                            ~${story.wordCount} words
                        </span>
                        ${
                          isRead
                            ? `
                            <span style="display:flex;align-items:center;gap:4px;
                                         color:var(--success);">
                                <i data-lucide="check-circle"></i>
                                Read
                            </span>
                        `
                            : ""
                        }
                    </div>
                </div>

                <!-- Listen bar -->
                <div class="story-listen-bar">
                    <div class="story-listen-hint">
                        <i data-lucide="volume-2"></i>
                        Click any line to hear it in German
                    </div>
                    <button class="btn btn-primary btn-sm"
                            onclick="StoriesScreen._readAloud('${story.id}')">
                        <i data-lucide="play"></i>
                        Read Aloud (All)
                    </button>
                </div>

                <!-- Story Content -->
                <div class="story-content">
                    ${contentHTML}
                </div>

                <!-- Culture Note -->
                ${cultureHTML}

                <!-- Vocabulary -->
                ${vocabHTML}

                <!-- Action row -->
                <div class="story-action-row">
                    <div style="display:flex;gap:var(--space-2);">
                        ${
                          prev
                            ? `
                            <button class="btn btn-ghost btn-sm"
                                    onclick="StoriesScreen._openStory('${prev.id}')">
                                <i data-lucide="arrow-left"></i>
                                ${prev.title}
                            </button>
                        `
                            : ""
                        }
                    </div>
                    <div style="display:flex;gap:var(--space-2);align-items:center;">
                        ${
                          !isRead
                            ? `
                            <button class="btn btn-secondary"
                                    onclick="StoriesScreen._markAsRead('${story.id}')">
                                <i data-lucide="check"></i>
                                Mark as Read
                            </button>
                        `
                            : `
                            <span style="font-size:var(--text-sm);color:var(--success);
                                         display:flex;align-items:center;gap:var(--space-1);">
                                <i data-lucide="check-circle"></i>
                                Completed
                            </span>
                        `
                        }
                        ${
                          next
                            ? `
                            <button class="btn btn-primary btn-sm"
                                    onclick="StoriesScreen._openStory('${next.id}')">
                                ${next.title}
                                <i data-lucide="arrow-right"></i>
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>

            </div>
        `;
  },

  /* ── _buildParagraph(para, type, lang) ──────────────── */
  _buildParagraph(para, type, lang) {
    var linesHTML = para.lines
      .map(function (line) {
        var escapedDe = line.de.replace(/'/g, "\\'");
        return `
                <div class="story-line"
                     onclick="if(window.AudioEngine) AudioEngine.speak(
                         '${escapedDe}', 'sentence', '${lang}');">
                    <div class="story-line-text">
                        <div class="story-line-de">${line.de}</div>
                        <div class="story-line-en">${line.en}</div>
                    </div>
                    <button class="audio-btn"
                            onclick="event.stopPropagation();
                                     if(window.AudioEngine) AudioEngine.speak(
                                         '${escapedDe}', 'sentence', '${lang}');"
                            title="Hear this line"
                            style="flex-shrink:0;">
                        <i data-lucide="volume-2"></i>
                    </button>
                </div>
            `;
      })
      .join("");

    if (para.isStanza) {
      return `<div class="story-stanza">${linesHTML}</div>`;
    }
    return `<div class="story-paragraph">${linesHTML}</div>`;
  },

  /* ── Navigation ─────────────────────────────────────── */

  _openStory(storyId) {
    this._currentStoryId = storyId;
    var el = document.getElementById("screen-stories");
    if (!el) return;

    var wrap = el.querySelector(".content-wrap");
    if (wrap) {
      wrap.innerHTML = this._buildReaderView(storyId);
    } else {
      el.innerHTML = Sidebar.buildShell(
        "#stories",
        this._buildReaderView(storyId),
      );
    }

    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  _closeStory() {
    this._currentStoryId = null;
    var el = document.getElementById("screen-stories");
    if (!el) return;

    var wrap = el.querySelector(".content-wrap");
    if (wrap) {
      wrap.innerHTML = this._buildGridView();
    } else {
      el.innerHTML = Sidebar.buildShell("#stories", this._buildGridView());
    }

    if (window.lucide) lucide.createIcons();
  },

  /* ── _markAsRead(storyId) ───────────────────────────── */
  _markAsRead(storyId) {
    var lang = AppState.selectedLanguage || "de";
    this._readStories[storyId] = true;
    Storage.set("read_stories_" + lang, this._readStories);

    /* Show completion toast */
    if (window.App) {
      App.showToast("Story marked as read! 📖", "success");
    }

    /* Re-render reader to show completed state */
    this._openStory(storyId);
  },

  /* ── _readAloud(storyId) ────────────────────────────── */
  _readAloud(storyId) {
    var story = this._findStory(storyId);
    if (!story || !window.AudioEngine) return;

    var lang = AppState.selectedLanguage || "de";
    var lines = [];

    story.paragraphs.forEach(function (para) {
      para.lines.forEach(function (line) {
        lines.push(line.de);
      });
    });

    /* Speak lines sequentially with delays */
    var idx = 0;
    var speakNext = function () {
      if (idx >= lines.length) return;
      AudioEngine.speak(lines[idx], "sentence", lang);
      idx++;
      /* Rough estimate: 1 char ≈ 80ms at story speed */
      var delay = Math.max(2000, lines[idx - 1].length * 80);
      setTimeout(speakNext, delay);
    };

    speakNext();
  },

  /* ── _getStories() ──────────────────────────────────── */
  _getStories() {
    var lang = AppState.selectedLanguage || "de";
    if (lang === "de" && window.DEA1Stories) return DEA1Stories;
    return [];
  },

  /* ── _findStory(id) ─────────────────────────────────── */
  _findStory(id) {
    var stories = this._getStories();
    return (
      stories.find(function (s) {
        return s.id === id;
      }) || null
    );
  },
};
