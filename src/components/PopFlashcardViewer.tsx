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
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  CheckCircle2,
} from 'lucide-react-native';
import { Flashcard } from '../types/flashcard';
import { THEME } from '../theme/flashcardTheme';

interface PopFlashcardViewerProps {
  card: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onEdit: (card: Flashcard) => void;
  onDelete: (card: Flashcard) => void;
  cardNumber: number;
  totalCards: number;
}

export const PopFlashcardViewer: React.FC<PopFlashcardViewerProps> = ({
  card,
  isFlipped,
  onToggleFlip,
  onEdit,
  onDelete,
  cardNumber,
  totalCards,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 14,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isFlipped, animatedValue]);

  // Card Flip Interpolations with strict clamping
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
    extrapolate: 'clamp',
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '0deg'],
    extrapolate: 'clamp',
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [0, 85, 95, 180],
    outputRange: [1, 1, 0, 0],
    extrapolate: 'clamp',
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [0, 85, 95, 180],
    outputRange: [0, 0, 1, 1],
    extrapolate: 'clamp',
  });

  // Pick category emoji
  const getCategoryEmoji = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('animal')) return '🦩';
    if (lower.includes('react')) return '⚛️';
    if (lower.includes('java') || lower.includes('js')) return '⚡';
    if (lower.includes('science') || lower.includes('cs')) return '💻';
    if (lower.includes('study')) return '☕';
    return '🧠';
  };

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      friction: 5,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const buttonTranslateY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
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
        {/* Background Graphic Blobs */}
        <View style={styles.bgBlobTopRight} pointerEvents="none" />
        <View style={styles.bgBlobBottomLeft} pointerEvents="none" />

        <View style={styles.cardHeader}>
          {/* Category Chip */}
          <View style={styles.categoryChip}>
            <HelpCircle size={14} color={THEME.colors.punchCoral} />
            <Text style={styles.categoryChipText}>{card.category}</Text>
          </View>

          {/* Quick Edit & Delete icons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => onEdit(card)}
              style={styles.actionIconBtn}
              aria-label="Edit card"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Edit3 size={15} color="#09090b" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(card)}
              style={[styles.actionIconBtn, styles.deleteIconBtn]}
              aria-label="Delete card"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={15} color={THEME.colors.punchCoral} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Question Center Content */}
        <ScrollView
          contentContainerStyle={styles.centerContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Circular Emoji Badge */}
          <View style={styles.emojiBadge}>
            <Text style={styles.emojiText}>{getCategoryEmoji(card.category)}</Text>
          </View>

          <Text style={styles.questionHeadline}>{card.question}</Text>
          <Text style={styles.questionHint}>
            Tap the big button below to see the truth!
          </Text>
        </ScrollView>

        {/* Giant Peek Action Button */}
        <Animated.View style={{ transform: [{ translateY: buttonTranslateY }] }}>
          <TouchableOpacity
            style={styles.peekButton}
            onPress={onToggleFlip}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <Eye size={20} color={THEME.colors.neonLime} />
            <Text style={styles.peekButtonText}>TAP TO PEEK ANSWER!</Text>
          </TouchableOpacity>
        </Animated.View>
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
        {/* Background Graphic Blobs */}
        <View style={styles.bgBlobTopRight} pointerEvents="none" />
        <View style={styles.bgBlobBottomLeft} pointerEvents="none" />

        <View style={styles.cardHeader}>
          {/* Fact Checked Chip */}
          <View style={[styles.categoryChip, styles.factCheckedChip]}>
            <CheckCircle2 size={14} color="#09090b" />
            <Text style={styles.categoryChipText}>FACT CHECKED</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => onEdit(card)}
              style={styles.actionIconBtn}
              aria-label="Edit card"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Edit3 size={15} color="#09090b" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(card)}
              style={[styles.actionIconBtn, styles.deleteIconBtn]}
              aria-label="Delete card"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={15} color={THEME.colors.punchCoral} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Answer Center Content */}
        <ScrollView
          contentContainerStyle={styles.centerContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Answer Emoji Badge */}
          <View style={[styles.emojiBadge, styles.answerEmojiBadge]}>
            <Text style={styles.emojiText}>💡</Text>
          </View>

          <Text style={styles.answerText}>{card.answer}</Text>
        </ScrollView>

        {/* Giant Hide Answer Button */}
        <Animated.View style={{ transform: [{ translateY: buttonTranslateY }] }}>
          <TouchableOpacity
            style={[styles.peekButton, styles.hideButton]}
            onPress={onToggleFlip}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            <EyeOff size={20} color="#09090b" />
            <Text style={[styles.peekButtonText, styles.hideButtonText]}>
              HIDE ANSWER (BACK)
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
    marginVertical: 6,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    backfaceVisibility: 'hidden',
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 2.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  frontCard: {
    backgroundColor: THEME.colors.creamSurface,
  },
  backCard: {
    backgroundColor: '#ffffff',
  },
  bgBlobTopRight: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(163, 230, 53, 0.25)',
  },
  bgBlobBottomLeft: {
    position: 'absolute',
    bottom: -24,
    left: -24,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(108, 71, 255, 0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  factCheckedChip: {
    backgroundColor: THEME.colors.neonLime,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  deleteIconBtn: {
    backgroundColor: '#fff1f2',
  },
  centerContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  emojiBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 2,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: 12,
  },
  answerEmojiBadge: {
    backgroundColor: THEME.colors.neonLime,
  },
  emojiText: {
    fontSize: 28,
  },
  questionHeadline: {
    fontSize: 21,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  questionHint: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.weights.medium,
    textAlign: 'center',
    marginTop: 6,
  },
  answerText: {
    fontSize: 17,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
    textAlign: 'center',
    lineHeight: 25,
  },
  peekButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.secondary,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  peekButtonText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
    letterSpacing: 0.6,
  },
  hideButton: {
    backgroundColor: THEME.colors.creamSurface,
  },
  hideButtonText: {
    color: '#09090b',
  },
});
