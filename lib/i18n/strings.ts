import type { UiLanguage } from '@/lib/i18n/types';

const en = {
  homeAppName: 'FretPlay',
  homeTagline: 'Train on the fretboard',
  homeSectionModes: 'Modes',
  homeCardNeckHint: 'See the target note — tap the right spot on the neck.',
  homeCardFindHint: 'A green dot marks a fret — pick the correct note name.',
  gameNameNeck: 'Note on the neck',
  gameNameFindCase: 'Find the fret',
  tabMenu: 'Menu',
  tabSettings: 'Settings',
  tabHistory: 'History',
  historiqueTitle: 'History',
  historiqueBackToGame: 'Back to game',
  historiqueSubtitleNeck: 'Note on the neck',
  historiqueSubtitleFindCase: 'Find the fret',
  historiqueEmpty: 'No games recorded yet.',
  historiqueRow: '{{notation}} · {{found}}/{{attempts}} found · {{missed}} missed · {{sec}} s',
  notationSystemEuropean: 'European',
  notationSystemAnglo: 'Anglo-Saxon',
  gameAttempts: 'Attempts:',
  gameFound: 'Found:',
  gameMissed: 'Missed:',
  historique: 'History',
  next: 'Next',
  playAgain: 'Play again',
  ok: 'OK',
  parametresTitle: 'Settings',
  parametresNotationTitle: 'Note names (on the neck)',
  parametresNotationBody:
    'By default, the choice follows your phone language (English → Anglo-Saxon, otherwise European). You can force either option below.',
  parametresNotationEu: 'European (Do, Re, Mi…)',
  parametresNotationAnglo: 'Anglo-Saxon (A, B, C…)',
  parametresDifficultyTitle: 'Difficulty',
  parametresDifficultyBody:
    'When enabled, the note must be played on the indicated string: the same pitch on another string counts as wrong.',
  parametresIndicateString: 'Show string',
  parametresRetour: 'Back',
  parametresLanguageTitle: 'Interface language',
  languagePickTitle: 'Choose language',
  languageFr: 'Français',
  languageEn: 'English',
  languageEs: 'Español',
  languageDe: 'Deutsch',
  languageIt: 'Italiano',
  jeu1StringLine: 'String: {{note}}',
  scoreEncouragement0: 'You can only get better! Keep going!',
  scoreEncouragement1: "You're making progress — keep playing.",
  scoreEncouragement2: 'Not bad! Keep practising.',
  scoreEncouragement3: 'Great — a little more and you’re there!',
  scoreEncouragement4: 'Brilliant — you really know your notes! Keep it up.',
  onboardingP1s1Title: 'You know the theory. On the neck, you still hesitate.',
  onboardingP1s1Body:
    'That delay between your brain and your fingers is exactly what blocks your groove, your confidence, and your speed.',
  onboardingP1s2Title: 'Train 5 minutes. Feel the difference quickly.',
  onboardingP1s2Body:
    'FretPlay turns note learning into short focused sessions you can stack every day, even with a busy schedule.',
  onboardingP1s3Title: 'Built for bass players who want real progress',
  onboardingP1s3Body:
    'No fluff. You get practical drills, instant feedback, and a clear path from hesitation to automatic note recognition.',
  onboardingIlluPlaceholder: '(illustration)',

  onboardingP2s1Title: 'Two mini-games. One goal: own the fretboard.',
  onboardingP2s1Body:
    'Game 1 asks you to locate notes on the neck. Game 2 asks you to name notes from positions. Together, they lock in muscle + visual memory.',
  onboardingP2s2Title: 'Created by a top bassist audience ecosystem',
  onboardingP2s2Body:
    'This method is shaped for players who want practical, repeatable results. No random practice, just focused progression.',
  onboardingP2s3Title: 'Used by top bassist learners',
  onboardingP2s3Body:
    'Add your testimonial visual here (creator, students, community proof). This is your trust anchor in the onboarding flow.',
  onboardingP2s4Title: 'Personalize your plan',
  onboardingP2s4Body:
    'Tell us where you are now so we can adapt the first sessions and help you build momentum from day one.',
  onboardingP2s5Title: 'In 2-3 weeks, notes feel natural',
  onboardingP2s5Body:
    'Stay consistent for a few minutes per day and you will react faster on the neck during songs, jams, and practice.',
  onboardingP2s6Title: 'Start free now',
  onboardingP2s6Body: 'No paywall today. Begin your training, feel progress, then we unlock the rest later.',

  onboardingQ1Title: 'Where are you right now on the fretboard?',
  onboardingQ1o0: 'Beginner: I get lost quickly',
  onboardingQ1o1: 'Intermediate: I know some landmarks',
  onboardingQ1o2: 'I know open strings mostly',
  onboardingQ1o3: 'Advanced but still too slow',

  onboardingQ2Title: 'What is your realistic rhythm?',
  onboardingQ2o0: '1 short session / week',
  onboardingQ2o1: '2-3 sessions / week',
  onboardingQ2o2: '5 minutes every day',
  onboardingQ2o3: 'Daily + extra practice',

  onboardingSummaryTitle: 'Your starter profile',
  onboardingSummaryLevelLine: 'Level:',
  onboardingSummaryTimeLine: 'How often:',
  onboardingSummaryEmpty: '—',
  onboardingSummaryPlaceholder: 'We use this to shape your first training sessions and build quick wins.',

  onboardingTrialTitle: 'Start your first bass training now',
  onboardingTrialBody:
    'You are ready. Start for free and complete your first sessions before we unlock advanced access later.',
  onboardingTrialCta: 'Start free',

  onboardingContinue: 'Continue',
  onboardingDevReplay: 'Onboarding again (dev)',
} as const;

