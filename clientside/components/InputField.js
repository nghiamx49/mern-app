import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import IonicIcon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

const InputField = ({ name, handleTextInput, value, label, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.fieldContainer}>
        {props?.icon && (
          <View style={styles.iconContainer}>
            <IonicIcon name={props.icon} size={25} color="#9941ac" />
          </View>
        )}
        <TextInput
          style={styles.formInput}
          onChangeText={(text) => handleTextInput(text, name, label)}
          defaultValue={value}
          {...props}
        />
        {(name === "password" || name === "confirmPwd") && (
          <View style={styles.secret}>
            <TouchableWithoutFeedback onPress={props?.handleToggle}>
              {props.secureTextEntry === true ? (
                <IonicIcon name={"eye-sharp"} size={35} color="#9941ac" />
              ) : (
                <IonicIcon name={"eye-off-sharp"} size={35} color="#9941ac" />
              )}
            </TouchableWithoutFeedback>
          </View>
        )}
        {props?.isRequired && <Text style={styles.required}>*</Text>}
      </View>
      {props?.error !== "" && (
        <Animatable.Text animation="bounceIn" style={styles.erorrMsg}>
          {props.error}
        </Animatable.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    width: 350,
    flex: 1,
  },
  inputLabel: {
    color: "#9941ac",
    fontSize: 20,
    fontWeight: "600",
  },
  formInput: {
    borderColor: "lightgray",
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 45,
    fontSize: 18,
    color: "black",
    fontWeight: "600",
  },
  erorrMsg: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 3,
  },
  fieldContainer: {
    position: "relative",
  },
  required: {
    color: "red",
    position: "absolute",
    top: 20,
    textAlignVertical: "center",
    right: 10,
    fontSize: 25,
  },
  secret: {
    position: "absolute",
    top: 17,
    right: 25,
  },
  iconContainer: {
    //backgroundColor: '#9941ac',
    height: 30,
    width: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "38%",
    left: 8,
  },
});

export default InputField;
