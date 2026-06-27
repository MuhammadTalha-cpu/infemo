/* ============================================================
   INFEMO — GERMAN A1 TOPICS & LESSON CONTENT
   12 topics. Greetings is fully populated.
   Others unlock as the lesson engine is developed.
   ============================================================ */

var DEA1Topics = [
  {
    id: "greetings",
    name: "Greetings & Farewells",
    icon: "smile",
    lessonCount: 4,
    description: "Say hello, goodbye, and introduce yourself",
    cefr: "A1",
    certRelevance: "Sprechen — Sich vorstellen",
    cultureCorner: {
      flag: "🇩🇪",
      title: "Culture Corner",
      text: "In Germany, handshakes are the standard greeting when meeting someone for the first time — even in casual settings. Among close friends, a single cheek kiss is common. Always greet with full eye contact and a firm handshake.",
    },
    lessons: [
      /* ─── LESSON 1 — VOCABULARY ─────────────────── */
      {
        type: "vocabulary",
        title: "Greetings Vocabulary",
        intro:
          "Learn the most essential German greetings. Click the audio button to hear each word.",
        words: [
          {
            word: "Hallo",
            translation: "Hello",
            partOfSpeech: "interjection",
            note: "Casual — used with friends and family",
          },
          {
            word: "Guten Morgen",
            translation: "Good morning",
            partOfSpeech: "phrase",
            note: "Used from 6am to around noon",
          },
          {
            word: "Guten Tag",
            translation: "Good day",
            partOfSpeech: "phrase",
            note: "Formal hello — safe at any time of day",
          },
          {
            word: "Guten Abend",
            translation: "Good evening",
            partOfSpeech: "phrase",
            note: "Used from around 6pm onward",
          },
          {
            word: "Gute Nacht",
            translation: "Good night",
            partOfSpeech: "phrase",
            note: "Only when going to bed — not a normal goodbye",
          },
          {
            word: "Tschüss",
            translation: "Bye",
            partOfSpeech: "interjection",
            note: "Casual goodbye — very common in everyday German",
          },
          {
            word: "Auf Wiedersehen",
            translation: "Goodbye",
            partOfSpeech: "phrase",
            note: 'Formal farewell — literally "until we see again"',
          },
          {
            word: "Bitte",
            translation: "Please",
            partOfSpeech: "adverb",
            note: 'Also means "You\'re welcome" and "Here you go"',
          },
          {
            word: "Danke",
            translation: "Thank you",
            partOfSpeech: "adverb",
            note: 'Add "sehr" for "Danke sehr" — Thank you very much',
          },
          {
            word: "Ja",
            translation: "Yes",
            partOfSpeech: "particle",
            note: null,
          },
          {
            word: "Nein",
            translation: "No",
            partOfSpeech: "particle",
            note: null,
          },
          {
            word: "Wie geht es Ihnen?",
            translation: "How are you?",
            partOfSpeech: "phrase",
            note: 'Formal. Casual version: "Wie geht\'s?"',
          },
        ],
      },

      /* ─── LESSON 2 — DIALOGUE ────────────────────── */
      {
        type: "dialogue",
        title: "Erste Begegnung",
        subtitle: "First Meeting",
        intro:
          'Anna and Max meet for the first time at a German language course. Read through the conversation, then press "Listen" to hear it.',
        lines: [
          {
            speaker: "Anna",
            text: "Guten Morgen!",
            translation: "Good morning!",
          },
          {
            speaker: "Max",
            text: "Guten Morgen! Wie heißen Sie?",
            translation: "Good morning! What is your name?",
          },
          {
            speaker: "Anna",
            text: "Ich heiße Anna. Und Sie?",
            translation: "My name is Anna. And you?",
          },
          {
            speaker: "Max",
            text: "Ich heiße Max. Woher kommen Sie?",
            translation: "My name is Max. Where are you from?",
          },
          {
            speaker: "Anna",
            text: "Ich komme aus Pakistan. Und Sie?",
            translation: "I come from Pakistan. And you?",
          },
          {
            speaker: "Max",
            text: "Ich komme aus Deutschland. Schön, Sie kennenzulernen!",
            translation: "I am from Germany. Nice to meet you!",
          },
          {
            speaker: "Anna",
            text: "Danke! Auf Wiedersehen, Max!",
            translation: "Thank you! Goodbye, Max!",
          },
          {
            speaker: "Max",
            text: "Tschüss, Anna! Bis morgen!",
            translation: "Bye, Anna! Until tomorrow!",
          },
        ],
        keyPhrases: [
          { phrase: "Wie heißen Sie?", meaning: "What is your name? (formal)" },
          { phrase: "Ich heiße ...", meaning: "My name is ..." },
          {
            phrase: "Woher kommen Sie?",
            meaning: "Where are you from? (formal)",
          },
          { phrase: "Ich komme aus ...", meaning: "I come from ..." },
          {
            phrase: "Schön, Sie kennenzulernen",
            meaning: "Nice to meet you (formal)",
          },
        ],
      },

      /* ─── LESSON 3 — GRAMMAR NOTE ───────────────── */
      {
        type: "grammar",
        title: "Du vs. Sie — Formal and Informal",
        intro:
          'German has two ways to say "you". Choosing the right one matters.',
        rule: "Use <strong>du</strong> (informal) with friends, family, children, and peers your own age. Use <strong>Sie</strong> (formal, always capitalized) with strangers, elders, teachers, and in professional settings.",
        examples: [
          {
            de: "Wie heißt <strong>du</strong>?",
            en: "What is your name? (informal)",
            label: "Informal — talking to a friend",
            color: "success",
          },
          {
            de: "Wie heißen <strong>Sie</strong>?",
            en: "What is your name? (formal)",
            label: "Formal — talking to a stranger or boss",
            color: "primary",
          },
          {
            de: "Woher kommst <strong>du</strong>?",
            en: "Where are you from? (informal)",
            label: "Informal — talking to a classmate",
            color: "success",
          },
          {
            de: "Woher kommen <strong>Sie</strong>?",
            en: "Where are you from? (formal)",
            label: "Formal — talking to a new colleague",
            color: "primary",
          },
        ],
        tip: 'When unsure, always start with "Sie". The other person will tell you if "du" is okay — this is called "das Du anbieten" (offering the du).',
        additionalNote:
          'Notice that formal "Sie" verbs end in <strong>-en</strong> (heißen, kommen), while informal "du" verbs end in <strong>-st</strong> (heißt, kommst).',
      },

      /* ─── LESSON 4 — EXERCISE ───────────────────── */
      {
        type: "exercise",
        title: "Greetings Practice",
        intro: "Test what you have learned. Take your time with each question.",
        questions: [
          {
            type: "multiple-choice",
            question: 'What does "Guten Morgen" mean?',
            options: ["Good evening", "Good morning", "Good night", "Good day"],
            correct: 1,
            explanation:
              '"Guten Morgen" is used as a greeting from early morning until about noon.',
          },
          {
            type: "multiple-choice",
            question: "Which is the FORMAL way to say goodbye?",
            options: ["Tschüss", "Ciao", "Auf Wiedersehen", "Hallo"],
            correct: 2,
            explanation:
              '"Auf Wiedersehen" is the formal farewell, literally meaning "until we see each other again". "Tschüss" is casual.',
          },
          {
            type: "fill-blank",
            sentence: "___ Tag! Ich heiße Max.",
            answer: "Guten",
            hint: "formal hello for any time of day",
            translation: "___ day! My name is Max.",
          },
          {
            type: "multiple-choice",
            question: 'When do you use "Sie" instead of "du"?',
            options: [
              "With your best friend",
              "With a stranger or in a formal situation",
              "Only with children",
              "When speaking on the phone",
            ],
            correct: 1,
            explanation:
              '"Sie" (always capitalized) is used for formal situations — strangers, elders, professionals, and anyone you don\'t know well.',
          },
          {
            type: "listen-choose",
            audioText: "Guten Abend",
            audioContext: "sentence",
            question: "What greeting did you just hear?",
            options: ["Good morning", "Good day", "Good evening", "Good night"],
            correct: 2,
            explanation:
              '"Guten Abend" means "Good evening" and is used from around 6pm onward.',
          },
          {
            type: "fill-blank",
            sentence: "Ich komme ___ Pakistan.",
            answer: "aus",
            hint: 'German word for "from" when saying where you are from',
            translation: "I come ___ Pakistan.",
          },
          {
            type: "multiple-choice",
            question: '"Bitte" can mean which of the following?',
            options: [
              "Thank you only",
              "Yes and No",
              "Please, You're welcome, and Here you go",
              "Goodbye only",
            ],
            correct: 2,
            explanation:
              '"Bitte" is very versatile. It means "please" when asking, "you\'re welcome" in response to thanks, and "here you go" when handing something over.',
          },
        ],
      },
    ],
  },

  /* ── Remaining A1 Topics (stubs — content added in later updates) ── */
  {
    id: "numbers",
    name: "Numbers & Counting",
    icon: "hash",
    lessonCount: 4,
    description: "Count from 1 to 100, tell the time, and use prices",
    cefr: "A1",
    certRelevance: "Hören — Zahlen verstehen",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "colors",
    name: "Colors",
    icon: "palette",
    lessonCount: 4,
    description: "Learn all basic colors and how to describe objects",
    cefr: "A1",
    certRelevance: "Lesen — Beschreibungen",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "days-months",
    name: "Days, Months & Seasons",
    icon: "calendar",
    lessonCount: 4,
    description: "Talk about time, dates, and the calendar",
    cefr: "A1",
    certRelevance: "Hören & Lesen — Termine",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "family",
    name: "Family Members",
    icon: "users",
    lessonCount: 4,
    description: "Describe your family and relationships",
    cefr: "A1",
    certRelevance: "Sprechen — Über Familie sprechen",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "body",
    name: "Body Parts",
    icon: "user",
    lessonCount: 4,
    description: "Name body parts and talk about health",
    cefr: "A1",
    certRelevance: "Sprechen — Beim Arzt",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "food",
    name: "Food & Drink",
    icon: "coffee",
    lessonCount: 4,
    description: "Vocabulary for eating, drinking, and shopping",
    cefr: "A1",
    certRelevance: "Hören — Im Restaurant",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "clothing",
    name: "Clothing & Shopping",
    icon: "shopping-bag",
    lessonCount: 4,
    description: "Talk about what you wear and shop for clothes",
    cefr: "A1",
    certRelevance: "Lesen — Anzeigen und Schilder",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "cafe",
    name: "At the Café & Restaurant",
    icon: "star",
    lessonCount: 4,
    description: "Order food and drinks and pay the bill",
    cefr: "A1",
    certRelevance: "Sprechen — Bestellen",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "introducing",
    name: "Introducing Yourself",
    icon: "user-plus",
    lessonCount: 4,
    description: "Share your name, age, job, and where you are from",
    cefr: "A1",
    certRelevance: "Sprechen — Sich vorstellen",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "home",
    name: "Where I Live",
    icon: "home",
    lessonCount: 4,
    description: "Describe your home, city, and neighborhood",
    cefr: "A1",
    certRelevance: "Schreiben — Formular ausfüllen",
    lessons: [],
    cultureCorner: null,
  },
  {
    id: "transport",
    name: "Getting Around",
    icon: "navigation",
    lessonCount: 4,
    description: "Transportation, directions, and getting from A to B",
    cefr: "A1",
    certRelevance: "Hören — Ansagen und Wegbeschreibungen",
    lessons: [],
    cultureCorner: null,
  },
];
