/* ============================================================
   INFEMO — GRAMMAR HANDBOOK SCREEN
   Two-panel layout: topic list on left, content on right.
   All grammar data comes from data/de/grammar.js.
   ============================================================ */

var GrammarScreen = {
  _activeTopicId: "articles",

  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-grammar");
    if (!el) return;

    el.innerHTML = Sidebar.buildShell("#grammar", this._buildMainContent());
    if (window.lucide) lucide.createIcons();
    this._showTopic(this._activeTopicId);
  },

  /* ── _buildMainContent() ────────────────────────────── */
  _buildMainContent() {
    var topics = window.DEGrammar && DEGrammar.topics ? DEGrammar.topics : [];

    var topicListHTML = topics
      .map(function (topic) {
        return `
                <div class="grammar-topic-item"
                     id="grammar-nav-${topic.id}"
                     onclick="GrammarScreen._showTopic('${topic.id}')">
                    <div class="grammar-topic-icon">
                        <i data-lucide="${topic.icon || "book"}"></i>
                    </div>
                    <span class="grammar-topic-name">${topic.title}</span>
                    <span class="grammar-topic-level">${topic.level}</span>
                </div>
            `;
      })
      .join("");

    return `
            <!-- Page Header -->
            <div class="page-header entrance-1">
                <div class="page-title">Grammar Handbook</div>
                <div class="page-subtitle">
                    ${topics.length} topics covering Goethe A1 grammar
                </div>
            </div>

            <!-- Two-panel layout -->
            <div class="grammar-layout entrance-2">

                <!-- Left: Topic List -->
                <div class="grammar-topic-list" id="grammar-topic-list">
                    <div class="grammar-topic-list-header">
                        Topics
                    </div>
                    ${topicListHTML}
                </div>

                <!-- Right: Content Panel -->
                <div class="grammar-content-panel" id="grammar-content-panel">
                    <!-- filled by _showTopic() -->
                </div>

            </div>
        `;
  },

  /* ── _showTopic(topicId) ────────────────────────────── */
  _showTopic(topicId) {
    this._activeTopicId = topicId;

    /* Update active nav item */
    document.querySelectorAll(".grammar-topic-item").forEach(function (el) {
      el.classList.remove("active");
    });
    var activeEl = document.getElementById("grammar-nav-" + topicId);
    if (activeEl) {
      activeEl.classList.add("active");
      /* Scroll into view on mobile */
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    /* Find the topic data */
    var topics = window.DEGrammar && DEGrammar.topics ? DEGrammar.topics : [];
    var topic = topics.find(function (t) {
      return t.id === topicId;
    });
    var panel = document.getElementById("grammar-content-panel");
    if (!panel || !topic) return;

    /* Find prev/next for navigation arrows */
    var idx = topics.indexOf(topic);
    var prev = idx > 0 ? topics[idx - 1] : null;
    var next = idx < topics.length - 1 ? topics[idx + 1] : null;

    /* Build sections HTML */
    var sectionsHTML = topic.sections
      ? topic.sections
          .map(function (s) {
            return GrammarScreen._buildSection(s);
          })
          .join("")
      : "";

    /* Navigation row */
    var navHTML = `
            <div class="grammar-nav-row">
                ${
                  prev
                    ? `
                    <button class="btn btn-ghost btn-sm"
                            onclick="GrammarScreen._showTopic('${prev.id}')">
                        <i data-lucide="arrow-left"></i>
                        ${prev.title}
                    </button>
                `
                    : "<div></div>"
                }
                ${
                  next
                    ? `
                    <button class="btn btn-primary btn-sm"
                            onclick="GrammarScreen._showTopic('${next.id}')">
                        ${next.title}
                        <i data-lucide="arrow-right"></i>
                    </button>
                `
                    : `
                    <button class="btn btn-secondary btn-sm"
                            onclick="Router.navigate('#dashboard')">
                        <i data-lucide="home"></i>
                        Dashboard
                    </button>
                `
                }
            </div>
        `;

    panel.innerHTML = `
            <!-- Header -->
            <div class="grammar-content-header">
                <div style="display:flex;align-items:center;gap:var(--space-3);
                            margin-bottom:var(--space-3);">
                    <span class="tag tag-active"
                          style="font-size:11px;">
                        ${topic.level}
                    </span>
                    <span style="font-size:var(--text-sm);color:var(--text-muted);">
                        ${idx + 1} of ${topics.length} topics
                    </span>
                </div>
                <div class="grammar-content-title">${topic.title}</div>
                <div class="grammar-content-intro">${topic.intro}</div>
            </div>

            <!-- Sections -->
            ${sectionsHTML}

            <!-- Tip -->
            ${
              topic.tip
                ? `
                <div class="grammar-tip-box">
                    <span class="grammar-tip-emoji">💡</span>
                    <span>${topic.tip}</span>
                </div>
            `
                : ""
            }

            <!-- Navigation -->
            ${navHTML}
        `;

    if (window.lucide) lucide.createIcons();

    /* Scroll content panel to top */
    panel.scrollIntoView({ block: "start", behavior: "smooth" });
  },

  /* ── _buildSection(section) ─────────────────────────── */
  _buildSection(section) {
    var bodyHTML = "";

    if (section.type === "table") {
      bodyHTML = this._buildTable(section);
    } else if (section.type === "examples") {
      bodyHTML = this._buildExamples(section);
    } else if (section.type === "rule-cards") {
      bodyHTML = this._buildRuleCards(section);
    }

    return `
            <div class="grammar-section">
                <div class="grammar-section-heading">
                    ${section.heading}
                </div>
                <div class="grammar-section-body">
                    ${bodyHTML}
                </div>
            </div>
        `;
  },

  /* ── _buildTable(section) ───────────────────────────── */
  _buildTable(section) {
    var lang = AppState.selectedLanguage || "de";

    var headersHTML = section.headers
      ? section.headers
          .map(function (h) {
            return `<th>${h}</th>`;
          })
          .join("")
      : "";

    var rowsHTML = section.rows
      ? section.rows
          .map(function (row) {
            var cells = row
              .map(function (cell, i) {
                if (i === 0) {
                  /* First cell — styled as label */
                  return `<td>${cell}</td>`;
                }
                /* Check if cell contains German text to make audio-able */
                return `<td>${cell}</td>`;
              })
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("")
      : "";

    return `
            <div style="overflow-x:auto;">
                <table class="grammar-table">
                    ${headersHTML ? `<thead><tr>${headersHTML}</tr></thead>` : ""}
                    <tbody>${rowsHTML}</tbody>
                </table>
            </div>
        `;
  },

  /* ── _buildExamples(section) ────────────────────────── */
  _buildExamples(section) {
    var lang = AppState.selectedLanguage || "de";

    var itemsHTML = (section.items || [])
      .map(function (item) {
        return `
                <div class="grammar-ex-card">
                    <div class="grammar-ex-de">
                        <button class="audio-btn"
                                style="flex-shrink:0;"
                                onclick="if(window.AudioEngine) AudioEngine.speak(
                                    '${item.de.replace(/'/g, "\\'")}',
                                    'sentence', '${lang}');"
                                title="Hear example">
                            <i data-lucide="volume-2"></i>
                        </button>
                        ${item.de}
                    </div>
                    <div class="grammar-ex-en">${item.en}</div>
                    ${
                      item.note
                        ? `
                        <div class="grammar-ex-note">${item.note}</div>
                    `
                        : ""
                    }
                </div>
            `;
      })
      .join("");

    return `<div class="grammar-examples-list">${itemsHTML}</div>`;
  },

  /* ── _buildRuleCards(section) ───────────────────────── */
  _buildRuleCards(section) {
    var lang = AppState.selectedLanguage || "de";

    var cardsHTML = (section.items || [])
      .map(function (item) {
        return `
                <div class="grammar-rule-card">
                    <div class="grammar-rule-card-title">${item.title}</div>
                    <div class="grammar-rule-card-example">
                        ${item.example}
                        <button class="audio-btn"
                                style="margin-left:var(--space-2);"
                                onclick="if(window.AudioEngine) AudioEngine.speak(
                                    '${item.example.replace(/'/g, "\\'")}',
                                    'sentence', '${lang}');"
                                title="Hear example">
                            <i data-lucide="volume-2"></i>
                        </button>
                    </div>
                    <div class="grammar-rule-card-english">${item.english}</div>
                    <div class="grammar-rule-card-note">${item.note}</div>
                </div>
            `;
      })
      .join("");

    return `<div class="grammar-rule-cards">${cardsHTML}</div>`;
  },
};
