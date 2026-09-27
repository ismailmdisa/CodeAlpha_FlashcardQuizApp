import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  Flame,
  Plus,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react-native';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';
import { THEME } from '../theme/flashcardTheme';

interface PopHeaderProps {
  currentIndex: number;
  totalCards: number;
  currentStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAddModal: () => void;
  onOpenLibrary: () => void;
  onRestartDeck: () => void;
}

export const PopHeader: React.FC<PopHeaderProps> = ({
  currentIndex,
  totalCards,
  currentStreak,
  soundEnabled,
  onToggleSound,
  onOpenAddModal,
  onOpenLibrary,
  onRestartDeck,
}) => {
  // Generate up to 5 progress dots
  const maxDots = Math.min(5, Math.max(totalCards, 1));
  const activeDotIndex = totalCards > 0 ? Math.floor((currentIndex / totalCards) * maxDots) : 0;

  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.topNavbar}>
        {/* Left: Mini Mascot Avatar & Title */}
        <View style={styles.brandRow}>
          <TouchableOpacity
            style={styles.miniMascotBadge}
            onPress={onRestartDeck}
            activeOpacity={0.8}
          >
            <Svg width={26} height={26} viewBox="0 0 100 100">
              <Ellipse cx={50} cy={50} rx={36} ry={34} fill="#6c47ff" />
              <Ellipse cx={40} cy={44} rx={8} ry={9} fill="#ffffff" />
              <Ellipse cx={60} cy={44} rx={8} ry={9} fill="#ffffff" />
              <Circle cx={41} cy={44} r={4.5} fill="#09090b" />
              <Circle cx={59} cy={44} r={4.5} fill="#09090b" />
              <Path d="M 45 58 Q 50 64 55 58" stroke="#09090b" strokeWidth={2.5} strokeLinecap="round" fill="#ff6b8b" />
            </Svg>
          </TouchableOpacity>

          <View>
            <Text style={styles.titleText}>Active Quiz Session</Text>
            <Text style={styles.subtitleText}>Pop Flashcard Study</Text>
          </View>
        </View>

        {/* Right: Streak Pill, Sound & Actions */}
        <View style={styles.actionRow}>
          {/* Streak Flame Pill */}
          <View style={styles.streakPill}>
            <Flame size={16} color={THEME.colors.punchCoral} />
            <Text style={styles.streakCount}>{currentStreak}</Text>
          </View>

          {/* Sound Toggle */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onToggleSound}
            activeOpacity={0.7}
          >
            {soundEnabled ? (
              <Volume2 size={16} color="#09090b" />
            ) : (
              <VolumeX size={16} color={THEME.colors.textMuted} />
            )}
          </TouchableOpacity>

          {/* Library Modal */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenLibrary}
            activeOpacity={0.7}
          >
            <Layers size={16} color="#09090b" />
          </TouchableOpacity>

          {/* Add Card Button */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onOpenAddModal}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tactile Progress Indicator Bar */}
      <View style={styles.progressRow}>
        {/* Tactile Dots Pill */}
        <View style={styles.dotsPill}>
          {Array.from({ length: maxDots }).map((_, idx) => {
            const isCompleted = idx < activeDotIndex;
            const isCurrent = idx === activeDotIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isCurrent && styles.dotCurrent,
                ]}
              />
            );
          })}
        </View>

        {/* Card X of Y Pill with 3D shadow */}
        <View style={styles.cardCountPill}>
          <Text style={styles.cardCountText}>
            CARD {totalCards > 0 ? currentIndex + 1 : 0} OF {totalCards}
          </Text>
          <Sparkles size={13} color="#09090b" />
        </View>
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
    paddingTop: 4,
  },
  topNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniMascotBadge: {
    width: 38,
    height: 38,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 2,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 1.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  streakCount: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: '#09090b',
    borderWidth: 1.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: '#ffffff',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  dotsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 1.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.surfaceVariant,
  },
  dotCompleted: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  dotCurrent: {
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  cardCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.tertiaryFixed,
    borderWidth: 1.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  cardCountText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    letterSpacing: 0.5,
  },
});
