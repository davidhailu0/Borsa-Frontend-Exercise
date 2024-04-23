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
import validator from "validator";
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
  //handles For Error Input 
  const [userInfoError, setUserInfoError] = useState({
    firstNameError: false,
    lastNameError: false,
    emailError: false,
    userNameError: false,
    addressError: false,
  });
  //sets the Snackbar messages and status
  const [snackBar, setSnackBar] = useState({
    showSnackBar: false,
    snackBarMessage: "",
  });
  const dismissSnackBar = () => {
    setSnackBar((prev) => ({ ...prev, showSnackBar: false }));
  };
  //for handling user input change
  const handleChange = (name: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setUserInfoError((prev) => ({ ...prev, [name + "Error"]: false }));
  };

  // Set the Change to initial data if error happened
  const setToInitialData = ()=>{
    setUserInfo({
      firstName: user["firstName"],
      lastName: user["lastName"],
      email: user["email"],
      userName: user["userName"],
      address: user["address"],
      isBuyer: user["isBuyer"],
      profilePic: user["profilePic"],
    })
  }

  //validates and requests for updating the User data
  const updateUser = async () => {
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
    if (userInfo.address === "") {
      errorMessage = errorMessage==""?"Address is Empty":errorMessage
      setUserInfoError((prev) => ({ ...prev, addressError: true }));
    }
    if(errorMessage!=""){
      setSnackBar({showSnackBar:true,snackBarMessage:errorMessage})
      return
    }
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
          setToInitialData()
          setSnackBar({
            showSnackBar: true,
            snackBarMessage: json["message"],
          });
        }
      })
      .catch((e) => {
        setToInitialData()
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
      <Avatar.Image style={{margin:"auto",alignSelf:"center",marginBottom:15}} source={{uri:"https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"}} />
      <View style={style.nameContainer}>
        <TextInput
          mode="outlined"
          label={"First Name"}
          value={userInfo["firstName"]}
          style={{ width: "50%",marginVertical:3,
          marginHorizontal:2 }}
          error={userInfoError['firstNameError']}
          onChangeText={(value: string) => handleChange("firstName", value)}
        />
        <TextInput
          mode="outlined"
          label={"Last Name"}
          value={userInfo["lastName"]}
          style={{ width: "50%",marginVertical:3,
          marginHorizontal:2 }}
          error={userInfoError['lastNameError']}
          onChangeText={(value: string) => handleChange("lastName", value)}
        />
      </View>
      <TextInput
        mode="outlined"
        label={"Email"}
        value={userInfo["email"]}
        textContentType="emailAddress"
        keyboardType="email-address"
        style={style.textFieldStyle}
        error={userInfoError['emailError']}
        onChangeText={(value: string) => handleChange("email", value)}
      />
      <TextInput
        mode="outlined"
        label={"Username"}
        value={userInfo["userName"]}
        style={style.textFieldStyle}
        error={userInfoError['userNameError']}
        onChangeText={(value: string) => handleChange("userName", value)}
      />
      <TextInput
        mode="outlined"
        label={"Address"}
        placeholder="City, Country"
        style={style.textFieldStyle}
        value={userInfo["address"]}
        error={userInfoError['addressError']}
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
  textFieldStyle:{
    marginVertical:3,
    marginHorizontal:2,
    width:"102%"
  },
});

export default Profile;
