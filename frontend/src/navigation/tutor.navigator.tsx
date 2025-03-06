import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense } from "react";
import Loading from "../screens/other/loading";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const TutorDashboard = lazy(() => import("../screens/@tutor/tutor.dashboard"));
const TutorBlog = lazy(() => import("../screens/@tutor/tutor.blog"));
const TutorClass = lazy(() => import("../screens/@tutor/tutor.class"));
const TutorDocument = lazy(() => import("../screens/@tutor/tutor.document"));
const TutorMeeting = lazy(() => import("../screens/@tutor/tutor.meeting"));
const TutorProfile = lazy(() => import("../screens/@tutor/tutor.profile"));

const ClassStack = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ presentation: "card", animation: "slide_from_right" }}>
      <Stack.Screen name="tutor_class" component={TutorClass} />
      <Stack.Screen name="tutor_blog" component={TutorBlog} />
      <Stack.Screen name="tutor_document" component={TutorDocument} />
      <Stack.Screen name="tutor_meeting" component={TutorMeeting} />
    </Stack.Navigator>
  );
};

const TutorNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="tutor_dashboard" component={TutorDashboard} />
      <Tab.Screen name="tutor_class" component={TutorClass} />
      <Tab.Screen name="tutor_profile" component={TutorProfile} />
    </Tab.Navigator>
  );
};

export default TutorNavigator;
