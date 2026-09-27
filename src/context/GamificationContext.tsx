import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MasteryRating, MascotReaction, getRandomReaction } from '../services/mascotReactions';
import { soundFx } from '../services/soundFx';

export type QuizMode = 'CLASSIC' | 'SPEED_RUN' | 'BOSS_BATTLE';

export interface GamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  currentLevelProgress: number;
  currentStreak: number;
  bestStreak: number;
  quizMode: QuizMode;
  bossHp: number;
  bossMaxHp: number;
  isBossDefeated: boolean;
  soundEnabled: boolean;
  latestReaction: MascotReaction | null;
  showConfetti: boolean;

  // Actions
  recordRecallResult: (rating: MasteryRating) => void;
  setQuizMode: (mode: QuizMode) => void;
  resetBossBattle: () => void;
  toggleSound: () => void;
  triggerConfetti: () => void;
  clearReaction: () => void;
}

const GAMIFICATION_KEY = '@codealpha_quiz_gamification_v2';

const LEVEL_TITLES = [
  'Novice Crammer 🐣',
  'Caffeine Crusader ☕',
  'Memory Ninja 🥷',
  'Gigabrain Professor 🧠🎓',
  'Supreme Quiz Overlord 👑⚡',
  'Cosmic Polymath 🌌',
];

const GamificationContext = createContext<GamificationState | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [quizMode, setQuizModeState] = useState<QuizMode>('CLASSIC');
  const [bossHp, setBossHp] = useState<number>(100);
  const [bossMaxHp] = useState<number>(100);
  const [isBossDefeated, setIsBossDefeated] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [latestReaction, setLatestReaction] = useState<MascotReaction | null>({
    emoji: '👋🧠',
    title: 'BRAINY IS READY TO ROLL!',
    comment: 'আজকে কয়টা কার্ড পড়বা? চলো Procrastination Demon কে পিটিয়ে বিদায় করি!',
    mood: 'hype',
  });
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Load saved gamification state
  useEffect(() => {
    async function loadStats() {
      try {
        let raw: string | null = null;
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          raw = window.localStorage.getItem(GAMIFICATION_KEY);
        }
        if (!raw) {
          raw = await AsyncStorage.getItem(GAMIFICATION_KEY);
        }
        if (raw) {
          const data = JSON.parse(raw);
          if (typeof data.xp === 'number') setXp(data.xp);
          if (typeof data.bestStreak === 'number') setBestStreak(data.bestStreak);
          if (typeof data.soundEnabled === 'boolean') setSoundEnabled(data.soundEnabled);
        }
      } catch (e) {}
    }
    loadStats();
  }, []);

  // Save changes
  const persistStats = useCallback(async (newXp: number, newBest: number, sound: boolean) => {
    try {
      const data = JSON.stringify({ xp: newXp, bestStreak: newBest, soundEnabled: sound });
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(GAMIFICATION_KEY, data);
      }
      await AsyncStorage.setItem(GAMIFICATION_KEY, data);
    } catch (e) {}
  }, []);

  // Level calculations: 200 XP per level
  const level = Math.floor(xp / 200) + 1;
  const levelIndex = Math.min(level - 1, LEVEL_TITLES.length - 1);
  const levelTitle = LEVEL_TITLES[levelIndex];
  const nextLevelXp = level * 200;
  const currentLevelProgress = ((xp % 200) / 200) * 100;

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      persistStats(xp, bestStreak, next);
      return next;
    });
  }, [xp, bestStreak, persistStats]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const resetBossBattle = useCallback(() => {
    setBossHp(100);
    setIsBossDefeated(false);
  }, []);

  const setQuizMode = useCallback((mode: QuizMode) => {
    setQuizModeState(mode);
    if (mode === 'BOSS_BATTLE') {
      setBossHp(100);
      setIsBossDefeated(false);
    }
  }, []);

  const clearReaction = useCallback(() => {
    setLatestReaction(null);
  }, []);

  // Record an active recall rating
  const recordRecallResult = useCallback(
    (rating: MasteryRating) => {
      let earnedXp = 0;
      let newStreak = currentStreak;

      if (rating === 'NAILED_IT') {
        earnedXp = 50 + currentStreak * 10;
        newStreak = currentStreak + 1;
        if (soundEnabled) {
          if (newStreak >= 3) {
            soundFx.playComboStreak();
          } else {
            soundFx.playCorrect();
          }
        }
        if (newStreak >= 3) {
          triggerConfetti();
        }
      } else if (rating === 'KINDA_KNEW') {
        earnedXp = 25;
        // Keep streak or pause
        if (soundEnabled) soundFx.playFlip();
      } else {
        // Blanked / Failed
        earnedXp = 5;
        newStreak = 0;
        if (soundEnabled) soundFx.playFunnyFail();
      }

      // Update XP & streaks
      const updatedXp = xp + earnedXp;
      const updatedBest = Math.max(bestStreak, newStreak);
      setXp(updatedXp);
      setCurrentStreak(newStreak);
      setBestStreak(updatedBest);
      persistStats(updatedXp, updatedBest, soundEnabled);

      // Boss Battle HP logic
      if (quizMode === 'BOSS_BATTLE' && !isBossDefeated) {
        if (soundEnabled && (rating === 'NAILED_IT' || rating === 'KINDA_KNEW')) {
          soundFx.playBossDamage();
        }
        setBossHp((prev) => {
          const dmg = rating === 'NAILED_IT' ? 25 : rating === 'KINDA_KNEW' ? 12 : -10;
          const nextHp = Math.max(0, Math.min(100, prev - dmg));
          if (nextHp === 0 && !isBossDefeated) {
            setIsBossDefeated(true);
            triggerConfetti();
            if (soundEnabled) soundFx.playTrophyFanfare();
          }
          return nextHp;
        });
      }

      // Generate funny/inspiring reaction
      const reaction = getRandomReaction(rating, newStreak);
      setLatestReaction(reaction);
    },
    [
      currentStreak,
      bestStreak,
      xp,
      soundEnabled,
      quizMode,
      isBossDefeated,
      persistStats,
      triggerConfetti,
    ]
  );

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        levelTitle,
        nextLevelXp,
        currentLevelProgress,
        currentStreak,
        bestStreak,
        quizMode,
        bossHp,
        bossMaxHp,
        isBossDefeated,
        soundEnabled,
        latestReaction,
        showConfetti,

        recordRecallResult,
        setQuizMode,
        resetBossBattle,
        toggleSound,
        triggerConfetti,
        clearReaction,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationState => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};
