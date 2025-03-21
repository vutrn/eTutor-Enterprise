import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {  NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Text } from "react-native";
import "react-native-gesture-handler";
import { MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import AdminNavigator from "./src/navigation/admin.navigator";
import AuthNavigator from "./src/navigation/auth.navigator";
import StudentNavigator from "./src/navigation/student.navigator";
import TutorNavigator from "./src/navigation/tutor.navigator";
import { useAuthStore } from "./src/store/useAuthStore";

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
    if (!authUser) {
      return <AuthNavigator />;
    }

    switch (authUser.role) {
      case "student":
        return <StudentNavigator />;
      case "tutor":
        return <TutorNavigator />;
      case "admin":
        return <AdminNavigator />;
      default:
        return (
          <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>
            Invalid role: {authUser.role}
          </Text>
        );
    }
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // background: '#A9B5DF',
      // text: '#000',
      // primary: "#6200ee",
      // secondary: "#03dac4",
      // error: "#b00020",
      // background: "#f6f6f6",
    },
  };

  return (
    <>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {renderAppContent()}
        </NavigationContainer>
      </PaperProvider>
      <Toast />
    </>
  );
};
