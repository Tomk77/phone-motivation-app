import * as ReactNS from 'react';
const React = (ReactNS as any).default ?? ReactNS;

const createComponent = (tag: string) =>
  (React as any).forwardRef?.((props: any, ref: any) =>
    (React as any).createElement(tag, { ...props, ref }, props.children),
  ) ?? ((props: any) => props.children);

export const View = createComponent('div');
export const Text = createComponent('span');
export const Pressable = createComponent('button');
export const ScrollView = createComponent('div');
export const SafeAreaView = createComponent('div');
export const TextInput = createComponent('input');
export const Switch = createComponent('input');
export const Modal = createComponent('div');
export const ActivityIndicator = createComponent('div');
export const Alert = { alert: () => undefined };
export const StyleSheet = { create: (styles: any) => styles };
export const Platform = { OS: 'web' };
export const ToastAndroid = { show: () => undefined, SHORT: 0 };
export const AppState = {
  currentState: 'active',
  addEventListener: () => ({ remove: () => undefined }),
};
export const StatusBar = createComponent('div');
