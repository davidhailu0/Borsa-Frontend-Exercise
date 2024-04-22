import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
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
    profilePic: "",
  });
  const [userInfoError, setUserInfoError] = useState({
    firstNameError: false,
    lastNameError: false,
    emailError: false,
    userNameError: false,
    passwordError: false,
    confirmPasswordError: false,
    addressError: false,
    isBuyer: false,
    profilePic: "",
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
    if (userInfo.firstName == "") {
      setUserInfoError((prev) => ({ ...prev, firstNameError: true }));
    }
    if (userInfo.lastName == "") {
      setUserInfoError((prev) => ({ ...prev, lastNameError: true }));
    }
    if (userInfo.email == "") {
      setUserInfoError((prev) => ({ ...prev, emailError: true }));
    }
    if (userInfo.userName == "") {
      setUserInfoError((prev) => ({ ...prev, userNameError: true }));
    }
    if (userInfo.password === "") {
      setUserInfoError((prev) => ({ ...prev, passwordError: true }));
    }
    if (userInfo.confirmPassword === "") {
      setUserInfoError((prev) => ({ ...prev, confirmPasswordError: true }));
    }
    if (userInfo.password === userInfo.confirmPassword) {
      setUserInfoError((prev) => ({
        ...prev,
        passwordError: true,
        confirmPasswordError: true,
      }));
    }
    if (userInfo.address === "") {
      setUserInfoError((prev) => ({ ...prev, addressError: true }));
    }
    const flag = Object.values(userInfoError).filter((vl) => vl);
    if (flag) {
      setSnackBar({
        showSnackBar: true,
        snackBarMessage: "Please Enter All The Required Fields",
      });
      return;
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
          width: "100%",
          minWidth: "100%",
          justifyContent: "center",
        }}
        visible={snackBar.showSnackBar}
        onDismiss={dismissSnackBar}
      >
        {snackBar.snackBarMessage}
      </Snackbar>
      <Text variant="headlineMedium" style={style.title}>
        Sign Up
      </Text>
      <View style={style.nameContainer}>
        <TextInput
          mode="outlined"
          label={"First Name"}
          value={userInfo["firstName"]}
          style={{ width: "50%" }}
          error={userInfoError["firstNameError"]}
          onChangeText={(value: string) => handleChange("firstName", value)}
        />
        <TextInput
          mode="outlined"
          label={"Last Name"}
          value={userInfo["lastName"]}
          style={{ width: "50%" }}
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
        onChangeText={(value: string) => handleChange("userName", value)}
      />
      <TextInput
        mode="outlined"
        label={"Password"}
        onChangeText={(value: string) => handleChange("password", value)}
        error={userInfoError["passwordError"]}
        secureTextEntry={true}
      />
      <TextInput
        mode="outlined"
        label={"Confirm Password"}
        onChangeText={(value: string) => handleChange("confirmPassword", value)}
        error={userInfoError["confirmPasswordError"]}
        secureTextEntry={true}
      />
      <TextInput
        mode="outlined"
        label={"Address"}
        placeholder="City, Country"
        value={userInfo["address"]}
        error={userInfoError["addressError"]}
        onChangeText={(value: string) => handleChange("address", value)}
      />
      <View style={style.checkBoxContainer}>
        <Text style={{ color: "#fff" }}>Is Buyer</Text>
        <Checkbox
          status={userInfo.isBuyer ? "checked" : "unchecked"}
          uncheckedColor="#fff"
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
