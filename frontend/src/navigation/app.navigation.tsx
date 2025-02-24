import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Login from "../screens/Auth/login";
import Signup from "../screens/Auth/signup";

const HomeLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ presentation: "card", animation: "slide_from_right" }}>
      <Stack.Screen name="login" component={Login} options={{ title: "Login" }} />
      <Stack.Screen name="signup" component={Signup} options={{ title: "Sign Up" }} />
    </Stack.Navigator>
  );
};

const AppNavigation = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="home1" component={HomeLayout} options={{ title: "Home page" }} />
    </Drawer.Navigator>
  );
};

export default AppNavigation;
