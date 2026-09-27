export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  createdAt: number;
  updatedAt?: number;
}

export type CardFilter = 'ALL' | string;

export interface QuizProgress {
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  reviewedCardIds: string[];
}
