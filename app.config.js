const PREMIUM = process.env.EXPO_PUBLIC_VARIANT === 'premium';
const PREMIUM_PROJECT_ID = '6bd0aede-2131-48cf-a520-ac6f6b27494c';

const premium = (config) => ({
  ...config,
  name: 'Zero a Cinquenta Premium',
  slug: 'zero-a-cinquenta-premium',
  icon: './assets/images/icon-premium.png',
  ios: { ...config.ios, bundleIdentifier: 'com.rotech.zeroacinquentapremium' },
  android: {
    ...config.android,
    package: 'com.rotech.zeroacinquentapremium',
    versionCode: 9,
    blockedPermissions: [...config.android.blockedPermissions, 'com.google.android.gms.permission.AD_ID', 'android.permission.ACCESS_ADSERVICES_AD_ID'],
    adaptiveIcon: { ...config.android.adaptiveIcon, foregroundImage: './assets/images/adaptative-icon-premium.png' },
  },
  plugins: config.plugins
    .filter((plugin) => (Array.isArray(plugin) ? plugin[0] : plugin) !== 'react-native-google-mobile-ads')
    .map((plugin) => (Array.isArray(plugin) && plugin[0] === 'expo-splash-screen' ? [plugin[0], { ...plugin[1], image: './assets/images/splash-premium.png' }] : plugin)),
  extra: { ...config.extra, eas: { projectId: PREMIUM_PROJECT_ID } },
  updates: { ...config.updates, url: `https://u.expo.dev/${PREMIUM_PROJECT_ID}` },
});

module.exports = ({ config }) => {
  const base = { ...config, android: { ...config.android, googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json' } };
  return PREMIUM ? premium(base) : base;
};
