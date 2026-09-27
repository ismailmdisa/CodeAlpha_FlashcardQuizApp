import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Timer, AlertCircle } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { soundFx } from '../services/soundFx';

interface SpeedRunTimerProps {
  cardIndex: number;
  isFlipped: boolean;
  onTimeUp: () => void;
  soundEnabled: boolean;
}

const DURATION_SEC = 15;

export const SpeedRunTimer: React.FC<SpeedRunTimerProps> = ({
  cardIndex,
  isFlipped,
  onTimeUp,
  soundEnabled,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(DURATION_SEC);

  // Reset timer on new card
  useEffect(() => {
    setTimeLeft(DURATION_SEC);
  }, [cardIndex]);

  // Countdown timer while on front of card
  useEffect(() => {
    if (isFlipped) return; // Stop counting once answer is revealed

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        if (prev <= 5 && soundEnabled) {
          soundFx.playFlip(); // soft tick sound
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFlipped, cardIndex, onTimeUp, soundEnabled]);

  const progressPercent = (timeLeft / DURATION_SEC) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <View style={styles.leftLabel}>
          <Timer size={14} color={isUrgent ? '#DC2626' : '#D97706'} />
          <Text style={[styles.timerTitle, isUrgent && styles.urgentText]}>
            {isUrgent ? 'Hurry up! Clock ticking!' : 'Speed Recall Challenge'}
          </Text>
        </View>

        <Text style={[styles.secondsText, isUrgent && styles.urgentText]}>
          {timeLeft}s
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${progressPercent}%`,
              backgroundColor: isUrgent ? '#DC2626' : '#F59E0B',
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
    padding: 10,
    borderRadius: THEME.radius.lg,
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginVertical: 4,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerTitle: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.semibold,
    color: '#92400E',
  },
  secondsText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.bold,
    color: '#92400E',
  },
  urgentText: {
    color: '#DC2626',
  },
  track: {
    height: 6,
    backgroundColor: '#FDE68A',
    borderRadius: THEME.radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: THEME.radius.pill,
  },
});
