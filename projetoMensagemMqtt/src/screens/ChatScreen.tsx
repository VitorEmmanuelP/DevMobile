import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MessageBubble } from '../components/MessageBubble';
import { messageRepository } from '../repositories/messageRepository';
import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/theme';
import { Conversation, Message } from '../types';

interface Props {
  conversation: Conversation;
  lastIncoming: Message | null;
  onBack: () => void;
  sendMessage: (conversation: Conversation, body: string) => Promise<Message | null>;
}

export function ChatScreen({ conversation, lastIncoming, onBack, sendMessage }: Props) {
  const { mode, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    let active = true;
    messageRepository.findByConversation(conversation.id).then((history) => {
      if (active) {
        setMessages(history);
      }
    });
    return () => {
      active = false;
    };
  }, [conversation.id]);

  useEffect(() => {
    if (!lastIncoming || lastIncoming.conversationId !== conversation.id) {
      return;
    }
    setMessages((prev) =>
      prev.some((m) => m.id === lastIncoming.id) ? prev : [...prev, lastIncoming]
    );
  }, [lastIncoming, conversation.id]);

  async function handleSend() {
    if (!draft.trim()) {
      return; // RN09: não envia corpo vazio.
    }
    const sent = await sendMessage(conversation, draft);
    if (sent) {
      setMessages((prev) => [...prev, sent]);
      setDraft('');
    }
  }

  function confirmClear() {
    Alert.alert(
      'Limpar histórico',
      'Apagar todas as mensagens desta conversa? A conversa será mantida.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await messageRepository.deleteByConversation(conversation.id);
            setMessages([]);
          },
        },
      ]
    );
  }

  return (
    <View
      style={[
        styles.screen,
        { paddingBottom: keyboardHeight > 0 ? keyboardHeight + insets.bottom : 0 },
      ]}
    >
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity testID="button-back" onPress={onBack}>
          <Text style={styles.headerAction}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {conversation.name}
        </Text>
        <TouchableOpacity testID="button-clear-history" onPress={confirmClear}>
          <Text style={styles.headerAction}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <MessageBubble message={item} />}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      <View
        style={[
          styles.inputBar,
          { paddingBottom: keyboardHeight > 0 ? 8 : insets.bottom + 8 },
        ]}
      >
        <TextInput
          testID="input-message"
          style={styles.input}
          placeholder="Mensagem"
          placeholderTextColor={colors.textFaint}
          keyboardAppearance={mode === 'dark' ? 'dark' : 'light'}
          value={draft}
          onChangeText={setDraft}
          multiline
        />
        <TouchableOpacity testID="button-send" style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.chatBackground,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 14,
      backgroundColor: colors.primary,
    },
    headerAction: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    title: {
      flex: 1,
      textAlign: 'center',
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: '700',
      marginHorizontal: 8,
    },
    list: {
      flex: 1,
    },
    listContent: {
      padding: 12,
    },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 8,
      backgroundColor: colors.surfaceMuted,
    },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      color: colors.text,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxHeight: 120,
      fontSize: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    sendButton: {
      marginLeft: 8,
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    sendText: {
      color: colors.onPrimary,
      fontWeight: '700',
    },
  });
