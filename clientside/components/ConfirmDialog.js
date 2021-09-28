import React from "react";
import Dialog from "react-native-dialog";
import { Text, View, StyleSheet, Appearance } from "react-native";

const ConfirmDialog = ({ toggle, handleSubmit, handleToggle, data }) => {
  const renderList = Object.keys(data);

  return (
    <Dialog.Container visible={toggle}>
      <Dialog.Title>Preview</Dialog.Title>
      <Dialog.Description>
        <View style={styles.itemContainer}>
          {renderList.map((item) => (
            <View style={styles.item} key={renderList.indexOf(item)}>
              <Text style={styles.itemText}>{`${item}:`}</Text>
              <Text style={styles.itemText}>
                {data[item] instanceof Date
                  ? `${data[item].getDate()}/${
                      data[item].getMonth() + 1
                    }/${data[item].getFullYear()}`
                  : data[item].toString()}
              </Text>
            </View>
          ))}
        </View>
      </Dialog.Description>
      <Dialog.Button label="Back To Edit" onPress={handleToggle} />
      <Dialog.Button label="Submit" onPress={handleSubmit} />
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 0.8,
  },
  item: {
    flexDirection: "row",
    flex: 0.8,
  },
  itemText: {
    color: Appearance.getColorScheme() === "dark" ? "#fff" : "black",
    maxWidth: 350,
    textAlign: "center",
  },
  fieldContainer: {
    position: "relative",
  },
});

export default ConfirmDialog;
