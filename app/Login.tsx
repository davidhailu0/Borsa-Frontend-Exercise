import { useState } from "react";
import { View, StyleSheet,Image } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import validator from "validator";
import { login } from "../state/authSlice";


//Login Page Function Component
const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [snackBar, setSnackBar] = useState({
    showSnackBar: false,
    snackBarMessage: "",
  });

  const dismissSnackBar = () => {
    setSnackBar((prev) => ({ ...prev, showSnackBar: false }));
  };

  //handles User Input Change
  const handleChange = (name: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();
  // User Login Function
  const loginUser = async () => {
    //Checking if Every Value is Correct
    if ((userInfo["email"] === ""||!validator.isEmail(userInfo["email"])) && userInfo["password"] === "") {
      setSnackBar({
        showSnackBar: true,
        snackBarMessage: "Please Enter Your Email and Password",
      });
      return;
    }
    if (userInfo["email"] === ""||!validator.isEmail(userInfo["email"])) {
      setSnackBar({
        showSnackBar: true,
        snackBarMessage: "Please Enter a Valid Email",
      });
      return;
    }
    if (userInfo["password"] === "") {
      setSnackBar({
        showSnackBar: true,
        snackBarMessage: "Please Enter Your Password",
      });
      return;
    }
    fetch(process.env.EXPO_PUBLIC_API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then(async (resp: Response) => {
        const json = await resp.json();
        if ("token" in json) {
          setSnackBar({ showSnackBar: true, snackBarMessage: "Welcome "+json['firstName'] });
          dispatch(login(json));
          setTimeout(() => {
            router.replace("/Home");
          }, 2000);
        } else if ("message" in json) {
          setSnackBar({
            showSnackBar: true,
            snackBarMessage: json["message"],
          });
        }
      })
      .catch((e) => {
        setSnackBar({ showSnackBar: true, snackBarMessage: e.message });
      });
  };

  const goToSignUp = () => {
    router.replace("/");
  };

  return (
    <View style={style.mainContainer}>
      <Snackbar
        style={{ minWidth: "100%", justifyContent: "center" }}
        wrapperStyle={{
          top: 0,
          zIndex:999
        }}
        visible={snackBar.showSnackBar}
        onDismiss={dismissSnackBar}
      >
        {snackBar.snackBarMessage}
      </Snackbar>
      <Image style={{height:90,width:50,alignSelf:"center"}}source={require("../assets/logo.png")}/>
      <Text variant="headlineMedium" style={style.title}>
        Log In
      </Text>
      <TextInput
        mode="outlined"
        label={"Email"}
        value={userInfo["email"]}
        textContentType="emailAddress"
        keyboardType="email-address"
        style={style.textFieldStyle}
        onChangeText={(value: string) => handleChange("email", value)}
      />
      <TextInput
        mode="outlined"
        label={"Password"}
        onChangeText={(value: string) => handleChange("password", value)}
        style={style.textFieldStyle}
        secureTextEntry={true}
      />
      <Button mode="contained" onPress={loginUser} style={{ marginTop: 20,marginBottom:10 }}>
        Log In
      </Button>
      <Button onPress={goToSignUp}>Don't have an Account? Sign Up</Button>
    </View>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    padding: 30,
    flex: 1,
    justifyContent: "center"
  },
  title: {
    textAlign: "center"
  },
  checkBoxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textFieldStyle:{
    marginVertical:3,
    marginHorizontal:2
  },
});

export default Login;
