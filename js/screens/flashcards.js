/* ============================================================
   INFEMO — FLASHCARDS SCREEN
   Spaced repetition flashcard system.

   Data flow:
   • Source words come from data/de/a1/vocabulary.js
   • SRS data (mastery, nextReview) saved in localStorage
   • Starred words saved separately in localStorage
   • Everything merged at session start

   Flip mechanic:
   • Click the card → flips to reveal translation
   • Rating buttons appear after flip
   • Rating saves SRS data and loads next card
   ============================================================ */

var FlashcardsScreen = {
  /* ── Session State ──────────────────────────────────── */
  _deck: [], // cards for this session (shuffled)
  _sessionIdx: 0, // current position in deck
  _againQueue: [], // cards rated 0 (show again)
  _flipped: false,
  _sessionCorrect: 0,
  _sessionTotal: 0,
  _activeFilter: "due",

  /* ── Persisted State ────────────────────────────────── */
  _srsData: {}, // { wordId: { mastery, nextReview, timesReviewed } }
  _starred: {}, // { wordId: true }

  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-flashcards");
    if (!el) return;

    this._loadData();

    el.innerHTML = Sidebar.buildShell("#flashcards", this._buildMainContent());
    if (window.lucide) lucide.createIcons();
    this._startSession(this._activeFilter);
  },

  /* ── _buildMainContent() ────────────────────────────── */
  _buildMainContent() {
    return `
            <div class="page-header entrance-1">
                <div class="page-title">Flashcards</div>
                <div class="page-subtitle">
                    Spaced repetition — the most effective way to memorise vocabulary
                </div>
            </div>

            <!-- Filter bar -->
            <div class="fc-filter-bar entrance-2">
                <span class="fc-filter-label">Deck:</span>
                ${this._buildFilterChips()}
            </div>

            <!-- Mastery bar -->
            <div id="fc-mastery-bar" class="entrance-2"></div>

            <!-- Session area — cards, ratings, complete screen -->
            <div class="flashcards-layout entrance-3" id="fc-session-area">
                <!-- filled by _renderCard() or _renderComplete() -->
            </div>
        `;
  },

  /* ── _buildFilterChips() ────────────────────────────── */
  _buildFilterChips() {
    var self = this;
    var filters = [
      { key: "due", label: "Due Today" },
      { key: "new", label: "New" },
      { key: "all", label: "All Words" },
      { key: "starred", label: "★ Starred" },
    ];

    return filters
      .map(function (f) {
        var isActive = self._activeFilter === f.key;
        return `
                <button class="tag tag-clickable ${isActive ? "tag-active" : ""}"
                        onclick="FlashcardsScreen._changeFilter('${f.key}')">
                    ${f.label}
                </button>
            `;
      })
      .join("");
  },

  /* ── _changeFilter(filter) ──────────────────────────── */
  _changeFilter(filter) {
    this._activeFilter = filter;

    /* Rebuild filter bar */
    var filterBar = document.querySelector(".fc-filter-bar");
    if (filterBar) {
      filterBar.innerHTML =
        '<span class="fc-filter-label">Deck:</span>' + this._buildFilterChips();
    }
    if (window.lucide) lucide.createIcons();

    this._startSession(filter);
  },

  /* ── _loadData() ────────────────────────────────────── */
  _loadData() {
    var lang = AppState.selectedLanguage || "de";
    this._srsData = Storage.get("srs_" + lang) || {};
    this._starred = Storage.get("starred_" + lang) || {};
  },

  /* ── _saveData() ────────────────────────────────────── */
  _saveData() {
    var lang = AppState.selectedLanguage || "de";
    Storage.set("srs_" + lang, this._srsData);
    Storage.set("starred_" + lang, this._starred);
  },

  /* ── _getAllWords() ──────────────────────────────────── */
  _getAllWords() {
    var lang = AppState.selectedLanguage || "de";
    if (lang === "de" && window.DEA1Vocabulary) {
      return DEA1Vocabulary;
    }
    return [];
  },

  /* ── _buildDeck(filter) ─────────────────────────────── */
  _buildDeck(filter) {
    var allWords = this._getAllWords();
    var srsData = this._srsData;
    var starred = this._starred;
    var self = this;

    switch (filter) {
      case "due":
        var due = SpacedRep.getDueCards(allWords, srsData);
        return due.length > 0 ? due : allWords.slice(0, 10);

      case "new":
        return allWords.filter(function (w) {
          return !srsData[w.id];
        });

      case "starred":
        return allWords.filter(function (w) {
          return !!starred[w.id];
        });

      case "all":
      default:
        return allWords.slice();
    }
  },

  /* ── _shuffle(array) ────────────────────────────────── */
  _shuffle(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  },

  /* ── _startSession(filter) ──────────────────────────── */
  _startSession(filter) {
    var deck = this._buildDeck(filter);
    this._deck = this._shuffle(deck);
    this._sessionIdx = 0;
    this._againQueue = [];
    this._flipped = false;
    this._sessionCorrect = 0;
    this._sessionTotal = 0;

    this._updateMasteryBar();

    if (this._deck.length === 0) {
      this._renderNoCards(filter);
    } else {
      this._renderCard();
    }
  },

  /* ── _renderCard() ──────────────────────────────────── */
  _renderCard() {
    var area = document.getElementById("fc-session-area");
    if (!area) return;

    this._flipped = false;

    /* Get current card */
    var card = this._getCurrentCard();
    if (!card) {
      /* Check again queue */
      if (this._againQueue.length > 0) {
        this._deck = this._shuffle(this._againQueue);
        this._sessionIdx = 0;
        this._againQueue = [];
        card = this._getCurrentCard();
        if (!card) {
          this._renderComplete();
          return;
        }
      } else {
        this._renderComplete();
        return;
      }
    }

    var lang = AppState.selectedLanguage || "de";
    var srs = this._srsData[card.id] || { mastery: 0 };
    var isStarred = !!this._starred[card.id];
    var remaining =
      this._deck.length - this._sessionIdx + this._againQueue.length;

    var articleBadge = "";
    if (card.article && card.gender) {
      var badgeClass =
        card.gender === "der"
          ? "badge-der"
          : card.gender === "die"
            ? "badge-die"
            : "badge-das";
      articleBadge = `<span class="badge ${badgeClass} fc-article-badge">${card.article}</span>`;
    }

    area.innerHTML = `

            <!-- Session Stats Bar -->
            <div class="fc-session-bar">
                <div class="fc-session-stat">
                    <div class="fc-session-value" style="color:var(--primary);">
                        ${remaining}
                    </div>
                    <div class="fc-session-label">Remaining</div>
                </div>
                <div class="fc-session-divider"></div>
                <div class="fc-session-stat">
                    <div class="fc-session-value" style="color:var(--success);">
                        ${this._sessionCorrect}
                    </div>
                    <div class="fc-session-label">Correct</div>
                </div>
                <div class="fc-session-divider"></div>
                <div class="fc-session-stat">
                    <div class="fc-session-value"
                         style="color:${SpacedRep.getMasteryColor(srs.mastery || 0)};">
                        ${SpacedRep.getMasteryLabel(srs.mastery || 0)}
                    </div>
                    <div class="fc-session-label">Status</div>
                </div>
                <div class="fc-session-divider"></div>
                <div class="fc-session-stat">
                    <button class="audio-btn"
                            onclick="FlashcardsScreen._toggleStar('${card.id}')"
                            title="${isStarred ? "Unstar" : "Star this word"}"
                            style="color:${isStarred ? "var(--warning)" : "var(--text-muted)"};"
                            id="fc-star-btn">
                        <i data-lucide="${isStarred ? "star" : "star"}"></i>
                    </button>
                    <div class="fc-session-label">${isStarred ? "Starred" : "Star"}</div>
                </div>
            </div>

            <!-- FLIP CARD -->
            <div class="fc-card-wrap">
                <div class="flip-card" id="fc-flip-card"
                     style="width:100%;height:280px;"
                     onclick="FlashcardsScreen._flipCard()">
                    <div class="flip-card-inner">

                        <!-- FRONT -->
                        <div class="flip-card-front">
                            <div class="fc-front-content">
                                ${articleBadge}
                                <div class="fc-word">${card.word}</div>
                                <button class="audio-btn"
                                        data-text="${card.word}"
                                        data-context="word"
                                        data-lang="${lang}"
                                        title="Hear pronunciation"
                                        onclick="event.stopPropagation(); if(window.AudioEngine) AudioEngine.speak('${card.word}', 'word', '${lang}');">
                                    <i data-lucide="volume-2"></i>
                                </button>
                                <div class="fc-pos-tag">${card.pos || "word"}</div>
                                <div class="flip-hint">
                                    <i data-lucide="mouse-pointer-click"></i>
                                    Click to reveal
                                </div>
                            </div>
                        </div>

                        <!-- BACK -->
                        <div class="flip-card-back">
                            <div class="fc-back-content">
                                <div class="fc-translation">${card.translation}</div>
                                <div class="fc-example-divider"></div>
                                <div class="fc-example-de">${card.exampleDE}</div>
                                <div class="fc-example-audio-row">
                                    <button class="audio-btn"
                                            data-text="${card.exampleDE}"
                                            data-context="sentence"
                                            data-lang="${lang}"
                                            title="Hear example sentence"
                                            onclick="event.stopPropagation(); if(window.AudioEngine) AudioEngine.speak('${card.exampleDE}', 'sentence', '${lang}');">
                                        <i data-lucide="volume-2"></i>
                                    </button>
                                </div>
                                <div class="fc-example-en">${card.exampleEN}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Rating buttons (hidden until flipped) -->
            <div id="fc-ratings-area" style="width:100%;display:none;">
                <div class="fc-ratings">
                    <button class="fc-rating-btn fc-rating-0"
                            onclick="FlashcardsScreen._rate(0)">
                        <span class="fc-rating-icon">✗</span>
                        <span class="fc-rating-label">Don't Know</span>
                        <span class="fc-rating-interval">Try again</span>
                    </button>
                    <button class="fc-rating-btn fc-rating-1"
                            onclick="FlashcardsScreen._rate(1)">
                        <span class="fc-rating-icon">〜</span>
                        <span class="fc-rating-label">Almost</span>
                        <span class="fc-rating-interval">1 day</span>
                    </button>
                    <button class="fc-rating-btn fc-rating-2"
                            onclick="FlashcardsScreen._rate(2)">
                        <span class="fc-rating-icon">✓</span>
                        <span class="fc-rating-label">Know It</span>
                        <span class="fc-rating-interval">3 days</span>
                    </button>
                    <button class="fc-rating-btn fc-rating-3"
                            onclick="FlashcardsScreen._rate(3)">
                        <span class="fc-rating-icon">★</span>
                        <span class="fc-rating-label">Mastered</span>
                        <span class="fc-rating-interval">7 days</span>
                    </button>
                </div>
            </div>

        `;

    if (window.lucide) lucide.createIcons();

    /* Auto-play audio */
    setTimeout(function () {
      if (window.AudioEngine && card.word) {
        AudioEngine.speak(card.word, "word", lang);
      }
    }, 400);
  },

  /* ── _flipCard() ────────────────────────────────────── */
  _flipCard() {
    if (this._flipped) return;
    this._flipped = true;

    var card = document.getElementById("fc-flip-card");
    if (card) card.classList.add("flipped");

    var ratings = document.getElementById("fc-ratings-area");
    if (ratings) {
      ratings.style.display = "block";
      ratings.classList.add("animate-slide-up");
    }

    /* Auto-play example sentence after flip */
    var lang = AppState.selectedLanguage || "de";
    var current = this._getCurrentCard();
    if (current && window.AudioEngine) {
      setTimeout(function () {
        AudioEngine.speak(current.exampleDE, "sentence", lang);
      }, 600);
    }
  },

  /* ── _rate(rating) ──────────────────────────────────── */
  _rate(rating) {
    var card = this._getCurrentCard();
    if (!card) return;

    this._sessionTotal++;
    if (rating >= 2) this._sessionCorrect++;

    /* Update SRS data */
    var oldSrs = this._srsData[card.id] || { mastery: 0, timesReviewed: 0 };
    this._srsData[card.id] = SpacedRep.updateCard(oldSrs, rating);
    this._saveData();

    /* If Don't Know (0), add to again queue */
    if (rating === 0) {
      this._againQueue.push(card);
    }

    /* Advance */
    this._sessionIdx++;
    this._renderCard();
  },

  /* ── _getCurrentCard() ──────────────────────────────── */
  _getCurrentCard() {
    return this._deck[this._sessionIdx] || null;
  },

  /* ── _toggleStar(wordId) ────────────────────────────── */
  _toggleStar(wordId) {
    if (this._starred[wordId]) {
      delete this._starred[wordId];
    } else {
      this._starred[wordId] = true;
    }
    this._saveData();

    /* Update star button */
    var btn = document.getElementById("fc-star-btn");
    if (btn) {
      var isNowStarred = !!this._starred[wordId];
      btn.style.color = isNowStarred ? "var(--warning)" : "var(--text-muted)";
    }
  },

  /* ── _renderNoCards(filter) ─────────────────────────── */
  _renderNoCards(filter) {
    var area = document.getElementById("fc-session-area");
    if (!area) return;

    var messages = {
      due: "No cards are due today. Great job keeping up!",
      new: 'You have reviewed all new words. Try "Due Today" or "All Words".',
      starred:
        "You have not starred any words yet. Star words in the Vocabulary Book.",
      all: "No vocabulary found. Complete some lessons first.",
    };

    area.innerHTML = `
            <div class="fc-no-cards">
                <div style="font-size:56px;margin-bottom:var(--space-4);">🎉</div>
                <div class="heading-2" style="margin-bottom:var(--space-3);">
                    All Clear!
                </div>
                <div class="text-body-sm" style="margin-bottom:var(--space-6);max-width:320px;margin-left:auto;margin-right:auto;">
                    ${messages[filter] || messages.all}
                </div>
                <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">
                    <button class="btn btn-secondary"
                            onclick="FlashcardsScreen._changeFilter('all')">
                        <i data-lucide="layers"></i>
                        Review All Words
                    </button>
                    <button class="btn btn-primary"
                            onclick="Router.navigate('#dashboard')">
                        <i data-lucide="home"></i>
                        Dashboard
                    </button>
                </div>
            </div>
        `;

    if (window.lucide) lucide.createIcons();
  },

  /* ── _renderComplete() ──────────────────────────────── */
  _renderComplete() {
    var area = document.getElementById("fc-session-area");
    if (!area) return;

    var total = this._sessionTotal;
    var correct = this._sessionCorrect;
    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    var emoji = pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📚";

    this._updateMasteryBar();

    area.innerHTML = `
            <div class="fc-complete">
                <div class="fc-complete-emoji">${emoji}</div>
                <div class="fc-complete-title">Session Complete!</div>
                <div class="fc-complete-sub">
                    ${
                      pct >= 80
                        ? "Outstanding! Your memory is improving."
                        : pct >= 60
                          ? "Good work! Keep reviewing regularly."
                          : "Keep going! Repetition builds memory."
                    }
                </div>

                <div class="fc-complete-stats">
                    <div class="fc-complete-stat">
                        <div class="fc-complete-value">${total}</div>
                        <div class="fc-complete-label">Reviewed</div>
                    </div>
                    <div style="width:1px;background:var(--border);"></div>
                    <div class="fc-complete-stat">
                        <div class="fc-complete-value"
                             style="color:var(--success);">${correct}</div>
                        <div class="fc-complete-label">Correct</div>
                    </div>
                    <div style="width:1px;background:var(--border);"></div>
                    <div class="fc-complete-stat">
                        <div class="fc-complete-value"
                             style="color:${pct >= 60 ? "var(--success)" : "var(--error)"};">
                            ${pct}%
                        </div>
                        <div class="fc-complete-label">Accuracy</div>
                    </div>
                </div>

                <div class="fc-complete-actions">
                    <button class="btn btn-ghost"
                            onclick="FlashcardsScreen._changeFilter('due')">
                        <i data-lucide="refresh-cw"></i>
                        Review Again
                    </button>
                    <button class="btn btn-secondary"
                            onclick="FlashcardsScreen._changeFilter('all')">
                        <i data-lucide="layers"></i>
                        All Words
                    </button>
                    <button class="btn btn-primary"
                            onclick="Router.navigate('#dashboard')">
                        <i data-lucide="home"></i>
                        Dashboard
                    </button>
                </div>
            </div>
        `;

    if (window.lucide) lucide.createIcons();
  },

  /* ── _updateMasteryBar() ────────────────────────────── */
  _updateMasteryBar() {
    var barEl = document.getElementById("fc-mastery-bar");
    if (!barEl) return;

    var allWords = this._getAllWords();
    var stats = SpacedRep.getStats(allWords, this._srsData);
    var total = allWords.length;

    if (total === 0) {
      barEl.innerHTML = "";
      return;
    }

    var pNew = Math.round((stats.new / total) * 100);
    var pLearning = Math.round((stats.learning / total) * 100);
    var pReview = Math.round((stats.review / total) * 100);
    var pMastered = Math.round((stats.mastered / total) * 100);

    barEl.innerHTML = `
            <div class="fc-mastery-bar">
                <div class="fc-mastery-title">
                    Vocabulary Mastery — ${total} words · ${stats.due} due today
                </div>
                <div class="fc-mastery-track">
                    <div class="fc-mastery-segment"
                         style="width:${pMastered}%;background:var(--success);"></div>
                    <div class="fc-mastery-segment"
                         style="width:${pReview}%;background:var(--primary);"></div>
                    <div class="fc-mastery-segment"
                         style="width:${pLearning}%;background:var(--warning);"></div>
                    <div class="fc-mastery-segment"
                         style="width:${pNew}%;background:var(--border);"></div>
                </div>
                <div class="fc-mastery-legend">
                    <div class="fc-mastery-legend-item">
                        <div class="fc-mastery-legend-dot"
                             style="background:var(--success);"></div>
                        Mastered (${stats.mastered})
                    </div>
                    <div class="fc-mastery-legend-item">
                        <div class="fc-mastery-legend-dot"
                             style="background:var(--primary);"></div>
                        Review (${stats.review})
                    </div>
                    <div class="fc-mastery-legend-item">
                        <div class="fc-mastery-legend-dot"
                             style="background:var(--warning);"></div>
                        Learning (${stats.learning})
                    </div>
                    <div class="fc-mastery-legend-item">
                        <div class="fc-mastery-legend-dot"
                             style="background:var(--border-strong);"></div>
                        New (${stats.new})
                    </div>
                </div>
            </div>
        `;
  },
};
