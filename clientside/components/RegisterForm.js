import React, { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { StyleSheet, View, Platform } from "react-native";

import InputField from "./InputField";

import Button from "./Button";
import DatePicker from "./DatePicker";
import CustomDilog from "./Dialog";

import RequestService from "../services/request.service";

const RegisterForm = ({ setSwitchTab }) => {
  const { create } = RequestService;

  const [account, setAccount] = useState({
    username: "",
    password: "",
    confirmPwd: "",
    fullName: "",
    dateOfBirth: new Date(),
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPwd: "",
    fullName: "",
    dateOfBirth: new Date(),
  });

  const [show, setShow] = useState(false);

  const [errorDialog, setErrorDialog] = useState({
    status: false,
    message: "",
  });

  const showMode = (currentMode) => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || account.dateOfBirth;
    setShow(Platform.OS === "ios");
    setAccount({ ...account, dateOfBirth: currentDate });
  };

  const [disable, setDisable] = useState(true);

  const [togglePwd, setTogglePwd] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);

  useEffect(() => {
    if (
      errors.username !== "" ||
      errors.password !== "" ||
      errors.confirmPwd !== "" ||
      errors.fullName !== "" ||
      account.username === "" ||
      account.password === "" ||
      account.confirmPwd === "" ||
      account.fullName === ""
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [errors, account]);

  const handleTextInput = (text, name, label) => {
    switch (name) {
      // case 'propertyType':
      // case 'bedRoom':
      case "username":
      case "password":
      case "fullName":
        if (text === "") {
          setErrors({ ...errors, [name]: `${label} must be filled` });
        } else {
          setErrors({ ...errors, [name]: "" });
          setAccount({ ...account, [name]: text });
        }
        break;
      case "confirmPwd":
        if (text === "") {
          setErrors({ ...errors, [name]: `${label} must be filled` });
        } else if (text !== account.password) {
          setErrors({
            ...errors,
            [name]: `${label} must be macthed the password`,
          });
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

  const [sucess, setSuccess] = useState(false);

  const handleToggle = () => {
    if (!sucess) {
      setErrorDialog({ ...errorDialog, status: !errorDialog.status });
    } else {
      setSwitchTab("login");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await create(
        "/auth/register",
        "none",
        JSON.stringify(account)
      );
      if (response.status === 400) {
        setErrorDialog({ status: true, message: response.data.message });
        setSuccess(false);
      } else {
        setErrorDialog({ status: true, message: response.data.message });
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePwd = () => {
    setTogglePwd(!togglePwd);
  };

  const handleToggleConfirm = () => {
    setToggleConfirm(!toggleConfirm);
  };

  return (
    <View style={styles.form}>
      <Animatable.View animation="slideInLeft" duration={700}>
        <InputField
          name="username"
          handleTextInput={handleTextInput}
          label="Username"
          value={account.username}
          error={errors.username}
          icon={"person-sharp"}
          isRequired
        />
        <InputField
          name="password"
          handleTextInput={handleTextInput}
          handleToggle={handleTogglePwd}
          label="Password"
          value={account.password}
          error={errors.password}
          icon={"key-sharp"}
          isRequired
          secureTextEntry={togglePwd}
        />
        <InputField
          name="confirmPwd"
          handleTextInput={handleTextInput}
          handleToggle={handleToggleConfirm}
          label="Confirm Password"
          value={account.confirmPwd}
          error={errors.confirmPwd}
          icon={"key-sharp"}
          isRequired
          secureTextEntry={toggleConfirm}
        />
        <InputField
          name="fullName"
          handleTextInput={handleTextInput}
          label="Full Name"
          value={account.fullName}
          error={errors.fullName}
          icon={"text-sharp"}
          isRequired
        />
        <DatePicker
          date={account.dateOfBirth}
          show={show}
          showMode={showMode}
          onChange={onChange}
          isRequired
          label="Date of Birth"
        />
        <Button disable={disable} handleSubmit={handleSubmit} />
      </Animatable.View>
      <CustomDilog
        toggle={errorDialog.status}
        handleToggle={handleToggle}
        message={errorDialog.message}
      />
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

export default RegisterForm;
