import Feather from "@expo/vector-icons/Feather";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy, Suspense } from "react";
import Loading from "../components/loading";
import { BlogStack } from "./features.navigator";

const AdminDashboard = lazy(() => import("../screens/@admin/dashboard/admin.dashboard"));
const TutorList = lazy(() => import("../screens/@admin/dashboard/tutor.list"));
const StudentList = lazy(() => import("../screens/@admin/dashboard/student.list"));
const AdminClass = lazy(() => import("../screens/@admin/class/admin.class"));
const AdminProfile = lazy(() => import("../screens/@admin/admin.profile"));

const DashboardStack = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ presentation: "card", animation: "slide_from_right" }}>
      <Stack.Screen name="admin_dashboard" component={AdminDashboard} />
      <Stack.Screen name="tutor_list" component={TutorList} />
      <Stack.Screen name="student_list" component={StudentList} />
    </Stack.Navigator>
  );
};

const HomeTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Dashboard") iconName = "home";
          if (route.name === "Manage Class") iconName = "book";
          if (route.name === "admin_blog") iconName = "globe";
          if (route.name === "admin_profile") iconName = "user";

          return <Feather name={iconName} size={24} color="black" />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} options={{ headerShown: false }} />
      <Tab.Screen name="Manage Class" component={AdminClass} />
      <Tab.Screen name="admin_blog" component={BlogStack} options={{ headerShown: false }} />
      <Tab.Screen
        name="admin_profile"
        component={AdminProfile}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const AdminNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Stack.Screen name="admin_home" component={HomeTab} options={{ headerShown: false }} />
      {/* <Stack.Screen name="view_class" component={ViewClass} options={{ title: "Class Detail" }} /> */}
    </Stack.Navigator>
  );
};

export default AdminNavigator;
