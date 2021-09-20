import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FormScreen from '../screens/Form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { AuthenticationContext } from '../context/App.Context';

import AppAuthenticate from '../screens/Authenticate';

const Tab = createBottomTabNavigator();


const AuthenticateNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Form" screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dialog') {
                        iconName = focused ? 'chatbox' : 'chatbox-outline';
                    }
                    else if (route.name === 'Form') {
                        iconName = focused ? 'reorder-four' : 'reorder-four-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#9941ac',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}>
                <Tab.Screen name="Form" component={FormScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};


const AppNavigation = () => {
    const { isLoggedIn } = useContext(AuthenticationContext);
    console.log(isLoggedIn);
    return (
        <>
            {isLoggedIn ? <AuthenticateNavigation /> : <AppAuthenticate />}
        </>
    );
};

export default AppNavigation;
