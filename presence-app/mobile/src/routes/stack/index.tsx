import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../../screens/sign-in';
import HomeScreen from '../../screens/home';
import DayDetailScreen from '../../screens/day-detail';
import RideRegisterScreen from '../../screens/ride-register';
import { SCREEN_NAMES } from '../../constants/screens';
import { useAuth } from '../../context';

export type StackParamList = {
  [SCREEN_NAMES.SIGN_IN]: undefined;
  [SCREEN_NAMES.HOME]: undefined;
  [SCREEN_NAMES.DAY_DETAIL]: { date: string; label: string };
  [SCREEN_NAMES.RIDE_REGISTER]: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default function StackRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name={SCREEN_NAMES.HOME} component={HomeScreen} />
          <Stack.Screen name={SCREEN_NAMES.DAY_DETAIL} component={DayDetailScreen} />
          <Stack.Screen name={SCREEN_NAMES.RIDE_REGISTER} component={RideRegisterScreen} />
        </>
      ) : (
        <Stack.Screen name={SCREEN_NAMES.SIGN_IN} component={SignInScreen} />
      )}
    </Stack.Navigator>
  );
}
