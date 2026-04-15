import { createStackNavigator } from '@react-navigation/stack';
import { Welcome } from '../../screens/welcome';
import { DrawerNav } from '../drawer';

const Stack = createStackNavigator();

export function StackNav() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={Welcome} />
      <Stack.Screen name="Drawer" component={DrawerNav} />
    </Stack.Navigator>
  );
}