import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from '@react-native-firebase/analytics';

type Params = Record<string, string | number>;

const analytics = getAnalytics();

export function initAnalytics(): void {
  setAnalyticsCollectionEnabled(analytics, process.env.EXPO_PUBLIC_ANALYTICS === 'on');
}

export function track(name: string, params?: Params): void {
  logEvent(analytics, name, params);
}
