import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { HOST } from "@env";
import { TouchableOpacity } from "react-native-gesture-handler";
import IonicIcon from "react-native-vector-icons/Ionicons";

const AlternativeItem = ({ item, navigation, handleEdit, handleRemove }) => {
  const { listImage, monthlyRentPrice, location } = item;

  const alertOnPress = () => {
    Alert.alert("Confirm", "Are you sure to delete this item?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleRemove(item._id),
        style: "default",
      },
    ]);
  };

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
          />
          <View style={styles.itemInfo}>
            <Text style={styles.address}>{location.address}</Text>
            <Text style={styles.price}>{`${monthlyRentPrice}$`}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {handleEdit && (
          <TouchableOpacity>
            <View style={styles.iconEdit}>
              <IonicIcon
                name={"create-sharp"}
                size={30}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.textBtn}>Edit</Text>
            </View>
          </TouchableOpacity>
        )}
        {handleRemove && (
          <TouchableOpacity onPress={alertOnPress}>
            <View style={styles.iconRemove}>
              <IonicIcon
                name={"trash-sharp"}
                size={30}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.textBtn}>Remove</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
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
    height: 300,
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
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconEdit: {
    backgroundColor: "green",
    marginRight: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  iconRemove: {
    backgroundColor: "red",
    marginRight: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    paddingVertical: 5,
    paddingLeft: 10,
  },
  textBtn: {
    color: "#fff",
    paddingVertical: 5,
    paddingRight: 10,
  },
});

export default AlternativeItem;
