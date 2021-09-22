import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

const CategoryItem = ({ activeItem, handleTouched, value, label }) => {
  return (
    <TouchableOpacity onPress={() => handleTouched(value)}>
      <View
        style={activeItem === value ? styles.categoryActive : styles.category}
      >
        <Text
          style={activeItem === value ? styles.cateTextActive : styles.cateText}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryActive: {
    backgroundColor: "#9941ac",
    borderRadius: 40,
    borderColor: "#9941ac",
    borderWidth: 2,
    marginRight: 15,
  },
  category: {
    backgroundColor: "#fff",
    borderColor: "#9941ac",
    borderWidth: 2,
    borderRadius: 40,
    marginRight: 15,
  },
  cateText: {
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: "600",
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.6)",
  },
  cateTextActive: {
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: "600",
    fontSize: 18,
    color: "#fff",
  },
});

export default CategoryItem;
