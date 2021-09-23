import React, { useCallback, useRef, useState } from "react";

import { listProperty } from "../costants";
import { useFocusEffect } from "@react-navigation/native";

import {
  scrollInterpolators,
  animatedStyles,
} from "../components/CaroselAnimation";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import RequestService from "../services/request.service";
import IoniIcon from "react-native-vector-icons/Ionicons";
import CategoryItem from "../components/CategoryItem";
import PropertyItem from "../components/PropertyItem";
import { connect } from "react-redux";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ token, navigation }) => {
  const [searchParam, setSearchParam] = useState("");

  const [activeItem, setActiveItem] = useState("");

  const { get } = RequestService;

  const [listData, setListData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          const response = await get("/properties/", token);
          if (isActive) {
            setListData(response.data.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [token])
  );

  const data = () => {
    let listData = [...listProperty];
    listData.splice(0, 1, { label: "All", value: "" });
    return listData;
  };

  const filter = async (value) => {
    try {
      const response = await get(`/properties/?propertyType=${value}`, token);
      setListData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTouched = (value) => {
    setActiveItem(value);
    filter(value);
    setSearchParam("");
  };

  const search = async (value) => {
    try {
      setActiveItem("");
      setSearchParam(value);
      const response = await get(`/properties/?address=${value}`, token);
      setListData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  };

  const searchDebouce = useCallback(debouce(search, 1000), []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="margin"
      enabled
      keyboardVerticalOffset={80}
    >
      <ScrollView>
        <ImageBackground
          resizeMode="cover"
          source={require("../assets/images/banner.jpg")}
          style={styles.header}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Rental Z:</Text>
            <View style={styles.searchForm}>
              <View style={styles.searchIcon}>
                <IoniIcon name="search-sharp" size={25} color="#fff" />
              </View>
              <TextInput
                defaultValue={searchParam}
                style={styles.search}
                placeholder="Search..."
                placeholderTextColor="#fff"
                onChangeText={(text) => searchDebouce(text)}
              />
            </View>
          </View>
        </ImageBackground>
        <Text style={styles.sectionTitle}>Type of Properties</Text>
        <SafeAreaView style={styles.categories}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={data()}
            renderItem={({ item }) => (
              <CategoryItem
                activeItem={activeItem}
                value={item.value}
                handleTouched={handleTouched}
                label={item.label}
              />
            )}
            key={(item, index) => index}
          />
        </SafeAreaView>
        <Text style={styles.sectionTitle}>Properies List</Text>
        <View style={styles.itemContainer}>
          <Carousel
            data={listData}
            renderItem={({ item, index }) => (
              <PropertyItem item={item} navigation={navigation} />
            )}
            sliderWidth={screenWidth}
            keyExtractor={(item, index) => index}
            itemWidth={screenWidth - 80}
            hasParallaxImages={true}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF0F2",
  },
  header: {
    borderRadius: 30,
  },
  titleContainer: {
    backgroundColor: "rgba(219, 54, 186, 0.6)",
    padding: 40,
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
    color: "#fff",
    marginLeft: 5,
    marginBottom: 30,
  },
  searchForm: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  search: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    width: "100%",
    color: "#fff",
    fontSize: 20,
    paddingLeft: 30,
  },
  searchIcon: {
    position: "absolute",
    top: 13,
    left: 5,
  },
  sectionTitle: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 20,
    color: "#9941ac",
  },
  categories: {
    marginVertical: 10,
    marginLeft: 20,
    flexDirection: "row",
  },
  flatListView: {
    flex: 1,
  },
  itemContainer: {
    marginVertical: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.authenticationReducer.token,
  };
};

export default connect(mapStateToProps)(HomeScreen);
