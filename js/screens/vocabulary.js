/* ============================================================
   INFEMO — VOCABULARY BOOK
   Searchable, filterable word list with mastery tracking.

   Features:
   • Search by German word or English translation
   • Filter by topic or mastery level
   • Article badges colored by grammatical gender
   • Mastery dot shows SRS level for each word
   • Star toggle synced with Flashcards screen
   • Click any word for full detail view with audio
   ============================================================ */

var VocabularyScreen = {
  /* ── State ──────────────────────────────────────────── */
  _allWords: [],
  _srsData: {},
  _starred: {},
  _searchQuery: "",
  _topicFilter: "all",
  _masteryFilter: "all",

  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-vocabulary");
    if (!el) return;

    this._loadData();

    el.innerHTML = Sidebar.buildShell("#vocabulary", this._buildMainContent());
    if (window.lucide) lucide.createIcons();
    this._attachListeners();
    this._renderList();
  },

  /* ── _loadData() ────────────────────────────────────── */
  _loadData() {
    var lang = AppState.selectedLanguage || "de";
    this._srsData = Storage.get("srs_" + lang) || {};
    this._starred = Storage.get("starred_" + lang) || {};
    this._allWords = this._getWords();
  },

  /* ── _saveData() ────────────────────────────────────── */
  _saveData() {
    var lang = AppState.selectedLanguage || "de";
    Storage.set("srs_" + lang, this._srsData);
    Storage.set("starred_" + lang, this._starred);
  },

  /* ── _getWords() ────────────────────────────────────── */
  _getWords() {
    var lang = AppState.selectedLanguage || "de";
    if (lang === "de" && window.DEA1Vocabulary) return DEA1Vocabulary;
    return [];
  },

  /* ── _buildMainContent() ────────────────────────────── */
  _buildMainContent() {
    /* Build topic list from words */
    var topics = this._getTopics();
    var topicOptions = topics
      .map(function (t) {
        return `<option value="${t.id}">${t.name}</option>`;
      })
      .join("");

    return `
            <!-- Page Header -->
            <div class="page-header entrance-1">
                <div class="page-title">Vocabulary Book</div>
                <div class="page-subtitle">
                    All ${this._allWords.length} German A1 words —
                    click any word to see details and hear pronunciation
                </div>
            </div>

            <!-- Toolbar -->
            <div class="vocab-toolbar entrance-2">

                <!-- Search -->
                <div class="vocab-search-wrap">
                    <i data-lucide="search"></i>
                    <input
                        class="input vocab-search-input"
                        type="text"
                        id="vocab-search"
                        placeholder="Search words or translations..."
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        value="${this._searchQuery}"
                    />
                </div>

                <!-- Topic filter -->
                <select class="input" id="vocab-topic-filter"
                        style="width:auto;min-width:140px;">
                    <option value="all">All Topics</option>
                    ${topicOptions}
                </select>

                <!-- Mastery filter -->
                <select class="input" id="vocab-mastery-filter"
                        style="width:auto;min-width:130px;">
                    <option value="all">All Mastery</option>
                    <option value="new">New</option>
                    <option value="learning">Learning</option>
                    <option value="review">Review</option>
                    <option value="mastered">Mastered</option>
                    <option value="starred">★ Starred</option>
                </select>

            </div>

            <!-- Stats bar -->
            ${this._buildStatsBar()}

            <!-- Results count + list -->
            <div class="entrance-3">
                <div class="vocab-results-count" id="vocab-count"></div>
                <div class="vocab-list" id="vocab-list"></div>
            </div>
        `;
  },

  /* ── _buildStatsBar() ───────────────────────────────── */
  _buildStatsBar() {
    var words = this._allWords;
    var srs = this._srsData;

    var counts = { new: 0, learning: 0, review: 0, mastered: 0 };
    words.forEach(function (w) {
      var d = srs[w.id];
      if (!d || d.mastery === 0) counts.new++;
      else if (d.mastery === 1) counts.learning++;
      else if (d.mastery === 2) counts.review++;
      else if (d.mastery === 3) counts.mastered++;
    });

    return `
            <div class="vocab-stats-row entrance-2">
                <div class="vocab-stat">
                    <div class="vocab-stat-dot"
                         style="background:var(--border-strong);"></div>
                    <span>New:</span>
                    <span class="vocab-stat-count">${counts.new}</span>
                </div>
                <div class="vocab-stat">
                    <div class="vocab-stat-dot"
                         style="background:var(--warning);"></div>
                    <span>Learning:</span>
                    <span class="vocab-stat-count">${counts.learning}</span>
                </div>
                <div class="vocab-stat">
                    <div class="vocab-stat-dot"
                         style="background:var(--primary);"></div>
                    <span>Review:</span>
                    <span class="vocab-stat-count">${counts.review}</span>
                </div>
                <div class="vocab-stat">
                    <div class="vocab-stat-dot"
                         style="background:var(--success);"></div>
                    <span>Mastered:</span>
                    <span class="vocab-stat-count">${counts.mastered}</span>
                </div>
                <div class="vocab-stat" style="margin-left:auto;">
                    <i data-lucide="star"
                       style="width:14px;height:14px;color:var(--warning);"></i>
                    <span>Starred:</span>
                    <span class="vocab-stat-count">
                        ${Object.keys(this._starred).length}
                    </span>
                </div>
            </div>
        `;
  },

  /* ── _getTopics() ───────────────────────────────────── */
  _getTopics() {
    var seen = {};
    var topics = [];
    this._allWords.forEach(function (w) {
      if (w.topic && !seen[w.topic]) {
        seen[w.topic] = true;
        /* Prettify topic name */
        var name = w.topic.replace(/-/g, " ").replace(/\b\w/g, function (c) {
          return c.toUpperCase();
        });
        topics.push({ id: w.topic, name: name });
      }
    });
    return topics;
  },

  /* ── _attachListeners() ─────────────────────────────── */
  _attachListeners() {
    var self = this;

    /* Search input */
    var searchInput = document.getElementById("vocab-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        self._searchQuery = this.value.trim().toLowerCase();
        self._renderList();
      });
    }

    /* Topic filter */
    var topicSel = document.getElementById("vocab-topic-filter");
    if (topicSel) {
      topicSel.value = this._topicFilter;
      topicSel.addEventListener("change", function () {
        self._topicFilter = this.value;
        self._renderList();
      });
    }

    /* Mastery filter */
    var masterySel = document.getElementById("vocab-mastery-filter");
    if (masterySel) {
      masterySel.value = this._masteryFilter;
      masterySel.addEventListener("change", function () {
        self._masteryFilter = this.value;
        self._renderList();
      });
    }
  },

  /* ── _filterWords() ─────────────────────────────────── */
  _filterWords() {
    var self = this;
    var words = this._allWords;
    var query = this._searchQuery;
    var topic = this._topicFilter;
    var mastery = this._masteryFilter;
    var srs = this._srsData;
    var starred = this._starred;

    return words.filter(function (w) {
      /* Search filter */
      if (query) {
        var haystack = (w.word + " " + w.translation).toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      /* Topic filter */
      if (topic !== "all" && w.topic !== topic) return false;

      /* Mastery filter */
      if (mastery !== "all") {
        var d = srs[w.id];
        var mLevel = d ? d.mastery || 0 : 0;

        if (mastery === "starred") {
          if (!starred[w.id]) return false;
        } else if (mastery === "new" && mLevel !== 0) {
          return false;
        } else if (mastery === "learning" && mLevel !== 1) {
          return false;
        } else if (mastery === "review" && mLevel !== 2) {
          return false;
        } else if (mastery === "mastered" && mLevel !== 3) {
          return false;
        }
      }

      return true;
    });
  },

  /* ── _renderList() ──────────────────────────────────── */
  _renderList() {
    var listEl = document.getElementById("vocab-list");
    var countEl = document.getElementById("vocab-count");
    if (!listEl) return;

    var filtered = this._filterWords();
    var lang = AppState.selectedLanguage || "de";
    var srs = this._srsData;
    var starred = this._starred;
    var self = this;

    /* Results count */
    if (countEl) {
      countEl.textContent =
        filtered.length + " of " + this._allWords.length + " words";
    }

    /* Empty state */
    if (filtered.length === 0) {
      listEl.innerHTML = `
                <div class="vocab-empty">
                    <div style="font-size:48px;margin-bottom:var(--space-4);">🔍</div>
                    <div class="heading-3" style="margin-bottom:var(--space-2);">
                        No words found
                    </div>
                    <div class="text-body-sm" style="color:var(--text-secondary);">
                        Try adjusting your search or filters.
                    </div>
                </div>
            `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    /* Build rows */
    listEl.innerHTML = filtered
      .map(function (w) {
        var srsEntry = srs[w.id];
        var mastery = srsEntry ? srsEntry.mastery || 0 : 0;
        var isStarred = !!starred[w.id];

        /* Article badge */
        var articleHTML = "";
        if (w.article && w.gender) {
          var badgeClass =
            w.gender === "der"
              ? "badge-der"
              : w.gender === "die"
                ? "badge-die"
                : "badge-das";
          articleHTML = `<span class="badge ${badgeClass}"
                                     style="font-size:11px;padding:2px 7px;">
                                   ${w.article}
                               </span>`;
        }

        /* Mastery dot color */
        var dotColor =
          mastery === 3
            ? "var(--success)"
            : mastery === 2
              ? "var(--primary)"
              : mastery === 1
                ? "var(--warning)"
                : "var(--border-strong)";

        /* Part of speech badge */
        var posBadge = `<span style="font-size:10px;font-weight:var(--weight-semibold);
                                        text-transform:uppercase;letter-spacing:0.4px;
                                        color:var(--text-muted);background:var(--surface-2);
                                        border-radius:var(--radius-full);
                                        padding:1px 6px;margin-left:4px;">
                                ${w.pos || ""}
                            </span>`;

        return `
                <div class="vocab-row"
                     onclick="VocabularyScreen._showDetail('${w.id}')">

                    <!-- Article badge -->
                    <div class="vocab-row-article"
                         style="min-width:36px;">
                        ${articleHTML}
                    </div>

                    <!-- Main content -->
                    <div class="vocab-row-main">
                        <div class="vocab-row-word">
                            ${w.word}
                            ${
                              w.plural
                                ? `<span class="vocab-row-plural">
                                pl. ${w.plural}
                            </span>`
                                : ""
                            }
                            ${posBadge}
                        </div>
                        <div class="vocab-row-translation">
                            ${w.translation}
                        </div>
                    </div>

                    <!-- Right side: mastery dot + star + audio -->
                    <div class="vocab-row-meta">
                        <div class="vocab-mastery-dot"
                             style="background:${dotColor};"
                             title="${
                               window.SpacedRep
                                 ? SpacedRep.getMasteryLabel(mastery)
                                 : ""
                             }">
                        </div>
                    </div>

                    <div class="vocab-row-actions">
                        <button class="audio-btn"
                                data-text="${w.word}"
                                data-context="word"
                                data-lang="${lang}"
                                title="Hear ${w.word}"
                                onclick="event.stopPropagation();
                                         if(window.AudioEngine) AudioEngine.speak(
                                             '${w.word}','word','${lang}');">
                            <i data-lucide="volume-2"></i>
                        </button>
                        <button class="audio-btn"
                                title="${isStarred ? "Unstar" : "Star"}"
                                style="color:${isStarred ? "var(--warning)" : "var(--text-muted)"};"
                                id="star-btn-${w.id}"
                                onclick="event.stopPropagation();
                                         VocabularyScreen._toggleStar('${w.id}');">
                            <i data-lucide="star"></i>
                        </button>
                    </div>

                </div>
            `;
      })
      .join("");

    if (window.lucide) lucide.createIcons();
  },

  /* ── _toggleStar(wordId) ────────────────────────────── */
  _toggleStar(wordId) {
    if (this._starred[wordId]) {
      delete this._starred[wordId];
    } else {
      this._starred[wordId] = true;
    }
    this._saveData();

    /* Update star button color inline */
    var btn = document.getElementById("star-btn-" + wordId);
    if (btn) {
      var isNowStarred = !!this._starred[wordId];
      btn.style.color = isNowStarred ? "var(--warning)" : "var(--text-muted)";
    }
  },

  /* ── _showDetail(wordId) ────────────────────────────── */
  _showDetail(wordId) {
    var word = this._allWords.find(function (w) {
      return w.id === wordId;
    });
    if (!word) return;

    var lang = AppState.selectedLanguage || "de";
    var srsEntry = this._srsData[wordId];
    var mastery = srsEntry ? srsEntry.mastery || 0 : 0;
    var isStarred = !!this._starred[wordId];

    /* Mastery label and color */
    var masteryLabel = window.SpacedRep
      ? SpacedRep.getMasteryLabel(mastery)
      : "New";
    var masteryColor = window.SpacedRep
      ? SpacedRep.getMasteryColor(mastery)
      : "var(--text-muted)";

    /* Article badge */
    var articleHTML = "";
    if (word.article && word.gender) {
      var badgeClass =
        word.gender === "der"
          ? "badge-der"
          : word.gender === "die"
            ? "badge-die"
            : "badge-das";
      articleHTML = `<span class="badge ${badgeClass}">
                               ${word.article}
                           </span>`;
    }

    /* SRS details */
    var reviewed = srsEntry ? srsEntry.timesReviewed || 0 : 0;
    var lastRev =
      srsEntry && srsEntry.lastReviewed ? srsEntry.lastReviewed : "—";
    var nextRev = srsEntry && srsEntry.nextReview ? srsEntry.nextReview : "—";

    App.showModal({
      title: "",
      body: `
                <!-- Word Header -->
                <div class="vocab-detail-header">
                    <div>
                        <div class="vocab-detail-word">${word.word}</div>
                        <div class="vocab-detail-meta">
                            ${articleHTML}
                            ${
                              word.plural
                                ? `
                                <span style="font-size:var(--text-sm);
                                             color:var(--text-muted);">
                                    pl. ${word.plural}
                                </span>
                            `
                                : ""
                            }
                            <span style="font-size:10px;font-weight:var(--weight-bold);
                                         text-transform:uppercase;letter-spacing:0.4px;
                                         color:var(--text-muted);
                                         background:var(--surface-2);
                                         border-radius:var(--radius-full);
                                         padding:2px 7px;">
                                ${word.pos || ""}
                            </span>
                            <span style="font-size:var(--text-xs);font-weight:var(--weight-semibold);
                                         color:${masteryColor};">
                                ${masteryLabel}
                            </span>
                        </div>
                    </div>
                    <div style="display:flex;gap:var(--space-2);flex-shrink:0;">
                        <button class="audio-btn"
                                style="width:40px;height:40px;"
                                onclick="if(window.AudioEngine) AudioEngine.speak(
                                    '${word.word}','word','${lang}');"
                                title="Hear word">
                            <i data-lucide="volume-2"></i>
                        </button>
                        <button class="audio-btn"
                                style="width:40px;height:40px;
                                       color:${isStarred ? "var(--warning)" : "var(--text-muted)"};"
                                id="detail-star-${word.id}"
                                onclick="VocabularyScreen._toggleStar('${word.id}');
                                         var btn=document.getElementById('detail-star-${word.id}');
                                         if(btn) btn.style.color=VocabularyScreen._starred['${word.id}']
                                             ?'var(--warning)':'var(--text-muted)';"
                                title="${isStarred ? "Unstar" : "Star this word"}">
                            <i data-lucide="star"></i>
                        </button>
                    </div>
                </div>

                <!-- Translation -->
                <div class="vocab-detail-translation">${word.translation}</div>

                <!-- Example Sentence -->
                <div class="vocab-detail-section">
                    <div class="vocab-detail-section-title">Example</div>
                    <div style="display:flex;align-items:flex-start;gap:var(--space-3);">
                        <button class="audio-btn"
                                onclick="if(window.AudioEngine) AudioEngine.speak(
                                    '${word.exampleDE}','sentence','${lang}');"
                                title="Hear example sentence"
                                style="flex-shrink:0;margin-top:2px;">
                            <i data-lucide="volume-2"></i>
                        </button>
                        <div>
                            <div class="vocab-detail-example-de">
                                ${word.exampleDE}
                            </div>
                            <div class="vocab-detail-example-en">
                                ${word.exampleEN}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SRS Info -->
                <div class="vocab-detail-section">
                    <div class="vocab-detail-section-title">Study Progress</div>
                    <div class="vocab-detail-srs">
                        <div class="vocab-detail-srs-item">
                            <div class="vocab-detail-srs-label">Mastery</div>
                            <div class="vocab-detail-srs-value"
                                 style="color:${masteryColor};">
                                ${masteryLabel}
                            </div>
                        </div>
                        <div style="width:1px;background:var(--border);
                                    align-self:stretch;"></div>
                        <div class="vocab-detail-srs-item">
                            <div class="vocab-detail-srs-label">Times Reviewed</div>
                            <div class="vocab-detail-srs-value">${reviewed}</div>
                        </div>
                        <div style="width:1px;background:var(--border);
                                    align-self:stretch;"></div>
                        <div class="vocab-detail-srs-item">
                            <div class="vocab-detail-srs-label">Next Review</div>
                            <div class="vocab-detail-srs-value">${nextRev}</div>
                        </div>
                    </div>
                </div>

                <!-- Topic badge -->
                <div class="vocab-detail-section">
                    <div class="vocab-detail-section-title">Topic</div>
                    <span class="tag tag-active" style="text-transform:capitalize;">
                        ${(word.topic || "").replace(/-/g, " ")}
                    </span>
                </div>

                <!-- Flashcard button -->
                <div style="margin-top:var(--space-4);">
                    <button class="btn btn-primary btn-sm"
                            onclick="document.querySelector('.modal-overlay')?.remove();
                                     Router.navigate('#flashcards');">
                        <i data-lucide="credit-card"></i>
                        Practice in Flashcards
                    </button>
                </div>
            `,
    });

    /* Auto-play the word on modal open */
    setTimeout(function () {
      if (window.AudioEngine) AudioEngine.speak(word.word, "word", lang);
      if (window.lucide) lucide.createIcons();
    }, 200);
  },
};
