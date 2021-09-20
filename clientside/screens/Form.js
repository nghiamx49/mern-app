import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

import InputField from '../components/InputField';
import DropdownCustom from '../components/Dropdown';
import ConfirmDialog from '../components/ConfirmDialog';

import IonicIcon from 'react-native-vector-icons/Ionicons';



const FormScreen = () => {

    const [data, setData] = useState({
        propertyType: '',
        bedRoom: '',
        addingDate: new Date(),
        monthlyRentPrice: '',
        furnitureType: '',
        notes: '',
        reporterName: '',
        address: '',
    });
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!toggle);
    };

    const [errors, setErrors] = useState({
        propertyType: '',
        bedRoom: '',
        monthlyRentPrice: '',
        notes: '',
        reporterName: '',
        address: '',
    });


    useEffect(() => {
        if (data.bedRoom === ''
            || data.monthlyRentPrice === ''
            || data.propertyType === ''
            || data.reporterName === ''
            || errors.reporterName !== ''
            || errors.propertyType !== ''
            || errors.bedRoom !== ''
            || errors.notes !== ''
            || errors.monthlyRentPrice !== '') {
            setDisable(true);
        }
        else {
            setDisable(false);
        }
    }, [data.bedRoom, data.monthlyRentPrice, data.propertyType, data.reporterName, errors.monthlyRentPrice, errors.bedRoom, errors.notes, errors.propertyType, errors.reporterName]);


    const [show, setShow] = useState(false);

    const [disable, setDisable] = useState(true);

    const listProperty = [
        {
            label: 'Please Select One',
            value: '',
        },
        {
            label: 'Building',
            value: 'Building',
        },
        {
            label: 'Apartment',
            value: 'Apartment',
        },
        {
            label: 'Flat',
            value: 'Flat',
        },
        {
            label: 'House',
            value: 'House',
        },
        {
            label: 'Bugalow',
            value: 'Bugalow',
        },
        {
            label: 'Villa',
            value: 'Villa',
        },
    ];

    const listBedroomType = [
        {
            label: 'Please Select One',
            value: '',
        },
        {
            label: 'One Bedroom',
            value: 'Single Room',
        },
        {
            label: 'Two Bedroom',
            value: 'Two Bedroom',
        },
        {
            label: 'Studio Bedroom',
            value: 'Studio Bedroom',
        },
    ];

    const listFurnitureType = [
        {
            label: 'Please Choose One (Optional)',
            value: '',
        },
        {
            label: 'Furnished',
            value: 'Furnished',
        },
        {
            label: 'Unfurnished',
            value: 'Unfurnished',
        },
        {
            label: 'Part Furnished',
            value: 'Part Furnished',
        },
    ];

    const showMode = currentMode => {
        setShow(true);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || data.addingDate;
        setShow(Platform.OS === 'ios');
        setData({ ...data, addingDate: currentDate });
    };

    const handleTextInput = (text, name, label) => {
        switch (name) {
            // case 'propertyType':
            // case 'bedRoom':
            case 'reporterName':
            case 'address':
                if (text === '') {
                    setErrors({ ...errors, [name]: `${label} must be existed` });
                } else {
                    setErrors({ ...errors, [name]: '' });
                    setData({ ...data, [name]: text });
                }
                break;
            case 'monthlyRentPrice':
                let val = text;
                if (val === '') {
                    setErrors({ ...errors, [name]: `${label} must be existed` });
                }
                else if (isNaN(val)) {
                    setErrors({ ...errors, [name]: 'The price must be a number' });
                }
                else if (text.split('').splice(text.split('').indexOf('.'), text.length).length > 3) {
                    setErrors({ ...errors, [name]: 'The price only accept maximum 2 digits after the period ' });
                } else if (parseInt(val, 10) < 0) {
                    setErrors({ ...errors, [name]: 'The price must larger or equal 0' });
                } else {
                    setErrors({ ...errors, [name]: '' });
                    setData({ ...data, [name]: val });
                }
                break;
            case 'notes':
                if (text.length > 200) {
                    setErrors({ ...errors, [name]: 'The maximun length of notes are 200 characters' });
                }
                else {
                    setErrors({ ...errors, [name]: '' });
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
            let request = await fetch('http://192.168.1.14:3000/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            let response = await request.json();
            setToggle(!toggle);
            Alert.alert('Save Success', 'Your property had been added');
            setData({
                propertyType: '',
                bedRoom: '',
                addingDate: new Date(),
                monthlyRentPrice: '',
                furnitureType: '',
                notes: '',
                reporterName: '',
            });
            console.log(response?.message);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <LinearGradient
            colors={['#ff00fe', '#9941ac', '#65056b']}
            style={styles.linearContainer}>
            <Text style={styles.title}>Rental Form</Text>
            <KeyboardAvoidingView
                style={styles.form}
                behavior="padding"
                enabled
                keyboardVerticalOffset={80}>
                <ScrollView>
                    <DropdownCustom
                        name="propertyType"
                        handleTextInput={handleTextInput}
                        label="Property Type"
                        value={data.propertyType}
                        error={errors.propertyType}
                        autoFocus={true}
                        icon={'home'}
                        data={listProperty}
                        isRequired
                    />

                    <DropdownCustom
                        name="bedRoom"
                        handleTextInput={handleTextInput}
                        label="Bed Room"
                        value={data.bedRoom}
                        error={errors.bedRoom}
                        icon={'bed'}
                        data={listBedroomType}
                        isRequired
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Adding Time</Text>
                        <TouchableOpacity onPress={showMode}>
                            <View style={styles.fieldContainer}>
                                <View style={styles.iconContainer}>
                                    <IonicIcon name="calendar" size={25} color="#9941ac" />
                                </View>
                                <Text style={styles.formInput}>{`${data.addingDate.getDate()}/${data.addingDate.getMonth()}/${data.addingDate.getFullYear()}`}</Text>
                                <Text style={styles.required}>*</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={data.addingDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            maximumDate={Date.now()}
                        />
                    )}
                    <InputField
                        name="monthlyRentPrice"
                        handleTextInput={handleTextInput}
                        label="Monthly Rent Price"
                        value={data.monthlyRentPrice}
                        error={errors.monthlyRentPrice}
                        icon={'cash'}
                        keyboardType="decimal-pad"
                        isRequired
                    />
                    <InputField
                        name="address"
                        handleTextInput={handleTextInput}
                        label="Address"
                        value={data.address}
                        error={errors.address}
                        icon={'location-sharp'}
                        isRequired
                        keyboardAppearance="dark"
                    />

                    <DropdownCustom
                        name="furnitureType"
                        handleTextInput={handleTextInput}
                        label="Furniture Type"
                        value={data.furnitureType}
                        data={listFurnitureType}
                        icon={'information-circle'}
                    />

                    <InputField
                        name="notes"
                        handleTextInput={handleTextInput}
                        label="Notes"
                        value={data.notes}
                        error={errors.notes}
                        numberOfLines={4}
                        icon={'bookmark'}
                        multiline
                    />

                    <InputField
                        name="reporterName"
                        handleTextInput={handleTextInput}
                        label="Reporter Name"
                        value={data.reporterName}
                        error={errors.reporterName}
                        icon={'person'}
                        isRequired
                    />

                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            disabled={disable}
                            style={disable ? styles.btnDisable : styles.btnSubmit}
                            onPress={handleToggle}>
                            <Text style={styles.btnTitle}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <ConfirmDialog data={data} toggle={toggle} handleSubmit={handleSubmit} handleToggle={handleToggle} />
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearContainer: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        marginTop: 30,
    },
    form: {
        position: 'absolute',
        top: '30%',
        backgroundColor: 'white',
        width: '96%',
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        height:
            Dimensions.get('window').height - Dimensions.get('window').height * 0.15,
    },
    inputContainer: {
        marginVertical: 10,
        width: 350,
        flex: 1,
    },
    inputLabel: {
        color: '#9941ac',
        fontSize: 20,
        fontWeight: '600',
    },
    formInput: {
        borderColor: 'lightgray',
        borderWidth: 1,
        width: '100%',
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 40,
        height: 50,
        color: 'black',
        textAlignVertical: 'center',
    },
    btnSubmit: {
        borderRadius: 10,
        width: '100%',
        marginRight: 40,
        backgroundColor: '#9941ac',
        borderWidth: 1,
        borderColor: '#fff',
    },
    btnDisable: {
        borderRadius: 10,
        width: '100%',
        marginRight: 40,
        backgroundColor: '#c9c5c5',
        borderWidth: 1,
        borderColor: '#fff',
    },
    btnTitle: {
        fontSize: 18,
        fontWeight: '600',
        padding: 10,
        textAlign: 'center',
        color: 'white',
    },
    required: {
        color: 'red',
        position: 'absolute',
        top: 15,
        right: 10,
        fontSize: 25,
    },
    iconContainer: {
        //backgroundColor: '#9941ac',
        height: 25,
        width: 25,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '38%',
        left: 10,
    },
});

export default FormScreen;
