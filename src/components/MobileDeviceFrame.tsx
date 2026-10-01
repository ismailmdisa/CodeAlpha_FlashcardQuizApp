import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Wifi, Battery } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  // Inject global CSS to eliminate browser scrollbars and web quirks
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'mobile-device-global-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          /* Hide ugly browser scrollbars completely inside mobile screen */
          ::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            background: transparent !important;
            display: none !important;
          }
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background-color: #111113 !important;
            width: 100% !important;
            height: 100% !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Keep a clean digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
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

  // Calculate dynamic device chassis dimensions - generous Pro Max size
  const frameHeight = Math.min(height - 20, 920);
  const frameWidth = Math.min(width - 24, 448);

  return (
    <View style={styles.desktopCanvas}>
      {/* Outer Phone Shell Wrapper (Holds physical side buttons & realistic 3D shadow) */}
      <View style={[styles.phoneShell, { width: frameWidth, height: frameHeight }]}>
        {/* Left Physical Buttons (Action Button & Volume Up/Down) */}
        <View style={[styles.sideButton, styles.actionButton]} />
        <View style={[styles.sideButton, styles.volUpButton]} />
        <View style={[styles.sideButton, styles.volDownButton]} />

        {/* Right Physical Button (Power / Lock Button) */}
        <View style={[styles.sideButton, styles.powerButton]} />

        {/* Main Phone Body (Curved Titanium Bezel) */}
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

            {/* App Viewport */}
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
    backgroundColor: '#111113', // Ultra-sleek dark studio canvas
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
    overflow: 'hidden',
  },

  // Outer Phone Shell
  phoneShell: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.65,
    shadowRadius: 40,
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
    height: 50,
  },
  volDownButton: {
    left: -3,
    top: 208,
    width: 3.5,
    height: 50,
  },
  powerButton: {
    right: -3,
    top: 160,
    width: 3.5,
    height: 68,
  },

  // Phone Chassis Body
  phoneBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#27272a', // Titanium metal chassis
    borderRadius: 52,
    padding: 11, // Outer bezel thickness
    borderWidth: 1.5,
    borderColor: '#52525b',
  },

  // Inner Screen
  screenContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    borderRadius: 42,
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
    paddingHorizontal: 22,
    zIndex: 50,
  },
  statusTime: {
    fontSize: 12.5,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
    width: 50,
  },
  dynamicIsland: {
    width: 108,
    height: 25,
    backgroundColor: '#000000',
    borderRadius: 13,
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
    overflow: 'hidden',
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
    width: 130,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#09090b',
    opacity: 0.8,
  },
});
