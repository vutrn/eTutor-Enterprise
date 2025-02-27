import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Text } from "react-native";
import "react-native-gesture-handler";
import AdminNavigator from "./src/navigation/admin.navigator";
import AuthNavigator from "./src/navigation/auth.navigator";
import StudentNavigator from "./src/navigation/student.navigator";
import TutorNavigator from "./src/navigation/tutor.navigator";
import { useAuthStore } from "./src/store/useAuthStore";
import Toast from "react-native-toast-message";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export const App = () => {
  const { authUser } = useAuthStore();
  const [loaded, error] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Hide the splash screen
    }

    // const token = await AsyncStorage.getItem("access-token");
    // const decodedToken = jwt_decode(token);
    // if (decodedToken.exp * 1000 < Date.now()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Token expired",
    //     text2: "Please log in again",
    //   });
    //   set({ isTokenExpired: true });
    //   return;
    // }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const renderAppContent = () => {
    // If no user is authenticated, show auth navigator
    if (!authUser) {
      return <AuthNavigator />;
    }

    // Select navigator based on user role
    switch (authUser.role) {
      case "student":
        return <StudentNavigator />;
      case "tutor":
        return <TutorNavigator />;
      case "admin":
        return <AdminNavigator />;
      default:
        // Return a component outside NavigationContainer for invalid role
        return (
          <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>
            Invalid role: {authUser.role}
          </Text>
        );
    }
  };

  return (
    <>
      <NavigationContainer>{renderAppContent()}</NavigationContainer>
      <Toast />
    </>
  );
};
