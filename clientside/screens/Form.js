import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
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
  Image,
  PermissionsAndroid,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import axios from "axios";
import { MAP_API_KEY } from "@env";

import IonicIcon from "react-native-vector-icons/Ionicons";
import { listBedroomType, listFurnitureType, listProperty } from "../costants/";
import InputField from "../components/InputField";
import DropdownCustom from "../components/Dropdown";
import ConfirmDialog from "../components/ConfirmDialog";
import DatePicker from "../components/DatePicker";

import RequestService from "../services/request.service";

const FormScreen = ({ user }) => {
  const [data, setData] = useState({
    propertyType: "",
    bedRoom: "",
    addingDate: new Date(),
    monthlyRentPrice: "",
    furnitureType: "",
    notes: "",
    reporterName: user.fullName,
    address: "",
    geocode: "",
  });

  const { create } = RequestService;

  const [listImage, setListImage] = useState([]);

  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    const geocodeFinding = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${data.address}&key=${MAP_API_KEY}`
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (data.geocode === "") {
      geocodeFinding();
    }
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
      errors.monthlyRentPrice !== "" ||
      listImage.length === 0
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [data, errors, listImage]);

  const [show, setShow] = useState(false);

  const [disable, setDisable] = useState(true);

  const showMode = (currentMode) => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data.addingDate;
    setShow(Platform.OS === "ios");
    setData({ ...data, addingDate: currentDate });
  };

  const handleImagePicker = async () => {
    try {
      launchImageLibrary(
        {
          mediaType: "photo",
          noData: true,
          selectionLimit: 3,
        },
        (responses) => {
          if (responses.didCancel) {
            setListImage([]);
          } else {
            setListImage(responses.assets);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleTextInput = (text, name, label) => {
    switch (name) {
      // case 'propertyType':
      // case 'bedRoom':
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

  const createFormData = (listImage, body = {}) => {
    const data = new FormData();

    listImage.map((item) =>
      data.append("propertyImages", {
        name: item.fileName,
        type: item.type,
        uri: Platform.OS === "ios" ? item.uri.replace("file://", "") : item.uri,
      })
    );

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  const handleSubmit = async () => {
    try {
      const formData = createFormData(listImage, data);
      console.log(formData);
      // setToggle(!toggle);
      // Alert.alert("Save Success", "Your property had been added");
      // setData({
      //   propertyType: "",
      //   bedRoom: "",
      //   addingDate: new Date(),
      //   monthlyRentPrice: "",
      //   furnitureType: "",
      //   notes: "",
      //   reporterName: "",
      // });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImgRemove = (uriFiler) => {
    const listImg = listImage.filter(({ uri }) => uri !== uriFiler);
    setListImage([...listImg]);
  };

  return (
    <LinearGradient
      colors={["#ff00fe", "#9941ac", "#65056b"]}
      style={styles.linearContainer}
    >
      <Text style={styles.title}>Rental Form</Text>
      <KeyboardAvoidingView
        style={styles.form}
        behavior="padding"
        enabled
        keyboardVerticalOffset={80}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <DropdownCustom
            name="propertyType"
            handleTextInput={handleTextInput}
            label="Property Type"
            value={data.propertyType}
            error={errors.propertyType}
            autoFocus={true}
            icon={"home"}
            data={listProperty}
            isRequired
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

          <DatePicker
            showMode={showMode}
            onChange={onChange}
            date={data.addingDate}
            show={show}
            label="Adding Date"
            isRequired
          />

          <InputField
            name="monthlyRentPrice"
            handleTextInput={handleTextInput}
            label="Monthly Rent Price"
            value={data.monthlyRentPrice}
            error={errors.monthlyRentPrice}
            icon={"cash"}
            keyboardType="decimal-pad"
            isRequired
          />
          <InputField
            name="address"
            handleTextInput={handleTextInput}
            label="Address"
            value={data.address}
            error={errors.address}
            icon={"location-sharp"}
            isRequired
            keyboardAppearance="dark"
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

          <InputField
            name="reporterName"
            handleTextInput={handleTextInput}
            label="Reporter Name"
            value={data.reporterName}
            error={errors.reporterName}
            icon={"person"}
            editable={false}
            isRequired
          />

          {/* image picker */}
          <Text style={styles.section}>Please Select Image (At least 1):</Text>
          <View style={styles.imageContainer}>
            {listImage.length !== 0 && (
              <View style={styles.previewContainer}>
                {listImage.map(({ uri }, index) => (
                  <View style={styles.imageBlock}>
                    <View style={styles.closeBtn}>
                      <TouchableOpacity onPress={() => handleImgRemove(uri)}>
                        <IonicIcon size={20} name="close-circle-sharp" />
                      </TouchableOpacity>
                    </View>
                    <Image
                      key={index}
                      style={styles.imagePreview}
                      source={{ uri: uri }}
                    />
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity onPress={handleImagePicker}>
              <View style={styles.imagePicker}>
                <IonicIcon size={20} name="images-sharp" color="#fff" />
                <Text style={styles.pickerText}>Choose Image</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* button submit */}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              disabled={disable}
              style={disable ? styles.btnDisable : styles.btnSubmit}
              onPress={handleToggle}
            >
              <Text style={styles.btnTitle}>Submit</Text>
            </TouchableOpacity>
          </View>
          <ConfirmDialog
            data={data}
            toggle={toggle}
            handleSubmit={handleSubmit}
            handleToggle={handleToggle}
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
    height: Dimensions.get("window").height - 200,
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
  imagePicker: {
    backgroundColor: "#9941ac",
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  pickerText: {
    marginLeft: 5,
    color: "#fff",
    fontWeight: "bold",
  },
  previewContainer: {
    width: 350,
    padding: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imagePreview: {
    width: 100,
    height: 150,
    resizeMode: "cover",
  },
  imageBlock: {
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    zIndex: 10,
    right: -5,
    top: -10,
  },
  section: {
    color: "#9941ac",
    fontSize: 20,
    fontWeight: "600",
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.authenticationReducer.user,
  };
};

export default connect(mapStateToProps)(FormScreen);
