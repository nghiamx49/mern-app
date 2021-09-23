import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import SettingOption from "../components/SettingOption";
import { logout } from "../actions/auth";
import * as Animatable from "react-native-animatable";

const { width: screenWidth } = Dimensions.get("window");

const AccountScreen = ({ user, handleLogout }) => {
  const { username, fullName, dateOfBirth } = user;

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
          source={require("../assets/images/avatar.png")}
          style={styles.avt}
        />
        <View style={styles.accountDetail}>
          <Text style={styles.title}>{fullName}</Text>
          <Text style={styles.paragraph}>{username}</Text>
          <Text style={styles.paragraph}>
            {new Date(dateOfBirth).toLocaleDateString("vn-VN")}
          </Text>
        </View>
      </View>
      <View style={styles.optionGroup}>
        <SettingOption icon="image-sharp" title="Upload Avatar" />
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
});

const mapStateToProps = (state) => {
  return {
    user: state.authenticationReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
