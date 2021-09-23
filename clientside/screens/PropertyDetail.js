import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { HOST } from "@env";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

import Swiper from "react-native-swiper";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const PropertyDetailScreen = ({ route }) => {
  const {
    item: {
      propertyType,
      listImage,
      monthlyRentPrice,
      bedRoom,
      furnitureType,
      description,
      location: { address, geocode },
    },
  } = route.params;
  console.log(geocode);
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{propertyType}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.info}>
            <Text style={styles.data}>Address: </Text>
            <Text>{address}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.data}>Rent Price/Month: </Text>
            <Text>{monthlyRentPrice}$</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.data}>Bed Room Type: </Text>
            <Text>{bedRoom}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.data}>Furniture Type: </Text>
            <Text>{furnitureType}</Text>
          </View>
        </View>
        <View style={styles.slideContainer}>
          <Swiper
            containerStyle={styles.slider}
            height={screenHeight * 0.5}
            width={screenWidth}
            horizontal={true}
            loop={true}
          >
            {listImage.map((item, key) => (
              <Image
                key={key}
                source={{ uri: HOST + item.imageUrl.slice(1) }}
                style={styles.img}
              />
            ))}
          </Swiper>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionTitle}>Decription:</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <Text style={styles.mapTitle}>Location On Maps:</Text>
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(geocode.split(",")[0]),
              longitude: parseFloat(geocode.split(",")[1]),
              latitudeDelta: 0.006,
              longitudeDelta: 0.009,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(geocode.split(",")[0]),
                longitude: parseFloat(geocode.split(",")[1]),
              }}
              title={address}
            />
          </MapView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  infoContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  info: {
    flexDirection: "row",
  },
  data: {
    fontWeight: "bold",
  },
  slideContainer: {
    height: 300,
    margin: 0,
  },
  slider: {
    width: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  description: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  descriptionTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  descriptionText: {},
  mapTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  mapContainer: {
    marginVertical: 10,
    width: screenWidth,
    height: screenHeight * 0.5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default PropertyDetailScreen;
