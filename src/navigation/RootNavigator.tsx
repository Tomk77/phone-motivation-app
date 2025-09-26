import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectSettings } from '../store/selectors';
import { useTheme } from '../context/ThemeProvider';
import { useInitialiseApp } from '../hooks/useInitialiseApp';
import { useReminderScheduler } from '../hooks/useReminderScheduler';
import { selectStatus } from '../store/selectors';
import { ActivityIndicator, View } from 'react-native';
import { navigationRef } from './navigationRef';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const Tabs = () => {
  const { colours, mode } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colours.primary,
        tabBarInactiveTintColor: colours.subtleText,
        tabBarStyle: { backgroundColor: mode === 'dark' ? '#111827' : '#FFFFFF' },
      }}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  useInitialiseApp();
  useReminderScheduler();
  const settings = useAppSelector(selectSettings);
  const status = useAppSelector(selectStatus);
  const { mode, colours } = useTheme();

  const navTheme = mode === 'dark' ? DarkTheme : DefaultTheme;

  if (!status.isInitialised) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.background }}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!settings.firstRunComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={Tabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
