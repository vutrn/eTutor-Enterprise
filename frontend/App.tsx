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
import React, { Suspense, useEffect } from "react";
import "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import AuthNavigation from "./src/navigation/auth.navigator";
import Loading from "./src/screens/other/loading";
import AdminNavigation from "./src/navigation/admin.navigator";
import TutorNavigation from "./src/navigation/tutor.navigator";
import StudentNavigation from "./src/navigation/student.navigator";
import { useAuthStore } from "./src/store/useAuthStore";
import AuthNavigator from "./src/navigation/auth.navigator";
import StudentNavigator from "./src/navigation/student.navigator";
import TutorNavigator from "./src/navigation/tutor.navigator";
import AdminNavigator from "./src/navigation/admin.navigator";
import { Text } from "react-native";

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

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Hide the splash screen
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (!authUser) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  switch (authUser.role) {
    case "student":
      return (
        <NavigationContainer>
          <StudentNavigator />
        </NavigationContainer>
      );
    case "tutor":
      return (
        <NavigationContainer>
          <TutorNavigator />
        </NavigationContainer>
      );
    case "admin":
      return (
        <NavigationContainer>
          <AdminNavigator />
        </NavigationContainer>
      );
    default:
      return <Text>Invalid role</Text>;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
          screenOptions={{
            presentation: "card",
            animation: "slide_from_right",
            headerShown: false,
          }}
        >
          <Stack.Screen name="auth" component={AuthNavigation} />
          <Stack.Screen name="admin_dashboard" component={AdminNavigation} />
          <Stack.Screen name="tutor_dashboard" component={TutorNavigation} />
          <Stack.Screen name="student_dashboard" component={StudentNavigation} />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
    </>
  );
};
