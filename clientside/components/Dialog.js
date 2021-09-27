import React from "react";
import { Text, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";

const CustomDilog = ({ toggle, handleToggle, message }) => {
  return (
    <Dialog.Container visible={toggle}>
      <Dialog.Title>Error</Dialog.Title>
      <Dialog.Description>
        <Text style={styles.errorMsg}>{message}</Text>
      </Dialog.Description>
      <Dialog.Button onPress={handleToggle} label="Cancel" />
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  errorMsg: {
    color: "red",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default CustomDilog;
