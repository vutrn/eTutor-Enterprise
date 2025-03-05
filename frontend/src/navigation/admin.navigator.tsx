import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense } from "react";
import Loading from "../screens/other/loading";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
      screenOptions={{}}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen options={{ headerShown: false }} name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Manage Class" component={AdminClass} />
      <Tab.Screen name="Classes" component={ViewClass} />
      <Tab.Screen
        name="admin_profile"
        options={{ tabBarLabel: "Profile" }}
        component={AdminProfile}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
