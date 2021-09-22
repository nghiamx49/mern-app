import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import IonicIcon from "react-native-vector-icons/Ionicons";

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AppAuthenticate = () => {
  const [switchTab, setSwitchTab] = useState("login");

  const loginRef = useRef(null);

  const registerRef = useRef(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="margin"
      enabled
      keyboardVerticalOffset={10}
    >
      <ScrollView>
        <LinearGradient
          colors={["#ff00fe", "#9941ac", "#65056b"]}
          style={styles.header}
        >
          <Text style={styles.title}>Rental Z</Text>
          <IonicIcon name={"person-circle-sharp"} size={80} color="white" />
          <View style={styles.switchTab}>
            <View
              style={
                switchTab === "login"
                  ? styles.switchItemActive
                  : styles.switchItem
              }
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  loginRef.current.transition({ opacity: 0.2 }, { opacity: 1 });
                  return setSwitchTab("login");
                }}
              >
                <Animatable.Text
                  ref={loginRef}
                  style={
                    switchTab === "login"
                      ? styles.switchTextActive
                      : styles.switchText
                  }
                >
                  Login
                </Animatable.Text>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={
                switchTab === "register"
                  ? styles.switchItemActive
                  : styles.switchItem
              }
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  registerRef.current.transition(
                    { opacity: 0.2 },
                    { opacity: 1 }
                  );
                  setSwitchTab("register");
                }}
              >
                <Animatable.Text
                  ref={registerRef}
                  style={
                    switchTab === "register"
                      ? styles.switchTextActive
                      : styles.switchText
                  }
                >
                  Register
                </Animatable.Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </LinearGradient>
        {switchTab === "login" ? <LoginForm /> : <RegisterForm />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 200,
    borderBottomColor: "#65056b",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
  },
  switchTab: {
    marginTop: 20,
    flexDirection: "row",
  },
  switchItem: {
    marginHorizontal: 10,
  },
  switchItemActive: {
    borderBottomColor: "#e3cee4",
    borderBottomWidth: 2,
    marginHorizontal: 10,
  },
  switchText: {
    color: "darkgray",
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
  },
  switchTextActive: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default AppAuthenticate;
