import { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/theme';
import { CreateConversationInput } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (input: CreateConversationInput) => Promise<void>;
}

function validateTopic(topic: string): string | null {
  if (!topic) {
    return 'Informe um tópico.';
  }
  if (/\s/.test(topic)) {
    return 'O tópico não pode conter espaços.';
  }
  if (topic.includes('#') || topic.includes('+')) {
    return 'O tópico não pode conter os curingas # ou +.';
  }
  return null;
}

export function NewConversationModal({ visible, onClose, onCreate }: Props) {
  const { mode, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName('');
    setTopic('');
    setError(null);
  }

  function close() {
    reset();
    onClose();
  }

  async function submit() {
    const trimmedName = name.trim();
    const trimmedTopic = topic.trim();

    if (!trimmedName) {
      setError('Informe um nome para a conversa.');
      return;
    }
    const topicError = validateTopic(trimmedTopic);
    if (topicError) {
      setError(topicError);
      return;
    }

    try {
      await onCreate({ name: trimmedName, topic: trimmedTopic });
      reset();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível criar a conversa.');
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Nova conversa</Text>

          <TextInput
            testID="input-name"
            style={styles.input}
            placeholder="Nome (ex.: Sala 1)"
            placeholderTextColor={colors.textFaint}
            keyboardAppearance={mode === 'dark' ? 'dark' : 'light'}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            testID="input-topic"
            style={styles.input}
            placeholder="Tópico (ex.: mensagemmqtt/sala1)"
            placeholderTextColor={colors.textFaint}
            keyboardAppearance={mode === 'dark' ? 'dark' : 'light'}
            autoCapitalize="none"
            value={topic}
            onChangeText={setTopic}
          />

          {error && (
            <Text testID="modal-error" style={styles.error}>
              {error}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={close}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="button-create" style={[styles.button, styles.create]} onPress={submit}>
              <Text style={styles.createText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.backdrop,
      justifyContent: 'center',
      padding: 24,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 14,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 10,
      fontSize: 15,
    },
    error: {
      color: colors.error,
      marginBottom: 8,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 6,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginLeft: 10,
    },
    cancel: {
      backgroundColor: colors.surfaceMuted,
    },
    cancelText: {
      color: colors.text,
      fontWeight: '600',
    },
    create: {
      backgroundColor: colors.primary,
    },
    createText: {
      color: colors.onPrimary,
      fontWeight: '700',
    },
  });
