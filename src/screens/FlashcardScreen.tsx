import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Plus, BookOpen, Sparkles } from 'lucide-react-native';
import { useFlashcards } from '../context/FlashcardContext';
import { useGamification } from '../context/GamificationContext';
import { THEME } from '../theme/flashcardTheme';
import { PopHeader } from '../components/PopHeader';
import { MascotCharacter } from '../components/MascotCharacter';
import { PopFlashcardViewer } from '../components/PopFlashcardViewer';
import { PopQuizControls } from '../components/PopQuizControls';
import { PopRoundWinModal } from '../components/PopRoundWinModal';
import { ConfettiExplosion } from '../components/ConfettiExplosion';
import { Flashcard } from '../types/flashcard';
import { soundFx } from '../services/soundFx';
import { MasteryRating } from '../services/mascotReactions';

interface FlashcardScreenProps {
  onBackToDashboard?: () => void;
}

export const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ onBackToDashboard }) => {
  const {
    cards,
    filteredCards,
    categories,
    currentIndex,
    currentCard,
    isFlipped,
    isLoading,

    toggleFlip,
    nextCard,
    prevCard,
    goToCard,
    shuffleDeck,
    restartQuiz,

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
    deletingCard,
    setDeletingCard,
  } = useFlashcards();

  const {
    currentStreak,
    bestStreak,
    xp,
    soundEnabled,
    latestReaction,
    showConfetti,
    recordRecallResult,
    toggleSound,
  } = useGamification();

  // Play sound on flip
  const handleToggleFlip = () => {
    if (soundEnabled) soundFx.playFlip();
    toggleFlip();
  };

  // When rating a card (Potato Brain / Gigachad)
  const handleRateRecall = (rating: MasteryRating) => {
    recordRecallResult(rating);
    if (!isFlipped) {
      // If user hasn't seen the answer yet, reveal it immediately so they can study!
      if (soundEnabled) soundFx.playFlip();
      toggleFlip();
    } else {
      // If user already inspected the answer, advance to next card after a snappy celebration delay
      setTimeout(() => {
        nextCard();
      }, 700);
    }
  };

  // Keyboard navigation for Desktop Web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;
      if (isAddModalOpen || editingCard || isManageModalOpen || deletingCard) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggleFlip();
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleRateRecall('BLANKED');
        } else if (e.key === '2' || e.key === '3') {
          e.preventDefault();
          handleRateRecall('NAILED_IT');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    nextCard,
    prevCard,
    isFlipped,
    isAddModalOpen,
    editingCard,
    isManageModalOpen,
    deletingCard,
  ]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#09090b" />
        <Text style={styles.loadingText}>Loading Pop Flashcards...</Text>
      </View>
    );
  }

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === filteredCards.length - 1;

  // Mascot bubble text and comment
  const bubbleTitle = latestReaction ? latestReaction.title : 'THINK HARD!';
  const bubbleEmoji = latestReaction ? latestReaction.emoji : '⚡';
  const mascotComment = latestReaction
    ? latestReaction.comment
    : "You're crushing it, Einstein! ⚡";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Confetti Explosion Burst */}
      {showConfetti && <ConfettiExplosion />}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navbar & Tactile Progress Dots */}
        <PopHeader
          currentIndex={currentIndex}
          totalCards={filteredCards.length}
          currentStreak={currentStreak}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenLibrary={() => setIsManageModalOpen(true)}
          onRestartDeck={restartQuiz}
          onBackToDashboard={onBackToDashboard}
        />

        {/* Living Mascot Character Stage */}
        <MascotCharacter
          bubbleText={bubbleTitle}
          bubbleEmoji={bubbleEmoji}
          onPress={handleToggleFlip}
        />

        {/* Hero Flashcard Stage */}
        {filteredCards.length > 0 && currentCard ? (
          <View style={styles.mainStage}>
            {/* The Tactile Neo-Brutalist Flashcard */}
            <PopFlashcardViewer
              card={currentCard}
              isFlipped={isFlipped}
              onToggleFlip={handleToggleFlip}
              onEdit={(card) => setEditingCard(card)}
              onDelete={(card) => setDeletingCard(card)}
              cardNumber={currentIndex + 1}
              totalCards={filteredCards.length}
            />

            {/* Direct Tactile Control Zone (Potato Brain, Gigachad, Prev, Next Chaos) */}
            <PopQuizControls
              onPrev={prevCard}
              onNext={nextCard}
              onRateRecall={handleRateRecall}
              isFirstCard={isFirstCard}
              isLastCard={isLastCard}
              mascotComment={mascotComment}
            />
          </View>
        ) : (
          /* Empty Deck State */
          <View style={styles.emptyDeckState}>
            <View style={styles.emptyIconContainer}>
              <BookOpen size={48} color="#09090b" />
            </View>
            <Text style={styles.emptyDeckTitle}>No Flashcards in Deck!</Text>
            <Text style={styles.emptyDeckSubtitle}>
              Tap the button below to add your first study question.
            </Text>

            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => setIsAddModalOpen(true)}
            >
              <Plus size={18} color="#09090b" />
              <Text style={styles.emptyAddBtnText}>Create First Pop Card</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Round Win Celebration Modal */}
      <PopRoundWinModal
        visible={isSummaryModalOpen}
        totalCards={filteredCards.length}
        bestStreak={bestStreak}
        xpEarned={xp}
        onRestart={restartQuiz}
        onShuffle={shuffleDeck}
        onClose={() => setIsSummaryModalOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: THEME.colors.background,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
  },
  mainStage: {
    width: '100%',
    alignItems: 'center',
  },
  emptyDeckState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  emptyDeckTitle: {
    fontSize: 20,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  emptyDeckSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginTop: 10,
  },
  emptyAddBtnText: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
});
