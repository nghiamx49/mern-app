import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { HOST } from "@env";
import IonicIcon from "react-native-vector-icons/Ionicons";

const AlternativeItem = ({
  item,
  navigation,
  handleEdit,
  handleRemove,
  handleAddNote,
}) => {
  const { listImage, monthlyRentPrice, location } = item;

  const defaultImageAnimated = new Animated.Value(0),
    imageAnimated = new Animated.Value(0);

  const handleDefaultImageLoaded = Animated.timing(defaultImageAnimated, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
  const handleImageAnimagted = Animated.timing(imageAnimated, {
    toValue: 1,
    useNativeDriver: true,
  }).start();

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
          <Animated.Image
            source={require("../assets/images/default.jpg")}
            style={[styles.itemImg, { opacity: defaultImageAnimated }]}
            parallaxFactor={0.4}
            onLoad={handleDefaultImageLoaded}
            blurRadius={1}
          />
          <Animated.Image
            source={{ uri: HOST + listImage[0].imageUrl.slice(1) }}
            parallaxFactor={0.4}
            style={[
              styles.itemImg,
              { opacity: imageAnimated },
              styles.imageOverlay,
            ]}
            onLoad={handleDefaultImageLoaded}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.address}>{location.address}</Text>
            <Text style={styles.price}>{`${monthlyRentPrice}$`}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <ScrollView horizontal={true}>
          {handleAddNote && (
            <TouchableOpacity onPress={() => handleAddNote(item)}>
              <View style={styles.iconNote}>
                <IonicIcon
                  name={"clipboard"}
                  size={30}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.textBtn}>
                  {item?.description === "" ? "Add" : "Edit"} Description
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {handleEdit && (
            <TouchableOpacity onPress={() => handleEdit(item)}>
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
        </ScrollView>
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
  iconNote: {
    backgroundColor: "#b1cb00",
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
  imageOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default AlternativeItem;
