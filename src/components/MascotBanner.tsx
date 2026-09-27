import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { X, Sparkles, Flame, Coffee, Skull, Zap } from 'lucide-react-native';
import { MascotReaction } from '../services/mascotReactions';
import { THEME } from '../theme/flashcardTheme';

interface MascotBannerProps {
  reaction: MascotReaction | null;
  onDismiss: () => void;
}

export const MascotBanner: React.FC<MascotBannerProps> = ({ reaction, onDismiss }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reaction) {
      scaleAnim.setValue(0.9);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [reaction, scaleAnim]);

  if (!reaction) return null;

  const getThemeColors = () => {
    switch (reaction.mood) {
      case 'fire':
        return {
          bg: '#FFF7ED',
          border: '#FDBA74',
          accent: '#EA580C',
        };
      case 'roast':
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          accent: '#DC2626',
        };
      case 'chill':
        return {
          bg: '#F0FDFA',
          border: '#99F6E4',
          accent: '#0D9488',
        };
      case 'hype':
      default:
        return {
          bg: '#EEF2FF',
          border: '#C7D2FE',
          accent: '#4F46E5',
        };
    }
  };

  const currentTheme = getThemeColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.bg,
          borderColor: currentTheme.border,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.leftIconContainer}>
        <Text style={styles.mascotEmoji}>{reaction.emoji}</Text>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.reactionTitle, { color: currentTheme.accent }]}>
            {reaction.title}
          </Text>
        </View>
        <Text style={styles.reactionComment}>{reaction.comment}</Text>
      </View>

      <TouchableOpacity
        onPress={onDismiss}
        style={styles.closeBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={16} color={THEME.colors.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: THEME.radius.lg,
    borderWidth: 1.5,
    marginVertical: 6,
    gap: 12,
    ...THEME.shadows.card,
  },
  leftIconContainer: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  mascotEmoji: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionTitle: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    letterSpacing: 0.5,
  },
  reactionComment: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    fontWeight: THEME.typography.weights.medium,
  },
  closeBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
});
