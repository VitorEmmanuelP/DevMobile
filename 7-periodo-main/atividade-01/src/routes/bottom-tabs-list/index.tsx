import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { CustomModalScreen } from '../../components/custom-modal-screen';
import { CustomFlatList } from '../../components/custom-flat-list';
import { CustomScroll } from '../../components/custom-scroll';
import { CustomSectionList } from '../../components/custom-section-list';


const BottomTabs = createBottomTabNavigator(); 

export function BottomTabsListNav(){
    return(
           <BottomTabs.Navigator  
            screenOptions={{  
              headerShown: false,
              tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' }, 
              tabBarActiveTintColor: '#000', 
          }} 
        > 
          <BottomTabs.Screen name="FlatList" > 
            {() => <CustomFlatList  />} 
          </BottomTabs.Screen> 
           
          <BottomTabs.Screen name="Scroll"> 
            {() => <CustomScroll />} 
          </BottomTabs.Screen> 
           
          <BottomTabs.Screen name="SectionList"> 
            {() => <CustomSectionList />} 
          </BottomTabs.Screen> 
        </BottomTabs.Navigator>           
    )
}