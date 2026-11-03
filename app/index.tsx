import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdBanner, maybeShowInterstitial } from '../src/ads';
import { track } from '../src/analytics';
import { guess, hide, isOpen, isOver, LAST_NUMBER, newGame, remaining, type Game, type Mode } from '../src/domain/game';
import { feedbackLost, feedbackStart, feedbackTap } from '../src/feedback';
import { fonts, palette, radius } from '../src/theme';
import { Sheet, SheetButton } from '../src/ui/Sheet';
import { NumberCell } from '../src/ui/NumberCell';
import { PREMIUM, PREMIUM_STORE_URL } from '../src/variant';

const COLUMNS = 5;
const ROWS = Array.from({ length: LAST_NUMBER / COLUMNS }, (_, row) => Array.from({ length: COLUMNS }, (_, col) => row * COLUMNS + col + 1));
const MODE_LABEL: Record<Mode, string> = { draw: 'Sortear', pick: 'Escolher número' };

function headline(game: Game): { title: string; hint: string } {
  if (game.status === 'hiding') return { title: 'Esconda um número', hint: 'Toque num número sem ninguém ver.' };
  if (remaining(game) === 1) return { title: `Só sobrou o ${game.low}`, hint: 'Quem tocar nele perde!' };
  const range = `${game.low} a ${game.high}`;
  if (game.guesses > 0) return { title: range, hint: `${remaining(game)} números na disputa. Passe o celular!` };
  if (game.mode === 'pick') return { title: range, hint: 'Número escondido. Passe o celular!' };
  return { title: range, hint: 'Número sorteado, ninguém sabe qual é. Boa sorte!' };
}

