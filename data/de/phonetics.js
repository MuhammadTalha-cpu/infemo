/* ============================================================
   INFEMO — GERMAN PHONETICS DATA
   Complete phonetics reference for the German language.
   Used by the Phonetics screen (Phase 11).
   ============================================================ */

var DEPhonetics = {
  /* ── 26 Alphabet Letters ────────────────────────────── */
  alphabet: [
    {
      upper: "A",
      lower: "a",
      name: "Ah",
      ipa: "/aː/",
      english: 'Like "a" in father — long and open',
      examples: [
        { word: "Apfel", translation: "apple" },
        { word: "alt", translation: "old" },
      ],
      tip: 'Open your mouth wide. Longer and purer than English "a". No glide at the end.',
    },
    {
      upper: "B",
      lower: "b",
      name: "Beh",
      ipa: "/beː/",
      english: 'Like English "b", but unvoiced at word end',
      examples: [
        { word: "Ball", translation: "ball" },
        { word: "bitte", translation: "please" },
      ],
      tip: 'At the end of a word, B becomes unvoiced — "Lieb" sounds like "Leep".',
    },
    {
      upper: "C",
      lower: "c",
      name: "Tseh",
      ipa: "/tseː/",
      english: 'Like "ts" before a/o/u, like "k" in loanwords',
      examples: [
        { word: "Café", translation: "café" },
        { word: "Celsius", translation: "Celsius" },
      ],
      tip: "C rarely appears alone in native German words. Mostly found in loanwords and names.",
    },
    {
      upper: "D",
      lower: "d",
      name: "Deh",
      ipa: "/deː/",
      english: 'Like English "d", but like "t" at word end',
      examples: [
        { word: "danke", translation: "thank you" },
        { word: "Deutschland", translation: "Germany" },
      ],
      tip: 'At word end, D becomes "t" — "Kind" (child) sounds like "Kint".',
    },
    {
      upper: "E",
      lower: "e",
      name: "Eh",
      ipa: "/eː/",
      english: 'Like "a" in late (long) or "e" in bed (short)',
      examples: [
        { word: "Essen", translation: "food / to eat" },
        { word: "See", translation: "lake / sea" },
      ],
      tip: 'Long E is pure with no glide. Short E is quick, like in "bet".',
    },
    {
      upper: "F",
      lower: "f",
      name: "Ef",
      ipa: "/ɛf/",
      english: 'Exactly like English "f"',
      examples: [
        { word: "Frau", translation: "woman / Mrs." },
        { word: "fünf", translation: "five" },
      ],
      tip: "No difference from English F. One of the easiest German sounds to master.",
    },
    {
      upper: "G",
      lower: "g",
      name: "Geh",
      ipa: "/ɡeː/",
      english: 'Like English "g", becomes "k" at word end',
      examples: [
        { word: "gut", translation: "good" },
        { word: "Tag", translation: "day" },
      ],
      tip: 'At word end, G becomes "k" — "Tag" (day) sounds like "Tak".',
    },
    {
      upper: "H",
      lower: "h",
      name: "Hah",
      ipa: "/haː/",
      english: 'Like English "h" at word start, silent after a vowel',
      examples: [
        { word: "Haus", translation: "house" },
        { word: "gehen", translation: "to go" },
      ],
      tip: 'After a vowel, H is completely silent — "gehen" the H is not heard at all.',
    },
    {
      upper: "I",
      lower: "i",
      name: "Ih",
      ipa: "/iː/",
      english: 'Like "ee" in see (long) or "i" in bit (short)',
      examples: [
        { word: "immer", translation: "always" },
        { word: "Kino", translation: "cinema" },
      ],
      tip: 'Long I is a pure "ee" sound. Short I is quick and clipped.',
    },
    {
      upper: "J",
      lower: "j",
      name: "Yot",
      ipa: "/jɔt/",
      english: 'Like "y" in yes — NEVER like English "j"',
      examples: [
        { word: "ja", translation: "yes" },
        { word: "Jahr", translation: "year" },
      ],
      tip: 'German J is always a "y" sound. "jetzt" (now) is pronounced "yetst" — never with a hard J.',
    },
    {
      upper: "K",
      lower: "k",
      name: "Kah",
      ipa: "/kaː/",
      english: 'Like English "k"',
      examples: [
        { word: "Kaffee", translation: "coffee" },
        { word: "Kind", translation: "child" },
      ],
      tip: 'Never silent, even before "n" — "Knie" (knee) is pronounced "k-nee", not "nee".',
    },
    {
      upper: "L",
      lower: "l",
      name: "El",
      ipa: "/ɛl/",
      english: 'Like English "l"',
      examples: [
        { word: "lernen", translation: "to learn" },
        { word: "hell", translation: "bright" },
      ],
      tip: 'Keep the tip of your tongue on your upper teeth. Lighter than English "l".',
    },
    {
      upper: "M",
      lower: "m",
      name: "Em",
      ipa: "/ɛm/",
      english: 'Identical to English "m"',
      examples: [
        { word: "Mutter", translation: "mother" },
        { word: "mehr", translation: "more" },
      ],
      tip: "One of the easiest letters — identical to English. Relax and say it normally.",
    },
    {
      upper: "N",
      lower: "n",
      name: "En",
      ipa: "/ɛn/",
      english: 'Identical to English "n"',
      examples: [
        { word: "Nacht", translation: "night" },
        { word: "nein", translation: "no" },
      ],
      tip: 'Same as English "n". Before K or G, it may gain a slight nasal quality.',
    },
    {
      upper: "O",
      lower: "o",
      name: "Oh",
      ipa: "/oː/",
      english: 'Like "o" in note (long) or "o" in not (short)',
      examples: [
        { word: "Ofen", translation: "oven" },
        { word: "oft", translation: "often" },
      ],
      tip: "German O is rounder than English. Keep your lips in a circle. No diphthong glide.",
    },
    {
      upper: "P",
      lower: "p",
      name: "Peh",
      ipa: "/peː/",
      english: 'Like English "p"',
      examples: [
        { word: "Post", translation: "mail / post" },
        { word: "Papa", translation: "dad" },
      ],
      tip: 'Same as English "p". Fully pronounced at word end, unlike some English words.',
    },
    {
      upper: "Q",
      lower: "q",
      name: "Kuh",
      ipa: "/kuː/",
      english: 'Always "qu" together — sounds like "kv"',
      examples: [
        { word: "Quelle", translation: "source / spring" },
        { word: "quer", translation: "across / diagonal" },
      ],
      tip: 'Q never appears alone in German. "Qu" is always pronounced like "kv" — "Quelle" = "Kvelle".',
    },
    {
      upper: "R",
      lower: "r",
      name: "Er",
      ipa: "/ʀ/",
      english: "Guttural — made at the back of the throat",
      examples: [
        { word: "rot", translation: "red" },
        { word: "Regen", translation: "rain" },
      ],
      tip: "The German R is made in the back of the throat, not rolled with the tongue. Think of gargling gently.",
    },
    {
      upper: "S",
      lower: "s",
      name: "Es",
      ipa: "/ɛs/",
      english: 'Like "z" at word start, like "s" between/after vowels',
      examples: [
        { word: "Sonne", translation: "sun" },
        { word: "Eis", translation: "ice" },
      ],
      tip: 'At the start of a word before a vowel, S sounds like English "z". Between vowels it sounds like "s".',
    },
    {
      upper: "T",
      lower: "t",
      name: "Teh",
      ipa: "/teː/",
      english: 'Like English "t"',
      examples: [
        { word: "Tag", translation: "day" },
        { word: "Tee", translation: "tea" },
      ],
      tip: "Always fully pronounced. Never silent or softened as in some English words.",
    },
    {
      upper: "U",
      lower: "u",
      name: "Uh",
      ipa: "/uː/",
      english: 'Like "oo" in boot (long) or "u" in put (short)',
      examples: [
        { word: "Uhr", translation: "clock / watch" },
        { word: "und", translation: "and" },
      ],
      tip: 'Pure "oo" sound with fully rounded lips. No glide. Longer and rounder than English.',
    },
    {
      upper: "V",
      lower: "v",
      name: "Fau",
      ipa: "/faʊ/",
      english: 'Sounds like "f" — NOT like English "v"',
      examples: [
        { word: "Vater", translation: "father" },
        { word: "Vogel", translation: "bird" },
      ],
      tip: 'German V sounds like F. "Vater" is pronounced "Fater". In loanwords (like Visum), it may sound like English "v".',
    },
    {
      upper: "W",
      lower: "w",
      name: "Weh",
      ipa: "/veː/",
      english: 'Sounds like "v" — NOT like English "w"',
      examples: [
        { word: "Wasser", translation: "water" },
        { word: "wann", translation: "when" },
      ],
      tip: 'German W sounds like English V. "Wasser" is pronounced "Vasser". This is the opposite of what English speakers expect.',
    },
    {
      upper: "X",
      lower: "x",
      name: "Iks",
      ipa: "/ɪks/",
      english: 'Like "ks" — always',
      examples: [
        { word: "Hexe", translation: "witch" },
        { word: "Taxi", translation: "taxi" },
      ],
      tip: 'Always a "ks" sound. "Hexe" sounds like "Hek-seh". Not common in native German words.',
    },
    {
      upper: "Y",
      lower: "y",
      name: "Üpsilon",
      ipa: "/ˈʏpsɪlɔn/",
      english: 'Usually like "ü" in German words',
      examples: [
        { word: "Yoga", translation: "yoga" },
        { word: "System", translation: "system" },
      ],
      tip: "In German-origin words, Y is pronounced like Ü. In loanwords, it varies with origin.",
    },
    {
      upper: "Z",
      lower: "z",
      name: "Zett",
      ipa: "/tsɛt/",
      english: 'Always "ts" — NEVER like English "z"',
      examples: [
        { word: "Zeit", translation: "time" },
        { word: "Zug", translation: "train" },
      ],
      tip: 'Always a hard "ts" sound like in "pizza". "Zu" sounds like "tsoo". This catches English speakers every time.',
    },
  ],

  /* ── Umlauts ─────────────────────────────────────────── */
  umlauts: [
    {
      upper: "Ä",
      lower: "ä",
      name: "Ah-Umlaut",
      ipa: "/ɛː/",
      english: 'Like "e" in bed — longer version',
      alternate: "ae",
      examples: [
        { word: "Äpfel", translation: "apples" },
        { word: "Bär", translation: "bear" },
      ],
      tip: 'Think of a held-out "e" in "bed". When typing without umlauts, write "ae" instead of "ä".',
    },
    {
      upper: "Ö",
      lower: "ö",
      name: "Oh-Umlaut",
      ipa: "/øː/",
      english: 'No English equivalent — round lips for "o", try to say "e"',
      alternate: "oe",
      examples: [
        { word: "Öl", translation: "oil" },
        { word: "schön", translation: "beautiful" },
      ],
      tip: 'Position your lips as if saying "oh", then try to say "eh". The result is Ö. When typing, write "oe" instead.',
    },
    {
      upper: "Ü",
      lower: "ü",
      name: "Uh-Umlaut",
      ipa: "/yː/",
      english: 'No English equivalent — round lips for "oo", try to say "ee"',
      alternate: "ue",
      examples: [
        { word: "über", translation: "over / about" },
        { word: "Tür", translation: "door" },
      ],
      tip: 'Position your lips as if saying "oo", then try to say "ee". The result is Ü. When typing, write "ue" instead.',
    },
  ],

  /* ── ß (Eszett / Scharfes S) ─────────────────────────── */
  special: [
    {
      upper: "ẞ",
      lower: "ß",
      name: "Eszett",
      ipa: "/ɛsˈtsɛt/",
      english: 'Always sounds exactly like double "ss"',
      examples: [
        { word: "Straße", translation: "street" },
        { word: "Fuß", translation: "foot" },
        { word: "groß", translation: "big" },
        { word: "heiß", translation: "hot" },
      ],
      rules: [
        { rule: "After long vowels", example: "Straße, Fuß, groß" },
        { rule: "After diphthongs", example: "heiß, weiß, außen" },
        {
          rule: 'Use "ss" after short vowels',
          example: "Fluss (river), Kuss (kiss)",
        },
        { rule: "Capital ẞ since 2017", example: "STRASSE → STRAẞE" },
      ],
      tip: 'ß sounds identical to "ss". The rule is simple: use ß after long vowels and diphthongs, use "ss" after short vowels.',
    },
  ],

  /* ── Letter Combinations ─────────────────────────────── */
  combinations: [
    {
      combo: "ch",
      label: "CH — Soft",
      description: "After e, i, ä, ö, ü — and at word start",
      ipa: "/ç/",
      english:
        'Like "h" in "huge" — a soft breath from the middle of the mouth',
      examples: [
        { word: "ich", translation: "I" },
        { word: "Licht", translation: "light" },
        { word: "Milch", translation: "milk" },
      ],
    },
    {
      combo: "ch",
      label: "CH — Hard",
      description: 'After a, o, u — and in "ach"',
      ipa: "/x/",
      english: 'Like "ch" in Scottish "loch" — from the back of the throat',
      examples: [
        { word: "Bach", translation: "stream / brook" },
        { word: "Nacht", translation: "night" },
        { word: "Buch", translation: "book" },
      ],
    },
    {
      combo: "sch",
      label: "SCH",
      description: "Everywhere it appears",
      ipa: "/ʃ/",
      english: 'Exactly like "sh" in "shoe"',
      examples: [
        { word: "Schule", translation: "school" },
        { word: "Fisch", translation: "fish" },
      ],
    },
    {
      combo: "sp",
      label: "SP",
      description: "At the start of a word or syllable",
      ipa: "/ʃp/",
      english: 'Like "shp" — not English "sp"',
      examples: [
        { word: "sprechen", translation: "to speak" },
        { word: "Sport", translation: "sport" },
      ],
    },
    {
      combo: "st",
      label: "ST",
      description: "At the start of a word or syllable",
      ipa: "/ʃt/",
      english: 'Like "sht" — not English "st"',
      examples: [
        { word: "Stadt", translation: "city" },
        { word: "Student", translation: "student" },
      ],
    },
    {
      combo: "ng",
      label: "NG",
      description: "Everywhere it appears",
      ipa: "/ŋ/",
      english: 'Like "ng" in "sing" — never like "ng" in "finger"',
      examples: [
        { word: "singen", translation: "to sing" },
        { word: "lang", translation: "long" },
      ],
    },
    {
      combo: "ei",
      label: "EI",
      description: "Always the same sound",
      ipa: "/aɪ/",
      english: 'Like "i" in "mine" or "eye"',
      examples: [
        { word: "Eis", translation: "ice" },
        { word: "mein", translation: "my" },
      ],
    },
    {
      combo: "ie",
      label: "IE",
      description: "Always the same sound",
      ipa: "/iː/",
      english: 'Like "ee" in "see" — a long pure vowel',
      examples: [
        { word: "viel", translation: "much / a lot" },
        { word: "Liebe", translation: "love" },
      ],
    },
    {
      combo: "au",
      label: "AU",
      description: "Always the same sound",
      ipa: "/aʊ/",
      english: 'Like "ow" in "cow" or "ou" in "house"',
      examples: [
        { word: "Haus", translation: "house" },
        { word: "blau", translation: "blue" },
      ],
    },
    {
      combo: "eu / äu",
      label: "EU / ÄU",
      description: "Both sound the same",
      ipa: "/ɔʏ/",
      english: 'Like "oy" in "boy"',
      examples: [
        { word: "Feuer", translation: "fire" },
        { word: "Häuser", translation: "houses" },
      ],
    },
    {
      combo: "qu",
      label: "QU",
      description: "Always together, always the same",
      ipa: "/kv/",
      english: 'Like "kv" — NOT English "kw"',
      examples: [
        { word: "Quelle", translation: "source / spring" },
        { word: "quer", translation: "diagonal / across" },
      ],
    },
    {
      combo: "ck",
      label: "CK",
      description: "Always the same sound",
      ipa: "/k/",
      english: 'Like a single "k" — doubles the preceding short vowel',
      examples: [
        { word: "Zucker", translation: "sugar" },
        { word: "Brücke", translation: "bridge" },
      ],
    },
  ],

  /* ── Stress Rules ────────────────────────────────────── */
  stressRules: [
    {
      rule: "First Syllable (Most Common)",
      explanation:
        "Most native German words place stress on the FIRST syllable. This is your safe default when unsure.",
      examples: [
        { word: "KAffee", meaning: "coffee" },
        { word: "HAus", meaning: "house" },
        { word: "MUtter", meaning: "mother" },
        { word: "LERnen", meaning: "to learn" },
      ],
    },
    {
      rule: "Separable Verb Prefixes — Always Stressed",
      explanation:
        "When a verb has a separable prefix (auf-, an-, ab-, mit-, ein-...), the PREFIX always carries the stress.",
      examples: [
        { word: "AUFmachen", meaning: "to open" },
        { word: "ANrufen", meaning: "to call" },
        { word: "EINkaufen", meaning: "to shop" },
        { word: "MITkommen", meaning: "to come along" },
      ],
    },
    {
      rule: "Inseparable Prefixes — Never Stressed",
      explanation:
        "Verbs with inseparable prefixes (be-, ge-, er-, ver-, zer-, ent-, emp-, miss-) are NEVER stressed on the prefix.",
      examples: [
        { word: "beKANNT", meaning: "known" },
        { word: "verSTEHen", meaning: "to understand" },
        { word: "erKLÄren", meaning: "to explain" },
        { word: "geHÖRen", meaning: "to belong to" },
      ],
    },
    {
      rule: "-ieren Endings — Stress on -IE-",
      explanation:
        "Verbs ending in -ieren (mostly from French/Latin) always stress the -ie- syllable.",
      examples: [
        { word: "stuDIEren", meaning: "to study" },
        { word: "telefoNIEren", meaning: "to telephone" },
        { word: "funkTIONIEren", meaning: "to function" },
        { word: "organiSIEren", meaning: "to organize" },
      ],
    },
    {
      rule: "Compound Words — First Element",
      explanation:
        "German compound words always stress the FIRST element. The second element is secondary.",
      examples: [
        { word: "HAUStür", meaning: "front door" },
        { word: "GEBURTStag", meaning: "birthday" },
        { word: "HANDtasche", meaning: "handbag" },
        { word: "FEIERABend", meaning: "end of workday" },
      ],
    },
    {
      rule: "Loanwords — Keep Original Stress",
      explanation:
        "Foreign loanwords often keep their original stress pattern from the source language.",
      examples: [
        { word: "hoTEL", meaning: "hotel (French)" },
        { word: "muSEum", meaning: "museum (Latin)" },
        { word: "baHAHN", meaning: "railway (German rule)" },
        { word: "reSTAUrant", meaning: "restaurant (French)" },
      ],
    },
  ],
};
