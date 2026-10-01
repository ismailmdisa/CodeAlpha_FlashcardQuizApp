import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import Svg, { Ellipse, Circle, Path, Line } from 'react-native-svg';
import {
  Flame,
  Volume2,
  VolumeX,
  PlayCircle,
  Trophy,
  Layers,
  Award,
  BarChart3,
  Zap,
  Sparkles,
  Plus,
} from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { useGamification } from '../context/GamificationContext';
import { useFlashcards } from '../context/FlashcardContext';
import { soundFx } from '../services/soundFx';

interface DashboardScreenProps {
  onStartQuiz: (mode: string) => void;
  onOpenLibrary: () => void;
  onOpenAddCard: () => void;
  onOpenBadges?: () => void;
  onOpenRanks?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartQuiz,
  onOpenLibrary,
  onOpenAddCard,
  onOpenBadges,
  onOpenRanks,
}) => {
  const { currentStreak, bestStreak, xp, soundEnabled, toggleSound } = useGamification();
  const { cards } = useFlashcards();

  const [selectedMode, setSelectedMode] = useState<'quick' | 'mind' | 'random'>('quick');
  const [activeTab, setActiveTab] = useState<'play' | 'decks' | 'badges' | 'ranks'>('play');
  const [mascotBubble, setMascotBubble] = useState<string>('Ready to crush some brains?');

  const startBtnPress = useRef(new Animated.Value(0)).current;
  const mascotBounce = useRef(new Animated.Value(0)).current;

  // Mascot tap reaction
  const handleMascotTap = () => {
    if (soundEnabled) soundFx.playSuccess();
    // Random cheerful quote
    const quotes = [
      'Ready to crush some brains?',
      'Let’s get that high score! ⚡',
      'Knowledge is your superpower! 🧠',
      'Potato brains fear us! 🥔',
      '10/10 incoming! 🚀',
    ];
    const nextQ = quotes[Math.floor(Math.random() * quotes.length)];
    setMascotBubble(nextQ);

    // Wiggle bounce
    Animated.sequence([
      Animated.timing(mascotBounce, {
        toValue: -8,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(mascotBounce, {
        toValue: 0,
        friction: 4,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  // Button 3D Press Animation
  const handleStartPressIn = () => {
    Animated.timing(startBtnPress, {
      toValue: 1,
      duration: 70,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handleStartPressOut = () => {
    Animated.spring(startBtnPress, {
      toValue: 0,
      friction: 5,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const startTranslateY = startBtnPress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const handleLaunchQuiz = () => {
    if (soundEnabled) soundFx.playSuccess();
    onStartQuiz(selectedMode);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <TouchableOpacity
            style={styles.logoBadge}
            onPress={handleMascotTap}
            activeOpacity={0.8}
            aria-label="Mascot Logo"
          >
            <Svg width={28} height={28} viewBox="0 0 100 100">
              <Ellipse cx={50} cy={50} rx={36} ry={34} fill="#6c47ff" />
              <Ellipse cx={40} cy={44} rx={8} ry={9} fill="#ffffff" />
              <Ellipse cx={60} cy={44} rx={8} ry={9} fill="#ffffff" />
              <Circle cx={41} cy={44} r={4.5} fill="#09090b" />
              <Circle cx={59} cy={44} r={4.5} fill="#09090b" />
              <Circle cx={42.5} cy={42} r={1.5} fill="#ffffff" />
              <Circle cx={60.5} cy={42} r={1.5} fill="#ffffff" />
              <Path
                d="M 45 58 Q 50 64 55 58"
                stroke="#09090b"
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="#ff6b8b"
              />
            </Svg>
          </TouchableOpacity>
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>Plopp!</Text>
            <Text style={styles.brandSubtitle}>Play Deck ({cards.length} cards)</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {/* Streak Badge */}
          <View style={styles.streakBadge}>
            <Flame size={18} color={THEME.colors.punchCoral} />
            <Text style={styles.streakText}>{currentStreak || 5}</Text>
          </View>

          {/* Sound Toggle */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={toggleSound}
            aria-label="Toggle sound"
            activeOpacity={0.7}
          >
            {soundEnabled ? (
              <Volume2 size={18} color="#09090b" />
            ) : (
              <VolumeX size={18} color={THEME.colors.textMuted} />
            )}
          </TouchableOpacity>

          {/* Quick Add Button */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onOpenAddCard}
            aria-label="Add new flashcard"
            activeOpacity={0.8}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Giant Hero Lime Card Stage */}
        <View style={styles.heroLimeCard}>
          {/* Background Ambient Circles */}
          <View style={styles.ambientCircleTopLeft} pointerEvents="none" />
          <View style={styles.ambientCircleBottomRight} pointerEvents="none" />

          {/* Top Live Pop Badge */}
          <View style={styles.livePopBadge}>
            <View style={styles.pingDot} />
            <Text style={styles.livePopText}>LIVE POP</Text>
          </View>

          {/* Mascot Speech Bubble */}
          <View style={styles.bubbleWrapper}>
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleAuthor}>Mascot Gloop says:</Text>
              <Text style={styles.bubbleMainText}>{mascotBubble}</Text>
            </View>
            <View style={styles.bubbleTail} />
          </View>

          {/* Interactive Gloop Character Avatar */}
          <Animated.View
            style={[
              styles.mascotAvatarContainer,
              { transform: [{ translateY: mascotBounce }] },
            ]}
          >
            <TouchableOpacity onPress={handleMascotTap} activeOpacity={0.9}>
              <Svg width={180} height={155} viewBox="0 0 200 170">
                {/* Stick Legs & Feet */}
                <Line
                  x1={86}
                  y1={120}
                  x2={84}
                  y2={150}
                  stroke="#09090b"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                />
                <Line
                  x1={114}
                  y1={120}
                  x2={116}
                  y2={150}
                  stroke="#09090b"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                />
                <Ellipse cx={80} cy={153} rx={11} ry={4.5} fill="#09090b" />
                <Ellipse cx={121} cy={153} rx={11} ry={4.5} fill="#09090b" />

                {/* Left Curvy Arm (on hip) */}
                <Path
                  d="M 62 82 C 40 85 45 125 56 118"
                  stroke="#09090b"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Right Curvy Arm (Waving high joyfully) */}
                <Path
                  d="M 138 82 C 160 76 166 48 160 42"
                  stroke="#09090b"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  fill="none"
                />
                <Circle cx={160} cy={42} r={3.5} fill="#09090b" />

                {/* Mascot Body */}
                <Ellipse cx={100} cy={85} rx={44} ry={40} fill="#6c47ff" />
                <Ellipse
                  cx={92}
                  cy={62}
                  rx={24}
                  ry={12}
                  fill="#ffffff"
                  opacity={0.25}
                />

                {/* Eyes */}
                <Ellipse cx={85} cy={78} rx={12} ry={14} fill="#ffffff" />
                <Ellipse cx={115} cy={78} rx={12} ry={14} fill="#ffffff" />
                <Ellipse cx={87} cy={78} rx={6.5} ry={7.5} fill="#09090b" />
                <Circle cx={89} cy={75} r={2.5} fill="#ffffff" />
                <Ellipse cx={117} cy={78} rx={6.5} ry={7.5} fill="#09090b" />
                <Circle cx={119} cy={75} r={2.5} fill="#ffffff" />

                {/* Cheeks */}
                <Ellipse cx={70} cy={92} rx={5} ry={3} fill="#e597ff" opacity={0.7} />
                <Ellipse cx={130} cy={92} rx={5} ry={3} fill="#e597ff" opacity={0.7} />

                {/* Mouth with cute tongue */}
                <Path
                  d="M 92 92 Q 100 102 108 92"
                  stroke="#09090b"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  fill="#7a0026"
                />
                <Path d="M 96 97 Q 100 101 104 97" fill="#ff6b8b" />
              </Svg>
            </TouchableOpacity>
          </Animated.View>

          {/* Hero Titles */}
          <Text style={styles.heroHeadline}>Brain Power Pop</Text>
          <Text style={styles.heroSubtitle}>
            No boring stuff. Just super silly trivia, tap & play!
          </Text>
        </View>

        {/* Section: PICK YOUR VIBE */}
        <View style={styles.vibeSection}>
          <View style={styles.vibeHeaderRow}>
            <Text style={styles.vibeSectionTitle}>PICK YOUR VIBE</Text>
            <View style={styles.bonusChip}>
              <Zap size={13} color={THEME.colors.punchCoral} />
              <Text style={styles.bonusChipText}>+50 XP BONUS</Text>
            </View>
          </View>

          {/* 3 Bouncy Category Pill Buttons */}
          <View style={styles.modeCardsRow}>
            {/* Quick Fire */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === 'quick' && styles.modeCardActive,
              ]}
              onPress={() => {
                setSelectedMode('quick');
                if (soundEnabled) soundFx.playClick();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modeEmoji}>⚡</Text>
              <Text style={styles.modeTitle}>Quick Fire</Text>
              <Text style={styles.modeSubtitle}>60 Secs</Text>
              {selectedMode === 'quick' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            {/* Mind Benders */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === 'mind' && styles.modeCardActive,
              ]}
              onPress={() => {
                setSelectedMode('mind');
                if (soundEnabled) soundFx.playClick();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modeEmoji}>🧠</Text>
              <Text style={styles.modeTitle}>Mind Benders</Text>
              <Text style={styles.modeSubtitle}>Tricky</Text>
              {selectedMode === 'mind' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            {/* Random Fun */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === 'random' && styles.modeCardActive,
              ]}
              onPress={() => {
                setSelectedMode('random');
                if (soundEnabled) soundFx.playClick();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modeEmoji}>🍕</Text>
              <Text style={styles.modeTitle}>Random Fun</Text>
              <Text style={styles.modeSubtitle}>Wildcard</Text>
              {selectedMode === 'random' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Giant 3D Mechanical Start Button */}
        <View style={styles.ctaWrapper}>
          {/* Black Extrusion Shadow Underneath */}
          <View style={styles.ctaShadow} />
          <Animated.View style={{ transform: [{ translateY: startTranslateY }] }}>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={handleLaunchQuiz}
              onPressIn={handleStartPressIn}
              onPressOut={handleStartPressOut}
              activeOpacity={0.9}
              aria-label="Start Quiz Now"
            >
              <PlayCircle size={26} color="#09090b" />
              <Text style={styles.startBtnText}>START QUIZ NOW!</Text>
              <Text style={styles.rocketEmoji}>🚀</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Mini Player Stat Bar */}
        <TouchableOpacity
          style={styles.statPillBar}
          onPress={() => {
            if (soundEnabled) soundFx.playSuccess();
            if (onOpenRanks) onOpenRanks();
          }}
          activeOpacity={0.8}
          aria-label="View Leaderboard Ranks"
        >
          <Flame size={18} color={THEME.colors.punchCoral} />
          <Text style={styles.statPillBold}>{currentStreak || 5} Day Streak</Text>
          <Text style={styles.statPillDot}>•</Text>
          <Trophy size={16} color="#deb400" />
          <Text style={styles.statPillMuted}>
            High Score: <Text style={styles.statPillBold}>{bestStreak * 120 || 980}</Text>
          </Text>
        </TouchableOpacity>

        {/* POPPING RIGHT NOW Social Feed */}
        <View style={styles.socialSection}>
          <View style={styles.socialHeaderRow}>
            <Text style={styles.socialTitle}>POPPING RIGHT NOW</Text>
            <Text style={styles.socialLiveCount}>2.4k live players</Text>
          </View>

          <TouchableOpacity
            style={styles.socialCard}
            onPress={() => {
              if (soundEnabled) soundFx.playClick();
              if (onOpenRanks) onOpenRanks();
            }}
            activeOpacity={0.8}
            aria-label="View live players leaderboard"
          >
            <View style={styles.socialUserGroup}>
              <View style={styles.userAvatarBox}>
                <Text style={styles.avatarEmoji}>🐶</Text>
              </View>
              <View>
                <Text style={styles.socialUserName}>Milo B. just aced Pop #14</Text>
                <Text style={styles.socialUserSub}>Scored 10/10 in 🍕 Random Fun</Text>
              </View>
            </View>
            <View style={styles.xpPill}>
              <Text style={styles.xpPillText}>+120 XP</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom padding so content isn't hidden under floating bar */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNavPill}>
          {/* Play Tab */}
          <TouchableOpacity
            style={[styles.navTab, activeTab === 'play' && styles.navTabActive]}
            onPress={() => {
              setActiveTab('play');
              if (soundEnabled) soundFx.playClick();
            }}
            activeOpacity={0.8}
            aria-label="Play Tab"
          >
            <Sparkles size={18} color="#09090b" />
            <Text style={activeTab === 'play' ? styles.navTabTextActive : styles.navTabText}>Play</Text>
          </TouchableOpacity>

          {/* Decks Tab (Opens Library Modal) */}
          <TouchableOpacity
            style={[styles.navTab, activeTab === 'decks' && styles.navTabActive]}
            onPress={() => {
              setActiveTab('decks');
              if (soundEnabled) soundFx.playClick();
              onOpenLibrary();
            }}
            activeOpacity={0.7}
            aria-label="Decks Library"
          >
            <Layers size={18} color={activeTab === 'decks' ? '#09090b' : '#71717a'} />
            <Text style={activeTab === 'decks' ? styles.navTabTextActive : styles.navTabText}>Decks</Text>
          </TouchableOpacity>

          {/* Badges Tab (Opens Badges Modal) */}
          <TouchableOpacity
            style={[styles.navTab, activeTab === 'badges' && styles.navTabActive]}
            onPress={() => {
              setActiveTab('badges');
              if (soundEnabled) soundFx.playSuccess();
              if (onOpenBadges) onOpenBadges();
            }}
            activeOpacity={0.7}
            aria-label="Badges"
          >
            <Award size={18} color={activeTab === 'badges' ? '#09090b' : '#71717a'} />
            <Text style={activeTab === 'badges' ? styles.navTabTextActive : styles.navTabText}>Badges</Text>
          </TouchableOpacity>

          {/* Ranks Tab (Opens Ranks Modal) */}
          <TouchableOpacity
            style={[styles.navTab, activeTab === 'ranks' && styles.navTabActive]}
            onPress={() => {
              setActiveTab('ranks');
              if (soundEnabled) soundFx.playClick();
              if (onOpenRanks) onOpenRanks();
            }}
            activeOpacity={0.7}
            aria-label="Leaderboard Ranks"
          >
            <BarChart3 size={18} color={activeTab === 'ranks' ? '#09090b' : '#71717a'} />
            <Text style={activeTab === 'ranks' ? styles.navTabTextActive : styles.navTabText}>Ranks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: THEME.colors.background,
    zIndex: 10,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
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
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    lineHeight: 20,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textMuted,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  streakText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 20,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
  },

  // Hero Lime Card
  heroLimeCard: {
    width: '100%',
    backgroundColor: THEME.colors.neonLime,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    padding: 18,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientCircleTopLeft: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  ambientCircleBottomRight: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  livePopBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    zIndex: 10,
  },
  pingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: THEME.colors.punchCoral,
  },
  livePopText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    letterSpacing: 0.5,
  },
  bubbleWrapper: {
    marginTop: 10,
    marginBottom: 4,
    alignItems: 'center',
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    maxWidth: 260,
  },
  bubbleAuthor: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: '#416900',
    marginBottom: 2,
  },
  bubbleMainText: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
    alignSelf: 'center',
    marginTop: -1,
  },
  mascotAvatarContainer: {
    width: 180,
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  heroHeadline: {
    fontSize: 26,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    marginTop: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.semibold,
    color: '#315200',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },

  // Pick your vibe section
  vibeSection: {
    marginTop: 18,
  },
  vibeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  vibeSectionTitle: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  bonusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bonusChipText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.punchCoral,
  },
  modeCardsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#09090b',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    position: 'relative',
  },
  modeCardActive: {
    backgroundColor: THEME.colors.creamSurface,
    borderColor: '#09090b',
    borderWidth: 2.5,
    shadowOffset: { width: 0, height: 5 },
  },
  modeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  modeSubtitle: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 5,
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#09090b',
  },

  // Giant 3D Mechanical CTA
  ctaWrapper: {
    marginTop: 18,
    position: 'relative',
    width: '100%',
  },
  ctaShadow: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    height: 60,
    borderRadius: THEME.radius.full,
    backgroundColor: '#09090b',
  },
  startBtn: {
    height: 60,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2.5,
    borderColor: '#09090b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startBtnText: {
    fontSize: 17,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    letterSpacing: 0.5,
  },
  rocketEmoji: {
    fontSize: 20,
  },

  // Mini Stat Bar
  statPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    alignSelf: 'center',
  },
  statPillBold: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  statPillDot: {
    fontSize: 14,
    color: THEME.colors.textMuted,
  },
  statPillMuted: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },

  // POPPING RIGHT NOW Social Section
  socialSection: {
    marginTop: 20,
  },
  socialHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  socialTitle: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  socialLiveCount: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.secondary,
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  socialUserGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ede9fe',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  socialUserName: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  socialUserSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  xpPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  xpPillText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },

  // Floating Bottom Navigation
  bottomNavContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 40,
  },
  bottomNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: THEME.radius.full,
    padding: 5,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    gap: 4,
  },
  navTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
  },
  navTabActive: {
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  navTabText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.bold,
    color: '#71717a',
  },
  navTabTextActive: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
});
