import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import FormScreen from "../screens/Form";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { connect } from "react-redux";

import AppAuthenticate from "../screens/Authenticate";
import AccountScreen from "../screens/Account";
import HomeScreen from "../screens/Home";

const Tab = createMaterialBottomTabNavigator();

const AuthenticateNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#ffffff"
      inactiveColor="#d0d0d0"
      shifting={true}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarColor: "#9941ac",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                size={25}
                color={color}
              />
            );
          },
        }}
      />
      {/* <Tab.Screen name="Favorites" component={AccountScreen} options={
                {
                    tabBarColor: '#9941ac',
                    tabBarIcon: ({ focused, color }) => {
                        return <Ionicons name={focused ? 'star-sharp' : 'star-outline'} size={25} color={color} />;
                    },
                }
            } /> */}
      <Tab.Screen
        name="Form"
        component={FormScreen}
        options={{
          tabBarColor: "#00628e",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={
                  focused ? "file-tray-full-sharp" : "file-tray-full-outline"
                }
                size={25}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AccountScreen}
        options={{
          tabBarColor: "#9941ac",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={focused ? "person-sharp" : "person-outline"}
                size={25}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigation = ({ isLoggedIn }) => {
  return (
    <NavigationContainer>
      {isLoggedIn ? <AuthenticateNavigation /> : <AppAuthenticate />}
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authenticationReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps)(AppNavigation);
