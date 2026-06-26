/* ============================================================
   INFEMO — PHONETICS SCREEN
   Complete German phonetics with audio on every element.
   5 tabs: Alphabet, Umlauts, ß Special, Combinations, Stress
   ============================================================ */

var PhoneticsScreen = {
  activeTab: "alphabet",

  /* ── render() ───────────────────────────────────────── */
  render() {
    const el = document.getElementById("screen-phonetics");
    if (!el) return;

    el.innerHTML = Sidebar.buildShell("#phonetics", this.buildMainContent());

    if (window.lucide) lucide.createIcons();

    // Reload voices — they may have loaded since app start
    if (window.AudioEngine) AudioEngine.reloadVoices();

    // Check if German voice is available
    this.checkVoiceAvailability();

    // Set active tab
    this.switchTab(this.activeTab);
  },

  /* ── checkVoiceAvailability() ───────────────────────── */
  checkVoiceAvailability() {
    if (!window.AudioEngine) return;

    var hasGerman = AudioEngine.hasVoiceForLanguage("de");

    if (!hasGerman) {
      var content = document.getElementById("phonetics-content");
      if (!content) return;

      /* Show a dismissable warning banner */
      var banner = document.createElement("div");
      banner.id = "voice-warning-banner";
      banner.style.cssText = `
                background: var(--warning-bg);
                border: 1px solid rgba(245,158,11,0.3);
                border-radius: var(--radius-lg);
                padding: var(--space-4) var(--space-5);
                margin-bottom: var(--space-4);
                display: flex;
                align-items: flex-start;
                gap: var(--space-3);
                font-size: var(--text-sm);
                color: var(--text-secondary);
                line-height: var(--leading-normal);
            `;
      banner.innerHTML = `
                <span style="font-size:20px; flex-shrink:0;">⚠️</span>
                <div style="flex:1;">
                    <strong style="color:var(--warning);display:block;margin-bottom:4px;">
                        German voice not found on this device
                    </strong>
                    Audio will play in English until a German voice is installed.
                    To fix: <strong>Windows Settings → Time & Language →
                    Language & Region → Add a language → Deutsch (Deutschland)
                    → check "Text-to-speech" → Install</strong>.
                    Then restart Chrome.
                </div>
                <button onclick="document.getElementById('voice-warning-banner').remove()"
                        style="background:none;border:none;cursor:pointer;
                               color:var(--text-muted);font-size:18px;
                               line-height:1;flex-shrink:0;padding:0;">
                    ×
                </button>
            `;

      content.insertBefore(banner, content.firstChild);
    }
  },

  /* ── buildMainContent() ─────────────────────────────── */
  buildMainContent() {
    return `
            <!-- Page Header -->
            <div class="page-header entrance-1">
                <div class="page-title">Phonetics Foundation</div>
                <div class="page-subtitle">
                    Every German letter and sound — before anything else
                </div>
            </div>

            <!-- Tab Bar -->
            <div class="tab-bar entrance-2" id="phonetics-tabs">
                <div class="tab ${this.activeTab === "alphabet" ? "tab-active" : ""}"
                     onclick="PhoneticsScreen.switchTab('alphabet')">
                    <i data-lucide="text"></i> Alphabet
                </div>
                <div class="tab ${this.activeTab === "umlauts" ? "tab-active" : ""}"
                     onclick="PhoneticsScreen.switchTab('umlauts')">
                    Ä Ö Ü Umlauts
                </div>
                <div class="tab ${this.activeTab === "special" ? "tab-active" : ""}"
                     onclick="PhoneticsScreen.switchTab('special')">
                    ß Special
                </div>
                <div class="tab ${this.activeTab === "combinations" ? "tab-active" : ""}"
                     onclick="PhoneticsScreen.switchTab('combinations')">
                    <i data-lucide="link"></i> Combinations
                </div>
                <div class="tab ${this.activeTab === "stress" ? "tab-active" : ""}"
                     onclick="PhoneticsScreen.switchTab('stress')">
                    <i data-lucide="zap"></i> Stress Rules
                </div>
            </div>

            <!-- Tab Content -->
            <div class="phonetics-tab-content entrance-3" id="phonetics-content">
                <!-- Filled by switchTab() -->
            </div>
        `;
  },

  /* ── switchTab(tabName) ─────────────────────────────── */
  switchTab(tabName) {
    this.activeTab = tabName;

    // Update tab active states
    document.querySelectorAll("#phonetics-tabs .tab").forEach((tab, i) => {
      const tabs = ["alphabet", "umlauts", "special", "combinations", "stress"];
      tab.classList.toggle("tab-active", tabs[i] === tabName);
    });

    // Render content
    const content = document.getElementById("phonetics-content");
    if (!content) return;

    const renderers = {
      alphabet: () => this.buildAlphabetTab(),
      umlauts: () => this.buildUmlautsTab(),
      special: () => this.buildSpecialTab(),
      combinations: () => this.buildCombinationsTab(),
      stress: () => this.buildStressTab(),
    };

    content.innerHTML = (renderers[tabName] || renderers.alphabet)();
    if (window.lucide) lucide.createIcons();
  },

  /* ── buildAlphabetTab() ─────────────────────────────── */
  buildAlphabetTab() {
    if (!window.DEPhonetics || !DEPhonetics.alphabet) {
      return '<p class="text-muted" style="padding:2rem;">Phonetics data loading...</p>';
    }

    return `
            <div class="phonetics-intro">
                <i data-lucide="info"></i>
                Every German letter with its name, IPA symbol, and how it differs from English.
                Click <i data-lucide="volume-2" style="display:inline;width:14px;height:14px;"></i>
                to hear each one.
            </div>
            <div class="phonetics-grid">
                ${DEPhonetics.alphabet.map((l) => this.buildLetterCard(l)).join("")}
            </div>
        `;
  },

  /* ── buildUmlautsTab() ──────────────────────────────── */
  buildUmlautsTab() {
    if (!window.DEPhonetics || !DEPhonetics.umlauts) return "";

    return `
            <div class="phonetics-intro">
                <i data-lucide="info"></i>
                The three umlauts (Ä, Ö, Ü) have no direct English equivalent.
                Each can be written as ae, oe, ue when the umlaut key is unavailable.
            </div>
            <div class="phonetics-grid" style="grid-template-columns: repeat(3, 1fr);">
                ${DEPhonetics.umlauts.map((u) => this.buildUmlautCard(u)).join("")}
            </div>
        `;
  },

  /* ── buildSpecialTab() ──────────────────────────────── */
  buildSpecialTab() {
    if (!window.DEPhonetics || !DEPhonetics.special) return "";
    const s = DEPhonetics.special[0];

    return `
            <div class="phonetics-intro">
                <i data-lucide="info"></i>
                The ß (Eszett or "scharfes S") is unique to German.
                It always sounds like double "ss" and follows specific spelling rules.
            </div>
            <div class="special-card">
                <div class="special-card-header">
                    <div>
                        <div class="special-display">ß</div>
                        <div style="margin-top:var(--space-2);">
                            <span class="text-ipa">${s.ipa}</span>
                            <span class="text-body-sm" style="margin-left:var(--space-2);">
                                ${s.english}
                            </span>
                        </div>
                        <div style="margin-top:var(--space-2);font-size:var(--text-sm);
                                    color:var(--text-muted);">
                            Also written as: <strong>ss</strong> (in Switzerland and when typing)
                        </div>
                    </div>
                    <button class="audio-btn"
                            data-text="ß" data-context="letter" data-lang="de"
                            title="Listen">
                        <i data-lucide="volume-2"></i>
                    </button>
                </div>
                <div class="special-card-body">
                    <div class="heading-4" style="margin-bottom:var(--space-3);">
                        When to use ß
                    </div>
                    <div class="special-rules">
                        ${s.rules
                          .map(
                            (r) => `
                            <div class="special-rule-item">
                                <div class="special-rule-bullet"></div>
                                <div>
                                    <strong>${r.rule}:</strong>
                                    <span class="text-body-sm" style="margin-left:4px;">
                                        ${r.example}
                                    </span>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                    <div class="letter-tip" style="margin-top:var(--space-4);">
                        <span class="letter-tip-icon">💡</span>
                        <span>${s.tip}</span>
                    </div>
                    <div style="margin-top:var(--space-5);">
                        <div class="heading-4" style="margin-bottom:var(--space-3);">
                            Examples with audio
                        </div>
                        <div class="letter-examples">
                            ${s.examples
                              .map(
                                (ex) => `
                                <div class="letter-example-row">
                                    <button class="audio-btn"
                                            data-text="${ex.word}"
                                            data-context="word"
                                            data-lang="de"
                                            title="Hear ${ex.word}">
                                        <i data-lucide="volume-2"></i>
                                    </button>
                                    <span class="letter-example-word"
                                          style="font-size:var(--text-base);">
                                        ${ex.word}
                                    </span>
                                    <span class="letter-example-translation">
                                        ${ex.translation}
                                    </span>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        `;
  },

  /* ── buildCombinationsTab() ─────────────────────────── */
  buildCombinationsTab() {
    if (!window.DEPhonetics || !DEPhonetics.combinations) return "";

    return `
            <div class="phonetics-intro">
                <i data-lucide="info"></i>
                German letter combinations produce distinct sounds.
                Many differ significantly from English expectations.
            </div>
            <div class="combo-grid">
                ${DEPhonetics.combinations.map((c) => this.buildComboCard(c)).join("")}
            </div>
        `;
  },

  /* ── buildStressTab() ───────────────────────────────── */
  buildStressTab() {
    if (!window.DEPhonetics || !DEPhonetics.stressRules) return "";

    return `
            <div class="phonetics-intro">
                <i data-lucide="info"></i>
                Stress in German is generally predictable once you learn the rules.
                Capital letters below indicate the stressed syllable.
            </div>
            <div class="stress-list">
                ${DEPhonetics.stressRules
                  .map(
                    (rule, i) => `
                    <div class="stress-card entrance-${Math.min(i + 1, 6)}">
                        <div class="stress-rule-title">${rule.rule}</div>
                        <div class="stress-explanation">${rule.explanation}</div>
                        <div class="stress-examples">
                            ${rule.examples
                              .map(
                                (ex) => `
                                <div class="stress-example-chip">
                                    <div class="stress-example-word">
                                        ${this.formatStressedWord(ex.word)}
                                    </div>
                                    <div class="stress-example-meaning">${ex.meaning}</div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `;
  },

  /* ── buildLetterCard(letter) ────────────────────────── */
  buildLetterCard(letter) {
    return `
            <div class="letter-card">
                <div class="letter-display-row">
                    <div class="letter-display">
                        ${letter.upper}
                        <span class="letter-lower">${letter.lower}</span>
                    </div>
                    <button class="audio-btn"
                            data-text="${letter.lower}"
                            data-context="letter"
                            data-lang="de"
                            title="Hear ${letter.name}">
                        <i data-lucide="volume-2"></i>
                    </button>
                </div>

                <div class="letter-meta">
                    <div class="letter-name">${letter.name}</div>
                    <div class="text-ipa">${letter.ipa}</div>
                    <div class="letter-english">${letter.english}</div>
                </div>

                <div class="letter-examples">
                    ${letter.examples
                      .map(
                        (ex) => `
                        <div class="letter-example-row">
                            <button class="audio-btn"
                                    data-text="${ex.word}"
                                    data-context="word"
                                    data-lang="de"
                                    title="Hear ${ex.word}">
                                <i data-lucide="volume-2"></i>
                            </button>
                            <span class="letter-example-word">
                                ${this.highlightLetter(ex.word, letter.upper, letter.lower)}
                            </span>
                            <span class="letter-example-translation">${ex.translation}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>

                <div class="letter-tip">
                    <span class="letter-tip-icon">💡</span>
                    <span>${letter.tip}</span>
                </div>
            </div>
        `;
  },

  /* ── buildUmlautCard(umlaut) ────────────────────────── */
  buildUmlautCard(umlaut) {
    return `
            <div class="letter-card">
                <div class="letter-display-row">
                    <div class="letter-display">
                        ${umlaut.upper}
                        <span class="letter-lower">${umlaut.lower}</span>
                    </div>
                    <button class="audio-btn"
                            data-text="${umlaut.lower}"
                            data-context="letter"
                            data-lang="de"
                            title="Hear ${umlaut.name}">
                        <i data-lucide="volume-2"></i>
                    </button>
                </div>

                <div class="letter-meta">
                    <div class="letter-name">${umlaut.name}</div>
                    <div class="text-ipa">${umlaut.ipa}</div>
                    <div class="letter-english">${umlaut.english}</div>
                </div>

                <div class="umlaut-alternate">
                    Alternate spelling: <strong>${umlaut.alternate}</strong>
                </div>

                <div class="letter-examples">
                    ${umlaut.examples
                      .map(
                        (ex) => `
                        <div class="letter-example-row">
                            <button class="audio-btn"
                                    data-text="${ex.word}"
                                    data-context="word"
                                    data-lang="de"
                                    title="Hear ${ex.word}">
                                <i data-lucide="volume-2"></i>
                            </button>
                            <span class="letter-example-word">${ex.word}</span>
                            <span class="letter-example-translation">${ex.translation}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>

                <div class="letter-tip">
                    <span class="letter-tip-icon">💡</span>
                    <span>${umlaut.tip}</span>
                </div>
            </div>
        `;
  },

  /* ── buildComboCard(combo) ──────────────────────────── */
  buildComboCard(combo) {
    return `
            <div class="combo-card">
                <div class="combo-header">
                    <div class="combo-letters">${combo.combo}</div>
                    <div class="combo-label">${combo.label}</div>
                </div>
                <div class="combo-description">${combo.description}</div>
                <div class="text-ipa" style="margin-bottom:var(--space-1);">
                    ${combo.ipa}
                </div>
                <div class="combo-english">${combo.english}</div>
                <div class="letter-examples">
                    ${combo.examples
                      .map(
                        (ex) => `
                        <div class="letter-example-row">
                            <button class="audio-btn"
                                    data-text="${ex.word}"
                                    data-context="word"
                                    data-lang="de"
                                    title="Hear ${ex.word}">
                                <i data-lucide="volume-2"></i>
                            </button>
                            <span class="letter-example-word">${ex.word}</span>
                            <span class="letter-example-translation">${ex.translation}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `;
  },

  /* ── highlightLetter(word, upper, lower) ────────────── */
  /* Wraps the first occurrence of the letter in a span   */
  highlightLetter(word, upper, lower) {
    var regex = new RegExp("(" + upper + "|" + lower + ")", "");
    return word.replace(regex, '<span class="highlight">$1</span>');
  },

  /* ── formatStressedWord(word) ───────────────────────── */
  /* Converts UPPERCASE syllables to styled spans         */
  formatStressedWord(word) {
    return word.replace(/([A-ZÄÖÜ]+)/g, function (match) {
      /* If it's a single uppercase letter within a word, keep as-is */
      if (match.length === 1 && word.indexOf(match) === 0) return match;
      return '<span class="stressed">' + match + "</span>";
    });
  },
};
