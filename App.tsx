import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppStoreProvider } from './src/store/StoreProvider';
import { ThemeProvider, useTheme } from './src/context/ThemeProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { addNotificationResponseListener } from './src/services/notificationScheduler';
import { navigateToToday } from './src/navigation/navigationRef';

const AppInner = () => {
  const { mode } = useTheme();

  React.useEffect(() => {
    const subscription = addNotificationResponseListener(() => {
      navigateToToday();
    });
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <AppStoreProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </AppStoreProvider>
  );
}
