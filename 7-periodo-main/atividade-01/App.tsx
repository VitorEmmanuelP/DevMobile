
import { Routes } from './src/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
        <GestureHandlerRootView style={{flex: 1}}>
          <Routes  />
        </GestureHandlerRootView>
  );
}
