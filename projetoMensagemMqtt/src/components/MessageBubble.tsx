import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/theme';
import { Message } from '../types';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bubble: {
      maxWidth: '80%',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 14,
      marginVertical: 4,
    },
    sent: {
      alignSelf: 'flex-end',
      backgroundColor: colors.bubbleSent,
    },
    received: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    sender: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 2,
    },
    body: {
      fontSize: 15,
      color: colors.text,
    },
  });
