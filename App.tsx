import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FlashcardProvider, useFlashcards } from './src/context/FlashcardContext';
import { GamificationProvider } from './src/context/GamificationContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { FlashcardScreen } from './src/screens/FlashcardScreen';
import { AddEditCardModal } from './src/components/AddEditCardModal';
import { DeleteConfirmModal } from './src/components/DeleteConfirmModal';
import { CardListModal } from './src/components/CardListModal';
import { BadgesModal } from './src/components/BadgesModal';
import { RanksModal } from './src/components/RanksModal';
import { MobileDeviceFrame } from './src/components/MobileDeviceFrame';
import { THEME } from './src/theme/flashcardTheme';

function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'quiz'>('dashboard');
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [isRanksModalOpen, setIsRanksModalOpen] = useState<boolean>(false);

  const {
    cards,
    categories,
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
    deletingCard,
    setDeletingCard,
  } = useFlashcards();

  const handleStartQuiz = (mode: string) => {
    if (mode === 'random') {
      shuffleDeck();
    } else {
      restartQuiz();
    }
    setCurrentScreen('quiz');
  };

  const handleOpenLibrary = () => {
    setIsManageModalOpen(true);
  };

  const handleOpenAddCard = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenBadges = () => {
    setIsBadgesModalOpen(true);
  };

  const handleOpenRanks = () => {
    setIsRanksModalOpen(true);
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <View style={styles.appContainer}>
      {/* Dynamic Screen View */}
      {currentScreen === 'dashboard' ? (
        <DashboardScreen
          onStartQuiz={handleStartQuiz}
          onOpenLibrary={handleOpenLibrary}
          onOpenAddCard={handleOpenAddCard}
          onOpenBadges={handleOpenBadges}
          onOpenRanks={handleOpenRanks}
        />
      ) : (
        <FlashcardScreen onBackToDashboard={handleBackToDashboard} />
      )}

      {/* Global Modals accessible across both screens */}
      {/* 1. Add New Card Modal */}
      <AddEditCardModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={async (data) => {
          await addCard(data);
          setIsAddModalOpen(false);
        }}
        initialCard={null}
        existingCategories={categories}
      />

      {/* 2. Edit Existing Card Modal */}
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

      {/* 3. Delete Confirmation Modal */}
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

      {/* 4. Decks & Card Management Modal */}
      <CardListModal
        visible={isManageModalOpen}
        cards={cards}
        onClose={() => setIsManageModalOpen(false)}
        onSelectCard={(index) => {
          goToCard(index);
          setIsManageModalOpen(false);
          setCurrentScreen('quiz');
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

      {/* 5. Trophy Cabinet & Badges Modal */}
      <BadgesModal
        visible={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
      />

      {/* 6. Global Leaderboard & Brain Ranks Modal */}
      <RanksModal
        visible={isRanksModalOpen}
        onClose={() => setIsRanksModalOpen(false)}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        <GamificationProvider>
          <FlashcardProvider>
            <MobileDeviceFrame>
              <AppNavigator />
            </MobileDeviceFrame>
          </FlashcardProvider>
        </GamificationProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111113',
  },
  appContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
});
