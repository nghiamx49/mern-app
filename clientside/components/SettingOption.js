import React from "react";
import IonicIcon from "react-native-vector-icons/Ionicons";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const SettingOption = ({ icon, title, handlePress }) => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.option}>
        <IonicIcon name={icon} size={50} color="white" />
        <Text style={styles.optionText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#9941ac",
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: "#9941ac",
  },
  optionText: {
    fontSize: 25,
    fontWeight: "600",
    color: "white",
    paddingLeft: 10,
  },
});

export default SettingOption;
