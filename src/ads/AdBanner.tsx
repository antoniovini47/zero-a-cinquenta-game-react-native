import { useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adRequest, bannerAdId } from './ads';

export function AdBanner() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <View style={{ alignItems: 'center' }}>
      <BannerAd unitId={bannerAdId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={adRequest} onAdFailedToLoad={() => setFailed(true)} />
    </View>
  );
}
