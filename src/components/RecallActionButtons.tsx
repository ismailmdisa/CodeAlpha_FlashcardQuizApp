import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Skull, HelpCircle, CheckCircle2, Zap } from 'lucide-react-native';
import { MasteryRating } from '../services/mascotReactions';
import { THEME } from '../theme/flashcardTheme';

interface RecallActionButtonsProps {
  onRate: (rating: MasteryRating) => void;
}

export const RecallActionButtons: React.FC<RecallActionButtonsProps> = ({ onRate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.promptLabel}>How well did you know this?</Text>

      <View style={styles.buttonsRow}>
        {/* Blanked / Failed */}
        <TouchableOpacity
          style={[styles.btn, styles.blankedBtn]}
          onPress={() => onRate('BLANKED')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnEmoji}>💀</Text>
          <View style={styles.btnTextCol}>
            <Text style={[styles.btnTitle, styles.blankedTitle]}>Blanked</Text>
            <Text style={styles.btnXp}>+5 XP</Text>
          </View>
        </TouchableOpacity>

        {/* Kinda Knew / Halfway */}
        <TouchableOpacity
          style={[styles.btn, styles.kindaBtn]}
          onPress={() => onRate('KINDA_KNEW')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnEmoji}>🤔</Text>
          <View style={styles.btnTextCol}>
            <Text style={[styles.btnTitle, styles.kindaTitle]}>Kinda Knew</Text>
            <Text style={styles.btnXp}>+25 XP</Text>
          </View>
        </TouchableOpacity>

        {/* Nailed It / Mastered */}
        <TouchableOpacity
          style={[styles.btn, styles.nailedBtn]}
          onPress={() => onRate('NAILED_IT')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnEmoji}>🧠</Text>
          <View style={styles.btnTextCol}>
            <Text style={[styles.btnTitle, styles.nailedTitle]}>Nailed It!</Text>
            <Text style={[styles.btnXp, styles.nailedXp]}>+50 XP</Text>
          </View>
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
    paddingVertical: 10,
    gap: 8,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.lg,
    borderWidth: 1.5,
    backgroundColor: THEME.colors.surface,
  },
  btnEmoji: {
    fontSize: 20,
  },
  btnTextCol: {
    alignItems: 'flex-start',
  },
  btnTitle: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.bold,
  },
  btnXp: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textMuted,
  },
  blankedBtn: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  blankedTitle: {
    color: '#DC2626',
  },
  kindaBtn: {
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  kindaTitle: {
    color: '#D97706',
  },
  nailedBtn: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  nailedTitle: {
    color: '#059669',
  },
  nailedXp: {
    color: '#059669',
  },
});
