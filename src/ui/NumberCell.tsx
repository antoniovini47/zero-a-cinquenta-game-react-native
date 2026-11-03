import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { fonts, palette, radius } from '../theme';

type Props = { n: number; open: boolean; hiding: boolean; onPress: (n: number) => void };

export function NumberCell({ n, open, hiding, onPress }: Props) {
  const [shown] = useState(() => new Animated.Value(open ? 1 : 0));

  useEffect(() => {
    Animated.timing(shown, { toValue: open ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [open, shown]);

  const scale = shown.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] });
  const background = !open ? palette.closed : hiding ? palette.accent : palette.open;
  const color = !open ? palette.onClosed : hiding ? palette.onAccent : palette.onOpen;

  return (
    <Animated.View style={[styles.cell, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={String(n)}
        accessibilityState={{ disabled: !open }}
        disabled={!open}
        onPress={() => onPress(n)}
        style={({ pressed }) => [styles.press, { backgroundColor: background, opacity: pressed ? 0.7 : 1 }]}>
        <Text style={[styles.label, { color }]}>{n}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1 },
  press: { flex: 1, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.black, fontSize: 22 },
});
