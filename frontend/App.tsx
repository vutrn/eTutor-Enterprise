import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, Text } from "react-native";
import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import AdminNavigator from "./src/navigation/admin.navigator";
import AuthNavigator from "./src/navigation/auth.navigator";
import StudentNavigator from "./src/navigation/student.navigator";
import TutorNavigator from "./src/navigation/tutor.navigator";
import { useAuthStore } from "./src/store/useAuthStore";
import { FONTS } from "./src/utils/constant";
import { FontDisplay } from "expo-font";

SplashScreen.preventAutoHideAsync();

export const App = () => {
  const { authUser, verifyToken, logout } = useAuthStore();
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

    const checkToken = async () => {
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        Toast.show({
          type: "error",
          text1: "Token is invalid, logging out...",
        });
        logout();
      }
    };
    checkToken();

    const tokenCheckInterval = setInterval(checkToken, 100000); // Check every minute
    return () => clearInterval(tokenCheckInterval);
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

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // background: '#A9B5DF',
      // primary: 'red',
      // text: 'yellow',
    },
  };

  return (
    <>
      <PaperProvider>
        <NavigationContainer theme={MyTheme}>{renderAppContent()}</NavigationContainer>
      </PaperProvider>
      <Toast />
    </>
  );
};
