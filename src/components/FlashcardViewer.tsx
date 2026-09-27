import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import {
  HelpCircle,
  CheckCircle2,
  Edit3,
  Trash2,
  Sparkles,
  RotateCw,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { Flashcard } from '../types/flashcard';
import { THEME } from '../theme/flashcardTheme';

interface FlashcardViewerProps {
  card: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onEdit: (card: Flashcard) => void;
  onDelete: (card: Flashcard) => void;
  cardNumber: number;
  totalCards: number;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  card,
  isFlipped,
  onToggleFlip,
  onEdit,
  onDelete,
  cardNumber,
  totalCards,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isFlipped, animatedValue]);

  // Interpolations for 3D card flip
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Front Face: Question */}
      <Animated.View
        pointerEvents={isFlipped ? 'none' : 'auto'}
        style={[
          styles.card,
          styles.frontCard,
          {
            zIndex: isFlipped ? 1 : 2,
            transform: [{ perspective: 1200 }, { rotateY: frontInterpolate }],
            opacity: frontOpacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardInner}
          onPress={onToggleFlip}
        >
          {/* Header Strip */}
          <View style={styles.cardHeader}>
            <View style={styles.sideBadge}>
              <HelpCircle size={14} color={THEME.colors.primary} />
              <Text style={styles.sideBadgeText}>QUESTION</Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{card.category}</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.actionIconBtn}
              >
                <Edit3 size={16} color={THEME.colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(card);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.actionIconBtn}
              >
                <Trash2 size={16} color={THEME.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Question Content */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.questionText}>{card.question}</Text>
          </ScrollView>

          {/* Card Footer Hint / Prompt */}
          <View style={styles.cardFooter}>
            <View style={styles.tapHintContainer}>
              <RotateCw size={13} color={THEME.colors.textMuted} />
              <Text style={styles.tapHintText}>Tap card or button below to flip</Text>
            </View>

            {/* Quick Show Answer Button inside Card */}
            <TouchableOpacity
              style={styles.showAnswerBtn}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFlip();
              }}
              activeOpacity={0.8}
            >
              <Eye size={16} color={THEME.colors.textInverse} />
              <Text style={styles.showAnswerBtnText}>Show Answer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Back Face: Answer */}
      <Animated.View
        pointerEvents={isFlipped ? 'auto' : 'none'}
        style={[
          styles.card,
          styles.backCard,
          {
            zIndex: isFlipped ? 2 : 1,
            transform: [{ perspective: 1200 }, { rotateY: backInterpolate }],
            opacity: backOpacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardInner}
          onPress={onToggleFlip}
        >
          {/* Header Strip */}
          <View style={styles.cardHeader}>
            <View style={[styles.sideBadge, styles.answerSideBadge]}>
              <CheckCircle2 size={14} color={THEME.colors.secondary} />
              <Text style={[styles.sideBadgeText, styles.answerSideBadgeText]}>ANSWER</Text>
            </View>

            <View style={styles.headerRight}>
              <View style={[styles.categoryBadge, styles.answerCategoryBadge]}>
                <Text style={[styles.categoryBadgeText, styles.answerCategoryBadgeText]}>
                  {card.category}
                </Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.actionIconBtn}
              >
                <Edit3 size={16} color={THEME.colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(card);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.actionIconBtn}
              >
                <Trash2 size={16} color={THEME.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Answer Content */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.answerText}>{card.answer}</Text>
          </ScrollView>

          {/* Card Footer Hint / Prompt */}
          <View style={styles.cardFooter}>
            <View style={styles.tapHintContainer}>
              <RotateCw size={13} color={THEME.colors.textMuted} />
              <Text style={styles.tapHintText}>Tap card or button below to flip back</Text>
            </View>

            {/* Hide Answer Button inside Card */}
            <TouchableOpacity
              style={[styles.showAnswerBtn, styles.hideAnswerBtn]}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFlip();
              }}
              activeOpacity={0.8}
            >
              <EyeOff size={16} color={THEME.colors.secondary} />
              <Text style={[styles.showAnswerBtnText, styles.hideAnswerBtnText]}>
                Hide Answer (Back to Question)
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    height: 380,
    alignSelf: 'center',
    position: 'relative',
    marginVertical: THEME.spacing.md,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: THEME.radius.xl,
    backfaceVisibility: 'hidden',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  frontCard: {
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
  },
  backCard: {
    backgroundColor: '#FAFDFD',
    borderColor: THEME.colors.secondaryBorder,
  },
  cardInner: {
    flex: 1,
    padding: THEME.spacing.xl,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceSubtle,
  },
  sideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.primaryLight,
  },
  sideBadgeText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
    letterSpacing: 0.8,
  },
  answerSideBadge: {
    backgroundColor: THEME.colors.secondaryLight,
  },
  answerSideBadgeText: {
    color: THEME.colors.secondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  categoryBadgeText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  answerCategoryBadge: {
    backgroundColor: THEME.colors.secondaryLight,
  },
  answerCategoryBadgeText: {
    color: THEME.colors.secondary,
  },
  actionIconBtn: {
    padding: 6,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
  },
  questionText: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
    lineHeight: 32,
    textAlign: 'center',
  },
  answerText: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textPrimary,
    lineHeight: 28,
    textAlign: 'center',
  },
  cardFooter: {
    gap: 10,
    alignItems: 'center',
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceSubtle,
  },
  tapHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tapHintText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
  },
  showAnswerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 12,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    ...THEME.shadows.button,
  },
  showAnswerBtnText: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textInverse,
  },
  hideAnswerBtn: {
    backgroundColor: THEME.colors.secondaryLight,
    borderWidth: 1,
    borderColor: THEME.colors.secondaryBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  hideAnswerBtnText: {
    color: THEME.colors.secondary,
  },
});
