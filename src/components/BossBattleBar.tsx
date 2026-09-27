import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Swords, RotateCcw, Award } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { useGamification } from '../context/GamificationContext';

export const BossBattleBar: React.FC = () => {
  const { bossHp, bossMaxHp, isBossDefeated, resetBossBattle } = useGamification();

  const hpPercent = (bossHp / bossMaxHp) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.bossInfo}>
          <Text style={styles.bossEmoji}>{isBossDefeated ? '😵' : '👾'}</Text>
          <View>
            <Text style={styles.bossName}>
              {isBossDefeated ? 'Procrastination Demon Vanquished!' : 'Boss: Procrastination Demon'}
            </Text>
            <Text style={styles.bossSubtitle}>
              {isBossDefeated
                ? 'Great victory! Your focus was legendary!'
                : 'Every "Nailed It" deals -25 HP damage!'}
            </Text>
          </View>
        </View>

        {isBossDefeated ? (
          <TouchableOpacity
            style={styles.fightAgainBtn}
            onPress={resetBossBattle}
            activeOpacity={0.7}
          >
            <RotateCcw size={14} color={THEME.colors.primary} />
            <Text style={styles.fightAgainBtnText}>Fight Again</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.hpBadge}>
            <Swords size={14} color="#DC2626" />
            <Text style={styles.hpBadgeText}>{bossHp} / {bossMaxHp} HP</Text>
          </View>
        )}
      </View>

      {/* HP Bar */}
      <View style={styles.hpTrack}>
        <View
          style={[
            styles.hpFill,
            {
              width: `${hpPercent}%`,
              backgroundColor:
                hpPercent > 50 ? '#EF4444' : hpPercent > 20 ? '#F97316' : '#DC2626',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    padding: 12,
    borderRadius: THEME.radius.lg,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    marginVertical: 4,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bossInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bossEmoji: {
    fontSize: 26,
  },
  bossName: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.bold,
    color: '#9F1239',
  },
  bossSubtitle: {
    fontSize: 11,
    color: '#BE123C',
  },
  hpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
    backgroundColor: '#FFE4E6',
  },
  hpBadgeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: '#BE123C',
  },
  fightAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  fightAgainBtnText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.primary,
  },
  hpTrack: {
    height: 8,
    backgroundColor: '#FECDD3',
    borderRadius: THEME.radius.pill,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    borderRadius: THEME.radius.pill,
  },
});
