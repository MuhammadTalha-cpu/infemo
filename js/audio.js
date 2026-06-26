/* ============================================================
   INFEMO — UNIVERSAL AUDIO ENGINE
   Handles all speech synthesis for every language.

   DESIGN PRINCIPLE:
   This file never changes when a new language is added.
   All language-specific config lives in data/languages.js.
   The engine reads it dynamically — zero hardcoding here.

   Usage:
     AudioEngine.setLanguage('de')
     AudioEngine.speak('Apfel', 'word')
     AudioEngine.speak('Guten Morgen!', 'sentence')
     AudioEngine.stop()
   ============================================================ */

var AudioEngine = {
  /* ── Internal State ─────────────────────────────────── */
  _voices: [], // all available browser voices
  _activeLanguage: null, // currently selected language config
  _selectedVoice: null, // best available voice for active language
  _userRateMultiplier: 1.0, // user speed preference (0.85 / 1.0 / 1.15)
  _initialized: false, // true after init() completes
  _supported: typeof speechSynthesis !== "undefined",

  /* ── init() ─────────────────────────────────────────────
       Call once on app start. Loads all available voices.
       Voices load asynchronously in some browsers, so we
       wait for the onvoiceschanged event.
    ─────────────────────────────────────────────────────── */
  init() {
    if (!this._supported) {
      console.warn(
        "AudioEngine: speechSynthesis not supported in this browser.",
      );
      return;
    }

    var self = this;

    var loadVoices = function () {
      self._voices = speechSynthesis.getVoices();
      self._initialized = true;

      /* Re-select voice if a language was already chosen */
      if (self._activeLanguage) {
        self._selectedVoice = self._selectBestVoice(
          self._activeLanguage.voicePreferences,
          self._activeLanguage.langCode,
        );
      }
    };

    /* Some browsers load voices synchronously */
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    }

    /* Others fire onvoiceschanged when ready */
    speechSynthesis.onvoiceschanged = loadVoices;
  },

  /* ── setLanguage(langCode) ───────────────────────────────
       Switch to a different language.
       Reads config from data/languages.js AudioConfig.
       Called when user selects a language on language-select
       screen, and on every dashboard load.
    ─────────────────────────────────────────────────────── */
  setLanguage(langCode) {
    if (!this._supported) return;

    /* Read config from AudioConfig in data/languages.js */
    var config =
      window.AudioConfig && AudioConfig[langCode]
        ? AudioConfig[langCode]
        : null;

    if (!config) {
      console.warn("AudioEngine: No audio config for language:", langCode);
      /* Fallback — construct a minimal config */
      config = {
        langCode: langCode + "-" + langCode.toUpperCase(),
        voicePreferences: [],
        rates: {
          letter: 0.7,
          word: 0.75,
          sentence: 0.85,
          story: 0.9,
          poem: 0.85,
          pitch: 1.0,
        },
      };
    }

    this._activeLanguage = config;
    this._selectedVoice = this._selectBestVoice(
      config.voicePreferences,
      config.langCode,
    );

    console.log(
      "AudioEngine: Language set to",
      langCode,
      "| Voice:",
      this._selectedVoice
        ? this._selectedVoice.name
        : "browser default for " + config.langCode,
    );
  },

  /* ── speak(text, context, langCode) ─────────────────────
       Speak a piece of text.

       text:     the string to speak
       context:  'letter' | 'word' | 'sentence' | 'story' | 'poem'
                 Controls the speaking rate (slower for letters,
                 faster for stories)
       langCode: optional override (defaults to active language)
    ─────────────────────────────────────────────────────── */
  speak(text, context, langCode) {
    if (!this._supported || !text) return;

    /* If a different language is specified, switch temporarily */
    var config = this._activeLanguage;
    var voice = this._selectedVoice;

    if (langCode && window.AudioConfig && AudioConfig[langCode]) {
      config = AudioConfig[langCode];
      voice = this._selectBestVoice(config.voicePreferences, config.langCode);
    }

    /* If no config at all, use whatever is active */
    if (!config) {
      console.warn("AudioEngine: speak() called before setLanguage()");
      return;
    }

    /* Get rate for this context */
    var contextKey = context || "word";
    var baseRate = config.rates[contextKey] || config.rates.word || 0.8;
    var finalRate = baseRate * this._userRateMultiplier;

    /* Build utterance */
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.langCode;
    utterance.rate = finalRate;
    utterance.pitch = config.rates.pitch || 1.0;
    utterance.volume = 1.0;

    /* Assign best available voice */
    if (voice) utterance.voice = voice;

    /* Cancel any speech currently playing */
    speechSynthesis.cancel();

    /* Small delay after cancel (fixes Firefox bug) */
    var self = this;
    setTimeout(function () {
      speechSynthesis.speak(utterance);
    }, 50);
  },

  /* ── stop() ─────────────────────────────────────────────
       Stop any currently playing speech.
    ─────────────────────────────────────────────────────── */
  stop() {
    if (this._supported) {
      speechSynthesis.cancel();
    }
  },

  /* ── setUserRate(preference) ────────────────────────────
       Set user's preferred speaking speed.
       preference: 'slow' | 'normal' | 'fast'
       Saved in Settings, read on app start.
    ─────────────────────────────────────────────────────── */
  setUserRate(preference) {
    var multipliers = {
      slow: 0.82,
      normal: 1.0,
      fast: 1.18,
    };
    this._userRateMultiplier = multipliers[preference] || 1.0;
    AppState.speechRate = preference;
    Storage.set(Storage.KEYS.SPEECH_RATE, preference);
  },

  /* ── isSupported() ──────────────────────────────────────
       Returns true if the browser supports speech synthesis.
    ─────────────────────────────────────────────────────── */
  isSupported() {
    return this._supported;
  },

  /* ── hasVoiceForLanguage(langCode) ──────────────────────
       Returns true if any voice matching the language is
       available on this device.
    ─────────────────────────────────────────────────────── */
  hasVoiceForLanguage(langCode) {
    if (!this._supported) return false;
    /* Re-fetch voices in case they loaded after init() */
    var voices = speechSynthesis.getVoices();
    if (voices.length > 0) this._voices = voices;
    var prefix = langCode.toLowerCase();
    return this._voices.some(function (v) {
      return v.lang.toLowerCase().startsWith(prefix);
    });
  },

  /* ── reloadVoices() ─────────────────────────────────────
       Re-fetches all voices and re-selects for active lang.
       Call this when a screen first renders audio content.
    ─────────────────────────────────────────────────────── */
  reloadVoices() {
    this._voices = speechSynthesis.getVoices();
    if (this._activeLanguage) {
      this._selectedVoice = this._selectBestVoice(
        this._activeLanguage.voicePreferences,
        this._activeLanguage.langCode,
      );
    }
    return this._voices.length;
  },

  /* ── getAvailableVoicesForLang(langCode) ────────────────
       Returns all available voices that match a language.
       Useful for debugging what voices a browser has.
    ─────────────────────────────────────────────────────── */
  getAvailableVoicesForLang(langCode) {
    var config = window.AudioConfig && AudioConfig[langCode];
    if (!config) return [];

    var prefix = langCode.toLowerCase();
    return this._voices.filter(function (v) {
      return v.lang.toLowerCase().startsWith(prefix);
    });
  },

  /* ── _selectBestVoice(preferences, langCode) ────────────
       INTERNAL — Selects the best available voice.

       Strategy:
       1. Try each preferred voice name in order
       2. Fall back to any voice matching the lang code
       3. If nothing found, return null (browser uses default)

       This function is the ONLY place that knows about
       voice selection. Nothing else in the app touches this.
    ─────────────────────────────────────────────────────── */
  _selectBestVoice(preferences, langCode) {
    if (!this._voices || this._voices.length === 0) return null;

    /* Try preferred voices first */
    if (preferences && preferences.length > 0) {
      for (var i = 0; i < preferences.length; i++) {
        var preferred = preferences[i].toLowerCase();
        var found = this._voices.find(function (v) {
          return v.name.toLowerCase().includes(preferred);
        });
        if (found) return found;
      }
    }

    /* Fallback: any voice where lang starts with the language prefix */
    var prefix = langCode ? langCode.substring(0, 2).toLowerCase() : "";

    if (prefix) {
      var fallback = this._voices.find(function (v) {
        return v.lang.toLowerCase().startsWith(prefix);
      });
      if (fallback) return fallback;
    }

    /* Nothing found — browser will use its own default for the lang */
    return null;
  },
};
