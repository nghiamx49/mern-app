import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Button from "../../components/Button";

import RequestService from "../../services/request.service";

const AddDescriptionScreen = ({ route, navigation }) => {
  const {
    item: { _id, description },
    token,
  } = route.params;

  const [descriptionVal, setDescriptionVal] = useState(description || "");

  const { edit } = RequestService;

  const handleSubmit = async () => {
    const response = await edit(
      `/properties/description/${_id}`,
      token,
      JSON.stringify({ description: descriptionVal })
    );
    Alert.alert(
      response?.status === 200 ? "Success" : "Error",
      response.data.message
    );
    if (response.status === 200) {
      navigation.navigate("All");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={["#ff00fe", "#9941ac", "#65056b"]}
          style={styles.header}
        >
          <Text style={styles.title}>Add Property Description</Text>
          <Text style={styles.headertext}>Property ID: {_id}</Text>
        </LinearGradient>
        <View style={styles.form}>
          <Text style={styles.label}>Property Description:</Text>
          <TextInput
            placeholder={"Enter the property description..."}
            placeholderTextColor={"gray"}
            style={styles.textInput}
            multiline={true}
            defaultValue={descriptionVal}
            onChangeText={(text) => setDescriptionVal(text)}
          />
          <Button title="Update" handleSubmit={handleSubmit} />
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
  header: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
    color: "#fff",
  },
  headertext: {
    color: "#fff",
  },
  form: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    color: "#000",
    height: 300,
    textAlignVertical: "top",
  },
});

export default AddDescriptionScreen;