export type TranslationKey = keyof typeof en;

const fr: Record<TranslationKey, string> = {
  homeAppName: 'FretPlay',
  homeTagline: 'Entraîne-toi sur le manche',
  homeSectionModes: 'Modes',
  homeCardNeckHint: 'La note à jouer s’affiche — indique-la sur le manche.',
  homeCardFindHint: 'Un point vert sur le manche — choisis le bon nom de note.',
  gameNameNeck: 'Note sur le manche',
  gameNameFindCase: 'Trouve la case',
  tabMenu: 'Menu',
  tabSettings: 'Paramètres',
  tabHistory: 'Historique',
  historiqueTitle: 'Historique',
  historiqueBackToGame: 'Retour au jeu',
  historiqueSubtitleNeck: 'Note sur le manche',
  historiqueSubtitleFindCase: 'Trouve la case',
  historiqueEmpty: 'Aucune partie enregistrée pour le moment.',
  historiqueRow: '{{notation}} · {{found}}/{{attempts}} trouvées · {{missed}} ratées · {{sec}} s',
  notationSystemEuropean: 'Européen',
  notationSystemAnglo: 'Anglo-saxon',
  gameAttempts: 'Essais :',
  gameFound: 'Trouvées :',
  gameMissed: 'Ratées :',
  historique: 'Historique',
  next: 'Suivant',
  playAgain: 'Rejouer',
  ok: 'OK',
  parametresTitle: 'Paramètres',
  parametresNotationTitle: 'Notation des notes',
  parametresNotationBody:
    'Par défaut, le choix suit la langue du téléphone (anglais → anglo-saxon, sinon européen). Tu peux forcer l’un ou l’autre ci-dessous.',
  parametresNotationEu: 'Système européen (Do, Ré, Mi…)',
  parametresNotationAnglo: 'Système anglo-saxon (A, B, C…)',
  parametresDifficultyTitle: 'Difficulté',
  parametresDifficultyBody:
    'Si activé, la note doit être jouée sur la corde indiquée : la même hauteur sur une autre corde est considérée comme une erreur.',
  parametresIndicateString: 'Indiquer la corde',
  parametresRetour: 'Retour',
  parametresLanguageTitle: 'Langue de l’interface',
  languagePickTitle: 'Choisir la langue',
  languageFr: 'Français',
  languageEn: 'English',
  languageEs: 'Español',
  languageDe: 'Deutsch',
  languageIt: 'Italiano',
  jeu1StringLine: 'corde de {{note}}',
  scoreEncouragement0: 'Tu ne peux que progresser ! Allez ! Courage ! Continue à jouer !',
  scoreEncouragement1: 'Ça avance, continue pour progresser',
  scoreEncouragement2: 'Pas mal ! Continue pour t’améliorer',
  scoreEncouragement3: 'Génial, encore un petit effort et tu es au top !',
  scoreEncouragement4: 'Bravo, tu connais parfaitement tes notes ! Continue pour confirmer.',
  onboardingP1s1Title: 'Tu connais la théorie. Sur le manche, tu hésites encore.',
  onboardingP1s1Body:
    'Ce décalage entre ce que tu sais et ce que tes doigts font vraiment ralentit ton groove, ta confiance et ta progression.',
  onboardingP1s2Title: '5 minutes d’entraînement. De vrais progrès.',
  onboardingP1s2Body:
    'FretPlay transforme les notes en sessions courtes et ciblées, faciles à tenir même avec un planning chargé.',
  onboardingP1s3Title: 'Conçu pour les bassistes qui veulent du concret',
  onboardingP1s3Body:
    'Pas de blabla. Des drills pratiques, un feedback immédiat, et un parcours clair pour passer de l’hésitation à l’automatisme.',
  onboardingIlluPlaceholder: '(illustration)',

  onboardingP2s1Title: '2 mini-jeux. 1 objectif : maîtriser le manche.',
  onboardingP2s1Body:
    'Jeu 1 : trouver la note sur le manche. Jeu 2 : nommer la note depuis une position. Ensemble, ça verrouille mémoire visuelle et musculaire.',
  onboardingP2s2Title: 'Méthode portée par un écosystème bassiste',
  onboardingP2s2Body:
    'Approche pensée pour des musiciens qui veulent des résultats rapides et mesurables, pas des exercices au hasard.',
  onboardingP2s3Title: 'Utilisé par des bassistes exigeants',
  onboardingP2s3Body:
    'Ajoute ici ton visuel testimonial (créateur, élèves, communauté). C’est ton ancre de crédibilité dans le funnel.',
  onboardingP2s4Title: 'Personnalise ton départ',
  onboardingP2s4Body:
    'Dis-nous ton niveau actuel pour adapter les premières sessions et créer du momentum dès le jour 1.',
  onboardingP2s5Title: 'En 2-3 semaines, les notes deviennent plus naturelles',
  onboardingP2s5Body:
    'Avec quelques minutes par jour, tu gagnes en réflexe sur le manche pour les morceaux, les jams et la pratique perso.',
  onboardingP2s6Title: 'Commence gratuitement',
  onboardingP2s6Body: 'Pas de paywall immédiat. Tu testes, tu progresses, puis on débloque la suite ensuite.',

  onboardingQ1Title: 'Où en es-tu aujourd’hui sur le manche ?',
  onboardingQ1o0: 'Débutant : je me perds vite',
  onboardingQ1o1: 'Intermédiaire : quelques repères',
  onboardingQ1o2: 'Je connais surtout les cordes à vide',
  onboardingQ1o3: 'Avancé mais encore trop lent',

  onboardingQ2Title: 'Quel rythme est réaliste pour toi ?',
  onboardingQ2o0: '1 courte session / semaine',
  onboardingQ2o1: '2 à 3 sessions / semaine',
  onboardingQ2o2: '5 minutes par jour',
  onboardingQ2o3: 'Tous les jours + extras',

  onboardingSummaryTitle: 'Ton profil de départ',
  onboardingSummaryLevelLine: 'Niveau :',
  onboardingSummaryTimeLine: 'Fréquence :',
  onboardingSummaryEmpty: '—',
  onboardingSummaryPlaceholder: 'On s’en sert pour ajuster tes premières sessions et créer des victoires rapides.',

  onboardingTrialTitle: 'Lance ton premier entraînement basse',
  onboardingTrialBody:
    'Tu es prêt. Commence gratuitement, valide quelques sessions, puis on ouvrira l’accès avancé ensuite.',
  onboardingTrialCta: 'Commencer gratuitement',

  onboardingContinue: 'Continuer',
  onboardingDevReplay: 'Revoir l’intro (test)',
};

