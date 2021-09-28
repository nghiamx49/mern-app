import React from "react";

import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const Button = ({ disable, handleSubmit, title }) => {
  return (
    <View style={styles.btnContainer}>
      <TouchableOpacity
        disabled={disable}
        style={disable ? styles.btnDisable : styles.btnSubmit}
        onPress={handleSubmit}
      >
        <Text style={styles.btnTitle}>{title || "Submit"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: 350,
    marginTop: 30,
    marginBottom: 20,
  },
  btnSubmit: {
    borderRadius: 10,
    width: "100%",
    marginRight: 40,
    backgroundColor: "#9941ac",
    borderWidth: 1,
    borderColor: "#fff",
  },
  btnDisable: {
    borderRadius: 10,
    width: "100%",
    marginRight: 40,
    backgroundColor: "#c9c5c5",
    borderWidth: 1,
    borderColor: "#fff",
  },
  btnTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 10,
    textAlign: "center",
    color: "white",
  },
});

export default Button;
