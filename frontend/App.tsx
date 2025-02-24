import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Home from "./src/screens/Blog/home";
import Detail from "./src/screens/Blog/detail";
import AppNavigation from "./src/navigation/app.navigation";

SplashScreen.preventAutoHideAsync();

export const App = () => {
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
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }




  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
};

