const { withAppBuildGradle } = require('expo/config-plugins');

// Liftoff Monetize (Vungle) bidding adapter for AdMob mediation; must match play-services-ads 25.5.0 from react-native-google-mobile-ads 17.4.
const ADAPTER = "implementation 'com.google.ads.mediation:vungle:7.7.9.0'";

module.exports = function withLiftoffAdapter(config) {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes(ADAPTER)) {
      mod.modResults.contents = mod.modResults.contents.replace(/dependencies\s*{/, (match) => `${match}\n    ${ADAPTER}`);
    }
    return mod;
  });
};
