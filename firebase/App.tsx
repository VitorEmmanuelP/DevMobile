import { View } from 'react-native';
import { BottomTabs } from './src/routes/bottom-tabs';
import { ContextProvider } from './src/context';

export default function App() {
  return (
    <View style={{flex: 1 }}>
      <ContextProvider>
        <BottomTabs />
      </ContextProvider>
    </View>
  );
}

