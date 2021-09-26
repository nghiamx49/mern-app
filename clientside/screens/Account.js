import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import SettingOption from "../components/SettingOption";
import { logout } from "../actions/auth";
import * as Animatable from "react-native-animatable";
import { launchCamera } from "react-native-image-picker";

import { HOST } from "@env";

import RequestService from "../services/request.service";

import { updateAvt } from "../actions/auth";
const { width: screenWidth } = Dimensions.get("window");

const AccountScreen = ({ user, handleLogout, token, changeAvatar }) => {
  const { username, fullName, dateOfBirth } = user;

  const [avt, setAvt] = useState({});

  const handleImagePicker = () => {
    try {
      launchCamera(
        {
          mediaType: "photo",
          noData: true,
          cameraType: "front",
        },
        (responses) => {
          if (responses.didCancel) {
            setAvt({});
          } else {
            setAvt(responses.assets[0]);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setAvt({});
  };

  const { update } = RequestService;

  const handleSaveChange = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", {
        name: avt.fileName,
        type: avt.type,
        uri: Platform.OS === "ios" ? avt.uri.replace("file://", "") : avt.uri,
      });
      console.log(formData._parts);
      const response = await update("/auth/update_avatar", token, formData);
      if (response?.status === 200) {
        await changeAvatar(response.data.updateAvt);
        setAvt({});
        Alert.alert("Success", "Avatar Updated");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user.avatar);

  return (
    <Animatable.View
      style={styles.container}
      animation={{ from: { left: -400 }, to: { left: 0 } }}
      easing="linear"
      duration={300}
    >
      <Image
        source={require("../assets/images/background.jpg")}
        style={styles.backdrop}
      />
      <View style={styles.infoContainer}>
        <Image
          source={
            avt?.uri
              ? { uri: avt.uri }
              : user.avatar !== ""
              ? { uri: HOST + user.avatar }
              : require("../assets/images/avatar.png")
          }
          style={styles.avt}
        />
        <View style={styles.accountDetail}>
          <Text style={styles.title}>{fullName}</Text>
          <Text style={styles.paragraph}>{username}</Text>
          <Text style={styles.paragraph}>
            {new Date(dateOfBirth).toLocaleDateString("vn-VN")}
          </Text>
          {avt?.uri && (
            <View style={styles.handleContainer}>
              <TouchableOpacity onPress={handleCancel} style={styles.save}>
                <Text style={styles.saveText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveChange} style={styles.save}>
                <Text style={styles.saveText}>Save Avatar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.optionGroup}>
        <SettingOption
          icon="image-sharp"
          handlePress={handleImagePicker}
          title="Upload Avatar"
        />
        <SettingOption
          icon="log-out-sharp"
          title="Logout"
          handlePress={() => handleLogout()}
        />
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
    alignItems: "center",
  },
  backdrop: {
    height: "50%",
    width: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    flexDirection: "row",
    // width: '80%',
    position: "absolute",
    backgroundColor: "white",
    top: "35%",
    left: "5%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
    elevation: 5,
    borderRadius: 20,
    height: 150,
  },
  avt: {
    width: 150,
    height: 200,
    bottom: "23%",
    borderRadius: 40,
    borderColor: "white",
    borderWidth: 0,
    shadowColor: "white",
  },
  save: {
    backgroundColor: "#9941ac",
    borderRadius: 6,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  accountDetail: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  paragraph: {
    fontSize: 18,
    fontWeight: "600",
    color: "darkgray",
    marginVertical: 5,
  },
  optionGroup: {
    marginTop: "20%",
  },
  handleContainer: {
    flexDirection: "row",
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.authenticationReducer.user,
    token: state.authenticationReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: () => dispatch(logout()),
    changeAvatar: (link) => dispatch(updateAvt(link)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
