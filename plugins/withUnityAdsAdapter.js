const { withAppBuildGradle } = require('expo/config-plugins');

// Unity Ads bidding adapter for AdMob mediation; must match play-services-ads 25.5.0 from react-native-google-mobile-ads 17.4.
const ADAPTER = "implementation 'com.google.ads.mediation:unity:4.21.0.0'";

module.exports = function withUnityAdsAdapter(config) {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes(ADAPTER)) {
      mod.modResults.contents = mod.modResults.contents.replace(/dependencies\s*{/, (match) => `${match}\n    ${ADAPTER}`);
    }
    return mod;
  });
};
