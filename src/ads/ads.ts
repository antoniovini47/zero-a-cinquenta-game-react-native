import mobileAds, { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { canShowInterstitial } from '../domain/adPolicy';

const PRODUCTION_ADS = process.env.EXPO_PUBLIC_ADS === 'production';

export const bannerAdId = PRODUCTION_ADS ? 'ca-app-pub-9218769381944425/2583373193' : TestIds.ADAPTIVE_BANNER;
const interstitialAdId = PRODUCTION_ADS ? 'ca-app-pub-9218769381944425/3386579382' : TestIds.INTERSTITIAL;

export const adRequest = { keywords: ['jogos', 'games', 'festa', 'amigos', 'bebida', 'sorte'] };

const interstitial = InterstitialAd.createForAdRequest(interstitialAdId, adRequest);
let lastInterstitialAt: number | null = null;

export function initAds(): void {
  mobileAds()
    .initialize()
    .then(() => {
      interstitial.addAdEventListener(AdEventType.CLOSED, () => interstitial.load());
      interstitial.addAdEventListener(AdEventType.ERROR, () => setTimeout(() => interstitial.load(), 60_000));
      interstitial.load();
    });
}

export function maybeShowInterstitial(): void {
  const now = Date.now();
  if (!interstitial.loaded || !canShowInterstitial(lastInterstitialAt, now)) return;
  lastInterstitialAt = now;
  interstitial.show();
}
