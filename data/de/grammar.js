/* ============================================================
   INFEMO — GERMAN GRAMMAR HANDBOOK
   16 core grammar topics covering Goethe A1 requirements.
   ============================================================ */

var DEGrammar = {
  topics: [
    /* ── 1. ARTICLES ─────────────────────────────────── */
    {
      id: "articles",
      title: "Articles — der, die, das",
      icon: "type",
      level: "A1",
      intro:
        "Every German noun has a grammatical gender — masculine, feminine, or neuter. The article changes based on the gender. You must memorise the article with every noun.",
      sections: [
        {
          heading: "Definite Articles (The)",
          type: "table",
          headers: ["Gender", "Article", "Example"],
          rows: [
            ["Masculine (der)", "der", "der Mann — the man"],
            ["Feminine (die)", "die", "die Frau — the woman"],
            ["Neuter (das)", "das", "das Kind — the child"],
            ["Plural (all)", "die", "die Männer — the men"],
          ],
        },
        {
          heading: "Indefinite Articles (A / An)",
          type: "table",
          headers: ["Gender", "Article", "Example"],
          rows: [
            ["Masculine", "ein", "ein Mann — a man"],
            ["Feminine", "eine", "eine Frau — a woman"],
            ["Neuter", "ein", "ein Kind — a child"],
            ["Plural", "—", "Männer — men (no article)"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "Der Kaffee ist heiß.",
              en: "The coffee is hot.",
              note: "der — masculine",
            },
            {
              de: "Die Tür ist offen.",
              en: "The door is open.",
              note: "die — feminine",
            },
            {
              de: "Das Buch ist interessant.",
              en: "The book is interesting.",
              note: "das — neuter",
            },
            {
              de: "Ich habe ein Auto.",
              en: "I have a car.",
              note: "ein — neuter indefinite",
            },
            {
              de: "Das ist eine Katze.",
              en: "That is a cat.",
              note: "eine — feminine indefinite",
            },
          ],
        },
      ],
      tip: 'Always learn the article with the noun. Say "der Tisch" not just "Tisch". Think of the article as part of the word itself.',
    },

    /* ── 2. PERSONAL PRONOUNS ─────────────────────────── */
    {
      id: "pronouns",
      title: "Personal Pronouns",
      icon: "user",
      level: "A1",
      intro:
        'Personal pronouns replace nouns in sentences. German has formal (Sie) and informal (du) ways to say "you" — choosing the right one is important.',
      sections: [
        {
          heading: "All Personal Pronouns",
          type: "table",
          headers: ["Pronoun", "Meaning", "Usage"],
          rows: [
            ["ich", "I", "Talking about yourself"],
            ["du", "you (informal)", "Friends, family, children"],
            ["er", "he", "Masculine noun or male person"],
            ["sie", "she", "Feminine noun or female person"],
            ["es", "it", "Neuter noun"],
            ["wir", "we", "You and others"],
            ["ihr", "you all (informal)", "Multiple people you know well"],
            ["sie", "they", "Multiple people / things"],
            ["Sie", "you (formal)", "Strangers, professionals, elders"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            { de: "Ich heiße Max.", en: "My name is Max.", note: "ich — I" },
            {
              de: "Du bist nett.",
              en: "You are nice.",
              note: "du — informal you",
            },
            {
              de: "Er kommt aus Berlin.",
              en: "He comes from Berlin.",
              note: "er — he",
            },
            {
              de: "Wir lernen Deutsch.",
              en: "We are learning German.",
              note: "wir — we",
            },
            {
              de: "Sie sprechen gut.",
              en: "You speak well.",
              note: "Sie — formal you",
            },
          ],
        },
      ],
      tip: 'Note that "sie" can mean she, they, or formal you. Context and capitalisation (Sie) tell them apart. "Sie" (formal) is always capitalised in German.',
    },

    /* ── 3. VERB CONJUGATION ──────────────────────────── */
    {
      id: "conjugation",
      title: "Verb Conjugation — Present Tense",
      icon: "zap",
      level: "A1",
      intro:
        "German verbs change their ending based on the subject pronoun. Most regular verbs follow the same pattern. Two critical irregular verbs — sein (to be) and haben (to have) — must be memorised separately.",
      sections: [
        {
          heading: "Regular Verbs — lernen (to learn)",
          type: "table",
          headers: ["Pronoun", "Ending", "Form"],
          rows: [
            ["ich", "-e", "lerne"],
            ["du", "-st", "lernst"],
            ["er/sie/es", "-t", "lernt"],
            ["wir", "-en", "lernen"],
            ["ihr", "-t", "lernt"],
            ["sie/Sie", "-en", "lernen"],
          ],
        },
        {
          heading: "sein — to be (irregular)",
          type: "table",
          headers: ["Pronoun", "Form"],
          rows: [
            ["ich", "bin"],
            ["du", "bist"],
            ["er/sie/es", "ist"],
            ["wir", "sind"],
            ["ihr", "seid"],
            ["sie/Sie", "sind"],
          ],
        },
        {
          heading: "haben — to have (irregular)",
          type: "table",
          headers: ["Pronoun", "Form"],
          rows: [
            ["ich", "habe"],
            ["du", "hast"],
            ["er/sie/es", "hat"],
            ["wir", "haben"],
            ["ihr", "habt"],
            ["sie/Sie", "haben"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            { de: "Ich bin müde.", en: "I am tired.", note: "sein" },
            { de: "Du hast ein Auto.", en: "You have a car.", note: "haben" },
            {
              de: "Er lernt Deutsch.",
              en: "He is learning German.",
              note: "regular verb",
            },
            {
              de: "Wir arbeiten viel.",
              en: "We work a lot.",
              note: "regular verb",
            },
            {
              de: "Sie sind freundlich.",
              en: "You are friendly.",
              note: "formal Sie + sein",
            },
          ],
        },
      ],
      tip: "Memorise sein and haben first. They appear in almost every sentence. Once you know them, regular verbs follow a predictable pattern: stem + ending.",
    },

    /* ── 4. WORD ORDER ────────────────────────────────── */
    {
      id: "word-order",
      title: "Word Order — Basic Sentence Structure",
      icon: "align-left",
      level: "A1",
      intro:
        "German follows a Subject–Verb–Object (SVO) pattern in simple sentences. The verb always occupies the second position in a main clause — this is the most important word order rule.",
      sections: [
        {
          heading: "The Verb-Second Rule",
          type: "rule-cards",
          items: [
            {
              title: "Normal Order: Subject – Verb – Object",
              example: "Ich trinke Kaffee.",
              english: "I drink coffee.",
              note: "Subject (Ich) is first, verb (trinke) is second.",
            },
            {
              title: "Inverted Order: Time – Verb – Subject",
              example: "Heute trinke ich Kaffee.",
              english: "Today I drink coffee.",
              note: "When time (Heute) moves to first position, verb stays second, subject moves to third.",
            },
            {
              title: "Questions: Verb – Subject",
              example: "Trinkst du Kaffee?",
              english: "Do you drink coffee?",
              note: "Yes/No questions start with the verb.",
            },
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "Ich wohne in Berlin.",
              en: "I live in Berlin.",
              note: "normal SVO",
            },
            {
              de: "In Berlin wohne ich.",
              en: "In Berlin I live.",
              note: "place moved to front — verb still 2nd",
            },
            {
              de: "Morgen arbeite ich nicht.",
              en: "Tomorrow I am not working.",
              note: "time word front — verb 2nd",
            },
            {
              de: "Er liest ein Buch.",
              en: "He reads a book.",
              note: "normal SVO",
            },
          ],
        },
      ],
      tip: "Think of the verb as an anchor nailed to position 2. Everything else can move around it, but the verb stays fixed in second place.",
    },

    /* ── 5. NEGATION ──────────────────────────────────── */
    {
      id: "negation",
      title: "Negation — nicht and kein",
      icon: "x-circle",
      level: "A1",
      intro:
        'German uses two words for negation. "Nicht" negates verbs and adjectives. "Kein" negates nouns and replaces the indefinite article.',
      sections: [
        {
          heading: "When to use nicht vs kein",
          type: "table",
          headers: ["Use", "Word", "Example"],
          rows: [
            ["Negate a verb", "nicht", "Ich arbeite nicht. — I do not work."],
            [
              "Negate an adjective",
              "nicht",
              "Das ist nicht gut. — That is not good.",
            ],
            [
              "Negate a noun (with indefinite article)",
              "kein/keine",
              "Ich habe kein Auto. — I have no car.",
            ],
            [
              "Negate a noun (no article)",
              "kein/keine",
              "Ich habe keine Zeit. — I have no time.",
            ],
          ],
        },
        {
          heading: "kein follows article rules",
          type: "table",
          headers: ["Gender", "Form", "Example"],
          rows: [
            ["Masculine", "kein", "kein Kaffee — no coffee"],
            ["Feminine", "keine", "keine Zeit — no time"],
            ["Neuter", "kein", "kein Bier — no beer"],
            ["Plural", "keine", "keine Kinder — no children"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "Ich verstehe nicht.",
              en: "I do not understand.",
              note: "nicht negates the verb",
            },
            {
              de: "Das ist nicht richtig.",
              en: "That is not correct.",
              note: "nicht negates adjective",
            },
            {
              de: "Ich habe keine Ahnung.",
              en: "I have no idea.",
              note: "keine — feminine noun",
            },
            {
              de: "Er hat kein Geld.",
              en: "He has no money.",
              note: "kein — neuter noun",
            },
            {
              de: "Sie ist nicht müde.",
              en: "She is not tired.",
              note: "nicht with sein",
            },
          ],
        },
      ],
      tip: 'Quick rule: if you can say "a" or "an" before the noun in English, use kein/keine. If you\'re negating an action or description, use nicht.',
    },

    /* ── 6. QUESTIONS ─────────────────────────────────── */
    {
      id: "questions",
      title: "Questions — W-Questions and Yes/No",
      icon: "help-circle",
      level: "A1",
      intro:
        "German forms questions in two ways: yes/no questions where the verb moves to first position, and W-questions that start with a question word.",
      sections: [
        {
          heading: "Yes / No Questions",
          type: "rule-cards",
          items: [
            {
              title: "Invert verb and subject",
              example: "Kommst du aus Deutschland?",
              english: "Are you from Germany?",
              note: "Verb moves to position 1, subject to position 2.",
            },
            {
              title: "Answer with ja or nein",
              example: "Ja, ich komme aus Pakistan.",
              english: "Yes, I come from Pakistan.",
              note: "Ja = yes, Nein = no. Verb goes to second position after ja/nein.",
            },
          ],
        },
        {
          heading: "W-Question Words",
          type: "table",
          headers: ["German", "English", "Example"],
          rows: [
            ["Wer?", "Who?", "Wer ist das? — Who is that?"],
            ["Was?", "What?", "Was machst du? — What are you doing?"],
            ["Wo?", "Where?", "Wo wohnst du? — Where do you live?"],
            ["Wann?", "When?", "Wann kommst du? — When are you coming?"],
            ["Wie?", "How?", "Wie heißt du? — What is your name?"],
            [
              "Warum?",
              "Why?",
              "Warum lernst du Deutsch? — Why are you learning German?",
            ],
            ["Woher?", "From where?", "Woher kommst du? — Where are you from?"],
            ["Wohin?", "Where to?", "Wohin gehst du? — Where are you going?"],
            [
              "Wie viel?",
              "How much?",
              "Wie viel kostet das? — How much does that cost?",
            ],
          ],
        },
      ],
      tip: "In all German questions — W-questions and yes/no questions — the conjugated verb always comes second (right after the question word or at position 1 for yes/no).",
    },

    /* ── 7. MODAL VERBS ───────────────────────────────── */
    {
      id: "modals",
      title: "Modal Verbs — können, möchten, müssen",
      icon: "settings",
      level: "A1",
      intro:
        "Modal verbs express ability, desire, or necessity. They change the meaning of another verb. In a sentence with a modal verb, the main verb moves to the very end of the sentence in its infinitive form.",
      sections: [
        {
          heading: "The Three Core A1 Modals",
          type: "table",
          headers: ["Verb", "Meaning", "Ich-form"],
          rows: [
            ["können", "can / to be able to", "kann"],
            ["möchten", "would like to (polite)", "möchte"],
            ["müssen", "must / have to", "muss"],
          ],
        },
        {
          heading: "können — full conjugation",
          type: "table",
          headers: ["Pronoun", "Form"],
          rows: [
            ["ich", "kann"],
            ["du", "kannst"],
            ["er/sie/es", "kann"],
            ["wir", "können"],
            ["ihr", "könnt"],
            ["sie/Sie", "können"],
          ],
        },
        {
          heading: "möchten — full conjugation",
          type: "table",
          headers: ["Pronoun", "Form"],
          rows: [
            ["ich", "möchte"],
            ["du", "möchtest"],
            ["er/sie/es", "möchte"],
            ["wir", "möchten"],
            ["ihr", "möchtet"],
            ["sie/Sie", "möchten"],
          ],
        },
        {
          heading: "Sentence Structure with Modals",
          type: "examples",
          items: [
            {
              de: "Ich kann Deutsch sprechen.",
              en: "I can speak German.",
              note: "können — infinitive at end",
            },
            {
              de: "Ich möchte einen Kaffee trinken.",
              en: "I would like to drink a coffee.",
              note: "möchten — very polite",
            },
            {
              de: "Ich muss jetzt gehen.",
              en: "I must go now.",
              note: "müssen — obligation",
            },
            {
              de: "Kannst du mir helfen?",
              en: "Can you help me?",
              note: "question with modal",
            },
            {
              de: "Wir möchten bestellen.",
              en: "We would like to order.",
              note: "useful in restaurants",
            },
          ],
        },
      ],
      tip: "The infinitive always goes to the END of the sentence with a modal. Think: modal stays second, infinitive jumps to last.",
    },

    /* ── 8. PLURAL FORMS ──────────────────────────────── */
    {
      id: "plurals",
      title: "Plural Forms",
      icon: "copy",
      level: "A1",
      intro:
        "German plurals are irregular — each noun has its own plural form that must be memorised. However, there are common patterns that can help.",
      sections: [
        {
          heading: "Common Plural Patterns",
          type: "table",
          headers: ["Pattern", "Ending Added", "Example"],
          rows: [
            ["No change", "—", "das Zimmer → die Zimmer (room)"],
            ["Add -e", "-e", "der Tag → die Tage (day)"],
            ["Add -e + umlaut", "-e + ¨", "die Nacht → die Nächte (night)"],
            ["Add -er", "-er", "das Kind → die Kinder (child)"],
            ["Add -er + umlaut", "-er + ¨", "das Buch → die Bücher (book)"],
            ["Add -en", "-en", "die Frau → die Frauen (woman)"],
            ["Add -n", "-n", "die Blume → die Blumen (flower)"],
            ["Add -s (loanwords)", "-s", "das Auto → die Autos (car)"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "ein Kind → zwei Kinder",
              en: "one child → two children",
              note: "-er ending",
            },
            {
              de: "eine Frau → drei Frauen",
              en: "one woman → three women",
              note: "-en ending",
            },
            {
              de: "ein Auto → fünf Autos",
              en: "one car → five cars",
              note: "-s ending (loanword)",
            },
            {
              de: "das Haus → die Häuser",
              en: "the house → the houses",
              note: "-er + umlaut",
            },
            {
              de: "der Mann → die Männer",
              en: "the man → the men",
              note: "umlaut + -er",
            },
          ],
        },
      ],
      tip: 'All German nouns use "die" in the plural, regardless of their singular gender. When learning a noun, learn it as: article + noun + plural (e.g. der Mann, Männer).',
    },

    /* ── 9. CASES — NOMINATIVE & ACCUSATIVE ──────────── */
    {
      id: "cases",
      title: "Cases — Nominative and Accusative",
      icon: "layers",
      level: "A1",
      intro:
        "German nouns and articles change their form depending on their role in the sentence. At A1, you need nominative (subject) and accusative (direct object).",
      sections: [
        {
          heading: "Nominative vs Accusative",
          type: "rule-cards",
          items: [
            {
              title: "Nominative — the subject (who is doing the action)",
              example: "Der Mann trinkt Kaffee.",
              english: "The man drinks coffee.",
              note: '"Der Mann" is the subject — nominative.',
            },
            {
              title: "Accusative — the direct object (receiving the action)",
              example: "Ich sehe den Mann.",
              english: "I see the man.",
              note: '"Den Mann" is the object — accusative. "der" becomes "den" for masculine.',
            },
          ],
        },
        {
          heading: "Article Changes (Nominative → Accusative)",
          type: "table",
          headers: ["Gender", "Nominative", "Accusative"],
          rows: [
            ["Masculine", "der / ein", "den / einen  ← changes!"],
            ["Feminine", "die / eine", "die / eine   (no change)"],
            ["Neuter", "das / ein", "das / ein    (no change)"],
            ["Plural", "die / —", "die / —      (no change)"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "Der Hund ist groß.",
              en: "The dog is big.",
              note: "nominative — subject",
            },
            {
              de: "Ich sehe den Hund.",
              en: "I see the dog.",
              note: "accusative — object, der→den",
            },
            {
              de: "Die Katze schläft.",
              en: "The cat sleeps.",
              note: "nominative feminine — no change",
            },
            {
              de: "Ich habe eine Katze.",
              en: "I have a cat.",
              note: "accusative feminine — no change",
            },
            {
              de: "Er kauft das Brot.",
              en: "He buys the bread.",
              note: "accusative neuter — no change",
            },
          ],
        },
      ],
      tip: "Only masculine articles change in the accusative (der→den, ein→einen). Feminine, neuter, and plural stay the same. Focus on spotting masculine nouns.",
    },

    /* ── 10. SEPARABLE VERBS ──────────────────────────── */
    {
      id: "separable-verbs",
      title: "Separable Verbs",
      icon: "scissors",
      level: "A1",
      intro:
        "Many German verbs have a prefix that can split off and move to the end of the sentence. These are called separable verbs (trennbare Verben).",
      sections: [
        {
          heading: "Common Separable Verbs",
          type: "table",
          headers: ["Verb", "Meaning", "Prefix"],
          rows: [
            ["aufmachen", "to open", "auf-"],
            ["zumachen", "to close", "zu-"],
            ["anrufen", "to call", "an-"],
            ["aufstehen", "to get up", "auf-"],
            ["einkaufen", "to shop", "ein-"],
            ["mitkommen", "to come along", "mit-"],
            ["anfangen", "to begin", "an-"],
            ["fernsehen", "to watch TV", "fern-"],
          ],
        },
        {
          heading: "How Separable Verbs Work",
          type: "examples",
          items: [
            {
              de: "Ich mache die Tür auf.",
              en: "I open the door.",
              note: "aufmachen — auf goes to end",
            },
            {
              de: "Er ruft seine Mutter an.",
              en: "He calls his mother.",
              note: "anrufen — an goes to end",
            },
            {
              de: "Wir stehen um 7 Uhr auf.",
              en: "We get up at 7 o'clock.",
              note: "aufstehen — auf to end",
            },
            {
              de: "Ich kaufe heute ein.",
              en: "I am shopping today.",
              note: "einkaufen — ein to end",
            },
            {
              de: "Kommst du mit?",
              en: "Are you coming along?",
              note: "mitkommen — mit to end (question)",
            },
          ],
        },
      ],
      tip: "The prefix always jumps to the very last position in the sentence. In questions and with modal verbs, the rule stays the same — prefix still goes last.",
    },

    /* ── 11. POSSESSIVE PRONOUNS ──────────────────────── */
    {
      id: "possessives",
      title: "Possessive Pronouns — mein, dein, sein",
      icon: "tag",
      level: "A1",
      intro:
        "Possessive pronouns show ownership. They agree with the gender of the noun they describe, not the owner.",
      sections: [
        {
          heading: "Possessive Pronoun Table",
          type: "table",
          headers: ["Owner", "Pronoun", "Feminine/Plural"],
          rows: [
            ["ich (I)", "mein", "meine"],
            ["du (you)", "dein", "deine"],
            ["er (he)", "sein", "seine"],
            ["sie (she)", "ihr", "ihre"],
            ["es (it)", "sein", "seine"],
            ["wir (we)", "unser", "unsere"],
            ["ihr (you all)", "euer", "eure"],
            ["sie/Sie (they/formal you)", "ihr/Ihr", "ihre/Ihre"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "Das ist mein Buch.",
              en: "That is my book.",
              note: "mein — neuter noun",
            },
            {
              de: "Das ist meine Schwester.",
              en: "That is my sister.",
              note: "meine — feminine noun",
            },
            {
              de: "Das ist sein Auto.",
              en: "That is his car.",
              note: "sein — neuter noun",
            },
            {
              de: "Wo ist deine Jacke?",
              en: "Where is your jacket?",
              note: "deine — feminine noun",
            },
            {
              de: "Unser Haus ist groß.",
              en: "Our house is big.",
              note: "unser — neuter noun",
            },
          ],
        },
      ],
      tip: 'Possessive pronouns follow the same endings as the indefinite article ein/eine. If you know "ein" and "eine", you already know how to change "mein" to "meine".',
    },

    /* ── 12. PREPOSITIONS ─────────────────────────────── */
    {
      id: "prepositions",
      title: "Key Prepositions",
      icon: "map-pin",
      level: "A1",
      intro:
        "Prepositions connect nouns to the rest of the sentence. Each preposition requires a specific case (accusative or dative). At A1, the most common ones are used with set phrases.",
      sections: [
        {
          heading: "Essential A1 Prepositions",
          type: "table",
          headers: ["Preposition", "Meaning", "Case", "Example"],
          rows: [
            ["aus", "from / out of", "Dative", "Ich komme aus Pakistan."],
            ["in", "in / into", "Dat./Acc.", "Ich wohne in Berlin."],
            ["mit", "with", "Dative", "Ich fahre mit dem Bus."],
            ["bei", "at / near", "Dative", "Ich bin bei meiner Mutter."],
            ["zu", "to (people/places)", "Dative", "Ich gehe zu Fuß."],
            [
              "nach",
              "to (cities/countries)",
              "Dative",
              "Ich fahre nach Deutschland.",
            ],
            ["von", "from / of", "Dative", "Das ist von meiner Mutter."],
            ["für", "for", "Accusative", "Das ist für dich."],
            ["ohne", "without", "Accusative", "Kaffee ohne Milch."],
            ["durch", "through", "Accusative", "Wir gehen durch den Park."],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "Ich komme aus der Türkei.",
              en: "I come from Turkey.",
              note: "aus — origin",
            },
            {
              de: "Ich fahre mit dem Zug.",
              en: "I am travelling by train.",
              note: "mit — method of transport",
            },
            {
              de: "Das Geschenk ist für dich.",
              en: "The gift is for you.",
              note: "für — recipient",
            },
            {
              de: "Wir fahren nach München.",
              en: "We are going to Munich.",
              note: "nach — city destination",
            },
            {
              de: "Kaffee mit Milch und Zucker.",
              en: "Coffee with milk and sugar.",
              note: "mit — accompaniment",
            },
          ],
        },
      ],
      tip: 'At A1, learn prepositions as fixed phrases rather than rules. "aus Deutschland" (from Germany), "mit dem Bus" (by bus), "nach Hause" (home) — learn them as chunks.',
    },

    /* ── 13. ADJECTIVES ───────────────────────────────── */
    {
      id: "adjectives",
      title: "Adjectives — Describing Nouns",
      icon: "palette",
      level: "A1",
      intro:
        'Adjectives describe nouns. When used after the verb "to be" (predicative), they don\'t change. When placed directly before the noun (attributive), they must agree with the gender.',
      sections: [
        {
          heading: "Predicative Adjectives (after sein) — No Endings",
          type: "examples",
          items: [
            {
              de: "Das Haus ist groß.",
              en: "The house is big.",
              note: "groß — no change after sein",
            },
            {
              de: "Die Frau ist nett.",
              en: "The woman is nice.",
              note: "nett — no change after sein",
            },
            {
              de: "Der Mann ist müde.",
              en: "The man is tired.",
              note: "müde — no change after sein",
            },
            {
              de: "Das Essen ist lecker.",
              en: "The food is delicious.",
              note: "lecker — no change after sein",
            },
          ],
        },
        {
          heading: "Common Adjectives to Know at A1",
          type: "table",
          headers: ["German", "English", "German", "English"],
          rows: [
            ["groß", "big", "klein", "small"],
            ["gut", "good", "schlecht", "bad"],
            ["schön", "beautiful", "hässlich", "ugly"],
            ["neu", "new", "alt", "old"],
            ["teuer", "expensive", "billig", "cheap"],
            ["schnell", "fast", "langsam", "slow"],
            ["warm", "warm", "kalt", "cold"],
            ["nett", "nice", "freundlich", "friendly"],
          ],
        },
      ],
      tip: "Start with predicative adjectives (after sein) — they require no changes. Attributive adjectives (before nouns) have endings that change — learn those at A2.",
    },

    /* ── 14. TELLING TIME ─────────────────────────────── */
    {
      id: "telling-time",
      title: "Telling Time and Dates",
      icon: "clock",
      level: "A1",
      intro:
        "Telling the time in German uses both formal (24-hour) and informal (12-hour) systems. Dates use ordinal numbers and follow a fixed format.",
      sections: [
        {
          heading: "Asking and Telling the Time",
          type: "table",
          headers: ["German", "English"],
          rows: [
            ["Wie viel Uhr ist es?", "What time is it?"],
            ["Es ist ein Uhr.", "It is one o'clock."],
            ["Es ist drei Uhr.", "It is three o'clock."],
            [
              "Es ist halb vier.",
              "It is half past three. (literally: half four)",
            ],
            ["Es ist Viertel nach zwei.", "It is quarter past two."],
            ["Es ist Viertel vor fünf.", "It is quarter to five."],
            ["Es ist zehn nach acht.", "It is ten past eight."],
            ["Es ist zwanzig vor neun.", "It is twenty to nine."],
          ],
        },
        {
          heading: "Important Time Vocabulary",
          type: "table",
          headers: ["German", "English"],
          rows: [
            ["heute", "today"],
            ["morgen", "tomorrow"],
            ["gestern", "yesterday"],
            ["jetzt", "now"],
            ["früh / morgens", "in the morning"],
            ["mittags", "at midday"],
            ["abends", "in the evening"],
            ["nachts", "at night"],
            ["um ... Uhr", "at ... o'clock"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            {
              de: "Es ist halb drei.",
              en: "It is half past two.",
              note: "halb = half of the next hour",
            },
            {
              de: "Der Kurs beginnt um 9 Uhr.",
              en: "The course starts at 9.",
              note: "um = at (time)",
            },
            {
              de: "Morgen arbeite ich nicht.",
              en: "Tomorrow I am not working.",
              note: "morgen = tomorrow",
            },
            {
              de: "Heute ist Montag.",
              en: "Today is Monday.",
              note: "heute = today",
            },
          ],
        },
      ],
      tip: '"Halb" in German means half of the NEXT hour, not the current one. "Halb vier" = 3:30, not 4:30. This trips up most learners at first.',
    },

    /* ── 15. IMPERATIVE ───────────────────────────────── */
    {
      id: "imperative",
      title: "Imperative — Giving Commands",
      icon: "chevrons-right",
      level: "A1",
      intro:
        "The imperative is used for commands, instructions, and requests. It has different forms depending on who you are speaking to.",
      sections: [
        {
          heading: "Forming the Imperative",
          type: "table",
          headers: ["Form", "How to Form", "Example (kommen)"],
          rows: [
            ["du (informal singular)", "verb stem (no -en)", "Komm! — Come!"],
            [
              "ihr (informal plural)",
              "stem + -t",
              "Kommt! — Come! (to a group)",
            ],
            ["Sie (formal)", "Sie + infinitive", "Kommen Sie! — Come!"],
            ["wir (let's...)", "wir + infinitive", "Kommen wir! — Let's come!"],
          ],
        },
        {
          heading: "Examples",
          type: "examples",
          items: [
            { de: "Komm her!", en: "Come here!", note: "du form — informal" },
            {
              de: "Warte bitte!",
              en: "Please wait!",
              note: "du form — bitte softens it",
            },
            {
              de: "Sprechen Sie langsamer, bitte!",
              en: "Please speak more slowly!",
              note: "Sie form — formal",
            },
            {
              de: "Schreib deinen Namen!",
              en: "Write your name!",
              note: "du form — schreiben",
            },
            {
              de: "Gehen wir!",
              en: "Let's go!",
              note: "wir form — suggestion",
            },
          ],
        },
      ],
      tip: 'Adding "bitte" (please) to any command makes it much more polite. "Kommen Sie, bitte" is very different from "Komm!" — always use bitte in formal situations.',
    },

    /* ── 16. COMMON PHRASES ───────────────────────────── */
    {
      id: "common-phrases",
      title: "Essential Fixed Phrases",
      icon: "message-circle",
      level: "A1",
      intro:
        "Some German phrases are best learned as fixed chunks rather than by analysing their grammar. These appear constantly in real-life German and in the Goethe A1 exam.",
      sections: [
        {
          heading: "Must-Know A1 Phrases",
          type: "table",
          headers: ["German", "English", "When to Use"],
          rows: [
            [
              "Wie geht es Ihnen?",
              "How are you? (formal)",
              "First meeting or professional context",
            ],
            ["Wie geht's?", "How are you? (casual)", "Friends and family"],
            ["Mir geht es gut.", "I am fine.", 'Answering "how are you"'],
            [
              "Entschuldigung!",
              "Excuse me!",
              "Getting attention or apologising",
            ],
            ["Es tut mir leid.", "I am sorry.", "Apologising"],
            [
              "Ich verstehe nicht.",
              "I do not understand.",
              "When you don't follow something",
            ],
            [
              "Können Sie das wiederholen?",
              "Can you repeat that?",
              "Asking for repetition (formal)",
            ],
            ["Wie bitte?", "Pardon? / What?", "Asking someone to repeat"],
            [
              "Ich spreche kein Deutsch.",
              "I do not speak German.",
              "When you need English",
            ],
            ["Wo ist...?", "Where is...?", "Asking for directions"],
            ["Was kostet das?", "How much does that cost?", "Shopping"],
            [
              "Ich hätte gern...",
              "I would like...",
              "Ordering in shops/restaurants",
            ],
            ["Die Rechnung, bitte.", "The bill, please.", "At a restaurant"],
            ["Herzlich willkommen!", "Welcome!", "Welcoming someone"],
            ["Alles klar!", "All good! / Got it!", "Acknowledging something"],
          ],
        },
      ],
      tip: 'Memorise "Wie bitte?" and "Können Sie das wiederholen?" immediately — you will need them constantly as a beginner. Never be afraid to say "Ich verstehe nicht."',
    },
  ],
};
