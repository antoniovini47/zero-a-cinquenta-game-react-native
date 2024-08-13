// InlineAd.tsx

import { View } from "react-native";
import * as Device from "expo-device";
import React, { useState } from "react";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const iosAdmobBanner = __DEV__
  ? "ca-app-pub-3940256099942544/9214589741"
  : process.env.EXPO_PUBLIC_ADMOB_APP_ID;
const androidAdmobBanner = __DEV__
  ? "ca-app-pub-3940256099942544/9214589741"
  : process.env.EXPO_PUBLIC_ADMOB_APP_ID;
const productionID = Device.osName === "Android" ? androidAdmobBanner : iosAdmobBanner;

const InlineAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false);
  return (
    <View style={{ height: isAdLoaded ? "auto" : 0 }}>
      <BannerAd
        // It is extremely important to use test IDs as you can be banned/restricted by Google AdMob for inappropriately using real ad banners during testing
        unitId={__DEV__ ? TestIds.BANNER : productionID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          // You can change this setting depending on whether you want to use the permissions tracking we set up in the initializing
        }}
        onAdLoaded={() => {
          setIsAdLoaded(true);
        }}
      />
    </View>
  );
};

export default InlineAd;
