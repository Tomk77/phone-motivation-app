import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';

export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

export const navigateToToday = () => {
  navigationRef.current?.navigate('Main');
};
