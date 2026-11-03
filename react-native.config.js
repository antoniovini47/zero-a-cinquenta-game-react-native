const PREMIUM = process.env.EXPO_PUBLIC_VARIANT === 'premium';

module.exports = {
  dependencies: PREMIUM ? { 'react-native-google-mobile-ads': { platforms: { android: null, ios: null } } } : {},
};