const es: Record<TranslationKey, string> = {
  homeAppName: 'FretPlay',
  homeTagline: 'Practica en el diapasón',
  homeSectionModes: 'Modos',
  homeCardNeckHint: 'Aparece la nota — señálala en el mástil.',
  homeCardFindHint: 'Un punto verde en el mástil — elige el nombre correcto.',
  gameNameNeck: 'Nota en el mástil',
  gameNameFindCase: 'Encuentra el traste',
  tabMenu: 'Menú',
  tabSettings: 'Ajustes',
  tabHistory: 'Historial',
  historiqueTitle: 'Historial',
  historiqueBackToGame: 'Volver al juego',
  historiqueSubtitleNeck: 'Nota en el mástil',
  historiqueSubtitleFindCase: 'Encuentra el traste',
  historiqueEmpty: 'Todavía no hay partidas guardadas.',
  historiqueRow: '{{notation}} · {{found}}/{{attempts}} aciertos · {{missed}} fallos · {{sec}} s',
  notationSystemEuropean: 'Europeo',
  notationSystemAnglo: 'Anglo-sajón',
  gameAttempts: 'Intentos:',
  gameFound: 'Aciertos:',
  gameMissed: 'Fallos:',
  historique: 'Historial',
  next: 'Siguiente',
  playAgain: 'Jugar de nuevo',
  ok: 'OK',
  parametresTitle: 'Ajustes',
  parametresNotationTitle: 'Nombres de las notas',
  parametresNotationBody:
    'Por defecto, la opción sigue el idioma del teléfono (inglés → anglo-sajón, si no europeo). Puedes forzar una u otra abajo.',
  parametresNotationEu: 'Sistema europeo (Do, Re, Mi…)',
  parametresNotationAnglo: 'Sistema anglo-sajón (A, B, C…)',
  parametresDifficultyTitle: 'Dificultad',
  parametresDifficultyBody:
    'Si está activado, la nota debe tocarse en la cuerda indicada: la misma altura en otra cuerda cuenta como error.',
  parametresIndicateString: 'Indicar la cuerda',
  parametresRetour: 'Volver',
  parametresLanguageTitle: 'Idioma de la interfaz',
  languagePickTitle: 'Elegir idioma',
  languageFr: 'Français',
  languageEn: 'English',
  languageEs: 'Español',
  languageDe: 'Deutsch',
  languageIt: 'Italiano',
  jeu1StringLine: 'Cuerda: {{note}}',
  scoreEncouragement0: '¡Solo puedes mejorar! ¡Ánimo, sigue tocando!',
  scoreEncouragement1: 'Vas avanzando, sigue para progresar',
  scoreEncouragement2: '¡No está mal! Sigue practicando',
  scoreEncouragement3: 'Genial, ¡un poco más y lo tienes!',
  scoreEncouragement4: '¡Bravo, dominas las notas! Sigue así.',
  onboardingP1s1Title: 'Bienvenido',
  onboardingP1s1Body:
    'FretPlay te ayuda a aprender dónde está cada nota en tu bajo, hasta que lo hagas casi sin pensar. Te vendrá muy bien para lo que viene después.',
  onboardingP1s2Title: '¿Por qué aprender las notas en el mástil?',
  onboardingP1s2Body:
    'Saber dónde está cada nota refuerza la memoria motriz, acelera aprender temas y hace más fluidas las jams.',
  onboardingP1s3Title: 'Qué te aporta FretPlay',
  onboardingP1s3Body:
    'Sesiones breves, feedback claro y dos modos complementarios para entrenar vista, tacto y nombre de las notas.',
  onboardingIlluPlaceholder: '(ilustración)',

  onboardingP2s1Title: 'Juego 1 — Nota en el mástil',
  onboardingP2s1Body:
    'Ves el nombre de una nota (según tu notación). Debes tocar la posición correcta en el mástil de cuatro cuerdas.',
  onboardingP2s2Title: 'Encuentra el objetivo en el mástil',
  onboardingP2s2Body:
    'La nota a tocar aparece arriba: toca el traste correcto en la cuerda adecuada. Recibes feedback al instante.',
  onboardingP2s3Title: 'Contadores de aciertos y fallos',
  onboardingP2s3Body:
    'Durante la partida, el panel lateral muestra cuántas notas acertaste y cuántas fallaste para seguir tu progreso.',
  onboardingP2s4Title: 'Juego 2 — Encuentra el traste',
  onboardingP2s4Body:
    'Un punto verde marca un traste en el mástil. Elige el nombre correcto entre varias propuestas.',
  onboardingP2s5Title: 'Elige el nombre correcto',
  onboardingP2s5Body:
    'Mira el punto en el mástil y toca una de las pastillas de notas. Usa «Siguiente» entre rondas.',
  onboardingP2s6Title: 'Y habrá más',
  onboardingP2s6Body: 'Con el tiempo se añadirán más juegos y ejercicios para variar el entrenamiento.',

  onboardingQ1Title: '¿Qué nivel te das en conocimiento de las notas en el mástil?',
  onboardingQ1o0: 'No conozco ninguna',
  onboardingQ1o1: 'Conozco algunas notas',
  onboardingQ1o2: 'Conozco las notas de las cuerdas al aire',
  onboardingQ1o3: 'Conozco todas las notas pero aún voy lento',

  onboardingQ2Title: '¿Cuánto tiempo tienes para tocar?',
  onboardingQ2o0: '1 vez por semana',
  onboardingQ2o1: '2 a 3 veces por semana',
  onboardingQ2o2: 'Una vez al día',
  onboardingQ2o3: 'Varias veces al día',

  onboardingSummaryTitle: 'Resumen de tus respuestas',
  onboardingSummaryLevelLine: 'Nivel:',
  onboardingSummaryTimeLine: 'Frecuencia:',
  onboardingSummaryEmpty: '—',
  onboardingSummaryPlaceholder: 'Aquí aparecerán consejos personalizados según tus respuestas.',

  onboardingTrialTitle: 'Prueba FretPlay gratis',
  onboardingTrialBody:
    'Puedes jugar hasta cinco partidas gratis para probar la app. Cuando quieras, ve al menú principal.',
  onboardingTrialCta: '¡Vamos!',

  onboardingContinue: 'Continuar',
  onboardingDevReplay: 'Ver intro otra vez (test)',
};

