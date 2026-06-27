/* ============================================================
   INFEMO — EXAM SIMULATOR
   Full practice exam in the format of each language's
   official certification (Goethe A1, JLPT, HSK, etc.)

   Flow:
   1. Pre-exam info screen → Start Exam
   2. Section 1 starts → timer → questions one at a time
   3. Submit section → brief score → Section 2
   4. After all sections → Full results + review
   ============================================================ */

var ExamScreen = {
  /* ── Internal State ─────────────────────────────────── */
  _examDef: null, // current exam format object
  _langCode: "de",
  _levelId: "a1",
  _currentSection: 0, // section index
  _currentQuestion: 0, // question index within section
  _sectionAnswers: [], // [section][question] = answer
  _timer: null, // setInterval reference
  _secondsLeft: 0, // countdown seconds

  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-exam");
    if (!el) return;

    this.stopTimer();

    /* Read from AppState (set by levels screen's exam button) */
    this._langCode =
      AppState.activeExam.langCode || AppState.selectedLanguage || "de";
    this._levelId = AppState.activeExam.levelId || "a1";

    /* Load exam format */
    if (
      window.ExamFormats &&
      ExamFormats[this._langCode] &&
      ExamFormats[this._langCode][this._levelId]
    ) {
      this._examDef = ExamFormats[this._langCode][this._levelId];
    } else {
      this._examDef = null;
    }

    /* Build the sidebar shell once — we update only the main content after */
    el.innerHTML = Sidebar.buildShell(
      "#level-" + this._levelId,
      this._buildPreExamContent(),
    );

    if (window.lucide) lucide.createIcons();
  },

  /* ── _updateContent(html) ───────────────────────────────
       Updates only the main content area without
       rebuilding the sidebar — preserves the timer display.
    ─────────────────────────────────────────────────────── */
  _updateContent(html) {
    var area = document.querySelector("#screen-exam .content-wrap");
    if (area) {
      area.innerHTML = html;
    } else {
      /* Fallback: rebuild everything */
      var el = document.getElementById("screen-exam");
      if (el) {
        el.innerHTML = Sidebar.buildShell("#level-" + this._levelId, html);
      }
    }
    if (window.lucide) lucide.createIcons();
  },

  /* ════════════════════════════════════════════════════════
       PRE-EXAM SCREEN
    ════════════════════════════════════════════════════════ */

  _buildPreExamContent() {
    if (!this._examDef) {
      return `
                <div class="page-header">
                    <div class="page-title">Practice Exam</div>
                </div>
                <div class="card">
                    <div class="empty-state" style="padding:var(--space-10);">
                        <i data-lucide="file-text" class="empty-state-icon"></i>
                        <div class="empty-state-title">Exam Not Available</div>
                        <div class="empty-state-text">
                            The practice exam for this level is being prepared.
                        </div>
                        <button class="btn btn-primary"
                                style="margin-top:var(--space-4);"
                                onclick="Router.navigate('#level-a1')">
                            <i data-lucide="arrow-left"></i> Back to Topics
                        </button>
                    </div>
                </div>
            `;
    }

    var def = this._examDef;
    var self = this;

    var totalQ = def.sections.reduce(function (sum, s) {
      return sum + s.questions.length;
    }, 0);

    var sectionsHTML = def.sections
      .map(function (s) {
        return `
                <div style="display:flex;align-items:center;gap:var(--space-3);
                            padding:var(--space-3) 0;border-bottom:1px solid var(--border);">
                    <div style="width:36px;height:36px;border-radius:var(--radius-md);
                                background:var(--primary-light);display:flex;align-items:center;
                                justify-content:center;flex-shrink:0;">
                        <i data-lucide="${s.icon}"
                           style="color:var(--primary);width:18px;height:18px;"></i>
                    </div>
                    <div style="flex:1;">
                        <div style="font-weight:var(--weight-semibold);
                                    color:var(--text-primary);">
                            ${s.name} — ${s.englishName}
                        </div>
                        <div style="font-size:var(--text-sm);color:var(--text-secondary);">
                            ${s.questions.length} questions · ${s.durationMinutes} minutes
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    return `
            <div class="page-header entrance-1">
                <div class="page-title">Practice Exam</div>
                <div class="page-subtitle">
                    ${def.certBody} — ${def.name}
                </div>
            </div>

            <div class="exam-intro-card entrance-2">

                <!-- Header -->
                <div class="exam-intro-header">
                    <div>
                        <div class="exam-intro-title">${def.name}</div>
                        <div class="exam-intro-meta">${def.certBody}</div>
                    </div>
                    <div class="exam-intro-badge">
                        <i data-lucide="award"></i>
                        ${this._levelId.toUpperCase()}
                    </div>
                </div>

                <!-- Stats -->
                <div class="exam-intro-stats">
                    <div class="exam-stat">
                        <div class="exam-stat-value">${def.sections.length}</div>
                        <div class="exam-stat-label">Sections</div>
                    </div>
                    <div class="exam-stat-divider"></div>
                    <div class="exam-stat">
                        <div class="exam-stat-value">${totalQ}</div>
                        <div class="exam-stat-label">Questions</div>
                    </div>
                    <div class="exam-stat-divider"></div>
                    <div class="exam-stat">
                        <div class="exam-stat-value">${def.totalMinutes}m</div>
                        <div class="exam-stat-label">Total Time</div>
                    </div>
                    <div class="exam-stat-divider"></div>
                    <div class="exam-stat">
                        <div class="exam-stat-value">${def.passMark}%</div>
                        <div class="exam-stat-label">Pass Mark</div>
                    </div>
                </div>

                <!-- Sections -->
                <div class="exam-intro-sections">
                    <div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);
                                color:var(--text-primary);margin-bottom:var(--space-3);">
                        Exam Sections
                    </div>
                    ${sectionsHTML}
                </div>

                <!-- Note -->
                <div class="exam-intro-note">
                    <i data-lucide="info"></i>
                    <span>
                        This practice exam follows the official ${def.certBody} format.
                        Each section has a timer. When it runs out, the section auto-submits.
                        Pass mark is ${def.passMark}%.
                    </span>
                </div>

                <!-- Start Button -->
                <button class="btn btn-primary btn-full"
                        onclick="ExamScreen.startExam()">
                    <i data-lucide="play"></i>
                    Start Practice Exam
                </button>

            </div>
        `;
  },

  /* ════════════════════════════════════════════════════════
       EXAM START & SECTION MANAGEMENT
    ════════════════════════════════════════════════════════ */

  startExam() {
    this._currentSection = 0;
    this._currentQuestion = 0;

    /* Init blank answers array */
    this._sectionAnswers = this._examDef.sections.map(function (s) {
      return s.questions.map(function () {
        return null;
      });
    });

    /* Reset scores in AppState */
    AppState.activeExam.scores = [];

    this._startSection(0);
  },

  _startSection(sectionIdx) {
    this._currentSection = sectionIdx;
    this._currentQuestion = 0;

    var section = this._examDef.sections[sectionIdx];
    this._secondsLeft = section.durationMinutes * 60;

    this._renderQuestion(sectionIdx, 0);
    this._startTimer();
  },

  /* ── Timer ──────────────────────────────────────────── */
  _startTimer() {
    this.stopTimer();

    var self = this;
    this._timer = setInterval(function () {
      self._secondsLeft--;
      self._updateTimerDisplay();
      if (self._secondsLeft <= 0) {
        self.stopTimer();
        self._submitSection(self._currentSection);
      }
    }, 1000);
  },

  stopTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  _updateTimerDisplay() {
    var el = document.getElementById("exam-timer-display");
    if (!el) return;

    var mins = Math.floor(this._secondsLeft / 60);
    var secs = this._secondsLeft % 60;
    el.textContent = mins + ":" + (secs < 10 ? "0" : "") + secs;

    if (this._secondsLeft <= 60) {
      el.style.color = "var(--error)";
    } else if (this._secondsLeft <= 180) {
      el.style.color = "var(--warning)";
    } else {
      el.style.color = "var(--primary)";
    }
  },

  /* ════════════════════════════════════════════════════════
       QUESTION RENDERING
    ════════════════════════════════════════════════════════ */

  _renderQuestion(sectionIdx, questionIdx) {
    this._currentSection = sectionIdx;
    this._currentQuestion = questionIdx;

    var section = this._examDef.sections[sectionIdx];
    var question = section.questions[questionIdx];
    var letters = ["A", "B", "C", "D"];

    var dotsHTML = section.questions
      .map(function (q, i) {
        var cls = i === questionIdx ? "active" : i < questionIdx ? "done" : "";
        return '<div class="exam-q-dot ' + cls + '"></div>';
      })
      .join("");

    /* ── Reading text (for Lesen questions) ─────────── */
    var readingHTML = question.readingText
      ? `
            <div class="exam-reading-wrap">
                <div class="exam-reading-label">
                    ${question.readingLabel || "Read the text:"}
                </div>
                <div class="exam-reading-text">
                    ${question.readingText.replace(/\n/g, "<br>")}
                </div>
            </div>
        `
      : "";

    /* ── Audio replay bar (for Hören questions) ─────── */
    var audioHTML = question.audioText
      ? `
            <div class="exam-audio-bar">
                <button class="listen-choose-audio-btn"
                        onclick="if(window.AudioEngine) AudioEngine.speak(
                            '${question.audioText.replace(/'/g, "\\'")}',
                            '${question.audioContext || "sentence"}',
                            '${this._langCode}')">
                    <i data-lucide="volume-2"></i>
                    Listen Again
                </button>
            </div>
        `
      : "";

    /* ── Build question body based on type ──────────── */
    var questionBody = "";
    var isLast = questionIdx >= section.questions.length - 1;
    var isLastSec = sectionIdx >= this._examDef.sections.length - 1;

    var currentAnswer = this._sectionAnswers[sectionIdx][questionIdx];

    /* Multiple Choice or Listen & Choose */
    if (
      question.type === "multiple-choice" ||
      question.type === "listen-choose"
    ) {
      var optionsHTML = question.options
        .map(function (opt, i) {
          var isSelected = currentAnswer === i;
          return `
                    <button class="exam-mc-option ${isSelected ? "selected" : ""}"
                            onclick="ExamScreen._selectAnswer(${sectionIdx}, ${questionIdx}, ${i})">
                        <span class="mc-option-letter">${letters[i]}</span>
                        <span>${opt}</span>
                    </button>
                `;
        })
        .join("");

      questionBody = `
                ${audioHTML}
                ${readingHTML}
                <div class="question-text">${question.question}</div>
                <div>${optionsHTML}</div>
            `;
    } else if (question.type === "fill-blank") {

    /* Fill in the Blank */
      questionBody = `
                ${readingHTML}
                <div class="fill-blank-sentence">${question.sentence}</div>
                <div class="fill-blank-translation">${question.translation}</div>
                <div style="font-size:var(--text-sm);color:var(--text-muted);
                            margin-bottom:var(--space-3);">
                    Hint: ${question.hint}
                </div>
                <div class="fill-blank-input-row">
                    <input class="input fill-blank-input"
                           type="text"
                           id="exam-fill-${questionIdx}"
                           placeholder="Type your answer..."
                           value="${currentAnswer || ""}"
                           autocomplete="off"
                           autocorrect="off"
                           autocapitalize="off"
                           oninput="ExamScreen._saveText(${sectionIdx}, ${questionIdx}, this.value)"
                           onkeydown="if(event.key==='Enter') ExamScreen._nextQuestion(${sectionIdx}, ${questionIdx})" />
                </div>
            `;
    } else if (question.type === "form-fill") {

    /* Form Fill */
      var savedForm = currentAnswer || {};
      var fieldsHTML = question.fields
        .map(function (field) {
          return `
                    <div class="input-group">
                        <label class="input-label">${field.label}</label>
                        <input class="input"
                               type="text"
                               placeholder="${field.placeholder}"
                               value="${savedForm[field.key] || ""}"
                               oninput="ExamScreen._saveFormField(${sectionIdx}, ${questionIdx}, '${field.key}', this.value)" />
                    </div>
                `;
        })
        .join("");

      questionBody = `
                <div class="exam-task-title">${question.title}</div>
                <div class="exam-task-instruction">${question.instruction}</div>
                <div class="exam-form-fields">${fieldsHTML}</div>
                ${
                  question.note
                    ? `
                    <div class="exam-form-note">
                        <i data-lucide="info"></i>
                        <span>${question.note}</span>
                    </div>
                `
                    : ""
                }
            `;
    } else if (question.type === "short-message") {

    /* Short Message */
      var savedMsg =
        currentAnswer && currentAnswer !== question.placeholder
          ? currentAnswer
          : "";
      var pointsHTML = question.points
        .map(function (p) {
          return '<li style="margin-bottom:4px;">' + p + "</li>";
        })
        .join("");

      questionBody = `
                <div class="exam-task-title">${question.title}</div>
                <div class="exam-task-instruction">${question.instruction}</div>
                <ul style="margin:var(--space-3) 0 var(--space-4) var(--space-5);
                           font-size:var(--text-sm);color:var(--text-secondary);
                           line-height:var(--leading-relaxed);">
                    ${pointsHTML}
                </ul>
                <div style="font-size:var(--text-sm);color:var(--text-muted);
                            margin-bottom:var(--space-2);">
                    ${question.promptNote}
                </div>
                <textarea class="textarea"
                          rows="8"
                          placeholder="${question.placeholder || ""}"
                          oninput="ExamScreen._saveText(${sectionIdx}, ${questionIdx}, this.value)"
                          >${savedMsg}</textarea>
                <div id="exam-wc-${questionIdx}"
                     style="font-size:var(--text-xs);color:var(--text-muted);
                            margin-top:var(--space-1);text-align:right;">
                    0 words
                </div>
            `;
    }

    /* ── Navigation buttons ─────────────────────────── */
    var nextLabel = isLast
      ? isLastSec
        ? "Finish Exam"
        : "Submit Section"
      : "Next Question";
    var nextAction = isLast
      ? `ExamScreen._submitSection(${sectionIdx})`
      : `ExamScreen._nextQuestion(${sectionIdx}, ${questionIdx})`;
    var nextIcon = isLast ? "check" : "arrow-right";

    var navHTML = `
            <div class="lesson-nav-row" style="margin-top:var(--space-6);">
                ${
                  questionIdx > 0
                    ? `
                    <button class="btn btn-ghost btn-sm"
                            onclick="ExamScreen._renderQuestion(${sectionIdx}, ${questionIdx - 1})">
                        <i data-lucide="arrow-left"></i> Previous
                    </button>
                `
                    : "<div></div>"
                }
                <button class="btn btn-primary"
                        onclick="${nextAction}">
                    ${nextLabel}
                    <i data-lucide="${nextIcon}"></i>
                </button>
            </div>
        `;

    /* ── Assemble full content ───────────────────────── */
    var typeLabel =
      {
        "listen-choose": "Listen & Choose",
        "multiple-choice": "Multiple Choice",
        "fill-blank": "Fill in the Blank",
        "form-fill": "Form Filling",
        "short-message": "Write a Message",
      }[question.type] || "Question";

    var fullHTML = `
            <!-- Exam Header with Timer -->
            <div class="exam-running-header">
                <div class="exam-section-info">
                    <div class="exam-section-badge">
                        <i data-lucide="${section.icon}"></i>
                        ${section.name}
                    </div>
                    <div class="exam-section-english">${section.englishName}</div>
                </div>
                <div class="exam-timer-block">
                    <i data-lucide="clock"></i>
                    <span class="exam-timer-display" id="exam-timer-display">
                        ${Math.floor(this._secondsLeft / 60)}:${(this._secondsLeft % 60 < 10 ? "0" : "") + (this._secondsLeft % 60)}
                    </span>
                </div>
            </div>

            <!-- Question Progress -->
            <div class="exam-question-progress">
                <span style="font-size:var(--text-xs);color:var(--text-muted);">
                    Question ${questionIdx + 1} of ${section.questions.length}
                </span>
                <div class="exam-q-dots">${dotsHTML}</div>
            </div>

            ${
              questionIdx === 0
                ? `
                <div class="exam-section-desc">
                    <div class="exam-section-desc-text">${section.description}</div>
                </div>
            `
                : ""
            }

            <!-- Question Card -->
            <div class="question-card entrance-1">
                <div class="question-card-header">
                    <div class="question-number">${questionIdx + 1}</div>
                    <div class="question-type-label">${typeLabel}</div>
                </div>
                <div class="question-card-body">
                    ${questionBody}
                </div>
            </div>

            ${navHTML}
        `;

    this._updateContent(fullHTML);

    /* Auto-play audio for listening questions */
    if (question.type === "listen-choose" && question.audioText) {
      var lang = this._langCode;
      setTimeout(function () {
        if (window.AudioEngine) {
          AudioEngine.speak(
            question.audioText,
            question.audioContext || "sentence",
            lang,
          );
        }
      }, 700);
    }

    /* Focus text inputs */
    setTimeout(function () {
      var fillInput = document.getElementById("exam-fill-" + questionIdx);
      if (fillInput) fillInput.focus();
    }, 150);
  },

  /* ── Answer Saving ──────────────────────────────────── */

  _selectAnswer(sectionIdx, questionIdx, optionIdx) {
    this._sectionAnswers[sectionIdx][questionIdx] = optionIdx;
    document.querySelectorAll(".exam-mc-option").forEach(function (btn, i) {
      btn.classList.toggle("selected", i === optionIdx);
    });
  },

  _saveText(sectionIdx, questionIdx, value) {
    this._sectionAnswers[sectionIdx][questionIdx] = value;
    /* Word count for short message */
    var wcEl = document.getElementById("exam-wc-" + questionIdx);
    if (wcEl) {
      var words = value
        .trim()
        .split(/\s+/)
        .filter(function (w) {
          return w.length > 0;
        }).length;
      wcEl.textContent = words + (words === 1 ? " word" : " words");
      wcEl.style.color = words >= 5 ? "var(--success)" : "var(--text-muted)";
    }
  },

  _saveFormField(sectionIdx, questionIdx, key, value) {
    if (!this._sectionAnswers[sectionIdx][questionIdx]) {
      this._sectionAnswers[sectionIdx][questionIdx] = {};
    }
    this._sectionAnswers[sectionIdx][questionIdx][key] = value;
  },

  /* ── Question Navigation ────────────────────────────── */

  _nextQuestion(sectionIdx, questionIdx) {
    var section = this._examDef.sections[sectionIdx];
    var next = questionIdx + 1;
    if (next < section.questions.length) {
      this._renderQuestion(sectionIdx, next);
    } else {
      this._submitSection(sectionIdx);
    }
  },

  /* ════════════════════════════════════════════════════════
       SECTION SUBMISSION & SCORING
    ════════════════════════════════════════════════════════ */

  _submitSection(sectionIdx) {
    this.stopTimer();

    var section = this._examDef.sections[sectionIdx];
    var answers = this._sectionAnswers[sectionIdx];

    var gradable = 0;
    var correct = 0;

    section.questions.forEach(function (q, i) {
      var ans = answers[i];

      if (q.type === "multiple-choice" || q.type === "listen-choose") {
        gradable++;
        if (ans === q.correct) correct++;
      } else if (q.type === "fill-blank") {
        gradable++;
        var userAns = (ans || "").toString().trim().toLowerCase();
        var correctAns = q.answer.toLowerCase();
        if (userAns === correctAns) correct++;
      } else if (q.type === "form-fill") {
        q.fields.forEach(function (f) {
          gradable++;
          if (ans && ans[f.key] && ans[f.key].trim().length > 0) correct++;
        });
      } else if (q.type === "short-message") {
        gradable++;
        var text = (ans || "").toString().trim();
        var words = text.split(/\s+/).filter(function (w) {
          return w.length > 0;
        }).length;
        if (words >= (q.minWords || 5)) correct++;
      }
    });

    var pct = gradable > 0 ? Math.round((correct / gradable) * 100) : 0;

    if (!AppState.activeExam.scores) AppState.activeExam.scores = [];
    AppState.activeExam.scores[sectionIdx] = {
      correct: correct,
      total: gradable,
      pct: pct,
    };

    var isLastSection = sectionIdx >= this._examDef.sections.length - 1;

    if (isLastSection) {
      this._showResults();
    } else {
      this._showBetweenSections(sectionIdx);
    }
  },

  /* ── Between Sections ───────────────────────────────── */
  _showBetweenSections(completedIdx) {
    var section = this._examDef.sections[completedIdx];
    var score = AppState.activeExam.scores[completedIdx];
    var nextSection = this._examDef.sections[completedIdx + 1];
    var pct = score ? score.pct : 0;
    var emoji = pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📝";

    var html = `
            <div style="max-width:500px;margin:var(--space-8) auto;text-align:center;">
                <div style="font-size:48px;margin-bottom:var(--space-4);">${emoji}</div>
                <div class="heading-1" style="margin-bottom:var(--space-2);">
                    Section Complete
                </div>
                <div style="font-size:var(--text-lg);font-weight:var(--weight-semibold);
                            color:var(--text-secondary);margin-bottom:var(--space-6);">
                    ${section.name} — ${section.englishName}
                </div>

                <!-- Score card -->
                <div class="card" style="display:inline-flex;gap:var(--space-8);
                                         padding:var(--space-6) var(--space-8);
                                         margin-bottom:var(--space-6);">
                    <div style="text-align:center;">
                        <div style="font-size:var(--text-3xl);font-weight:var(--weight-bold);
                                    color:var(--primary);">
                            ${score ? score.correct + "/" + score.total : "—"}
                        </div>
                        <div style="font-size:var(--text-xs);color:var(--text-muted);
                                    text-transform:uppercase;letter-spacing:0.5px;">Score</div>
                    </div>
                    <div style="width:1px;background:var(--border);"></div>
                    <div style="text-align:center;">
                        <div style="font-size:var(--text-3xl);font-weight:var(--weight-bold);
                                    color:${pct >= 60 ? "var(--success)" : "var(--error)"};">
                            ${pct}%
                        </div>
                        <div style="font-size:var(--text-xs);color:var(--text-muted);
                                    text-transform:uppercase;letter-spacing:0.5px;">Accuracy</div>
                    </div>
                </div>

                <!-- Next section preview -->
                <div class="card" style="text-align:left;margin-bottom:var(--space-6);">
                    <div style="font-size:var(--text-sm);font-weight:var(--weight-bold);
                                text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted);margin-bottom:var(--space-2);">
                        Next Section
                    </div>
                    <div style="font-weight:var(--weight-semibold);color:var(--text-primary);
                                margin-bottom:var(--space-1);">
                        ${nextSection.name} — ${nextSection.englishName}
                    </div>
                    <div style="font-size:var(--text-sm);color:var(--text-secondary);
                                margin-bottom:var(--space-2);">
                        ${nextSection.description}
                    </div>
                    <div style="font-size:var(--text-xs);color:var(--text-muted);">
                        ${nextSection.questions.length} questions
                        · ${nextSection.durationMinutes} minutes
                    </div>
                </div>

                <button class="btn btn-primary btn-lg"
                        onclick="ExamScreen._startSection(${completedIdx + 1})">
                    <i data-lucide="arrow-right"></i>
                    Start ${nextSection.name} Section
                </button>
            </div>
        `;

    this._updateContent(html);
  },

  /* ════════════════════════════════════════════════════════
       RESULTS SCREEN
    ════════════════════════════════════════════════════════ */

  _showResults() {
    var def = this._examDef;
    var scores = AppState.activeExam.scores || [];

    var totalCorrect = 0;
    var totalGradable = 0;

    scores.forEach(function (s) {
      if (s) {
        totalCorrect += s.correct;
        totalGradable += s.total;
      }
    });

    var overallPct =
      totalGradable > 0 ? Math.round((totalCorrect / totalGradable) * 100) : 0;
    var passed = overallPct >= def.passMark;

    /* Section breakdown */
    var sectionResultsHTML = def.sections
      .map(function (section, i) {
        var score = scores[i];
        if (!score) return "";
        var sPass = score.pct >= def.passMark;

        return `
                <div class="exam-section-result">
                    <div style="display:flex;align-items:center;gap:var(--space-3);">
                        <div style="width:36px;height:36px;border-radius:var(--radius-md);
                                    background:${sPass ? "var(--success-bg)" : "var(--error-bg)"};
                                    display:flex;align-items:center;justify-content:center;">
                            <i data-lucide="${section.icon}"
                               style="width:18px;height:18px;
                                      color:${sPass ? "var(--success)" : "var(--error)"}">
                            </i>
                        </div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-weight:var(--weight-semibold);
                                        color:var(--text-primary);">
                                ${section.name} — ${section.englishName}
                            </div>
                            <div class="progress-bar progress-bar-lg"
                                 style="margin-top:var(--space-2);max-width:200px;">
                                <div class="progress-fill"
                                     style="width:${score.pct}%;
                                            background:${
                                              sPass
                                                ? "var(--success)"
                                                : "var(--primary)"
                                            };">
                                </div>
                            </div>
                        </div>
                        <div style="text-align:right;flex-shrink:0;">
                            <div style="font-size:var(--text-lg);font-weight:var(--weight-bold);
                                        color:${sPass ? "var(--success)" : "var(--error)"};">
                                ${score.pct}%
                            </div>
                            <div style="font-size:var(--text-xs);color:var(--text-muted);">
                                ${score.correct}/${score.total}
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    /* Wrong answers review */
    var wrongItems = [];
    var self = this;

    def.sections.forEach(function (section, sIdx) {
      section.questions.forEach(function (q, qIdx) {
        if (
          q.type !== "multiple-choice" &&
          q.type !== "listen-choose" &&
          q.type !== "fill-blank"
        )
          return;

        var userAns = (self._sectionAnswers[sIdx] || [])[qIdx];
        var isCorrect = false;

        if (q.type === "fill-blank") {
          isCorrect =
            (userAns || "").toString().trim().toLowerCase() ===
            q.answer.toLowerCase();
        } else {
          isCorrect = userAns === q.correct;
        }

        if (!isCorrect) {
          wrongItems.push({ section: section.name, q: q, userAns: userAns });
        }
      });
    });

    var reviewHTML = "";
    if (wrongItems.length > 0) {
      var wrongCards = wrongItems
        .slice(0, 5)
        .map(function (item) {
          var q = item.q;
          var correctText =
            q.type === "fill-blank" ? q.answer : q.options[q.correct];
          var userText =
            q.type === "fill-blank"
              ? item.userAns || "(no answer)"
              : item.userAns !== null &&
                  item.userAns !== undefined &&
                  q.options &&
                  q.options[item.userAns] !== undefined
                ? q.options[item.userAns]
                : "(no answer)";

          return `
                    <div style="padding:var(--space-4);border:1px solid var(--border);
                                border-radius:var(--radius-lg);margin-bottom:var(--space-3);">
                        <div style="font-size:var(--text-xs);font-weight:var(--weight-bold);
                                    color:var(--text-muted);text-transform:uppercase;
                                    letter-spacing:0.5px;margin-bottom:var(--space-2);">
                            ${item.section}
                        </div>
                        <div style="font-size:var(--text-sm);color:var(--text-primary);
                                    font-weight:var(--weight-medium);margin-bottom:var(--space-3);">
                            ${q.question}
                        </div>
                        <div style="display:flex;flex-direction:column;gap:var(--space-1);">
                            <div style="font-size:var(--text-sm);color:var(--error);">
                                ✗ Your answer: ${userText}
                            </div>
                            <div style="font-size:var(--text-sm);color:var(--success);">
                                ✓ Correct: ${correctText}
                            </div>
                        </div>
                        ${
                          q.explanation
                            ? `
                            <div style="font-size:var(--text-xs);color:var(--text-secondary);
                                        margin-top:var(--space-2);
                                        padding:var(--space-2) var(--space-3);
                                        background:var(--surface-2);
                                        border-radius:var(--radius-sm);">
                                💡 ${q.explanation}
                            </div>
                        `
                            : ""
                        }
                    </div>
                `;
        })
        .join("");

      reviewHTML = `
                <div class="section-header" style="margin-top:var(--space-8);">
                    <div class="section-title">Review Your Mistakes</div>
                </div>
                ${wrongCards}
                ${
                  wrongItems.length > 5
                    ? `
                    <div style="font-size:var(--text-sm);color:var(--text-muted);
                                text-align:center;margin-top:var(--space-2);">
                        +${wrongItems.length - 5} more
                    </div>
                `
                    : ""
                }
            `;
    }

    var html = `
            <div class="page-header entrance-1">
                <div class="page-title">Exam Complete</div>
                <div class="page-subtitle">
                    ${def.name} — Practice Results
                </div>
            </div>

            <!-- Result Banner -->
            <div class="exam-result-banner
                        ${passed ? "exam-result-pass" : "exam-result-fail"}
                        entrance-2">
                <div style="font-size:48px;margin-bottom:var(--space-3);">
                    ${passed ? "🏆" : "📚"}
                </div>
                <div class="exam-result-label">
                    ${passed ? "PASS" : "NOT YET"}
                </div>
                <div class="exam-result-score">${overallPct}%</div>
                <div class="exam-result-note">
                    ${
                      passed
                        ? "Excellent! You passed the practice exam."
                        : "Keep studying! You need " +
                          def.passMark +
                          "% to pass."
                    }
                </div>
                <div style="font-size:var(--text-sm);color:var(--text-secondary);
                            margin-top:var(--space-2);">
                    ${totalCorrect} correct out of ${totalGradable} questions
                </div>
            </div>

            <!-- Section Breakdown -->
            <div class="section-header entrance-3">
                <div class="section-title">Section Breakdown</div>
            </div>
            <div class="card entrance-3" style="padding:0;overflow:hidden;">
                <div style="padding:var(--space-5);display:flex;
                            flex-direction:column;gap:0;">
                    ${sectionResultsHTML}
                </div>
            </div>

            ${reviewHTML}

            <!-- Action Buttons -->
            <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;
                        margin-top:var(--space-8);padding-top:var(--space-6);
                        border-top:1px solid var(--border);">
                <button class="btn btn-ghost"
                        onclick="Router.navigate('#level-${this._levelId}')">
                    <i data-lucide="grid"></i>
                    Back to Topics
                </button>
                <button class="btn btn-secondary"
                        onclick="ExamScreen.render()">
                    <i data-lucide="refresh-cw"></i>
                    Try Again
                </button>
                <button class="btn btn-primary"
                        onclick="Router.navigate('#dashboard')">
                    <i data-lucide="home"></i>
                    Dashboard
                </button>
            </div>
        `;

    this._updateContent(html);
    this._saveExamResult(overallPct, passed);
  },

  /* ── Save result to progress ────────────────────────── */
  _saveExamResult(pct, passed) {
    var lang = this._langCode || "de";
    var levelId = this._levelId || "a1";

    var langProgress = AppState.getLanguageProgress(lang);
    if (!langProgress.examHistory) langProgress.examHistory = [];

    langProgress.examHistory.push({
      levelId: levelId,
      examName: this._examDef ? this._examDef.name : "",
      score: pct,
      passed: passed,
      date: new Date().toISOString(),
    });
  },
};
