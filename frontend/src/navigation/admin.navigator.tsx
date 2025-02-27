import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense, useEffect } from "react";
import Loading from "../screens/other/loading";
import { useAuthStore } from "../store/useAuthStore";

const AdminDashboard = lazy(() => import("../screens/@admin/admin.dashboard"));
const CreateClass = lazy(() => import("../screens/@admin/create.class"));
const ViewClass = lazy(() => import("../screens/@admin/view.class"));
const AdminProfile = lazy(() => import("../screens/@admin/admin.profile"));

const AdminNavigator = () => {
  const { logout, verifyToken } = useAuthStore();
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    const checkToken = async () => {
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        console.log("Token is invalid, logging out...");
        logout();
      }
    };
    checkToken();
    
    const tokenCheckInterval = setInterval(checkToken, 60000); // Check every minute
    return () => clearInterval(tokenCheckInterval);
  }, [logout]);

  return (
    <Tab.Navigator
      screenOptions={{}}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="admin_dashboard" component={AdminDashboard} />
      <Tab.Screen name="create_class" component={CreateClass} />
      <Tab.Screen name="view_class" component={ViewClass} />
      <Tab.Screen
        name="admin_profile"
        options={{ tabBarLabel: "Profile" }}
        component={AdminProfile}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