const de: Record<TranslationKey, string> = {
  homeAppName: 'FretPlay',
  homeTagline: 'Übe am Griffbrett',
  homeSectionModes: 'Modi',
  homeCardNeckHint: 'Die gesuchte Note erscheint — tippe die richtige Stelle am Griffbrett.',
  homeCardFindHint: 'Ein grüner Punkt am Griffbrett — wähle den richtigen Notennamen.',
  gameNameNeck: 'Note am Griffbrett',
  gameNameFindCase: 'Bund finden',
  tabMenu: 'Menü',
  tabSettings: 'Einstellungen',
  tabHistory: 'Verlauf',
  historiqueTitle: 'Verlauf',
  historiqueBackToGame: 'Zurück zum Spiel',
  historiqueSubtitleNeck: 'Note am Griffbrett',
  historiqueSubtitleFindCase: 'Bund finden',
  historiqueEmpty: 'Noch keine Partien gespeichert.',
  historiqueRow: '{{notation}} · {{found}}/{{attempts}} richtig · {{missed}} verpasst · {{sec}} s',
  notationSystemEuropean: 'Europäisch',
  notationSystemAnglo: 'Angloamerikanisch',
  gameAttempts: 'Versuche:',
  gameFound: 'Richtig:',
  gameMissed: 'Verpasst:',
  historique: 'Verlauf',
  next: 'Weiter',
  playAgain: 'Nochmal spielen',
  ok: 'OK',
  parametresTitle: 'Einstellungen',
  parametresNotationTitle: 'Notennamen (Griffbrett)',
  parametresNotationBody:
    'Standardmäßig folgt die Wahl der Telefonsprache (Englisch → angloamerikanisch, sonst europäisch). Du kannst unten eine Option erzwingen.',
  parametresNotationEu: 'Europäisches System (Do, Re, Mi…)',
  parametresNotationAnglo: 'Angloamerikanisches System (A, B, C…)',
  parametresDifficultyTitle: 'Schwierigkeit',
  parametresDifficultyBody:
    'Wenn aktiviert, muss die Note auf der angegebenen Saite gespielt werden: dieselbe Tonhöhe auf einer anderen Saite zählt als Fehler.',
  parametresIndicateString: 'Saite anzeigen',
  parametresRetour: 'Zurück',
  parametresLanguageTitle: 'Oberflächensprache',
  languagePickTitle: 'Sprache wählen',
  languageFr: 'Français',
  languageEn: 'English',
  languageEs: 'Español',
  languageDe: 'Deutsch',
  languageIt: 'Italiano',
  jeu1StringLine: 'Saite: {{note}}',
  scoreEncouragement0: 'Du kannst nur noch besser werden! Weiter so!',
  scoreEncouragement1: 'Du kommst voran — spiel weiter.',
  scoreEncouragement2: 'Nicht schlecht! Übe weiter.',
  scoreEncouragement3: 'Super — noch ein bisschen und du hast es!',
  scoreEncouragement4: 'Klasse — du kennst deine Noten wirklich! Mach weiter.',
  onboardingP1s1Title: 'Willkommen',
  onboardingP1s1Body:
    'FretPlay hilft dir, die Noten auf dem Bass zu finden, bis es fast von selbst geht und du nicht mehr nachdenken musst. Das hilft dir für alles, was danach kommt.',
  onboardingP1s2Title: 'Warum Noten auf dem Griffbrett lernen?',
  onboardingP1s2Body:
    'Wenn du weißt, wo jede Note liegt, festigt sich die Bewegungsablage, Songs gehen schneller, und Jams werden sicherer.',
  onboardingP1s3Title: 'Was FretPlay dir bringt',
  onboardingP1s3Body:
    'Kurze Sessions, klares Feedback und zwei ergänzende Modi für Blick, Finger und Notennamen.',
  onboardingIlluPlaceholder: '(Illustration)',

  onboardingP2s1Title: 'Spiel 1 — Note am Griffbrett',
  onboardingP2s1Body:
    'Du siehst den Namen einer Note (in deiner Notation). Tippe die richtige Stelle auf dem viersaitigen Griffbrett.',
  onboardingP2s2Title: 'Die richtige Stelle finden',
  onboardingP2s2Body:
    'Die gesuchte Note steht oben — tippe den passenden Bund auf der richtigen Saite. Sofortiges Feedback.',
  onboardingP2s3Title: 'Zähler für richtig und verpasst',
  onboardingP2s3Body:
    'In der Runde zeigt die Seitenleiste, wie viele Noten du getroffen und wie viele verpasst hast.',
  onboardingP2s4Title: 'Spiel 2 — Bund finden',
  onboardingP2s4Body:
    'Ein grüner Punkt markiert einen Bund. Wähle den richtigen Notennamen aus mehreren Vorschlägen.',
  onboardingP2s5Title: 'Den richtigen Namen wählen',
  onboardingP2s5Body:
    'Sieh dir den Punkt am Griffbrett an, tippe dann einen der Noten-Chips. Zwischen den Runden: „Weiter“.',
  onboardingP2s6Title: 'Mehr folgt',
  onboardingP2s6Body: 'Weitere Spiele und Übungen kommen nach und nach dazu.',

  onboardingQ1Title: 'Wie schätzt du dein Wissen über die Noten am Griffbrett ein?',
  onboardingQ1o0: 'Ich kenne kaum welche',
  onboardingQ1o1: 'Ich kenne einige Noten',
  onboardingQ1o2: 'Ich kenne die Leersaiten-Töne',
  onboardingQ1o3: 'Ich kenne alle Noten, brauche aber noch zu lange',

  onboardingQ2Title: 'Wie oft kannst du spielen?',
  onboardingQ2o0: 'Einmal pro Woche',
  onboardingQ2o1: '2–3 Mal pro Woche',
  onboardingQ2o2: 'Einmal pro Tag',
  onboardingQ2o3: 'Mehrmals am Tag',

  onboardingSummaryTitle: 'Deine Antworten',
  onboardingSummaryLevelLine: 'Niveau:',
  onboardingSummaryTimeLine: 'Häufigkeit:',
  onboardingSummaryEmpty: '—',
  onboardingSummaryPlaceholder: 'Persönliche Tipps je nach Antworten erscheinen später hier.',

  onboardingTrialTitle: 'FretPlay kostenlos testen',
  onboardingTrialBody:
    'Du kannst bis zu fünf kostenlose Runden spielen, um die App auszuprobieren. Wenn du soweit bist, öffne das Hauptmenü.',
  onboardingTrialCta: 'Los geht’s!',

  onboardingContinue: 'Weiter',
  onboardingDevReplay: 'Intro erneut (Test)',
};

