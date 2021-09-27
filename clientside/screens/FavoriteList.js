import React, { useState, useCallback, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import RequestService from "../services/request.service";
import { connect } from "react-redux";

import CustomDilog from "../components/Dialog";
import AlternativeItem from "../components/AlternativeItem";

const { height: screenHeight } = Dimensions.get("screen");

const FavoriteListScreen = ({ token, navigation }) => {
  const [listItems, setListItems] = useState([]);

  const { get, remove } = RequestService;

  const getList = async () => {
    const response = await get("/properties/favorite", token);
    setListItems(response.data.data);
  };

  const [dialog, setDialog] = useState({ status: false, message: "" });

  const flatlistRef = useRef();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          if (isActive) {
            getList();
            flatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
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

  handleRemove = async (id) => {
    const response = await remove(`/properties/favorite/${id}`, token);
    if (response.status === 200) {
      setDialog({ status: true, message: response.data.message });
      getList();
    } else {
      setDialog({ status: true, message: response.data.message });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={require("../assets/images/banner.jpg")}
        style={styles.header}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Favorite List</Text>
        </View>
      </ImageBackground>
      <FlatList
        ref={flatlistRef}
        style={styles.listContainer}
        data={listItems}
        renderItem={({ item }) => (
          <AlternativeItem
            item={item}
            navigation={navigation}
            handleRemove={handleRemove}
          />
        )}
      />
      <CustomDilog
        toggle={dialog.status}
        message={dialog.message}
        handleToggle={() => setDialog({ status: !dialog.status, message: "" })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    borderRadius: 30,
    height: 150,
  },
  titleContainer: {
    backgroundColor: "rgba(219, 54, 186, 0.6)",
    height: 150,
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
  },
  listContainer: {
    marginHorizontal: 30,
    marginBottom: 50,
    height: 500,
    maxHeight: screenHeight - 150,
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.authenticationReducer.token,
  };
};

export default connect(mapStateToProps)(FavoriteListScreen);
