import './src/polyfills';

import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useMqtt } from './src/hooks/useMqtt';
import { ChatScreen } from './src/screens/ChatScreen';
import { ConversationsScreen } from './src/screens/ConversationsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { settingsRepository } from './src/repositories/settingsRepository';
import { Conversation, Settings } from './src/types';

type Screen = 'settings' | 'conversations' | 'chat';

export default function App() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>('conversations');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const { status, lastIncoming, sendMessage, subscribe, unsubscribe } = useMqtt(settings);

  useEffect(() => {
    settingsRepository.get().then((saved) => {
      setSettings(saved);
      setScreen(saved ? 'conversations' : 'settings');
      setLoading(false);
    });
  }, []);

  function renderScreen() {
    if (screen === 'settings') {
      return (
        <SettingsScreen
          settings={settings}
          onSaved={(saved) => {
            setSettings(saved);
            setScreen('conversations');
          }}
          onBack={settings ? () => setScreen('conversations') : undefined}
        />
      );
    }

    if (screen === 'chat' && activeConversation) {
      return (
        <ChatScreen
          conversation={activeConversation}
          lastIncoming={lastIncoming}
          sendMessage={sendMessage}
          onBack={() => setScreen('conversations')}
        />
      );
    }

    return (
      <ConversationsScreen
        status={status}
        onOpenChat={(conversation) => {
          setActiveConversation(conversation);
          setScreen('chat');
        }}
        onOpenSettings={() => setScreen('settings')}
        onSubscribe={subscribe}
        onUnsubscribe={unsubscribe}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <View style={loading ? styles.loading : styles.root}>
        {loading ? <ActivityIndicator size="large" color="#0b6e4f" /> : renderScreen()}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
