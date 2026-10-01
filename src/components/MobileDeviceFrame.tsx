import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Wifi, Battery, Sparkles } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  // Keep a clean digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      // 12-hour or standard clean clock
      hours = hours % 12 || 12;
      const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setCurrentTime(`${hours}:${minStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // On native mobile or small screens (< 500px), render edge-to-edge native view
  const isDesktopWeb = Platform.OS === 'web' && width > 500;

  if (!isDesktopWeb) {
    return <View style={styles.nativeFullView}>{children}</View>;
  }

  // Calculate dynamic device chassis dimensions
  const frameHeight = Math.min(height - 48, 880);
  const frameWidth = 414; // Standard modern mobile width (iPhone 16 / Pixel)

  return (
    <View style={styles.desktopCanvas}>
      {/* Studio Top Floating Info Bar */}
      <View style={styles.topInfoBar}>
        <View style={styles.infoBadge}>
          <Sparkles size={13} color={THEME.colors.neonLime} />
          <Text style={styles.infoBadgeText}>
            CodeAlpha • React Native Mobile App Preview
          </Text>
        </View>
        <Text style={styles.infoSubtext}>
          📱 Running in simulated Mobile Device Frame (Auto-responsive on actual phones)
        </Text>
      </View>

      {/* Outer Phone Shell Wrapper (Holds side buttons & 3D shadow) */}
      <View style={[styles.phoneShell, { width: frameWidth, height: frameHeight }]}>
        {/* Left Physical Buttons (Mute / Action & Volume) */}
        <View style={[styles.sideButton, styles.actionButton]} />
        <View style={[styles.sideButton, styles.volUpButton]} />
        <View style={[styles.sideButton, styles.volDownButton]} />

        {/* Right Physical Button (Power / Lock) */}
        <View style={[styles.sideButton, styles.powerButton]} />

        {/* Main Phone Body (Titanium Bezel) */}
        <View style={styles.phoneBody}>
          {/* Inner Screen Container */}
          <View style={styles.screenContainer}>
            {/* Native Mobile Status Bar */}
            <View style={styles.statusBar}>
              {/* Left Clock */}
              <Text style={styles.statusTime}>{currentTime}</Text>

              {/* Center Dynamic Island */}
              <View style={styles.dynamicIsland}>
                <View style={styles.cameraLens} />
                <View style={styles.sensorDot} />
              </View>

              {/* Right System Icons */}
              <View style={styles.statusIcons}>
                <View style={styles.signalBars}>
                  <View style={[styles.signalBar, { height: 4 }]} />
                  <View style={[styles.signalBar, { height: 6 }]} />
                  <View style={[styles.signalBar, { height: 8 }]} />
                  <View style={[styles.signalBar, { height: 10 }]} />
                </View>
                <Wifi size={13} color="#09090b" strokeWidth={2.5} />
                <View style={styles.batteryContainer}>
                  <Battery size={16} color="#09090b" strokeWidth={2.5} />
                  <View style={styles.batteryFill} />
                </View>
              </View>
            </View>

            {/* App Render Area */}
            <View style={styles.appViewport}>{children}</View>

            {/* Bottom Home Indicator Swipe Bar */}
            <View style={styles.homeIndicatorWrapper} pointerEvents="none">
              <View style={styles.homeIndicatorBar} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeFullView: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  desktopCanvas: {
    flex: 1,
    backgroundColor: '#18181b', // Ultra-sleek dark studio desk
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  topInfoBar: {
    alignItems: 'center',
    marginBottom: 12,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  infoBadgeText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
    letterSpacing: 0.4,
  },
  infoSubtext: {
    fontSize: 10,
    color: '#a1a1aa',
    marginTop: 4,
    fontWeight: THEME.typography.weights.medium,
  },

  // Outer Phone Shell
  phoneShell: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.55,
    shadowRadius: 35,
    elevation: 25,
  },

  // Side Physical Buttons
  sideButton: {
    position: 'absolute',
    backgroundColor: '#3f3f46',
    borderRadius: 2,
    zIndex: 1,
  },
  actionButton: {
    left: -3,
    top: 110,
    width: 3.5,
    height: 24,
  },
  volUpButton: {
    left: -3,
    top: 148,
    width: 3.5,
    height: 48,
  },
  volDownButton: {
    left: -3,
    top: 206,
    width: 3.5,
    height: 48,
  },
  powerButton: {
    right: -3,
    top: 160,
    width: 3.5,
    height: 64,
  },

  // Phone Chassis Body
  phoneBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#27272a', // Titanium metal chassis
    borderRadius: 50,
    padding: 10, // Outer bezel thickness
    borderWidth: 1.5,
    borderColor: '#52525b',
  },

  // Inner Screen
  screenContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },

  // Modern Mobile Status Bar
  statusBar: {
    height: 38,
    width: '100%',
    backgroundColor: THEME.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 50,
  },
  statusTime: {
    fontSize: 12,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    width: 50,
  },
  dynamicIsland: {
    width: 100,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    gap: 6,
  },
  cameraLens: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#1e1b4b',
    borderWidth: 1,
    borderColor: '#312e81',
  },
  sensorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0284c7',
    opacity: 0.6,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 50,
    justifyContent: 'flex-end',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
    height: 10,
  },
  signalBar: {
    width: 2,
    backgroundColor: '#09090b',
    borderRadius: 1,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  batteryFill: {
    position: 'absolute',
    left: 2,
    top: 4,
    width: 8,
    height: 8,
    backgroundColor: '#09090b',
    borderRadius: 1,
  },

  // App Viewport
  appViewport: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },

  // Bottom Home Indicator
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  homeIndicatorBar: {
    width: 124,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#09090b',
    opacity: 0.8,
  },
});
