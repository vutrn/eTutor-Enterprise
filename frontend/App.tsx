import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { enGB, registerTranslation } from "react-native-paper-dates";
import Toast from "react-native-toast-message";
import AdminNavigator from "./src/navigation/admin.navigator";
import AuthNavigator from "./src/navigation/auth.navigator";
import StudentNavigator from "./src/navigation/student.navigator";
import TutorNavigator from "./src/navigation/tutor.navigator";
import { useAuthStore } from "./src/store/useAuthStore";
import "flatpickr/dist/flatpickr.css";

SplashScreen.preventAutoHideAsync();

export const App = () => {
  const { authUser, verifyToken, logout, isTokenExpired } = useAuthStore();
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
      await verifyToken();
      if (isTokenExpired) {
        Toast.show({
          type: "error",
          text1: "Session expired",
        });
        console.error("Token is invalid");
        logout();
      }
    };
    checkToken();

    const tokenCheckInterval = setInterval(checkToken, 1000 * 60); // Check every minute
    return () => clearInterval(tokenCheckInterval);
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const renderAppContent = () => {
    if (!authUser || !authUser.role) {
      return <AuthNavigator />;
    }
    if (authUser.role === "admin") return <AdminNavigator />;
    if (authUser.role === "tutor") return <TutorNavigator />;
    if (authUser.role === "student") return <StudentNavigator />;
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#F9FAFB",
    },
  };

  registerTranslation("en", enGB);

  return (  
    <>
      {/* <PaperProvider theme={theme}> */}
        <NavigationContainer>
          <GluestackUIProvider>{renderAppContent()}</GluestackUIProvider>
        </NavigationContainer>
      {/* </PaperProvider> */}
      <Toast />
    </>
  );
};
