import { StyleSheet, Text, View } from 'react-native';

import { Message } from '../types';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isSent = message.direction === 'sent';
  return (
    <View
      testID="message-bubble"
      style={[styles.bubble, isSent ? styles.sent : styles.received]}
    >
      {!isSent && <Text style={styles.sender}>{message.sender}</Text>}
      <Text style={styles.body}>{message.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginVertical: 4,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  sender: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b6e4f',
    marginBottom: 2,
  },
  body: {
    fontSize: 15,
    color: '#111',
  },
});
