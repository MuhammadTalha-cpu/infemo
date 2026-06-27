/* ============================================================
   INFEMO — LESSON ENGINE
   Handles all four lesson types and all exercise formats.
   Flow: Vocabulary → Dialogue → Grammar → Exercise → Done

   Reading AppState:
     AppState.selectedLanguage → which language ('de')
     AppState.currentLevel     → which level ('a1')
     AppState.currentTopic     → which topic id ('greetings')
   ============================================================ */

var LessonScreen = {
  /* ── Internal State ─────────────────────────────────── */
  _topic: null, // the topic object
  _lessons: [], // array of lesson objects
  _lessonIndex: 0, // which lesson (0-3) we're on
  _questionIndex: 0, // which question within exercise
  _score: 0, // correct answers in exercise
  _answered: false, // has the current question been answered?
  _questionResults: [], // 'correct' | 'wrong' per question

  /* ── render() ───────────────────────────────────────── */
  render() {
    var el = document.getElementById("screen-lesson");
    if (!el) return;

    /* Load topic data */
    var lang = AppState.selectedLanguage || "de";
    var levelId = AppState.currentLevel || "a1";
    var topicId = AppState.currentTopic;

    if (!topicId) {
      Router.navigate("#level-a1");
      return;
    }

    var topics = window.getLevelTopics ? getLevelTopics(lang, levelId) : [];

    this._topic =
      topics.find(function (t) {
        return t.id === topicId;
      }) || null;
    this._lessons =
      this._topic && this._topic.lessons ? this._topic.lessons : [];

    /* Reset state for new topic */
    this._lessonIndex = 0;
    this._questionIndex = 0;
    this._score = 0;
    this._answered = false;
    this._questionResults = [];

    /* Build outer shell */
    el.innerHTML = Sidebar.buildShell(
      "#level-" + levelId,
      this._buildLessonShell(),
    );

    if (window.lucide) lucide.createIcons();

    /* Render first lesson */
    this._renderLesson(0);
  },

  /* ── _buildLessonShell() ────────────────────────────── */
  _buildLessonShell() {
    var lang = AppState.selectedLanguage || "de";
    var levelId = AppState.currentLevel || "a1";
    var topicName = this._topic ? this._topic.name : "Lesson";

    return `
            <!-- Back row -->
            <div style="margin-bottom:var(--space-5);">
                <button class="btn btn-ghost btn-sm"
                        onclick="Router.navigate('#level-${levelId}');">
                    <i data-lucide="arrow-left"></i>
                    Back to ${levelId.toUpperCase()} Topics
                </button>
            </div>

            <!-- Lesson container -->
            <div class="lesson-wrap" id="lesson-inner">
                <!-- Filled by _renderLesson() -->
            </div>
        `;
  },

  /* ── _renderLesson(index) ───────────────────────────── */
  _renderLesson(index) {
    this._lessonIndex = index;

    var inner = document.getElementById("lesson-inner");
    if (!inner) return;

    if (!this._lessons || this._lessons.length === 0) {
      inner.innerHTML = `
                <div class="card">
                    <div class="empty-state" style="padding:var(--space-10);">
                        <i data-lucide="construction" class="empty-state-icon"></i>
                        <div class="empty-state-title">Lesson Coming Soon</div>
                        <div class="empty-state-text">
                            Content for this topic is being prepared.
                            Check back soon!
                        </div>
                        <button class="btn btn-primary" style="margin-top:var(--space-4);"
                                onclick="Router.navigate('#level-${AppState.currentLevel || "a1"}');">
                            <i data-lucide="arrow-left"></i>
                            Back to Topics
                        </button>
                    </div>
                </div>
            `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    var lesson = this._lessons[index];
    if (!lesson) {
      this._showCompletionScreen();
      return;
    }

    /* Progress dots */
    var dotsHTML = this._lessons
      .map(function (l, i) {
        var cls = i < index ? "done" : i === index ? "active" : "";
        return '<div class="lesson-progress-dot ' + cls + '"></div>';
      })
      .join("");

    var lessonTypes = {
      vocabulary: "Vocabulary",
      dialogue: "Dialogue",
      grammar: "Grammar Note",
      exercise: "Exercise",
    };

    inner.innerHTML = `
            <!-- Progress dots -->
            <div class="lesson-progress-bar">
                <span class="lesson-progress-label">Lesson ${index + 1} of ${this._lessons.length}</span>
                ${dotsHTML}
            </div>
            <!-- Lesson content injected below -->
            <div id="lesson-content"></div>
        `;

    if (window.lucide) lucide.createIcons();

    /* Delegate to type-specific renderer */
    var renderers = {
      vocabulary: "_renderVocabulary",
      dialogue: "_renderDialogue",
      grammar: "_renderGrammar",
      exercise: "_renderExercise",
    };

    var method = renderers[lesson.type];
    if (method && typeof this[method] === "function") {
      this[method](lesson);
    }
  },

  /* ══════════════════════════════════════════════════════
       VOCABULARY LESSON
    ══════════════════════════════════════════════════════ */

  _renderVocabulary(lesson) {
    var lang = AppState.selectedLanguage || "de";

    var wordsHTML = lesson.words
      .map(function (w) {
        return `
                <div class="vocab-card">
                    <div class="vocab-card-audio">
                        <button class="audio-btn"
                                data-text="${w.word}"
                                data-context="word"
                                data-lang="${lang}"
                                title="Hear ${w.word}">
                            <i data-lucide="volume-2"></i>
                        </button>
                    </div>
                    <div class="vocab-card-content">
                        <div class="vocab-word">${w.word}</div>
                        <div class="vocab-translation">${w.translation}</div>
                        <span class="vocab-pos">${w.partOfSpeech}</span>
                        ${w.note ? `<div class="vocab-note">${w.note}</div>` : ""}
                    </div>
                </div>
            `;
      })
      .join("");

    document.getElementById("lesson-content").innerHTML = `
            <!-- Header -->
            <div class="lesson-header">
                <div class="lesson-type-tag">
                    <i data-lucide="book-open"></i> Vocabulary
                </div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-intro">${lesson.intro}</div>
            </div>

            <!-- Word Grid -->
            <div class="vocab-grid">${wordsHTML}</div>

            <!-- Next button -->
            <div class="lesson-nav-row">
                <div></div>
                <button class="btn btn-primary"
                        onclick="LessonScreen._nextLesson();">
                    Next Lesson
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        `;

    if (window.lucide) lucide.createIcons();
  },

  /* ══════════════════════════════════════════════════════
       DIALOGUE LESSON
    ══════════════════════════════════════════════════════ */

  _renderDialogue(lesson) {
    var lang = AppState.selectedLanguage || "de";
    var speakers = [];
    lesson.lines.forEach(function (l) {
      if (speakers.indexOf(l.speaker) === -1) speakers.push(l.speaker);
    });
    var firstSpeaker = speakers[0] || "";

    var linesHTML = lesson.lines
      .map(function (line, idx) {
        var isRight = line.speaker !== firstSpeaker;
        var fullText = lesson.lines
          .map(function (l) {
            return l.text;
          })
          .join(". ");

        return `
                <div class="dialogue-line">
                    <div class="dialogue-speaker">${line.speaker}</div>
                    <div class="dialogue-bubble-row">
                        ${
                          !isRight
                            ? `
                            <button class="audio-btn"
                                    data-text="${line.text}"
                                    data-context="sentence"
                                    data-lang="${lang}"
                                    title="Hear this line">
                                <i data-lucide="volume-2"></i>
                            </button>`
                            : ""
                        }
                        <div class="dialogue-bubble ${isRight ? "right" : ""}">
                            <div class="dialogue-text">${line.text}</div>
                            <div class="dialogue-translation">${line.translation}</div>
                        </div>
                        ${
                          isRight
                            ? `
                            <button class="audio-btn"
                                    data-text="${line.text}"
                                    data-context="sentence"
                                    data-lang="${lang}"
                                    title="Hear this line">
                                <i data-lucide="volume-2"></i>
                            </button>`
                            : ""
                        }
                    </div>
                </div>
            `;
      })
      .join("");

    var fullText = lesson.lines
      .map(function (l) {
        return l.text;
      })
      .join(" ");

    var keyPhrasesHTML = "";
    if (lesson.keyPhrases && lesson.keyPhrases.length) {
      keyPhrasesHTML = `
                <div class="key-phrases-section">
                    <div class="key-phrases-title">Key Phrases</div>
                    ${lesson.keyPhrases
                      .map(function (p) {
                        return `
                            <div class="key-phrase-row">
                                <span class="key-phrase-de">${p.phrase}</span>
                                <span class="key-phrase-en">${p.meaning}</span>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
            `;
    }

    document.getElementById("lesson-content").innerHTML = `
            <div class="lesson-header">
                <div class="lesson-type-tag">
                    <i data-lucide="message-circle"></i> Dialogue
                </div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-intro">${lesson.subtitle ? "<em>" + lesson.subtitle + "</em> — " : ""}${lesson.intro}</div>
            </div>

            <!-- Listen all button -->
            <div class="dialogue-listen-bar">
                <span class="dialogue-listen-text">
                    <i data-lucide="volume-2" style="display:inline;width:14px;height:14px;"></i>
                    Click the speaker icons to hear individual lines
                </span>
            </div>

            <!-- Conversation -->
            <div class="dialogue-wrap">${linesHTML}</div>

            ${keyPhrasesHTML}

            <div class="lesson-nav-row">
                <button class="btn btn-ghost btn-sm back-btn"
                        onclick="LessonScreen._renderLesson(${this._lessonIndex - 1})">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <button class="btn btn-primary"
                        onclick="LessonScreen._nextLesson();">
                    Next Lesson
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        `;

    if (window.lucide) lucide.createIcons();
  },

  /* ══════════════════════════════════════════════════════
       GRAMMAR NOTE LESSON
    ══════════════════════════════════════════════════════ */

  _renderGrammar(lesson) {
    var lang = AppState.selectedLanguage || "de";

    var examplesHTML = lesson.examples
      .map(function (ex) {
        return `
                <div class="grammar-example-card ${ex.color}">
                    <div class="grammar-example-label">${ex.label}</div>
                    <div class="grammar-example-de">${ex.de}</div>
                    <div class="grammar-example-en">${ex.en}</div>
                </div>
            `;
      })
      .join("");

    document.getElementById("lesson-content").innerHTML = `
            <div class="lesson-header">
                <div class="lesson-type-tag">
                    <i data-lucide="lightbulb"></i> Grammar Note
                </div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-intro">${lesson.intro}</div>
            </div>

            <!-- Rule Card -->
            <div class="grammar-rule-card">${lesson.rule}</div>

            <!-- Examples -->
            <div class="grammar-examples">${examplesHTML}</div>

            <!-- Tip -->
            ${
              lesson.tip
                ? `
                <div class="grammar-tip">
                    <span class="grammar-tip-icon">💡</span>
                    <span>${lesson.tip}</span>
                </div>
            `
                : ""
            }

            <!-- Additional Note -->
            ${
              lesson.additionalNote
                ? `
                <div class="grammar-additional-note">${lesson.additionalNote}</div>
            `
                : ""
            }

            <div class="lesson-nav-row">
                <button class="btn btn-ghost btn-sm back-btn"
                        onclick="LessonScreen._renderLesson(${this._lessonIndex - 1})">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <button class="btn btn-primary"
                        onclick="LessonScreen._nextLesson();">
                    Got it — Next
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        `;

    if (window.lucide) lucide.createIcons();
  },

  /* ══════════════════════════════════════════════════════
       EXERCISE LESSON
    ══════════════════════════════════════════════════════ */

  _renderExercise(lesson) {
    /* Reset exercise state */
    this._questionIndex = 0;
    this._score = 0;
    this._answered = false;
    this._questionResults = lesson.questions.map(function () {
      return null;
    });

    document.getElementById("lesson-content").innerHTML = `
            <div class="lesson-header">
                <div class="lesson-type-tag">
                    <i data-lucide="check-square"></i> Exercise
                </div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-intro">${lesson.intro}</div>
            </div>

            <!-- Question progress strip -->
            <div class="exercise-progress-strip" id="exercise-strip">
                ${lesson.questions
                  .map(function (q, i) {
                    return `<div class="exercise-progress-pip ${i === 0 ? "active" : ""}"
                                 id="exercise-pip-${i}"></div>`;
                  })
                  .join("")}
            </div>

            <!-- Question renders here -->
            <div id="exercise-question-area"></div>
        `;

    if (window.lucide) lucide.createIcons();

    /* Render first question */
    this._renderQuestion(lesson, 0);
  },

  /* ── _renderQuestion(lesson, idx) ───────────────────── */
  _renderQuestion(lesson, idx) {
    this._questionIndex = idx;
    this._answered = false;

    var q = lesson.questions[idx];
    var area = document.getElementById("exercise-question-area");
    if (!area || !q) return;

    /* Update progress strip */
    lesson.questions.forEach(function (_, i) {
      var pip = document.getElementById("exercise-pip-" + i);
      if (!pip) return;
      pip.className = "exercise-progress-pip";
      if (i < idx) {
        var res = LessonScreen._questionResults[i];
        pip.classList.add(
          res === "correct" ? "correct" : res === "wrong" ? "wrong" : "",
        );
      } else if (i === idx) {
        pip.classList.add("active");
      }
    });

    var typeLabels = {
      "multiple-choice": "Multiple Choice",
      "fill-blank": "Fill in the Blank",
      "listen-choose": "Listen & Choose",
    };

    var letters = ["A", "B", "C", "D", "E"];

    /* ── Multiple Choice ── */
    if (q.type === "multiple-choice") {
      var optionsHTML = q.options
        .map(function (opt, i) {
          return `
                    <button class="mc-option"
                            id="mc-option-${i}"
                            onclick="LessonScreen._checkMC(${idx}, ${i})">
                        <span class="mc-option-letter">${letters[i]}</span>
                        <span>${opt}</span>
                    </button>
                `;
        })
        .join("");

      area.innerHTML = `
                <div class="question-card entrance-1">
                    <div class="question-card-header">
                        <div class="question-number">${idx + 1}</div>
                        <div class="question-type-label">${typeLabels[q.type]}</div>
                    </div>
                    <div class="question-card-body">
                        <div class="question-text">${q.question}</div>
                        <div class="mc-options">${optionsHTML}</div>
                        <div class="answer-feedback" id="answer-feedback"></div>
                    </div>
                </div>
                <div id="next-btn-area"></div>
            `;
    } else if (q.type === "fill-blank") {

    /* ── Fill in Blank ── */
      area.innerHTML = `
                <div class="question-card entrance-1">
                    <div class="question-card-header">
                        <div class="question-number">${idx + 1}</div>
                        <div class="question-type-label">${typeLabels[q.type]}</div>
                    </div>
                    <div class="question-card-body">
                        <div class="fill-blank-sentence">${q.sentence}</div>
                        <div class="fill-blank-translation">${q.translation}</div>
                        <div style="font-size:var(--text-sm);color:var(--text-muted);
                                    margin-bottom:var(--space-3);">
                            Hint: ${q.hint}
                        </div>
                        <div class="fill-blank-input-row">
                            <input class="input fill-blank-input"
                                   type="text"
                                   id="fill-blank-input"
                                   placeholder="Type the missing word..."
                                   autocomplete="off"
                                   autocorrect="off"
                                   autocapitalize="off"
                                   onkeydown="if(event.key==='Enter') LessonScreen._checkFillBlank(${idx})" />
                            <button class="btn btn-primary"
                                    onclick="LessonScreen._checkFillBlank(${idx})">
                                <i data-lucide="check"></i>
                                Check
                            </button>
                        </div>
                        <div class="answer-feedback" id="answer-feedback"></div>
                    </div>
                </div>
                <div id="next-btn-area"></div>
            `;

      /* Focus the input */
      setTimeout(function () {
        var inp = document.getElementById("fill-blank-input");
        if (inp) inp.focus();
      }, 100);
    } else if (q.type === "listen-choose") {

    /* ── Listen & Choose ── */
      var lang = AppState.selectedLanguage || "de";
      var optionsHTML = q.options
        .map(function (opt, i) {
          return `
                    <button class="mc-option"
                            id="mc-option-${i}"
                            onclick="LessonScreen._checkMC(${idx}, ${i})">
                        <span class="mc-option-letter">${letters[i]}</span>
                        <span>${opt}</span>
                    </button>
                `;
        })
        .join("");

      area.innerHTML = `
                <div class="question-card entrance-1">
                    <div class="question-card-header">
                        <div class="question-number">${idx + 1}</div>
                        <div class="question-type-label">${typeLabels[q.type]}</div>
                    </div>
                    <div class="question-card-body">
                        <!-- Listen Button -->
                        <div class="listen-choose-bar">
                            <button class="listen-choose-audio-btn"
                                    onclick="if(window.AudioEngine) AudioEngine.speak('${q.audioText}', '${q.audioContext || "sentence"}', '${lang}');">
                                <i data-lucide="volume-2"></i>
                                Listen
                            </button>
                        </div>
                        <div class="question-text" style="text-align:center;">
                            ${q.question}
                        </div>
                        <div class="mc-options">${optionsHTML}</div>
                        <div class="answer-feedback" id="answer-feedback"></div>
                    </div>
                </div>
                <div id="next-btn-area"></div>
            `;

      /* Auto-play audio after a moment */
      setTimeout(function () {
        if (window.AudioEngine) {
          AudioEngine.speak(q.audioText, q.audioContext || "sentence", lang);
        }
      }, 600);
    }

    if (window.lucide) lucide.createIcons();
  },

  /* ── _checkMC(qIdx, selectedIdx) ───────────────────── */
  _checkMC(qIdx, selectedIdx) {
    if (this._answered) return;
    this._answered = true;

    var lesson = this._lessons[this._lessonIndex];
    var q = lesson.questions[qIdx];
    var correct = selectedIdx === q.correct;

    /* Style all options */
    q.options.forEach(function (_, i) {
      var btn = document.getElementById("mc-option-" + i);
      if (!btn) return;
      btn.disabled = true;
      if (i === q.correct) btn.classList.add("correct");
      else if (i === selectedIdx && !correct) btn.classList.add("wrong");
    });

    this._showFeedback(correct, q.explanation);
    this._questionResults[qIdx] = correct ? "correct" : "wrong";
    if (correct) this._score++;

    this._showNextQuestionButton(lesson, qIdx);
  },

  /* ── _checkFillBlank(qIdx) ──────────────────────────── */
  _checkFillBlank(qIdx) {
    if (this._answered) return;

    var input = document.getElementById("fill-blank-input");
    if (!input) return;

    var userAnswer = input.value.trim().toLowerCase();
    var lesson = this._lessons[this._lessonIndex];
    var q = lesson.questions[qIdx];
    var correctAnswer = q.answer.toLowerCase();

    /* Allow minor typo: exact or starts with first 3 chars */
    var correct =
      userAnswer === correctAnswer ||
      (userAnswer.length >= 3 &&
        correctAnswer.startsWith(userAnswer.substring(0, 3)) &&
        Math.abs(userAnswer.length - correctAnswer.length) <= 1);

    this._answered = true;
    input.disabled = true;
    input.style.borderColor = correct ? "var(--success)" : "var(--error)";

    var explanation = correct
      ? 'Correct! "' + q.answer + '" is right.'
      : "The correct answer is: <strong>" +
        q.answer +
        "</strong>. " +
        (q.hint || "");

    this._showFeedback(correct, explanation);
    this._questionResults[qIdx] = correct ? "correct" : "wrong";
    if (correct) this._score++;

    this._showNextQuestionButton(lesson, qIdx);
  },

  /* ── _showFeedback(correct, explanation) ────────────── */
  _showFeedback(correct, explanation) {
    var feedback = document.getElementById("answer-feedback");
    if (!feedback) return;

    var icon = correct ? "check-circle" : "x-circle";
    var label = correct ? "Correct!" : "Not quite";
    var cls = correct ? "correct-feedback" : "wrong-feedback";

    feedback.className = "answer-feedback visible " + cls;
    feedback.innerHTML = `
            <i data-lucide="${icon}"></i>
            <div class="answer-feedback-text">
                <strong>${label}</strong>
                ${explanation || ""}
            </div>
        `;

    if (window.lucide) lucide.createIcons();
  },

  /* ── _showNextQuestionButton(lesson, qIdx) ──────────── */
  _showNextQuestionButton(lesson, qIdx) {
    var nextArea = document.getElementById("next-btn-area");
    if (!nextArea) return;

    var isLast = qIdx >= lesson.questions.length - 1;

    if (isLast) {
      nextArea.innerHTML = `
                <div style="display:flex;justify-content:flex-end;
                            margin-top:var(--space-5);">
                    <button class="btn btn-primary btn-lg"
                            onclick="LessonScreen._finishExercise();">
                        <i data-lucide="trophy"></i>
                        See Results
                    </button>
                </div>
            `;
    } else {
      nextArea.innerHTML = `
                <div style="display:flex;justify-content:flex-end;
                            margin-top:var(--space-5);">
                    <button class="btn btn-primary"
                            onclick="LessonScreen._renderQuestion(
                                LessonScreen._lessons[LessonScreen._lessonIndex],
                                ${qIdx + 1});">
                        Next Question
                        <i data-lucide="arrow-right"></i>
                    </button>
                </div>
            `;
    }

    if (window.lucide) lucide.createIcons();
  },

  /* ── _finishExercise() ──────────────────────────────── */
  _finishExercise() {
    /* Save topic progress */
    this._saveTopicProgress();
    /* Show completion screen */
    this._showCompletionScreen();
  },

  /* ── _nextLesson() ──────────────────────────────────── */
  _nextLesson() {
    var next = this._lessonIndex + 1;
    if (next >= this._lessons.length) {
      /* Last lesson wasn't an exercise — save and complete */
      this._saveTopicProgress();
      this._showCompletionScreen();
    } else {
      this._renderLesson(next);
    }
  },

  /* ── _saveTopicProgress() ───────────────────────────── */
  _saveTopicProgress() {
    var lang = AppState.selectedLanguage || "de";
    var levelId = AppState.currentLevel || "a1";
    var topicId = AppState.currentTopic;
    if (!topicId) return;

    var langProgress = AppState.getLanguageProgress(lang);
    var levelData = langProgress.levels[levelId];
    if (!levelData) return;

    /* Mark topic as complete */
    if (!levelData.topics) levelData.topics = {};
    levelData.topics[topicId] = {
      started: true,
      completed: true,
      score: this._score,
      completedAt: new Date().toISOString(),
    };

    /* Update lesson count stats */
    AppState.progress.lessonsCompleted =
      (AppState.progress.lessonsCompleted || 0) + 1;

    /* Update streak */
    DateUtils.updateStreak();

    /* Save to localStorage for guest */
    if (AppState.isGuest) {
      var guestData = Storage.getGuestProgress();
      guestData.progress = AppState.progress;
      Storage.saveGuestProgress(guestData);
    }

    /* Check if this unlocks the next topic */
    var topics = window.getLevelTopics ? getLevelTopics(lang, levelId) : [];

    var topicIdx = topics.findIndex(function (t) {
      return t.id === topicId;
    });
    if (topicIdx >= 0 && topicIdx < topics.length - 1) {
      /* Next topic exists — unlock it in state */
      var nextTopicId = topics[topicIdx + 1].id;
      if (!levelData.topics[nextTopicId]) {
        levelData.topics[nextTopicId] = {
          started: false,
          completed: false,
          score: 0,
        };
      }
    }

    /* Check if whole level is complete */
    var allDone =
      topics.length > 0 &&
      topics.every(function (t) {
        var td = levelData.topics && levelData.topics[t.id];
        return td && td.completed;
      });

    if (allDone) {
      levelData.completed = true;
      /* Unlock next level in state */
      var levelOrder = ["a1", "a2", "b1", "b2", "c1", "c2"];
      var currentIdx = levelOrder.indexOf(levelId);
      if (currentIdx >= 0 && currentIdx < levelOrder.length - 1) {
        var nextLevelId = levelOrder[currentIdx + 1];
        if (langProgress.levels[nextLevelId]) {
          langProgress.levels[nextLevelId].unlocked = true;
        }
      }
    }
  },

  /* ── _showCompletionScreen() ────────────────────────── */
  _showCompletionScreen() {
    var inner = document.getElementById("lesson-inner");
    if (!inner) return;

    var totalQ = 0;
    this._lessons.forEach(function (l) {
      if (l.type === "exercise" && l.questions) totalQ += l.questions.length;
    });

    var scoreText = totalQ > 0 ? this._score + " / " + totalQ : "—";
    var pct = totalQ > 0 ? Math.round((this._score / totalQ) * 100) : 100;
    var trophy = pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📖";
    var subText =
      pct >= 80
        ? "Excellent work! Topic complete."
        : pct >= 60
          ? "Good effort! Topic complete."
          : "Topic complete. Review the vocabulary and try again!";

    /* Culture corner */
    var cultureHTML = "";
    if (this._topic && this._topic.cultureCorner) {
      var cc = this._topic.cultureCorner;
      cultureHTML = `
                <div class="completion-culture">
                    <div class="culture-card">
                        <div class="culture-card-icon">${cc.flag}</div>
                        <div>
                            <div class="culture-card-title">${cc.title}</div>
                            <div class="culture-card-text">${cc.text}</div>
                        </div>
                    </div>
                </div>
            `;
    }

    /* Find next topic */
    var lang = AppState.selectedLanguage || "de";
    var levelId = AppState.currentLevel || "a1";
    var topics = window.getLevelTopics ? getLevelTopics(lang, levelId) : [];
    var thisIdx = topics.findIndex(function (t) {
      return t.id === (AppState.currentTopic || "");
    });
    var nextTopic =
      thisIdx >= 0 && thisIdx < topics.length - 1 ? topics[thisIdx + 1] : null;

    inner.innerHTML = `
            <div class="completion-screen">
                <div class="completion-trophy">${trophy}</div>
                <div class="completion-title">Topic Complete!</div>
                <div class="completion-subtitle">${subText}</div>

                <!-- Score -->
                ${
                  totalQ > 0
                    ? `
                    <div class="completion-score-card">
                        <div class="completion-score-item">
                            <div class="completion-score-value">${scoreText}</div>
                            <div class="completion-score-label">Score</div>
                        </div>
                        <div class="completion-score-divider"></div>
                        <div class="completion-score-item">
                            <div class="completion-score-value">${pct}%</div>
                            <div class="completion-score-label">Accuracy</div>
                        </div>
                    </div>
                `
                    : ""
                }

                ${cultureHTML}

                <!-- Actions -->
                <div class="completion-actions">
                    <button class="btn btn-ghost"
                            onclick="Router.navigate('#level-${levelId}');">
                        <i data-lucide="grid"></i>
                        Back to Topics
                    </button>
                    ${
                      nextTopic
                        ? `
                        <button class="btn btn-primary"
                                onclick="AppState.currentTopic='${nextTopic.id}'; LessonScreen.render();">
                            Next Topic: ${nextTopic.name}
                            <i data-lucide="arrow-right"></i>
                        </button>
                    `
                        : `
                        <button class="btn btn-primary"
                                onclick="Router.navigate('#dashboard');">
                            <i data-lucide="home"></i>
                            Back to Dashboard
                        </button>
                    `
                    }
                </div>
            </div>
        `;

    /* Confetti! */
    if (pct >= 60) this._showConfetti();
    if (window.lucide) lucide.createIcons();
  },

  /* ── _showConfetti() ────────────────────────────────── */
  _showConfetti() {
    var container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);

    var colors = [
      "#3B5BDB",
      "#22C55E",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
    ];

    for (var i = 0; i < 60; i++) {
      (function (i) {
        setTimeout(function () {
          var piece = document.createElement("div");
          piece.className = "confetti-piece";
          piece.style.left = Math.random() * 100 + "vw";
          piece.style.width = Math.random() * 8 + 6 + "px";
          piece.style.height = Math.random() * 8 + 6 + "px";
          piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDuration = Math.random() * 2.5 + 2 + "s";
          piece.style.animationDelay = "0s";
          container.appendChild(piece);
        }, i * 30);
      })(i);
    }

    /* Remove after 5 seconds */
    setTimeout(function () {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 5500);
  },
};
