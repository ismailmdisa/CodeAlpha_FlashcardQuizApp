# 🃏 Pop Cartoon Flashcard Quiz App
### CodeAlpha Internship — Flashcard Quiz App for Studying

[![CodeAlpha Internship](https://img.shields.io/badge/CodeAlpha-App%20Development%20Internship-6c47ff?style=for-the-badge&logo=codeforces&logoColor=white)](https://www.codealpha.tech/)
[![React Native](https://img.shields.io/badge/React_Native-0.76.7-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Design System](https://img.shields.io/badge/Design_System-Pop_Cartoon_Neobrutalism-a3e635?style=for-the-badge)](https://stitch.design)

---

## 📌 Project Overview
**Pop Cartoon Flashcard Quiz** is a gamified, interactive study application crafted for the **CodeAlpha App Development Internship**. Designed around a high-energy **Pop Cartoon Neo-brutalist Design System**, it transforms traditional flashcard memorization into an addictive, laugh-out-loud study experience featuring a living mascot named **Gloop**, tactile 3D button extrusions, Web Audio sound effects, and full offline CRUD card management.

---

## 🎯 CodeAlpha Requirements Matrix

| Requirement from CodeAlpha Instruction | Implementation in Pop Cartoon Quiz | Status |
| :--- | :--- | :---: |
| **Question on front, Answer on back** | Tactile 3D Flashcard with instant front/back reveal and peek answer button | ✅ 100% Implemented |
| **"Show Answer" button** | Dedicated `TAP TO PEEK ANSWER!` action and full flip interaction | ✅ 100% Implemented |
| **Navigate using "Next" and "Previous"** | Heavy tactile `PREV` and `NEXT CHAOS` buttons with boundary checks & wrap | ✅ 100% Implemented |
| **Add, Edit, and Delete flashcards** | Full CRUD modal suite with topic tagging, validation, and deck list view | ✅ 100% Implemented |
| **Simple and clean user interface** | Pop Cartoon Neo-brutalism (`#fcfae6` cream background, `#09090b` border strokes, `#a3e635` lime accents) | ✅ 100% Implemented |

---

## 🌟 Innovative & Gamified Features

### 1. 🐣 Living Mascot — "Gloop"
- **Mood States**: Gloop reacts dynamically to your answers:
  - *Thinking*: Pondering the front question.
  - *Ecstatic*: Celebrating correct answers with bouncing cheeks and starry eyes.
  - *Defeated*: Drooping comically when you miss a question ("Potato Brain!").
  - *Trophy*: Brandishing a giant golden cup upon round completion.
- **Witty Commentary**: Speech bubbles delivering hilarious, Duolingo-style roasts and praises.

### 2. 🖲️ Tactile 3D Spring Physics
- **Physical Extrusion**: Buttons and cards feature 4px–8px solid dark shadows (`0 8px 0 #09090b`).
- **Spring Push Depth**: On press, buttons compress downwards by 4px (`translateY(4px)`) mimicking a real mechanical arcade button.
- **Audio Feedback**: 8-bit synthetic Web Audio SFX generated via the Web Audio API (zero audio asset latency).

### 3. 🧠 Smart Study Modes & Feedback
- **Self-Grading Action Bar**:
  - `🥔 Potato Brain! (WRONG)`: Marks card for review and lowers mascot morale.
  - `⚡ Gigachad! (NAILED IT)`: Triggers victory chimes, streak flames, and confetti.
- **Round Win Celebration**: Bento-box stats screen displaying accuracy percentage, XP earned, and dynamic mastery badges.

### 4. 🗂️ Deck Customization & Offline Persistence
- **Create Custom Cards**: Add questions, answers, and category tags.
- **Edit & Delete**: Manage your entire study library with immediate live updates.
- **Zero Data Loss**: Offline storage using `@react-native-async-storage/async-storage` and `localStorage` on Web.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### Installation
```bash
# 1. Navigate to the project directory
cd "/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp"

# 2. Start the Expo development server
npm run web
# Or for mobile:
# npm run android
# npm run ios
```

---

## 📁 Project Directory Structure
```
CodeAlpha_FlashcardQuizApp/
├── App.tsx                        # Application Root & Providers
├── app.json                       # Expo configuration
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── src/
│   ├── components/                # UI Components
│   │   ├── PopHeader.tsx          # 5-dot progress bar, streak counter, sound toggle
│   │   ├── MascotCharacter.tsx    # Animated SVG Living Mascot Gloop
│   │   ├── PopFlashcardViewer.tsx # 3D Neo-brutalist Flashcard with peek & flip
│   │   ├── PopQuizControls.tsx    # "Potato Brain", "Gigachad", Prev/Next chaos buttons
│   │   ├── PopRoundWinModal.tsx   # Bento-box celebratory summary modal
│   │   ├── AddEditCardModal.tsx   # Modal for adding & editing flashcards
│   │   ├── DeleteConfirmModal.tsx # Safe deletion prompt
│   │   ├── CardListModal.tsx      # Full deck browser with search and filter
│   │   └── ConfettiExplosion.tsx  # Particle celebration canvas
│   ├── context/
│   │   ├── FlashcardContext.tsx   # State management for cards, index, and flip
│   │   └── GamificationContext.tsx# Streaks, scores, mascot mood, sounds
│   ├── data/
│   │   └── seedFlashcards.ts      # Curated starter study questions
│   ├── services/
│   │   ├── soundFx.ts             # Web Audio API 8-bit sound generator
│   │   └── mascotReactions.ts     # Mascot dialogue logic
│   ├── storage/
│   │   └── flashcardStorage.ts    # Cross-platform persistent storage
│   ├── theme/
│   │   └── flashcardTheme.ts      # Stitch design system colors & typography
│   └── types/
│       └── flashcard.ts           # TypeScript interfaces
```

---

## 🏆 Authors & Acknowledgments
- **Developer**: Md. Ismail Hossen
- **Organization**: CodeAlpha App Development Internship
