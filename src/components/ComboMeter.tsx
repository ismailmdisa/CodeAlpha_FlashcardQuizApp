import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import {
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Award,
} from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { useGamification } from '../context/GamificationContext';

export const ComboMeter: React.FC = () => {
  const {
    xp,
    level,
    levelTitle,
    currentLevelProgress,
    currentStreak,
    soundEnabled,
    toggleSound,
  } = useGamification();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse effect when streak is high
  useEffect(() => {
    if (currentStreak >= 3) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [currentStreak, pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Level & XP Strip */}
      <View style={styles.levelSection}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>Lv.{level}</Text>
        </View>

        <View style={styles.xpInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.levelTitleText}>{levelTitle}</Text>
            <Text style={styles.xpText}>{xp} XP</Text>
          </View>

          {/* Mini XP bar */}
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${currentLevelProgress}%` }]} />
          </View>
        </View>
      </View>

      {/* Right Controls: Combo Flame + Sound Toggle */}
      <View style={styles.rightGroup}>
        {/* Streak Flame Badge */}
        {currentStreak > 0 ? (
          <Animated.View
            style={[
              styles.streakBadge,
              currentStreak >= 3 && styles.highStreakBadge,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Flame
              size={16}
              color={currentStreak >= 3 ? '#FF6B00' : THEME.colors.warning}
            />
            <Text
              style={[
                styles.streakText,
                currentStreak >= 3 && styles.highStreakText,
              ]}
            >
              {currentStreak >= 3
                ? `${currentStreak}x COMBO!`
                : `${currentStreak} streak`}
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.idleBadge}>
            <Zap size={14} color={THEME.colors.textMuted} />
            <Text style={styles.idleText}>Ready</Text>
          </View>
        )}

        {/* Sound FX Toggle */}
        <TouchableOpacity
          style={styles.soundBtn}
          onPress={toggleSound}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {soundEnabled ? (
            <Volume2 size={16} color={THEME.colors.primary} />
          ) : (
            <VolumeX size={16} color={THEME.colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginVertical: 4,
    gap: 12,
  },
  levelSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.primaryLight,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
  },
  xpInfo: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelTitleText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  xpText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
  },
  xpTrack: {
    height: 4,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.pill,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.pill,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.warningLight,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  highStreakBadge: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  streakText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: '#D97706',
  },
  highStreakText: {
    color: '#EA580C',
  },
  idleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  idleText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  soundBtn: {
    padding: 6,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
});
