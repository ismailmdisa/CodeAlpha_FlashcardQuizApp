import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { AppModal } from './AppModal';
import {
  X,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Flame,
  Trophy,
} from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { useGamification } from '../context/GamificationContext';
import { useFlashcards } from '../context/FlashcardContext';
import { soundFx } from '../services/soundFx';

interface BadgesModalProps {
  visible: boolean;
  onClose: () => void;
}

interface BadgeItem {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  requirement: string;
  rewardXp: number;
  unlocked: boolean;
  progressText: string;
  progressPercent: number;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ visible, onClose }) => {
  const { xp, currentStreak, bestStreak, soundEnabled } = useGamification();
  const { cards } = useFlashcards();
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // Dynamic Badge Calculation based on live player state
  const badges: BadgeItem[] = [
    {
      id: 'potato_no_more',
      emoji: '🥔',
      title: 'Potato No More',
      tagline: 'Even spuds can become astronauts.',
      requirement: 'Answer your first flashcard study question',
      rewardXp: 50,
      unlocked: xp > 0 || bestStreak > 0,
      progressText: xp > 0 || bestStreak > 0 ? 'Completed!' : '0/1 card',
      progressPercent: xp > 0 || bestStreak > 0 ? 100 : 0,
    },
    {
      id: 'speed_demon',
      emoji: '⚡',
      title: 'Quick Reflexes',
      tagline: 'Fast fingers, faster brain synapses.',
      requirement: 'Complete a quick-fire recall challenge',
      rewardXp: 75,
      unlocked: true,
      progressText: 'Completed!',
      progressPercent: 100,
    },
    {
      id: 'streak_sorcerer',
      emoji: '🔥',
      title: 'Streak Sorcerer',
      tagline: 'Consistency is your greatest superpower.',
      requirement: 'Reach a 5-day continuous study streak',
      rewardXp: 120,
      unlocked: currentStreak >= 5 || bestStreak >= 5,
      progressText: `${Math.min(bestStreak || currentStreak || 1, 5)}/5 Days`,
      progressPercent: Math.min(((bestStreak || currentStreak || 1) / 5) * 100, 100),
    },
    {
      id: 'gigachad_master',
      emoji: '🗿',
      title: 'Certified Gigachad',
      tagline: 'Jawline sharpened by relentless knowledge.',
      requirement: 'Rate yourself "Gigachad" on 5 cards without missing',
      rewardXp: 150,
      unlocked: bestStreak >= 5,
      progressText: `${Math.min(bestStreak, 5)}/5 Correct`,
      progressPercent: Math.min((bestStreak / 5) * 100, 100),
    },
    {
      id: 'deck_builder',
      emoji: '📚',
      title: 'Deck Architect',
      tagline: 'Crafting custom trivia for elite minds.',
      requirement: 'Create your own custom flashcard in the library',
      rewardXp: 100,
      unlocked: cards.length > 6,
      progressText: cards.length > 6 ? 'Completed!' : `${cards.length}/7 Cards`,
      progressPercent: cards.length > 6 ? 100 : Math.min((cards.length / 7) * 100, 100),
    },
    {
      id: 'galaxy_brain',
      emoji: '🧠',
      title: 'Galaxy Brain',
      tagline: 'Your cerebral cortex is entering the 4th dimension.',
      requirement: 'Accumulate 500+ total player XP',
      rewardXp: 200,
      unlocked: xp >= 500,
      progressText: `${Math.min(xp, 500)}/500 XP`,
      progressPercent: Math.min((xp / 500) * 100, 100),
    },
    {
      id: 'pizza_craver',
      emoji: '🍕',
      title: 'Midnight Craver',
      tagline: 'Powered by carbs, snacks, and insatiable curiosity.',
      requirement: 'Study 10 cards in a single study session',
      rewardXp: 120,
      unlocked: xp >= 250,
      progressText: xp >= 250 ? 'Completed!' : `${Math.min(xp, 250)}/250 XP`,
      progressPercent: Math.min((xp / 250) * 100, 100),
    },
    {
      id: 'trivia_monarch',
      emoji: '👑',
      title: 'Supreme Plopper',
      tagline: 'All hail the undisputed king of flashcard chaos!',
      requirement: 'Reach 1,000 XP and dominate the leaderboard',
      rewardXp: 500,
      unlocked: xp >= 1000,
      progressText: `${Math.min(xp, 1000)}/1000 XP`,
      progressPercent: Math.min((xp / 1000) * 100, 100),
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const filteredBadges = badges.filter((b) => {
    if (filter === 'UNLOCKED') return b.unlocked;
    if (filter === 'LOCKED') return !b.unlocked;
    return true;
  });

  const handleSelectBadge = (badge: BadgeItem) => {
    if (soundEnabled) {
      if (badge.unlocked) soundFx.playSuccess();
      else soundFx.playClick();
    }
    setSelectedBadge(badge);
  };

  return (
    <AppModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.trophyIconBox}>
                <Award size={22} color="#09090b" />
              </View>
              <View>
                <Text style={styles.title}>Trophy Cabinet 🏆</Text>
                <Text style={styles.subtitle}>
                  Collect silly badges & flex your brain power!
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              aria-label="Close badges"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Player Unlocks Ribbon */}
          <View style={styles.ribbonCard}>
            <View style={styles.ribbonStat}>
              <Text style={styles.ribbonValue}>
                {unlockedCount} / {badges.length}
              </Text>
              <Text style={styles.ribbonLabel}>BADGES EARNED</Text>
            </View>
            <View style={styles.ribbonDivider} />
            <View style={styles.ribbonStat}>
              <View style={styles.xpRow}>
                <Sparkles size={16} color={THEME.colors.punchCoral} />
                <Text style={styles.ribbonValue}>+{unlockedCount * 75} XP</Text>
              </View>
              <Text style={styles.ribbonLabel}>TROPHY BONUS</Text>
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map((tab) => {
              const isActive = filter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => {
                    if (soundEnabled) soundFx.playClick();
                    setFilter(tab);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {tab === 'ALL'
                      ? `ALL (${badges.length})`
                      : tab === 'UNLOCKED'
                      ? `UNLOCKED (${unlockedCount})`
                      : `LOCKED (${badges.length - unlockedCount})`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Badge Detail Inspection Callout if selected */}
          {selectedBadge && (
            <View style={styles.detailCallout}>
              <View style={styles.calloutHeader}>
                <Text style={styles.calloutEmoji}>{selectedBadge.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.calloutTitle}>{selectedBadge.title}</Text>
                  <Text style={styles.calloutTagline}>
                    "{selectedBadge.tagline}"
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    selectedBadge.unlocked
                      ? styles.statusUnlocked
                      : styles.statusLocked,
                  ]}
                >
                  <Text style={styles.statusPillText}>
                    {selectedBadge.unlocked ? 'UNLOCKED ✨' : 'IN PROGRESS'}
                  </Text>
                </View>
              </View>
              <Text style={styles.calloutReq}>
                🎯 Requirement: {selectedBadge.requirement}
              </Text>
            </View>
          )}

          {/* Scrollable Badges Grid/List */}
          <ScrollView
            style={styles.badgesScrollView}
            contentContainerStyle={styles.badgesScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredBadges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  badge.unlocked && styles.badgeCardUnlocked,
                  selectedBadge?.id === badge.id && styles.badgeCardSelected,
                ]}
                onPress={() => handleSelectBadge(badge)}
                activeOpacity={0.85}
              >
                {/* Emoji Icon Container */}
                <View
                  style={[
                    styles.badgeIconBox,
                    badge.unlocked
                      ? styles.badgeIconUnlocked
                      : styles.badgeIconLocked,
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  {badge.unlocked ? (
                    <View style={styles.checkBadgeMini}>
                      <CheckCircle2 size={12} color="#ffffff" />
                    </View>
                  ) : (
                    <View style={styles.lockBadgeMini}>
                      <Lock size={10} color="#ffffff" />
                    </View>
                  )}
                </View>

                {/* Badge Details */}
                <View style={styles.badgeInfo}>
                  <View style={styles.badgeNameRow}>
                    <Text style={styles.badgeTitle}>{badge.title}</Text>
                    <View style={styles.rewardChip}>
                      <Zap size={11} color={THEME.colors.punchCoral} />
                      <Text style={styles.rewardChipText}>
                        +{badge.rewardXp} XP
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.badgeTagline} numberOfLines={1}>
                    {badge.tagline}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${badge.progressPercent}%`,
                            backgroundColor: badge.unlocked
                              ? THEME.colors.neonLime
                              : THEME.colors.punchCoral,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressLabel}>
                      {badge.progressText}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerMascotMsg}>
              <Text style={styles.footerMascotEmoji}>🟣</Text>
              <Text style={styles.footerMascotText}>
                Gloop says: Unlock all 8 to become a Cosmic Legend!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.85}
              aria-label="Close badges cabinet"
            >
              <Text style={styles.doneBtnText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  content: {
    width: '100%',
    height: '92%',
    backgroundColor: THEME.colors.creamSurface,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#09090b',
    backgroundColor: '#ffffff',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.weights.medium,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  // Ribbon
  ribbonCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#09090b',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  ribbonStat: {
    alignItems: 'center',
  },
  ribbonValue: {
    fontSize: 17,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  ribbonLabel: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  ribbonDivider: {
    width: 2,
    height: 28,
    backgroundColor: '#09090b',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2,
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textMuted,
  },
  filterChipTextActive: {
    color: '#09090b',
    fontWeight: THEME.typography.weights.extrabold,
  },

  // Callout
  detailCallout: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#09090b',
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calloutEmoji: {
    fontSize: 26,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  calloutTagline: {
    fontSize: 12,
    color: '#4338ca',
    fontWeight: THEME.typography.weights.semibold,
    fontStyle: 'italic',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  statusUnlocked: {
    backgroundColor: THEME.colors.neonLime,
  },
  statusLocked: {
    backgroundColor: '#ffffff',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  calloutReq: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.medium,
    color: '#1e1b4b',
    marginTop: 6,
  },

  // Badges Scroll View
  badgesScrollView: {
    flex: 1,
  },
  badgesScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 10,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 12,
  },
  badgeCardUnlocked: {
    backgroundColor: '#fcfffa',
    borderColor: '#09090b',
  },
  badgeCardSelected: {
    borderColor: '#6c47ff',
    borderWidth: 2.5,
    backgroundColor: '#f5f3ff',
  },
  badgeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#09090b',
    position: 'relative',
  },
  badgeIconUnlocked: {
    backgroundColor: THEME.colors.neonLime,
  },
  badgeIconLocked: {
    backgroundColor: '#e4e4e7',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  checkBadgeMini: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#16a34a',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeMini: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#71717a',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  rewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: THEME.colors.creamSurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#09090b',
  },
  rewardChipText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  badgeTagline: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.weights.medium,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e4e4e7',
    borderWidth: 1,
    borderColor: '#09090b',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
    minWidth: 70,
    textAlign: 'right',
  },

  // Footer
  footer: {
    padding: 14,
    borderTopWidth: 2,
    borderTopColor: '#09090b',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerMascotMsg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerMascotEmoji: {
    fontSize: 18,
  },
  footerMascotText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: '#4338ca',
  },
  doneBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
});
