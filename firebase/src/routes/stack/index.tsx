import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { LoginScreen } from '../../screens/login';

const Stack = createNativeStackNavigator(); 

export function StackNavigator(){
    return(
        <NavigationContainer>
           <Stack.Navigator  
          screenOptions={{  
            headerShown: false,
          }} 
        > 
          <Stack.Screen component={LoginScreen} name="Login" /> 
        </Stack.Navigator>           
        </NavigationContainer>
    )
}