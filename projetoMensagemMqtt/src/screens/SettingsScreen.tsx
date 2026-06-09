import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_BROKER } from '../config';
import { settingsRepository } from '../repositories/settingsRepository';
import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/theme';
import { Settings } from '../types';

interface Props {
  settings: Settings | null;
  onSaved: (settings: Settings) => void;
  onBack?: () => void;
}

function validateHost(host: string): string | null {
  if (!host) {
    return 'Informe o host do broker.';
  }
  if (/\s/.test(host)) {
    return 'O host não pode conter espaços.';
  }
  if (/:\/\//.test(host) || /^[a-z]+:/i.test(host)) {
    return 'Informe só o domínio ou IP, sem ws://, wss:// ou http://.';
  }
  if (host.includes('/')) {
    return 'O host não pode conter caminho (/).';
  }
  return null;
}

export function SettingsScreen({ settings, onSaved, onBack }: Props) {
  const { mode, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [nickname, setNickname] = useState(settings?.nickname ?? '');
  const [brokerHost, setBrokerHost] = useState(settings?.brokerHost ?? DEFAULT_BROKER.host);
  const [brokerPort, setBrokerPort] = useState(
    String(settings?.brokerPort ?? DEFAULT_BROKER.port)
  );
  const [useSsl, setUseSsl] = useState(settings?.useSsl ?? DEFAULT_BROKER.useSsl);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    const trimmedNickname = nickname.trim();
    const trimmedHost = brokerHost.trim();
    const port = Number(brokerPort);

    if (!trimmedNickname) {
      setError('Informe um apelido.');
      return;
    }
    const hostError = validateHost(trimmedHost);
    if (hostError) {
      setError(hostError);
      return;
    }
    if (!Number.isInteger(port) || port <= 0) {
      setError('A porta deve ser um número válido.');
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const saved = await settingsRepository.save({
        nickname: trimmedNickname,
        brokerHost: trimmedHost,
        brokerPort: port,
        useSsl,
      });
      onSaved(saved);
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível salvar os ajustes.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Text style={styles.title}>Ajustes</Text>

      <Text style={styles.label}>Apelido</Text>
      <TextInput
        testID="input-nickname"
        style={styles.input}
        placeholder="Seu apelido"
        placeholderTextColor={colors.textFaint}
        keyboardAppearance={mode === 'dark' ? 'dark' : 'light'}
        value={nickname}
        onChangeText={setNickname}
      />

      <Text style={styles.label}>Host do broker</Text>
      <TextInput
        testID="input-host"
        style={styles.input}
        placeholder="broker.hivemq.com"
        placeholderTextColor={colors.textFaint}
        keyboardAppearance={mode === 'dark' ? 'dark' : 'light'}
        autoCapitalize="none"
        autoCorrect={false}
        value={brokerHost}
        onChangeText={setBrokerHost}
      />

      <Text style={styles.label}>Porta</Text>
      <TextInput
        testID="input-port"
        style={styles.input}
        placeholder="8884"
        placeholderTextColor={colors.textFaint}
        keyboardAppearance={mode === 'dark' ? 'dark' : 'light'}
        keyboardType="number-pad"
        value={brokerPort}
        onChangeText={setBrokerPort}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Usar SSL (WSS)</Text>
        <Switch testID="switch-ssl" value={useSsl} onValueChange={setUseSsl} />
      </View>

      {error && (
        <Text testID="settings-error" style={styles.error}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        testID="button-save"
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={save}
        disabled={saving}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      {onBack && (
        <TouchableOpacity testID="button-back" style={styles.linkButton} onPress={onBack}>
          <Text style={styles.linkText}>Voltar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 20,
      color: colors.text,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.surface,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      fontSize: 15,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    error: {
      color: colors.error,
      marginBottom: 14,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    linkButton: {
      paddingVertical: 14,
      alignItems: 'center',
    },
    linkText: {
      color: colors.primary,
      fontWeight: '600',
    },
  });
