import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Path, Ellipse, Circle } from 'react-native-svg';
import { THEME } from '../theme/flashcardTheme';
import { soundFx } from '../services/soundFx';

interface MascotCharacterProps {
  bubbleText?: string;
  bubbleEmoji?: string;
  onPress?: () => void;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  bubbleText = 'THINK HARD!',
  bubbleEmoji = '⚡',
  onPress,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;

  // Gentle breathing float animation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  // Pop animation on bubble text change
  useEffect(() => {
    bubbleScale.setValue(0.8);
    Animated.spring(bubbleScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [bubbleText, bubbleScale]);

  const handleTap = () => {
    soundFx.playFlip();
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
    if (onPress) onPress();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.mascotWrapper,
          {
            transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Floating Speech Bubble */}
        <Animated.View
          style={[
            styles.bubbleContainer,
            { transform: [{ scale: bubbleScale }, { rotate: '5deg' }] },
          ]}
        >
          <Text style={styles.bubbleText}>
            {bubbleText} {bubbleEmoji}
          </Text>
        </Animated.View>

        {/* Mascot SVG Vector */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleTap}>
          <Svg width={100} height={100} viewBox="0 0 100 100">
            {/* Stick Arms */}
            <Path
              d="M28 48 C 16 42, 12 30, 20 22"
              fill="none"
              stroke="#09090b"
              strokeLinecap="round"
              strokeWidth="3.5"
            />
            <Path
              d="M72 48 C 84 42, 88 30, 80 22"
              fill="none"
              stroke="#09090b"
              strokeLinecap="round"
              strokeWidth="3.5"
            />

            {/* Stick Legs */}
            <Path
              d="M38 78 L 38 92"
              stroke="#09090b"
              strokeLinecap="round"
              strokeWidth="3.5"
            />
            <Path
              d="M62 78 L 62 92"
              stroke="#09090b"
              strokeLinecap="round"
              strokeWidth="3.5"
            />

            {/* Purple Blob Body */}
            <Ellipse
              cx={50}
              cy={52}
              rx={30}
              ry={36}
              fill="#6c47ff"
              stroke="#09090b"
              strokeWidth={3}
            />

            {/* Left Eye White & Pupil */}
            <Ellipse
              cx={40}
              cy={44}
              rx={7}
              ry={8}
              fill="#ffffff"
              stroke="#09090b"
              strokeWidth={2}
            />
            <Circle cx={41.5} cy={44} r={3.5} fill="#09090b" />
            <Circle cx={43} cy={42} r={1.2} fill="#ffffff" />

            {/* Right Eye White & Pupil */}
            <Ellipse
              cx={60}
              cy={44}
              rx={7}
              ry={8}
              fill="#ffffff"
              stroke="#09090b"
              strokeWidth={2}
            />
            <Circle cx={58.5} cy={44} r={3.5} fill="#09090b" />
            <Circle cx={60} cy={42} r={1.2} fill="#ffffff" />

            {/* Rosy Cheeks */}
            <Ellipse
              cx={32}
              cy={56}
              rx={4}
              ry={2.5}
              fill="#ff8fab"
              opacity={0.8}
            />
            <Ellipse
              cx={68}
              cy={56}
              rx={4}
              ry={2.5}
              fill="#ff8fab"
              opacity={0.8}
            />

            {/* Cute Open Mouth with Smile */}
            <Path
              d="M44 56 Q 50 63, 56 56 Z"
              fill="#ba1a1a"
              stroke="#09090b"
              strokeWidth="1.8"
            />
            <Path
              d="M47 58 Q 50 60, 53 58"
              fill="none"
              stroke="#ffdad6"
              strokeWidth="1.5"
            />
          </Svg>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 110,
    marginTop: 6,
    marginBottom: -8,
    zIndex: 20,
  },
  mascotWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  bubbleContainer: {
    position: 'absolute',
    top: -14,
    right: -48,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    zIndex: 30,
  },
  bubbleText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
