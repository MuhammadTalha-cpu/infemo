/* ============================================================
   INFEMO — EXAM FORMATS
   Practice exam definitions for each language and level.
   Structured to match official certification exam formats.
   ============================================================ */

var ExamFormats = {
  de: {
    a1: {
      name: "Goethe-Zertifikat A1",
      certBody: "Goethe-Institut",
      description: "Official German language certification for beginners",
      totalMinutes: 30,
      passMark: 60,
      sections: [
        {
          id: "hoeren",
          name: "Hören",
          englishName: "Listening",
          icon: "headphones",
          durationMinutes: 10,
          description:
            "Listen to short texts and conversations. Choose the correct answer for each question.",
          skillNote: "Goethe A1 — Hören (4 Teile, ca. 20 Minuten)",
          questions: [
            {
              id: "h1",
              type: "listen-choose",
              audioText:
                "Guten Morgen! Mein Name ist Klaus Müller. Ich komme aus München.",
              audioContext: "sentence",
              question: "What is the speaker's name?",
              options: [
                "Klaus Weber",
                "Klaus Müller",
                "Hans Müller",
                "Max Schmidt",
              ],
              correct: 1,
              explanation:
                'The speaker says "Mein Name ist Klaus Müller" — My name is Klaus Müller.',
            },
            {
              id: "h2",
              type: "listen-choose",
              audioText:
                "Der Zug nach Berlin fährt um achtzehn Uhr dreißig ab.",
              audioContext: "sentence",
              question: "When does the train to Berlin depart?",
              options: ["18:13", "18:30", "8:30", "8:13"],
              correct: 1,
              explanation:
                '"Achtzehn Uhr dreißig" = 18:30. Achtzehn = 18, dreißig = 30.',
            },
            {
              id: "h3",
              type: "listen-choose",
              audioText: "Das kostet fünfzehn Euro und fünfzig Cent.",
              audioContext: "sentence",
              question: "How much does it cost?",
              options: ["€5.50", "€15.05", "€15.50", "€50.15"],
              correct: 2,
              explanation: '"Fünfzehn Euro und fünfzig Cent" = €15.50.',
            },
            {
              id: "h4",
              type: "listen-choose",
              audioText:
                "Entschuldigung, wo ist die Apotheke? Die Apotheke ist rechts, neben dem Supermarkt.",
              audioContext: "sentence",
              question: "Where is the pharmacy?",
              options: [
                "On the left",
                "Straight ahead",
                "On the right, next to the supermarket",
                "Opposite the bank",
              ],
              correct: 2,
              explanation:
                '"Rechts, neben dem Supermarkt" = On the right, next to the supermarket.',
            },
            {
              id: "h5",
              type: "listen-choose",
              audioText:
                "Ich möchte ein Zimmer für zwei Nächte buchen. Mit Frühstück, bitte.",
              audioContext: "sentence",
              question: "What does the person want?",
              options: [
                "A table for two at a restaurant",
                "A room for two nights with breakfast",
                "Two tickets for tonight",
                "A room for one night without breakfast",
              ],
              correct: 1,
              explanation:
                '"Ein Zimmer für zwei Nächte" = a room for two nights. "Mit Frühstück" = with breakfast.',
            },
            {
              id: "h6",
              type: "listen-choose",
              audioText:
                "Das Wetter heute ist bewölkt und es regnet ein bisschen. Die Temperatur ist zwölf Grad.",
              audioContext: "sentence",
              question: "What is the weather like today?",
              options: [
                "Sunny and warm at 22°C",
                "Cloudy and a little rainy at 12°C",
                "Snowing and cold at 2°C",
                "Windy but dry at 12°C",
              ],
              correct: 1,
              explanation:
                '"Bewölkt" = cloudy, "es regnet" = it is raining, "zwölf Grad" = 12 degrees.',
            },
          ],
        },

        {
          id: "lesen",
          name: "Lesen",
          englishName: "Reading",
          icon: "book-open",
          durationMinutes: 10,
          description:
            "Read the texts, signs, and notices. Choose the correct answer for each question.",
          skillNote: "Goethe A1 — Lesen (4 Teile, ca. 25 Minuten)",
          questions: [
            {
              id: "l1",
              type: "multiple-choice",
              readingText: "EINGANG",
              readingLabel: "Sign on a building door:",
              question: "What does this sign mean?",
              options: ["Exit", "Entrance", "Emergency exit", "No entry"],
              correct: 1,
              explanation:
                '"Eingang" = Entrance. The opposite is "Ausgang" = Exit.',
            },
            {
              id: "l2",
              type: "multiple-choice",
              readingText:
                "Öffnungszeiten:\nMontag – Freitag: 09:00 – 18:00 Uhr\nSamstag: 10:00 – 14:00 Uhr\nSonntag: Geschlossen",
              readingLabel: "Shop opening hours notice:",
              question: "When is the shop open on Saturday?",
              options: [
                "09:00 – 18:00",
                "10:00 – 14:00",
                "The shop is closed on Saturday",
                "10:00 – 18:00",
              ],
              correct: 1,
              explanation:
                '"Samstag: 10:00 – 14:00 Uhr" — Opens at 10 and closes at 14:00 on Saturday.',
            },
            {
              id: "l3",
              type: "multiple-choice",
              readingText:
                "Hallo Maria,\nkannst du morgen um 15 Uhr kommen? Wir essen zusammen.\nBis dann,\nAnna",
              readingLabel: "Text message:",
              question: "What is Anna asking Maria to do?",
              options: [
                "Call her at 15:00 tomorrow",
                "Come over to eat together at 15:00 tomorrow",
                "Cook dinner for her",
                "Meet at a restaurant at 13:00",
              ],
              correct: 1,
              explanation:
                '"Kannst du morgen um 15 Uhr kommen? Wir essen zusammen." = Can you come at 15:00 tomorrow? We will eat together.',
            },
            {
              id: "l4",
              type: "multiple-choice",
              readingText: "BITTE NICHT FOTOGRAFIEREN",
              readingLabel: "Sign inside a museum:",
              question: "What does this sign tell you?",
              options: [
                "Please take photos here",
                "Photography studio inside",
                "Please do not take photographs",
                "Photo ID required",
              ],
              correct: 2,
              explanation:
                '"Bitte nicht fotografieren" = Please do not take photographs. "Bitte" = please, "nicht" = not, "fotografieren" = to photograph.',
            },
            {
              id: "l5",
              type: "fill-blank",
              readingText:
                "Ich heiße Thomas und ich ___ aus Österreich. Ich wohne jetzt in Berlin und arbeite dort als Lehrer.",
              readingLabel: "Fill in the missing word:",
              sentence: "Ich heiße Thomas und ich ___ aus Österreich.",
              answer: "komme",
              hint: 'verb "to come" in ich-form',
              translation: "My name is Thomas and I ___ from Austria.",
            },
            {
              id: "l6",
              type: "multiple-choice",
              readingText:
                "Wohnung zu vermieten\n2 Zimmer, Küche, Bad\n65 m² — 800 € pro Monat\nKeine Haustiere\nTel: 030 - 12345678",
              readingLabel: "Apartment advertisement:",
              question: "Which statement about this apartment is TRUE?",
              options: [
                "Pets are allowed",
                "The apartment has 3 rooms",
                "The rent is €800 per month",
                "The apartment is 85m²",
              ],
              correct: 2,
              explanation:
                '"800 € pro Monat" = 800 euros per month. "Keine Haustiere" = no pets. It has 2 rooms and is 65m².',
            },
          ],
        },

        {
          id: "schreiben",
          name: "Schreiben",
          englishName: "Writing",
          icon: "pen-line",
          durationMinutes: 10,
          description:
            "Complete the registration form and write a short message in German.",
          skillNote: "Goethe A1 — Schreiben (2 Teile, ca. 20 Minuten)",
          questions: [
            {
              id: "s1",
              type: "form-fill",
              title: "Teil 1 — Formular ausfüllen",
              instruction:
                "You are registering for a German language course. Fill in the form below with your own information.",
              fields: [
                {
                  label: "Vorname (First name)",
                  placeholder: "e.g. Muhammad",
                  key: "firstname",
                },
                {
                  label: "Nachname (Last name)",
                  placeholder: "e.g. Talha",
                  key: "lastname",
                },
                { label: "Alter (Age)", placeholder: "e.g. 25", key: "age" },
                {
                  label: "Herkunftsland (Country)",
                  placeholder: "e.g. Pakistan",
                  key: "country",
                },
                {
                  label: "Muttersprache (Mother tongue)",
                  placeholder: "e.g. Urdu",
                  key: "language",
                },
              ],
              note: "In the real Goethe exam you fill in official forms. Any correct answer based on your real information is accepted.",
            },
            {
              id: "s2",
              type: "short-message",
              title: "Teil 2 — Eine Nachricht schreiben",
              instruction:
                "Your German friend Peter has invited you to his birthday party on Saturday. Write him a short message in German:",
              points: [
                "Thank him for the invitation",
                "Say that you will come",
                "Ask what time the party starts",
              ],
              promptNote: "Write at least 30 words in German.",
              modelAnswer:
                "Hallo Peter,\nvielen Dank für die Einladung! Ich komme gerne zu deiner Party. Um wie viel Uhr beginnt die Party?\nBis Samstag!\n[Dein Name]",
              minWords: 5,
              placeholder: "Hallo Peter,\n\n",
            },
          ],
        },
      ],
    },
  },
};
