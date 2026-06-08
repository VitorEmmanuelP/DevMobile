import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Conversation } from '../types';

interface Props {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
  onLongPress: (conversation: Conversation) => void;
}

export function ConversationItem({ conversation, onPress, onLongPress }: Props) {
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

const styles = StyleSheet.create({
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  topic: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
