import { Feather } from "@expo/vector-icons";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Dimensions } from "react-native";
import CustomDrawerContent from "../components/CustomDrawerContent";
import AdminClass from "../screens/@admin/class/admin.class";
import StudentClass from "../screens/@student/student.class";
import StudentDashboard from "../screens/@student/student.dashboard";
import TutorClass from "../screens/@tutor/tutor.class";
import TutorDashboard from "../screens/@tutor/tutor.dashboard";
import { useAuthStore } from "../store/useAuthStore";
import { BlogStack } from "./features.navigator";
import UserList from "../screens/@admin/user.list";
import AdminDashboard from "../screens/@admin/admin.dashboard";

const Drawer = createDrawerNavigator();

const DRAWER_WIDTH = isWeb ? 280 : Dimensions.get("window").width * 0.75;

const DrawerNavigator = () => {
  const { authUser } = useAuthStore();

  const renderAdminItems = () => (
    <>
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={({ navigation }) => ({
          title: "Admin Dashboard",
          drawerIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        })}
      />
      <Drawer.Screen
        name="AdminClass"
        component={AdminClass}
        options={({ navigation }) => ({
          title: "Manage Classes",
          drawerIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        })}
      />
      <Drawer.Screen
        name="UserList"
        component={UserList}
        options={({ navigation }) => ({
          title: "Users management",
          drawerIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        })}
      />
      <Drawer.Screen
        name="AdminBlog"
        component={BlogStack}
        options={({ navigation }) => ({
          title: "Blog",
          drawerIcon: ({ color, size }) => (
            <Feather name="globe" size={size} color={color} />
          ),
        })}
      />
    </>
  );

  const renderTutorItems = () => (
    <>
      <Drawer.Screen
        name="tutor_dashboard"
        component={TutorDashboard}
        options={{
          title: "Tutor Dashboard",
          // headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="tutor_class"
        component={TutorClass}
        options={{
          title: "Tutor Class",
          drawerIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="tutor_blog"
        component={BlogStack}
        options={{
          title: "Tutor Blog",
          drawerIcon: ({ color, size }) => (
            <Feather name="globe" size={size} color={color} />
          ),
        }}
      />
    </>
  );

  // Render student navigation items
  const renderStudentItems = () => (
    <>
      <Drawer.Screen
        name="StudentHome"
        component={StudentDashboard}
        options={({ navigation }) => ({
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        })}
      />
      <Drawer.Screen
        name="StudentClass"
        component={StudentClass}
        options={({ navigation }) => ({
          title: "My Classes",
          drawerIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        })}
      />
      <Drawer.Screen
        name="StudentBlog"
        component={BlogStack}
        options={({ navigation }) => ({
          title: "Blog",
          drawerIcon: ({ color, size }) => (
            <Feather name="globe" size={size} color={color} />
          ),
        })}
      />
    </>
  );

  // Render navigation based on user role
  const renderNavigationItems = () => {
    if (!authUser || !authUser.role) return null;

    if (authUser.role === "admin") return renderAdminItems();
    if (authUser.role === "tutor") return renderTutorItems();
    if (authUser.role === "student") return renderStudentItems();
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: "#FFFFFF",
        },
        drawerType: isWeb ? "permanent" : "front",
        headerShown: true,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "#2D336B",
        swipeEdgeWidth: 80,
        drawerActiveTintColor: "#2D336B",
        drawerInactiveTintColor: "#555",
        headerLeft: () => null,
      }}
    >
      {renderNavigationItems()}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
