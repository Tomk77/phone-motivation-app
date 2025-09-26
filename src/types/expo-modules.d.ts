declare module 'expo-sqlite/next' {
  export interface SQLiteDatabase {
    runAsync(sql: string, params?: any[]): Promise<void>;
    getAllAsync<T>(sql: string, params?: any[]): Promise<T[]>;
    getFirstAsync<T>(sql: string, params?: any[]): Promise<T | null>;
  }
  export function openDatabaseAsync(name: string): Promise<SQLiteDatabase>;
}

declare module 'expo-notifications' {
  import { Subscription } from 'expo-modules-core';
  export enum AndroidImportance {
    DEFAULT,
  }
  export enum IosAuthorizationStatus {
    PROVISIONAL = 2,
  }
  export type NotificationResponse = any;
  export type NotificationRequestInput = any;
  export type NotificationTriggerInput = any;
  export function getPermissionsAsync(): Promise<any>;
  export function requestPermissionsAsync(options?: any): Promise<any>;
  export function scheduleNotificationAsync(options: any): Promise<string>;
  export function cancelScheduledNotificationAsync(identifier: string): Promise<void>;
  export function setNotificationHandler(handler: any): void;
  export function addNotificationResponseReceivedListener(
    listener: (response: NotificationResponse) => void,
  ): Subscription;
  export function setNotificationChannelAsync(id: string, options: any): Promise<void>;
}

declare module 'expo-secure-store' {
  export function getItemAsync(key: string): Promise<string | null>;
  export function setItemAsync(key: string, value: string): Promise<void>;
  export function deleteItemAsync(key: string): Promise<void>;
}

declare module 'expo-file-system' {
  export enum EncodingType {
    UTF8 = 'utf8',
  }
  export const cacheDirectory: string;
  export function writeAsStringAsync(uri: string, data: string, options?: { encoding?: EncodingType }): Promise<void>;
}

declare module 'expo-sharing' {
  export function isAvailableAsync(): Promise<boolean>;
  export function shareAsync(uri: string, options?: any): Promise<void>;
}
