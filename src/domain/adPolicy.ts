export const INTERSTITIAL_MIN_GAP_MS = 3 * 60 * 1000;

export function canShowInterstitial(lastShownAt: number | null, now: number): boolean {
  return lastShownAt === null || now - lastShownAt >= INTERSTITIAL_MIN_GAP_MS;
}
