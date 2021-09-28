import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FormScreen from "../screens/admin/Form";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { connect } from "react-redux";

import AppAuthenticate from "../screens/Authenticate";
import AccountScreen from "../screens/Account";
import HomeScreen from "../screens/Home";
import PropertyDetailScreen from "../screens/PropertyDetail";
import AdminHomeScreen from "../screens/admin/Home";
import FavoriteListScreen from "../screens/FavoriteList";
import EditFormScreen from "../screens/admin/EditForm";
import AddDescriptionScreen from "../screens/admin/Description";

const UserStack = createStackNavigator();

const UserHomeStack = () => {
  return (
    <UserStack.Navigator
      initialRouteName="All"
      screenOptions={{
        cardShadowEnabled: true,
        headerTintColor: "#9941ac",
      }}
    >
      <UserStack.Screen
        name="All"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <UserStack.Screen name="Detail" component={PropertyDetailScreen} />
    </UserStack.Navigator>
  );
};
const FavoriteListStack = createStackNavigator();

const FavoriteListScreenStack = () => {
  return (
    <FavoriteListStack.Navigator
      initialRouteName="All"
      screenOptions={{
        cardShadowEnabled: true,
        headerTintColor: "#9941ac",
      }}
    >
      <FavoriteListStack.Screen
        name="All"
        component={FavoriteListScreen}
        options={{ headerShown: false }}
      />
      <FavoriteListStack.Screen
        name="Detail"
        component={PropertyDetailScreen}
      />
    </FavoriteListStack.Navigator>
  );
};

const AdminStack = createStackNavigator();

const AdminHomeStack = () => {
  return (
    <AdminStack.Navigator
      initialRouteName="All"
      screenOptions={{
        cardShadowEnabled: true,
        headerTintColor: "#9941ac",
      }}
    >
      <AdminStack.Screen
        name="All"
        component={AdminHomeScreen}
        options={{ headerShown: false }}
      />
      <AdminStack.Screen name="Detail" component={PropertyDetailScreen} />
      <AdminStack.Screen name="Edit" component={EditFormScreen} />
      <AdminStack.Screen name="Description" component={AddDescriptionScreen} />
    </AdminStack.Navigator>
  );
};

const Tab = createMaterialBottomTabNavigator();

const AuthenticateNavigation = ({ user }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#ffffff"
      inactiveColor="#d0d0d0"
      shifting={true}
    >
      <Tab.Screen
        name="Home"
        component={user?.role === "admin" ? AdminHomeStack : UserHomeStack}
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
      {user?.role === "user" && (
        <Tab.Screen
          name="Favories"
          component={FavoriteListScreenStack}
          options={{
            tabBarColor: "#00628e",
            tabBarIcon: ({ focused, color }) => {
              return (
                <Ionicons
                  name={focused ? "star-sharp" : "star-outline"}
                  size={25}
                  color={color}
                />
              );
            },
          }}
        />
      )}
      {user?.role === "admin" && (
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
      )}
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

const AppNavigation = ({ isLoggedIn, user }) => {
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AuthenticateNavigation user={user} />
      ) : (
        <AppAuthenticate />
      )}
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authenticationReducer.isLoggedIn,
    user: state.authenticationReducer.user,
  };
};

export default connect(mapStateToProps)(AppNavigation);
