import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConversationItem } from '../components/ConversationItem';
import { NewConversationModal } from '../components/NewConversationModal';
import { StatusIndicator } from '../components/StatusIndicator';
import { ThemeToggleFab } from '../components/ThemeToggleFab';
import { conversationRepository } from '../repositories/conversationRepository';
import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/theme';
import { ConnectionStatus, Conversation, CreateConversationInput } from '../types';

interface Props {
  status: ConnectionStatus;
  onOpenChat: (conversation: Conversation) => void;
  onOpenSettings: () => void;
  onSubscribe: (topic: string) => void;
  onUnsubscribe: (topic: string) => void;
}

export function ConversationsScreen({
  status,
  onOpenChat,
  onOpenSettings,
  onSubscribe,
  onUnsubscribe,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let active = true;
    conversationRepository.findAll().then((list) => {
      if (active) {
        setConversations(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(input: CreateConversationInput) {
    const conversation = await conversationRepository.create(input);
    onSubscribe(conversation.topic);
    setConversations((prev) => [conversation, ...prev]);
  }

  function confirmDelete(conversation: Conversation) {
    Alert.alert(
      'Excluir conversa',
      `Excluir "${conversation.name}"? O histórico será apagado e o tópico deixará de ser assinado.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await conversationRepository.delete(conversation.id);
            onUnsubscribe(conversation.topic);
            setConversations((prev) => prev.filter((c) => c.id !== conversation.id));
          },
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Conversas</Text>
        <TouchableOpacity testID="button-settings" onPress={onOpenSettings}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusBar}>
        <StatusIndicator status={status} />
      </View>

      {loading ? (
        <ActivityIndicator testID="loading" style={styles.loading} color={colors.primary} />
      ) : conversations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma conversa ainda.</Text>
          <Text style={styles.emptyHint}>Toque em “Nova conversa” para começar.</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              onPress={onOpenChat}
              onLongPress={confirmDelete}
            />
          )}
        />
      )}

      <TouchableOpacity
        testID="button-new-conversation"
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+ Nova conversa</Text>
      </TouchableOpacity>

      <ThemeToggleFab />

      <NewConversationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreate}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    settingsIcon: {
      fontSize: 22,
    },
    statusBar: {
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    loading: {
      marginTop: 40,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textMuted,
    },
    emptyHint: {
      fontSize: 14,
      color: colors.textFaint,
      marginTop: 6,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      alignSelf: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 28,
    },
    fabText: {
      color: colors.onPrimary,
      fontWeight: '700',
      fontSize: 15,
    },
  });
