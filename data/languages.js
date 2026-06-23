/* ============================================================
   INFEMO — LANGUAGES DATA
   Master list of all supported and coming-soon languages.
   Each entry defines the language's display info,
   certification body, and level system.
   ============================================================ */

/* ── Audio Configuration ────────────────────────────────────
   Voice preferences for each language.
   The AudioEngine reads these to select the best available
   voice on the user's device.
   Priority: first voice in the list is most preferred.
─────────────────────────────────────────────────────────── */
var AudioConfig = {
  de: {
    langCode: "de-DE",
    voicePreferences: [
      "Microsoft Hedda",
      "Microsoft Stefan",
      "Microsoft Katja",
      "Google Deutsch",
      "Anna",
    ],
    rates: {
      letter: 0.7,
      word: 0.75,
      sentence: 0.85,
      story: 0.9,
      poem: 0.85,
      pitch: 1.0,
    },
  },

  fr: {
    langCode: "fr-FR",
    voicePreferences: [
      "Microsoft Hortense",
      "Microsoft Julie",
      "Microsoft Paul",
      "Google français",
      "Amelie",
    ],
    rates: {
      letter: 0.7,
      word: 0.75,
      sentence: 0.85,
      story: 0.9,
      poem: 0.85,
      pitch: 1.0,
    },
  },

  es: {
    langCode: "es-ES",
    voicePreferences: [
      "Microsoft Helena",
      "Microsoft Pablo",
      "Microsoft Laura",
      "Google español",
      "Monica",
    ],
    rates: {
      letter: 0.7,
      word: 0.76,
      sentence: 0.85,
      story: 0.9,
      poem: 0.85,
      pitch: 1.0,
    },
  },

  it: {
    langCode: "it-IT",
    voicePreferences: [
      "Microsoft Elsa",
      "Microsoft Cosimo",
      "Google italiano",
      "Alice",
    ],
    rates: {
      letter: 0.7,
      word: 0.76,
      sentence: 0.86,
      story: 0.9,
      poem: 0.86,
      pitch: 1.0,
    },
  },

  ja: {
    langCode: "ja-JP",
    voicePreferences: [
      "Microsoft Haruka",
      "Microsoft Ichiro",
      "Microsoft Ayumi",
      "Google 日本語",
      "Kyoko",
    ],
    rates: {
      letter: 0.6,
      word: 0.68,
      sentence: 0.78,
      story: 0.83,
      poem: 0.78,
      pitch: 1.0,
    },
  },

  ar: {
    langCode: "ar-SA",
    voicePreferences: ["Microsoft Naayf", "Microsoft Hoda", "Google العربية"],
    rates: {
      letter: 0.65,
      word: 0.7,
      sentence: 0.8,
      story: 0.86,
      poem: 0.8,
      pitch: 1.0,
    },
  },
};

/* ── Language List ──────────────────────────────────────────
   The full list of languages shown on the language
   selection screen.
   status: 'active' = clickable, 'coming-soon' = greyed out
─────────────────────────────────────────────────────────── */
var Languages = [
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    status: "active",
    levelSystemKey: "GOETHE_CEFR",
    certBody: "Goethe-Institut",
    certName: "Goethe-Zertifikat",
    certURL: "https://www.goethe.de/en/spr/kup/prf.html",
    levelRange: "A1 → C2",
    description: "Most spoken language in the EU",
    audio: null, // set below after AudioConfig is defined
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    status: "coming-soon",
    levelSystemKey: "DELF_DALF",
    certBody: "France Éducation International",
    certName: "DELF / DALF",
    certURL: "https://www.france-education-international.fr/delf-dalf",
    levelRange: "A1 → C2",
    description: "Official language in 29 countries",
    audio: null,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    status: "coming-soon",
    levelSystemKey: "DELE",
    certBody: "Instituto Cervantes",
    certName: "DELE",
    certURL: "https://examenes.cervantes.es/es/dele/que-es",
    levelRange: "A1 → C2",
    description: "500+ million native speakers",
    audio: null,
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    status: "coming-soon",
    levelSystemKey: "CILS",
    certBody: "Univ. for Foreigners of Siena",
    certName: "CILS",
    certURL: "https://cils.unistrasi.it",
    levelRange: "A1 → C2",
    description: "Language of art and opera",
    audio: null,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    status: "coming-soon",
    levelSystemKey: "JLPT",
    certBody: "Japan Foundation / JEES",
    certName: "JLPT",
    certURL: "https://www.jlpt.jp/e/",
    levelRange: "N5 → N1",
    description: "Gateway to Japanese culture",
    audio: null,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    status: "coming-soon",
    levelSystemKey: "CEFR",
    certBody: "CEFR Framework",
    certName: "CEFR",
    certURL: null,
    levelRange: "A1 → C2",
    description: "Spoken by 400 million people",
    audio: null,
  },
];

/* Link AudioConfig to each language entry */
Languages.forEach((lang) => {
  lang.audio = AudioConfig[lang.code] || null;
});

/* ── Helper Functions ───────────────────────────────────── */

/* Get a language object by its code */
function getLanguage(code) {
  return Languages.find((l) => l.code === code) || null;
}

/* Get only active languages */
function getActiveLanguages() {
  return Languages.filter((l) => l.status === "active");
}
