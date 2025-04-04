import { Feather } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Suspense } from "react";
import Loading from "../components/loading";
import StudentClassDetail from "../screens/@student/class_features/class.detail";
import StudentDocument from "../screens/@student/class_features/document";
import StudentMeeting from "../screens/@student/class_features/meeting";
import { useClassStore } from "../store/useClassStore";
import { StudentMessageStack } from "./features.navigator";

const ClassFeaturesDrawer = () => {
  const Drawer = createDrawerNavigator<RootStackParamList>();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: "#2D336B",
        drawerInactiveTintColor: "#555",
        headerShown: false,
        drawerType: "permanent",
      }}
    >
      <Drawer.Screen
        name="student_class_detail"
        component={StudentClassDetail}
        options={{
          title: "Class Detail",
          drawerIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="student_message_stack"
        component={StudentMessageStack}
        options={{
          title: "Messages",
          drawerIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="student_meeting"
        component={StudentMeeting}
        options={{
          title: "Meeting",
          drawerIcon: ({ color, size }) => (
            <Feather name="video" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="student_document"
        component={StudentDocument}
        options={{
          title: "Documents",
          drawerIcon: ({ color, size }) => (
            <Feather name="file" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// const HomeTab = () => {
//   const Tab = createBottomTabNavigator();

//   return (
//     <Tab.Navigator
//       screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName: any = "home";

//           if (route.name === "student_dashboard") iconName = "home";
//           if (route.name === "student_class") iconName = "book";
//           if (route.name === "student_profile") iconName = "user";
//           if (route.name === "student_blog") iconName = "globe";

//           return <Feather name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#2D336B",
//         tabBarInactiveTintColor: "gray",
//       })}
//     >
//       <Tab.Screen
//         name="student_dashboard"
//         component={StudentDashboard}
//         options={{ title: "Dashboard" }}
//       />
//       <Tab.Screen name="student_class" component={StudentClass} options={{ title: "Class" }} />
//       <Tab.Screen name="student_blog" component={BlogStack} options={{ headerShown: false }} />
//       <Tab.Screen
//         name="student_profile"
//         component={StudentProfile}
//         options={{ title: "Profile" }}
//       />
//     </Tab.Navigator>
//   );
// };

const StudentNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { selectedClass } = useClassStore();

  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
      screenLayout={({ children }) => (
        <Suspense fallback={<Loading />}>{children}</Suspense>
      )}
    >
      <Stack.Screen
        name="student_feature_drawer"
        component={ClassFeaturesDrawer}
        options={{ title: selectedClass?.name || "Class Detail" }}
      />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
