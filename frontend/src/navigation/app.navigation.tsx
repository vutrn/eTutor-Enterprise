import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeAdmin from "../screens/@admin/home.admin";
import HomeStudent from "../screens/@student/home.student";
import Login from "../screens/Auth/login";
import Signup from "../screens/Auth/signup";

const HomeLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
    >
      <Stack.Screen name="login" component={Login} options={{ title: "Login" }} />
      <Stack.Screen name="signup" component={Signup} options={{ title: "Sign Up" }} />

    
      {/* <Stack.Screen name="home_tutor" component={HomeTuTor} options={{ title: "Home Tutor" }} /> */}

      {/* <Stack.Screen
        name="home_student"
        component={HomeStudent}
        options={{ title: "Home Student" }}
      /> */}
    </Stack.Navigator>
  );
};

const AppNavigation = () => {
  const Tab = createBottomTabNavigator();
  {/* TODO: ROLE SCREEN */}
  return (
    <Tab.Navigator>
      <Tab.Screen name="login" component={HomeLayout} />
      {/* <Tab.Screen name="signup" component={Signup} /> */}

      <Tab.Screen name="home_admin" component={HomeAdmin} />
      <Tab.Screen name="home_student" component={HomeStudent} />
    </Tab.Navigator>
  );
};

export default AppNavigation;
