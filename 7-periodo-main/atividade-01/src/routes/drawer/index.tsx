import { createDrawerNavigator } from "@react-navigation/drawer";
import { ModalScreen } from "../../screens/modal-screen";
import { BottomTabsModalNav } from "../bottom-tabs-modal";
import { BottomTabsListNav } from "../bottom-tabs-list";
const Drawer = createDrawerNavigator();

export function DrawerNav() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name='Modal' component={BottomTabsModalNav} />
            <Drawer.Screen name='List' component={BottomTabsListNav} />
        </Drawer.Navigator>
    )
}