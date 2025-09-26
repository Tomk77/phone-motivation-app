import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeProvider';

interface Props extends PropsWithChildren {
  scrollable?: boolean;
}

export const ScreenShell: React.FC<Props> = ({ children, scrollable = false }) => {
  const { colours } = useTheme();

  const content = (
    <View style={[styles.content, { backgroundColor: colours.background }]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colours.background }]}> 
      {scrollable ? <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
