import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/theme';

export function ThemeToggleFab() {
  const { mode, colors, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isLight = mode === 'light';

  return (
    <TouchableOpacity
      testID="button-toggle-theme"
      accessibilityRole="button"
      accessibilityLabel={isLight ? 'Ativar modo escuro' : 'Ativar modo claro'}
      style={[styles.fab, { bottom: insets.bottom + 24 }]}
      onPress={toggleTheme}
    >
      <Text style={styles.icon}>{isLight ? '🌙' : '☀️'}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 24,
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    icon: {
      fontSize: 22,
    },
  });
