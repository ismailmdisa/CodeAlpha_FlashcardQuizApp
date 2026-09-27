import { Flashcard } from '../types/flashcard';

export const SEED_FLASHCARDS: Flashcard[] = [
  {
    id: 'seed-1',
    question: 'What is the Virtual DOM in React and why is it used?',
    answer:
      'The Virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React creates a new virtual DOM tree, diffs it against the previous one (reconciliation), and batches only the necessary updates to the real DOM for high performance.',
    category: 'React & Web',
    difficulty: 'Medium',
    createdAt: Date.now() - 600000,
  },
  {
    id: 'seed-2',
    question: 'What is the difference between synchronous and asynchronous code in JavaScript?',
    answer:
      'Synchronous code executes sequentially line-by-line, blocking subsequent instructions until the current one finishes. Asynchronous code allows long operations (like network requests or timers) to execute in the background via the Event Loop without freezing the UI.',
    category: 'JavaScript',
    difficulty: 'Easy',
    createdAt: Date.now() - 500000,
  },
  {
    id: 'seed-3',
    question: 'What does CSS "box-sizing: border-box" do?',
    answer:
      'It tells the browser to include padding and border in the element\'s total width and height calculation, preventing the box from expanding beyond its defined dimensions.',
    category: 'Web Basics',
    difficulty: 'Easy',
    createdAt: Date.now() - 400000,
  },
  {
    id: 'seed-4',
    question: 'What is Time Complexity (Big O Notation) for searching an element in a Balanced Binary Search Tree (BST)?',
    answer:
      'O(log n) on average and in the worst case for a balanced tree (like AVL or Red-Black tree), because each comparison divides the search space in half.',
    category: 'Computer Science',
    difficulty: 'Hard',
    createdAt: Date.now() - 300000,
  },
  {
    id: 'seed-5',
    question: 'What is the purpose of the "key" prop when rendering lists in React?',
    answer:
      'The "key" prop gives each element a stable identity. It helps React identify which items have changed, been added, or been removed, avoiding unnecessary re-renders of the entire list.',
    category: 'React & Web',
    difficulty: 'Easy',
    createdAt: Date.now() - 200000,
  },
  {
    id: 'seed-6',
    question: 'What is the Pomodoro Technique in study habits?',
    answer:
      'A time management method that uses a timer to break work into intervals, typically 25 minutes of focused study followed by a 5-minute break. After 4 intervals, take a longer 15-30 minute break.',
    category: 'Study Skills',
    difficulty: 'Easy',
    createdAt: Date.now() - 100000,
  },
];
