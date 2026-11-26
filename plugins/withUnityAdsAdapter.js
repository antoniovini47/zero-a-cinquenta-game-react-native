const { withAppBuildGradle } = require('expo/config-plugins');

// Adapter 4.21.0.0 matches play-services-ads 25.5.0 (react-native-google-mobile-ads 17.4); its POM does not pull the Unity SDK.
const DEPENDENCIES = [
  "implementation 'com.google.ads.mediation:unity:4.21.0.0'",
  "implementation 'com.unity3d.ads:unity-ads:4.21.0'",
];

module.exports = function withUnityAdsAdapter(config) {
  return withAppBuildGradle(config, (mod) => {
    const missing = DEPENDENCIES.filter((line) => !mod.modResults.contents.includes(line));
    if (missing.length) {
      mod.modResults.contents = mod.modResults.contents.replace(
        /dependencies\s*{/,
        (match) => `${match}\n${missing.map((line) => `    ${line}`).join('\n')}`,
      );
    }
    return mod;
  });
};
