import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
            value={name}
            onChangeText={setName}
          />
          <TextInput
            testID="input-topic"
            style={styles.input}
            placeholder="Tópico (ex.: mensagemmqtt/sala1)"
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  error: {
    color: '#c62828',
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
    backgroundColor: '#eee',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  create: {
    backgroundColor: '#0b6e4f',
  },
  createText: {
    color: '#fff',
    fontWeight: '700',
  },
});
