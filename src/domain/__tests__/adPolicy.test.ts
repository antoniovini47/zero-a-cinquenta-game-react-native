import { describe, expect, it } from '@jest/globals';
import { canShowInterstitial, INTERSTITIAL_MIN_GAP_MS } from '../adPolicy';

describe('canShowInterstitial', () => {
  const now = 1_000_000_000;

  it('given none shown yet, when asked, then it can show', () => {
    expect(canShowInterstitial(null, now)).toBe(true);
  });

  it('given one shown less than 2 minutes ago, when asked, then it waits', () => {
    expect(canShowInterstitial(now - INTERSTITIAL_MIN_GAP_MS + 1, now)).toBe(false);
  });

  it('given one shown 2 minutes ago, when asked, then it can show', () => {
    expect(canShowInterstitial(now - INTERSTITIAL_MIN_GAP_MS, now)).toBe(true);
  });
});
