// Hilarious & Inspiring Witty Reaction Library for the Flashcard Companion ("Brainy")

export type MasteryRating = 'NAILED_IT' | 'KINDA_KNEW' | 'BLANKED';

export interface MascotReaction {
  emoji: string;
  title: string;
  comment: string;
  mood: 'hype' | 'chill' | 'roast' | 'fire' | 'boss';
}

const NAILED_IT_REACTIONS: MascotReaction[] = [
  {
    emoji: '🧠⚡',
    title: 'GIGABRAIN MOMENT!',
    comment: 'Einstein is secretly taking notes right now! Flex on them! 💪',
    mood: 'hype',
  },
  {
    emoji: '🚀',
    title: 'NASA WANTS YOUR LOCATION',
    comment: 'Spot on! Brain cells firing at fiber-optic speed! 🚀',
    mood: 'hype',
  },
  {
    emoji: '👑',
    title: 'PURE DOMINANCE',
    comment: 'The flashcard came to test you, but ended up terrified! 👑',
    mood: 'hype',
  },
  {
    emoji: '🔥',
    title: 'UNSTOPPABLE!',
    comment: 'Instant recall! Did you install a secret cache memory in your head?! ⚡',
    mood: 'fire',
  },
  {
    emoji: '💎',
    title: 'FLAWLESS RECALL',
    comment: '10 out of 10! You could walk into an exam and ace it blindfolded! 💎',
    mood: 'hype',
  },
];

const KINDA_KNEW_REACTIONS: MascotReaction[] = [
  {
    emoji: '🤔',
    title: 'HALF BRAINCELL ACTIVE',
    comment: "Right on the tip of your tongue, wasn't it? Next time you will own it! 🤔",
    mood: 'chill',
  },
  {
    emoji: '🔋',
    title: '50% BATTERY SAVER',
    comment: "Part memory, part wild guess! Let's review this one more time! 🔋",
    mood: 'chill',
  },
  {
    emoji: '☕',
    title: 'NEED MORE COFFEE?',
    comment: "Memory loaded at 85%! One quick push and it's permanently locked in! ☕",
    mood: 'chill',
  },
  {
    emoji: '🎯',
    title: 'CLOSE ENOUGH!',
    comment: 'You skimmed the bullseye! Next round will be dead center! 🎯',
    mood: 'chill',
  },
];

const BLANKED_REACTIONS: MascotReaction[] = [
  {
    emoji: '💀',
    title: 'ERROR 404: BRAIN NOT FOUND',
    comment: 'Did someone unplug the Wi-Fi cable in your frontal cortex? 🔌 No worries, lock it in now!',
    mood: 'roast',
  },
  {
    emoji: '🗿',
    title: 'CARD IS JUDGING SILENTLY',
    comment: 'The card is staring into your soul... study up and get revenge! 🗿',
    mood: 'roast',
  },
  {
    emoji: '🫠',
    title: 'BRAIN WENT TO SLEEP',
    comment: 'Looking at the answer like: "I have never seen this in my entire life!" 😂',
    mood: 'roast',
  },
  {
    emoji: '🧘‍♂️',
    title: 'MEDITATION MODE',
    comment: "Head completely empty—peaceful like a Buddhist monk! Let's read it again! 🧘‍♂️",
    mood: 'roast',
  },
  {
    emoji: '🕵️‍♂️',
    title: 'SEARCH PARTY SENT',
    comment: 'A rescue team was dispatched to find that memory... peek the answer! 🕵️‍♂️',
    mood: 'roast',
  },
];

const COMBO_STREAK_REACTIONS: MascotReaction[] = [
  {
    emoji: '🔥⚡',
    title: 'ON FIRE STREAK!',
    comment: 'Consecutive correct answers! Call the fire department, brain is smoking! 🚒',
    mood: 'fire',
  },
  {
    emoji: '☄️',
    title: 'METEORIC STREAK!',
    comment: 'Crystal clear recall! Unstoppable study machine activated! ☄️',
    mood: 'fire',
  },
  {
    emoji: '🌌',
    title: 'GALAXY BRAIN ACTIVATED',
    comment: 'Cosmic level focus! No flashcard in the universe can stop you! 🌌',
    mood: 'fire',
  },
];

export function getRandomReaction(type: MasteryRating, streak = 0): MascotReaction {
  if (streak >= 3 && Math.random() > 0.4) {
    const idx = Math.floor(Math.random() * COMBO_STREAK_REACTIONS.length);
    return COMBO_STREAK_REACTIONS[idx];
  }

  let pool: MascotReaction[];
  if (type === 'NAILED_IT') pool = NAILED_IT_REACTIONS;
  else if (type === 'KINDA_KNEW') pool = KINDA_KNEW_REACTIONS;
  else pool = BLANKED_REACTIONS;

  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
