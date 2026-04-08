import 'react-native-gesture-handler';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { LoginScreen } from '../../screens/login';
import { RegisterScreen } from '../../screens/register';
import WelcomeScreen from '../../screens/welcome';
import { UserListScreen } from '../../screens/user-list';
import { EditUserScreen } from '../../screens/edit-user';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Bem-vindo" component={WelcomeScreen} />
      <Drawer.Screen name="Lista de Usuários" component={UserListScreen} />
    </Drawer.Navigator>
  );
}

export function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
        <Stack.Screen name="Home" component={MyDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Editar Usuário' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}