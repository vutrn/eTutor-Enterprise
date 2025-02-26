import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense } from "react";
import CreateClass from "../screens/@admin/create.class";
import HomeAdmin from "../screens/@admin/admin.dashboard";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Auth/login";
import SignUpScreen from "../screens/Auth/signup";
import Loading from "../screens/other/loading";

const AdminDashboard = lazy(() => import('../screens/@admin/admin.dashboard'));
const AdminProfile = lazy(() => import('../screens/@admin/admin.profile'));

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right", headerShown: false }}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{}}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="admin_dashboard" component={AdminDashboard} />
      {/* <Tab.Screen name="create_class" component={AuthNavigator} /> */}
      <Tab.Screen name="create_class1" component={CreateClass} />
      <Tab.Screen name="create_class2" component={CreateClass} />
      <Tab.Screen
        name="admin_profile"
        options={{ tabBarLabel: "Profile" }}
        component={AdminProfile}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
