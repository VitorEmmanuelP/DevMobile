import { View } from 'react-native';
import { StackNavigator } from './src/routes/stack';
import { ContextProvider } from './src/context';

export default function App() {
  return (
    <View style={{flex: 1 }}>
      <ContextProvider>
        <StackNavigator />
      </ContextProvider>
    </View>
  );
}

