import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  X,
  Trophy,
  Flame,
  Zap,
  BarChart3,
  Crown,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { useGamification } from '../context/GamificationContext';
import { soundFx } from '../services/soundFx';

interface RanksModalProps {
  visible: boolean;
  onClose: () => void;
}

interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatarEmoji: string;
  xp: number;
  streak: number;
  tierTitle: string;
  isCurrentUser?: boolean;
}

export const RanksModal: React.FC<RanksModalProps> = ({ visible, onClose }) => {
  const { xp, level, levelTitle, nextLevelXp, currentStreak, soundEnabled } = useGamification();
  const [activeTab, setActiveTab] = useState<'BOARD' | 'TIERS'>('BOARD');

  // Dynamic calculation for Current Player
  const userXp = Math.max(xp, 480); // Default friendly floor if fresh install
  const userStreak = Math.max(currentStreak, 5);

  const players: LeaderboardPlayer[] = [
    {
      rank: 1,
      name: 'Alex "Quiz Beast"',
      avatarEmoji: '🦁',
      xp: 3450,
      streak: 18,
      tierTitle: 'Cosmic Polymath',
    },
    {
      rank: 2,
      name: 'Milo B. (Doggo Scholar)',
      avatarEmoji: '🐶',
      xp: 2820,
      streak: 14,
      tierTitle: 'Supreme Quiz Overlord',
    },
    {
      rank: 3,
      name: 'Sophia_Coder',
      avatarEmoji: '👩‍💻',
      xp: 2190,
      streak: 9,
      tierTitle: 'Gigabrain Professor',
    },
    {
      rank: 4,
      name: 'YOU (Quiz Master)',
      avatarEmoji: '🟣',
      xp: userXp,
      streak: userStreak,
      tierTitle: levelTitle || 'Memory Ninja',
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: 'PixelNinja',
      avatarEmoji: '🎮',
      xp: 890,
      streak: 4,
      tierTitle: 'Caffeine Crusader',
    },
    {
      rank: 6,
      name: 'CouchPotato99',
      avatarEmoji: '🥔',
      xp: 620,
      streak: 2,
      tierTitle: 'Novice Crammer',
    },
    {
      rank: 7,
      name: 'PizzaLord',
      avatarEmoji: '🍕',
      xp: 410,
      streak: 1,
      tierTitle: 'Novice Crammer',
    },
    {
      rank: 8,
      name: 'SleepyDev',
      avatarEmoji: '☕',
      xp: 250,
      streak: 1,
      tierTitle: 'Novice Crammer',
    },
  ];

  const brainTiers = [
    {
      tierNum: 1,
      emoji: '🐣',
      name: 'Novice Crammer',
      xpRange: '0 - 200 XP',
      desc: 'Just waking up from potato slumber.',
    },
    {
      tierNum: 2,
      emoji: '☕',
      name: 'Caffeine Crusader',
      xpRange: '201 - 400 XP',
      desc: 'Powered by cold brew and determination.',
    },
    {
      tierNum: 3,
      emoji: '🥷',
      name: 'Memory Ninja',
      xpRange: '401 - 600 XP',
      desc: 'Slicing through flashcards with zero hesitation.',
    },
    {
      tierNum: 4,
      emoji: '🧠',
      name: 'Gigabrain Professor',
      xpRange: '601 - 800 XP',
      desc: 'Encyclopedic recall and towering intellect.',
    },
    {
      tierNum: 5,
      emoji: '👑',
      name: 'Supreme Quiz Overlord',
      xpRange: '801 - 1000 XP',
      desc: 'Ruling over the trivia realm with an iron fist.',
    },
    {
      tierNum: 6,
      emoji: '🌌',
      name: 'Cosmic Polymath',
      xpRange: '1001+ XP',
      desc: 'Transcended physical reality. Pure trivia energy.',
    },
  ];

  const handleTabChange = (tab: 'BOARD' | 'TIERS') => {
    if (soundEnabled) soundFx.playClick();
    setActiveTab(tab);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', bg: '#fef08a', color: '#854d0e' };
    if (rank === 2) return { icon: '🥈', bg: '#e4e4e7', color: '#3f3f46' };
    if (rank === 3) return { icon: '🥉', bg: '#fed7aa', color: '#9a3412' };
    return { icon: `#${rank}`, bg: '#ffffff', color: '#09090b' };
  };

  return (
    <Modal
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
              <View style={styles.crownIconBox}>
                <Crown size={22} color="#09090b" />
              </View>
              <View>
                <Text style={styles.title}>Global Brain Board 👑</Text>
                <Text style={styles.subtitle}>
                  Real-time ploppers & IQ supremacy leaderboard
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              aria-label="Close ranks"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Player Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroAvatarGroup}>
                <View style={styles.heroAvatarBox}>
                  <Text style={styles.heroAvatarText}>🟣</Text>
                </View>
                <View>
                  <View style={styles.heroRankTag}>
                    <Text style={styles.heroRankTagText}>RANK #4 • TOP 5%</Text>
                  </View>
                  <Text style={styles.heroPlayerTitle}>
                    {levelTitle || 'Memory Ninja 🥷'}
                  </Text>
                </View>
              </View>

              <View style={styles.heroStreakPill}>
                <Flame size={16} color={THEME.colors.punchCoral} />
                <Text style={styles.heroStreakText}>{userStreak} Days</Text>
              </View>
            </View>

            {/* Level & XP Progress Bar */}
            <View style={styles.heroProgressSection}>
              <View style={styles.heroProgressTextRow}>
                <Text style={styles.heroLevelText}>Level {level}</Text>
                <Text style={styles.heroXpText}>
                  {userXp} / {nextLevelXp || 600} XP
                </Text>
              </View>
              <View style={styles.heroProgressBarTrack}>
                <View
                  style={[
                    styles.heroProgressBarFill,
                    {
                      width: `${Math.min(
                        ((userXp % 200) / 200) * 100 || 65,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Navigation Sub-Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'BOARD' && styles.tabBtnActive,
              ]}
              onPress={() => handleTabChange('BOARD')}
              activeOpacity={0.8}
            >
              <Trophy
                size={15}
                color={activeTab === 'BOARD' ? '#09090b' : THEME.colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'BOARD' && styles.tabBtnTextActive,
                ]}
              >
                LEADERBOARD
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'TIERS' && styles.tabBtnActive,
              ]}
              onPress={() => handleTabChange('TIERS')}
              activeOpacity={0.8}
            >
              <ShieldCheck
                size={15}
                color={activeTab === 'TIERS' ? '#09090b' : THEME.colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'TIERS' && styles.tabBtnTextActive,
                ]}
              >
                BRAIN TIERS
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content: LEADERBOARD */}
          {activeTab === 'BOARD' && (
            <ScrollView
              style={styles.scrollList}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {players.map((item) => {
                const badge = getRankBadge(item.rank);
                return (
                  <View
                    key={item.name}
                    style={[
                      styles.playerRow,
                      item.isCurrentUser && styles.playerRowCurrent,
                    ]}
                  >
                    {/* Rank Badge */}
                    <View
                      style={[
                        styles.rankBadgeBox,
                        { backgroundColor: badge.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rankBadgeText,
                          { color: badge.color },
                        ]}
                      >
                        {badge.icon}
                      </Text>
                    </View>

                    {/* Avatar Emoji */}
                    <View style={styles.playerAvatar}>
                      <Text style={styles.playerAvatarText}>
                        {item.avatarEmoji}
                      </Text>
                    </View>

                    {/* Player Info */}
                    <View style={styles.playerDetails}>
                      <View style={styles.playerNameRow}>
                        <Text style={styles.playerName}>{item.name}</Text>
                        {item.isCurrentUser && (
                          <View style={styles.youChip}>
                            <Text style={styles.youChipText}>YOU</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.playerTierTitle}>
                        {item.tierTitle}
                      </Text>
                    </View>

                    {/* XP & Streak Stat Group */}
                    <View style={styles.playerStatsCol}>
                      <View style={styles.xpBadge}>
                        <Zap size={11} color={THEME.colors.punchCoral} />
                        <Text style={styles.xpBadgeText}>{item.xp} XP</Text>
                      </View>
                      <View style={styles.streakBadgeMini}>
                        <Flame size={10} color={THEME.colors.punchCoral} />
                        <Text style={styles.streakBadgeMiniText}>
                          {item.streak}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Tab Content: BRAIN TIERS */}
          {activeTab === 'TIERS' && (
            <ScrollView
              style={styles.scrollList}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {brainTiers.map((tier) => {
                const isCurrentTier =
                  tier.name.toLowerCase() ===
                  (levelTitle || '').toLowerCase().replace(/[^a-z ]/g, '').trim();
                return (
                  <View
                    key={tier.tierNum}
                    style={[
                      styles.tierCard,
                      isCurrentTier && styles.tierCardCurrent,
                    ]}
                  >
                    <View style={styles.tierEmojiBox}>
                      <Text style={styles.tierEmojiText}>{tier.emoji}</Text>
                    </View>
                    <View style={styles.tierInfo}>
                      <View style={styles.tierNameRow}>
                        <Text style={styles.tierName}>{tier.name}</Text>
                        {isCurrentTier && (
                          <View style={styles.activeTierChip}>
                            <Text style={styles.activeTierChipText}>CURRENT</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.tierDesc}>{tier.desc}</Text>
                    </View>
                    <View style={styles.tierXpPill}>
                      <Text style={styles.tierXpPillText}>{tier.xpRange}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerMascotMsg}>
              <TrendingUp size={16} color="#4338ca" />
              <Text style={styles.footerMascotText}>
                Study 3 more cards today to gain +60 XP!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.85}
              aria-label="Close leaderboard"
            >
              <Text style={styles.doneBtnText}>Let's Pop!</Text>
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
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 540,
    height: '88%',
    backgroundColor: THEME.colors.creamSurface,
    borderRadius: 28,
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
  crownIconBox: {
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

  // Hero Card
  heroCard: {
    backgroundColor: THEME.colors.neonLime,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#09090b',
    padding: 14,
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroAvatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarText: {
    fontSize: 22,
  },
  heroRankTag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  heroRankTagText: {
    fontSize: 9,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    letterSpacing: 0.5,
  },
  heroPlayerTitle: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  heroStreakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  heroStreakText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  heroProgressSection: {
    marginTop: 10,
  },
  heroProgressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  heroLevelText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  heroXpText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: '#1e3a00',
  },
  heroProgressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
  },
  heroProgressBarFill: {
    height: '100%',
    backgroundColor: '#09090b',
    borderRadius: 4,
  },

  // Sub-Tabs
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    backgroundColor: '#ffffff',
    borderRadius: THEME.radius.full,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  tabBtnActive: {
    backgroundColor: '#09090b',
    borderWidth: 2,
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: THEME.typography.weights.extrabold,
  },

  // Scroll Content
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },

  // Player Row
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 10,
  },
  playerRowCurrent: {
    backgroundColor: '#f5f3ff',
    borderColor: '#6c47ff',
    borderWidth: 2.5,
  },
  rankBadgeBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
  },
  playerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ede9fe',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarText: {
    fontSize: 18,
  },
  playerDetails: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerName: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  youChip: {
    backgroundColor: THEME.colors.neonLime,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#09090b',
  },
  youChipText: {
    fontSize: 9,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  playerTierTitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.weights.medium,
    marginTop: 1,
  },
  playerStatsCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: THEME.colors.creamSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  streakBadgeMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  streakBadgeMiniText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textMuted,
  },

  // Brain Tiers Cards
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 12,
  },
  tierCardCurrent: {
    backgroundColor: THEME.colors.neonLime,
    borderColor: '#09090b',
  },
  tierEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f4f4f5',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierEmojiText: {
    fontSize: 22,
  },
  tierInfo: {
    flex: 1,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierName: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  activeTierChip: {
    backgroundColor: '#09090b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  activeTierChipText: {
    fontSize: 8,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
  },
  tierDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
    marginTop: 2,
  },
  tierXpPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  tierXpPillText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
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
