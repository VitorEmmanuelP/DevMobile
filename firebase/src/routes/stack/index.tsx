import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { NavigationContainer } from '@react-navigation/native'; 

const Stack = createNativeStackNavigator(); 

export function StackNavigator(){
    return(
        <NavigationContainer>
           <Stack.Navigator  
          screenOptions={{  
            headerShown: false,
          }} 
        > 
          <Stack.Screen name="FADE" > 
        </Stack.Navigator>           
        </NavigationContainer>
    )
}