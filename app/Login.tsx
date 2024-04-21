import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const loginUser = async () => {
    const resp = await fetch(process.env.EXPO_PUBLIC_API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  };
  return (
    <SafeAreaView style={style.mainContainer}>
      <Text variant="headlineMedium" style={style.title}>
        Log In
      </Text>
      <TextInput
        mode="outlined"
        label={"Email"}
        value={userInfo["email"]}
        textContentType="emailAddress"
        keyboardType="email-address"
        onChangeText={(value: string) => handleChange("email", value)}
      />
      <TextInput
        mode="outlined"
        label={"Password"}
        onChangeText={(value: string) => handleChange("password", value)}
        secureTextEntry={true}
      />
      <Button mode="contained" onPress={loginUser} style={{ marginTop: 20 }}>
        Log In
      </Button>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#161622",
  },
  title: {
    textAlign: "center",
    color: "#fff",
  },
  checkBoxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Login;
