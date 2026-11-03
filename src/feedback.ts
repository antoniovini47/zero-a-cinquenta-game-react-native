import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

const startSound = createAudioPlayer(require('../assets/raw/started.wav'));
const tapSound = createAudioPlayer(require('../assets/raw/click.mp3'));
const lostSound = createAudioPlayer(require('../assets/raw/founded.wav'));

function play(player: AudioPlayer) {
  player.seekTo(0);
  player.play();
}

export function feedbackStart(): void {
  play(startSound);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function feedbackTap(): void {
  play(tapSound);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function feedbackLost(): void {
  play(lostSound);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
