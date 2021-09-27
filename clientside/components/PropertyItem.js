import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { HOST } from "@env";
import IonicIcon from "react-native-vector-icons/Ionicons";

const PropertyItem = ({ item, navigation, handleAdd }, parallaxProps) => {
  const { listImage, monthlyRentPrice, location } = item;

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { item: item })}
      >
        <View>
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
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleAdd(item._id)}>
        <View style={styles.btnContainer}>
          <IonicIcon name={"add-circle-sharp"} size={30} color="#fff" />
          <Text style={styles.btnText}>Add To Favorite List</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    width: screenWidth - 80,
    borderRadius: 15,
    padding: 10,
    marginVertical: 20,
  },
  itemImg: {
    width: "100%",
    height: 200,
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
  btnContainer: {
    backgroundColor: "blue",
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 17,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
export default PropertyItem;
