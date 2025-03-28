import Feather from "@expo/vector-icons/Feather";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy, Suspense } from "react";
import Loading from "../components/loading";

const AdminDashboard = lazy(() => import("../screens/@admin/dashboard/admin.dashboard"));
const TutorList = lazy(() => import("../screens/@admin/dashboard/tutor.list"));
const StudentList = lazy(() => import("../screens/@admin/dashboard/student.list"));
const AdminClass = lazy(() => import("../screens/@admin/class/admin.class"));
const ViewClass = lazy(() => import("../screens/@admin/view.class"));
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

const AdminNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Manage Class") {
            iconName = focused ? "book" : "book";
          } else if (route.name === "admin_profile") {
            iconName = focused ? "user" : "user";
          }

          return <Feather name={iconName} size={24} color="black" />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen options={{ headerShown: false }} name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Manage Class" component={AdminClass} />
      <Tab.Screen
        name="admin_profile"
        options={{ tabBarLabel: "Profile" }}
        component={AdminProfile}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
