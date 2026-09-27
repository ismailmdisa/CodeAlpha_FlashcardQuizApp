import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Shuffle,
  RotateCcw,
} from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';

interface QuizControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onToggleFlip: () => void;
  onShuffle: () => void;
  onReset: () => void;
  isFlipped: boolean;
  isFirstCard: boolean;
  isLastCard: boolean;
  totalCards: number;
}

export const QuizControls: React.FC<QuizControlsProps> = ({
  onPrev,
  onNext,
  onToggleFlip,
  onShuffle,
  onReset,
  isFlipped,
  isFirstCard,
  isLastCard,
  totalCards,
}) => {
  return (
    <View style={styles.container}>
      {/* Primary Navigation Row */}
      <View style={styles.primaryNavRow}>
        {/* Previous Button */}
        <TouchableOpacity
          style={[styles.navBtn, isFirstCard && styles.navBtnDisabled]}
          onPress={onPrev}
          disabled={isFirstCard}
          activeOpacity={0.7}
        >
          <ChevronLeft
            size={20}
            color={isFirstCard ? THEME.colors.textMuted : THEME.colors.textPrimary}
          />
          <Text
            style={[
              styles.navBtnText,
              isFirstCard && styles.navBtnTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {/* Big Main Show/Hide Answer Button */}
        <TouchableOpacity
          style={[
            styles.flipActionBtn,
            isFlipped ? styles.flipActionBtnActive : styles.flipActionBtnDefault,
          ]}
          onPress={onToggleFlip}
          activeOpacity={0.85}
        >
          {isFlipped ? (
            <>
              <EyeOff size={18} color={THEME.colors.secondary} />
              <Text style={styles.flipActionBtnTextSecondary}>Hide Answer</Text>
            </>
          ) : (
            <>
              <Eye size={18} color={THEME.colors.textInverse} />
              <Text style={styles.flipActionBtnTextPrimary}>Show Answer</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.navBtn,
            isLastCard && styles.lastNavBtn,
          ]}
          onPress={onNext}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navBtnText,
              isLastCard && styles.lastNavBtnText,
            ]}
          >
            {isLastCard ? 'Finish' : 'Next'}
          </Text>
          <ChevronRight
            size={20}
            color={isLastCard ? THEME.colors.primary : THEME.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Secondary Controls: Shuffle & Restart */}
      <View style={styles.secondaryControlsRow}>
        <TouchableOpacity
          style={styles.utilBtn}
          onPress={onShuffle}
          activeOpacity={0.7}
        >
          <Shuffle size={14} color={THEME.colors.textSecondary} />
          <Text style={styles.utilBtnText}>Shuffle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.utilBtn}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <RotateCcw size={14} color={THEME.colors.textSecondary} />
          <Text style={styles.utilBtnText}>Restart Deck</Text>
        </TouchableOpacity>
      </View>

      {/* Web Keyboard Tip */}
      {Platform.OS === 'web' && (
        <View style={styles.shortcutTipContainer}>
          <Text style={styles.shortcutTipText}>
            Keyboard: <Text style={styles.shortcutKey}>← Prev</Text> •{' '}
            <Text style={styles.shortcutKey}>Space Show Answer</Text> •{' '}
            <Text style={styles.shortcutKey}>Next →</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    gap: 12,
    marginTop: THEME.spacing.sm,
  },
  primaryNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 105,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  navBtnDisabled: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderColor: THEME.colors.surfaceSubtle,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  navBtnText: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  navBtnTextDisabled: {
    color: THEME.colors.textMuted,
  },
  lastNavBtn: {
    borderColor: THEME.colors.primaryBorder,
    backgroundColor: THEME.colors.primaryLight,
  },
  lastNavBtnText: {
    color: THEME.colors.primary,
  },
  flipActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.lg,
  },
  flipActionBtnDefault: {
    backgroundColor: THEME.colors.primary,
    ...THEME.shadows.button,
  },
  flipActionBtnActive: {
    backgroundColor: THEME.colors.secondaryLight,
    borderWidth: 1.5,
    borderColor: THEME.colors.secondaryBorder,
  },
  flipActionBtnTextPrimary: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textInverse,
  },
  flipActionBtnTextSecondary: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.secondary,
  },
  secondaryControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  utilBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  utilBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  shortcutTipContainer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  shortcutTipText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
  },
  shortcutKey: {
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
});
