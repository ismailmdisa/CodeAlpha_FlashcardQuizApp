import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FlashcardProvider } from './src/context/FlashcardContext';
import { FlashcardScreen } from './src/screens/FlashcardScreen';
import { THEME } from './src/theme/flashcardTheme';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        <FlashcardProvider>
          <FlashcardScreen />
        </FlashcardProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
