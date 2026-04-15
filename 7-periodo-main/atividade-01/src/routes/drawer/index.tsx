import { createDrawerNavigator, DrawerToggleButton } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text, View } from "react-native";
import { BottomTabsModalNav } from "../bottom-tabs-modal";
import { BottomTabsListNav } from "../bottom-tabs-list";
const Drawer = createDrawerNavigator();

function HeaderLeft() {
    const navigation = useNavigation<any>();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Main')} style={{ marginLeft: 15, marginRight: 10 }}>
                <Text style={{ fontSize: 22, color: '#333' }}>←</Text>
            </TouchableOpacity>
            <DrawerToggleButton />
        </View>
    );
}

export function DrawerNav() {
    return (
        <Drawer.Navigator screenOptions={{ headerLeft: () => <HeaderLeft /> }}>
            <Drawer.Screen name='Modal' component={BottomTabsModalNav} />
            <Drawer.Screen name='List' component={BottomTabsListNav} />
        </Drawer.Navigator>
    )
}