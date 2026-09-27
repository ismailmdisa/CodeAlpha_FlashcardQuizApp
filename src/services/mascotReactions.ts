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
    comment: 'আইনস্টাইনও গোপনে খাতা বের করে নোট নিচ্ছে! Flex on them! 💪',
    mood: 'hype',
  },
  {
    emoji: '🚀',
    title: 'NASA WANTS YOUR LOCATION',
    comment: 'একদম স্পট অন! ব্রেন সেলগুলো যেন অপটিকাল ফাইবারে দৌড়াচ্ছে!',
    mood: 'hype',
  },
  {
    emoji: '👑',
    title: 'PURE DOMINANCE',
    comment: 'কার্ডটা আপনাকে টেস্ট করতে আসছিল, উল্টা নিজেই ভয় পেয়ে গেছে!',
    mood: 'hype',
  },
  {
    emoji: '🔥',
    title: 'UNSTOPPABLE!',
    comment: 'এত ফাস্ট অ্যানসার? ব্রেনে কি কোনো গোপন ক্যাশ মেমোরি লাগানো?!',
    mood: 'fire',
  },
  {
    emoji: '💎',
    title: 'FLAWLESS RECALL',
    comment: '১০ এ ১০! আজ পরীক্ষার হলে গেলে পেপার নিজেই লিখে আসত!',
    mood: 'hype',
  },
];

const KINDA_KNEW_REACTIONS: MascotReaction[] = [
  {
    emoji: '🤔',
    title: 'HALF BRAINCELL ACTIVE',
    comment: 'জিহ্বার ডগায় ছিল কিন্তু মনে পড়তেছিল না তাইতো? পরের বার একদম মুখস্থ!',
    mood: 'chill',
  },
  {
    emoji: '🔋',
    title: '50% BATTERY SAVER',
    comment: 'কিছুটা মনে ছিল, কিছুটা বানিয়ে ফেলতে চেয়েছিলা! চলো আরেকটু রিভিশন দিই।',
    mood: 'chill',
  },
  {
    emoji: '☕',
    title: 'NEED MORE COFFEE?',
    comment: 'স্মৃতিশক্তি ৮৫% লোডিং হয়েছিল, আরেকটু পুশ করলেই কেল্লাফতে!',
    mood: 'chill',
  },
  {
    emoji: '🎯',
    title: 'CLOSE ENOUGH!',
    comment: 'তীর নিশানা ছুঁয়ে গেছে, পরের রাউন্ডে একদম বুলসআই লাগবে!',
    mood: 'chill',
  },
];

const BLANKED_REACTIONS: MascotReaction[] = [
  {
    emoji: '💀',
    title: 'ERROR 404: BRAIN NOT FOUND',
    comment: 'ফ্রন্টাল কর্টেক্সে কি ওয়াইফাই ক্যাবল ছুটে গেছে নাকি? 🔌 কোনো চাপ নাই, মুখস্থ করে নাও!',
    mood: 'roast',
  },
  {
    emoji: '🗿',
    title: 'CARD IS JUDGING SILENTLY',
    comment: 'কার্ডটা আপনার দিকে নিস্তব্ধভাবে তাকিয়ে আছে... লজ্জা পেয়ে আবার পড়ে নাও!',
    mood: 'roast',
  },
  {
    emoji: '🫠',
    title: 'BRAIN WENT TO SLEEP',
    comment: 'অ্যানসার দেখে মনে হচ্ছে: "আরে এটা তো আমি জীবনেও শুনি নাই!" 😂',
    mood: 'roast',
  },
  {
    emoji: '🧘‍♂️',
    title: 'MEDITATION MODE',
    comment: 'মাথা পুরো খালি—একদম বৌদ্ধ সন্ন্যাসীর মতো শূন্য! চলো আরেকবার পড়ি!',
    mood: 'roast',
  },
  {
    emoji: '🕵️‍♂️',
    title: 'SEARCH PARTY SENT',
    comment: 'আপনার মেমোরি খোঁজার জন্য বিশেষ টিম পাঠানো হয়েছে... উত্তরটা দেখে নাও!',
    mood: 'roast',
  },
];

const COMBO_STREAK_REACTIONS: MascotReaction[] = [
  {
    emoji: '🔥⚡',
    title: 'ON FIRE STREAK!',
    comment: 'টানা সঠিক উত্তর! ব্রেনে আগুন ধরে গেছে, ফায়ার সার্ভিস ডাকো! 🚒',
    mood: 'fire',
  },
  {
    emoji: '☄️',
    title: 'METEORIC STREAK!',
    comment: 'সব অ্যানসার একদম পানির মতো ক্লিয়ার! আনস্টপাবল মোড অন!',
    mood: 'fire',
  },
  {
    emoji: '🌌',
    title: 'GALAXY BRAIN ACTIVATED',
    comment: 'মহাজাগতিক লেভেলের ফোকাস! কোনো কার্ড আপনাকে থামাতে পারবে না!',
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
