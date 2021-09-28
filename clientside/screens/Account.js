import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import SpashScreen from "react-native-splash-screen";
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
  let formatDate = new Date(dateOfBirth);

  const defaultImageAnimated = new Animated.Value(0),
    imageAnimated = new Animated.Value(0);

  const handleDefaultImageLoaded = Animated.timing(defaultImageAnimated, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
  const handleImageAnimagted = Animated.timing(imageAnimated, {
    toValue: 1,
    useNativeDriver: true,
  }).start();

  const [avt, setAvt] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const handleImagePicker = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        granted = await PermissionsAndroid.replace(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
      }
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
            console.log(responses.assets);
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
      setIsLoading(true);
      const formData = new FormData();
      formData.append("avatar", {
        name: avt.fileName,
        type: avt.type,
        uri: Platform.OS === "ios" ? avt.uri.replace("file://", "") : avt.uri,
      });
      const response = await update("/auth/update_avatar", token, formData);
      if (response?.status === 200) {
        await changeAvatar(response.data.updateAvt);
        setAvt({});
        setIsLoading(false);
        Alert.alert("Success", "Avatar Updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        <Animated.Image
          source={require("../assets/images/default.jpg")}
          style={[styles.avt, { opacity: defaultImageAnimated }]}
          onLoad={handleDefaultImageLoaded}
          blurRadius={1}
        />
        <Animated.Image
          source={
            avt?.uri
              ? { uri: avt.uri }
              : user.avatar !== ""
              ? { uri: HOST + user.avatar }
              : require("../assets/images/avatar.png")
          }
          style={[
            styles.avt,
            { opacity: defaultImageAnimated },
            styles.avtOverlay,
          ]}
          onLoad={handleDefaultImageLoaded}
        />
        <View style={styles.accountDetail}>
          <Text style={styles.title}>{fullName}</Text>
          <Text style={styles.paragraph}>{username}</Text>
          <Text style={styles.paragraph}>
            {`${formatDate.getDate()}/${formatDate.getMonth()}/${formatDate.getFullYear()}`}
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
          handlePress={() => {
            SpashScreen.show();
            handleLogout();
          }}
        />
      </View>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  loading: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 10,
    elevation: 10,
    justifyContent: "center",
  },
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
    zIndex: 5,
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
  avtOverlay: {
    position: "absolute",
    bottom: "18%",
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
