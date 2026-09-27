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
import { FlashcardViewer } from '../components/FlashcardViewer';
import { QuizControls } from '../components/QuizControls';
import { ProgressHeader } from '../components/ProgressHeader';
import { AddEditCardModal } from '../components/AddEditCardModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { CardListModal } from '../components/CardListModal';
import { QuizSummaryModal } from '../components/QuizSummaryModal';
import { ComboMeter } from '../components/ComboMeter';
import { MascotBanner } from '../components/MascotBanner';
import { ModeSelector } from '../components/ModeSelector';
import { RecallActionButtons } from '../components/RecallActionButtons';
import { BossBattleBar } from '../components/BossBattleBar';
import { SpeedRunTimer } from '../components/SpeedRunTimer';
import { ConfettiExplosion } from '../components/ConfettiExplosion';
import { Flashcard } from '../types/flashcard';
import { soundFx } from '../services/soundFx';

export const FlashcardScreen: React.FC = () => {
  const {
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
  } = useFlashcards();

  const {
    quizMode,
    soundEnabled,
    latestReaction,
    showConfetti,
    recordRecallResult,
    clearReaction,
  } = useGamification();

  const [deletingCard, setDeletingCard] = useState<Flashcard | null>(null);

  // Play sound on flip
  const handleToggleFlip = () => {
    if (soundEnabled) soundFx.playFlip();
    toggleFlip();
  };

  // When rating a card (Blanked / Kinda / Nailed It)
  const handleRateRecall = (rating: 'NAILED_IT' | 'KINDA_KNEW' | 'BLANKED') => {
    recordRecallResult(rating);
    // Smoothly auto-advance to next card after 1.2s delay or keep active
    setTimeout(() => {
      nextCard();
    }, 1200);
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
        // Numeric recall shortcuts on Web: 1=Blanked, 2=Kinda, 3=Nailed It
        if (e.key === '1') {
          e.preventDefault();
          handleRateRecall('BLANKED');
        } else if (e.key === '2') {
          e.preventDefault();
          handleRateRecall('KINDA_KNEW');
        } else if (e.key === '3') {
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
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Loading Flashcards...</Text>
      </View>
    );
  }

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === filteredCards.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={THEME.colors.background}
      />

      {/* Confetti Explosion Burst */}
      {showConfetti && <ConfettiExplosion />}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress & Brand Header */}
        <ProgressHeader
          currentIndex={currentIndex}
          totalCards={filteredCards.length}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenManageModal={() => setIsManageModalOpen(true)}
        />

        {/* Gamified Combo, Level & Sound Meter */}
        <ComboMeter />

        {/* Study Mode Selector (Chill / Speed Run / Boss Battle) */}
        <ModeSelector />

        {/* Speed Run Countdown Timer */}
        {quizMode === 'SPEED_RUN' && (
          <SpeedRunTimer
            cardIndex={currentIndex}
            isFlipped={isFlipped}
            soundEnabled={soundEnabled}
            onTimeUp={() => {
              showAnswer();
              recordRecallResult('BLANKED');
            }}
          />
        )}

        {/* Boss Battle Bar */}
        {quizMode === 'BOSS_BATTLE' && <BossBattleBar />}

        {/* Mascot Roast & Praise Banner */}
        <MascotBanner
          reaction={latestReaction}
          onDismiss={clearReaction}
        />

        {/* Main Flashcard Arena */}
        {filteredCards.length > 0 && currentCard ? (
          <View style={styles.studyArena}>
            {/* The Flashcard with 3D Flip */}
            <FlashcardViewer
              card={currentCard}
              isFlipped={isFlipped}
              onToggleFlip={handleToggleFlip}
              onEdit={(card) => setEditingCard(card)}
              onDelete={(card) => setDeletingCard(card)}
              cardNumber={currentIndex + 1}
              totalCards={filteredCards.length}
            />

            {/* Active Recall Buttons shown when answer is revealed */}
            {isFlipped && (
              <RecallActionButtons onRate={handleRateRecall} />
            )}

            {/* Navigation & Answer Controls */}
            <QuizControls
              onPrev={prevCard}
              onNext={nextCard}
              onToggleFlip={handleToggleFlip}
              onShuffle={shuffleDeck}
              onReset={restartQuiz}
              isFlipped={isFlipped}
              isFirstCard={isFirstCard}
              isLastCard={isLastCard}
              totalCards={filteredCards.length}
            />
          </View>
        ) : (
          /* Empty Deck State */
          <View style={styles.emptyDeckState}>
            <View style={styles.emptyIconContainer}>
              <BookOpen size={48} color={THEME.colors.primary} />
            </View>
            <Text style={styles.emptyDeckTitle}>No Flashcards Available</Text>
            <Text style={styles.emptyDeckSubtitle}>
              {selectedCategory !== 'ALL'
                ? `There are no cards in the "${selectedCategory}" category.`
                : 'Your flashcard collection is currently empty.'}
            </Text>

            <View style={styles.emptyActionRow}>
              {selectedCategory !== 'ALL' && (
                <TouchableOpacity
                  style={styles.emptySecondaryBtn}
                  onPress={() => setSelectedCategory('ALL')}
                >
                  <Text style={styles.emptySecondaryBtnText}>View All Decks</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.emptyPrimaryBtn}
                onPress={() => setIsAddModalOpen(true)}
              >
                <Plus size={18} color={THEME.colors.textInverse} />
                <Text style={styles.emptyPrimaryBtnText}>Create First Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Card Modal */}
      <AddEditCardModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={async (data) => {
          await addCard(data);
        }}
        initialCard={null}
        existingCategories={categories}
      />

      {/* Edit Card Modal */}
      <AddEditCardModal
        visible={!!editingCard}
        onClose={() => setEditingCard(null)}
        onSave={async (data) => {
          if (editingCard) {
            await updateCard(editingCard.id, data);
            setEditingCard(null);
          }
        }}
        initialCard={editingCard}
        existingCategories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={!!deletingCard}
        card={deletingCard}
        onClose={() => setDeletingCard(null)}
        onConfirm={async () => {
          if (deletingCard) {
            await deleteCard(deletingCard.id);
            setDeletingCard(null);
          }
        }}
      />

      {/* Deck Library Modal */}
      <CardListModal
        visible={isManageModalOpen}
        cards={cards}
        onClose={() => setIsManageModalOpen(false)}
        onSelectCard={(index) => {
          setSelectedCategory('ALL');
          goToCard(index);
        }}
        onEditCard={(card) => {
          setIsManageModalOpen(false);
          setEditingCard(card);
        }}
        onDeleteCard={(card) => {
          setDeletingCard(card);
        }}
        onAddNew={() => {
          setIsAddModalOpen(true);
        }}
        onResetDefaults={async () => {
          await resetToDefaultDeck();
        }}
      />

      {/* Quiz Completion / Summary Modal */}
      <QuizSummaryModal
        visible={isSummaryModalOpen}
        totalCards={filteredCards.length}
        onRestart={restartQuiz}
        onShuffle={shuffleDeck}
        onAddNew={() => {
          setIsSummaryModalOpen(false);
          setIsAddModalOpen(true);
        }}
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
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    maxWidth: 700,
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
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  studyArena: {
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
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyDeckTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  emptyDeckSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 20,
  },
  emptyActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  emptyPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primary,
    ...THEME.shadows.button,
  },
  emptyPrimaryBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textInverse,
  },
  emptySecondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptySecondaryBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
});
