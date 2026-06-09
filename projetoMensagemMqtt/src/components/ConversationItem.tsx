import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/theme';
import { Conversation } from '../types';

interface Props {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
  onLongPress: (conversation: Conversation) => void;
}

export function ConversationItem({ conversation, onPress, onLongPress }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(conversation)}
      onLongPress={() => onLongPress(conversation)}
    >
      <Text style={styles.name}>{conversation.name}</Text>
      <Text style={styles.topic}>{conversation.topic}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    item: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    topic: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
