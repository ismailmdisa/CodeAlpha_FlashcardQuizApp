import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Award, RotateCcw, Shuffle, Plus, X } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';

interface QuizSummaryModalProps {
  visible: boolean;
  totalCards: number;
  onRestart: () => void;
  onShuffle: () => void;
  onAddNew: () => void;
  onClose: () => void;
}

export const QuizSummaryModal: React.FC<QuizSummaryModalProps> = ({
  visible,
  totalCards,
  onRestart,
  onShuffle,
  onAddNew,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          {/* Celebration Icon */}
          <View style={styles.iconBadge}>
            <Award size={36} color={THEME.colors.primary} />
          </View>

          <Text style={styles.title}>Deck Completed! 🎉</Text>
          <Text style={styles.subtitle}>
            Great job! You have reviewed all {totalCards} flashcards in this deck.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={onRestart}
              activeOpacity={0.85}
            >
              <RotateCcw size={18} color={THEME.colors.textInverse} />
              <Text style={styles.primaryBtnText}>Restart Deck</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => {
                onShuffle();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Shuffle size={18} color={THEME.colors.textSecondary} />
              <Text style={styles.secondaryBtnText}>Shuffle & Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tertiaryBtn}
              onPress={() => {
                onClose();
                onAddNew();
              }}
              activeOpacity={0.7}
            >
              <Plus size={16} color={THEME.colors.primary} />
              <Text style={styles.tertiaryBtnText}>Add More Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  actionGroup: {
    width: '100%',
    gap: 10,
    marginTop: 24,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primary,
    ...THEME.shadows.button,
  },
  primaryBtnText: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textInverse,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  secondaryBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textSecondary,
  },
  tertiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  tertiaryBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.primary,
  },
});
