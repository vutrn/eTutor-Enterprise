import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { lazy, Suspense } from "react";
import Loading from "../components/loading";

const LandingScreen = lazy(() => import("../screens/auth/landing"));
const LoginScreen = lazy(() => import("../screens/auth/login"));
const SignUpScreen = lazy(() => import("../screens/auth/signup"));

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
      screenOptions={{ presentation: "card", animation: "slide_from_right", headerShown: false }}
      initialRouteName="landing"
    >
      <Stack.Screen name="landing" component={LandingScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
