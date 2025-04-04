import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy, Suspense } from "react";
import Loading from "../components/loading";
import { useClassStore } from "../store/useClassStore";
import { useMessageStore } from "../store/useMessageStore";
import { BlogStack } from "./features.navigator";

const StudentDashboard = lazy(() => import("../screens/@student/student.dashboard"));
const StudentClass = lazy(() => import("../screens/@student/student.class"));
const StudentProfile = lazy(() => import("../screens/@student/student.profile"));

// Class feature screens
const ClassDetail = lazy(() => import("../screens/@student/class_features/class.detail"));
const StudentMessage = lazy(() => import("../screens/@student/class_features/message"));
const MessageDetail = lazy(() => import("../screens/@student/class_features/message.detail"));
const StudentMeeting = lazy(() => import("../screens/@student/class_features/meeting"));
const StudentDocument = lazy(() => import("../screens/@student/class_features/document"));

const ClassFeaturesTab = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          if (route.name === "student_class_detail") iconName = "book";
          if (route.name === "student_message") iconName = "message-circle";
          if (route.name === "student_meeting") iconName = "calendar";
          if (route.name === "student_document") iconName = "file";

          return <Feather name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: { backgroundColor: "#2D336B" },
        tabBarActiveTintColor: "#FFF2F2",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="student_class_detail"
        component={ClassDetail}
        options={{ title: "Class Detail" }}
      />
      <Tab.Screen
        name="student_message"
        component={StudentMessage}
        options={{ title: "Message" }}
      />
      <Tab.Screen
        name="student_meeting"
        component={StudentMeeting}
        options={{ title: "Meeting" }}
      />
      <Tab.Screen
        name="student_document"
        component={StudentDocument}
        options={{ title: "Document" }}
      />
    </Tab.Navigator>
  );
};

const HomeTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          if (route.name === "student_dashboard") iconName = "home";
          if (route.name === "student_class") iconName = "book";
          if (route.name === "student_profile") iconName = "user";
          if (route.name === "student_blog") iconName = "globe";

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2D336B",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="student_dashboard"
        component={StudentDashboard}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen name="student_class" component={StudentClass} options={{ title: "Class" }} />
      <Tab.Screen name="student_blog" component={BlogStack} options={{ headerShown: false }} />
      <Tab.Screen
        name="student_profile"
        component={StudentProfile}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const StudentNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { selectedClass } = useClassStore();
  const { selectedUser } = useMessageStore();

  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Stack.Screen
        name="student_home_stack"
        component={HomeTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="student_feature_stack"
        component={ClassFeaturesTab}
        options={{ title: selectedClass?.name || "Class Detail" }}
      />
      <Stack.Screen
        name="student_message_detail"
        component={MessageDetail}
        options={{ title: selectedUser?.username || "Messages" }}
      />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
