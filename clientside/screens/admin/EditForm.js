import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CustomDilog from "../../components/Dialog";
import { listBedroomType, listFurnitureType } from "../../costants";
import InputField from "../../components/InputField";
import DropdownCustom from "../../components/Dropdown";
import ConfirmDialog from "../../components/ConfirmDialog";

import RequestService from "../../services/request.service";

const EditFormScreen = ({ route }) => {
  const { item, token, navigation } = route.params;
  const [data, setData] = useState({
    address: item.location.address,
    bedRoom: item.bedRoom,
    monthlyRentPrice: item.monthlyRentPrice,
    furnitureType: item.furnitureType,
    notes: item.notes,
  });

  const { edit } = RequestService;

  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const [errors, setErrors] = useState({
    propertyType: "",
    bedRoom: "",
    monthlyRentPrice: "",
    notes: "",
    address: "",
  });

  useEffect(() => {
    if (
      data.bedRoom === "" ||
      data.monthlyRentPrice === "" ||
      data.propertyType === "" ||
      errors.propertyType !== "" ||
      errors.bedRoom !== "" ||
      errors.notes !== "" ||
      errors.monthlyRentPrice !== ""
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [data, errors]);

  const [show, setShow] = useState(false);

  const [disable, setDisable] = useState(true);

  const [errorDialog, setErrorDialog] = useState({ state: false, message: "" });

  const showMode = (currentMode) => {
    setShow(false);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data.addingDate;
    setShow(Platform.OS === "ios");
    setData({ ...data, addingDate: currentDate });
  };

  const handleTextInput = (text, name, label) => {
    switch (name) {
      case "address":
        if (text === "") {
          setErrors({ ...errors, [name]: `${label} must be existed` });
        } else {
          setErrors({ ...errors, [name]: "" });
          setData({ ...data, [name]: text });
        }
        break;
      case "monthlyRentPrice":
        let val = text;
        if (val === "") {
          setErrors({ ...errors, [name]: `${label} must be existed` });
        } else if (isNaN(val)) {
          setErrors({ ...errors, [name]: "The price must be a number" });
        } else if (
          text.split("").splice(text.split("").indexOf("."), text.length)
            .length > 3
        ) {
          setErrors({
            ...errors,
            [name]: "The price only accept maximum 2 digits after the period ",
          });
        } else if (parseInt(val, 10) < 0) {
          setErrors({ ...errors, [name]: "The price must larger or equal 0" });
        } else {
          setErrors({ ...errors, [name]: "" });
          setData({ ...data, [name]: val });
        }
        break;
      case "notes":
        if (text.length > 200) {
          setErrors({
            ...errors,
            [name]: "The maximun length of notes are 200 characters",
          });
        } else {
          setErrors({ ...errors, [name]: "" });
          setData({ ...data, [name]: text });
        }
        break;
      default:
        setData({ ...data, [name]: text });
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await edit(
        `/properties/edit/${item._id}`,
        token,
        JSON.stringify(data)
      );
      if (response.status === 200) {
        Alert.alert("Save Success", "Your property had been updated", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("All");
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#ff00fe", "#9941ac", "#65056b"]}
      style={styles.linearContainer}
    >
      <Text style={styles.title}>Edit Property Form</Text>
      <KeyboardAvoidingView
        style={styles.form}
        behavior="padding"
        enabled
        keyboardVerticalOffset={80}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <InputField
            name="address"
            handleTextInput={handleTextInput}
            label="Address"
            value={data.address}
            error={errors.address}
            icon={"location-sharp"}
            isRequired
            keyboardAppearance="dark"
            editable={false}
          />
          <DropdownCustom
            name="bedRoom"
            handleTextInput={handleTextInput}
            label="Bed Room"
            value={data.bedRoom}
            error={errors.bedRoom}
            icon={"bed"}
            data={listBedroomType}
            isRequired
          />

          <InputField
            name="monthlyRentPrice"
            handleTextInput={handleTextInput}
            label="Monthly Rent Price"
            value={data.monthlyRentPrice.toString()}
            error={errors.monthlyRentPrice}
            icon={"cash"}
            keyboardType="decimal-pad"
            isRequired
          />

          <DropdownCustom
            name="furnitureType"
            handleTextInput={handleTextInput}
            label="Furniture Type"
            value={data.furnitureType}
            data={listFurnitureType}
            icon={"information-circle"}
          />

          <InputField
            name="notes"
            handleTextInput={handleTextInput}
            label="Notes"
            value={data.notes}
            error={errors.notes}
            numberOfLines={4}
            icon={"bookmark"}
            multiline
          />

          {/* button submit */}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              disabled={disable}
              style={disable ? styles.btnDisable : styles.btnSubmit}
              onPress={handleToggle}
            >
              <Text style={styles.btnTitle}>Update</Text>
            </TouchableOpacity>
          </View>
          <ConfirmDialog
            data={data}
            toggle={toggle}
            handleSubmit={handleSubmit}
            handleToggle={handleToggle}
          />
          <CustomDilog
            toggle={errorDialog.state}
            handleToggle={() => setErrorDialog(!errorDialog)}
            message={errorDialog.message}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginTop: 30,
  },
  form: {
    position: "absolute",
    top: 100,
    backgroundColor: "white",
    width: "96%",
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    height: Dimensions.get("window").height - 240,
    paddingBottom: 50,
  },
  inputContainer: {
    marginVertical: 10,
    width: 350,
    flex: 1,
  },
  inputLabel: {
    color: "#9941ac",
    fontSize: 20,
    fontWeight: "600",
  },
  formInput: {
    borderColor: "lightgray",
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 40,
    height: 50,
    color: "black",
    textAlignVertical: "center",
  },
  btnSubmit: {
    borderRadius: 10,
    width: "100%",
    marginRight: 40,
    backgroundColor: "#9941ac",
    borderWidth: 1,
    borderColor: "#fff",
  },
  btnDisable: {
    borderRadius: 10,
    width: "100%",
    marginRight: 40,
    backgroundColor: "#c9c5c5",
    borderWidth: 1,
    borderColor: "#fff",
  },
  btnTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 10,
    textAlign: "center",
    color: "white",
  },
  imageContainer: {
    alignItems: "center",
  },
  section: {
    color: "#9941ac",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default EditFormScreen;
