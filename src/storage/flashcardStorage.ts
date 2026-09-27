import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Flashcard } from '../types/flashcard';
import { SEED_FLASHCARDS } from '../data/seedFlashcards';

const STORAGE_KEY = '@codealpha_flashcards_v1';

export async function loadCardsFromStorage(): Promise<Flashcard[]> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }

    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // First time initializing: save default seeds
    await saveCardsToStorage(SEED_FLASHCARDS);
    return SEED_FLASHCARDS;
  } catch (err) {
    console.warn('Failed to load flashcards from storage, using seeds:', err);
    return SEED_FLASHCARDS;
  }
}

export async function saveCardsToStorage(cards: Flashcard[]): Promise<void> {
  try {
    const raw = JSON.stringify(cards);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, raw);
    }
    await AsyncStorage.setItem(STORAGE_KEY, raw);
  } catch (err) {
    console.error('Failed to save flashcards to storage:', err);
  }
}

export async function clearAndResetCards(): Promise<Flashcard[]> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    await AsyncStorage.removeItem(STORAGE_KEY);
    await saveCardsToStorage(SEED_FLASHCARDS);
    return SEED_FLASHCARDS;
  } catch (err) {
    console.error('Failed to reset flashcards:', err);
    return SEED_FLASHCARDS;
  }
}
