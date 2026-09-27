import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Flashcard, CardFilter } from '../types/flashcard';
import { loadCardsFromStorage, saveCardsToStorage, clearAndResetCards } from '../storage/flashcardStorage';

interface FlashcardContextType {
  // Data
  cards: Flashcard[];
  filteredCards: Flashcard[];
  categories: string[];
  selectedCategory: CardFilter;
  currentIndex: number;
  currentCard: Flashcard | null;
  isFlipped: boolean;
  isLoading: boolean;

  // Navigation
  toggleFlip: () => void;
  showAnswer: () => void;
  hideAnswer: () => void;
  nextCard: () => void;
  prevCard: () => void;
  goToCard: (index: number) => void;
  shuffleDeck: () => void;
  restartQuiz: () => void;
  setSelectedCategory: (category: CardFilter) => void;

  // CRUD
  addCard: (card: { question: string; answer: string; category?: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }) => Promise<void>;
  updateCard: (id: string, updates: { question: string; answer: string; category?: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  resetToDefaultDeck: () => Promise<void>;

  // Modals & UI Controls
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingCard: Flashcard | null;
  setEditingCard: (card: Flashcard | null) => void;
  isManageModalOpen: boolean;
  setIsManageModalOpen: (open: boolean) => void;
  isSummaryModalOpen: boolean;
  setIsSummaryModalOpen: (open: boolean) => void;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CardFilter>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  // Initial Load
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const loaded = await loadCardsFromStorage();
      setCards(loaded);
      setIsLoading(false);
    }
    init();
  }, []);

  // Compute Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => {
      if (c.category && c.category.trim()) {
        set.add(c.category.trim());
      }
    });
    return Array.from(set);
  }, [cards]);

  // Compute Filtered Cards
  const filteredCards = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return cards;
    }
    return cards.filter((c) => c.category === selectedCategory);
  }, [cards, selectedCategory]);

  // Ensure currentIndex stays within bounds when filteredCards change
  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(filteredCards.length - 1);
    } else if (filteredCards.length === 0) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length]);

  const currentCard = filteredCards[currentIndex] || null;

  // Flip handlers
  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const showAnswer = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const hideAnswer = useCallback(() => {
    setIsFlipped(false);
  }, []);

  // Navigation handlers with functional state updates
  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < filteredCards.length - 1) {
        return prev + 1;
      } else if (prev >= filteredCards.length - 1 && filteredCards.length > 0) {
        if (!isSummaryModalOpen) {
          setIsSummaryModalOpen(true);
          return prev;
        } else {
          setIsSummaryModalOpen(false);
          return 0;
        }
      }
      return prev;
    });
    setIsFlipped(false);
  }, [filteredCards.length, isSummaryModalOpen]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setIsFlipped(false);
  }, []);

  const goToCard = useCallback((index: number) => {
    if (index >= 0 && index < filteredCards.length) {
      setCurrentIndex(index);
      setIsFlipped(false);
    }
  }, [filteredCards.length]);

  const shuffleDeck = useCallback(() => {
    setCards((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const restartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSummaryModalOpen(false);
  }, []);

  // CRUD Operations
  const addCard = useCallback(
    async (newCardData: { question: string; answer: string; category?: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }) => {
      const newCard: Flashcard = {
        id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        question: newCardData.question.trim(),
        answer: newCardData.answer.trim(),
        category: (newCardData.category || 'General').trim(),
        difficulty: newCardData.difficulty || 'Medium',
        createdAt: Date.now(),
      };

      const updated = [newCard, ...cards];
      setCards(updated);
      await saveCardsToStorage(updated);
      // Select the newly added card
      setCurrentIndex(0);
      setIsFlipped(false);
    },
    [cards]
  );

  const updateCard = useCallback(
    async (
      id: string,
      updates: { question: string; answer: string; category?: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }
    ) => {
      const updated = cards.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            question: updates.question.trim(),
            answer: updates.answer.trim(),
            category: (updates.category || c.category || 'General').trim(),
            difficulty: updates.difficulty || c.difficulty || 'Medium',
            updatedAt: Date.now(),
          };
        }
        return c;
      });

      setCards(updated);
      await saveCardsToStorage(updated);
      setIsFlipped(false);
    },
    [cards]
  );

  const deleteCard = useCallback(
    async (id: string) => {
      const remaining = cards.filter((c) => c.id !== id);
      setCards(remaining);
      await saveCardsToStorage(remaining);

      // Adjust index if needed
      if (currentIndex >= remaining.length && remaining.length > 0) {
        setCurrentIndex(remaining.length - 1);
      }
      setIsFlipped(false);
    },
    [cards, currentIndex]
  );

  const resetToDefaultDeck = useCallback(async () => {
    setIsLoading(true);
    const defaults = await clearAndResetCards();
    setCards(defaults);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedCategory('ALL');
    setIsLoading(false);
  }, []);

  return (
    <FlashcardContext.Provider
      value={{
        cards,
        filteredCards,
        categories,
        selectedCategory,
        currentIndex,
        currentCard,
        isFlipped,
        isLoading,

        toggleFlip,
        showAnswer,
        hideAnswer,
        nextCard,
        prevCard,
        goToCard,
        shuffleDeck,
        restartQuiz,
        setSelectedCategory,

        addCard,
        updateCard,
        deleteCard,
        resetToDefaultDeck,

        isAddModalOpen,
        setIsAddModalOpen,
        editingCard,
        setEditingCard,
        isManageModalOpen,
        setIsManageModalOpen,
        isSummaryModalOpen,
        setIsSummaryModalOpen,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = (): FlashcardContextType => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};