export default function Play() {
  const [game, setGame] = useState<Game>(() => newGame('draw'));
  const [confirmMode, setConfirmMode] = useState<Mode | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    track('round_start', { mode: 'draw' });
  }, []);

  function start(mode: Mode) {
    setConfirmMode(null);
    setGame(newGame(mode));
    startedAt.current = Date.now();
    feedbackStart();
    track('round_start', { mode });
  }

  function requestMode(mode: Mode) {
    if (game.status === 'playing' && game.guesses > 0) {
      setConfirmMode(mode);
      return;
    }
    start(mode);
  }

  function restartFromConfirm(mode: Mode) {
    track('round_restart', { mode: game.mode, guesses: game.guesses });
    start(mode);
  }

  function playAgain(mode: Mode) {
    maybeShowInterstitial();
    start(mode);
  }

  function press(n: number) {
    if (game.status === 'hiding') {
      feedbackStart();
      setGame(hide(game, n));
      startedAt.current = Date.now();
      return;
    }
    const next = guess(game, n);
    if (isOver(next)) {
      feedbackLost();
      track('round_end', { mode: next.mode, result: next.status, guesses: next.guesses, seconds: Math.round((Date.now() - startedAt.current) / 1000) });
    } else {
      feedbackTap();
    }
    setGame(next);
  }

  function openRules() {
    setRulesOpen(true);
    track('rules_open');
  }

  function openPremium() {
    track('premium_open');
    Linking.openURL(PREMIUM_STORE_URL);
  }

  const { title, hint } = headline(game);
  const over = isOver(game);
  const otherMode: Mode = game.mode === 'draw' ? 'pick' : 'draw';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>
      <AdBanner />
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>

      <View style={styles.grid}>
        {ROWS.map((row) => (
          <View key={row[0]} style={styles.row}>
            {row.map((n) => (
              <NumberCell key={n} n={n} open={!over && isOpen(game, n)} hiding={game.status === 'hiding'} onPress={press} />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <ModeButton icon="dice" label="Sortear" active={game.mode === 'draw'} onPress={() => requestMode('draw')} />
        <ModeButton icon="eye-off" label="Escolher" active={game.mode === 'pick'} onPress={() => requestMode('pick')} />
        <Pressable accessibilityRole="button" accessibilityLabel="Como jogar" onPress={openRules} style={({ pressed }) => [styles.help, pressed && styles.pressed]}>
          <Ionicons name="help" size={26} color={palette.ink} />
        </Pressable>
      </View>

      <Sheet visible={over} onClose={() => playAgain(game.mode)}>
        <View style={styles.reveal}>
          <Text style={styles.revealNumber}>{game.secret}</Text>
        </View>
        <Text style={styles.sheetTitle}>{game.status === 'cornered' ? 'Quem escondeu perdeu!' : 'PERDEU!'}</Text>
        <Text style={styles.sheetBody}>
          {game.status === 'cornered'
            ? `Só sobrou o ${game.secret}, então quem escondeu paga a prenda.`
            : `Quem tocou no ${game.secret} paga a prenda. Foram ${game.guesses} ${game.guesses === 1 ? 'palpite' : 'palpites'}.`}
          {game.mode === 'pick' ? ' Agora quem perdeu esconde o próximo.' : ''}
        </Text>
        <SheetButton label="Jogar de novo" onPress={() => playAgain(game.mode)} />
        <SheetButton label={`Trocar para ${MODE_LABEL[otherMode]}`} kind="ghost" onPress={() => playAgain(otherMode)} />
      </Sheet>

      <Sheet visible={confirmMode !== null} onClose={() => setConfirmMode(null)}>
        <Text style={styles.sheetTitle}>Começar outro jogo?</Text>
        <Text style={styles.sheetBody}>A rodada atual será perdida.</Text>
        <SheetButton label="Novo jogo" kind="danger" onPress={() => confirmMode && restartFromConfirm(confirmMode)} />
        <SheetButton label="Continuar jogando" kind="ghost" onPress={() => setConfirmMode(null)} />
      </Sheet>

      <Sheet visible={rulesOpen} onClose={() => setRulesOpen(false)}>
        <Text style={styles.sheetTitle}>Como jogar</Text>
        <Text style={styles.sheetBody}>
          O objetivo é não acertar. Cada um toca num número e passa o celular. A faixa vai fechando até alguém tocar no número secreto: quem tocar perde e paga a prenda.
        </Text>
        <Text style={styles.sheetBody}>
          <Text style={styles.strong}>Sortear:</Text> o app esconde o número e todo mundo joga.
        </Text>
        <Text style={styles.sheetBody}>
          <Text style={styles.strong}>Escolher:</Text> um jogador esconde o número e passa o celular. Se sobrar só o número secreto, quem escondeu perde.
        </Text>
        <SheetButton label="Entendi" onPress={() => setRulesOpen(false)} />
        {!PREMIUM && <SheetButton label="Remover anúncios" kind="ghost" onPress={openPremium} />}
      </Sheet>
    </SafeAreaView>
  );
}

type ModeButtonProps = { icon: keyof typeof Ionicons.glyphMap; label: string; active: boolean; onPress: () => void };

function ModeButton({ icon, label, active, onPress }: ModeButtonProps) {
  const color = active ? palette.onAccent : palette.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.mode, active && styles.modeActive, pressed && styles.pressed]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.modeLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, alignItems: 'center', gap: 2 },
  title: { fontFamily: fonts.black, fontSize: 34, color: palette.ink },
  hint: { fontFamily: fonts.bold, fontSize: 15, color: palette.inkMuted, textAlign: 'center' },
  grid: { flex: 1, paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  row: { flex: 1, flexDirection: 'row', gap: 6 },
  footer: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 10 },
  mode: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  modeActive: { backgroundColor: palette.accent, borderColor: palette.accent },
  modeLabel: { fontFamily: fonts.extraBold, fontSize: 16 },
  help: { width: 56, minHeight: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border },
  pressed: { opacity: 0.75 },
  reveal: { alignSelf: 'center', width: 112, height: 112, borderRadius: radius.pill, backgroundColor: palette.lost, alignItems: 'center', justifyContent: 'center' },
  revealNumber: { fontFamily: fonts.black, fontSize: 52, color: palette.onLost },
  sheetTitle: { fontFamily: fonts.black, fontSize: 28, color: palette.ink, textAlign: 'center' },
  sheetBody: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 23, color: palette.inkMuted },
  strong: { fontFamily: fonts.extraBold, color: palette.ink },
});
