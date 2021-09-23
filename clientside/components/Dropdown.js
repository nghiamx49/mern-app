/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { Text, StyleSheet, View, Appearance } from "react-native";
import IonicIcon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

const DropdownCustom = ({
  name,
  handleTextInput,
  value,
  label,
  data,
  ...props
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.fieldContainer}>
        {props?.icon && (
          <View style={styles.iconContainer}>
            <IonicIcon name={props.icon} size={25} color="#9941ac" />
          </View>
        )}
        <View style={styles.formInput}>
          <Picker
            onValueChange={(val, index) => handleTextInput(val, name, label)}
            selectedValue={value}
            mode="dropdown"
            {...props}
            dropdownIconColor="#000"
            dropdownIconRippleColor="#000"
          >
            {data.map((item, index) => (
              <Picker.Item
                label={item.label}
                style={{
                  color: item.value === "" ? "gray" : "black",
                  backgroundColor:
                    Appearance.getColorScheme() === "dark" ? "#fff" : "#ooo",
                }}
                value={item.value}
                key={index}
                enabled={item.value !== ""}
              />
            ))}
          </Picker>
        </View>
        {props?.isRequired && <Text style={styles.required}>*</Text>}
      </View>
      {props?.error !== "" && (
        <Text style={styles.erorrMsg}>{props.error}</Text>
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
    paddingLeft: 25,
    paddingRight: 10,
    color: "black",
  },
  erorrMsg: {
    color: "red",
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 3,
  },
  fieldContainer: {
    position: "relative",
  },
  required: {
    color: "red",
    position: "absolute",
    top: 25,
    right: 10,
    textAlignVertical: "center",
    fontSize: 25,
  },
  iconContainer: {
    //backgroundColor: "#9941ac",
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

export default DropdownCustom;
