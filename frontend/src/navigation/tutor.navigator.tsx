import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense } from "react";
import Loading from "../screens/other/loading";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const TutorDashboard = lazy(() => import("../screens/@tutor/tutor.dashboard"));
const TutorBlog = lazy(() => import("../screens/@tutor/class_features/tutor.blog"));
const TutorClass = lazy(() => import("../screens/@tutor/tutor.class"));
const TutorDocument = lazy(() => import("../screens/@tutor/class_features/tutor.document"));
const TutorMeeting = lazy(() => import("../screens/@tutor/class_features/tutor.meeting"));
const TutorMessage = lazy(() => import("../screens/@tutor/class_features/tutor.message"));
const TutorProfile = lazy(() => import("../screens/@tutor/tutor.profile"));

const ClassFeaturesTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="tutor_message" component={TutorMessage} />
      <Tab.Screen name="tutor_meeting" component={TutorMeeting} />
      <Tab.Screen name="tutor_document" component={TutorDocument} />
      <Tab.Screen name="tutor_blog" component={TutorBlog} />
    </Tab.Navigator>
  );
}

const ClassStack = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ presentation: "card", animation: "slide_from_right" }}>
      <Stack.Screen name="tutor_class" component={TutorClass} />
      <Stack.Screen 
        name="class_feature_tab" 
        component={ClassFeaturesTab} 
        options={{ headerShown: false }} 
      />
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
      <Tab.Screen name="tutor_class" component={ClassStack} options={{ headerShown: false }} />
      <Tab.Screen name="tutor_profile" component={TutorProfile} />
    </Tab.Navigator>
  );
};

export default TutorNavigator;
