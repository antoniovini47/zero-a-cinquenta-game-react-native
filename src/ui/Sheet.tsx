import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { fonts, palette, radius } from '../theme';

type SheetProps = { visible: boolean; onClose?: () => void; children: ReactNode };

export function Sheet({ visible, onClose, children }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
}

type ButtonProps = { label: string; onPress: () => void; kind?: 'primary' | 'ghost' | 'danger' };

export function SheetButton({ label, onPress, kind = 'primary' }: ButtonProps) {
  const background = kind === 'primary' ? palette.open : kind === 'danger' ? palette.lost : 'transparent';
  const color = kind === 'primary' ? palette.onOpen : kind === 'danger' ? palette.onLost : palette.ink;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: background, opacity: pressed ? 0.75 : 1 }, kind === 'ghost' && styles.ghost]}>
      <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(5,4,12,0.78)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: palette.surface, borderRadius: radius.lg, padding: 24, gap: 12, borderWidth: 1, borderColor: palette.border },
  button: { minHeight: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  ghost: { borderWidth: 1, borderColor: palette.border },
  buttonLabel: { fontFamily: fonts.extraBold, fontSize: 17 },
});
