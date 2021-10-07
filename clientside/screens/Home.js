import React, { useState, useRef, useCallback } from "react";

import { listProperty } from "../costants";
import { useFocusEffect } from "@react-navigation/native";

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
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import SplashScreen from "react-native-splash-screen";
import RequestService from "../services/request.service";
import IoniIcon from "react-native-vector-icons/Ionicons";
import CategoryItem from "../components/CategoryItem";
import PropertyItem from "../components/PropertyItem";
import { connect } from "react-redux";
import Voice from "@react-native-community/voice";
import IonicIcon from "react-native-vector-icons/Ionicons";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ token, navigation }) => {
  const [searchParam, setSearchParam] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const ref = useRef();
  const [activeItem, setActiveItem] = useState("");

  const { get, create } = RequestService;

  const [listData, setListData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          const response = await get("/properties/", token);
          if (isActive) {
            Voice.onSpeechStart = onSpeechStart;
            Voice.onSpeechEnd = onSpeechEnd;
            Voice.onSpeechResults = onSpeechResults;
            SplashScreen.hide();
            setListData(response.data.data);
            ref?.current?.scrollToOffset({ animated: true, offset: 0 });
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      return () => {
        Voice.destroy().then(Voice.removeAllListeners());
        setActiveItem("");
        setSearchParam("");
        setIsRecording(false);
        isActive = false;
      };
    }, [token])
  );

  const data = () => {
    let listData = [...listProperty];
    listData.splice(0, 1, { label: "All", value: "" });
    return listData;
  };

  const onSpeechStart = (e) => {
    setIsRecording(true);
    console.log("Start recording: ", e);
  };

  const onSpeechEnd = (e) => {
    setIsRecording(false);
    console.log("Stop recording: ", e);
  };

  const onSpeechResults = (e) => {
    let text = e.value[0];
    setIsRecording(false);
    setSearchParam(text);
    search(text);
    console.log("Result: ", e);
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

  const handleAdd = async (id) => {
    const response = await create("/properties/favorite/add", token, {
      itemId: id,
    });
    Alert.alert(
      response?.status === 201 ? "Success" : "Error",
      response.data.message
    );
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

  const debounce = (func, wait) => {
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

  const handleRecording = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
      } else {
        Voice.start("vi-VN");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchDebounce = debounce(search, 1000);

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
                onChangeText={(text) => searchDebounce(text)}
              />
              <TouchableOpacity
                style={styles.recording}
                onPress={handleRecording}
              >
                <IonicIcon
                  name="mic-circle-sharp"
                  size={40}
                  color={isRecording ? "#9941ac" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <Text style={styles.sectionTitle}>Type of Properties</Text>
        <SafeAreaView style={styles.categories}>
          <FlatList
            ref={ref}
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
        <Text style={styles.sectionTitle}>Properties List</Text>
        <View style={styles.itemContainer}>
          <Carousel
            data={listData}
            loop={true}
            renderItem={({ item, index }) => (
              <PropertyItem
                item={item}
                navigation={navigation}
                handleAdd={handleAdd}
              />
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
    flexDirection: "row",
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
  recording: {
    position: "absolute",
    right: -39,
    top: 13,
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.authenticationReducer.token,
  };
};

export default connect(mapStateToProps)(HomeScreen);
