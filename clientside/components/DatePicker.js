import React from "react";

import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import IonicIcon from "react-native-vector-icons/Ionicons";

const DatePicker = ({ showMode, date, show, onChange, label, ...props }) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TouchableOpacity onPress={showMode}>
          <View style={styles.fieldContainer}>
            <View style={styles.iconContainer}>
              <IonicIcon name="calendar" size={25} color="#9941ac" />
            </View>
            <Text style={styles.formInput}>{`${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`}</Text>
            {props?.isRequired && <Text style={styles.required}>*</Text>}
          </View>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </>
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
    paddingHorizontal: 40,
    height: 50,
    color: "black",
    textAlignVertical: "center",
  },
  iconContainer: {
    height: 25,
    width: 25,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "38%",
    left: 10,
  },
  required: {
    color: "red",
    position: "absolute",
    top: 15,
    right: 10,
    fontSize: 25,
  },
});

export default DatePicker;
