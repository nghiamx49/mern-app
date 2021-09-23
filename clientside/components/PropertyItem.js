import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { HOST } from "@env";

const PropertyItem = ({ item, navigation }, parallaxProps) => {
  const { listImage, monthlyRentPrice, location } = item;

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("Detail", { item: item })}
    >
      <View style={styles.item}>
        <Image
          style={styles.itemImg}
          source={{ uri: HOST + listImage[0].imageUrl.slice(1) }}
          parallaxFactor={0.4}
          showSpinner={true}
          {...parallaxProps}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.address}>{location.address}</Text>
          <Text style={styles.price}>{`${monthlyRentPrice}$`}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    width: screenWidth - 80,
    height: screenWidth - 60,
    borderRadius: 15,
    padding: 10,
    marginVertical: 20,
  },
  itemImg: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  itemInfo: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
  },
});
export default PropertyItem;
