import React from 'react';
import { KeyboardAvoidingView, Text, StyleSheet, ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import IonicIcon from 'react-native-vector-icons/Ionicons';

import LoginForm from '../components/LoginForm';


const AppAuthenticate = () => {

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height"
            enabled
            keyboardVerticalOffset={30}>
            <ScrollView>
                <LinearGradient colors={['#ff00fe', '#9941ac', '#65056b']} style={styles.header}>
                    <Text style={styles.title}>Rental Z</Text>
                    <IonicIcon name={'person-circle-sharp'} size={80} color="white" />
                    <View style={styles.switchTab}>
                        <View style={styles.switchItem}>
                            <Text style={styles.switchText}>Login</Text>
                        </View>
                        <View style={styles.switchItem}>
                            <Text style={styles.switchText}>Register</Text>
                        </View>
                    </View>
                </LinearGradient>
                <LoginForm />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomRightRadius: 200,
        borderBottomColor: '#65056b',
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: 'white',
    },
    switchTab: {
        marginTop: 20,
        flexDirection: 'row',
    },
    switchItem: {
        borderBottomColor: '#e3cee4',
        borderBottomWidth: 2,
        marginHorizontal: 10,
    },
    switchText: {
        color: 'white',
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default AppAuthenticate;
