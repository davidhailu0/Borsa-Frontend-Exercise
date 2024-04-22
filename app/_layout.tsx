import { Provider } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import store from "../state/store";
const Layout = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{flex:1}}>
        <Slot />
      </SafeAreaView>
    </Provider>
  );
};

export default Layout;
