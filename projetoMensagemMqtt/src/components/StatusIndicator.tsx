import { StyleSheet, Text, View } from 'react-native';

import { ConnectionStatus } from '../types';

interface Props {
  status: ConnectionStatus;
}

const META: Record<ConnectionStatus, { label: string; color: string }> = {
  connected: { label: 'Conectado', color: '#2e7d32' },
  connecting: { label: 'Conectando…', color: '#f9a825' },
  disconnected: { label: 'Desconectado', color: '#c62828' },
  error: { label: 'Erro de conexão', color: '#c62828' },
};

export function StatusIndicator({ status }: Props) {
  const { label, color } = META[status];
  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={`Status: ${label}`}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