const it: Record<TranslationKey, string> = {
  homeAppName: 'FretPlay',
  homeTagline: 'Allenati sul manico',
  homeSectionModes: 'Modalità',
  homeCardNeckHint: 'Compare la nota da suonare — indicala sul manico.',
  homeCardFindHint: 'Un punto verde sul manico — scegli il nome giusto della nota.',
  gameNameNeck: 'Nota sul manico',
  gameNameFindCase: 'Trova il tasto',
  tabMenu: 'Menu',
  tabSettings: 'Impostazioni',
  tabHistory: 'Cronologia',
  historiqueTitle: 'Cronologia',
  historiqueBackToGame: 'Torna al gioco',
  historiqueSubtitleNeck: 'Nota sul manico',
  historiqueSubtitleFindCase: 'Trova il tasto',
  historiqueEmpty: 'Nessuna partita registrata.',
  historiqueRow: '{{notation}} · {{found}}/{{attempts}} trovate · {{missed}} errate · {{sec}} s',
  notationSystemEuropean: 'Europeo',
  notationSystemAnglo: 'Anglo-americano',
  gameAttempts: 'Tentativi:',
  gameFound: 'Trovate:',
  gameMissed: 'Errate:',
  historique: 'Cronologia',
  next: 'Avanti',
  playAgain: 'Nuova partita',
  ok: 'OK',
  parametresTitle: 'Impostazioni',
  parametresNotationTitle: 'Nomi delle note (sul manico)',
  parametresNotationBody:
    'Per impostazione predefinita la scelta segue la lingua del telefono (inglese → anglo-americano, altrimenti europeo). Puoi forzare una delle due opzioni sotto.',
  parametresNotationEu: 'Sistema europeo (Do, Re, Mi…)',
  parametresNotationAnglo: 'Sistema anglo-americano (A, B, C…)',
  parametresDifficultyTitle: 'Difficoltà',
  parametresDifficultyBody:
    'Se attivo, la nota deve essere suonata sulla corda indicata: la stessa altezza su un’altra corda conta come errore.',
  parametresIndicateString: 'Mostra la corda',
  parametresRetour: 'Indietro',
  parametresLanguageTitle: 'Lingua dell’interfaccia',
  languagePickTitle: 'Scegli la lingua',
  languageFr: 'Français',
  languageEn: 'English',
  languageEs: 'Español',
  languageDe: 'Deutsch',
  languageIt: 'Italiano',
  jeu1StringLine: 'Corda: {{note}}',
  scoreEncouragement0: 'Puoi solo migliorare! Coraggio, continua a suonare!',
  scoreEncouragement1: 'Stai facendo progressi — continua.',
  scoreEncouragement2: 'Non male! Continua a esercitarti.',
  scoreEncouragement3: 'Ottimo — ancora un po’ e ci sei!',
  scoreEncouragement4: 'Bravissimo — conosci davvero le note! Continua così.',
  onboardingP1s1Title: 'Benvenuto',
  onboardingP1s1Body:
    'FretPlay ti aiuta a imparare dove sta ogni nota sul basso, finché diventa quasi automatico e non ci pensi più. Ti sarà di grande aiuto per il resto del percorso.',
  onboardingP1s2Title: 'Perché imparare le note sul manico?',
  onboardingP1s2Body:
    'Sapere dove sta ogni nota consolida la memoria motoria, accelera lo studio dei brani e rende le jam più sicure.',
  onboardingP1s3Title: 'Cosa ti offre FretPlay',
  onboardingP1s3Body:
    'Sessioni brevi, feedback chiaro e due modalità complementari per allenare vista, tatto e nome delle note.',
  onboardingIlluPlaceholder: '(illustrazione)',

  onboardingP2s1Title: 'Gioco 1 — Nota sul manico',
  onboardingP2s1Body:
    'Vedi il nome di una nota (secondo la tua notazione). Devi toccare il punto giusto sul manico a quattro corde.',
  onboardingP2s2Title: 'Trova l’obiettivo sul manico',
  onboardingP2s2Body:
    'La nota da suonare compare in alto — tocca il tasto giusto sulla corda giusta. Feedback immediato.',
  onboardingP2s3Title: 'Contatori trovate / sbagliate',
  onboardingP2s3Body:
    'Durante la partita il pannello laterale mostra quante note hai trovato e quante hai sbagliato per seguire i progressi.',
  onboardingP2s4Title: 'Gioco 2 — Trova il tasto',
  onboardingP2s4Body:
    'Un punto verde segna un tasto sul manico. Scegli il nome corretto tra più proposte.',
  onboardingP2s5Title: 'Scegli il nome giusto',
  onboardingP2s5Body:
    'Guarda il punto sul manico, poi tocca una delle pillole con le note. Usa «Avanti» tra una manche e l’altra.',
  onboardingP2s6Title: 'Altri contenuti in arrivo',
  onboardingP2s6Body: 'Con il tempo arriveranno altri giochi ed esercizi per variare l’allenamento.',

  onboardingQ1Title: 'Che livello ti dai nella conoscenza delle note sul manico?',
  onboardingQ1o0: 'Non ne conosco nessuna',
  onboardingQ1o1: 'Ne conosco alcune',
  onboardingQ1o2: 'Conosco le note delle corde vuote',
  onboardingQ1o3: 'Conosco tutte le note ma ci metto ancora troppo',

  onboardingQ2Title: 'Quanto tempo hai per suonare?',
  onboardingQ2o0: '1 volta a settimana',
  onboardingQ2o1: '2–3 volte a settimana',
  onboardingQ2o2: 'Una volta al giorno',
  onboardingQ2o3: 'Più volte al giorno',

  onboardingSummaryTitle: 'Riepilogo delle risposte',
  onboardingSummaryLevelLine: 'Livello:',
  onboardingSummaryTimeLine: 'Frequenza:',
  onboardingSummaryEmpty: '—',
  onboardingSummaryPlaceholder: 'Qui compariranno suggerimenti personalizzati in base alle tue risposte.',

  onboardingTrialTitle: 'Prova FretPlay gratis',
  onboardingTrialBody:
    'Puoi giocare fino a cinque partite gratis per provare l’app. Quando sei pronto, apri il menu principale.',
  onboardingTrialCta: 'Si parte!',

  onboardingContinue: 'Continua',
  onboardingDevReplay: 'Rivedi intro (test)',
};

void en;
void es;
void de;
void it;

const STRINGS: Record<UiLanguage, Record<TranslationKey, string>> = { fr };

export function translate(lang: UiLanguage, key: TranslationKey): string {
  return STRINGS[lang][key] ?? STRINGS.fr[key];
}

const SCORE_ENCOURAGEMENT_KEYS = [
  'scoreEncouragement0',
  'scoreEncouragement1',
  'scoreEncouragement2',
  'scoreEncouragement3',
  'scoreEncouragement4',
] as const satisfies readonly TranslationKey[];

export function encouragementForFound(lang: UiLanguage, found: number): string {
  const tier = found <= 1 ? 0 : found <= 4 ? 1 : found <= 7 ? 2 : found <= 9 ? 3 : 4;
  return translate(lang, SCORE_ENCOURAGEMENT_KEYS[tier]);
}
