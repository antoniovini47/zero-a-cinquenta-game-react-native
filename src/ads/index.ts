import type { ComponentType } from 'react';
import { PREMIUM } from '../variant';

type Ads = { initAds: () => void; maybeShowInterstitial: () => void; AdBanner: ComponentType };

const noAds: Ads = { initAds: () => {}, maybeShowInterstitial: () => {}, AdBanner: () => null };

// Premium ships without the ads native module, so the module must never be evaluated there.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ads: Ads = PREMIUM ? noAds : { ...require('./ads'), AdBanner: require('./AdBanner').AdBanner };

export const { initAds, maybeShowInterstitial, AdBanner } = ads;
