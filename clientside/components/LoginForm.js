import React, { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { StyleSheet, View } from "react-native";

import InputField from "./InputField";
import Button from "./Button";
import RequestService from "../services/request.service";
import CustomDilog from "./Dialog.js";
import { connect } from "react-redux";

import { loginSuccess } from "../actions/auth";

const LoginForm = ({ login, ...props }) => {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const { authentication } = RequestService;

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [disable, setDisable] = useState(true);

  const [toggleSecret, setToggleSecret] = useState(true);

  const [errorDialog, setErrorDialog] = useState(false);

  const handleErrorDialog = () => {
    setErrorDialog(!errorDialog);
  };

  useEffect(() => {
    if (
      errors.username !== "" ||
      errors.password !== "" ||
      account.username === "" ||
      account.password === ""
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [errors.username, errors.password, account.username, account.password]);

  const handleTextInput = (text, name, label) => {
    switch (name) {
      // case 'propertyType':
      // case 'bedRoom':
      case "username":
      case "password":
        if (text === "") {
          setErrors({ ...errors, [name]: `${label} must be filled` });
        } else {
          setErrors({ ...errors, [name]: "" });
          setAccount({ ...account, [name]: text });
        }
        break;
      default:
        setAccount({ ...account, [name]: text });
        break;
    }
  };

  const handleToggle = () => {
    setToggleSecret(!toggleSecret);
  };

  const handleLogin = async () => {
    try {
      const response = await authentication(account);
      if (response.status === 200) {
        login(response.data);
      } else {
        setErrorDialog(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.form}>
      <Animatable.View animation="slideInRight" duration={700}>
        <InputField
          name="username"
          handleTextInput={handleTextInput}
          label="Username"
          value={account.username}
          error={errors.username}
          icon={"person-sharp"}
          autoCapitalize="none"
          isRequired
        />
        <InputField
          name="password"
          handleTextInput={handleTextInput}
          handleToggle={handleToggle}
          label="Password"
          value={account.password}
          error={errors.password}
          icon={"key-sharp"}
          isRequired
          secureTextEntry={toggleSecret}
        />
        <Button disable={disable} handleSubmit={handleLogin} />
        <CustomDilog
          toggle={errorDialog}
          handleToggle={handleErrorDialog}
          message="Username or Password is wrong, please try again!"
        />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    login: (payload) => dispatch(loginSuccess(payload)),
  };
};

export default connect(null, mapDispatchToProps)(LoginForm);
