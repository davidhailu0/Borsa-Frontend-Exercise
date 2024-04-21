import { Provider } from "react-redux";
import { StatusBar } from "react-native";
import { Slot } from "expo-router";
import store from "../state/store";
const Layout = () => {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor={"#fff"} />
      <Slot />
    </Provider>
  );
};

export default Layout;
