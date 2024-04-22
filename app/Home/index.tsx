import { useEffect, useState, memo } from "react";
import { View, FlatList, StyleSheet, Image } from "react-native";
import { Card, Text,IconButton } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { router } from "expo-router";
import User from "../../interfaces/User";
import { GET_USERS } from "../../state/UserSaga";

const Home = () => {
  const users: User[] = useSelector((state: any) => state.users);
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(2); 

  const MemoizedCard = memo(
    ({ item }: { item: User }) => (
      <Card.Title
        style={style.cardStyle}
        title={`${item.firstName} ${item.lastName}`}
        subtitle={item.isBuyer ? "Buyer" : "Seller"}
        left={(props) => (
          <Image
            {...props}
            style={{ width: 50, height: 50 }}
            source={{ uri: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" }}
          />
        )}
      />
    ),
    (prevProps, nextProps) => prevProps.item._id === nextProps.item._id 
  );

  useEffect(() => {
    dispatch({ type: GET_USERS, payload: 1 }); 
  }, []);

  const fetchNextPage = () => {
    dispatch({ type: GET_USERS, payload: page });
    setPage((prev) => prev + 1);
  };

  return (
    <View style={style.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <MemoizedCard item={item} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.3}
        keyExtractor={(item) => item._id!.toString()}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  cardStyle: {
    backgroundColor: "#fff",
    margin: 7,
  },
});

export default Home;
