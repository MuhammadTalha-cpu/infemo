/* ============================================================
   INFEMO — LANGUAGE JOURNAL SCREEN
   A personal writing space where users practise writing
   in their target language.

   Features:
   • Create, read, edit, delete entries
   • Entry list with date + preview in left panel
   • Writing prompts in the target language
   • Mood selector per entry
   • Word count with live update
   • Auto-saves to localStorage every 2 seconds of inactivity
   • View past entries in read-only mode
   ============================================================ */

var JournalScreen = {
  /* ── State ──────────────────────────────────────────── */
  _entries: [], // all saved entries
  _activeId: null, // entry being viewed or edited
  _mode: "welcome", // 'welcome' | 'new' | 'read' | 'edit'
  _autoSaveTimer: null,
  _selectedMood: null,
  _isDirty: false, // unsaved changes

  /* ── Prompts (in German for German users) ───────────── */
  _prompts: {
    de: [
      "Wie war dein Tag?",
      "Was habe ich heute gelernt?",
      "Beschreibe dein Lieblingsessen.",
      "Was möchte ich morgen machen?",
      "Beschreibe deinen Wohnort.",
      "Was sind meine Ziele?",
      "Meine Lieblingsjareszeit ist...",
      "Beschreibe deine Familie.",
    ],
  },

  _moods: ["😄", "😊", "😐", "😔", "😴", "🤩", "😤", "🤔"],

  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-journal");
    if (!el) return;

    this._loadEntries();

    el.innerHTML = Sidebar.buildShell("#journal", this._buildMainContent());
    if (window.lucide) lucide.createIcons();
  },

  /* ── _loadEntries() ─────────────────────────────────── */
  _loadEntries() {
    var lang = AppState.selectedLanguage || "de";
    this._entries = Storage.get("journal_" + lang) || [];
    /* Sort newest first */
    this._entries.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  /* ── _saveEntries() ─────────────────────────────────── */
  _saveEntries() {
    var lang = AppState.selectedLanguage || "de";
    Storage.set("journal_" + lang, this._entries);
  },

  /* ── _buildMainContent() ────────────────────────────── */
  _buildMainContent() {
    return `
            <!-- Page Header -->
            <div class="page-header entrance-1">
                <div class="page-title">Language Journal</div>
                <div class="page-subtitle">
                    Write freely in German — the fastest way to build confidence
                </div>
            </div>

            <!-- Two-panel layout -->
            <div class="journal-layout entrance-2">

                <!-- Left: Entry List -->
                ${this._buildEntryList()}

                <!-- Right: Editor / Reader -->
                <div class="journal-editor-panel" id="journal-editor-panel">
                    ${this._buildEditorPanel()}
                </div>

            </div>
        `;
  },

  /* ── _buildEntryList() ──────────────────────────────── */
  _buildEntryList() {
    var self = this;
    var entries = this._entries;

    var listHTML =
      entries.length === 0
        ? `<div class="journal-list-empty">
                   No entries yet.<br>Click "New Entry" to start writing.
               </div>`
        : entries
            .map(function (entry) {
              var isActive = entry.id === self._activeId;
              var date = new Date(entry.createdAt);
              var dateStr = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              var wordCount = entry.content
                ? entry.content
                    .trim()
                    .split(/\s+/)
                    .filter(function (w) {
                      return w.length > 0;
                    }).length
                : 0;

              return `
                    <div class="journal-entry-item ${isActive ? "active" : ""}"
                         onclick="JournalScreen._openEntry('${entry.id}')">
                        <div class="journal-entry-item-date">
                            ${dateStr}
                            ${entry.mood ? "&nbsp;" + entry.mood : ""}
                        </div>
                        <div class="journal-entry-item-title">
                            ${entry.title || "Untitled Entry"}
                        </div>
                        <div class="journal-entry-item-preview">
                            ${entry.content ? entry.content.substring(0, 80) : ""}
                        </div>
                        <div class="journal-entry-item-meta">
                            <span class="journal-entry-word-count">
                                ${wordCount} words
                            </span>
                        </div>
                    </div>
                `;
            })
            .join("");

    return `
            <div class="journal-entry-list">
                <div class="journal-list-header">
                    <span class="journal-list-title">My Entries</span>
                    <div style="display:flex;align-items:center;gap:var(--space-2);">
                        <span class="journal-list-count">${entries.length}</span>
                        <button class="btn btn-primary btn-sm"
                                onclick="JournalScreen._newEntry()"
                                title="New Entry">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                </div>
                <div class="journal-list-scroll">
                    ${listHTML}
                </div>
            </div>
        `;
  },

  /* ── _buildEditorPanel() ────────────────────────────── */
  _buildEditorPanel() {
    if (this._mode === "welcome") {
      return this._buildWelcome();
    }
    if (this._mode === "read") {
      return this._buildReadView();
    }
    return this._buildEditorView();
  },

  /* ── _buildWelcome() ────────────────────────────────── */
  _buildWelcome() {
    var entryCount = this._entries.length;
    var totalWords = this._entries.reduce(function (sum, e) {
      return (
        sum +
        (e.content
          ? e.content
              .trim()
              .split(/\s+/)
              .filter(function (w) {
                return w.length > 0;
              }).length
          : 0)
      );
    }, 0);

    return `
            <div class="journal-welcome">
                <div class="journal-welcome-emoji">✍️</div>
                <div class="journal-welcome-title">Your Personal Journal</div>
                <div class="journal-welcome-text">
                    Writing in German — even imperfectly — is one of the most
                    powerful ways to learn. Don't worry about mistakes.
                    Just write what you know.
                </div>
                ${
                  entryCount > 0
                    ? `
                    <div style="display:flex;gap:var(--space-6);justify-content:center;
                                margin-bottom:var(--space-6);">
                        <div style="text-align:center;">
                            <div style="font-size:var(--text-2xl);font-weight:var(--weight-bold);
                                        color:var(--primary);">${entryCount}</div>
                            <div style="font-size:var(--text-xs);text-transform:uppercase;
                                        letter-spacing:0.5px;color:var(--text-muted);">
                                Entries
                            </div>
                        </div>
                        <div style="width:1px;background:var(--border);"></div>
                        <div style="text-align:center;">
                            <div style="font-size:var(--text-2xl);font-weight:var(--weight-bold);
                                        color:var(--primary);">${totalWords}</div>
                            <div style="font-size:var(--text-xs);text-transform:uppercase;
                                        letter-spacing:0.5px;color:var(--text-muted);">
                                Words Written
                            </div>
                        </div>
                    </div>
                `
                    : ""
                }
                <button class="btn btn-primary btn-lg"
                        onclick="JournalScreen._newEntry()">
                    <i data-lucide="pen-line"></i>
                    Write New Entry
                </button>
            </div>
        `;
  },

  /* ── _buildEditorView() ─────────────────────────────── */
  _buildEditorView() {
    var entry = this._getActiveEntry();
    var lang = AppState.selectedLanguage || "de";
    var prompts = this._prompts[lang] || this._prompts.de;

    /* Random 4 prompts */
    var shuffled = prompts.slice().sort(function () {
      return Math.random() - 0.5;
    });
    var chips = shuffled.slice(0, 4);

    var date =
      entry && entry.createdAt
        ? new Date(entry.createdAt).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });

    var titleVal = entry ? entry.title || "" : "";
    var contentVal = entry ? entry.content || "" : "";

    var moodHTML = this._moods
      .map(function (mood) {
        var isSelected =
          (entry && entry.mood === mood) ||
          (!entry && JournalScreen._selectedMood === mood);
        return `
                <button class="journal-mood-btn ${isSelected ? "selected" : ""}"
                        onclick="JournalScreen._selectMood('${mood}')"
                        title="${mood}">
                    ${mood}
                </button>
            `;
      })
      .join("");

    var chipHTML = chips
      .map(function (p) {
        return `
                <button class="journal-prompt-chip"
                        onclick="JournalScreen._usePrompt('${p.replace(/'/g, "\\'")}')">
                    ${p}
                </button>
            `;
      })
      .join("");

    var initialWords = contentVal.trim()
      ? contentVal
          .trim()
          .split(/\s+/)
          .filter(function (w) {
            return w.length > 0;
          }).length
      : 0;

    var wcClass = initialWords > 0 ? "has-content" : "";

    return `
            <div class="journal-editor-card">

                <!-- Toolbar -->
                <div class="journal-editor-toolbar">
                    <div class="journal-editor-toolbar-left">
                        <div class="journal-editor-date">
                            <i data-lucide="calendar"></i>
                            ${date}
                        </div>
                    </div>
                    <div class="journal-editor-toolbar-right">
                        <span class="journal-wc-display ${wcClass}"
                              id="journal-wc">
                            ${initialWords} words
                        </span>
                        ${
                          this._mode === "edit" && entry
                            ? `
                            <button class="btn btn-ghost btn-sm"
                                    onclick="JournalScreen._cancelEdit()">
                                Cancel
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>

                <!-- Body -->
                <div class="journal-editor-body">

                    <!-- Title -->
                    <input class="journal-title-input"
                           type="text"
                           id="journal-title"
                           placeholder="Give your entry a title..."
                           value="${titleVal.replace(/"/g, "&quot;")}"
                           maxlength="100"
                           oninput="JournalScreen._onTitleInput()" />

                    <!-- Prompts -->
                    <div class="journal-prompts">
                        <span class="journal-prompt-label">Try:</span>
                        ${chipHTML}
                    </div>

                    <!-- Content textarea -->
                    <textarea class="input textarea journal-textarea"
                              id="journal-content"
                              placeholder="Schreib hier auf Deutsch... (Write here in German...)"
                              oninput="JournalScreen._onContentInput()"
                              >${contentVal}</textarea>

                    <!-- Mood selector -->
                    <div class="journal-mood-row">
                        <span class="journal-mood-label">Mood:</span>
                        ${moodHTML}
                    </div>

                </div>

                <!-- Save bar -->
                <div class="journal-save-bar">
                    <div class="journal-save-hint">
                        <i data-lucide="save"></i>
                        Click Save Entry when done
                    </div>
                    <div style="display:flex;gap:var(--space-2);">
                        ${
                          entry && this._mode === "edit"
                            ? `
                            <button class="btn btn-danger btn-sm"
                                    onclick="JournalScreen._deleteEntry('${entry.id}')">
                                <i data-lucide="trash-2"></i>
                                Delete
                            </button>
                        `
                            : ""
                        }
                        <button class="btn btn-primary"
                                onclick="JournalScreen._saveEntry()">
                            <i data-lucide="save"></i>
                            Save Entry
                        </button>
                    </div>
                </div>

            </div>
        `;
  },

  /* ── _buildReadView() ───────────────────────────────── */
  _buildReadView() {
    var entry = this._getActiveEntry();
    if (!entry) return this._buildWelcome();

    var date = new Date(entry.createdAt).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    var wordCount = entry.content
      ? entry.content
          .trim()
          .split(/\s+/)
          .filter(function (w) {
            return w.length > 0;
          }).length
      : 0;

    return `
            <div class="journal-editor-card">

                <!-- Toolbar -->
                <div class="journal-read-toolbar">
                    <div class="journal-read-date">
                        <i data-lucide="calendar"></i>
                        ${date}
                        &nbsp;·&nbsp; ${wordCount} words
                        ${entry.mood ? "&nbsp;" + entry.mood : ""}
                    </div>
                    <div style="display:flex;gap:var(--space-2);">
                        <button class="btn btn-ghost btn-sm"
                                onclick="JournalScreen._editEntry('${entry.id}')">
                            <i data-lucide="edit-2"></i>
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm"
                                onclick="JournalScreen._deleteEntry('${entry.id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div class="journal-read-body">
                    <div class="journal-read-title">
                        ${entry.title || "Untitled Entry"}
                    </div>
                    <div class="journal-read-content">
                        ${entry.content || ""}
                    </div>
                </div>

            </div>
        `;
  },

  /* ════════════════════════════════════════════════════
       ACTIONS
    ════════════════════════════════════════════════════ */

  /* ── _newEntry() ────────────────────────────────────── */
  _newEntry() {
    this._activeId = null;
    this._mode = "new";
    this._selectedMood = null;
    this._isDirty = false;
    this._updateEditorPanel();
  },

  /* ── _openEntry(id) ─────────────────────────────────── */
  _openEntry(id) {
    /* Save current if dirty */
    if (this._isDirty) this._saveEntry(true);

    this._activeId = id;
    this._mode = "read";
    this._isDirty = false;
    this._updatePanel();
  },

  /* ── _editEntry(id) ─────────────────────────────────── */
  _editEntry(id) {
    this._activeId = id;
    this._mode = "edit";
    this._isDirty = false;
    this._updateEditorPanel();
  },

  /* ── _cancelEdit() ──────────────────────────────────── */
  _cancelEdit() {
    this._mode = "read";
    this._updateEditorPanel();
  },

  /* ── _saveEntry(silent) ─────────────────────────────── */
  _saveEntry(silent) {
    var titleEl = document.getElementById("journal-title");
    var contentEl = document.getElementById("journal-content");

    var title = titleEl ? titleEl.value.trim() : "";
    var content = contentEl ? contentEl.value.trim() : "";

    if (!content && !title) return;

    var now = new Date().toISOString();

    if (this._activeId && this._mode === "edit") {
      /* Update existing */
      var entry = this._getActiveEntry();
      if (entry) {
        entry.title = title;
        entry.content = content;
        entry.mood = this._selectedMood || entry.mood || null;
        entry.updatedAt = now;
      }
    } else {
      /* Create new */
      var newId = "j_" + Date.now();
      var newEntry = {
        id: newId,
        title: title,
        content: content,
        mood: this._selectedMood || null,
        createdAt: now,
        updatedAt: now,
      };
      this._entries.unshift(newEntry);
      this._activeId = newId;
      this._mode = "read";
    }

    this._isDirty = false;
    this._saveEntries();

    if (!silent) {
      if (window.App) App.showToast("Entry saved!", "success");
      this._updatePanel();
    }
  },

  /* ── _deleteEntry(id) ───────────────────────────────── */
  _deleteEntry(id) {
    var self = this;

    App.showModal({
      title: "Delete Entry",
      body: `
                <div style="text-align:center;padding:var(--space-4) 0;">
                    <div style="font-size:48px;margin-bottom:var(--space-4);">🗑️</div>
                    <p style="color:var(--text-secondary);">
                        Are you sure you want to delete this entry?
                        This cannot be undone.
                    </p>
                </div>
            `,
      footer: `
                <button class="btn btn-ghost" id="delete-cancel">Cancel</button>
                <button class="btn btn-danger" id="delete-confirm">
                    <i data-lucide="trash-2"></i> Delete
                </button>
            `,
    });

    setTimeout(function () {
      var cancelBtn = document.getElementById("delete-cancel");
      var confirmBtn = document.getElementById("delete-confirm");
      var overlay = document.querySelector(".modal-overlay");

      if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
          if (overlay) overlay.remove();
        });
      }

      if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
          if (overlay) overlay.remove();

          self._entries = self._entries.filter(function (e) {
            return e.id !== id;
          });
          self._saveEntries();
          self._activeId = null;
          self._mode = "welcome";
          self._updatePanel();

          if (window.App) App.showToast("Entry deleted.", "info");
        });
      }

      if (window.lucide) lucide.createIcons();
    }, 50);
  },

  /* ── _usePrompt(prompt) ─────────────────────────────── */
  _usePrompt(prompt) {
    /* Set it as the title if title is empty, otherwise add to content */
    var titleEl = document.getElementById("journal-title");
    var contentEl = document.getElementById("journal-content");

    if (titleEl && !titleEl.value.trim()) {
      titleEl.value = prompt;
    } else if (contentEl) {
      var existing = contentEl.value;
      contentEl.value = existing
        ? existing + "\n\n" + prompt + "\n"
        : prompt + "\n";
      contentEl.focus();
      this._updateWordCount(contentEl.value);
    }
    this._isDirty = true;
  },

  /* ── _selectMood(mood) ──────────────────────────────── */
  _selectMood(mood) {
    this._selectedMood = mood;

    document.querySelectorAll(".journal-mood-btn").forEach(function (btn) {
      btn.classList.toggle("selected", btn.textContent.trim() === mood);
    });

    /* Also update on active entry immediately */
    var entry = this._getActiveEntry();
    if (entry) {
      entry.mood = mood;
      this._saveEntries();
    }

    this._isDirty = true;
  },

  /* ── _onContentInput() ──────────────────────────────── */
  _onContentInput() {
    var contentEl = document.getElementById("journal-content");
    if (contentEl) this._updateWordCount(contentEl.value);
    this._isDirty = true;
  },

  /* ── _onTitleInput() ────────────────────────────────── */
  _onTitleInput() {
    this._isDirty = true;
  },

  /* ── _updateWordCount(text) ─────────────────────────── */
  _updateWordCount(text) {
    var wcEl = document.getElementById("journal-wc");
    if (!wcEl) return;

    var words = text.trim()
      ? text
          .trim()
          .split(/\s+/)
          .filter(function (w) {
            return w.length > 0;
          }).length
      : 0;

    wcEl.textContent = words + (words === 1 ? " word" : " words");
    wcEl.className = "journal-wc-display" + (words > 0 ? " has-content" : "");
  },

  /* ── _scheduleAutoSave() ────────────────────────────── */
  _scheduleAutoSave() {
    if (this._autoSaveTimer) clearTimeout(this._autoSaveTimer);
    this._autoSaveTimer = setTimeout(function () {
      JournalScreen._saveEntry(true);
    }, 2000);
  },

  /* ════════════════════════════════════════════════════
       UI HELPERS
    ════════════════════════════════════════════════════ */

  /* Update the entire right panel + left list */
  _updatePanel() {
    var el = document.getElementById("screen-journal");
    if (!el) return;

    var wrap = el.querySelector(".content-wrap");
    if (wrap) {
      wrap.innerHTML = this._buildMainContent();
    } else {
      el.innerHTML = Sidebar.buildShell("#journal", this._buildMainContent());
    }

    if (window.lucide) lucide.createIcons();
  },

  /* Update only the editor/reader panel */
  _updateEditorPanel() {
    var panel = document.getElementById("journal-editor-panel");
    if (panel) {
      panel.innerHTML = this._buildEditorPanel();
      if (window.lucide) lucide.createIcons();
    } else {
      this._updatePanel();
    }
  },

  /* ── _getActiveEntry() ──────────────────────────────── */
  _getActiveEntry() {
    if (!this._activeId) return null;
    var id = this._activeId;
    return (
      this._entries.find(function (e) {
        return e.id === id;
      }) || null
    );
  },
};
