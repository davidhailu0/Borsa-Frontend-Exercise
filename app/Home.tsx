import { SafeAreaView, FlatList } from "react-native";
import { Card } from "react-native-paper";
import { useSelector } from "react-redux";
import User from "../interfaces/User";

const Home = () => {
  const users: User[] = useSelector((state: any) => state.users);
  return (
    <SafeAreaView>
      <FlatList
        data={users}
        renderItem={({ item }) => <Card.Title title={item.firstName} />}
      />
    </SafeAreaView>
  );
};

export default Home;
