import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerActiveTintColor:"#663399"
          }}
        />
        <Drawer.Screen
          name="Profile"
          options={{
            drawerLabel: 'User',
            title: 'Profile',
            drawerActiveTintColor:"#663399"
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
