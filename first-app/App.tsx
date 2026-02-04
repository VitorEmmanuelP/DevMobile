import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { StyleSheet, Text, View , Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/home';


function App() {



  return (
    <View style={styles.container}>
      <SafeAreaView>
        <HomeScreen />
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
