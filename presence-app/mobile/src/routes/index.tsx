import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context';
import StackRoutes from './stack';

export default function Routes() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}
