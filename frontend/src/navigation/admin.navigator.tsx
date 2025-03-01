import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense, useEffect } from "react";
import Loading from "../screens/other/loading";
import { useAuthStore } from "../store/useAuthStore";

const AdminDashboard = lazy(() => import("../screens/@admin/admin.dashboard"));
const AdminClass = lazy(() => import("../screens/@admin/admin.class"));
const ViewClass = lazy(() => import("../screens/@admin/view.class"));
const AdminProfile = lazy(() => import("../screens/@admin/admin.profile"));

const AdminNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{}}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
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
