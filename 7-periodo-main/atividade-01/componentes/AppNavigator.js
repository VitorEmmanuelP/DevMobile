import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebase';

import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { FormScreen } from './FormScreen';
import { ListScreen } from './ListScreen';

import { Welcome } from '../src/screens/welcome';
import { DrawerNav } from '../src/routes/drawer';

const Stack = createStackNavigator();

function LogoutButton({ navigation }) {
  async function handleLogout() {
    await signOut(auth);
    navigation.replace('Login');
  }

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
      <Text style={{ color: '#FF5252', fontWeight: 'bold' }}>Sair</Text>
    </TouchableOpacity>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={Welcome}
          options={({ navigation }) => ({
            title: 'Início',
            headerLeft: () => null,
            headerRight: () => <LogoutButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Drawer"
          component={DrawerNav}
          options={({ navigation }) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="FormScreen"
          component={FormScreen}
          options={{ title: 'Novo Aluguel' }}
        />
        <Stack.Screen
          name="ListScreen"
          component={ListScreen}
          options={{ title: 'Aluguéis' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
