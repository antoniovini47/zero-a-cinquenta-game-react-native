const { withAppBuildGradle } = require('expo/config-plugins');

// AppLovin bidding adapter for AdMob mediation; must match play-services-ads 25.5.0 from react-native-google-mobile-ads 17.4.
const ADAPTER = "implementation 'com.google.ads.mediation:applovin:13.6.4.2'";

module.exports = function withAppLovinAdapter(config) {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes(ADAPTER)) {
      mod.modResults.contents = mod.modResults.contents.replace(/dependencies\s*{/, (match) => `${match}\n    ${ADAPTER}`);
    }
    return mod;
  });
};
