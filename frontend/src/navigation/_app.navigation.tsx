import { useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import LoginScreen from "../screens/Auth/login";
import SignUpScreen from "../screens/Auth/signup";

const AppNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const route = useRoute();

  useEffect(() => {}, []);

  const isAuthScreen = route.name === "login" || route.name === "signup";

  return (
    <>
      <Stack.Navigator
        screenOptions={{ presentation: "card", animation: "slide_from_right", headerShown: false }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignUpScreen} />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigation;
