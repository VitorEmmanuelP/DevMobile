import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { CustomModalScreen } from '../../components/custom-modal';

const Tab = createBottomTabNavigator(); 

export function BottomTabs(){
    return(
        <NavigationContainer>
           <Tab.Navigator  
          screenOptions={{  
            headerShown: false,
            tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' }, 
            tabBarActiveTintColor: '#000', 
          }} 
        > 
          <Tab.Screen name="SLIDE"> 
            {() => <CustomModalScreen animation="slide" themeColor="#2196F3" />} 
          </Tab.Screen> 
           
          <Tab.Screen name="FADE"> 
            {() => <CustomModalScreen animation="fade" themeColor="#FF00FF" />} 
          </Tab.Screen> 
           
          <Tab.Screen name="NONE"> 
            {() => <CustomModalScreen animation="none" themeColor="#FF9800" />} 
          </Tab.Screen> 
        </Tab.Navigator>           
        </NavigationContainer>
    )
}