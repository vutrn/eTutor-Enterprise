import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy, Suspense } from "react";
import Loading from "../components/loading";
import { useRoute } from "@react-navigation/native";

const TutorDashboard = lazy(() => import("../screens/@tutor/tutor.dashboard"));
const TutorBlog = lazy(() => import("../screens/@tutor/tutor.blog"));
const TutorClass = lazy(() => import("../screens/@tutor/tutor.class"));
const TutorDocument = lazy(() => import("../screens/@tutor/class_features/tutor.document"));
const TutorMeeting = lazy(() => import("../screens/@tutor/class_features/tutor.meeting"));
const TutorMessage = lazy(() => import("../screens/@tutor/class_features/tutor.message"));
const TutorProfile = lazy(() => import("../screens/@tutor/tutor.profile"));
const ClassDetail = lazy(() => import("../screens/@tutor/class_features/tutor.class.detail"));
const MessageDetail = lazy(() => import("../screens/@tutor/class_features/message.detail"));

const ClassFeaturesTab = ({ route }: any) => {
  const Tab = createBottomTabNavigator();
  // const selectedClass = route.params?.params;
  // console.log("selectedClass", selectedClass);
  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          if (route.name === "tutor_class_detail") iconName = "book";
          if (route.name === "tutor_message") iconName = "message-circle";
          if (route.name === "tutor_meeting") iconName = "calendar";
          if (route.name === "tutor_document") iconName = "file";

          return <Feather name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: { backgroundColor: "#2D336B" },
        tabBarActiveTintColor: "#FFF2F2",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="tutor_class_detail"
        component={ClassDetail}
        options={{ title: "Class Detail" }}
      />
      <Tab.Screen
        name="tutor_message"
        component={TutorMessage}
        options={{ title: "Message" }}
      />
      <Tab.Screen
        name="tutor_meeting"
        component={TutorMeeting}
        options={{ title: "Meeting" }}
      />
      <Tab.Screen
        name="tutor_document"
        component={TutorDocument}
        options={{ title: "Document" }}
      />
    </Tab.Navigator>
  );
};

const TutorTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          if (route.name === "tutor_dashboard") iconName = "home";
          if (route.name === "tutor_class") iconName = "book";
          if (route.name === "tutor_profile") iconName = "user";
          if (route.name === "tutor_blog") iconName = "globe";

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2D336B",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="tutor_dashboard"
        component={TutorDashboard}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen name="tutor_class" component={TutorClass} options={{ title: "Class" }} />
      <Tab.Screen name="tutor_blog" component={TutorBlog} options={{ title: "Blog" }} />
      <Tab.Screen name="tutor_profile" component={TutorProfile} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
};

const TutorNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Stack.Screen name="tutor_class_stack" component={TutorTab} options={{ headerShown: false }} />
      <Stack.Screen
        name="tutor_feature_stack"
        component={ClassFeaturesTab}
        options={({ route }: any) => ({
          title: route.params?.params?.name || "Class Detail",
        })}
      />
      <Stack.Screen
        name="tutor_message_detail"
        component={MessageDetail}
        options={{ title: "Messages" }}
      />
    </Stack.Navigator>
  );
};

export default TutorNavigator;
