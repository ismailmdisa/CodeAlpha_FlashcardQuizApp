import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { MasteryRating } from '../services/mascotReactions';

interface PopQuizControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onRateRecall: (rating: MasteryRating) => void;
  isFirstCard: boolean;
  isLastCard: boolean;
  mascotComment?: string;
}

export const PopQuizControls: React.FC<PopQuizControlsProps> = ({
  onPrev,
  onNext,
  onRateRecall,
  isFirstCard,
  isLastCard,
  mascotComment = "You're crushing it, Einstein!",
}) => {
  const potatoPress = useRef(new Animated.Value(0)).current;
  const gigaPress = useRef(new Animated.Value(0)).current;
  const prevPress = useRef(new Animated.Value(0)).current;
  const nextPress = useRef(new Animated.Value(0)).current;

  const animatePress = (anim: Animated.Value, isDown: boolean) => {
    Animated.timing(anim, {
      toValue: isDown ? 1 : 0,
      duration: isDown ? 70 : 150,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const getTranslateY = (anim: Animated.Value) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4],
    });

  return (
    <View style={styles.container}>
      {/* 2 Big Chunky Rating Buttons: Potato Brain vs Gigachad */}
      <View style={styles.ratingRow}>
        {/* Potato Brain Button (WRONG) */}
        <Animated.View
          style={[styles.btnWrapper, { transform: [{ translateY: getTranslateY(potatoPress) }] }]}
        >
          <TouchableOpacity
            style={styles.potatoBtn}
            onPress={() => onRateRecall('BLANKED')}
            aria-label="Potato Brain Wrong"
            onPressIn={() => animatePress(potatoPress, true)}
            onPressOut={() => animatePress(potatoPress, false)}
            activeOpacity={0.9}
          >
            <Text style={styles.btnEmoji}>💀</Text>
            <View style={styles.btnTextCol}>
              <Text style={styles.potatoBtnTitle}>Potato Brain!</Text>
              <Text style={styles.potatoBtnSub}>WRONG</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Gigachad Button (NAILED IT) */}
        <Animated.View
          style={[styles.btnWrapper, { transform: [{ translateY: getTranslateY(gigaPress) }] }]}
        >
          <TouchableOpacity
            style={styles.gigaBtn}
            onPress={() => onRateRecall('NAILED_IT')}
            aria-label="Gigachad Nailed It"
            onPressIn={() => animatePress(gigaPress, true)}
            onPressOut={() => animatePress(gigaPress, false)}
            activeOpacity={0.9}
          >
            <Text style={styles.btnEmoji}>🗿</Text>
            <View style={styles.btnTextCol}>
              <Text style={styles.gigaBtnTitle}>Gigachad!</Text>
              <Text style={styles.gigaBtnSub}>NAILED IT</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Stepper Navigation Bar: Prev vs Next Chaos */}
      <View style={styles.navRow}>
        {/* Prev Button */}
        <Animated.View
          style={[
            styles.btnWrapper,
            { transform: [{ translateY: getTranslateY(prevPress) }] },
            isFirstCard && styles.disabledWrapper,
          ]}
        >
          <TouchableOpacity
            style={[styles.prevBtn, isFirstCard && styles.prevBtnDisabled]}
            onPress={onPrev}
            disabled={isFirstCard}
            aria-label="Previous card"
            onPressIn={() => animatePress(prevPress, true)}
            onPressOut={() => animatePress(prevPress, false)}
            activeOpacity={0.9}
          >
            <ArrowLeft size={18} color="#09090b" />
            <Text style={styles.prevBtnText}>Prev</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Next Chaos Button */}
        <Animated.View
          style={[styles.btnWrapper, { transform: [{ translateY: getTranslateY(nextPress) }] }]}
        >
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={onNext}
            aria-label="Next card"
            onPressIn={() => animatePress(nextPress, true)}
            onPressOut={() => animatePress(nextPress, false)}
            activeOpacity={0.9}
          >
            <Text style={styles.nextBtnText}>
              {isLastCard ? 'Finish Quiz' : 'Next Chaos'}
            </Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Mascot Feedback Toast Pill */}
      <View style={styles.mascotToast}>
        <View style={styles.zapIconCircle}>
          <Zap size={14} color="#09090b" />
        </View>
        <Text style={styles.mascotToastText} numberOfLines={1}>
          Mascot says:{' '}
          <Text style={styles.mascotHighlight}>{mascotComment}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    gap: 10,
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnWrapper: {
    flex: 1,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  potatoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.punchCoral,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 8,
  },
  btnEmoji: {
    fontSize: 24,
  },
  btnTextCol: {
    flex: 1,
  },
  potatoBtnTitle: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
  },
  potatoBtnSub: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.extrabold,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.8,
  },
  gigaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 8,
  },
  gigaBtnTitle: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  gigaBtnSub: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.extrabold,
    color: 'rgba(9, 9, 11, 0.8)',
    letterSpacing: 0.8,
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 6,
  },
  prevBtnDisabled: {
    backgroundColor: THEME.colors.surfaceVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
  prevBtnText: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.inkDark,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 6,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
  },
  mascotToast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    gap: 8,
    marginTop: 2,
  },
  zapIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.tertiaryFixed,
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotToastText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
    flex: 1,
  },
  mascotHighlight: {
    color: THEME.colors.secondary,
  },
});
