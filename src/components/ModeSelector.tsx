import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BookOpen, Zap, Swords } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { QuizMode, useGamification } from '../context/GamificationContext';

export const ModeSelector: React.FC = () => {
  const { quizMode, setQuizMode } = useGamification();

  const modes: { id: QuizMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'CLASSIC',
      label: 'Chill Study',
      icon: <BookOpen size={14} color={quizMode === 'CLASSIC' ? THEME.colors.primary : THEME.colors.textSecondary} />,
    },
    {
      id: 'SPEED_RUN',
      label: '⚡ Speed Run',
      icon: <Zap size={14} color={quizMode === 'SPEED_RUN' ? '#D97706' : THEME.colors.textSecondary} />,
    },
    {
      id: 'BOSS_BATTLE',
      label: '👾 Boss Battle',
      icon: <Swords size={14} color={quizMode === 'BOSS_BATTLE' ? '#DC2626' : THEME.colors.textSecondary} />,
    },
  ];

  return (
    <View style={styles.container}>
      {modes.map((m) => {
        const isActive = quizMode === m.id;
        return (
          <TouchableOpacity
            key={m.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => setQuizMode(m.id)}
            activeOpacity={0.7}
          >
            {m.icon}
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.lg,
    padding: 3,
    marginVertical: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: THEME.radius.md,
  },
  activeTab: {
    backgroundColor: THEME.colors.surface,
    ...THEME.shadows.card,
  },
  tabText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  activeTabText: {
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
});
