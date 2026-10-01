import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AppModal } from './AppModal';
import { Award, RotateCcw, Shuffle, X, Star, Flame } from 'lucide-react-native';
import Svg, { Ellipse, Circle, Path, G, Polygon } from 'react-native-svg';
import { THEME } from '../theme/flashcardTheme';

interface PopRoundWinModalProps {
  visible: boolean;
  totalCards: number;
  bestStreak: number;
  xpEarned: number;
  onRestart: () => void;
  onShuffle: () => void;
  onClose: () => void;
}

export const PopRoundWinModal: React.FC<PopRoundWinModalProps> = ({
  visible,
  totalCards,
  bestStreak,
  xpEarned,
  onRestart,
  onShuffle,
  onClose,
}) => {
  return (
    <AppModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color="#09090b" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Celebration Badge Tag */}
            <View style={styles.badgeTag}>
              <Text style={styles.badgeEmoji}>🏆</Text>
              <Text style={styles.badgeText}>QUIZ COMPLETED!</Text>
            </View>

            {/* Mascot Celebrating with Golden Trophy */}
            <View style={styles.trophyMascotContainer}>
              <Svg width={140} height={140} viewBox="0 0 200 200">
                {/* Purple Bean Body */}
                <Ellipse cx={100} cy={104} rx={35} ry={48} fill="#6c47ff" />
                {/* Cheeks */}
                <Ellipse cx={80} cy={107} rx={5} ry={3} fill="#f43f5e" opacity={0.6} />
                <Ellipse cx={120} cy={107} rx={5} ry={3} fill="#f43f5e" opacity={0.6} />
                {/* Eyes */}
                <Circle cx={84} cy={90} r={9} fill="#ffffff" />
                <Circle cx={86} cy={90} r={4.5} fill="#09090b" />
                <Circle cx={88} cy={88} r={1.8} fill="#ffffff" />
                <Circle cx={116} cy={90} r={9} fill="#ffffff" />
                <Circle cx={114} cy={90} r={4.5} fill="#09090b" />
                <Circle cx={116} cy={88} r={1.8} fill="#ffffff" />
                {/* Smile */}
                <Path d="M90 108 Q100 120 110 108 Z" fill="#7a001a" />
                <Path d="M94 114 Q100 119 106 114" fill="#f43f5e" />

                {/* Left arm waving */}
                <Path d="M74 100 Q60 84 52 64" stroke="#09090b" strokeWidth={4.5} strokeLinecap="round" fill="none" />
                {/* Right arm holding trophy */}
                <Path d="M126 102 Q144 94 148 78" stroke="#09090b" strokeWidth={4.5} strokeLinecap="round" fill="none" />

                {/* Golden Trophy Cup */}
                <G transform="translate(136, 42)">
                  <Path d="M2 10 L26 10 C26 26 20 32 14 32 C8 32 2 26 2 10 Z" fill="#fddc30" stroke="#6e5e00" strokeWidth={1.5} />
                  <Path d="M14 32 L14 38 M8 38 L20 38" stroke="#6e5e00" strokeWidth={2.5} strokeLinecap="round" />
                  <Polygon points="14,16 15.6,20.5 20.4,20.6 16.6,23.5 18,28 14,25.2 10,28 11.4,23.5 7.6,20.6 12.4,20.5" fill="#ffffff" />
                </G>
              </Svg>
            </View>

            {/* Hype Headings */}
            <Text style={styles.title}>Brain Power Over 9000! ⚡</Text>
            <Text style={styles.subtitle}>
              Your brain is officially on fire 🔥 You reviewed all {totalCards} cards!
            </Text>

            {/* Giant Scorecard Bento Box */}
            <View style={styles.bentoBox}>
              <View style={styles.bentoHeaderRow}>
                <View>
                  <Text style={styles.bentoLabel}>TOTAL CARDS</Text>
                  <Text style={styles.bentoScore}>{totalCards}</Text>
                </View>

                <View style={styles.rankBadge}>
                  <Text style={styles.rankEmoji}>🧠</Text>
                  <Text style={styles.rankText}>Galaxy Brain</Text>
                </View>
              </View>

              {/* Accuracy Bar with Specular Glint */}
              <View style={styles.accuracySection}>
                <View style={styles.accuracyLabels}>
                  <Text style={styles.accuracyText}>Accuracy: 100%</Text>
                  <Text style={styles.bonusText}>+{bestStreak} Streak Bonus</Text>
                </View>
                <View style={styles.accuracyTrack}>
                  <View style={styles.accuracyFill}>
                    <View style={styles.accuracyGlint} />
                  </View>
                </View>
              </View>

              {/* Mini Bento Stats Grid */}
              <View style={styles.miniStatsGrid}>
                <View style={styles.statTile}>
                  <View style={[styles.statIconBox, { backgroundColor: THEME.colors.tertiaryFixed }]}>
                    <Star size={18} color="#09090b" />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>XP EARNED</Text>
                    <Text style={styles.statValue}>+{xpEarned > 0 ? xpEarned : 150} Fun!</Text>
                  </View>
                </View>

                <View style={styles.statTile}>
                  <View style={[styles.statIconBox, { backgroundColor: '#ffe4e6' }]}>
                    <Flame size={18} color={THEME.colors.punchCoral} />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>BEST STREAK</Text>
                    <Text style={styles.statValue}>{bestStreak} In A Row</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionGroup}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={onRestart}
                aria-label="Play Again"
                activeOpacity={0.85}
              >
                <RotateCcw size={18} color="#ffffff" />
                <Text style={styles.primaryBtnText}>Play Again!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={onShuffle}
                activeOpacity={0.8}
              >
                <Shuffle size={18} color="#09090b" />
                <Text style={styles.secondaryBtnText}>Shuffle & Review</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  modalCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: THEME.colors.creamSurface,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  badgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.secondaryContainer,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    marginBottom: 8,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  trophyMascotContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 19,
  },
  bentoBox: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    padding: 16,
    gap: 12,
    marginVertical: 14,
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  bentoScore: {
    fontSize: 32,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    lineHeight: 34,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  rankEmoji: {
    fontSize: 16,
  },
  rankText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  accuracySection: {
    gap: 6,
  },
  accuracyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
  },
  bonusText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.primary,
  },
  accuracyTrack: {
    height: 12,
    backgroundColor: THEME.colors.surfaceVariant,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#09090b',
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    width: '100%',
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 4,
  },
  accuracyGlint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  miniStatsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: THEME.colors.creamSurface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.textMuted,
  },
  statValue: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  actionGroup: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: '#09090b',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamSurface,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
});
