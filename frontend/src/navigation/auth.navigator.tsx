import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { lazy, Suspense } from "react";
import Loading from "../screens/other/loading";

const LoginScreen = lazy(() => import('../screens/Auth/login'));
const SignUpScreen = lazy(() => import('../screens/Auth/signup'));

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
      screenOptions={{ presentation: "card", animation: "slide_from_right", headerShown: false }}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
