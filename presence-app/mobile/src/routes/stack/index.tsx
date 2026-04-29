import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../../screens/sign-in';
import { SCREEN_NAMES } from '../../constants/screens';

export type StackParamList = {
  [SCREEN_NAMES.SIGN_IN]: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SCREEN_NAMES.SIGN_IN} component={SignInScreen} />
    </Stack.Navigator>
  );
}
