import { useState } from "react";
import {
  Avatar,
  Snackbar,
  Text,
  TextInput,
  Button,
  Checkbox,
} from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import User from "../../interfaces/User";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state:any)=>state.auth)
  const [userInfo, setUserInfo] = useState<User>({
    firstName: user["firstName"],
    lastName: user["lastName"],
    email: user["email"],
    userName: user["userName"],
    address: user["address"],
    isBuyer: user["isBuyer"],
    profilePic: user["profilePic"],
  });
  const [snackBar, setSnackBar] = useState({
    showSnackBar: false,
    snackBarMessage: "",
  });
  const dismissSnackBar = () => {
    setSnackBar((prev) => ({ ...prev, showSnackBar: false }));
  };
  const handleChange = (name: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const updateUser = async () => {
    fetch(process.env.EXPO_PUBLIC_API_URL + `/profile?id=${user["_id"]}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then(async (resp) => {
        const json = await resp.json();
        if ("_id" in json) {
          setSnackBar({
            showSnackBar: true,
            snackBarMessage: "You have Successfully Updated Your Profile",
          });
        } else if ("message" in json) {
          setSnackBar({
            showSnackBar: true,
            snackBarMessage: json["message"] + " Please Login",
          });
        }
      })
      .catch((e) => {
        setSnackBar({
          showSnackBar: true,
          snackBarMessage: e.message,
        });
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
      <Avatar.Image style={{margin:"auto",alignSelf:"center"}} source={{uri:"https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"}} />
      <View style={style.nameContainer}>
        <TextInput
          mode="outlined"
          label={"First Name"}
          value={userInfo["firstName"]}
          style={{ width: "50%" }}
          onChangeText={(value: string) => handleChange("firstName", value)}
        />
        <TextInput
          mode="outlined"
          label={"Last Name"}
          value={userInfo["lastName"]}
          style={{ width: "50%" }}
          onChangeText={(value: string) => handleChange("lastName", value)}
        />
      </View>
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
        label={"Username"}
        value={userInfo["userName"]}
        onChangeText={(value: string) => handleChange("userName", value)}
      />
      <TextInput
        mode="outlined"
        label={"Address"}
        placeholder="City, Country"
        value={userInfo["address"]}
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
      <Button mode="contained" onPress={updateUser}>
        Update User Profile
      </Button>
    </View>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    padding: 30,
    flex: 1,
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

export default Profile;