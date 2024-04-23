import { useState, useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import { View } from "react-native";
import {
  Text,
  TextInput,
  Checkbox,
  Button,
  Snackbar,
} from "react-native-paper";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import validator from 'validator';
import { register } from "../state/authSlice";
import User from "../interfaces/User";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    address: "",
    isBuyer: false,
    profilePic: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
  });
  const [userInfoError, setUserInfoError] = useState({
    firstNameError: false,
    lastNameError: false,
    emailError: false,
    userNameError: false,
    passwordError: false,
    confirmPasswordError: false,
    addressError: false,
  });
  const [snackBar, setSnackBar] = useState({
    showSnackBar: false,
    snackBarMessage: "",
  });
  useEffect(() => {
    getLocation();
  }, []);
  const dispatch = useDispatch();

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    getCityAndCountry(location.coords.latitude, location.coords.longitude);
  };

  const getCityAndCountry = async (latitude: number, longitude: number) => {
    try {
      const address = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}9&longitude=${longitude}`
      );
      const json = await address.json();
      setUserInfo((prev) => ({
        ...prev,
        address: json["city"] + ", " + json["countryName"],
      }));
    } catch (error: any) {
      return { city: null, country: null };
    }
  };
  const dismissSnackBar = () => {
    setSnackBar((prev) => ({ ...prev, showSnackBar: false }));
  };

  const handleChange = (name: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setUserInfoError((prev) => ({ ...prev, [name + "Error"]: false }));
  };

  const goToLogin = () => {
    router.replace("/Login");
  };

  const registerUser = async () => {
    let errorMessage = ""
    if (userInfo.firstName == ""||!validator.isAlpha(userInfo['firstName'])) {
      errorMessage = "First Name is Empty or Contains Invalid Characters"
      setUserInfoError((prev) => ({ ...prev, firstNameError: true }));
    }
    if (userInfo.lastName == ""||!validator.isAlpha(userInfo['lastName'])) {
      errorMessage = errorMessage==""?"Last Name is Empty or Contains Invalid Characters":errorMessage
      setUserInfoError((prev) => ({ ...prev, lastNameError: true }));
    }
    if (userInfo.email == ""||!validator.isEmail(userInfo['email'])) {
      errorMessage = errorMessage==""?"Email is Empty or It is Invalid Email":errorMessage
      setUserInfoError((prev) => ({ ...prev, emailError: true }));
    }
    if (userInfo.userName == "") {
      errorMessage = errorMessage==""?"Username is Empty":errorMessage
      setUserInfoError((prev) => ({ ...prev, userNameError: true }));
    }
    if (userInfo.password === ""||!validator.isStrongPassword(userInfo['password']!)) {
      errorMessage = errorMessage==""?"Password is not Strong":errorMessage
      setUserInfoError((prev) => ({ ...prev, passwordError: true }));
    }
    if (userInfo.confirmPassword === ""||!validator.isStrongPassword(userInfo['confirmPassword']!)) {
      errorMessage = errorMessage==""?"Confirm Password is not Strong":errorMessage
      setUserInfoError((prev) => ({ ...prev, confirmPasswordError: true }));
    }
    if (userInfo.password != userInfo.confirmPassword) {
      errorMessage = errorMessage==""?"Password and Confirm Password don't match":errorMessage
      setUserInfoError((prev) => ({
        ...prev,
        passwordError: true,
        confirmPasswordError: true,
      }));
    }
    if (userInfo.address === "") {
      errorMessage = errorMessage==""?"Address is Empty":errorMessage
      setUserInfoError((prev) => ({ ...prev, addressError: true }));
    }
    if(errorMessage!=""){
      setSnackBar({showSnackBar:true,snackBarMessage:errorMessage})
      return
    }
    fetch(process.env.EXPO_PUBLIC_API_URL + "/register/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then(async (resp) => {
        const json = await resp.json();
        if ("token" in json) {
          setSnackBar({
            showSnackBar: true,
            snackBarMessage: "You have Successfully Registered",
          });
          dispatch(register(json));
          setTimeout(() => {
            router.replace("/Home");
          }, 2000);
        } else if ("message" in json) {
          setSnackBar({
            showSnackBar: true,
            snackBarMessage: json["message"] + " Please Login",
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
        Sign Up
      </Text>
      <View style={style.nameContainer}>
        <TextInput
          mode="outlined"
          label={"First Name"}
          value={userInfo["firstName"]}
          style={{ width: "50%",marginVertical:7,
          marginHorizontal:2 }}
          error={userInfoError["firstNameError"]}
          onChangeText={(value: string) => handleChange("firstName", value)}
        />
        <TextInput
          mode="outlined"
          label={"Last Name"}
          value={userInfo["lastName"]}
          style={{ width: "50%",marginVertical:7,
          marginHorizontal:2 }}
          error={userInfoError["lastNameError"]}
          onChangeText={(value: string) => handleChange("lastName", value)}
        />
      </View>
      <TextInput
        mode="outlined"
        label={"Email"}
        value={userInfo["email"]}
        textContentType="emailAddress"
        keyboardType="email-address"
        error={userInfoError["emailError"]}
        onChangeText={(value: string) => handleChange("email", value)}
      />
      <TextInput
        mode="outlined"
        label={"Username"}
        value={userInfo["userName"]}
        error={userInfoError["userNameError"]}
        style={style.textFieldStyle}
        onChangeText={(value: string) => handleChange("userName", value)}
      />
      <TextInput
        mode="outlined"
        label={"Password"}
        onChangeText={(value: string) => handleChange("password", value)}
        style={style.textFieldStyle}
        error={userInfoError["passwordError"]}
        secureTextEntry={true}
      />
      <TextInput
        mode="outlined"
        label={"Confirm Password"}
        onChangeText={(value: string) => handleChange("confirmPassword", value)}
        style={style.textFieldStyle}
        error={userInfoError["confirmPasswordError"]}
        secureTextEntry={true}
      />
      <TextInput
        mode="outlined"
        label={"Address"}
        placeholder="City, Country"
        value={userInfo["address"]}
        style={style.textFieldStyle}
        error={userInfoError["addressError"]}
        onChangeText={(value: string) => handleChange("address", value)}
      />
      <TextInput
        mode="outlined"
        label={"Profile Pic"}
        value={userInfo['profilePic']}
        style={style.textFieldStyle}
        onChangeText={(value: string) => handleChange("address", value)}
      />
      <View style={style.checkBoxContainer}>
        <Text>Is Buyer</Text>
        <Checkbox
          status={userInfo.isBuyer ? "checked" : "unchecked"}
          onPress={() =>
            setUserInfo((prev) => ({ ...prev, isBuyer: !prev.isBuyer }))
          }
        />
      </View>
      <Button mode="contained" onPress={registerUser}>
        Sign Up
      </Button>
      <Button onPress={goToLogin}>Already Have an Account?</Button>
    </View>
  );
};

const style = StyleSheet.create({
  textFieldStyle:{
    marginVertical:3,
    marginHorizontal:2
  },
  mainContainer: {
    padding: 30,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: "row",
  },
  checkBoxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  snackBarStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    width: "100%",
  },
});

export default SignUp;
