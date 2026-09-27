import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';

const CONFETTI_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
const PARTICLE_COUNT = 30;

export const ConfettiExplosion: React.FC = () => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 360,
      y: -Math.random() * 450 - 50,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.random() * 8 + 6,
      rotate: Math.random() * 360,
      anim: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const animations = particles.map((p) =>
      Animated.timing(p.anim, {
        toValue: 1,
        duration: 1200 + Math.random() * 800,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, [particles]);

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {particles.map((p) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, p.y, p.y + 700],
        });
        const translateX = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.x],
        });
        const opacity = p.anim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 1, 0],
        });
        const rotation = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${p.rotate * 3}deg`],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size * 1.4,
                backgroundColor: p.color,
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { rotate: rotation },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    zIndex: 9999,
  },
  particle: {
    position: 'absolute',
    borderRadius: 2,
  },
});
