import React, { useCallback, useState, useRef } from "react";

import { listProperty } from "../../costants";
import { useFocusEffect } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
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
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";
import RequestService from "../../services/request.service";
import IoniIcon from "react-native-vector-icons/Ionicons";
import CategoryItem from "../../components/CategoryItem";
import { connect } from "react-redux";
import AlternativeItem from "../../components/AlternativeItem";
import Voice from "@react-native-community/voice";
import IonicIcon from "react-native-vector-icons/Ionicons";

import CustomDialog from "../../components/Dialog";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AdminHomeScreen = ({ token, navigation }) => {
  const [searchParam, setSearchParam] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [activeItem, setActiveItem] = useState("");

  const { get, remove } = RequestService;
  const [dialog, setDialog] = useState({ status: false, message: "" });

  const [listData, setListData] = useState([]);
  const flatlistRef = useRef();

  const getData = async () => {
    const response = await get("/properties/", token);
    setListData(response.data.data);
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
    searchDebouce(text);
    console.log("Result: ", e);
  };

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
            flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
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
        if (isRecording) {
          await Voice.stop();
        } else {
          await Voice.start("vi-VN");
        }
      }
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

  const handleEdit = (item) => {
    navigation.navigate("Edit", {
      item: item,
      token: token,
      navigation: navigation,
    });
  };

  const handleAddNote = async (item) => {
    navigation.navigate("Description", { item: item, token: token });
  };

  const handleRemove = async (id) => {
    try {
      const response = await remove(`/properties/remove/${id}`, token);
      setDialog({ status: true, message: response.data.message });
      if (response?.status === 200) {
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchDebouce = useCallback(debouce(search, 1000), []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="margin"
      enabled
      keyboardVerticalOffset={80}
    >
      <ImageBackground
        resizeMode="cover"
        source={require("../../assets/images/banner.jpg")}
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
          ref={flatlistRef}
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
      <FlatList
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={listData}
        renderItem={({ item }) => (
          <AlternativeItem
            item={item}
            navigation={navigation}
            handleAddNote={handleAddNote}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
          />
        )}
      />
      <CustomDialog
        toggle={dialog.status}
        message={dialog.message}
        handleToggle={() => setDialog({ status: !dialog.status, message: "" })}
      />
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
    height: 150,
    alignItems: "center",
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
    width: "80%",
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
    top: 26,
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
  listContainer: {
    marginHorizontal: 30,
    height: screenHeight,
  },
  recording: {
    position: "absolute",
    right: -30,
    top: 23,
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.authenticationReducer.token,
  };
};

export default connect(mapStateToProps)(AdminHomeScreen);
