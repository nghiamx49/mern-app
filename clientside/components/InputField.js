import React from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';
import IonicIcon from 'react-native-vector-icons/Ionicons';

const InputField = ({ name, handleTextInput, value, label, ...props }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.fieldContainer}>
                {props?.icon && <View style={styles.iconContainer}>
                    <IonicIcon name={props.icon} size={25} color="#9941ac" />
                </View>}
                <TextInput style={styles.formInput} onChangeText={text => handleTextInput(text, name, label)} defaultValue={value} {...props} />
                {props?.isRequired && <Text style={styles.required}>*</Text>}
            </View>
            {props?.error !== '' && <Text style={styles.erorrMsg}>{props.error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
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
        paddingHorizontal: 45,
        fontSize: 18,
        color: 'black',
    },
    erorrMsg: {
        color: 'red',
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 3,
    },
    fieldContainer: {
        position: 'relative',
    },
    required: {
        color: 'red',
        position: 'absolute',
        top: 20,
        textAlignVertical: 'center',
        right: 10,
        fontSize: 25,
    },
    iconContainer: {
        //backgroundColor: '#9941ac',
        height: 30,
        width: 30,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '38%',
        left: 8,
    },
});

export default InputField;
